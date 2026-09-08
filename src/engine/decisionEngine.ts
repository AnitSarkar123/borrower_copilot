import { calculateDisposableIncome, calculateSafeEmi } from "../calculations/affordability";
import { calculateEmi } from "../calculations/emi";
import { calculateProcessingFee } from "../calculations/fees";
import { routeProduct } from "./productRouter";
import { detectDebtStress } from "../rules/debtStress";
import type { BorrowerProfile } from "../types/borrower";
import type { Verdict } from "../types/result";

export function makeBorrowingDecision(profile: BorrowerProfile, tenureMonths: number, ratePercent: number): {
  verdict: Verdict;
  reason: string;
  recommendedAmount: number;
  safeAmount: number;
  lenderLikelyAmount: number;
  safeEmi: number;
  recommendedProduct: string;
} {
  const disposable = calculateDisposableIncome(profile);
  const safeEmi = calculateSafeEmi(profile);
  const requestedEmi = calculateEmi(profile.requestedAmount, ratePercent, tenureMonths);
  const stressDebt = detectDebtStress(profile);
  const product = routeProduct(profile);

  let verdict: Verdict = "BORROW";
  let reason = "Your borrowing looks manageable under the current assumptions.";

  if (stressDebt.severe || disposable < 0) {
    verdict = "DONT_BORROW";
    reason = stressDebt.reason || "Your cash flow is too tight to justify additional borrowing.";
  } else if (requestedEmi > safeEmi || profile.requestedAmount > 0 && profile.requestedAmount > safeEmi * 20 * 12) {
    verdict = "BORROW_LESS";
    reason = "Your requested loan would exceed the safer affordability ceiling.";
  }

  const safeAmount = Math.max(0, Math.min(profile.requestedAmount, safeEmi * 20 * 12));
  const lenderLikelyAmount = Math.max(0, profile.requestedAmount * 1.15);

  return {
    verdict,
    reason,
    recommendedAmount: safeAmount,
    safeAmount,
    lenderLikelyAmount,
    safeEmi,
    recommendedProduct: product.type,
  };
}
