import type { BorrowerProfile } from "../types/borrower";

export type QuestionType = "currency" | "number" | "select" | "boolean";

export interface QuestionDefinition {
  id: keyof BorrowerProfile | "loanType";
  type: QuestionType;
  label: string;
  options?: { label: string; value: string }[];
  helpText?: string;
}

export const QUESTION_DEFS: QuestionDefinition[] = [
  {
    id: "incomeType",
    type: "select",
    label: "What is your income type?",
    options: [
      { label: "Salaried", value: "salaried" },
      { label: "Self-employed", value: "self_employed" },
      { label: "Informal / variable income", value: "informal" },
    ],
    helpText: "This affects the affordability assumptions and the fair rate range.",
  },
  {
    id: "monthlyIncome",
    type: "currency",
    label: "What is your monthly net income?",
    helpText: "Use your take-home income after deductions.",
  },
  {
    id: "incomeYears",
    type: "number",
    label: "How many years of income history do you have?",
    helpText: "This affects stability and confidence.",
  },
  {
    id: "householdExpenses",
    type: "currency",
    label: "What are your monthly household expenses?",
    helpText: "Include rent, groceries, utilities, and dependents where relevant.",
  },
  {
    id: "existingEmi",
    type: "currency",
    label: "What is your total existing EMI?",
    helpText: "Include all current monthly loan obligations.",
  },
  {
    id: "requestedAmount",
    type: "currency",
    label: "How much do you want to borrow?",
    helpText: "This is your requested principal amount.",
  },
  {
    id: "purpose",
    type: "select",
    label: "What is the loan purpose?",
    options: [
      { label: "Wedding", value: "wedding" },
      { label: "Business expansion", value: "business_expansion" },
      { label: "Income-generating vehicle", value: "vehicle_income" },
      { label: "Personal vehicle", value: "vehicle_personal" },
      { label: "Home", value: "home" },
      { label: "Education", value: "education" },
      { label: "Medical", value: "medical" },
      { label: "Debt repayment", value: "debt_repayment" },
      { label: "Other", value: "personal_other" },
    ],
  },
  {
    id: "creditScore",
    type: "number",
    label: "What is your credit score? (if known)",
    helpText: "If you do not know it, leave it blank and the app will widen the range.",
  },
  {
    id: "emergencySavings",
    type: "currency",
    label: "How much emergency savings do you have?",
    helpText: "This affects resilience and confidence.",
  },
  {
    id: "hasCollateral",
    type: "boolean",
    label: "Do you have meaningful unencumbered collateral?",
    helpText: "For example, owned property or a business asset.",
  },
];
