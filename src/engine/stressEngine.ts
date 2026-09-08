import { calculateDisposableIncome, calculateFoirEmiCapacity } from "../calculations/affordability";
import { calculateEmi } from "../calculations/emi";
import { RULE_CONFIG } from "../rules/config";
import type { BorrowerProfile } from "../types/borrower";
import type { StressResult } from "../types/result";

export function calculateStressResult(profile: BorrowerProfile, principal: number, annualRatePercent: number, tenureMonths: number): StressResult {
  const stressedIncome = (profile.monthlyIncome ?? 0) * (1 - RULE_CONFIG.stressIncomeDrop);
  const stressedRate = annualRatePercent + RULE_CONFIG.stressRateIncrease * 100;
  const stressedEmi = calculateEmi(principal, stressedRate, tenureMonths);

  const stressedFoir =
    profile.monthlyIncome && profile.existingEmi !== null
      ? (profile.existingEmi + stressedEmi) / stressedIncome
      : null;

  const stressedDisposable = stressedIncome - (profile.householdExpenses ?? 0) - (profile.existingEmi ?? 0);
  const safeStressEmi = Math.min(
    Math.max(stressedIncome * 0.45 - (profile.existingEmi ?? 0), 0),
    stressedDisposable * 0.8,
  );

  const affordableUnderStress = stressedEmi <= safeStressEmi;

  return {
    incomeDropPercent: RULE_CONFIG.stressIncomeDrop * 100,
    rateIncreasePoints: RULE_CONFIG.stressRateIncrease * 100,
    stressedEmi,
    stressedFoir: stressedFoir ? stressedFoir * 100 : null,
    stressedDisposable,
    affordableUnderStress,
    warning: affordableUnderStress ? null : "This EMI becomes unsafe under the stress scenario.",
  };
}
