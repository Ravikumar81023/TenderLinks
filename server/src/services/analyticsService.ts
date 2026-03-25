import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AnalyticsService {
  async recordLogin(userId: number, ipAddress: string, location: string) {
    return prisma.analytics.create({
      data: {
        userId,
        ipAddress,
        loginTime: new Date(),
        location,
      },
    });
  }

  async recordLogout(id: number) {
    return prisma.analytics.update({
      where: { id },
      data: {
        logoutTime: new Date(),
      },
    });
  }

  async updatePageViews(id: number, pageViews: number) {
    return prisma.analytics.update({
      where: { id },
      data: {
        pageViews: { increment: pageViews },
      },
    });
  }

  async updateTimeSpent(id: number, timeSpent: number) {
    return prisma.analytics.update({
      where: { id },
      data: {
        timeSpent: { increment: timeSpent },
      },
    });
  }

  async getAnalytics(filters: {
    startDate?: Date;
    endDate?: Date;
    location?: string;
    userId?: number;
  }) {
    return prisma.analytics.findMany({
      where: {
        createdAt: {
          gte: filters.startDate,
          lte: filters.endDate,
        },
        location: filters.location,
        userId: filters.userId,
      },
      include: {
        user: true,
      },
    });
  }
}
