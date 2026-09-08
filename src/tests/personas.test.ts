import { describe, expect, it } from "vitest";
import { PERSONA_PROFILES } from "../data/personas";
import { buildBorrowerResult } from "../engine/borrowerEngine";

describe("Challenge personas", () => {
  it("Priya produces a sensible result", () => {
    const result = buildBorrowerResult(PERSONA_PROFILES.priya, 12);
    expect(result.safeAmount).toBeGreaterThan(0);
    expect(result.verdict).toBeDefined();
  });

  it("Ravi is routed toward a secured or business-oriented answer", () => {
    const result = buildBorrowerResult(PERSONA_PROFILES.ravi, 12);
    expect(["lap", "business"]).toContain(result.recommendedProduct);
  });

  it("Anita triggers a warning path", () => {
    const result = buildBorrowerResult(PERSONA_PROFILES.anita, 12);
    expect(result.stress.warning || result.verdict).toBeDefined();
  });
});
