import {
    ArrowLeft,
    Calendar,
    Clock,
    ExternalLink,
    GraduationCap,
    Monitor,
    Building2,
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getExamById,
} from "../../utils/examEngine";

function ExamDetails() {
    const { id } = useParams();

    const navigate = useNavigate();

    const exam =
        getExamById(id);

    // ======================================================
    // NOT FOUND
    // ======================================================

    if (!exam) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center max-w-lg w-full">

                    <div className="text-5xl mb-4">
                        📚
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Exam Not Found
                    </h1>

                    <p className="text-gray-500 mt-3">
                        The requested exam could not be found.
                    </p>

                    <Link
                        to="/exams"
                        className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >
                        View All Exams
                    </Link>

                </div>

            </div>
        );
    }

    // ======================================================
    // DATE
    // ======================================================

    const formattedDate =
        exam.examDate
            ? new Date(
                exam.examDate
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            )
            : "To be announced";

    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div className="min-h-screen bg-slate-100 py-10 sm:py-12">

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold mb-6 transition"
                >
                    <ArrowLeft size={18} />

                    Back
                </button>

                {/* HERO */}

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

                    <div className="p-8 sm:p-10">

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                            <div>

                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                                    {exam.status ||
                                        "Exam"}
                                </span>

                                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4">
                                    {exam.name}
                                </h1>

                                <p className="text-gray-500 mt-3 max-w-2xl">
                                    {exam.description}
                                </p>

                            </div>

                            <div className="text-5xl">
                                🎓
                            </div>

                        </div>

                        {/* INFORMATION */}

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">

                            <InfoCard
                                icon={
                                    <Calendar
                                        size={20}
                                    />
                                }
                                label="Exam Date"
                                value={
                                    formattedDate
                                }
                            />

                            <InfoCard
                                icon={
                                    GraduationCap
                                        ? (
                                            <GraduationCap
                                                size={20}
                                            />
                                        )
                                        : null
                                }
                                label="Eligibility"
                                value={
                                    exam.eligibility
                                }
                            />

                            <InfoCard
                                icon={
                                    <Monitor
                                        size={20}
                                    />
                                }
                                label="Mode"
                                value={
                                    exam.mode
                                }
                            />

                            <InfoCard
                                icon={
                                    <Clock
                                        size={20}
                                    />
                                }
                                label="Duration"
                                value={
                                    exam.duration
                                }
                            />

                            <InfoCard
                                icon={
                                    <Building2
                                        size={20}
                                    />
                                }
                                label="Conducted By"
                                value={
                                    exam.conductedBy
                                }
                            />

                            <InfoCard
                                icon={
                                    <Calendar
                                        size={20}
                                    />
                                }
                                label="Frequency"
                                value={
                                    exam.frequency
                                }
                            />

                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-col sm:flex-row gap-3 mt-10">

                            {exam.applicationLink && (
                                <a
                                    href={
                                        exam.applicationLink
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                                >
                                    Official Website

                                    <ExternalLink
                                        size={17}
                                    />
                                </a>
                            )}

                            {exam.officialWebsite &&
                                exam.officialWebsite !==
                                    exam.applicationLink && (
                                    <a
                                        href={
                                            exam.officialWebsite
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold transition"
                                    >
                                        Visit Exam Portal

                                        <ExternalLink
                                            size={17}
                                        />
                                    </a>
                                )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

// ======================================================
// INFO CARD
// ======================================================

function InfoCard({
    icon,
    label,
    value,
}) {
    return (
        <div className="rounded-2xl bg-slate-50 border border-gray-100 p-5">

            <div className="flex items-center gap-3 text-blue-600">

                {icon}

                <span className="text-sm font-semibold">
                    {label}
                </span>

            </div>

            <p className="text-gray-900 font-semibold mt-3">
                {value ||
                    "Not available"}
            </p>

        </div>
    );
}

export default ExamDetails;