import { Request, Response } from "express";
import { AnalyticsService } from "../services/analyticsService";

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate, location, userId } = req.query;
      const filters = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        location: location as string | undefined,
        userId: userId ? parseInt(userId as string) : undefined,
      };
      const analytics = await analyticsService.getAnalytics(filters);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  }

  async recordLogin(req: Request, res: Response) {
    try {
      const { userId, ipAddress, location } = req.body;
      const login = await analyticsService.recordLogin(
        userId,
        ipAddress,
        location,
      );
      res.status(201).json(login);
    } catch (error) {
      res.status(500).json({ error: "Failed to record login" });
    }
  }

  async recordLogout(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const logout = await analyticsService.recordLogout(parseInt(id as string));
      res.json(logout);
    } catch (error) {
      res.status(500).json({ error: "Failed to record logout" });
    }
  }

  async updatePageViews(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { pageViews } = req.body;
      const updated = await analyticsService.updatePageViews(
        parseInt(id as string),
        pageViews,
      );
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update page views" });
    }
  }

  async updateTimeSpent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { timeSpent } = req.body;
      const updated = await analyticsService.updateTimeSpent(
        parseInt(id as string),
        timeSpent,
      );
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update time spent" });
    }
  }
}
