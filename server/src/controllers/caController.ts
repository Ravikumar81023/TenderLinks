import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CAController = {
  createCA: async (req: Request, res: Response) => {
    console.log(req.body);
    
    try {
      const { name, experience, phoneNumber, state, district, city } = req.body;
      const ca = await prisma.cA.create({
        data: { name, experience, phoneNumber, state, district, city },
      });
      res.status(201).json(ca);
    } catch (error) {
      res.status(500).json({ error: "Failed to create CA" });
    }
  },

  getCAs: async (req: Request, res: Response) => {
    try {
      const cas = await prisma.cA.findMany();
      res.json(cas);
    } catch (error) {
      res.status(500).json({ error: "Failed to get CAs" });
    }
  },

  getCAById: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const ca = await prisma.cA.findUnique({ where: { id } });
      if (ca) {
        res.json(ca);
      } else {
        res.status(404).json({ error: "CA not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get CA" });
    }
  },

  updateCA: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const { name, experience, phoneNumber, state, district, city } = req.body;
      const ca = await prisma.cA.update({
        where: { id },
        data: { name, experience, phoneNumber, state, district, city },
      });
      res.json(ca);
    } catch (error) {
      res.status(500).json({ error: "Failed to update CA" });
    }
  },

  deleteCA: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      await prisma.cA.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete CA" });
    }
  },
};
