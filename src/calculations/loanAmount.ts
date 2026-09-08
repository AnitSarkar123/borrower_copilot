import { calculateEmi } from "./emi";

export function principalFromEmi(
  affordableEmi: number,
  annualRatePercent: number,
  months: number,
): number {
  if (!Number.isFinite(affordableEmi) || affordableEmi <= 0) return 0;
  if (!Number.isFinite(months) || months <= 0) return 0;

  const monthlyRate = annualRatePercent / 100 / 12;

  if (monthlyRate === 0) {
    return affordableEmi * months;
  }

  const factor = Math.pow(1 + monthlyRate, months);
  return (affordableEmi * (factor - 1)) / (monthlyRate * factor);
}

export function lenderLikelyAmountFromEmi(
  comfortableEmi: number,
  ratePercent: number,
  months: number,
): number {
  return principalFromEmi(comfortableEmi, ratePercent, months);
}
