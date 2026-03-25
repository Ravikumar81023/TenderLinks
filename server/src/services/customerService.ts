import {
  PrismaClient,
  CustomerUser,
  SubscriptionTier,
  Document,
  Analytics,
  Prisma,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { CustomerCreateInput } from "../types/user";

const prisma = new PrismaClient();

export class CustomerService {
  async createCustomer(data: CustomerCreateInput): Promise<CustomerUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // Ensure subscriptionValidity is set and is in the future
    if (
      !data.subscriptionValidity ||
      new Date(data.subscriptionValidity) <= new Date()
    ) {
      throw new Error("Subscription validity must be set and be in the future");
    }
    return prisma.customerUser.create({
      data: {
        ...data,
        password: hashedPassword,
        documents: {
          create: data.documents,
        },
      },
      include: {
        sector: true,
        location: true,
        documents: true,
      },
    });
  }

  async getCustomers(filters?: {
    sectorId?: number;
    locationId?: number;
  }): Promise<CustomerUser[]> {
    return prisma.customerUser.findMany({
      where: filters,
      include: {
        sector: true,
        location: true,
        documents: true,
      },
    });
  }

  async getCustomerById(id: number): Promise<CustomerUser | null> {
    return prisma.customerUser.findUnique({
      where: { id },
      include: {
        sector: true,
        location: true,
        documents: true,
        customerNotes: true,
      },
    });
  }

  async updateCustomer(
    id: number,
    data: Partial<CustomerCreateInput>,
  ): Promise<CustomerUser> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    // If updating subscriptionValidity, ensure it's in the future
    if (
      data.subscriptionValidity &&
      new Date(data.subscriptionValidity) <= new Date()
    ) {
      throw new Error("Subscription validity must be in the future");
    }
    return prisma.customerUser.update({
      where: { id },
      data: {
        ...data,
        documents: data.documents
          ? {
              deleteMany: {},
              create: data.documents,
            }
          : undefined,
      },
      include: {
        sector: true,
        location: true,
        documents: true,
      },
    });
  }

  async updateSubscriptionTier(
    id: number,
    tier: SubscriptionTier,
  ): Promise<CustomerUser> {
    return prisma.customerUser.update({
      where: { id },
      data: { subscriptionTier: tier },
    });
  }

  async deleteCustomer(id: number): Promise<CustomerUser> {
    try {
      await prisma.$transaction([
        prisma.customerNote.deleteMany({
          where: { userId: id },
        }),
        prisma.document.deleteMany({
          where: { userId: id },
        }),
        prisma.analytics.deleteMany({
          where: { userId: id },
        }),
        prisma.complaint.deleteMany({
          where: { customerUserId: id },
        }),
        prisma.customerUser.delete({
          where: { id },
        }),
      ]);

      // Since we're deleting the customer, we don't need to find it afterwards
      return null as any; // Type coercion since the function expects a return type
    } catch (error) {
      throw error;
    }
  }
  async addCustomerNote(customerId: number, content: string) {
    return prisma.customerNote.create({
      data: {
        content,
        userId: customerId,
      },
    });
  }

  async addDocumentToCustomer(
    customerId: number,
    document: { name: string; path: string; type: string },
  ): Promise<Document> {
    return prisma.document.create({
      data: {
        ...document,
        user: { connect: { id: customerId } },
      },
    });
  }

  async getCustomerDocuments(customerId: number): Promise<Document[]> {
    return prisma.document.findMany({
      where: { userId: customerId },
    });
  }

  async updateCustomerActivity(id: number, ipAddress: string) {
    return prisma.customerUser.update({
      where: { id },
      data: {
        lastLoginTime: new Date(),
        mostUsedIpAddress: ipAddress,
      },
    });
  }

  async getCustomerOverview(filters: {
    startDate?: Date;
    endDate?: Date;
    location?: string;
    sector?: string;
  }) {
    return prisma.customerUser.findMany({
      where: {
        createdAt: {
          gte: filters.startDate,
          lte: filters.endDate,
        },
        location: {
          city: filters.location,
        },
        sector: {
          name: filters.sector,
        },
      },
      include: {
        sector: true,
        location: true,
        analytics: true,
      },
    });
  }
  async updateCustomerInfo(
    id: number,
    data: Prisma.CustomerUserUpdateInput,
  ): Promise<CustomerUser> {
    return prisma.customerUser.update({
      where: { id },
      data,
    });
  }
  async terminateCustomerService(id: number, password: string) {
    const customer = await prisma.customerUser.findUnique({ where: { id } });
    if (!customer) {
      throw new Error("Customer not found");
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return prisma.customerUser.delete({ where: { id } });
  }

  async recordAnalytics(data: {
    userId: number;
    ipAddress: string;
    loginTime: Date;
    logoutTime?: Date;
    pageViews?: number;
    timeSpent?: number;
    location?: string;
  }): Promise<Analytics> {
    return prisma.analytics.create({
      data,
    });
  }

  async updateAnalytics(
    id: number,
    data: Partial<Analytics>,
  ): Promise<Analytics> {
    return prisma.analytics.update({
      where: { id },
      data,
    });
  }

  async getCustomerAnalytics(
    userId: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Analytics[]> {
    return prisma.analytics.findMany({
      where: {
        userId,
        loginTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        loginTime: "desc",
      },
    });
  }
}
