import { Request, Response } from "express";
import { CustomerService } from "../services/customerService";
import {
  validateCustomerCreate,
  validateCustomerUpdate,
} from "../utils/validation";
import { SubscriptionTier } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const customerService = new CustomerService();

export class CustomerController {
  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateCustomerCreate(req.body);
      const files = req.files as Express.Multer.File[];

      const documents = files
        ? files.map((file) => ({
            name: file.originalname,
            path: file.path,
            type: file.mimetype,
          }))
        : [];

      const customer = await customerService.createCustomer({
        ...validatedData,
        documents,
      });
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        sectorId: req.query.sectorId ? Number(req.query.sectorId) : undefined,
        locationId: req.query.locationId
          ? Number(req.query.locationId)
          : undefined,
      };
      const customers = await customerService.getCustomers(filters);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCustomerById(req: Request, res: Response): Promise<void> {
    try {
      const customer = await customerService.getCustomerById(
        Number(req.params.id),
      );
      if (!customer) {
        res.status(404).json({ error: "Customer not found" });
        return;
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateCustomerUpdate(req.body);
      const files = req.files as Express.Multer.File[];

      const documents = files
        ? files.map((file) => ({
            name: file.originalname,
            path: file.path,
            type: file.mimetype,
          }))
        : undefined;

      const customer = await customerService.updateCustomer(
        Number(req.params.id),
        {
          ...validatedData,
          documents,
        },
      );
      res.json(customer);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      await customerService.deleteCustomer(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async addCustomerNote(req: Request, res: Response): Promise<void> {
    try {
      const { content } = req.body;
      const customerId = Number(req.params.id);
      const note = await customerService.addCustomerNote(customerId, content);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error adding customer note:", error);
      res.status(500).json({ error: "Failed to add customer note" });
    }
  }

  async updateSubscriptionTier(req: Request, res: Response): Promise<void> {
    try {
      const { tier } = req.body;
      if (!Object.values(SubscriptionTier).includes(tier)) {
        res.status(400).json({ error: "Invalid subscription tier" });
        return;
      }
      const customer = await customerService.updateSubscriptionTier(
        Number(req.params.id),
        tier as SubscriptionTier,
      );
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async uploadDocument(req: Request, res: Response): Promise<void> {
    try {
      const customerId = Number(req.params.id);
      const file = req.file as Express.Multer.File;

      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const document = await customerService.addDocumentToCustomer(customerId, {
        name: file.originalname,
        path: file.path,
        type: file.mimetype,
      });

      res.status(201).json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  }

  async getDocuments(req: Request, res: Response): Promise<void> {
    try {
      const customerId = Number(req.params.id);
      const documents = await customerService.getCustomerDocuments(customerId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  }

  async getCustomerOverview(req: Request, res: Response) {
    try {
      const { startDate, endDate, location, sector } = req.query;
      const filters = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        location: location as string | undefined,
        sector: sector as string | undefined,
      };
      const customers = await customerService.getCustomerOverview(filters);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer overview" });
    }
  }

  async updateCustomerInfo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedCustomer = await customerService.updateCustomerInfo(
        parseInt(id as string),
        req.body,
      );
      res.json(updatedCustomer);
    } catch (error) {
      res.status(500).json({ error: "Failed to update customer information" });
    }
  }

  async terminateCustomerService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { password } = req.body;
      await customerService.terminateCustomerService(parseInt(id as string), password);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to terminate customer service" });
    }
  }

  async recordAnalytics(req: Request, res: Response) {
    try {
      const {
        userId,
        ipAddress,
        loginTime,
        logoutTime,
        pageViews,
        timeSpent,
        location,
      } = req.body;
      const analytics = await customerService.recordAnalytics({
        userId,
        ipAddress,
        loginTime: new Date(loginTime),
        logoutTime: logoutTime ? new Date(logoutTime) : undefined,
        pageViews,
        timeSpent,
        location,
      });
      res.status(201).json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to record analytics" });
    }
  }

  async updateAnalytics(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedAnalytics = await customerService.updateAnalytics(
        parseInt(id as string),
        req.body,
      );
      res.json(updatedAnalytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to update analytics" });
    }
  }

  async getCustomerAnalytics(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      const analytics = await customerService.getCustomerAnalytics(
        parseInt(id as string),
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined,
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer analytics" });
    }
  } 
} 
