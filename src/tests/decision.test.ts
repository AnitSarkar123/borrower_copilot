import { describe, expect, it } from "vitest";
import { makeBorrowingDecision } from "../engine/decisionEngine";
import { PERSONA_PROFILES } from "../data/personas";

describe("Decision engine", () => {
  it("marks Priya as borrow less or borrow depending on conditions", () => {
    const decision = makeBorrowingDecision(PERSONA_PROFILES.priya, 60, 12);
    expect(["BORROW", "BORROW_LESS"]).toContain(decision.verdict);
  });

  it("moves to BORROW_LESS when the requested amount is near the safe ceiling", () => {
    const decision = makeBorrowingDecision(
      {
        ...PERSONA_PROFILES.priya,
        requestedAmount: 14000000,
      },
      60,
      12,
    );

    expect(decision.verdict).toBe("BORROW_LESS");
  });

  it("keeps Anita in a danger state when debt stress is severe", () => {
    const decision = makeBorrowingDecision(PERSONA_PROFILES.anita, 36, 12);
    expect(["DONT_BORROW", "BORROW_LESS"]).toContain(decision.verdict);
  });

  it("allows Anita to recover from a danger state when the profile improves materially", () => {
    const decision = makeBorrowingDecision(
      {
        ...PERSONA_PROFILES.anita,
        monthlyIncome: 60000,
        householdExpenses: 20000,
        existingEmi: 3000,
        requestedAmount: 300000,
        existingHighCostDebt: false,
        recentEmiBounce: false,
        borrowingToRepay: false,
      },
      60,
      12,
    );

    expect(["BORROW", "BORROW_LESS"]).toContain(decision.verdict);
  });
});
