import { PrismaClient, AdminUser, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/user";
import { JWT_SECRET } from '../config/index';

const prisma = new PrismaClient();

export class AuthService {
  private generateToken(payload: JWTPayload): string {
  
    return jwt.sign(payload,"JwtSecrete", {
      expiresIn: "30d",
    });
  }

  async loginAdmin(email: string, password: string) {
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const payload: JWTPayload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      adminedByUserId: admin.adminedByUserId ?? undefined,
    };

    const token = this.generateToken(payload);

    // ✅ Invalidate previous session by overwriting token
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { currentToken: token },
    });

    return {
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async loginCustomer(email: string, password: string) {
    const customer = await prisma.customerUser.findUnique({
      where: { email },
    });

    if (!customer) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, customer.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const payload: JWTPayload = {
      id: customer.id,
      email: customer.email,
      role: UserRole.CUSTOMER,
    };

    const token = this.generateToken(payload);

    return {
      token,
      user: {
        id: customer.id,
        email: customer.email,
        role: UserRole.CUSTOMER,
        annualTurnover: customer.annualTurnover,
        sector: customer.sectorId,
        companyName:customer.companyName
      },
    };
  }
}
