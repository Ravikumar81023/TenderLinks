import request from "supertest";
import app from "../server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

describe("Admin API", () => {
  let superAdminToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Create test users and generate tokens
    const superAdmin = await prisma.adminUser.create({
      data: {
        email: "super@test.com",
        password: "hashedpassword",
        role: "SUPER_ADMIN",
      },
    });

    const admin = await prisma.adminUser.create({
      data: {
        email: "admin@test.com",
        password: "hashedpassword",
        role: "ADMIN",
        adminedByUserId: superAdmin.id,
      },
    });

    superAdminToken = jwt.sign(
      { id: superAdmin.id, role: "SUPER_ADMIN" },
      process.env.JWT_SECRET!,
    );

    adminToken = jwt.sign(
      { id: admin.id, role: "ADMIN" },
      process.env.JWT_SECRET!,
    );
  });

  describe("POST /api/admins", () => {
    it("super admin can create another admin", async () => {
      const response = await request(app)
        .post("/api/admins")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          email: "newadmin@test.com",
          password: "password123",
          role: "ADMIN",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("email", "newadmin@test.com");
    });

    it("admin cannot create super admin", async () => {
      const response = await request(app)
        .post("/api/admins")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "newsuperadmin@test.com",
          password: "password123",
          role: "SUPER_ADMIN",
        });

      expect(response.status).toBe(403);
    });
  });

  // Add more test cases for other endpoints
});
