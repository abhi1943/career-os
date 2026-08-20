import { useEffect, useState } from "react";

import {
    Bell,
    Trash2,
    RefreshCw,
    Plus,
    AlertCircle,
    Pencil,
    Power,
    CalendarClock,
    BarChart3,
} from "lucide-react";

import JobAlertForm from "../../components/jobs/JobAlertForm";

import {
    getJobAlerts,
    deleteJobAlert,
    enableJobAlert,
    disableJobAlert,
} from "../../services/jobAlertsService";

function JobAlertsPage() {
    // ======================================================
    // STATE
    // ======================================================

    const [alerts, setAlerts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingAlert, setEditingAlert] = useState(null);

    const [deletingId, setDeletingId] = useState(null);

    const [togglingId, setTogglingId] = useState(null);

    // ======================================================
    // LOAD ALERTS
    // ======================================================

    const loadAlerts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getJobAlerts();

            setAlerts(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (err) {
            console.error(
                "CareerOS: Load job alerts error:",
                err
            );

            setError(
                err?.message ||
                    "Unable to load job alerts."
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // INITIAL LOAD
    // ======================================================
    //
    // We intentionally load the initial data directly inside
    // the async function created by the effect.
    //
    // This avoids calling the component-level loadAlerts()
    // function synchronously from the effect, which triggers
    // react-hooks/set-state-in-effect.
    //
    // ======================================================

    useEffect(() => {
        let cancelled = false;

        const initializeAlerts = async () => {
            try {
                const data = await getJobAlerts();

                if (cancelled) {
                    return;
                }

                setAlerts(
                    Array.isArray(data)
                        ? data
                        : []
                );

                setError("");
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "CareerOS: Initial job alerts load error:",
                    err
                );

                setError(
                    err?.message ||
                        "Unable to load job alerts."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        initializeAlerts();

        return () => {
            cancelled = true;
        };
    }, []);

    // ======================================================
    // CREATE / UPDATE CALLBACK
    // ======================================================

    const handleAlertSaved = (savedAlert) => {
        if (!savedAlert) {
            return;
        }

        setAlerts((currentAlerts) => {
            const exists = currentAlerts.some(
                (alert) =>
                    String(alert.id) ===
                    String(savedAlert.id)
            );

            if (exists) {
                return currentAlerts.map(
                    (alert) =>
                        String(alert.id) ===
                        String(savedAlert.id)
                            ? savedAlert
                            : alert
                );
            }

            return [
                savedAlert,
                ...currentAlerts,
            ];
        });

        setShowForm(false);
        setEditingAlert(null);
        setError("");
    };

    // ======================================================
    // EDIT ALERT
    // ======================================================

    const handleEditAlert = (alert) => {
        if (!alert) {
            return;
        }

        setEditingAlert(alert);
        setShowForm(true);
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ======================================================
    // CANCEL FORM
    // ======================================================

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingAlert(null);
    };

    // ======================================================
    // DELETE ALERT
    // ======================================================

    const handleDeleteAlert = async (alertId) => {
        if (!alertId) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this job alert?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(alertId);
            setError("");

            const deleted =
                await deleteJobAlert(alertId);

            if (!deleted) {
                throw new Error(
                    "Failed to delete job alert."
                );
            }

            setAlerts((currentAlerts) =>
                currentAlerts.filter(
                    (alert) =>
                        String(alert.id) !==
                        String(alertId)
                )
            );
        } catch (err) {
            console.error(
                "CareerOS: Delete job alert error:",
                err
            );

            setError(
                err?.message ||
                    "Unable to delete job alert."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // ======================================================
    // TOGGLE ALERT
    // ======================================================

    const handleToggleAlert = async (alert) => {
        if (!alert?.id) {
            return;
        }

        try {
            setTogglingId(alert.id);
            setError("");

            const updatedAlert =
                alert.enabled &&
                alert.active
                    ? await disableJobAlert(
                          alert.id
                      )
                    : await enableJobAlert(
                          alert.id
                      );

            if (!updatedAlert) {
                throw new Error(
                    "Unable to update alert status."
                );
            }

            setAlerts((currentAlerts) =>
                currentAlerts.map(
                    (currentAlert) =>
                        String(
                            currentAlert.id
                        ) ===
                        String(alert.id)
                            ? updatedAlert
                            : currentAlert
                )
            );
        } catch (err) {
            console.error(
                "CareerOS: Toggle job alert error:",
                err
            );

            setError(
                err?.message ||
                    "Unable to update alert status."
            );
        } finally {
            setTogglingId(null);
        }
    };

    // ======================================================
    // FORMAT DATE
    // ======================================================

    const formatDate = (value) => {
        if (!value) {
            return "Not available";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "Not available";
        }

        return date.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    // ======================================================
    // FORM
    // ======================================================

    const formVisible =
        showForm || editingAlert;

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="min-h-screen bg-slate-100 py-10">

            <div className="max-w-6xl mx-auto px-6">

                {/* HEADER */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                            <Bell size={27} />
                        </div>

                        <div>

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                                Job Alerts
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Get notified when new jobs match your preferences.
                            </p>

                        </div>

                    </div>

                    {!formVisible && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingAlert(null);
                                setShowForm(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                        >
                            <Plus size={19} />
                            Create Alert
                        </button>
                    )}

                </div>

                {/* FORM */}

                {formVisible && (
                    <div className="mb-8">

                        <JobAlertForm
                            alert={editingAlert}
                            onSaved={
                                handleAlertSaved
                            }
                            onCancel={
                                handleCancelForm
                            }
                        />

                    </div>
                )}

                {/* ERROR */}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 mb-6">

                        <div className="flex items-start gap-3">

                            <AlertCircle
                                size={20}
                                className="shrink-0 mt-0.5"
                            />

                            <div>

                                <p className="font-semibold">
                                    Job Alerts Error
                                </p>

                                <p className="text-sm mt-1">
                                    {error}
                                </p>

                            </div>

                        </div>

                    </div>
                )}

                {/* LOADING */}

                {loading && (
                    <div className="grid md:grid-cols-2 gap-6">

                        {Array.from({
                            length: 3,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-3xl shadow-lg p-6 animate-pulse"
                            >

                                <div className="h-6 bg-gray-200 rounded w-2/3" />

                                <div className="h-4 bg-gray-200 rounded w-1/2 mt-4" />

                                <div className="space-y-3 mt-6">

                                    <div className="h-4 bg-gray-200 rounded" />

                                    <div className="h-4 bg-gray-200 rounded w-5/6" />

                                    <div className="h-4 bg-gray-200 rounded w-2/3" />

                                </div>

                            </div>
                        ))}

                    </div>
                )}

                {/* EMPTY */}

                {!loading &&
                    alerts.length === 0 &&
                    !formVisible && (
                        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

                            <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                <Bell size={38} />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mt-6">
                                No Job Alerts Yet
                            </h2>

                            <p className="text-gray-500 max-w-md mx-auto mt-2">
                                Create a job alert and CareerOS
                                will monitor new opportunities
                                that match your preferences.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowForm(true)
                                }
                                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
                            >
                                <Plus size={19} />
                                Create Your First Alert
                            </button>

                        </div>
                    )}

                {/* ALERT LIST */}

                {!loading &&
                    alerts.length > 0 && (
                        <div>

                            <div className="flex items-center justify-between mb-5">

                                <div>

                                    <h2 className="text-xl font-bold text-slate-800">
                                        Your Alerts
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {alerts.length} saved alert
                                        {alerts.length !== 1
                                            ? "s"
                                            : ""}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={loadAlerts}
                                    disabled={loading}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    <RefreshCw size={17} />
                                    Refresh
                                </button>

                            </div>

                            <div className="grid md:grid-cols-2 gap-6">

                                {alerts.map((alert) => {

                                    const isActive =
                                        alert.enabled !== false &&
                                        alert.active !== false;

                                    const isToggling =
                                        String(togglingId) ===
                                        String(alert.id);

                                    const isDeleting =
                                        String(deletingId) ===
                                        String(alert.id);

                                    return (
                                        <article
                                            key={alert.id}
                                            className={`bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition ${
                                                !isActive
                                                    ? "opacity-90"
                                                    : ""
                                            }`}
                                        >

                                            {/* CARD HEADER */}

                                            <div className="flex items-start justify-between gap-4">

                                                <div className="flex items-center gap-3 min-w-0">

                                                    <div
                                                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                                                            isActive
                                                                ? "bg-blue-50 text-blue-600"
                                                                : "bg-gray-100 text-gray-500"
                                                        }`}
                                                    >
                                                        <Bell size={20} />
                                                    </div>

                                                    <div className="min-w-0">

                                                        <div className="flex items-center gap-2 min-w-0">

                                                            <h3 className="font-bold text-lg text-slate-800 truncate">
                                                                {alert.keyword ||
                                                                    "Job Alert"}
                                                            </h3>

                                                            <span
                                                                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                                                    isActive
                                                                        ? "bg-green-50 text-green-700"
                                                                        : "bg-gray-100 text-gray-600"
                                                                }`}
                                                            >
                                                                {isActive
                                                                    ? "Active"
                                                                    : "Disabled"}
                                                            </span>

                                                        </div>

                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Created{" "}
                                                            {formatDate(
                                                                alert.createdAt
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="flex items-center gap-2">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEditAlert(
                                                                alert
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting ||
                                                            isToggling
                                                        }
                                                        title="Edit job alert"
                                                        aria-label="Edit job alert"
                                                        className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 flex items-center justify-center transition"
                                                    >
                                                        <Pencil size={17} />
                                                    </button>

                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteAlert(
                                                                alert.id
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting ||
                                                            isToggling
                                                        }
                                                        title="Delete job alert"
                                                        aria-label="Delete job alert"
                                                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 flex items-center justify-center transition"
                                                    >
                                                        {isDeleting ? (
                                                            <RefreshCw
                                                                size={18}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Trash2
                                                                size={18}
                                                            />
                                                        )}
                                                    </button>

                                                </div>

                                            </div>

                                            {/* DETAILS */}

                                            <div className="mt-6">

                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                                                    Matching Criteria
                                                </p>

                                                <div className="space-y-3">

                                                    {alert.keyword && (
                                                        <div className="flex justify-between gap-4 text-sm">

                                                            <span className="text-gray-500">
                                                                Keyword
                                                            </span>

                                                            <span className="font-semibold text-slate-700 text-right">
                                                                {alert.keyword}
                                                            </span>

                                                        </div>
                                                    )}

                                                    {alert.location && (
                                                        <div className="flex justify-between gap-4 text-sm">

                                                            <span className="text-gray-500">
                                                                Location
                                                            </span>

                                                            <span className="font-semibold text-slate-700 text-right">
                                                                {alert.location}
                                                            </span>

                                                        </div>
                                                    )}

                                                    {alert.experience &&
                                                        alert.experience !==
                                                            "Any Experience" && (
                                                            <div className="flex justify-between gap-4 text-sm">

                                                                <span className="text-gray-500">
                                                                    Experience
                                                                </span>

                                                                <span className="font-semibold text-slate-700 text-right">
                                                                    {alert.experience}
                                                                </span>

                                                            </div>
                                                        )}

                                                    {alert.jobType &&
                                                        alert.jobType !==
                                                            "Any Type" && (
                                                            <div className="flex justify-between gap-4 text-sm">

                                                                <span className="text-gray-500">
                                                                    Job Type
                                                                </span>

                                                                <span className="font-semibold text-slate-700 text-right">
                                                                    {alert.jobType}
                                                                </span>

                                                            </div>
                                                        )}

                                                    {alert.workMode &&
                                                        alert.workMode !==
                                                            "Any" && (
                                                            <div className="flex justify-between gap-4 text-sm">

                                                                <span className="text-gray-500">
                                                                    Work Mode
                                                                </span>

                                                                <span className="font-semibold text-slate-700 text-right">
                                                                    {alert.workMode}
                                                                </span>

                                                            </div>
                                                        )}

                                                    {alert.salary &&
                                                        alert.salary !==
                                                            "Any Salary" && (
                                                            <div className="flex justify-between gap-4 text-sm">

                                                                <span className="text-gray-500">
                                                                    Salary
                                                                </span>

                                                                <span className="font-semibold text-slate-700 text-right">
                                                                    {alert.salary}
                                                                </span>

                                                            </div>
                                                        )}

                                                </div>

                                            </div>

                                            {/* MANAGEMENT INFO */}

                                            <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-3">

                                                {/* FREQUENCY */}

                                                <div className="rounded-xl bg-slate-50 p-3">

                                                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                        <CalendarClock
                                                            size={15}
                                                        />
                                                        Frequency
                                                    </div>

                                                    <p className="font-semibold text-slate-700 text-sm mt-1">
                                                        {alert.frequency ||
                                                            "Daily"}
                                                    </p>

                                                    <p className="text-[11px] text-gray-400 mt-1">
                                                        Alert check frequency
                                                    </p>

                                                </div>

                                                {/* MATCHES */}

                                                <div className="rounded-xl bg-slate-50 p-3">

                                                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                        <BarChart3
                                                            size={15}
                                                        />
                                                        Matches
                                                    </div>

                                                    <p className="font-semibold text-slate-700 text-sm mt-1">
                                                        {Number(
                                                            alert.matchCount ||
                                                                0
                                                        )}
                                                    </p>

                                                    <p className="text-[11px] text-gray-400 mt-1">
                                                        Matching jobs found
                                                    </p>

                                                </div>

                                            </div>

                                            {/* LAST MATCHED */}

                                            <div className="mt-3 text-xs text-gray-500">

                                                Last matched:{" "}

                                                <span className="font-semibold text-slate-600">
                                                    {formatDate(
                                                        alert.lastMatchedAt
                                                    )}
                                                </span>

                                            </div>

                                            {/* STATUS / TOGGLE */}

                                            <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between gap-4">

                                                <div>

                                                    <span className="text-xs text-gray-500">
                                                        Alert Status
                                                    </span>

                                                    <div className="mt-1">

                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                isActive
                                                                    ? "bg-green-50 text-green-700"
                                                                    : "bg-gray-100 text-gray-600"
                                                            }`}
                                                        >
                                                            {isActive
                                                                ? "Active"
                                                                : "Disabled"}
                                                        </span>

                                                    </div>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleAlert(
                                                            alert
                                                        )
                                                    }
                                                    disabled={
                                                        isToggling ||
                                                        isDeleting
                                                    }
                                                    className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition disabled:opacity-50 ${
                                                        isActive
                                                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                            : "bg-green-600 text-white hover:bg-green-700"
                                                    }`}
                                                >

                                                    {isToggling ? (
                                                        <RefreshCw
                                                            size={16}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Power size={16} />
                                                    )}

                                                    {isActive
                                                        ? "Disable"
                                                        : "Enable"}

                                                </button>

                                            </div>

                                        </article>
                                    );
                                })}

                            </div>

                        </div>
                    )}

            </div>

        </div>
    );
}

export default JobAlertsPage;