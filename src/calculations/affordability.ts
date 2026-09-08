import type { BorrowerProfile } from "../types/borrower";
import { RULE_CONFIG } from "../rules/config";

export function calculateDisposableIncome(profile: BorrowerProfile): number {
  const income = profile.monthlyIncome ?? 0;
  const expenses = profile.householdExpenses ?? 0;
  const existingEmi = profile.existingEmi ?? 0;
  return income - expenses - existingEmi;
}

export function calculateFoirEmiCapacity(profile: BorrowerProfile): number {
  if (!profile.monthlyIncome) return 0;
  const limit = RULE_CONFIG.foirLimits[profile.incomeType];
  const existingEmi = profile.existingEmi ?? 0;
  return profile.monthlyIncome * limit - existingEmi;
}

export function calculateDisposableEmiCapacity(profile: BorrowerProfile): number {
  const disposable = calculateDisposableIncome(profile);
  return disposable * RULE_CONFIG.disposableBuffer;
}

export function calculateSafeEmi(profile: BorrowerProfile): number {
  return Math.min(
    calculateFoirEmiCapacity(profile),
    calculateDisposableEmiCapacity(profile),
  );
}
