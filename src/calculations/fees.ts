export function calculateProcessingFee(amount: number, feeRate = 0.02): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return amount * feeRate;
}

export function calculateTotalBorrowingCost(
  principal: number,
  interest: number,
  processingFee: number,
  otherCharges = 0,
): number {
  return principal + interest + processingFee + otherCharges;
}
