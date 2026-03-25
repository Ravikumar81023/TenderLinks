import { Request, Response } from "express";
import { PrismaClient, SubscriptionTier } from "@prisma/client";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class DashboardController {
  async getOverviewStats(req: Request, res: Response) {
    try {
      const totalUsers = await prisma.customerUser.count();
      const totalTenders = await prisma.tender.count();
      const totalDocuments = await prisma.document.count();
      const totalBlogs = await prisma.blog.count();
      const totalServices = await prisma.service.count();

      const totalTenderValue = await prisma.tender.aggregate({
        _sum: {
          value: true,
        },
      });

      res.json({
        totalUsers,
        totalTenders,
        totalDocuments,
        totalBlogs,
        totalServices,
        totalTenderValue: totalTenderValue._sum.value,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch overview stats" });
    }
  }

  async getUserStats(req: Request, res: Response) {
    try {
      const userStats = await prisma.customerUser.groupBy({
        by: ["subscriptionTier"],
        _count: {
          _all: true,
        },
      });

      const activeUsers = await prisma.customerUser.count({
        where: {
          lastLoginTime: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      });

      const averageAnnualTurnover = await prisma.customerUser.aggregate({
        _avg: {
          annualTurnover: true,
        },
      });

      const topSectors = await prisma.sector.findMany({
        take: 5,
        include: {
          _count: {
            select: { users: true },
          },
        },
        orderBy: {
          users: {
            _count: "desc",
          },
        },
      });

      res.json({
        userStats,
        activeUsers,
        averageAnnualTurnover: averageAnnualTurnover._avg.annualTurnover,
        topSectors,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  }

  async getTenderStats(req: Request, res: Response) {
    try {
      const tenderStats = await prisma.tender.groupBy({
        by: ["sectorId"],
        _count: {
          _all: true,
        },
        _sum: {
          value: true,
        },
      });

      const upcomingTenders = await prisma.tender.count({
        where: {
          expiryDate: {
            gte: new Date(),
          },
        },
      });

      const averageTenderValue = await prisma.tender.aggregate({
        _avg: {
          value: true,
        },
      });

      const topLocations = await prisma.location.findMany({
        take: 5,
        include: {
          _count: {
            select: { tenders: true },
          },
        },
        orderBy: {
          tenders: {
            _count: "desc",
          },
        },
      });

      res.json({
        tenderStats,
        upcomingTenders,
        averageTenderValue: averageTenderValue._avg.value,
        topLocations,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tender stats" });
    }
  }

  async getAnalyticsStats(req: Request, res: Response) {
    try {
      // Get total logins
      const totalLogins = await prisma.analytics.count();

      // Get average time spent
      const averageTimeSpent = await prisma.analytics.aggregate({
        _avg: {
          timeSpent: true,
        },
      });

      // Get top locations with correct typing
      const topLocations = await prisma.analytics.groupBy({
        by: ["location"],
        _count: true,
        orderBy: [
          {
            location: "desc",
          },
        ],
        take: 5,
        where: {
          location: {
            not: null,
          },
        },
      });

      // Get user engagement with proper typing
      const userEngagement = await prisma.customerUser.findMany({
        take: 10,
        include: {
          _count: {
            select: {
              analytics: true,
            },
          },
          analytics: {
            take: 1,
            orderBy: {
              loginTime: "desc",
            },
          },
        },
        orderBy: [
          {
            analytics: {
              _count: "desc",
            },
          },
        ],
      });

      res.json({
        totalLogins,
        averageTimeSpent: averageTimeSpent._avg.timeSpent,
        topLocations: topLocations.map((location) => ({
          location: location.location,
          count: Number(location._count), // Convert to number explicitly
        })),
        userEngagement: userEngagement.map((user) => ({
          id: user.id,
          email: user.email,
          companyName: user.companyName,
          analyticsCount: user._count.analytics,
          lastLogin: user.analytics[0]?.loginTime,
        })),
      });
    } catch (error) {
      console.error("Analytics stats error:", error);
      res.status(500).json({ error: "Failed to fetch analytics stats" });
    }
  }
  async getDocumentStats(req: Request, res: Response) {
    try {
      const documentStats = await prisma.document.groupBy({
        by: ["type"],
        _count: {
          _all: true,
        },
      });

      const recentDocuments = await prisma.document.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          tender: true,
        },
      });

      res.json({
        documentStats,
        recentDocuments,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document stats" });
    }
  }

  async getBlogStats(req: Request, res: Response) {
    try {
      const blogStats = await prisma.blog.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      });

      const recentBlogs = await prisma.blog.findMany({
        take: 5,
        orderBy: {
          uploadDate: "desc",
        },
      });

      res.json({
        blogStats,
        recentBlogs,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog stats" });
    }
  }

  async getServiceStats(req: Request, res: Response) {
    try {
      const totalServices = await prisma.service.count();

      const servicesWithMedia = await prisma.service.count({
        where: {
          OR: [{ image: { not: null } }, { video: { not: null } }],
        },
      });

      res.json({
        totalServices,
        servicesWithMedia,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service stats" });
    }
  }
}
