export function calculateEmi(principal: number, annualRatePercent: number, months: number): number {
  if (!Number.isFinite(principal) || principal <= 0) return 0;
  if (!Number.isFinite(months) || months <= 0) return 0;

  const monthlyRate = annualRatePercent / 100 / 12;

  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function calculateTotalInterest(principal: number, annualRatePercent: number, months: number): number {
  const emi = calculateEmi(principal, annualRatePercent, months);
  return emi * months - principal;
}
