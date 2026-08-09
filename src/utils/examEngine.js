import examsDatabase from "../data/exams";

export function getExams(careerId) {
  return examsDatabase[careerId] || [];
}

export function getAllExams() {
  return examsDatabase.all || [];
}

export function getExamById(id) {
  return (examsDatabase.all || []).find(
    (exam) => exam.id === id
  );
}