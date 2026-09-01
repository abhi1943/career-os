import {
    Search,
    Calendar,
    GraduationCap,
    ArrowRight,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    getAllExams,
} from "../../utils/examEngine";

function Exams() {
    const [search, setSearch] = useState("");

    // ======================================================
    // LOAD ALL EXAMS
    // ======================================================

    const allExams = useMemo(() => {
        const exams = getAllExams();

        return Array.isArray(exams)
            ? exams
            : [];
    }, []);

    // ======================================================
    // FILTER EXAMS
    // ======================================================

    const filteredExams = useMemo(() => {
        const query =
            search
                .trim()
                .toLowerCase();

        if (!query) {
            return allExams;
        }

        return allExams.filter(
            (exam) =>
                exam?.name
                    ?.toLowerCase()
                    .includes(query) ||
                exam?.conductedBy
                    ?.toLowerCase()
                    .includes(query) ||
                exam?.eligibility
                    ?.toLowerCase()
                    .includes(query)
        );
    }, [
        allExams,
        search,
    ]);

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="min-h-screen bg-slate-100 py-16">

            <div className="max-w-7xl mx-auto px-6">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="text-center">

                    <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-5 py-2 rounded-full text-sm font-semibold">
                        <GraduationCap
                            size={17}
                        />

                        EDUCATION
                    </span>

                    <h1 className="text-5xl font-bold text-slate-900 mt-6">
                        Entrance Exams
                    </h1>

                    <p className="text-slate-500 mt-4 text-lg">
                        Explore entrance exams for colleges,
                        universities and professional courses.
                    </p>

                </div>

                {/* ==================================================
                    SEARCH
                ================================================== */}

                <div className="max-w-3xl mx-auto mt-12">

                    <div className="relative">

                        <Search
                            size={20}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search exams..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            className="w-full bg-white border border-gray-200 rounded-2xl px-14 py-5 text-gray-800 outline-none shadow-sm focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                </div>

                {/* ==================================================
                    RESULTS HEADER
                ================================================== */}

                <div className="mt-14">

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

                        <div>

                            <h2 className="text-3xl font-bold text-slate-900">
                                All Entrance Exams
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Explore entrance and competitive
                                exams for colleges, universities
                                and professional courses.
                            </p>

                        </div>

                        <div className="text-blue-600 font-semibold">
                            {filteredExams.length}{" "}
                            {filteredExams.length === 1
                                ? "exam"
                                : "exams"}{" "}
                            available
                        </div>

                    </div>

                </div>

                {/* ==================================================
                    EMPTY STATE
                ================================================== */}

                {filteredExams.length === 0 ? (

                    <div className="bg-white rounded-3xl shadow-sm mt-8 p-16 text-center">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-4xl">
                            🔎
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mt-6">
                            No Exams Found
                        </h3>

                        <p className="text-slate-500 mt-2">
                            Try searching for a different exam.
                        </p>

                    </div>

                ) : (

                    /* ==================================================
                       EXAM GRID
                    ================================================== */

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">

                        {filteredExams.map(
                            (exam) => (

                                <div
                                    key={exam.id}
                                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >

                                    {/* NAME + STATUS */}

                                    <div className="flex items-start justify-between gap-3">

                                        <h3 className="text-xl font-bold text-slate-900">
                                            {exam.name}
                                        </h3>

                                        {exam.status && (
                                            <span
                                                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${exam.status ===
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

                                    {/* ELIGIBILITY */}

                                    <p className="mt-5 text-gray-600 text-sm">
                                        🎓{" "}
                                        <strong>
                                            Eligibility:
                                        </strong>{" "}
                                        {exam.eligibility ||
                                            "Not specified"}
                                    </p>

                                    {/* CONDUCTED BY */}

                                    <p className="mt-2 text-blue-600 text-sm">
                                        🏛{" "}
                                        <strong>
                                            Conducted By:
                                        </strong>{" "}
                                        {exam.conductedBy ||
                                            "Not specified"}
                                    </p>

                                    {/* MODE */}

                                    <p className="mt-2 text-gray-600 text-sm">
                                        💻{" "}
                                        <strong>
                                            Mode:
                                        </strong>{" "}
                                        {exam.mode ||
                                            "Not specified"}
                                    </p>

                                    {/* DURATION */}

                                    <p className="mt-2 text-gray-600 text-sm">
                                        ⏳{" "}
                                        <strong>
                                            Duration:
                                        </strong>{" "}
                                        {exam.duration ||
                                            "Not specified"}
                                    </p>

                                    {/* FREQUENCY */}

                                    <p className="mt-2 text-gray-600 text-sm">
                                        🔄{" "}
                                        <strong>
                                            Frequency:
                                        </strong>{" "}
                                        {exam.frequency ||
                                            "Not specified"}
                                    </p>

                                    {/* DATE */}

                                    {exam.examDate && (
                                        <div className="mt-4 flex items-center gap-2 text-gray-600 text-sm">

                                            <Calendar
                                                size={16}
                                            />

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

                                    {/* DESCRIPTION */}

                                    <p className="mt-4 text-gray-500 text-sm line-clamp-3">
                                        {exam.description}
                                    </p>

                                    {/* DETAILS */}

                                    <Link
                                        to={`/exams/${encodeURIComponent(
                                            exam.id
                                        )}`}
                                        className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
                                    >
                                        View Exam

                                        <ArrowRight
                                            size={17}
                                        />

                                    </Link>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Exams;