import intermediateExams from "./intermediateExams";

import exams, {
    getUpcomingExamCount,
} from "./exams";

const examsDatabase = {
    intermediate: intermediateExams,
    all: exams,
};

export {
    getUpcomingExamCount,
};

export default examsDatabase;