import type { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { validateLogin } from "../utils/validation";

const authService = new AuthService();

export class AuthController {
  async loginAdmin(req: Request, res: Response) {
    try {
      const { username, password } = validateLogin(req.body);
      const result = await authService.loginAdmin(username, password);

      if (result && result.token) {
        // res.cookie("adminAuthToken", result.token)
        res.cookie("adminAuthToken", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
      }
      res.status(200).json({ user: result.user });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async loginCustomer(req: Request, res: Response) {
    try {
      const { username, password } = validateLogin(req.body);
      const result = await authService.loginCustomer(username, password);

      if (result && result.token) {
        res.cookie("customerAuthToken", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
      }
      res.status(200).json({ user: result.user });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async logoutAdmin(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("adminAuthToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
      res.status(500).json({ error: "Admin logout failed" });
    }
  }

  async logoutCustomer(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("customerAuthToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(200).json({ message: "Customer logged out successfully" });
    } catch (error) {
      res.status(500).json({ error: "Customer logout failed" });
    }
  }
}
