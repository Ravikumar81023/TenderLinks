import { Request, Response } from "express";
import { AdminService } from "../services/adminService";
import { validateAdminCreate, validateAdminUpdate } from "../utils/validation";

const adminService = new AdminService();

export class AdminController {
  async createAdmin(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateAdminCreate(req.body);
      const admin = await adminService.createAdmin(req.user!.id, validatedData);
      res.status(201).json(admin);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async getAdmins(req: Request, res: Response): Promise<void> {
    try {
      const admins = await adminService.getAdmins(req.user!.id);
      res.json(admins);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async getAdminById(req: Request, res: Response): Promise<void> {
    try {
      const admin = await adminService.getAdminById(
        req.user!.id, // Add the requesterId parameter
        parseInt(req.params.id as string),
      );
      if (!admin) {
        res.status(404).json({ error: "Admin not found" });
        return;
      }
      res.json(admin);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
  async updateAdmin(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateAdminUpdate(req.body);
      const admin = await adminService.updateAdmin(
        req.user!.id,
        parseInt(req.params.id as string),
        validatedData,
      );
      res.json(admin);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async deleteAdmin(req: Request, res: Response): Promise<void> {
    try {
      await adminService.deleteAdmin(req.user!.id, parseInt(req.params.id as string));
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
