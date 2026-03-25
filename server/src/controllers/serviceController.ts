import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export const ServiceController = {
  createService: async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;
      let mediaUrl: string | null = null;
      let mediaType: "image" | "video" | null = null;

      if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
        mediaType = req.file.mimetype.startsWith("image/") ? "image" : "video";
      }

      const service = await prisma.service.create({
        data: {
          title,
          description,
          image: mediaType === "image" ? mediaUrl : null,
          video: mediaType === "video" ? mediaUrl : null,
        },
      });
      res.status(201).json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to create service" });
    }
  },

  getServices: async (req: Request, res: Response) => {
    try {
      const services = await prisma.service.findMany();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to get services" });
    }
  },

  getServiceById: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const service = await prisma.service.findUnique({ where: { id } });
      if (service) {
        res.json(service);
      } else {
        res.status(404).json({ error: "Service not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get service" });
    }
  },

  updateService: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const { title, description } = req.body;

      let mediaUrl: string | null = null;
      let mediaType: "video" | "image" | null = null;

      if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
        mediaType = req.file.mimetype.startsWith("image/") ? "image" : "video";
      }

      const existingService = await prisma.service.findUnique({
        where: { id },
      });
      if (existingService) {
        if (existingService.image) {
          await fs.unlink(
            path.join(__dirname, "..", "..", existingService.image),
          );
        }
        if (existingService.video) {
          await fs.unlink(
            path.join(__dirname, "..", "..", existingService.video),
          );
        }
      }

      const service = await prisma.service.update({
        where: { id },
        data: {
          title,
          description,
          image: mediaType === "image" ? mediaUrl : null,
          video: mediaType === "video" ? mediaUrl : null,
        },
      });
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  },

  deleteService: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const service = await prisma.service.findUnique({ where: { id } });
      if (service) {
        if (service.image) {
          await fs.unlink(path.join(__dirname, "..", "..", service.image));
        }
        if (service.video) {
          await fs.unlink(path.join(__dirname, "..", "..", service.video));
        }
      }
      await prisma.service.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  },
};
