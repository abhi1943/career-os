
import {
    useEffect,
    useState,
} from "react";

import {
    CheckCircle2,
    Loader2,
    Send,
} from "lucide-react";

import {
    createApplication,
    getApplications,
} from "../../services/applicationService";

// ======================================================
// CAREEROS APPLICATION CACHE
// ======================================================


let applicationsCache = null;
let applicationsCacheUserId = "";
let applicationsLoadPromise = null;

// ======================================================
// GET CURRENT FIREBASE USER ID
// ======================================================

async function getCurrentFirebaseUserId() {
    try {
        const { auth } =
            await import("../../firebase/firebase");

        return String(
            auth.currentUser?.uid || ""
        ).trim();
    } catch (error) {
        console.error(
            "CareerOS: Unable to get Firebase user:",
            error
        );

        return "";
    }
}

// ======================================================
// LOAD APPLICATIONS ONCE
// ======================================================

async function loadApplicationsOnce() {
    const userId =
        await getCurrentFirebaseUserId();

    if (!userId) {
        applicationsCache = [];
        applicationsCacheUserId = "";
        return [];
    }

    // --------------------------------------------------
    // RETURN EXISTING CACHE
    // --------------------------------------------------

    if (
        applicationsCache &&
        applicationsCacheUserId === userId
    ) {
        return applicationsCache;
    }

    // --------------------------------------------------
    // RETURN EXISTING REQUEST
    // --------------------------------------------------

    if (
        applicationsLoadPromise &&
        applicationsCacheUserId === userId
    ) {
        return applicationsLoadPromise;
    }

    // --------------------------------------------------
    // LOAD ALL APPLICATIONS
    // --------------------------------------------------

    applicationsCacheUserId = userId;

    applicationsLoadPromise =
        getApplications()
            .then((applications) => {
                const normalizedApplications =
                    Array.isArray(
                        applications
                    )
                        ? applications
                        : [];

                applicationsCache =
                    normalizedApplications;

                return normalizedApplications;
            })
            .catch((error) => {
                console.error(
                    "CareerOS: Failed to load application cache:",
                    error
                );

                applicationsCache = [];

                return [];
            })
            .finally(() => {
                applicationsLoadPromise =
                    null;
            });

    return applicationsLoadPromise;
}

// ======================================================
// FIND APPLICATION IN CACHE
// ======================================================

function findApplication(
    applications,
    jobId
) {
    if (
        !Array.isArray(applications) ||
        !jobId
    ) {
        return null;
    }

    const normalizedJobId =
        String(jobId).trim();

    return (
        applications.find(
            (application) =>
                String(
                    application?.jobId ||
                        application?.job_id ||
                        ""
                ).trim() ===
                normalizedJobId
        ) || null
    );
}

// ======================================================
// APPLICATION BUTTON
// ======================================================

function ApplicationButton({
    job,
    compact = false,
    onApplicationChange,
}) {
    const [application, setApplication] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    // ==================================================
    // JOB ID
    // ==================================================

    const jobId = job
        ? String(
              job.id ||
                  job.job_id ||
                  job.jobId ||
                  job.redirect_url ||
                  job.redirectUrl ||
                  job.url ||
                  `${job.title || ""}-${
                      typeof job.company === "string"
                          ? job.company
                          : job.company?.display_name ||
                            job.company?.name ||
                            ""
                  }`
          ).trim()
        : "";

    // ==================================================
    // CHECK APPLICATION FROM SHARED CACHE
    // ==================================================

    useEffect(() => {
        let mounted = true;

        const checkApplication = async () => {
            if (!jobId) {
                if (mounted) {
                    setApplication(null);
                    setLoading(false);
                }

                return;
            }

            setLoading(true);
            setError("");

            try {
                const applications =
                    await loadApplicationsOnce();

                if (!mounted) {
                    return;
                }

                const existingApplication =
                    findApplication(
                        applications,
                        jobId
                    );

                setApplication(
                    existingApplication
                );
            } catch (err) {
                if (!mounted) {
                    return;
                }

                console.error(
                    "CareerOS: Check application error:",
                    err
                );

                setApplication(null);

                setError(
                    "Unable to check application status."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        checkApplication();

        return () => {
            mounted = false;
        };
    }, [jobId]);

    // ==================================================
    // GLOBAL APPLICATION SYNCHRONIZATION
    // ==================================================

    useEffect(() => {
        const handleApplicationChanged =
            (event) => {
                const detail =
                    event?.detail || {};

                const changedJobId =
                    String(
                        detail?.jobId || ""
                    ).trim();

                const changedApplication =
                    detail?.application ||
                    null;

                if (
                    !changedJobId ||
                    changedJobId !==
                        String(jobId)
                ) {
                    return;
                }

                setApplication(
                    changedApplication
                );
            };

        window.addEventListener(
            "careerOS:applicationsChanged",
            handleApplicationChanged
        );

        return () => {
            window.removeEventListener(
                "careerOS:applicationsChanged",
                handleApplicationChanged
            );
        };
    }, [jobId]);

    // ==================================================
    // APPLY
    // ==================================================

    const handleApply = async () => {
        if (!job || submitting) {
            return;
        }

        if (!jobId) {
            setError(
                "Unable to identify this job."
            );

            return;
        }

        // ----------------------------------------------
        // Already applied
        // ----------------------------------------------

        if (application) {
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const createdApplication =
                await createApplication({
                    ...job,
                    id: jobId,
                });

            setApplication(
                createdApplication
            );

            // --------------------------------------------------
            // UPDATE SHARED APPLICATION CACHE
            // --------------------------------------------------

            if (
                Array.isArray(
                    applicationsCache
                )
            ) {
                const existingIndex =
                    applicationsCache.findIndex(
                        (item) =>
                            String(
                                item?.jobId ||
                                    item?.job_id ||
                                    ""
                            ).trim() ===
                            String(
                                jobId
                            ).trim()
                    );

                if (
                    existingIndex >= 0
                ) {
                    applicationsCache[
                        existingIndex
                    ] =
                        createdApplication;
                } else {
                    applicationsCache.push(
                        createdApplication
                    );
                }
            }

            // --------------------------------------------------
            // PARENT CALLBACK
            // --------------------------------------------------

            if (
                typeof onApplicationChange ===
                "function"
            ) {
                onApplicationChange(
                    createdApplication,
                    true
                );
            }

            // --------------------------------------------------
            // GLOBAL EVENT
            // --------------------------------------------------

            window.dispatchEvent(
                new CustomEvent(
                    "careerOS:applicationsChanged",
                    {
                        detail: {
                            jobId,
                            application:
                                createdApplication,
                            applied: true,
                        },
                    }
                )
            );
        } catch (err) {
            console.error(
                "CareerOS: Apply job error:",
                err
            );

            const serverMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "";

            setError(
                serverMessage ||
                    "Unable to save application."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {
        return (
            <button
                type="button"
                disabled
                className={
                    compact
                        ? "px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-semibold flex items-center justify-center gap-2"
                        : "flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                }
            >
                <Loader2
                    size={17}
                    className="animate-spin"
                />

                Checking...
            </button>
        );
    }

    // ==================================================
    // APPLIED STATE
    // ==================================================

    if (application) {
        return (
            <div className="flex flex-col gap-1">
                <button
                    type="button"
                    disabled
                    className={
                        compact
                            ? "px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-semibold flex items-center justify-center gap-2"
                            : "flex-1 bg-green-50 text-green-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                    }
                >
                    <CheckCircle2
                        size={18}
                    />

                    Applied
                </button>

                {application.status &&
                    application.status !==
                        "Applied" && (
                        <span className="text-xs text-center text-gray-500">
                            Status:{" "}
                            {
                                application.status
                            }
                        </span>
                    )}
            </div>
        );
    }

    // ==================================================
    // BUTTON
    // ==================================================

    return (
        <div className="flex flex-col gap-1">
            <button
                type="button"
                onClick={handleApply}
                disabled={submitting}
                className={
                    compact
                        ? "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold flex items-center justify-center gap-2 transition"
                        : "flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                }
            >
                {submitting ? (
                    <>
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />

                        Saving...
                    </>
                ) : (
                    <>
                        <Send size={18} />

                        Mark Applied
                    </>
                )}
            </button>

            {error && (
                <p className="text-xs text-red-500 text-center">
                    {error}
                </p>
            )}
        </div>
    );
}

export default ApplicationButton;

