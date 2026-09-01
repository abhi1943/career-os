
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    RefreshCw,
    AlertCircle,
    Inbox,
} from "lucide-react";

import {
    getApplications,
    updateApplicationStatus,
    removeApplication,
} from "../../services/applicationService";

import ApplicationTable from "../../components/jobTracker/ApplicationTable";
import ApplicationFilters from "../../components/jobTracker/ApplicationFilters";
import ApplicationStats from "../../components/jobTracker/ApplicationStats";
import OnlineStatusIndicator from "../../components/common/OnlineStatusIndicator";

function JobTracker() {
    const [applications, setApplications] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [
        lastRefreshed,
        setLastRefreshed,
    ] = useState(null);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    // ==================================================
    // LOAD APPLICATIONS
    // ==================================================

    async function loadApplications(
        isManualRefresh = false
    ) {
        

        if (isManualRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const data =
                await getApplications();

            

            setApplications(
                Array.isArray(data)
                    ? data
                    : []
            );

            setLastRefreshed(
                new Date()
            );

        } catch (err) {
            console.error(
                "CareerOS: JobTracker load applications error:",
                err
            );

            setApplications([]);

            setError(
                err?.message ||
                "We couldn't retrieve your job applications right now. Please check your connection and try again."
            );

        } finally {
            

            setLoading(false);
            setRefreshing(false);
        }
    }

    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {
        let cancelled = false;

        async function loadInitialApplications() {
            

            try {
                const data =
                    await getApplications();

                if (cancelled) {
                    return;
                }

                

                setApplications(
                    Array.isArray(data)
                        ? data
                        : []
                );

                setLastRefreshed(
                    new Date()
                );

                setError("");

            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "CareerOS: JobTracker load applications error:",
                    err
                );

                setApplications([]);

                setError(
                    err?.message ||
                    "We couldn't retrieve your job applications right now. Please check your connection and try again."
                );

            } finally {
                if (!cancelled) {
                    

                    setLoading(false);
                }
            }
        }

        loadInitialApplications();

        return () => {
            cancelled = true;

            
        };
    }, []);

    // ==================================================
    // UPDATE STATUS
    // ==================================================

    async function handleStatusChange(
        jobId,
        status
    ) {
        try {
            const updatedApplication =
                await updateApplicationStatus(
                    jobId,
                    status
                );

            if (!updatedApplication) {
                return;
            }

            setApplications((current) =>
                current.map((application) =>
                    application.jobId === jobId
                        ? updatedApplication
                        : application
                )
            );

        } catch (err) {
            console.error(
                "CareerOS: Update application status error:",
                err
            );

            setError(
                "Unable to update application status."
            );
        }
    }

    // ==================================================
    // DELETE APPLICATION
    // ==================================================

    async function handleDelete(jobId) {
        const confirmed =
            window.confirm(
                "Remove this application from your tracker?"
            );

        if (!confirmed) {
            return;
        }

        try {
            const success =
                await removeApplication(jobId);

            if (!success) {
                setError(
                    "Unable to remove application."
                );

                return;
            }

            setApplications((current) =>
                current.filter(
                    (application) =>
                        application.jobId !== jobId
                )
            );

        } catch (err) {
            console.error(
                "CareerOS: Remove application error:",
                err
            );

            setError(
                "Unable to remove application."
            );
        }
    }

    // ==================================================
    // FILTER APPLICATIONS
    // ==================================================

    const filteredApplications = useMemo(() => {
        const normalizedSearch =
            search.toLowerCase().trim();

        return applications.filter(
            (application) => {
                const job =
                    application.job || {};

                const company =
                    typeof job.company === "string"
                        ? job.company
                        : job.company
                            ?.display_name ||
                        job.company?.name ||
                        "";

                const title =
                    job.title || "";

                const location =
                    typeof job.location === "string"
                        ? job.location
                        : job.location
                            ?.display_name ||
                        "";

                const searchMatch =
                    !normalizedSearch ||
                    company
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    title
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    location
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        );

                const statusMatch =
                    statusFilter === "All" ||
                    application.status ===
                    statusFilter;

                return (
                    searchMatch &&
                    statusMatch
                );
            }
        );
    }, [
        applications,
        search,
        statusFilter,
    ]);

    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {
        return (
            <section className="min-h-screen bg-slate-100 py-6 sm:py-8 lg:py-10">

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-8 sm:p-12 text-center">

                        <div className="mx-auto h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />

                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6">
                            Loading your applications
                        </h2>

                        <p className="text-sm sm:text-base text-gray-500 mt-2">
                            Please wait while we fetch your job applications.
                        </p>

                    </div>

                </div>

            </section>
        );
    }

    // ==================================================
    // ERROR STATE
    // ==================================================

    if (
        error &&
        applications.length === 0
    ) {
        return (
            <section className="min-h-screen bg-slate-100 py-6 sm:py-8 lg:py-10">

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-8 sm:p-12 text-center">

                        <div className="mx-auto h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">

                            <AlertCircle
                                size={28}
                                className="text-red-500"
                            />

                        </div>

                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-5">
                            Unable to load applications
                        </h2>

                        <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-md mx-auto">
                            We couldn't retrieve your job applications right now.
                            Please check your connection and try again.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                loadApplications(true)
                            }
                            disabled={refreshing}
                            className="
                                mt-6
                                w-full
                                sm:w-auto
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-5
                                py-3
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                font-semibold
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                transition
                            "
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
                                ? "Trying again..."
                                : "Try Again"}

                        </button>

                    </div>

                </div>

            </section>
        );
    }

    // ==================================================
    // MAIN UI
    // ==================================================

    return (
        <section className="min-h-screen bg-slate-100 py-6 sm:py-8 lg:py-10">

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="mb-6 sm:mb-8">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        <div className="min-w-0">

                            <h1 className="
                                text-2xl
                                sm:text-3xl
                                lg:text-4xl
                                font-bold
                                text-gray-900
                                leading-tight
                            ">
                                Job Application Tracker
                            </h1>

                            <p className="
                                text-sm
                                sm:text-base
                                text-gray-500
                                mt-2
                                max-w-2xl
                            ">
                                Track every job application
                                and monitor your progress.
                            </p>

                        </div>

                        <div className="
                            flex
                            flex-col
                            sm:flex-row
                            lg:flex-col
                            items-start
                            sm:items-center
                            lg:items-end
                            gap-3
                            w-full
                            lg:w-auto
                        ">

                            <OnlineStatusIndicator />

                            <div className="
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-center
                                gap-3
                                w-full
                                sm:w-auto
                            ">

                                <span className="
                                    text-xs
                                    text-gray-500
                                    text-left
                                    sm:text-right
                                ">
                                    {lastRefreshed
                                        ? `Last updated ${lastRefreshed.toLocaleTimeString(
                                            "en-IN",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}`
                                        : "Not refreshed yet"}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        loadApplications(true)
                                    }
                                    disabled={refreshing}
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        px-4
                                        py-2.5
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-white
                                        text-gray-700
                                        text-sm
                                        font-semibold
                                        hover:bg-gray-50
                                        hover:border-blue-300
                                        disabled:opacity-60
                                        disabled:cursor-not-allowed
                                        transition
                                        w-full
                                        sm:w-auto
                                    "
                                >

                                    <RefreshCw
                                        size={15}
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

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                    ERROR
                ========================================== */}

                {error && (
                    <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 sm:p-5">

                        <div className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-4
                        ">

                            <div className="min-w-0">

                                <h2 className="font-semibold text-red-800">
                                    Unable to load applications
                                </h2>

                                <p className="text-sm text-red-600 mt-1 break-words">
                                    {error}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    loadApplications(true)
                                }
                                disabled={refreshing}
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-red-600
                                    hover:bg-red-700
                                    text-white
                                    text-sm
                                    font-semibold
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                    transition
                                    w-full
                                    sm:w-auto
                                    shrink-0
                                "
                            >

                                <RefreshCw
                                    size={16}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                {refreshing
                                    ? "Trying..."
                                    : "Try Again"}

                            </button>

                        </div>

                    </div>
                )}

                {/* ==========================================
                    STATS
                ========================================== */}

                <ApplicationStats
                    applications={applications}
                />

                {/* ==========================================
                    FILTERS
                ========================================== */}

                <ApplicationFilters
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                {/* ==========================================
                    APPLICATION CONTENT
                ========================================== */}

                {applications.length === 0 ? (

                    <div className="
                        bg-white
                        rounded-2xl
                        sm:rounded-3xl
                        shadow-lg
                        p-8
                        sm:p-12
                        mt-6
                        sm:mt-8
                        text-center
                    ">

                        <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center">

                            <Inbox
                                size={30}
                                className="text-blue-500"
                            />

                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-5">
                            No applications yet
                        </h2>

                        <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-lg mx-auto">
                            Your job applications will appear here after
                            you apply for a job and add it to your tracker.
                        </p>

                        <p className="text-xs sm:text-sm text-gray-400 mt-3">
                            Start applying to jobs to build your application pipeline.
                        </p>

                    </div>

                ) : filteredApplications.length === 0 ? (

                    <div className="
                        bg-white
                        rounded-2xl
                        sm:rounded-3xl
                        shadow-lg
                        p-8
                        sm:p-12
                        mt-6
                        sm:mt-8
                        text-center
                    ">

                        <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">

                            <Inbox
                                size={30}
                                className="text-gray-400"
                            />

                        </div>

                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-5">
                            No matching applications
                        </h2>

                        <p className="text-sm sm:text-base text-gray-500 mt-2">
                            No applications match your current search or status filter.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("All");
                            }}
                            className="
                                mt-5
                                w-full
                                sm:w-auto
                                px-5
                                py-2.5
                                rounded-xl
                                border
                                border-gray-200
                                hover:bg-gray-50
                                text-gray-700
                                font-semibold
                                transition
                            "
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <ApplicationTable
                        applications={
                            filteredApplications
                        }
                        onStatusChange={
                            handleStatusChange
                        }
                        onDelete={
                            handleDelete
                        }
                    />

                )}

            </div>

        </section>
    );
}

export default JobTracker;
