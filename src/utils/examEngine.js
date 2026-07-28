import examsDatabase from "../data/exams";

export function getExams(careerId) {
  return examsDatabase[careerId] || [];
}