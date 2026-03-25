import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export const SliderController = {
  addImage: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      const image = await prisma.sliderImage.create({
        data: { imageUrl },
      });
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to add image" });
    }
  },

  getImages: async (_req: Request, res: Response): Promise<void> => {
    try {
      const images = await prisma.sliderImage.findMany({
        orderBy: { createdAt: "desc" },
        take: 11,
      });
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to get images" });
    }
  },

  deleteImage: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string);
      const image = await prisma.sliderImage.findUnique({ where: { id } });

      if (!image) {
        res.status(404).json({ error: "Image not found" });
        return;
      }

      const filePath = path.join(__dirname, "..", "..", image.imageUrl);
      await fs.unlink(filePath);
      await prisma.sliderImage.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete image" });
    }
  },
};
