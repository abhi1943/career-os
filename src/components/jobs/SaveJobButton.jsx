import {
    useEffect,
    useState,
} from "react";

import {
    Bookmark,
    BookmarkCheck,
} from "lucide-react";

import {
    isJobSaved,
    saveJob,
    removeSavedJob,
} from "../../services/savedJobsService";

import {
    useAuth,
} from "../../context/AuthContext";

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

    // ======================================================
    // FIREBASE USER ID
    // ======================================================

    const userId =
        user?.uid || "";

    // ======================================================
    // STABLE JOB ID
    // ======================================================

    const jobId = job
        ? String(
            job.id ||
            job.redirect_url ||
            job.redirectUrl ||
            `${job.title || ""}-${typeof job.company ===
                "string"
                ? job.company
                : job.company
                    ?.display_name ||
                job.company?.name ||
                ""
            }`
        ).trim()
        : "";


    // ======================================================
    // CHECK SAVED STATUS
    // ======================================================

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

                if (!userId || !jobId) {
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



                    const result =
                        await isJobSaved(
                            jobId
                        );

                

                    if (mounted) {
                        setSaved(
                            Boolean(result)
                        );
                    }
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

    // ======================================================
    // GLOBAL SAVED JOB SYNCHRONIZATION
    // ======================================================

    useEffect(() => {
        const handleSavedJobsChanged =
            (event) => {
                const detail =
                    event?.detail || {};

                const changedUserId =
                    detail?.userId;

                const changedJobId =
                    detail?.jobId;

                const changedSaved =
                    detail?.saved;

                // ==================================================
                // IGNORE OTHER USER EVENTS
                // ==================================================

                if (
                    changedUserId &&
                    String(
                        changedUserId
                    ) !==
                    String(userId)
                ) {
                    return;
                }

                // ==================================================
                // IGNORE OTHER JOB EVENTS
                // ==================================================

                if (!changedJobId) {
                    return;
                }

                if (
                    String(
                        changedJobId
                    ) !==
                    String(jobId)
                ) {
                    return;
                }

                // ==================================================
                // VALID SAVED STATE REQUIRED
                // ==================================================

                if (
                    typeof changedSaved !==
                    "boolean"
                ) {
                    return;
                }

                setSaved(
                    changedSaved
                );
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

    // ======================================================
    // TOGGLE SAVE
    // ======================================================

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
                // UPDATE LOCAL STATE
                // ==================================================

                setSaved(
                    newSavedState
                );

                // ==================================================
                // PARENT CALLBACK
                // ==================================================

                if (onSavedChange) {
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

    // ======================================================
    // NO JOB
    // ======================================================

    if (!jobId) {
        return null;
    }

    // ======================================================
    // BUTTON STATE
    // ======================================================

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

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <button
            type="button"
            onClick={
                handleToggle
            }
            disabled={disabled}
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
            aria-pressed={saved}
            className={
                compact
                    ? `
                        p-2
                        rounded-lg
                        border
                        transition
                        ${saved
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }
                        ${disabled
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
                        ${saved
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }
                        ${disabled
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