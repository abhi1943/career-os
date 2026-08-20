
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Bookmark,
    BriefcaseBusiness,
    MapPin,
    ExternalLink,
    ArrowRight,
} from "lucide-react";

import SaveJobButton from "../../components/jobs/SaveJobButton";

import {
    getSavedJobs,
} from "../../services/savedJobsService";

import {
    CareerContext,
} from "../../context/CareerContext";

import {
    calculateJobMatch,
    getMatchLabel,
} from "../../utils/jobMatcher";

function SavedJobs() {
    const navigate = useNavigate();

    const { student } = useContext(CareerContext);

    const [savedJobs, setSavedJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    // ======================================================
    // GET STABLE JOB ID
    // ======================================================

    const getJobId = useCallback((job) => {
        if (!job) {
            return "";
        }

        const id =
            job.id ||
            job.job_id ||
            job.jobId ||
            job.redirect_url ||
            job.redirectUrl ||
            `${job.title || ""}-${
                typeof job.company === "string"
                    ? job.company
                    : job.company?.display_name ||
                      job.company?.name ||
                      ""
            }`;

        return String(id).trim();
    }, []);

    // ======================================================
    // REMOVE DUPLICATES
    // ======================================================

    const normalizeJobs = useCallback(
        (jobs = []) => {
            const seen = new Set();

            return jobs.filter((job) => {
                const jobId = getJobId(job);

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

    const loadSavedJobs = useCallback(async () => {
        try {
            /*
             * Yield once before updating state.
             * This avoids React's set-state-in-effect lint
             * rule while still loading immediately.
             */
            await Promise.resolve();

            setLoading(true);

            const jobs = await getSavedJobs();

            const normalizedJobs =
                Array.isArray(jobs)
                    ? normalizeJobs(jobs)
                    : [];

            setSavedJobs(normalizedJobs);
        } catch (error) {
            console.error(
                "CareerOS load saved jobs error:",
                error
            );

            setSavedJobs([]);
        } finally {
            setLoading(false);
        }
    }, [normalizeJobs]);

    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        let cancelled = false;

        const loadInitialSavedJobs = async () => {
            try {
                await Promise.resolve();

                if (cancelled) {
                    return;
                }

                setLoading(true);

                const jobs = await getSavedJobs();

                if (cancelled) {
                    return;
                }

                const normalizedJobs =
                    Array.isArray(jobs)
                        ? normalizeJobs(jobs)
                        : [];

                setSavedJobs(normalizedJobs);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "CareerOS load saved jobs error:",
                    error
                );

                setSavedJobs([]);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitialSavedJobs();

        return () => {
            cancelled = true;
        };
    }, [normalizeJobs]);

    // ======================================================
    // GLOBAL SAVED JOB SYNCHRONIZATION
    // ======================================================

    useEffect(() => {
        const handleSavedJobsChanged = (event) => {
            const detail = event?.detail || {};

            const changedJobId = detail?.jobId;
            const saved = detail?.saved;
            const changedJob = detail?.job;

            if (!changedJobId) {
                return;
            }

            const normalizedJobId =
                String(changedJobId).trim();

            // ==================================================
            // JOB REMOVED
            // ==================================================

            if (saved === false) {
                setSavedJobs((currentJobs) =>
                    currentJobs.filter(
                        (job) =>
                            getJobId(job) !==
                            normalizedJobId
                    )
                );

                return;
            }

            // ==================================================
            // JOB SAVED
            // ==================================================

            if (saved === true && changedJob) {
                setSavedJobs((currentJobs) => {
                    const alreadyExists =
                        currentJobs.some(
                            (job) =>
                                getJobId(job) ===
                                normalizedJobId
                        );

                    if (alreadyExists) {
                        return currentJobs;
                    }

                    return [
                        ...currentJobs,
                        {
                            ...changedJob,
                            id: normalizedJobId,
                        },
                    ];
                });
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
    // HANDLE SAVE CHANGE
    // ======================================================

    const handleSavedChange = useCallback(
        (jobId, saved, changedJob = null) => {
            if (!jobId) {
                return;
            }

            const normalizedJobId =
                String(jobId).trim();

            // ==================================================
            // REMOVED
            // ==================================================

            if (!saved) {
                setSavedJobs((currentJobs) =>
                    currentJobs.filter(
                        (job) =>
                            getJobId(job) !==
                            normalizedJobId
                    )
                );

                return;
            }

            // ==================================================
            // SAVED
            // ==================================================

            if (saved && changedJob) {
                setSavedJobs((currentJobs) => {
                    const alreadyExists =
                        currentJobs.some(
                            (job) =>
                                getJobId(job) ===
                                normalizedJobId
                        );

                    if (alreadyExists) {
                        return currentJobs;
                    }

                    return [
                        ...currentJobs,
                        {
                            ...changedJob,
                            id: normalizedJobId,
                        },
                    ];
                });

                return;
            }

            // ==================================================
            // FALLBACK
            // ==================================================

            void loadSavedJobs();
        },
        [getJobId, loadSavedJobs]
    );

    // ======================================================
    // OPEN JOB DETAILS
    // ======================================================

    const handleViewJob = useCallback(
        (job) => {
            const jobId = getJobId(job);

            if (!jobId) {
                return;
            }

            navigate(
                `/companies/job/${encodeURIComponent(
                    jobId
                )}`
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        },
        [getJobId, navigate]
    );

    // ======================================================
    // SORT BY CAREEROS MATCH
    // ======================================================

    const sortedJobs = useMemo(() => {
        return [...savedJobs].sort((a, b) => {
            const scoreA = student
                ? calculateJobMatch(
                      a,
                      student
                  )?.score || 0
                : 0;

            const scoreB = student
                ? calculateJobMatch(
                      b,
                      student
                  )?.score || 0
                : 0;

            return scoreB - scoreA;
        });
    }, [savedJobs, student]);

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <section className="max-w-6xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-sm">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Bookmark
                            size={28}
                            className="animate-pulse"
                        />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mt-5">
                        Loading Saved Jobs
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Fetching your saved
                        opportunities...
                    </p>
                </div>
            </section>
        );
    }

    // ======================================================
    // EMPTY
    // ======================================================

    if (savedJobs.length === 0) {
        return (
            <section className="max-w-4xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Bookmark size={30} />
                    </div>

                    <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mt-6">
                        CareerOS
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                        No Saved Jobs Yet
                    </h2>

                    <p className="text-gray-500 max-w-md mx-auto mt-3 leading-6">
                        Save jobs that interest you
                        and CareerOS will keep them
                        here for quick access.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/jobs")
                        }
                        className="mt-7 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                        Browse Jobs
                        <ArrowRight size={18} />
                    </button>
                </div>
            </section>
        );
    }

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <section className="max-w-6xl mx-auto">
            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
                <div>
                    <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                        CareerOS
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                        Saved Jobs
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Your saved opportunities,
                        ranked by CareerOS match.
                    </p>
                </div>

                <div className="self-start sm:self-auto bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                    {savedJobs.length}{" "}
                    {savedJobs.length === 1
                        ? "Job"
                        : "Jobs"}{" "}
                    Saved
                </div>
            </div>

            {/* JOB GRID */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {sortedJobs.map((job) => {
                    const jobId = getJobId(job);

                    if (!jobId) {
                        return null;
                    }

                    const match = student
                        ? calculateJobMatch(
                              job,
                              student
                          )
                        : null;

                    const matchLabel = match
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

                    const experience =
                        job.detected_experience ||
                        job.experience ||
                        "Any Experience";

                    const workMode =
                        job.detected_work_mode ||
                        job.workMode ||
                        "Not Specified";

                    const jobType =
                        job.detected_job_type ||
                        job.jobType ||
                        "Not Specified";

                    return (
                        <article
                            key={jobId}
                            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition"
                        >
                            {/* CARD HEADER */}

                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                                        {job.title ||
                                            "Job Opportunity"}
                                    </h3>

                                    <p className="text-blue-600 font-semibold mt-1 truncate">
                                        {companyName}
                                    </p>
                                </div>

                                <div className="shrink-0">
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
                            </div>

                            {/* JOB INFORMATION */}

                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                                    <MapPin size={14} />
                                    {locationName}
                                </span>

                                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                                    <BriefcaseBusiness
                                        size={14}
                                    />
                                    {experience}
                                </span>

                                <span className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm">
                                    {workMode}
                                </span>

                                <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm">
                                    {jobType}
                                </span>
                            </div>

                            {/* MATCH */}

                            {student && match && (
                                <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl p-3 mt-4">
                                    <div>
                                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                                            CareerOS Match
                                        </p>

                                        <p className="font-bold text-gray-800 mt-0.5">
                                            {matchLabel}
                                        </p>
                                    </div>

                                    <div className="text-2xl font-extrabold text-blue-600">
                                        {match.score}%
                                    </div>
                                </div>
                            )}

                            {/* DESCRIPTION */}

                            {job.description && (
                                <p className="text-gray-600 text-sm leading-5 mt-4 line-clamp-3">
                                    {job.description}
                                </p>
                            )}

                            {/* ACTIONS */}

                            <div className="flex flex-col sm:flex-row gap-3 mt-5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleViewJob(
                                            job
                                        )
                                    }
                                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                                >
                                    View Job
                                    <ArrowRight
                                        size={17}
                                    />
                                </button>

                                {job.redirect_url && (
                                    <a
                                        href={
                                            job.redirect_url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold transition"
                                    >
                                        Apply Now
                                        <ExternalLink
                                            size={16}
                                        />
                                    </a>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* FOOTER */}

            <div className="flex justify-center mt-10">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/jobs")
                    }
                    className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition"
                >
                    Browse More Jobs
                    <ArrowRight size={17} />
                </button>
            </div>
        </section>
    );
}

export default SavedJobs;
