
import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    BookmarkCheck,
    RefreshCw,
    BriefcaseBusiness,
    AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import JobCard from "./JobCard";

import {
    getSavedJobs,
} from "../../services/savedJobsService";

function SavedJobsPage() {
    const navigate = useNavigate();

    // ======================================================
    // STATE
    // ======================================================

    const [savedJobs, setSavedJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    // ======================================================
    // LOAD SAVED JOBS
    // ======================================================

    const loadSavedJobs = useCallback(
        async ({
            showLoading = true,
        } = {}) => {
            try {
                await Promise.resolve();

                if (showLoading) {
                    setLoading(true);
                } else {
                    setRefreshing(true);
                }

                setError("");

                const jobs =
                    await getSavedJobs();

                setSavedJobs(
                    Array.isArray(jobs)
                        ? jobs
                        : []
                );
            } catch (err) {
                console.error(
                    "CareerOS SavedJobsPage Error:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load saved jobs."
                );

                setSavedJobs([]);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        let cancelled = false;

        const loadInitialJobs = async () => {
            try {
                await Promise.resolve();

                if (cancelled) {
                    return;
                }

                setLoading(true);
                setError("");

                const jobs =
                    await getSavedJobs();

                if (cancelled) {
                    return;
                }

                setSavedJobs(
                    Array.isArray(jobs)
                        ? jobs
                        : []
                );
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "CareerOS SavedJobsPage Error:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load saved jobs."
                );

                setSavedJobs([]);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitialJobs();

        return () => {
            cancelled = true;
        };
    }, []);

    // ======================================================
    // GLOBAL SAVED JOB SYNCHRONIZATION
    // ======================================================

    useEffect(() => {
        const handleSavedJobsChanged =
            (event) => {
                const detail =
                    event?.detail || {};

                const changedJobId =
                    String(
                        detail?.jobId || ""
                    );

                const changedSaved =
                    detail?.saved;

                if (!changedJobId) {
                    return;
                }

                // --------------------------------------------------
                // JOB WAS UNSAVED
                // --------------------------------------------------

                if (
                    changedSaved === false
                ) {
                    setSavedJobs(
                        (currentJobs) =>
                            currentJobs.filter(
                                (job) =>
                                    String(
                                        job?.id
                                    ) !==
                                    changedJobId
                            )
                    );

                    return;
                }

                // --------------------------------------------------
                // JOB WAS SAVED
                // --------------------------------------------------

                if (
                    changedSaved === true &&
                    detail?.job
                ) {
                    setSavedJobs(
                        (currentJobs) => {
                            const exists =
                                currentJobs.some(
                                    (job) =>
                                        String(
                                            job?.id
                                        ) ===
                                        changedJobId
                                );

                            if (exists) {
                                return currentJobs;
                            }

                            return [
                                detail.job,
                                ...currentJobs,
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
    }, []);

    // ======================================================
    // VIEW JOB
    // ======================================================

    const handleViewJob = (job) => {
        if (!job?.id) {
            return;
        }

        navigate(
            `/jobs/${encodeURIComponent(
                job.id
            )}`
        );
    };

    // ======================================================
    // SAVED STATE CHANGE
    // ======================================================

    const handleSavedChange = (
        job,
        saved
    ) => {
        if (!saved) {
            setSavedJobs(
                (currentJobs) =>
                    currentJobs.filter(
                        (currentJob) =>
                            String(
                                currentJob?.id
                            ) !==
                            String(
                                job?.id
                            )
                    )
            );

            return;
        }

        if (job) {
            setSavedJobs(
                (currentJobs) => {
                    const exists =
                        currentJobs.some(
                            (currentJob) =>
                                String(
                                    currentJob?.id
                                ) ===
                                String(
                                    job?.id
                                )
                        );

                    if (exists) {
                        return currentJobs;
                    }

                    return [
                        job,
                        ...currentJobs,
                    ];
                }
            );
        }
    };

    // ======================================================
    // REFRESH
    // ======================================================

    const handleRefresh = () => {
        void loadSavedJobs({
            showLoading: false,
        });
    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="min-h-screen bg-slate-100 py-10">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                            <BookmarkCheck
                                size={25}
                            />
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                                Saved Jobs
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Jobs you saved for later.
                            </p>
                        </div>

                    </div>

                    {!loading &&
                        savedJobs.length >
                            0 && (
                            <button
                                type="button"
                                onClick={
                                    handleRefresh
                                }
                                disabled={
                                    refreshing
                                }
                                className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 px-5 py-3 rounded-xl font-semibold transition"
                            >
                                <RefreshCw
                                    size={17}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                {refreshing
                                    ? "Refreshing..."
                                    : "Refresh"}
                            </button>
                        )}
                </div>

                {/* SUMMARY */}

                {!loading &&
                    !error && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-6">
                            <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                                    <BookmarkCheck
                                        size={18}
                                    />
                                </div>

                                <div>
                                    <p className="font-semibold text-blue-900">
                                        {savedJobs.length}{" "}
                                        {savedJobs.length ===
                                        1
                                            ? "saved job"
                                            : "saved jobs"}
                                    </p>

                                    <p className="text-sm text-blue-700 mt-1">
                                        Your saved opportunities
                                        are kept here so you can
                                        review them later.
                                    </p>
                                </div>

                            </div>
                        </div>
                    )}

                {/* ERROR */}

                {!loading &&
                    error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 mb-6">

                            <div className="flex items-start gap-3">

                                <AlertCircle
                                    size={22}
                                    className="shrink-0 mt-0.5"
                                />

                                <div>

                                    <p className="font-semibold">
                                        Unable to load saved jobs
                                    </p>

                                    <p className="text-sm mt-1">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            void loadSavedJobs()
                                        }
                                        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                                    >
                                        Try Again
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}

                {/* LOADING */}

                {loading && (
                    <div className="grid md:grid-cols-2 gap-6">

                        {Array.from({
                            length: 4,
                        }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-3xl shadow p-6 animate-pulse"
                                >

                                    <div className="flex justify-between">

                                        <div className="w-3/4">
                                            <div className="h-6 bg-gray-200 rounded" />

                                            <div className="h-4 bg-gray-200 rounded w-1/2 mt-3" />
                                        </div>

                                        <div className="h-10 w-10 bg-gray-200 rounded-xl" />

                                    </div>

                                    <div className="space-y-3 mt-6">

                                        <div className="h-4 bg-gray-200 rounded" />

                                        <div className="h-4 bg-gray-200 rounded w-5/6" />

                                        <div className="h-4 bg-gray-200 rounded w-2/3" />

                                        <div className="h-4 bg-gray-200 rounded w-1/2" />

                                    </div>

                                    <div className="h-10 bg-gray-200 rounded-xl mt-6" />

                                </div>
                            )
                        )}

                    </div>
                )}

                {/* EMPTY STATE */}

                {!loading &&
                    !error &&
                    savedJobs.length ===
                        0 && (
                        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

                            <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
                                <BookmarkCheck
                                    size={42}
                                />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mt-6">
                                No saved jobs yet
                            </h2>

                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                When you find a job you
                                want to keep, click the
                                bookmark icon on the job
                                card and it will appear here.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/jobs"
                                    )
                                }
                                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                            >
                                Browse Jobs
                            </button>

                        </div>
                    )}

                {/* SAVED JOB LIST */}

                {!loading &&
                    !error &&
                    savedJobs.length >
                        0 && (
                        <div className="grid md:grid-cols-2 gap-6">

                            {savedJobs.map(
                                (
                                    job,
                                    index
                                ) => (
                                    <JobCard
                                        key={
                                            job?.id ||
                                            `${job?.title}-${index}`
                                        }
                                        job={
                                            job
                                        }
                                        match={
                                            job?.match ||
                                            null
                                        }
                                        onView={() =>
                                            handleViewJob(
                                                job
                                            )
                                        }
                                        onSavedChange={
                                            handleSavedChange
                                        }
                                    />
                                )
                            )}

                        </div>
                    )}

                {/* FOOTER INFORMATION */}

                {!loading &&
                    !error &&
                    savedJobs.length >
                        0 && (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-10">

                            <BriefcaseBusiness
                                size={16}
                            />

                            <span>
                                Saved jobs are available
                                for review until you
                                remove them.
                            </span>

                        </div>
                    )}

            </div>
        </div>
    );
}

export default SavedJobsPage;
