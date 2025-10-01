import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../../src/app";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe("User Filter API Integration Tests", () => {

  beforeAll(async () => {
    // Clear existing data and seed test users
    await prisma.user.deleteMany();
    await prisma.user.createMany({
      data: [
        { id: "u1", email: "alice@example.com", role: "ADMIN", age: 30, isActive: true },
        { id: "u2", email: "bob@example.com", role: "USER", age: 25, isActive: false },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/users/filter", () => {

    describe("Successful Filtering", () => {
      it("should return users filtered by role=ADMIN", async () => {
        const response = await request(app)
          .post("/api/users/filter")
          .send({
            field: "role",
            operator: "eq",
            value: "ADMIN",
          })
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.every((user: any) => user.role === "ADMIN")).toBe(true);
      });

      it("should return only ADMIN users from seeded data", async () => {
        const res = await request(app)
          .post("/api/users/filter")
          .send({
            and: [{ field: "role", operator: "eq", value: "ADMIN" }]
          })
          .expect(200);

        expect(res.body).toHaveLength(1);
        expect(res.body[0].email).toBe("alice@example.com");
      });

      it("should return all users when filter is empty", async () => {
        const res = await request(app)
          .post("/api/users/filter")
          .send({})
          .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });

      it("should handle nested and/or filters", async () => {
        const res = await request(app)
          .post("/api/users/filter")
          .send({
            or: [
              { field: "role", operator: "eq", value: "ADMIN" },
              { and: [{ field: "isActive", operator: "eq", value: false }] },
            ]
          })
          .expect(200);

        expect(res.body).toBeInstanceOf(Array);
      });
    });

    describe("Validation Errors", () => {
      it("should return 400 for non-filterable field", async () => {
        const res = await request(app)
          .post("/api/users/filter")
          .send({
            and: [{ field: "updatedAt", operator: "eq", value: "2025-01-01" }]
          })
          .expect(400);

        expect(res.body.error).toContain("Filter validation failed");
      });

      it("should return 400 for unsupported operator", async () => {
        const res = await request(app)
          .post("/api/users/filter")
          .send({
            and: [{ field: "email", operator: "gt", value: "example" }]
          })
          .expect(400);

        expect(res.body.error).toContain("Filter validation failed");
      });

      it("should return 400 for invalid enum value", async () => {
        const res = await request(app)
          .post("/api/users/filter")
          .send({
            and: [{ field: "role", operator: "eq", value: "NON_EXISTENT" }]
          })
          .expect(400);

        expect(res.body.error).toBe("Filter validation failed");
        expect(res.body.details).toContain("Invalid value 'NON_EXISTENT' for field 'role'");
      });
    });

  });

  describe("GET /api/users/filter", () => {

    describe("Successful Filtering", () => {
      it("should return users filtered by isActive=true", async () => {
        const filter = encodeURIComponent(
          JSON.stringify({ and: [{ field: "isActive", operator: "eq", value: true }] })
        );
        const res = await request(app)
          .get(`/api/users/filter?filter=${filter}`)
          .expect(200);

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.every((u: any) => u.isActive === true)).toBe(true);
      });
    });

    describe("Query Parameter Validation", () => {
      it("should return 400 for invalid JSON in query param", async () => {
        const res = await request(app)
          .get("/api/users/filter?filter=not-json")
          .expect(400);

        expect(res.body.error).toBeDefined();
      });
    });

  });

});