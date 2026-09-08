import { describe, expect, it } from "vitest";
import { makeBorrowingDecision } from "../engine/decisionEngine";
import { PERSONA_PROFILES } from "../data/personas";

describe("Decision engine", () => {
  it("marks Priya as borrow less or borrow depending on conditions", () => {
    const decision = makeBorrowingDecision(PERSONA_PROFILES.priya, 60, 12);
    expect(["BORROW", "BORROW_LESS"]).toContain(decision.verdict);
  });

  it("keeps Anita in a danger state when debt stress is severe", () => {
    const decision = makeBorrowingDecision(PERSONA_PROFILES.anita, 36, 12);
    expect(["DONT_BORROW", "BORROW_LESS"]).toContain(decision.verdict);
  });
});
