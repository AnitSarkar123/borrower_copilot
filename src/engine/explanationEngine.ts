import type { BorrowerProfile } from "../types/borrower";

export function explainResult(profile: BorrowerProfile, safeEmi: number, lenderLikelyAmount: number, safeAmount: number): string {
  const incomeNote = profile.monthlyIncome ? `Based on a monthly income of ₹${profile.monthlyIncome.toLocaleString("en-IN")}.` : "Income is not fully known.";
  const expenseNote = profile.householdExpenses ? `Household expenses reduce available cash flow.` : "Household expenses are uncertain.";
  return `${incomeNote} ${expenseNote} The calculator keeps a safety buffer and uses your current EMI obligations to keep the recommended EMI at ₹${safeEmi.toLocaleString("en-IN")}. The safe borrowing ceiling is ₹${safeAmount.toLocaleString("en-IN")}, which is lower than the broader indicative lender figure of ₹${lenderLikelyAmount.toLocaleString("en-IN")}.`;
}
