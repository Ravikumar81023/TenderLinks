import { Request, Response } from "express";
import { LocationService } from "../services/locationService";
import {
  validateLocationCreate,
  validateLocationUpdate,
} from "../utils/validation";

const locationService = new LocationService();

export class LocationController {
  async createLocation(req: Request, res: Response) {
    try {
      const data = validateLocationCreate(req.body);
      const location = await locationService.createLocation(data);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async getLocations(req: Request, res: Response) {
    try {
      const locations = await locationService.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getLocationById(req: Request, res: Response): Promise<void> {
    try {
      const location = await locationService.getLocationById(
        Number(req.params.id)
      );
      if (!location) {
        res.status(404).json({ error: "Location not found" });
        return;
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async updateLocation(req: Request, res: Response) {
    try {
      const data = validateLocationUpdate(req.body);
      const location = await locationService.updateLocation(
        Number(req.params.id),
        data
      );
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async deleteLocation(req: Request, res: Response) {
    try {
      await locationService.deleteLocation(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
