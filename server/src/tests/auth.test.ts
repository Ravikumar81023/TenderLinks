import request from "supertest";
import app from "../server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

describe("Auth API", () => {
  beforeAll(async () => {
    // Create test super admin
    const hashedPassword = await bcrypt.hash("test123", 10);
    await prisma.adminUser.create({
      data: {
        email: "test@superadmin.com",
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });
  });

  describe("POST /api/auth/admin/login", () => {
    it("should login super admin successfully", async () => {
      const response = await request(app).post("/api/auth/admin/login").send({
        email: "test@superadmin.com",
        password: "test123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("role", "SUPER_ADMIN");
    });

    it("should fail with wrong password", async () => {
      const response = await request(app).post("/api/auth/admin/login").send({
        email: "test@superadmin.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  afterAll(async () => {
    await prisma.adminUser.deleteMany();
    await prisma.$disconnect();
  });
});
