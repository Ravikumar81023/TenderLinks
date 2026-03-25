import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface JWTPayload {
  id: number;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      isAdmin?: boolean;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Check both admin and customer tokens
    const token =
      req.cookies?.adminAuthToken ||
      req.cookies?.customerAuthToken ||
      req.headers.authorization?.split(" ")[1];

      // console.log("Hello")
    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
     "JwtSecrete" ,
    ) as JWTPayload;

    // First try to find as admin user
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: decoded.id },
    });

    if (adminUser) {
      if (adminUser.currentToken !== token) {
        res
          .status(401)
          .json({ error: "Session expired or logged in elsewhere" });
        return;
      }

      if (
        !["SUPER_ADMIN", "ADMIN", "CONTENT_ADMIN", "PROJECT_ADMIN"].includes(
          adminUser.role,
        )
      ) {
        res.status(401).json({ error: "Unauthorized access" });
        return;
      }

      req.user = decoded;
      req.isAdmin = true;
      next();
      return;
    }
    // If not admin, try to find as customer
    const customerUser = await prisma.customerUser.findUnique({
      where: { id: decoded.id },
    });

    if (customerUser) {
      req.user = decoded;
      req.isAdmin = false;
      next();
      return;
    }

    // Neither admin nor customer found
    res.status(401).json({ error: "Unauthorized access" });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authorize = (allowedRoles: UserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ error: "Authorization error" });
    }
  };
};
