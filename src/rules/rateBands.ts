import type { BorrowerProfile, LoanType } from "../types/borrower";
import type { RateRange } from "../types/loan";

function clampRate(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function getRateRange(profile: BorrowerProfile, loanType: LoanType): RateRange {
  const score = profile.creditScore;
  const base: Record<LoanType, { min: number; max: number }> = {
    personal: { min: 10, max: 24 },
    two_wheeler: { min: 9.5, max: 18 },
    home: { min: 7.9, max: 9.8 },
    lap: { min: 9.5, max: 12 },
    business: { min: 11, max: 16 },
    gold: { min: 8, max: 11 },
  };

  let min = base[loanType].min;
  let max = base[loanType].max;

  if (score === null || score === undefined) {
    min = Math.max(0, min - 1.5);
    max = max + 4;
  } else if (score >= 800) {
    min = loanType === "home" ? 7.9 : 10;
    max = loanType === "home" ? 8.8 : 11.5;
  } else if (score >= 750) {
    min = loanType === "home" ? 8.2 : 11;
    max = loanType === "home" ? 9.2 : 12.5;
  } else if (score >= 700) {
    min = loanType === "home" ? 8.7 : 12;
    max = loanType === "home" ? 9.5 : 14;
  } else if (score >= 650) {
    min = loanType === "home" ? 9 : 14;
    max = loanType === "home" ? 9.8 : 17;
  } else {
    min = loanType === "home" ? 9.2 : 18;
    max = loanType === "home" ? 10.2 : 24;
  }

  if (profile.incomeType === "informal") {
    min = Math.max(min, loanType === "home" ? 8.4 : 12);
    max = Math.min(Math.max(max, min + 2), loanType === "home" ? 11.5 : 24);
  }

  if (profile.existingEmi && profile.monthlyIncome) {
    const ratio = (profile.existingEmi / profile.monthlyIncome) * 100;
    if (ratio > 25) {
      max = Math.min(max + 3, 24);
    }
  }

  const expected = (clampRate(min) + clampRate(max)) / 2;

  return { minPercent: clampRate(min), maxPercent: clampRate(max), expectedPercent: expected };
}
