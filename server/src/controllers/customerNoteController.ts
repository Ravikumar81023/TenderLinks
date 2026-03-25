import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CustomerNoteController = {
  createNote: async (req: Request, res: Response) => {
    const { userId, content } = req.body;
    try {
      const newNote = await prisma.customerNote.create({
        data: {
          content,
          userId: parseInt(userId),
        },
      });
      res.status(201).json(newNote);
    } catch (error) {
      res.status(500).json({ error: "Failed to create customer note" });
    }
  },
  getAllNotes: async (req: Request, res: Response) => {
    const { state, sector, district, city } = req.query;
    try {
      const notes = await prisma.customerNote.findMany({
        where: {
          user: {
            location: {
              state: state as string | undefined,
              district: district as string | undefined,
              city: city as string | undefined,
            },
            sector: {
              name: sector as string | undefined,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            include: {
              location: true,
              sector: true,
            },
          },
        },
      });
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all customer notes" });
    }
  },

  getNotesByCustomer: async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { state, sector, district, city } = req.query;
    try {
      const notes = await prisma.customerNote.findMany({
        where: {
          userId: parseInt(userId as string),
          user: {
            location: {
              state: state as string | undefined,
              district: district as string | undefined,
              city: city as string | undefined,
            },
            sector: {
              name: sector as string | undefined,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            include: {
              location: true,
              sector: true,
            },
          },
        },
      });
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer notes" });
    }
  },

  updateNote: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
      const updatedNote = await prisma.customerNote.update({
        where: { id: parseInt(id as string) },
        data: { content },
      });
      res.json(updatedNote);
    } catch (error) {
      res.status(500).json({ error: "Failed to update customer note" });
    }
  },

  deleteNote: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.customerNote.delete({
        where: { id: parseInt(id as string) }, 
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete customer note" });
    }
  },
};
