import examsDatabase from "../data/exams";

// ======================================================
// NORMALIZE EXAM DATABASE
// ======================================================

function getExamList() {
    // If data/exams exports an array directly
    if (Array.isArray(examsDatabase)) {
        return examsDatabase;
    }

    // If data/exams exports { all: [...] }
    if (
        examsDatabase &&
        Array.isArray(examsDatabase.all)
    ) {
        return examsDatabase.all;
    }

    return [];
}

// ======================================================
// GET EXAMS FOR CAREER
// ======================================================

export function getExams(careerId) {
    if (
        examsDatabase &&
        !Array.isArray(examsDatabase) &&
        Array.isArray(examsDatabase[careerId])
    ) {
        return examsDatabase[careerId];
    }

    return [];
}

// ======================================================
// GET ALL EXAMS
// ======================================================

export function getAllExams() {
    const exams = getExamList();

   

    return exams;
}

// ======================================================
// GET EXAM BY ID
// ======================================================

export function getExamById(id) {
    const exams = getExamList();

    return exams.find(
        (exam) =>
            String(exam.id) === String(id)
    );
}