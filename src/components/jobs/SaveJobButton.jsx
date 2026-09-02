
import {
    useEffect,
    useState,
} from "react";

import {
    Bookmark,
    BookmarkCheck,
} from "lucide-react";

import {
    getSavedJobs,
    saveJob,
    removeSavedJob,
} from "../../services/savedJobsService";

import {
    useAuth,
} from "../../context/AuthContext";

// ======================================================
// CAREEROS SAVED JOB CACHE
// ======================================================


let savedJobIdsCache = null;
let savedJobsCacheUserId = "";
let savedJobsLoadPromise = null;

// ======================================================
// GET SAVED JOB ID
// ======================================================

function getSavedJobId(job) {
    if (!job) {
        return "";
    }

    return String(
        job.id ||
            job.jobId ||
            job.job_id ||
            job.redirect_url ||
            job.redirectUrl ||
            job.url ||
            `${job.title || ""}-${
                typeof job.company ===
                "string"
                    ? job.company
                    : job.company?.display_name ||
                      job.company?.name ||
                      ""
            }`
    ).trim();
}

// ======================================================
// LOAD SAVED JOBS ONCE
// ======================================================

async function loadSavedJobsOnce(
    userId
) {
    const normalizedUserId =
        String(
            userId || ""
        ).trim();

    if (!normalizedUserId) {
        savedJobIdsCache =
            new Set();

        savedJobsCacheUserId = "";

        return savedJobIdsCache;
    }

    // --------------------------------------------------
    // RETURN EXISTING CACHE
    // --------------------------------------------------

    if (
        savedJobIdsCache &&
        savedJobsCacheUserId ===
            normalizedUserId
    ) {
        return savedJobIdsCache;
    }

    // --------------------------------------------------
    // RETURN EXISTING REQUEST
    // --------------------------------------------------

    if (
        savedJobsLoadPromise &&
        savedJobsCacheUserId ===
            normalizedUserId
    ) {
        return savedJobsLoadPromise;
    }

    // --------------------------------------------------
    // LOAD COMPLETE SAVED JOB LIST
    // --------------------------------------------------

    savedJobsCacheUserId =
        normalizedUserId;

    savedJobsLoadPromise =
        getSavedJobs()
            .then((jobs) => {
                const nextIds =
                    new Set();

                if (
                    Array.isArray(
                        jobs
                    )
                ) {
                    jobs.forEach(
                        (savedJob) => {
                            const savedJobId =
                                getSavedJobId(
                                    savedJob
                                );

                            if (
                                savedJobId
                            ) {
                                nextIds.add(
                                    savedJobId
                                );
                            }
                        }
                    );
                }

                savedJobIdsCache =
                    nextIds;

                return nextIds;
            })
            .catch((error) => {
                console.error(
                    "CareerOS: Failed to load saved job cache:",
                    error
                );

                savedJobIdsCache =
                    new Set();

                return savedJobIdsCache;
            })
            .finally(() => {
                savedJobsLoadPromise =
                    null;
            });

    return savedJobsLoadPromise;
}

// ======================================================
// SAVE JOB BUTTON
// ======================================================

function SaveJobButton({
    job,
    compact = false,
    onSavedChange,
}) {
    const {
        user,
        authLoading,
    } = useAuth();

    const [saved, setSaved] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [checking, setChecking] =
        useState(true);

    // ==================================================
    // FIREBASE USER ID
    // ==================================================

    const userId =
        user?.uid || "";

    // ==================================================
    // STABLE JOB ID
    // ==================================================

    const jobId =
        getSavedJobId(job);

    // ==================================================
    // CHECK SAVED STATUS FROM SHARED CACHE
    // ==================================================

    useEffect(() => {
        let mounted = true;

        const checkSavedStatus =
            async () => {
                // ==================================================
                // WAIT FOR FIREBASE AUTH
                // ==================================================

                if (authLoading) {
                    if (mounted) {
                        setChecking(true);
                    }

                    return;
                }

                // ==================================================
                // NO AUTHENTICATED USER
                // ==================================================

                if (
                    !userId ||
                    !jobId
                ) {
                    if (mounted) {
                        setSaved(false);
                        setChecking(false);
                    }

                    return;
                }

                try {
                    if (mounted) {
                        setChecking(true);
                    }

                    const savedIds =
                        await loadSavedJobsOnce(
                            userId
                        );

                    if (!mounted) {
                        return;
                    }

                    setSaved(
                        savedIds.has(
                            jobId
                        )
                    );
                } catch (error) {
                    console.error(
                        "CareerOS saved status error:",
                        error
                    );

                    if (mounted) {
                        setSaved(false);
                    }
                } finally {
                    if (mounted) {
                        setChecking(false);
                    }
                }
            };

        checkSavedStatus();

        return () => {
            mounted = false;
        };
    }, [
        authLoading,
        userId,
        jobId,
    ]);

    // ==================================================
    // GLOBAL SAVED JOB SYNCHRONIZATION
    // ==================================================

    useEffect(() => {
        const handleSavedJobsChanged =
            (event) => {
                const detail =
                    event?.detail || {};

                const changedUserId =
                    detail?.userId;

                const changedJobId =
                    String(
                        detail?.jobId || ""
                    ).trim();

                const changedSaved =
                    detail?.saved;

                // --------------------------------------------------
                // IGNORE OTHER USERS
                // --------------------------------------------------

                if (
                    changedUserId &&
                    String(
                        changedUserId
                    ) !==
                        String(
                            userId
                        )
                ) {
                    return;
                }

                // --------------------------------------------------
                // IGNORE OTHER JOBS
                // --------------------------------------------------

                if (
                    !changedJobId ||
                    changedJobId !==
                        String(jobId)
                ) {
                    return;
                }

                // --------------------------------------------------
                // VALID STATE REQUIRED
                // --------------------------------------------------

                if (
                    typeof changedSaved !==
                    "boolean"
                ) {
                    return;
                }

                setSaved(
                    changedSaved
                );

                // --------------------------------------------------
                // UPDATE SHARED CACHE
                // --------------------------------------------------

                if (
                    savedJobIdsCache
                ) {
                    if (
                        changedSaved
                    ) {
                        savedJobIdsCache.add(
                            changedJobId
                        );
                    } else {
                        savedJobIdsCache.delete(
                            changedJobId
                        );
                    }
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
    }, [
        userId,
        jobId,
    ]);

    // ==================================================
    // TOGGLE SAVE
    // ==================================================

    const handleToggle =
        async () => {
            // ==================================================
            // AUTH STILL LOADING
            // ==================================================

            if (authLoading) {
                return;
            }

            // ==================================================
            // USER NOT LOGGED IN
            // ==================================================

            if (!userId) {
                console.warn(
                    "CareerOS: User must be authenticated to save jobs."
                );

                return;
            }

            // ==================================================
            // PREVENT DUPLICATE REQUESTS
            // ==================================================

            if (
                !jobId ||
                saving ||
                checking
            ) {
                return;
            }

            try {
                setSaving(true);

                const normalizedJob =
                    {
                        ...job,
                        id: jobId,
                    };

                let newSavedState =
                    false;

                // ==================================================
                // REMOVE SAVED JOB
                // ==================================================

                if (saved) {
                    const removed =
                        await removeSavedJob(
                            jobId
                        );

                    if (!removed) {
                        throw new Error(
                            "Failed to remove saved job."
                        );
                    }

                    newSavedState =
                        false;
                }

                // ==================================================
                // SAVE JOB
                // ==================================================

                else {
                    const savedJob =
                        await saveJob(
                            normalizedJob
                        );

                    if (!savedJob) {
                        throw new Error(
                            "Failed to save saved job."
                        );
                    }

                    newSavedState =
                        true;
                }

                // ==================================================
                // UPDATE SHARED CACHE
                // ==================================================

                if (
                    savedJobIdsCache
                ) {
                    if (
                        newSavedState
                    ) {
                        savedJobIdsCache.add(
                            jobId
                        );
                    } else {
                        savedJobIdsCache.delete(
                            jobId
                        );
                    }
                }

                // ==================================================
                // UPDATE LOCAL STATE
                // ==================================================

                setSaved(
                    newSavedState
                );

                // ==================================================
                // PARENT CALLBACK
                // ==================================================

                if (
                    typeof onSavedChange ===
                    "function"
                ) {
                    onSavedChange(
                        jobId,
                        newSavedState,
                        normalizedJob
                    );
                }

                // ==================================================
                // GLOBAL EVENT
                // ==================================================

                window.dispatchEvent(
                    new CustomEvent(
                        "careerOS:savedJobsChanged",
                        {
                            detail: {
                                userId,
                                jobId,
                                saved:
                                    newSavedState,
                                job:
                                    normalizedJob,
                            },
                        }
                    )
                );
            } catch (error) {
                console.error(
                    "CareerOS save/remove job error:",
                    error
                );
            } finally {
                setSaving(false);
            }
        };

    // ==================================================
    // NO JOB
    // ==================================================

    if (!jobId) {
        return null;
    }

    // ==================================================
    // BUTTON STATE
    // ==================================================

    const disabled =
        authLoading ||
        saving ||
        checking ||
        !userId;

    const buttonText =
        authLoading
            ? "Checking..."
            : checking
                ? "Checking..."
                : saving
                    ? saved
                        ? "Removing..."
                        : "Saving..."
                    : saved
                        ? "Saved"
                        : "Save Job";

    // ==================================================
    // RENDER
    // ==================================================

    return (
        <button
            type="button"
            onClick={
                handleToggle
            }
            disabled={
                disabled
            }
            title={
                authLoading
                    ? "Checking authentication..."
                    : !userId
                        ? "Login to save jobs"
                        : checking
                            ? "Checking saved status..."
                            : saved
                                ? "Remove saved job"
                                : "Save job"
            }
            aria-label={
                authLoading
                    ? "Checking authentication"
                    : !userId
                        ? "Login to save jobs"
                        : checking
                            ? "Checking saved status"
                            : saved
                                ? "Remove saved job"
                                : "Save job"
            }
            aria-pressed={
                saved
            }
            className={
                compact
                    ? `
                        p-2
                        rounded-lg
                        border
                        transition
                        ${
                            saved
                                ? "bg-blue-50 border-blue-200 text-blue-600"
                                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                        }
                        ${
                            disabled
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }
                    `
                    : `
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        py-3
                        rounded-xl
                        border
                        font-semibold
                        transition
                        ${
                            saved
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }
                        ${
                            disabled
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }
                    `
            }
        >
            {saved ? (
                <BookmarkCheck
                    size={19}
                />
            ) : (
                <Bookmark
                    size={19}
                />
            )}

            {!compact && (
                <span>
                    {buttonText}
                </span>
            )}
        </button>
    );
}

export default SaveJobButton;