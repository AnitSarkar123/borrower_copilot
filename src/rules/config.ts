import type { RuleConfig } from "../types/rules";

export const RULE_CONFIG: RuleConfig = {
  foirLimits: {
    salaried: 0.45,
    self_employed: 0.4,
    informal: 0.35,
  },
  disposableBuffer: 0.8,
  tenureYears: {
    personal: 5,
    two_wheeler: 7,
    home: 30,
    lap: 15,
    business: 10,
    gold: 3,
  },
  stressIncomeDrop: 0.1,
  stressRateIncrease: 0.02,
  confidencePenalties: {
    creditScore: 10,
    incomeHistory: 10,
    householdExpenses: 15,
    emergencySavings: 10,
    incomeVariability: 10,
  },
  processingFeeRate: 0.02,
};
