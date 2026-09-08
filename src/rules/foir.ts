import type { BorrowerProfile, IncomeType } from "../types/borrower";
import { RULE_CONFIG } from "./config";

export function getFoirLimit(incomeType: IncomeType): number {
  return RULE_CONFIG.foirLimits[incomeType];
}

export function getFoirCapacity(profile: BorrowerProfile): number {
  if (!profile.monthlyIncome) return 0;
  const limit = getFoirLimit(profile.incomeType);
  return profile.monthlyIncome * limit - (profile.existingEmi ?? 0);
}
