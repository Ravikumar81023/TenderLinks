import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ContactController = {
  getAllContacts: async (_req: Request, res: Response): Promise<void> => {
    try {
      const contacts = await prisma.contact.findMany();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  },

  getContact: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const contact = await prisma.contact.findUnique({
        where: { id: parseInt(id as string) },
      });
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  },

  createContact: async (req: Request, res: Response): Promise<void> => {
    const { title, phoneNumber } = req.body;
    try {
      const newContact = await prisma.contact.create({
        data: {
          title,
          phoneNumber,
        },
      });
      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ error: "Failed to create contact" });
    }
  },

  updateContact: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, phoneNumber } = req.body;
    try {
      const updatedContact = await prisma.contact.update({
        where: { id: parseInt(id as string) },
        data: {
          title,
          phoneNumber,
        },
      });
      res.json(updatedContact);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact" });
    }
  },

  deleteContact: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await prisma.contact.delete({
        where: { id: parseInt(id as string) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  },

  submitComplaint: async (req: Request, res: Response): Promise<void> => {
    const { name, companyName, phoneNumber, email, message } = req.body;
    try {
      const newComplaint = await prisma.complaint.create({
        data: {
          name,
          companyName,
          phoneNumber,
          email,
          message,
        },
      });
      res.status(201).json(newComplaint);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit complaint" });
    }
  },
};
