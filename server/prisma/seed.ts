import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Check if super admin exists
  const existingSuperAdmin = await prisma.adminUser.findFirst({
    where: { role: UserRole.SUPER_ADMIN },
  });

  if (!existingSuperAdmin) {
    // Create super admin if doesn't exist
    const hashedPassword = await bcrypt.hash("superadmin123", 10);

    await prisma.adminUser.create({
      data: {
        email: "superadmin@example.com",
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
      },
    });
 
    console.log("🚀 Super Admin created successfully!");
  }
}

main()
  .catch((e) => {
    console.error(e);
    // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
