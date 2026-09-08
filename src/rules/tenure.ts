import type { LoanType } from "../types/borrower";
import { RULE_CONFIG } from "./config";

export function getTenureLimit(loanType: LoanType): number {
  return RULE_CONFIG.tenureYears[loanType] * 12;
}

export function getPreferredTenure(loanType: LoanType): number {
  const months = getTenureLimit(loanType);
  if (loanType === "home") return Math.min(months, 240);
  if (loanType === "personal") return 60;
  if (loanType === "two_wheeler") return 60;
  if (loanType === "business") return 84;
  return Math.min(months, 36);
}
