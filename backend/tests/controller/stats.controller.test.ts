import { describe, it, expect, vi } from "vitest";
import * as ctrl from "../../src/controllers/stats.controller";
import * as svc from "../../src/services/stats.service";

describe("Admin Controller", () => {
  it("totalUsers renvoie le JSON correct", async () => {
    const req: any = {};
    const res: any = {
      json: vi.fn()
    };

    vi.spyOn(svc, "getTotalUsers").mockResolvedValue(50);

    await ctrl.totalUsers(req, res);

    expect(res.json).toHaveBeenCalledWith({ totalUsers: 50 });
  });
});
