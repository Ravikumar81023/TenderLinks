import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const AddressController = {
  getAllAddresses: async (_req: Request, res: Response): Promise<void> => {
    try {
      const addresses = await prisma.address.findMany();
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch addresses" });
    }
  },

  getAddress: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const address = await prisma.address.findUnique({
        where: { id: parseInt(id as string) },
      });
      if (address) {
        res.json(address);
      } else {
        res.status(404).json({ error: "Address not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch address" });
    }
  },

  createAddress: async (req: Request, res: Response): Promise<void> => {
    const { state, district, city, phoneNumbers, landmark, isMainOffice } =
      req.body;
    try {
      const newAddress = await prisma.address.create({
        data: {
          state,
          district,
          city,
          phoneNumbers,
          landmark,
          isMainOffice,
        },
      });
      res.status(201).json(newAddress);
    } catch (error) {
      res.status(500).json({ error: "Failed to create address" });
    }
  },

  updateAddress: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { state, district, city, phoneNumbers, landmark, isMainOffice } =
      req.body;
    try {
      const updatedAddress = await prisma.address.update({
        where: { id: parseInt(id as string) },
        data: {
          state,
          district,
          city,
          phoneNumbers,
          landmark,
          isMainOffice,
        },
      });
      res.json(updatedAddress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update address" });
    }
  },

  deleteAddress: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await prisma.address.delete({
        where: { id: parseInt(id as string) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete address" });
    }
  },
};
