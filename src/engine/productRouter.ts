import type { BorrowerProfile } from "../types/borrower";
import type { LoanType } from "../types/borrower";

export function routeProduct(profile: BorrowerProfile): { type: LoanType; reason: string } {
  if (profile.incomeType === "self_employed" && profile.hasCollateral && profile.requestedAmount >= 800000) {
    return {
      type: "lap",
      reason: "Your business history and collateral suggest a secured loan may be more suitable than an unsecured personal loan.",
    };
  }

  if (profile.purpose === "business_expansion" || profile.purpose === "vehicle_income") {
    return {
      type: "business",
      reason: "The purpose is income-generating and business-oriented.",
    };
  }

  if (profile.purpose === "home") {
    return { type: "home", reason: "Home purpose fits a housing loan route." };
  }

  if (profile.purpose === "vehicle_personal") {
    return { type: "two_wheeler", reason: "This is aligned with a vehicle loan." };
  }

  return { type: "personal", reason: "A personal loan is the general route for this profile." };
}
