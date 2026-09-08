// Borrower domain types. Unknown values are represented as null (never zero). R-002.

export type IncomeType = "salaried" | "self_employed" | "informal";

export type LoanPurpose =
  | "wedding"
  | "business_expansion"
  | "vehicle_income" // income-generating vehicle
  | "vehicle_personal"
  | "home"
  | "education"
  | "medical"
  | "debt_repayment"
  | "personal_other";

export type LoanType =
  | "personal"
  | "two_wheeler"
  | "home"
  | "lap" // loan against property
  | "business"
  | "gold";

export interface LenderQuote {
  ratePercent: number; // annual headline rate offered
  processingFee: number | null; // ₹, null = unknown
}

export interface BorrowerProfile {
  age: number | null;
  incomeType: IncomeType;
  monthlyIncome: number | null; // net take-home; for variable income use midpoint
  incomeMin: number | null; // for variable income ranges
  incomeMax: number | null;
  incomeYears: number | null; // years in current job/business
  householdExpenses: number | null;
  existingEmi: number | null; // total monthly EMI obligations
  creditScore: number | null; // null = unknown (R-026)
  emergencySavings: number | null;
  requestedAmount: number;
  purpose: LoanPurpose;
  // Conditional / adaptive fields
  hasCollateral: boolean | null;
  collateralValue: number | null;
  existingHighCostDebt: boolean | null; // e.g. app loans at 30%+
  recentEmiBounce: boolean | null;
  borrowingToRepay: boolean | null; // new loan primarily to service old debt
  lenderQuote: LenderQuote | null;
}
