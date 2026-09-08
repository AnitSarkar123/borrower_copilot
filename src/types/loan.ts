import type { LoanType } from "./borrower";

export interface LoanScenario {
  loanType: LoanType;
  principal: number;
  annualRatePercent: number; // e.g. 12 means 12%
  tenureMonths: number;
  processingFee: number; // ₹
}

export interface EmiBreakdown {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

export interface RateRange {
  minPercent: number;
  maxPercent: number;
  expectedPercent: number; // midpoint-ish indicative position
}
