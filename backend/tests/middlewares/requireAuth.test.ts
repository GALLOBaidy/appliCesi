import { describe, it, expect, vi } from "vitest";
import { requireAuth } from "../../src/middlewares/auth.middleware";

describe("Middleware requireAuth", () => {
  it("bloque si req.user est absent", () => {
    const req: any = {};
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("laisse passer si req.user existe", () => {
    const req: any = { user: { id: 1 } };
    const res: any = {};
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
