import { calculateEstimatedApr } from "../calculations/apr";
import { calculateDisposableIncome, calculateSafeEmi } from "../calculations/affordability";
import { calculateEmi, calculateTotalInterest } from "../calculations/emi";
import { calculateProcessingFee, calculateTotalBorrowingCost } from "../calculations/fees";
import { principalFromEmi } from "../calculations/loanAmount";
import { PERSONA_PROFILES } from "../data/personas";
import { RULE_CONFIG } from "../rules/config";
import { detectDebtStress } from "../rules/debtStress";
import { getRateRange } from "../rules/rateBands";
import { getPreferredTenure, getTenureLimit } from "../rules/tenure";
import type { BorrowerProfile } from "../types/borrower";
import type { BorrowerResult, Verdict } from "../types/result";
import { calculateConfidence } from "./confidenceEngine";
import { makeBorrowingDecision } from "./decisionEngine";
import { explainResult } from "./explanationEngine";
import { routeProduct } from "./productRouter";
import { calculateStressResult } from "./stressEngine";

export function buildBorrowerResult(
  profile: BorrowerProfile,
  overrideRatePercent = 12,
): BorrowerResult {
  const preferredTenureMonths = getPreferredTenure(routeProduct(profile).type);
  const rateRange = getRateRange(profile, routeProduct(profile).type);
  const safeEmi = calculateSafeEmi(profile);
  const lenderLikelyEmi = Math.max(0, profile.monthlyIncome ? profile.monthlyIncome * RULE_CONFIG.foirLimits[profile.incomeType] - (profile.existingEmi ?? 0) : 0);
  const safeAmountCap = Math.max(0, principalFromEmi(safeEmi, overrideRatePercent, preferredTenureMonths));
  const lenderLikelyAmountCap = Math.max(0, principalFromEmi(lenderLikelyEmi, overrideRatePercent, preferredTenureMonths));
  const requestedAmount = profile.requestedAmount;
  const decision = makeBorrowingDecision(profile, preferredTenureMonths, overrideRatePercent);
  const stress = calculateStressResult(profile, Math.min(requestedAmount, safeAmountCap || requestedAmount), overrideRatePercent, preferredTenureMonths);
  const confidence = calculateConfidence(profile);
  const product = routeProduct(profile);
  const processingFee = calculateProcessingFee(requestedAmount, RULE_CONFIG.processingFeeRate);
  const totalInterest = calculateTotalInterest(Math.min(requestedAmount, safeAmountCap || requestedAmount), overrideRatePercent, preferredTenureMonths);
  const totalCost = calculateTotalBorrowingCost(
    Math.min(requestedAmount, safeAmountCap || requestedAmount),
    totalInterest,
    processingFee,
  );

  let verdict: Verdict = decision.verdict;
  const requestedExceedsSafeCap = requestedAmount > safeAmountCap && safeAmountCap > 0;
  const requestedNearSafeCap = requestedAmount > 0 && requestedAmount > safeAmountCap * 0.9 && requestedAmount <= safeAmountCap;

  if (requestedExceedsSafeCap || requestedNearSafeCap) {
    verdict = "BORROW_LESS";
  }

  const debtStress = detectDebtStress(profile);
  if (debtStress.severe && (requestedAmount > safeAmountCap || requestedAmount > safeAmountCap * 0.8)) {
    verdict = "DONT_BORROW";
  }

  const explanation = {
    verdict: `Decision: ${verdict}. ${decision.reason}`,
    safeAmount: `The safe amount is capped by affordability and keeps a monthly buffer in place.`,
    lenderLikelyAmount: `This represents an indicative figure a lender may consider, not a guarantee.`,
    rateBand: `The fair range reflects income type, credit profile, and current obligations.`,
    safeEmi: `The EMI ceiling is the more conservative of FOIR and disposable-income capacity.`,
    stress: stress.warning ?? "The loan remains manageable under the standard stress case.",
    confidence: `Confidence is ${confidence.label.toLowerCase()} because the profile is partly complete and some information is missing or uncertain.`,
    product: product.reason,
  };

  const safeAmount = Math.max(0, Math.min(requestedAmount, safeAmountCap));
  const lenderLikelyAmount = Math.max(0, Math.min(requestedAmount, lenderLikelyAmountCap));

  return {
    verdict,
    verdictReasons: [decision.reason],
    recommendedProduct: product.type,
    productReason: product.reason,
    requestedAmount,
    safeAmount,
    lenderLikelyAmount,
    recommendedAmount: decision.recommendedAmount,
    safeEmi,
    lenderLikelyEmi,
    rateRange,
    processingFee,
    estimatedAprPercent: calculateEstimatedApr(overrideRatePercent, requestedAmount, processingFee, preferredTenureMonths),
    totalCost,
    tenureMonths: preferredTenureMonths,
    tenureOptions: [
      { tenureMonths: 36, emi: calculateEmi(requestedAmount, overrideRatePercent, 36), totalInterest: calculateTotalInterest(requestedAmount, overrideRatePercent, 36) },
      { tenureMonths: preferredTenureMonths, emi: calculateEmi(requestedAmount, overrideRatePercent, preferredTenureMonths), totalInterest: calculateTotalInterest(requestedAmount, overrideRatePercent, preferredTenureMonths) },
      { tenureMonths: Math.min(getTenureLimit(product.type), 120), emi: calculateEmi(requestedAmount, overrideRatePercent, Math.min(getTenureLimit(product.type), 120)), totalInterest: calculateTotalInterest(requestedAmount, overrideRatePercent, Math.min(getTenureLimit(product.type), 120)) },
    ],
    stress,
    confidenceScore: confidence.score,
    confidence: confidence.label,
    missingInfo: [
      ...(profile.creditScore === null ? ["credit score"] : []),
      ...(profile.householdExpenses === null ? ["household expenses"] : []),
      ...(profile.emergencySavings === null ? ["emergency savings"] : []),
    ],
    explanations: explanation,
    negotiationPoints: [
      "Ask for the all-in cost including processing fee and extras.",
      "Keep the EMI below the safe ceiling.",
      "Negotiate for a rate within the fair band.",
    ],
    redFlags: [
      ...(debtStress.severe ? ["High existing debt burden"] : []),
      ...(stress.warning ? ["Stress scenario becomes unsafe"] : []),
      ...(requestedAmount > safeAmount ? ["Requested amount exceeds safe threshold"] : []),
    ],
  };
}

export function getDemoPersona(name: string) {
  const key = name.toLowerCase();
  return PERSONA_PROFILES[key] ?? PERSONA_PROFILES.priya;
}
