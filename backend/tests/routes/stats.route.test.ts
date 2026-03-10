import { describe, it, expect, vi } from "vitest";
import request from "supertest";

// ⛔ IMPORTANT : mocker AVANT d'importer app
vi.mock("../../src/middlewares/auth.middleware", () => ({
  authMiddleware: (req:Request, res: Response, next: NextFunction) => next(),
  requireAuth: (req:Request, res: Response, next: NextFunction) => next(),
  requireRole: () => (req:Request, res: Response, next: NextFunction) => next()
}));

// mock du service
import * as svc from "../../src/services/stats.service";
vi.spyOn(svc, "getTotalUsers").mockResolvedValue(99);

import app from "../../src/server";
import { NextFunction } from "express";

describe("Admin", () => {
  it("GET /stats/users retourne les stats", async () => {
    const res = await request(app)
      .get("/stats/users")
      .set("Authorization", "Bearer faketoken");

    expect(res.status).toBe(200);
    expect(res.body.totalUsers).toBe(99);
  });
});
