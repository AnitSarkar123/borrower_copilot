import type { LoanType } from "./borrower";
import type { RateRange } from "./loan";

export type Verdict = "BORROW" | "BORROW_LESS" | "DONT_BORROW";

export type ConfidenceLabel = "HIGH" | "MEDIUM" | "LOW";

export interface StressResult {
  incomeDropPercent: number; // e.g. 10
  rateIncreasePoints: number; // e.g. 2
  stressedEmi: number;
  stressedFoir: number | null; // null if income unknown
  stressedDisposable: number | null;
  affordableUnderStress: boolean;
  warning: string | null;
}

export interface TenureOption {
  tenureMonths: number;
  emi: number;
  totalInterest: number;
}

export interface Explanation {
  verdict: string;
  safeAmount: string;
  lenderLikelyAmount: string;
  rateBand: string;
  safeEmi: string;
  stress: string;
  confidence: string;
  product: string;
}

export interface BorrowerResult {
  verdict: Verdict;
  verdictReasons: string[];
  recommendedProduct: LoanType;
  productReason: string;
  requestedAmount: number;
  safeAmount: number;
  lenderLikelyAmount: number;
  recommendedAmount: number;
  safeEmi: number;
  lenderLikelyEmi: number;
  rateRange: RateRange;
  processingFee: number;
  estimatedAprPercent: number; // simplified comparison metric (R-029), not regulatory APR
  totalCost: number; // principal + interest + fee at recommended amount
  tenureMonths: number;
  tenureOptions: TenureOption[];
  stress: StressResult;
  confidenceScore: number; // 0-100
  confidence: ConfidenceLabel;
  missingInfo: string[];
  explanations: Explanation;
  negotiationPoints: string[];
  redFlags: string[];
}
