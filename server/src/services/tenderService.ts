import { PrismaClient, Tender } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { AboutController } from "../controllers/aboutController";
const prisma = new PrismaClient();

export class TenderService {
  async createTender(
    data: Omit<Tender, "id" | "createdAt"> & {
      documents: { name: string; path: string; type: string }[];
    },
  ): Promise<Tender> {
    const { documents, ...tenderData } = data;
    
    // Validate expiry date is in the future
    if (new Date(data.expiryDate) <= new Date()) {
      throw new Error("Expiry date must be in the future");
    }

    // Generate meaningful TenderID if it's empty or a placeholder
    let tenderID = data.tenderID;
    if (!tenderID || tenderID === "auto") {
      // Get the count of existing tenders to generate a sequential number
      const tenderCount = await prisma.tender.count();
      // Format: TL-YYYYMMDD-XXXX where XXXX is a sequential number
      const date = new Date();
      const dateStr = date.getFullYear().toString() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0');
      tenderID = `TL-${dateStr}-${(tenderCount + 1).toString().padStart(4, '0')}`;
    }

    await AboutController.recalculateTenderStats();
    return prisma.tender.create({
      data: {
        ...tenderData,
        tenderID,
        documents: {
          create: documents,
        },
      },
      include: {
        sector: true,
        location: true,
        documents: true,
      },
    });
  }

  async getTenders(filters?: {
    sectorId?: number;
    locationId?: number;
    userId?: number;
    tenderingAuthority?: string;
    biddingType?: string;
    competitionType?: string;
    publishDateStart?: Date;
    publishDateEnd?: Date;
    lastDateOfSubmissionStart?: Date;
    lastDateOfSubmissionEnd?: Date;
  }): Promise<Tender[]> {
    const {
      publishDateStart,
      publishDateEnd,
      lastDateOfSubmissionStart,
      lastDateOfSubmissionEnd,
      ...otherFilters
    } = filters || {};

    return prisma.tender.findMany({
      where: {
        ...otherFilters,
        publishDate: {
          gte: publishDateStart,
          lte: publishDateEnd,
        },
        lastDateOfSubmission: {
          gte: lastDateOfSubmissionStart,
          lte: lastDateOfSubmissionEnd,
        },
      },
      include: {
        sector: true,
        location: true,
        documents: true,
      },
    });
  }

  async getTenderById(id: number): Promise<Tender | null> {
    return prisma.tender.findUnique({
      where: { id },
      include: {
        sector: true,
        location: true,
        documents: true,
      },
    });
  }

  async updateTender(
    id: number,
    data: Partial<Omit<Tender, "id" | "createdAt">> & {
      documents?: { name: string; path: string; type: string }[];
    },
  ): Promise<Tender> {
    const { documents, ...tenderData } = data;
    
    // If updating expiryDate, ensure it's in the future
    if (data.expiryDate && new Date(data.expiryDate) <= new Date()) {
      throw new Error("Expiry date must be in the future");
    }

    // If new documents are provided, delete old ones first
    if (documents) {
      const existingTender = await prisma.tender.findUnique({
        where: { id },
        include: { documents: true },
      });

      if (existingTender?.documents) {
        // Delete physical files
        await Promise.all(
          existingTender.documents.map(async (doc) => {
            try {
              await fs.unlink(path.join(process.cwd(), doc.path));
            } catch (error) {
              console.error(`Failed to delete file: ${doc.path}`);
            }
          }),
        );
      }
    }

    return prisma.tender.update({
      where: { id },
      data: {
        ...tenderData,
        documents: documents
          ? {
              deleteMany: {},
              create: documents,
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

  async deleteTender(id: number): Promise<Tender> {
    const tender = await prisma.tender.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (tender?.documents) {
      // Delete physical files
      await Promise.all(
        tender.documents.map(async (doc) => {
          try {
            await fs.unlink(path.join(process.cwd(), doc.path));
          } catch (error) {
            console.error(`Failed to delete file: ${doc.path}`);
          }
        }),
      );
    }

    return prisma.tender.delete({
      where: { id },
    });
  }
}
