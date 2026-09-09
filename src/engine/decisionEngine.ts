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
  const safeLoanCap = Math.max(0, safeEmi * 20 * 12);
  const requestedAmount = profile.requestedAmount ?? 0;
  const hasSevereStress = Boolean(stressDebt.severe && requestedAmount > 0);
  const isNearSafeCap = safeLoanCap > 0 && requestedAmount > 0 && requestedAmount > safeLoanCap * 0.9 && requestedAmount <= safeLoanCap;
  const exceedsSafeCap = safeLoanCap > 0 && requestedAmount > safeLoanCap;

  let verdict: Verdict = "BORROW";
  let reason = "Your borrowing looks manageable under the current assumptions.";

  if (disposable < 0 || hasSevereStress) {
    verdict = "DONT_BORROW";
    reason = stressDebt.reason || "Your monthly cash flow is too tight for additional borrowing.";
  } else if (requestedEmi > safeEmi || exceedsSafeCap) {
    verdict = "BORROW_LESS";
    reason = "Your requested loan is above the safer affordability ceiling. Lowering the amount would improve comfort.";
  } else if (isNearSafeCap) {
    verdict = "BORROW_LESS";
    reason = "You are close to the safe borrowing limit. A smaller loan would keep the EMI more comfortable.";
  }

  const safeAmount = Math.max(0, Math.min(requestedAmount, safeLoanCap));
  const lenderLikelyAmount = Math.max(0, requestedAmount * 1.15);

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
