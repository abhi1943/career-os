
import { useState } from "react";
import assessmentQuestions from "../../data/assessmentQuestions";

function CareerAssessment() {
    const [answers, setAnswers] = useState({});
    const [recommendation, setRecommendation] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // ======================================================
    // SELECT ANSWER
    // ======================================================

    const handleSelect = (key, value) => {
        setAnswers((previousAnswers) => ({
            ...previousAnswers,
            [key]: value,
        }));

        // If the user changes an answer after submitting,
        // allow the recommendation to be generated again.
        setSubmitted(false);
        setRecommendation("");
    };

    // ======================================================
    // GENERATE RECOMMENDATION
    // ======================================================

    const generateRecommendation = () => {
        const {
            education,
            subject,
            interest,
            work,
            salary,
            goal,
        } = answers;

        // --------------------------------------------------
        // Strong career matches
        // --------------------------------------------------

        if (
            subject === "Computers" ||
            interest === "Programming"
        ) {
            return "Software Engineer";
        }

        if (
            subject === "Biology" ||
            interest === "Helping People"
        ) {
            return "Healthcare Professional";
        }

        if (
            subject === "Commerce" ||
            interest === "Business"
        ) {
            return "Business Analyst";
        }

        if (
            subject === "Arts" ||
            interest === "Design"
        ) {
            return "UI/UX Designer";
        }

        if (
            interest === "Teaching"
        ) {
            return "Teacher / Educator";
        }

        if (
            interest === "Research" ||
            work === "Field Work"
        ) {
            return "Research Professional";
        }

        if (
            goal === "Government Job"
        ) {
            return "Government Officer";
        }

        if (
            education === "Diploma"
        ) {
            return "Technical Professional";
        }

        if (
            salary === "20+ LPA"
        ) {
            return "Technology / Management Professional";
        }

        // --------------------------------------------------
        // Default recommendation
        // --------------------------------------------------

        return "Software Engineer";
    };

    // ======================================================
    // SUBMIT
    // ======================================================

    const handleSubmit = () => {
        const answeredQuestions =
            Object.keys(answers).length;

        if (
            answeredQuestions !==
            assessmentQuestions.length
        ) {
            alert("Please answer all questions.");
            return;
        }

        const result =
            generateRecommendation();

        setRecommendation(result);
        setSubmitted(true);

        // --------------------------------------------------
        // SAVE ASSESSMENT
        // --------------------------------------------------

        try {
            localStorage.setItem(
                "careerAssessment",
                JSON.stringify({
                    answers,
                    recommendation: result,
                    completedAt:
                        new Date().toISOString(),
                })
            );
        } catch {
            // Local storage may be unavailable.
        }
    };

    // ======================================================
    // RESET
    // ======================================================

    const handleReset = () => {
        setAnswers({});
        setRecommendation("");
        setSubmitted(false);

        try {
            localStorage.removeItem(
                "careerAssessment"
            );
        } catch {
            // Local storage may be unavailable.
        }
    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <section className="min-h-screen bg-slate-100 py-14 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-10">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Career Finder
                    </h1>

                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                        Answer a few questions about your education,
                        interests and career goals to discover a
                        suitable career direction.
                    </p>
                </div>

                {/* ==================================================
                    QUESTIONS
                ================================================== */}

                <div className="space-y-10">

                    {assessmentQuestions.map(
                        (question, index) => (
                            <div
                                key={question.id}
                                className="border-b border-gray-100 pb-8 last:border-b-0"
                            >

                                <h2 className="font-semibold text-lg sm:text-xl text-gray-900 mb-5">
                                    {index + 1}.{" "}
                                    {question.question}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                    {question.options.map(
                                        (option) => {
                                            const isSelected =
                                                answers[
                                                    question.key
                                                ] === option;

                                            return (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelect(
                                                            question.key,
                                                            option
                                                        )
                                                    }
                                                    className={`w-full border rounded-xl py-3 px-4 text-left font-medium transition duration-200 ${
                                                        isSelected
                                                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                                            : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>
                                                            {option}
                                                        </span>

                                                        {isSelected && (
                                                            <span className="font-bold">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )}

                                </div>
                            </div>
                        )
                    )}

                </div>

                {/* ==================================================
                    ACTION BUTTONS
                ================================================== */}

                <div className="mt-10 flex flex-col sm:flex-row gap-4">

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition"
                    >
                        Get My Recommendation
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="sm:w-32 border border-gray-300 hover:bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold transition"
                    >
                        Reset
                    </button>

                </div>

                {/* ==================================================
                    RECOMMENDATION
                ================================================== */}

                {submitted && recommendation && (
                    <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8 text-center">

                        <div className="text-4xl mb-4">
                            🎯
                        </div>

                        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                            Your Recommended Career
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                            {recommendation}
                        </h2>

                        <p className="text-gray-600 mt-3">
                            Based on your education, interests,
                            preferred work style, salary expectations
                            and career goals.
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    window.location.href =
                                        `/career/${encodeURIComponent(
                                            recommendation
                                                .toLowerCase()
                                                .replace(
                                                    /\s+/g,
                                                    "-"
                                                )
                                        )}`
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                            >
                                Explore This Career
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="border border-gray-300 hover:bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold transition"
                            >
                                Retake Assessment
                            </button>

                        </div>

                    </div>
                )}

            </div>
        </section>
    );
}

export default CareerAssessment;
  
