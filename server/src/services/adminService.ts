import { PrismaClient, AdminUser, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AdminCreateInput } from "../types/user";

const prisma = new PrismaClient();

type AllowedRoles = Extract<
  UserRole,
  "CUSTOMER" | "CONTENT_ADMIN" | "PROJECT_ADMIN"
>;

export class AdminService {
  async createAdmin(
    creatorId: number,
    data: AdminCreateInput,
  ): Promise<AdminUser> {
    const creator = await prisma.adminUser.findUnique({
      where: { id: creatorId },
      include: { adminedUsers: true },
    });

    if (!creator) {
      throw new Error("Creator admin not found");
    }

    // SUPER_ADMIN can create any type of user
    if (creator.role === UserRole.SUPER_ADMIN) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return prisma.adminUser.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: data.role,
          adminedByUserId: creatorId,
        },
        include: {
          adminedUsers: true,
          adminedBy: true,
        },
      });
    }

    // Other role restrictions remain the same
    switch (creator.role) {
      case UserRole.ADMIN:
        if (
          ![
            UserRole.CUSTOMER,
            UserRole.CONTENT_ADMIN,
            UserRole.PROJECT_ADMIN,
          ].includes(data.role as AllowedRoles)
        ) {
          throw new Error(
            "ADMIN can only create CUSTOMER, CONTENT_ADMIN, or PROJECT_ADMIN users",
          );
        }
        break;
      case UserRole.CONTENT_ADMIN:
      case UserRole.PROJECT_ADMIN:
        if (data.role !== UserRole.CUSTOMER) {
          throw new Error(`${creator.role} can only create CUSTOMER users`);
        }
        break;
      default:
        throw new Error("Insufficient permissions to create users");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.adminUser.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
        adminedByUserId: creatorId,
      },
      include: {
        adminedUsers: true,
        adminedBy: true,
      },
    });
  }

  async getAdmins(requesterId: number): Promise<AdminUser[]> {
    const requester = await prisma.adminUser.findUnique({
      where: { id: requesterId },
    });

    if (!requester) {
      throw new Error("Requester not found");
    }

    switch (requester.role) {
      case UserRole.SUPER_ADMIN:
        // Can see all admins
        return prisma.adminUser.findMany({
          include: {
            adminedUsers: true,
            adminedBy: true,
          },
        });
      case UserRole.ADMIN:
        // Can see self, created users, and their sub-users
        return prisma.adminUser.findMany({
          where: {
            OR: [
              { adminedByUserId: requesterId },
              { id: requesterId },
              { adminedBy: { adminedByUserId: requesterId } },
            ],
          },
          include: {
            adminedUsers: true,
            adminedBy: true,
          },
        });
      default:
        // Other roles can only see themselves and their created users
        return prisma.adminUser.findMany({
          where: {
            OR: [{ adminedByUserId: requesterId }, { id: requesterId }],
          },
          include: {
            adminedUsers: true,
            adminedBy: true,
          },
        });
    }
  }

  async getAdminById(
    requesterId: number,
    adminId: number,
  ): Promise<AdminUser | null> {
    const requester = await prisma.adminUser.findUnique({
      where: { id: requesterId },
    });

    if (!requester) {
      throw new Error("Requester not found");
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId },
      include: {
        adminedUsers: true,
        adminedBy: true,
      },
    });

    if (!admin) {
      return null;
    }

    // Check if requester has permission to view this admin
    if (
      requester.role !== UserRole.SUPER_ADMIN &&
      admin.adminedByUserId !== requesterId &&
      admin.id !== requesterId
    ) {
      throw new Error("Insufficient permissions to view this admin");
    }

    return admin;
  }

  async updateAdmin(
    requesterId: number,
    adminId: number,
    data: Partial<AdminCreateInput>,
  ): Promise<AdminUser> {
    const [requester, targetAdmin] = await Promise.all([
      prisma.adminUser.findUnique({ where: { id: requesterId } }),
      prisma.adminUser.findUnique({ where: { id: adminId } }),
    ]);

    if (!requester || !targetAdmin) {
      throw new Error("Admin not found");
    }

    // Permission checks
    if (requester.role !== UserRole.SUPER_ADMIN) {
      if (targetAdmin.adminedByUserId !== requesterId) {
        throw new Error("Insufficient permissions to update this admin");
      }

      // Non-SUPER_ADMIN cannot change roles
      if (data.role && data.role !== targetAdmin.role) {
        throw new Error("Only SUPER_ADMIN can change admin roles");
      }
    }

    const updateData: Partial<AdminCreateInput> = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.adminUser.update({
      where: { id: adminId },
      data: updateData,
      include: {
        adminedUsers: true,
        adminedBy: true,
      },
    });
  }

  async deleteAdmin(requesterId: number, adminId: number): Promise<AdminUser> {
    const [requester, targetAdmin] = await Promise.all([
      prisma.adminUser.findUnique({
        where: { id: requesterId },
        include: { adminedUsers: true },
      }),
      prisma.adminUser.findUnique({
        where: { id: adminId },
        include: { adminedUsers: true },
      }),
    ]);

    if (!requester || !targetAdmin) {
      throw new Error("Admin not found");
    }

    // Permission checks
    if (requester.role !== UserRole.SUPER_ADMIN) {
      if (targetAdmin.adminedByUserId !== requesterId) {
        throw new Error("Insufficient permissions to delete this admin");
      }

      if (targetAdmin.adminedUsers.length > 0) {
        throw new Error("Cannot delete admin with existing sub-users");
      }
    }

    return prisma.adminUser.delete({
      where: { id: adminId },
      include: {
        adminedUsers: true,
        adminedBy: true,
      },
    });
  }
}
