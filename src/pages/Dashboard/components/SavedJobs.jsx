import {
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    Bookmark,
    ArrowRight,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";;

import SaveJobButton from "../../../components/jobs/SaveJobButton";

import {
    getSavedJobs,
} from "../../../services/savedJobsService";

import {
    CareerContext,
} from "../../../context/CareerContext";

import {
    calculateJobMatch,
    getMatchLabel,
} from "../../../utils/jobMatcher";

function SavedJobs() {
    const { student } =
        useContext(CareerContext);

    const [
        savedJobs,
        setSavedJobs,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    // ======================================================
    // GET STABLE JOB ID
    // ======================================================

    const getJobId = useCallback((job) => {
        if (!job) {
            return "";
        }

        return String(
            job?.id ||
            job?.redirect_url ||
            job?.redirectUrl ||
            `${job?.title || ""}-${typeof job?.company === "string"
                ? job.company
                : job?.company?.display_name ||
                job?.company?.name ||
                ""
            }`
        ).trim();
    }, []);

    // ======================================================
    // REMOVE DUPLICATE JOBS
    // ======================================================

    const removeDuplicateJobs = useCallback(
        (jobs = []) => {
            const seen = new Set();

            return jobs.filter((job) => {
                const jobId =
                    getJobId(job);

                if (!jobId) {
                    return false;
                }

                if (seen.has(jobId)) {
                    return false;
                }

                seen.add(jobId);

                return true;
            });
        },
        [getJobId]
    );

    // ======================================================
    // LOAD SAVED JOBS
    // ======================================================

    const loadSavedJobs =
        useCallback(async () => {
            try {
                setLoading(true);

                const jobs =
                    await getSavedJobs();

                const normalizedJobs =
                    Array.isArray(jobs)
                        ? removeDuplicateJobs(
                            jobs
                        )
                        : [];

                setSavedJobs(
                    normalizedJobs
                );
            } catch (error) {
                console.error(
                    "Failed to load saved jobs:",
                    error
                );

                setSavedJobs([]);
            } finally {
                setLoading(false);
            }
        }, [removeDuplicateJobs]);

    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            loadSavedJobs();
        }, 0);

        return () => {
            clearTimeout(timer);
        };
    }, [loadSavedJobs]);

    // ======================================================
    // LISTEN FOR SAVED JOB CHANGES
    // ======================================================

    useEffect(() => {
        const handleSavedJobsChanged = (
            event
        ) => {
            const detail =
                event?.detail || {};

            const changedJobId =
                detail?.jobId;

            const saved =
                detail?.saved;

            const changedJob =
                detail?.job;

            // ==================================================
            // IGNORE EVENTS WITHOUT JOB INFORMATION
            // ==================================================

            if (!changedJobId) {
                return;
            }

            const normalizedJobId =
                String(
                    changedJobId
                ).trim();

            // ==================================================
            // JOB WAS UNSAVED
            // ==================================================

            if (saved === false) {
                setSavedJobs(
                    (currentJobs) =>
                        currentJobs.filter(
                            (job) =>
                                getJobId(
                                    job
                                ) !==
                                normalizedJobId
                        )
                );

                return;
            }

            // ==================================================
            // JOB WAS SAVED
            // ==================================================

            if (
                saved === true &&
                changedJob
            ) {
                setSavedJobs(
                    (currentJobs) => {
                        const alreadyExists =
                            currentJobs.some(
                                (job) =>
                                    getJobId(
                                        job
                                    ) ===
                                    normalizedJobId
                            );

                        if (
                            alreadyExists
                        ) {
                            return currentJobs;
                        }

                        return [
                            ...currentJobs,
                            {
                                ...changedJob,
                                id: normalizedJobId,
                            },
                        ];
                    }
                );
            }
        };

        window.addEventListener(
            "careerOS:savedJobsChanged",
            handleSavedJobsChanged
        );

        return () => {
            window.removeEventListener(
                "careerOS:savedJobsChanged",
                handleSavedJobsChanged
            );
        };
    }, [getJobId]);

    // ======================================================
    // HANDLE SAVE STATE CHANGE
    // ======================================================

    const handleSavedChange = (
        jobId,
        saved,
        changedJob = null
    ) => {
        if (!jobId) {
            return;
        }

        const normalizedJobId =
            String(jobId).trim();

        // ==================================================
        // JOB REMOVED
        // ==================================================

        if (!saved) {
            setSavedJobs(
                (currentJobs) =>
                    currentJobs.filter(
                        (job) =>
                            getJobId(
                                job
                            ) !==
                            normalizedJobId
                    )
            );

            return;
        }

        // ==================================================
        // JOB SAVED
        // ==================================================

        if (
            saved &&
            changedJob
        ) {
            setSavedJobs(
                (currentJobs) => {
                    const alreadyExists =
                        currentJobs.some(
                            (job) =>
                                getJobId(
                                    job
                                ) ===
                                normalizedJobId
                        );

                    if (
                        alreadyExists
                    ) {
                        return currentJobs;
                    }

                    return [
                        ...currentJobs,
                        {
                            ...changedJob,
                            id: normalizedJobId,
                        },
                    ];
                }
            );

            return;
        }

        // ==================================================
        // FALLBACK
        // ==================================================

        loadSavedJobs();
    };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">

                <div className="text-3xl mb-3">
                    🔄
                </div>

                <p className="text-gray-500">
                    Loading saved jobs...
                </p>

            </div>
        );
    }

    // ======================================================
// EMPTY STATE
// ======================================================

if (savedJobs.length === 0) {
    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 h-full min-h-full flex flex-col">

            {/* HEADER */}

            <div className="mb-6">

                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    CareerOS
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    Saved Jobs
                </h2>

            </div>

            {/* EMPTY STATE */}

            <div className="flex-1 flex items-center justify-center text-center">

                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 w-full">

                    <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Bookmark size={26} />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-gray-800">
                        No Saved Jobs Yet
                    </h3>

                    <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                        Save interesting jobs from the Jobs page
                        and they will appear here.
                    </p>

                    <Link
                        to="/jobs"
                        className="inline-flex items-center justify-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
                    >
                        Explore Jobs

                        <ArrowRight size={16} />
                    </Link>

                </div>

            </div>

        </div>
    );
}

    // ======================================================
    // SORT JOBS BY MATCH
    // ======================================================

    const sortedJobs =
        [...savedJobs].sort(
            (a, b) => {
                const scoreA =
                    student
                        ? calculateJobMatch(
                            a,
                            student
                        )?.score || 0
                        : 0;

                const scoreB =
                    student
                        ? calculateJobMatch(
                            b,
                            student
                        )?.score || 0
                        : 0;

                return (
                    scoreB - scoreA
                );
            }
        );

    const previewJobs = sortedJobs.slice(0, 4);

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <section className="h-full min-h-0 flex flex-col">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

                <div>

                    <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                        CareerOS
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900">
                        Saved Jobs
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Your best CareerOS matches appear first.
                    </p>

                </div>

                <div className="flex items-center gap-3">

                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold">
                        {savedJobs.length}{" "}
                        {savedJobs.length === 1
                            ? "Job"
                            : "Jobs"}
                    </div>

                    <Link
                        to="/jobs/saved"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
                    >
                        View All

                        <ArrowRight size={16} />
                    </Link>

                </div>

            </div>

            {/* ==================================================
                JOB GRID
            ================================================== */}

            <div className="grid md:grid-cols-2 gap-5 flex-1 min-h-0 items-stretch">

                {previewJobs.map(
                    (job) => {

                        const jobId =
                            getJobId(job);

                        if (!jobId) {
                            return null;
                        }

                        const match =
                            student
                                ? calculateJobMatch(
                                    job,
                                    student
                                )
                                : null;

                        const matchLabel =
                            match
                                ? getMatchLabel(
                                    match.score
                                )
                                : "";

                        const companyName =
                            typeof job.company ===
                                "string"
                                ? job.company
                                : job.company
                                    ?.display_name ||
                                job.company?.name ||
                                "Company not specified";

                        const locationName =
                            typeof job.location ===
                                "string"
                                ? job.location
                                : job.location
                                    ?.display_name ||
                                job.location?.name ||
                                "Location not specified";

                        return (
                            <div
                                key={jobId}
                                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition h-full flex flex-col"
                            >

                                {/* ==================================================
                                    HEADER
                                ================================================== */}

                                <div className="flex items-start justify-between gap-4">

                                    <div className="min-w-0">

                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                                            {job.title ||
                                                "Job Opportunity"}
                                        </h3>

                                        <p className="text-blue-600 font-semibold mt-1">
                                            {companyName}
                                        </p>

                                    </div>

                                    {/* ==================================================
                                        SAVED BUTTON
                                    ================================================== */}

                                    <SaveJobButton
                                        job={{
                                            ...job,
                                            id: jobId,
                                        }}
                                        compact
                                        onSavedChange={
                                            handleSavedChange
                                        }
                                    />

                                </div>

                                {/* ==================================================
                                    JOB INFORMATION
                                ================================================== */}

                                <div className="flex flex-wrap gap-2 mt-4">

                                    <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                                        📍{" "}
                                        {locationName}
                                    </span>

                                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                                        👨‍💻{" "}
                                        {job.detected_experience ||
                                            job.experience ||
                                            "Any Experience"}
                                    </span>

                                    <span className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm">
                                        🏢{" "}
                                        {job.detected_work_mode ||
                                            job.workMode ||
                                            "Not Specified"}
                                    </span>

                                </div>

                                {/* ==================================================
                                    MATCH
                                ================================================== */}

                                {student &&
                                    match && (
                                        <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl p-3 mt-4">

                                            <div>

                                                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                                                    CareerOS Match
                                                </p>

                                                <p className="font-bold text-gray-800">
                                                    {matchLabel}
                                                </p>

                                            </div>

                                            <div className="text-2xl font-extrabold text-blue-600">
                                                {
                                                    match.score
                                                }
                                                %
                                            </div>

                                        </div>
                                    )}

                                {/* ==================================================
                                    DESCRIPTION
                                ================================================== */}

                                {job.description && (
                                    <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                                        {
                                            job.description
                                        }
                                    </p>
                                )}

                                {/* ==================================================
                                    ACTIONS
                                ================================================== */}

                                <div className="flex gap-3 mt-auto pt-5">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.location.href =
                                                `/companies/job/${encodeURIComponent(
                                                    jobId
                                                )}`;
                                        }}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                                    >
                                        View Job →
                                    </button>

                                    {job.redirect_url && (
                                        <a
                                            href={
                                                job.redirect_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold transition"
                                        >
                                            Apply Now ↗
                                        </a>
                                    )}

                                </div>

                            </div>
                        );
                    }
                )}

            </div>

        </section>
    );
}

export default SavedJobs;