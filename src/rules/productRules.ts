import type { BorrowerProfile, LoanType } from "../types/borrower";

export function getRecommendedProduct(profile: BorrowerProfile): { type: LoanType; reason: string } {
  const hasStrongCollateral =
    profile.hasCollateral === true &&
    (profile.requestedAmount >= 1000000 || (profile.collateralValue ?? 0) >= 1500000);

  if (profile.incomeType === "self_employed" && hasStrongCollateral) {
    return {
      type: "lap",
      reason: "Established business income and collateral suggest a secured route may be more suitable than an unsecured personal loan.",
    };
  }

  if (profile.purpose === "business_expansion") {
    return {
      type: "business",
      reason: "The purpose supports a business or income-generating borrowing route.",
    };
  }

  if (profile.purpose === "vehicle_income" || profile.purpose === "vehicle_personal") {
    return { type: "two_wheeler", reason: "This is aligned with a vehicle-loan product." };
  }

  if (profile.purpose === "home") {
    return { type: "home", reason: "Home purpose usually fits a home-loan route." };
  }

  return { type: "personal", reason: "A personal loan is a general unsecured route for the current profile." };
}
