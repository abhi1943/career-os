import {
    ArrowRight,
    Calendar,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

function ExamCard({ exam }) {
    return (
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6">

            <div className="flex items-start justify-between gap-4">

                <h3 className="text-2xl font-bold text-slate-800">
                    {exam.name}
                </h3>

                {exam.status && (
                    <span
                        className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                            exam.status ===
                            "Registration Open"
                                ? "bg-green-100 text-green-700"
                                : exam.status ===
                                  "Upcoming"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {exam.status}
                    </span>
                )}

            </div>

            <p className="mt-4 text-gray-600">
                🎓 <strong>Eligibility:</strong>{" "}
                {exam.eligibility}
            </p>

            <p className="mt-2 text-blue-600">
                🏛 <strong>Conducted By:</strong>{" "}
                {exam.conductedBy}
            </p>

            <p className="mt-2 text-gray-600">
                💻 <strong>Mode:</strong>{" "}
                {exam.mode}
            </p>

            <p className="mt-2 text-gray-600">
                ⏳ <strong>Duration:</strong>{" "}
                {exam.duration}
            </p>

            <p className="mt-2 text-gray-600">
                🔄 <strong>Frequency:</strong>{" "}
                {exam.frequency}
            </p>

            {exam.examDate && (
                <div className="mt-4 flex items-center gap-2 text-gray-600">

                    <Calendar size={17} />

                    <span>
                        {new Date(
                            exam.examDate
                        ).toLocaleDateString(
                            "en-IN",
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            }
                        )}
                    </span>

                </div>
            )}

            <p className="mt-4 text-gray-500">
                {exam.description}
            </p>

            <Link
                to={`/exams/${encodeURIComponent(
                    exam.id
                )}`}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
                View Exam

                <ArrowRight size={18} />

            </Link>

        </div>
    );
}

export default ExamCard;