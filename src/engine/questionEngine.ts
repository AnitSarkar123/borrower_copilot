import type { BorrowerProfile } from "../types/borrower";
import { QUESTION_DEFS } from "../data/questions";

export function getVisibleQuestions(profile: Partial<BorrowerProfile>) {
  const questions = [...QUESTION_DEFS];

  if (profile.incomeType === "salaried") {
    return questions.filter((question) => question.id !== "hasCollateral");
  }

  if (profile.incomeType === "self_employed") {
    return questions.filter((question) => question.id !== "creditScore");
  }

  return questions.filter((question) => question.id !== "incomeYears");
}
