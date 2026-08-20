import { useEffect, useState } from "react";

function JobRefreshStatus({
    onJobsRefreshed,
}) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // ======================================================
    // API BASE URL
    // ======================================================

    const API_BASE_URL = "http://localhost:5000";

    // ======================================================
    // FETCH REFRESH STATUS
    // ======================================================

    const fetchStatus = async () => {
        try {
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/api/jobs/refresh-status`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch job refresh status."
                );
            }

            const data = await response.json();

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                        "Unable to load job refresh status."
                );
            }

            setStatus(data);
        } catch (err) {
            console.error(
                "CareerOS Job Refresh Status Error:",
                err
            );

            setError(
                err?.message ||
                    "Unable to load job status."
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // INITIAL LOAD + AUTO STATUS UPDATE
    // ======================================================

    useEffect(() => {
    const initialTimeout = setTimeout(() => {
        fetchStatus();
    }, 0);

    const interval = setInterval(() => {
        fetchStatus();
    }, 30000);

    return () => {
        clearTimeout(initialTimeout);
        clearInterval(interval);
    };
}, []);

    // ======================================================
    // MANUAL REFRESH
    // ======================================================

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/api/jobs/refresh`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to refresh jobs."
                );
            }

            const data = await response.json();

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                        "Job refresh failed."
                );
            }

            if (onJobsRefreshed) {
                onJobsRefreshed();
            }

            await fetchStatus();
        } catch (err) {
            console.error(
                "CareerOS Manual Job Refresh Error:",
                err
            );

            setError(
                err?.message ||
                    "Unable to refresh jobs."
            );
        } finally {
            setRefreshing(false);
        }
    };

    // ======================================================
    // FORMAT DATE
    // ======================================================

    const formatDate = (date) => {
        if (!date) {
            return "Not available";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "Not available";
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };

    // ======================================================
    // FORMAT NEXT REFRESH
    // ======================================================

    const formatNextRefresh = (
        milliseconds
    ) => {
        if (
            milliseconds === null ||
            milliseconds === undefined
        ) {
            return "Not available";
        }

        const totalMinutes =
            Math.ceil(
                milliseconds /
                    (60 * 1000)
            );

        if (totalMinutes <= 0) {
            return "Refreshing soon";
        }

        const hours = Math.floor(
            totalMinutes / 60
        );

        const minutes =
            totalMinutes % 60;

        if (hours > 0) {
            return `~${hours}h ${
                minutes > 0
                    ? `${minutes}m`
                    : ""
            }`;
        }

        return `~${minutes}m`;
    };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-3">

                        <div className="text-2xl">
                            🔄
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-900">
                                CareerOS Job Database
                            </h2>

                            <p className="text-sm text-gray-500">
                                Checking refresh status...
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

    if (error && !status) {
        return (
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-6 mb-6">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div className="flex items-start gap-3">

                            <div className="text-2xl">
                                ⚠️
                            </div>

                            <div>
                                <h2 className="font-bold text-gray-900">
                                    CareerOS Job Database
                                </h2>

                                <p className="text-sm text-red-600 mt-1">
                                    {error}
                                </p>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={fetchStatus}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                        >
                            Try Again
                        </button>

                    </div>

                </div>
            </div>
        );
    }

    // ======================================================
    // BACKEND DATA
    // ======================================================

    const refresh =
        status?.refresh || {};

    const store =
        status?.store || {};

    // ======================================================
    // STATUS VALUES
    // ======================================================

    const storedJobs =
        Number(
            store?.totalJobs || 0
        );

    const lastRefresh =
        refresh?.lastRefreshCompletedAt ||
        refresh?.lastRefreshStartedAt ||
        null;

    const nextRefreshIn =
        refresh?.nextRefreshInMs ??
        null;

    const staleRemoved =
        Number(
            refresh?.lastRefreshRemovedCount ||
                0
        );

    const isRefreshing =
        Boolean(
            refresh?.isRefreshing
        );


    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="max-w-7xl mx-auto px-6">

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div className="flex items-start gap-4">

                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                            <span className="text-2xl">
                                🟢
                            </span>
                        </div>

                        <div>

                            <div className="flex flex-wrap items-center gap-2">

                                <h2 className="text-xl font-bold text-gray-900">
                                    CareerOS Job Database
                                </h2>

                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                    ONLINE
                                </span>

                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                                Job listings are automatically
                                refreshed and cleaned by CareerOS.
                            </p>

                        </div>

                    </div>

                    {/* ==================================================
                        REFRESH BUTTON
                    ================================================== */}

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={
                            refreshing ||
                            isRefreshing
                        }
                        className={`px-5 py-2.5 rounded-xl font-semibold transition ${
                            refreshing ||
                            isRefreshing
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        {refreshing ||
                        isRefreshing
                            ? "🔄 Refreshing..."
                            : "🔄 Refresh Jobs Now"}
                    </button>

                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* ==================================================
                    STATUS CARDS
                ================================================== */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

                    {/* ACTIVE JOBS */}

                    <div className="bg-blue-50 rounded-xl p-4">

                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                            Active Jobs
                        </p>

                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {storedJobs.toLocaleString(
                                "en-IN"
                            )}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                            Currently available
                        </p>

                    </div>

                    {/* LAST REFRESH */}

                    <div className="bg-green-50 rounded-xl p-4">

                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                            Last Refresh
                        </p>

                        <p className="text-sm font-bold text-gray-900 mt-2">
                            {formatDate(
                                lastRefresh
                            )}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                            Latest successful update
                        </p>

                    </div>

                    {/* NEXT REFRESH */}

                    <div className="bg-purple-50 rounded-xl p-4">

                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                            Next Refresh
                        </p>

                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {formatNextRefresh(
                                nextRefreshIn
                            )}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                            Automatic update
                        </p>

                    </div>

                    {/* CLEANED JOBS */}

                    <div className="bg-orange-50 rounded-xl p-4">

                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                            Cleaned Jobs
                        </p>

                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {staleRemoved}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                            Stale listings removed
                        </p>

                    </div>

                </div>

                {/* ==================================================
                    REFRESHING STATUS
                ================================================== */}

                {isRefreshing && (
                    <div className="mt-5 flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">

                        <span className="animate-spin">
                            🔄
                        </span>

                        <div>

                            <p className="font-semibold text-blue-700">
                                Jobs are being refreshed
                            </p>

                            <p className="text-sm text-blue-600">
                                CareerOS is fetching the latest
                                opportunities.
                            </p>

                        </div>

                    </div>
                )}

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-5 pt-5 border-t border-gray-100">

                    <p className="text-xs text-gray-500">
                        🔄 Automatic refresh enabled
                    </p>

                    <p className="text-xs text-gray-500">
                        🧹 Stale job cleanup enabled
                    </p>

                </div>

            </div>

        </div>
    );
}

export default JobRefreshStatus;