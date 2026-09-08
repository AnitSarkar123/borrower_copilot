import { describe, expect, it } from "vitest";
import { calculateDisposableIncome, calculateSafeEmi } from "../calculations/affordability";
import { PERSONA_PROFILES } from "../data/personas";

describe("Affordability calculations", () => {
  it("calculates disposable income correctly", () => {
    const disposable = calculateDisposableIncome(PERSONA_PROFILES.priya);
    expect(disposable).toBe(110000 - 28000 - 14000);
  });

  it("calculates a conservative safe EMI", () => {
    const safe = calculateSafeEmi(PERSONA_PROFILES.priya);
    expect(safe).toBeGreaterThan(0);
    expect(safe).toBeLessThanOrEqual(110000 * 0.45 - 14000);
  });
});
