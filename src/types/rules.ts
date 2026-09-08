import type { IncomeType, LoanType } from "./borrower";

export interface RuleConfig {
  foirLimits: Record<IncomeType, number>; // R-006
  disposableBuffer: number; // R-009: 0.8
  tenureYears: Record<LoanType, number>; // R-018
  stressIncomeDrop: number; // R-046: 0.10
  stressRateIncrease: number; // R-046: 0.02 (percentage points as decimal)
  confidencePenalties: {
    creditScore: number;
    incomeHistory: number;
    householdExpenses: number;
    emergencySavings: number;
    incomeVariability: number;
  };
  processingFeeRate: number; // prototype assumption: 2% when fee unknown
}
