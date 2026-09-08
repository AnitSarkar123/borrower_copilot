import { RULE_CONFIG } from "../rules/config";
import type { BorrowerProfile } from "../types/borrower";

export function calculateConfidence(profile: BorrowerProfile): { score: number; label: "HIGH" | "MEDIUM" | "LOW" } {
  let score = 100;

  if (!profile.creditScore) score -= RULE_CONFIG.confidencePenalties.creditScore;
  if (!profile.incomeYears) score -= RULE_CONFIG.confidencePenalties.incomeHistory;
  if (!profile.householdExpenses) score -= RULE_CONFIG.confidencePenalties.householdExpenses;
  if (!profile.emergencySavings) score -= RULE_CONFIG.confidencePenalties.emergencySavings;
  if (profile.incomeType === "informal" || (profile.incomeMin && profile.incomeMax)) {
    score -= RULE_CONFIG.confidencePenalties.incomeVariability;
  }

  score = Math.max(0, Math.min(100, score));

  let label: "HIGH" | "MEDIUM" | "LOW" = "HIGH";
  if (score < 60) label = "LOW";
  else if (score < 80) label = "MEDIUM";

  return { score, label };
}
