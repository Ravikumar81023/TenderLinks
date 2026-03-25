import { Request, Response } from "express";
import { SectorService } from "../services/sectorService";
import {
  validateSectorCreate,
  validateSectorUpdate,
} from "../utils/validation";

const sectorService = new SectorService();

export class SectorController {
  async createSector(req: Request, res: Response) {
    try {
      const { name } = validateSectorCreate(req.body);
      const sector = await sectorService.createSector(name);
      res.status(201).json(sector);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async getSectors(req: Request, res: Response) {
    try {
      const sectors = await sectorService.getSectors();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSectorById(req: Request, res: Response): Promise<void> {
    try {
      const sector = await sectorService.getSectorById(Number(req.params.id));
      if (!sector) {
        res.status(404).json({ error: "Sector not found" });
        return;
      }
      res.json(sector);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async updateSector(req: Request, res: Response) {
    try {
      const { name } = validateSectorUpdate(req.body);
      const sector = await sectorService.updateSector(
        Number(req.params.id),
        name,
      );
      res.json(sector);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async deleteSector(req: Request, res: Response) {
    try {
      await sectorService.deleteSector(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
