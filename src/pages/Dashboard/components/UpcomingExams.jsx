import {
    Calendar,
    Clock,
    Monitor,
    ArrowRight,
} from "lucide-react";

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import examsDatabase from "../../../data/exams";

function UpcomingExams() {
    const navigate = useNavigate();

    // ==================================================
    // FIND UPCOMING EXAMS
    // ==================================================

    const exams = useMemo(() => {
        const allExams =
            Array.isArray(
                examsDatabase?.all
            )
                ? examsDatabase.all
                : [];

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        return allExams
            .map((exam) => {
                const rawDate =
                    exam?.examDate ||
                    exam?.date ||
                    exam?.exam_date;

                if (!rawDate) {
                    return null;
                }

                const examDate =
                    new Date(rawDate);

                if (
                    Number.isNaN(
                        examDate.getTime()
                    )
                ) {
                    return null;
                }

                examDate.setHours(
                    0,
                    0,
                    0,
                    0
                );

                return {
                    ...exam,
                    __examDate:
                        examDate,
                };
            })
            .filter(Boolean)
            .filter(
                (exam) =>
                    exam.__examDate >=
                    today
            )
            .sort(
                (a, b) =>
                    a.__examDate -
                    b.__examDate
            )
            .slice(0, 10);
    }, []);

    // ==================================================
    // OPEN EXAM DETAILS
    // ==================================================

    const handleExamDetails = (
        exam
    ) => {
        if (!exam?.id) {
            return;
        }

        navigate(
            `/exams/${encodeURIComponent(
                exam.id
            )}`
        );
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 h-full min-h-full flex flex-col">

            {/* HEADER */}

            <div className="flex items-center gap-3 mb-6 shrink-0">

                <Calendar
                    className="text-red-500"
                />

                <div className="min-w-0">

                    <h2 className="text-2xl font-bold">
                        Entrance Exams
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Upcoming opportunities
                    </p>

                </div>

            </div>

            {/* EMPTY STATE */}

            {exams.length === 0 ? (

                <div className="flex-1 flex items-center justify-center text-center">

                    <div>

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">

                            <Calendar
                                className="text-red-400"
                                size={30}
                            />

                        </div>

                        <h3 className="mt-5 text-lg font-bold text-gray-800">
                            No Upcoming Exams
                        </h3>

                        <p className="mt-2 text-sm text-gray-500 max-w-xs">
                            There are no upcoming
                            exams available in
                            the current database.
                        </p>

                    </div>

                </div>

            ) : (

                <div className="space-y-5 flex-1 overflow-y-auto pr-2 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                    {exams.map((exam) => (

                        <div
                            key={exam.id}
                            className="border rounded-2xl p-5 hover:border-red-500 transition"
                        >

                            <h3 className="text-lg font-bold">
                                {exam.name}
                            </h3>

                            {exam.eligibility && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {exam.eligibility}
                                </p>
                            )}

                            <div className="flex items-center gap-2 mt-3 text-gray-600">

                                <Calendar
                                    size={16}
                                />

                                <span>
                                    {exam.__examDate.toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </span>

                            </div>

                            {exam.mode && (
                                <div className="flex items-center gap-2 mt-2 text-gray-600">

                                    <Monitor
                                        size={16}
                                    />

                                    {exam.mode}

                                </div>
                            )}

                            {exam.duration && (
                                <div className="flex items-center gap-2 mt-2 text-gray-600">

                                    <Clock
                                        size={16}
                                    />

                                    {exam.duration}

                                </div>
                            )}

                            <div className="mt-4 flex justify-between items-center gap-4">

                                <span className="text-sm text-blue-600 font-medium truncate">
                                    {exam.conductedBy ||
                                        "Exam Authority"}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleExamDetails(
                                            exam
                                        )
                                    }
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold shrink-0"
                                >
                                    Details

                                    <ArrowRight
                                        size={16}
                                    />

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default UpcomingExams;