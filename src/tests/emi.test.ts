import { describe, expect, it } from "vitest";
import { calculateEmi } from "../calculations/emi";

describe("EMI calculations", () => {
  it("calculates a reducing balance EMI for a standard loan", () => {
    const emi = calculateEmi(100000, 12, 12);
    expect(emi).toBeGreaterThan(0);
    expect(emi).toBeCloseTo(8884.88, 2);
  });

  it("handles zero rate safely", () => {
    const emi = calculateEmi(120000, 0, 12);
    expect(emi).toBe(10000);
  });
});
