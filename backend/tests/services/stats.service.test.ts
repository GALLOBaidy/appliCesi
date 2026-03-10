import { describe, it, expect, vi } from "vitest";
import { db } from "../mocks/db.mock";

// Mock AVANT l'import du service
vi.mock("../../src/models", () => ({
  db
}));

import * as svc from "../../src/services/stats.service";

describe("Admin Service - Stats", () => {
  it("getTotalUsers retourne le nombre d'utilisateurs", async () => {
    db.select.mockReturnValueOnce({
      from: () => [{ total: 3 }]
    });

    const result = await svc.getTotalUsers();
    expect(result).toBe(3);
  });

  it("getTotalRuns retourne le nombre de runs user", async () => {
    db.select.mockReturnValueOnce({
      from: () => [{ total: 0 }]
    });

    const result = await svc.getTotalRuns();
    expect(result).toBe(0);
  });
});
