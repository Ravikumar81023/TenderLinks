import { Decimal } from '@prisma/client/runtime/library';
import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const aboutSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export const AboutController = {
  getAboutInfo: async (_req: Request, res: Response): Promise<void> => {
    try {
      const [aboutInfo, socialMediaLinks, tenderStats] = await Promise.all([
        prisma.about.findFirst(),
        prisma.socialMedia.findMany(),
        prisma.tender.aggregate({
          _sum: {
            value: true,
          },
          _count: true,
        }),
      ]);

      if (!aboutInfo) {
        res.status(404).json({ error: "About information not found" });
        return;
      }

      // Calculate current tender statistics
      const currentStats = {
        totalTenderValue: tenderStats._sum.value || new Decimal(0),
        totalTenderCount: tenderStats._count,
      };

      // Update about info with current stats if they're different
      if (
        aboutInfo.totalTenderValue.toString() !==
          currentStats.totalTenderValue.toString() ||
        aboutInfo.totalTenderCount !== currentStats.totalTenderCount
      ) {
        await prisma.about.update({
          where: { id: aboutInfo.id },
          data: currentStats,
        });
      }

      res.json({
        ...aboutInfo,
        ...currentStats,
        socialMediaLinks,
        totalTenderValue: currentStats.totalTenderValue.toString(),
      });
    } catch (error) {
      console.error("Error fetching about info:", error);
      res.status(500).json({ error: "Failed to fetch about information" });
    }
  },
  createAboutInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const { content } = aboutSchema.parse(req.body);

      const existingAbout = await prisma.about.findFirst();
      if (existingAbout) {
        res.status(400).json({
          error: "About information already exists. Use update method instead.",
        });
        return;
      }

      // Calculate initial tender stats
      const [totalTenderValue, totalTenderCount] = await Promise.all([
        prisma.tender.aggregate({
          _sum: { value: true },
        }),
        prisma.tender.count(),
      ]);

      const newAboutInfo = await prisma.about.create({
        data: {
          content,
          totalTenderValue:
            totalTenderValue._sum.value || new Decimal(0),
          totalTenderCount,
        },
      });

      res.status(201).json({
        ...newAboutInfo,
        totalTenderValue: newAboutInfo.totalTenderValue.toString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      console.error("Error creating about info:", error);
      res.status(500).json({ error: "Failed to create about information" });
    }
  },

  updateAboutInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const { content } = aboutSchema.parse(req.body);

      const aboutInfo = await prisma.about.findFirst();
      if (!aboutInfo) {
        res.status(404).json({
          error: "About information not found. Use create method first.",
        });
        return;
      }

      const updated = await prisma.about.update({
        where: { id: aboutInfo.id },
        data: { content },
      });

      res.json({
        ...updated,
        totalTenderValue: updated.totalTenderValue.toString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      console.error("Error updating about info:", error);
      res.status(500).json({ error: "Failed to update about information" });
    }
  },

  updateTenderStats: async (_req: Request, res: Response): Promise<void> => {
    try {
      const aboutInfo = await prisma.about.findFirst();
      if (!aboutInfo) {
        res.status(404).json({ error: "About information not found" });
        return;
      }

      // Calculate current tender statistics
      const tenderStats = await prisma.tender.aggregate({
        _sum: {
          value: true,
        },
        _count: true,
      });

      const updated = await prisma.about.update({
        where: { id: aboutInfo.id },
        data: {
          totalTenderValue: tenderStats._sum.value || new Decimal(0),
          totalTenderCount: tenderStats._count,
        },
      });

      res.json({
        ...updated,
        totalTenderValue: updated.totalTenderValue.toString(),
      });
    } catch (error) {
      console.error("Error updating tender stats:", error);
      res.status(500).json({ error: "Failed to update tender statistics" });
    }
  },
  // Utility function to update tender stats automatically
  // This should be called after tender creation/update/deletion
  recalculateTenderStats: async (): Promise<void> => {
    try {
      const [totalTenderValue, totalTenderCount, aboutInfo] = await Promise.all(
        [
          prisma.tender.aggregate({
            _sum: { value: true },
          }),
          prisma.tender.count(),
          prisma.about.findFirst(),
        ],
      );

      if (!aboutInfo) return;

      await prisma.about.update({
        where: { id: aboutInfo.id },
        data: {
          totalTenderValue:
            totalTenderValue._sum.value || new Decimal(0),
          totalTenderCount,
        },
      });
    } catch (error) {
      console.error("Error recalculating tender stats:", error);
    }
  },
};
