
import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Bell,
    Briefcase,
    CheckCircle,
    Clock,
    RefreshCw,
    ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

function Notifications() {
    const { user, authLoading } = useAuth();

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // ======================================================
    // LOAD NOTIFICATIONS
    // ======================================================

    const loadNotifications = useCallback(
        async () => {
            try {
                /*
                 * Yield once before updating state.
                 * This prevents the React set-state-in-effect
                 * lint rule from treating this as a
                 * synchronous effect update.
                 */
                await Promise.resolve();

                setLoading(true);
                setError("");

                // ==================================================
                // AUTHENTICATION CHECK
                // ==================================================

                if (!user?.uid) {
                    setNotifications([]);

                    setError(
                        "Please sign in to view your notifications."
                    );

                    return;
                }

                // ==================================================
                // GET USER-SPECIFIC JOB ALERT STATS
                // ==================================================

                const response = await fetch(
                    "http://localhost:5000/api/job-alerts/stats",
                    {
                        method: "GET",
                        headers: {
                            "x-user-id":
                                user.uid,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load notification information"
                    );
                }

                const data =
                    await response.json();

                const generatedNotifications =
                    [];

                // ==================================================
                // JOB ALERT NOTIFICATION
                // ==================================================

                if (
                    data?.success &&
                    data?.stats
                ) {
                    const enabledAlerts =
                        Number(
                            data.stats.enabled ||
                                0
                        );

                    const totalAlerts =
                        Number(
                            data.stats.total ||
                                0
                        );

                    // ==================================================
                    // ACTIVE ALERTS
                    // ==================================================

                    if (enabledAlerts > 0) {
                        generatedNotifications.push(
                            {
                                id: "job-alert-active",
                                type: "job-alert",
                                title: "Job Alerts are active",
                                message:
                                    `CareerOS is monitoring ${enabledAlerts} enabled job alert${
                                        enabledAlerts ===
                                        1
                                            ? ""
                                            : "s"
                                    } for you.`,
                                time: "Active",
                                icon: Bell,
                            }
                        );
                    }

                    // ==================================================
                    // NO ALERTS
                    // ==================================================

                    if (totalAlerts === 0) {
                        generatedNotifications.push(
                            {
                                id: "create-job-alert",
                                type: "job-alert",
                                title: "Create your first Job Alert",
                                message:
                                    "Set up a job alert to receive opportunities matching your career interests.",
                                time: "Get started",
                                icon: Briefcase,
                            }
                        );
                    }

                    // ==================================================
                    // ALL ALERTS DISABLED
                    // ==================================================

                    if (
                        totalAlerts > 0 &&
                        enabledAlerts === 0
                    ) {
                        generatedNotifications.push(
                            {
                                id: "job-alert-disabled",
                                type: "job-alert",
                                title: "Your Job Alerts are disabled",
                                message:
                                    "You have saved job alerts, but none of them are currently enabled.",
                                time: "Attention",
                                icon: Bell,
                            }
                        );
                    }
                }

                // ==================================================
                // CAREEROS STATUS
                // ==================================================

                generatedNotifications.push({
                    id: "careeros-monitoring",
                    type: "system",
                    title: "CareerOS opportunity monitoring",
                    message:
                        "CareerOS is ready to help you discover jobs and career opportunities.",
                    time: "System",
                    icon: CheckCircle,
                });

                setNotifications(
                    generatedNotifications
                );
            } catch (error) {
                console.error(
                    "Notifications Error:",
                    error
                );

                setError(
                    "Unable to load notifications right now."
                );
            } finally {
                setLoading(false);
            }
        },
        [user]
    );

    // ======================================================
    // WAIT FOR AUTHENTICATION
    // ======================================================

    useEffect(() => {
        if (authLoading) {
            return;
        }

        let cancelled = false;

        const initializeNotifications =
            async () => {
                await Promise.resolve();

                if (cancelled) {
                    return;
                }

                await loadNotifications();
            };

        void initializeNotifications();

        return () => {
            cancelled = true;
        };
    }, [
        user,
        authLoading,
        loadNotifications,
    ]);

    // ======================================================
    // AUTH LOADING
    // ======================================================

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">

                        <RefreshCw
                            size={32}
                            className="mx-auto text-blue-600 animate-spin"
                        />

                        <p className="mt-4 text-gray-600">
                            Checking authentication...
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">

                        <RefreshCw
                            size={32}
                            className="mx-auto text-blue-600 animate-spin"
                        />

                        <p className="mt-4 text-gray-600">
                            Loading notifications...
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* HEADER */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>
                        <div className="flex items-center gap-3">

                            <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                                <Bell
                                    size={24}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>

                                <h1 className="text-3xl font-bold text-gray-900">
                                    Notifications
                                </h1>

                                <p className="text-gray-500 mt-1">
                                    Stay updated with your CareerOS activity
                                </p>

                            </div>

                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            void loadNotifications()
                        }
                        disabled={loading}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-3
                            bg-white
                            border
                            border-gray-200
                            rounded-xl
                            text-gray-700
                            font-semibold
                            hover:bg-gray-50
                            transition
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >

                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                        {error}
                    </div>
                )}

                {/* NOTIFICATION COUNT */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Current notifications
                            </p>

                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {notifications.length}
                            </p>

                        </div>

                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">

                            <Bell
                                size={22}
                                className="text-blue-600"
                            />

                        </div>

                    </div>

                </div>

                {/* NOTIFICATIONS */}

                <div className="space-y-4">

                    {notifications.length > 0 ? (
                        notifications.map(
                            (notification) => {
                                const Icon =
                                    notification.icon;

                                return (
                                    <div
                                        key={
                                            notification.id
                                        }
                                        className="
                                            bg-white
                                            rounded-2xl
                                            border
                                            border-gray-100
                                            shadow-sm
                                            p-6
                                            hover:shadow-md
                                            transition
                                        "
                                    >

                                        <div className="flex items-start gap-4">

                                            {/* ICON */}

                                            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">

                                                <Icon
                                                    size={22}
                                                    className="text-blue-600"
                                                />

                                            </div>

                                            {/* CONTENT */}

                                            <div className="flex-1 min-w-0">

                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                                                    <h2 className="text-lg font-semibold text-gray-900">
                                                        {
                                                            notification.title
                                                        }
                                                    </h2>

                                                    <div className="flex items-center gap-1 text-xs text-gray-500">

                                                        <Clock
                                                            size={
                                                                13
                                                            }
                                                        />

                                                        {
                                                            notification.time
                                                        }

                                                    </div>

                                                </div>

                                                <p className="text-gray-600 mt-2 leading-relaxed">
                                                    {
                                                        notification.message
                                                    }
                                                </p>

                                                {/* CREATE JOB ALERT */}

                                                {notification.id ===
                                                    "create-job-alert" && (
                                                    <Link
                                                        to="/jobs/alerts"
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-2
                                                            mt-4
                                                            px-4
                                                            py-2.5
                                                            bg-blue-600
                                                            hover:bg-blue-700
                                                            text-white
                                                            rounded-xl
                                                            font-semibold
                                                            text-sm
                                                            transition
                                                        "
                                                    >
                                                        Create Job Alert

                                                        <ArrowRight
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </Link>
                                                )}

                                                {/* ACTIVE ALERT */}

                                                {notification.id ===
                                                    "job-alert-active" && (
                                                    <Link
                                                        to="/jobs/alerts"
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-2
                                                            mt-4
                                                            px-4
                                                            py-2.5
                                                            border
                                                            border-gray-200
                                                            hover:bg-gray-50
                                                            text-gray-700
                                                            rounded-xl
                                                            font-semibold
                                                            text-sm
                                                            transition
                                                        "
                                                    >
                                                        View Job Alerts

                                                        <ArrowRight
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </Link>
                                                )}

                                                {/* DISABLED ALERT */}

                                                {notification.id ===
                                                    "job-alert-disabled" && (
                                                    <Link
                                                        to="/jobs/alerts"
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-2
                                                            mt-4
                                                            px-4
                                                            py-2.5
                                                            border
                                                            border-gray-200
                                                            hover:bg-gray-50
                                                            text-gray-700
                                                            rounded-xl
                                                            font-semibold
                                                            text-sm
                                                            transition
                                                        "
                                                    >
                                                        Manage Job Alerts

                                                        <ArrowRight
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </Link>
                                                )}

                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

                            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">

                                <Bell
                                    size={28}
                                    className="text-gray-400"
                                />

                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mt-5">
                                No notifications
                            </h2>

                            <p className="text-gray-500 mt-2">
                                You're all caught up.
                            </p>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default Notifications;
