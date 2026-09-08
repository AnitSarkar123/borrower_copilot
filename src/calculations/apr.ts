export function calculateEstimatedApr(
  annualRatePercent: number,
  loanAmount: number,
  processingFee: number,
  tenureMonths: number,
): number {
  if (!loanAmount || loanAmount <= 0) return 0;
  const feeComponent = (processingFee / loanAmount) * (12 / tenureMonths);
  return annualRatePercent + feeComponent * 100;
}
