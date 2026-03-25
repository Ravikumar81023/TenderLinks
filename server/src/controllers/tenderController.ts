import { Request, Response } from "express";
import { TenderService } from "../services/tenderService";
import {
  validateTenderCreate,
  validateTenderUpdate,
} from "../utils/validation";
import { Prisma } from "@prisma/client";

const tenderService = new TenderService();

export class TenderController {
  async createTender(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateTenderCreate(req.body);
      const files = req.files as Express.Multer.File[];

      // Calculate lastDateOfSubmission if not provided
      let lastDateOfSubmission = validatedData.lastDateOfSubmission;
      if (!lastDateOfSubmission) {
        // Set lastDateOfSubmission to 9 days after publishDate by default
        lastDateOfSubmission = new Date(validatedData.publishDate);
        lastDateOfSubmission.setDate(lastDateOfSubmission.getDate() + 9);
      }

      // Calculate expiry date
      let expiryDate: Date;
      if (validatedData.expiryDate) {
        expiryDate = validatedData.expiryDate;
      } else {
        // Set expiry date to 1 day after last date of submission
        expiryDate = new Date(lastDateOfSubmission);
        expiryDate.setDate(expiryDate.getDate() + 1);
      }

      const createData = {
        ...validatedData,
        lastDateOfSubmission, // Now this is always defined
        expiryDate,
        value: validatedData.value
          ? new Prisma.Decimal(validatedData.value)
          : new Prisma.Decimal(0),
        emd: validatedData.emd ? new Prisma.Decimal(validatedData.emd) : null,
        documentFees: validatedData.documentFees || null,
        tenderBrief: validatedData.tenderBrief || "",
        tenderNo: validatedData.tenderNo || "",
        biddingType: validatedData.biddingType || "",
        competitionType: validatedData.competitionType || "",
        description: validatedData.description || "",
        title: validatedData.title || "",
        documents:
          files?.map((file) => ({
            name: file.originalname,
            path: file.path,
            type: file.mimetype,
          })) || [],
      };

      const tender = await tenderService.createTender(createData);
      res.status(201).json(tender);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async getTenders(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        sectorId: req.query.sectorId ? Number(req.query.sectorId) : undefined,
        locationId: req.query.locationId
          ? Number(req.query.locationId)
          : undefined,
        userId: req.query.userId ? Number(req.query.userId) : undefined,
        tenderingAuthority: req.query.tenderingAuthority as string | undefined,
        biddingType: req.query.biddingType as string | undefined,
        competitionType: req.query.competitionType as string | undefined,
        publishDateStart: req.query.publishDateStart
          ? new Date(req.query.publishDateStart as string)
          : undefined,
        publishDateEnd: req.query.publishDateEnd
          ? new Date(req.query.publishDateEnd as string)
          : undefined,
        lastDateOfSubmissionStart: req.query.lastDateOfSubmissionStart
          ? new Date(req.query.lastDateOfSubmissionStart as string)
          : undefined,
        lastDateOfSubmissionEnd: req.query.lastDateOfSubmissionEnd
          ? new Date(req.query.lastDateOfSubmissionEnd as string)
          : undefined,
      };
      const tenders = await tenderService.getTenders(filters);
      res.json(tenders);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getTenderById(req: Request, res: Response): Promise<void> {
    try {
      const tender = await tenderService.getTenderById(Number(req.params.id));
      if (!tender) {
        res.status(404).json({ error: "Tender not found" });
        return;
      }
      res.json(tender);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateTender(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateTenderUpdate(req.body);
      const files = req.files as Express.Multer.File[];

      // Calculate whether we need to update the expiry date
      let expiryDate = validatedData.expiryDate;
      if (
        !expiryDate &&
        (validatedData.lastDateOfSubmission || validatedData.publishDate)
      ) {
        const currentTender = await tenderService.getTenderById(
          Number(req.params.id),
        );

        if (validatedData.lastDateOfSubmission) {
          // Set expiry date to 1 day after last date of submission
          expiryDate = new Date(validatedData.lastDateOfSubmission);
          expiryDate.setDate(expiryDate.getDate() + 1);
        } else if (validatedData.publishDate) {
          // Set expiry date to 10 days after published date
          expiryDate = new Date(validatedData.publishDate);
          expiryDate.setDate(expiryDate.getDate() + 10);
        }
      }

      const updateData = {
        ...validatedData,
        expiryDate,
        value: validatedData.value
          ? new Prisma.Decimal(validatedData.value)
          : undefined,
        emd: validatedData.emd
          ? new Prisma.Decimal(validatedData.emd)
          : undefined,
        documents: files?.length
          ? files.map((file) => ({
              name: file.originalname,
              path: file.path,
              type: file.mimetype,
            }))
          : undefined,
      };

      const tender = await tenderService.updateTender(
        Number(req.params.id),
        updateData,
      );
      res.json(tender);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async deleteTender(req: Request, res: Response): Promise<void> {
    try {
      await tenderService.deleteTender(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
