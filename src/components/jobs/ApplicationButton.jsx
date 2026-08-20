import {
    useCallback,
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
    getApplication,
} from "../../services/applicationService";

// ======================================================
// APPLICATION BUTTON
// ======================================================
//
// Purpose:
// - Show whether a user has applied
// - Allow user to mark a job as applied
// - Prevent duplicate applications
// - Check existing application from backend
// - Notify parent when application state changes
//
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

    const getJobId = useCallback(() => {
        if (!job) {
            return "";
        }

        const id =
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
            }`;

        return String(id).trim();
    }, [
        job,
    ]);

    // ==================================================
    // CHECK APPLICATION
    // ==================================================

    useEffect(() => {
        let mounted = true;

        const checkApplication = async () => {
            const jobId = getJobId();

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
                const existingApplication =
                    await getApplication(jobId);

                if (!mounted) {
                    return;
                }

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
    }, [
        getJobId,
    ]);

    // ==================================================
    // APPLY
    // ==================================================

    const handleApply = async () => {
        if (!job || submitting) {
            return;
        }

        const jobId = getJobId();

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

            if (onApplicationChange) {
                onApplicationChange(
                    createdApplication,
                    true
                );
            }
        } catch (err) {
            console.error(
                "CareerOS: Apply job error:",
                err
            );

            const serverMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
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