import type { BorrowerProfile } from "../types/borrower";

export function detectDebtStress(profile: BorrowerProfile): { severe: boolean; reason: string } {
  const signals: string[] = [];

  if (profile.existingHighCostDebt) {
    signals.push("High-cost debt is already present.");
  }
  if (profile.recentEmiBounce) {
    signals.push("There was a recent EMI bounce.");
  }
  if (profile.borrowingToRepay) {
    signals.push("Borrowing is being used to repay existing debt.");
  }
  if (profile.existingEmi && profile.monthlyIncome) {
    if ((profile.existingEmi / profile.monthlyIncome) > 0.4) {
      signals.push("Current EMIs are already a large share of monthly income.");
    }
  }

  if (signals.length === 0) {
    return { severe: false, reason: "No major distress signal identified." };
  }

  return {
    severe: signals.length >= 2,
    reason: signals[0],
  };
}
