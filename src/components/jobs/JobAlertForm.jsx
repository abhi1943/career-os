import { useState } from "react";

import {
    Bell,
    MapPin,
    BriefcaseBusiness,
    Clock3,
    Monitor,
    Banknote,
    CalendarClock,
    Save,
    X,
    Loader2,
} from "lucide-react";

import {
    createJobAlert,
    updateJobAlert,
} from "../../services/jobAlertsService";

// ======================================================
// DEFAULT FORM
// ======================================================

const DEFAULT_FORM = {
    keyword: "",
    location: "India",
    experience: "Any Experience",
    jobType: "Any Type",
    workMode: "Any",
    salary: "Any Salary",
    frequency: "Daily",
    enabled: true,
};

// ======================================================
// COMPONENT
// ======================================================

function JobAlertForm({
    alert = null,
    onSaved,
    onCancel,
}) {
    const [form, setForm] = useState(() => {
        if (!alert) {
            return {
                ...DEFAULT_FORM,
            };
        }

        return {
            keyword:
                alert.keyword || "",
            location:
                alert.location || "India",
            experience:
                alert.experience ||
                "Any Experience",
            jobType:
                alert.jobType ||
                "Any Type",
            workMode:
                alert.workMode ||
                "Any",
            salary:
                alert.salary ||
                "Any Salary",
            frequency:
                alert.frequency ||
                "Daily",
            enabled:
                alert.enabled !== false,
        };
    });

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const isEditMode =
        Boolean(alert?.id);

    // ==================================================
    // HANDLE INPUT
    // ==================================================

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm(
            (previous) => ({
                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value,
            })
        );

        setError("");
        setSuccess("");
    };

    // ==================================================
    // SUBMIT
    // ==================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !form.keyword.trim()
        ) {
            setError(
                "Please enter a job title or keyword."
            );

            return;
        }

        try {
            setSaving(true);

            let savedAlert;

            const payload = {
                ...form,

                keyword:
                    form.keyword.trim(),

                location:
                    form.location.trim() ||
                    "India",
            };

            if (isEditMode) {
                savedAlert =
                    await updateJobAlert(
                        alert.id,
                        payload
                    );

                setSuccess(
                    "Job alert updated successfully."
                );
            } else {
                savedAlert =
                    await createJobAlert(
                        payload
                    );

                setSuccess(
                    "Job alert created successfully."
                );
            }

            if (onSaved) {
                onSaved(
                    savedAlert
                );
            }
        } catch (submitError) {
            console.error(
                "CareerOS JobAlertForm Error:",
                submitError
            );

            setError(
                submitError?.message ||
                    "Unable to save job alert. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // CANCEL
    // ==================================================

    const handleCancel = () => {
        if (saving) {
            return;
        }

        if (onCancel) {
            onCancel();
        }
    };

    // ==================================================
    // RENDER
    // ==================================================

    return (
        <form
            onSubmit={
                handleSubmit
            }
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6"
        >
            {/* HEADER */}

            <div className="flex items-start justify-between gap-4 mb-6">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">

                        <Bell size={22} />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-slate-800">

                            {isEditMode
                                ? "Edit Job Alert"
                                : "Create Job Alert"}

                        </h2>

                        <p className="text-sm text-gray-500 mt-1">

                            Get notified when jobs
                            match your preferences.

                        </p>

                    </div>

                </div>

                {onCancel && (
                    <button
                        type="button"
                        onClick={
                            handleCancel
                        }
                        disabled={saving}
                        className="w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center disabled:opacity-50"
                    >
                        <X size={19} />
                    </button>
                )}

            </div>

            {/* ERROR */}

            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <p className="font-semibold">
                        Unable to save alert
                    </p>

                    <p className="mt-1">
                        {error}
                    </p>

                </div>
            )}

            {/* SUCCESS */}

            {success && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

                    <p className="font-semibold">
                        {success}
                    </p>

                </div>
            )}

            {/* KEYWORD */}

            <div className="mb-5">

                <label
                    htmlFor="job-alert-keyword"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                >
                    Job Title or Keyword
                </label>

                <div className="relative">

                    <BriefcaseBusiness
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        id="job-alert-keyword"
                        name="keyword"
                        type="text"
                        value={
                            form.keyword
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="e.g. React Developer"
                        disabled={saving}
                        className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />

                </div>

                <p className="text-xs text-gray-500 mt-2">
                    Example: React Developer,
                    Java Developer, Data Analyst
                </p>

            </div>

            {/* LOCATION */}

            <div className="mb-5">

                <label
                    htmlFor="job-alert-location"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                >
                    Location
                </label>

                <div className="relative">

                    <MapPin
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        id="job-alert-location"
                        name="location"
                        type="text"
                        value={
                            form.location
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="India"
                        disabled={saving}
                        className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />

                </div>

            </div>

            {/* FILTERS */}

            <div className="grid sm:grid-cols-2 gap-4">

                {/* EXPERIENCE */}

                <div>

                    <label
                        htmlFor="job-alert-experience"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"
                    >
                        <Clock3
                            size={16}
                            className="text-blue-600"
                        />

                        Experience
                    </label>

                    <select
                        id="job-alert-experience"
                        name="experience"
                        value={
                            form.experience
                        }
                        onChange={
                            handleChange
                        }
                        disabled={saving}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                        <option>
                            Any Experience
                        </option>

                        <option>
                            Fresher / 0 years
                        </option>

                        <option>
                            0–1 years
                        </option>

                        <option>
                            1–3 years
                        </option>

                        <option>
                            3–5 years
                        </option>

                        <option>
                            5+ years
                        </option>
                    </select>

                </div>

                {/* JOB TYPE */}

                <div>

                    <label
                        htmlFor="job-alert-job-type"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"
                    >
                        <BriefcaseBusiness
                            size={16}
                            className="text-blue-600"
                        />

                        Job Type
                    </label>

                    <select
                        id="job-alert-job-type"
                        name="jobType"
                        value={
                            form.jobType
                        }
                        onChange={
                            handleChange
                        }
                        disabled={saving}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                        <option>
                            Any Type
                        </option>

                        <option>
                            Full-time
                        </option>

                        <option>
                            Part-time
                        </option>

                        <option>
                            Contract
                        </option>

                        <option>
                            Internship
                        </option>
                    </select>

                </div>

                {/* WORK MODE */}

                <div>

                    <label
                        htmlFor="job-alert-work-mode"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"
                    >
                        <Monitor
                            size={16}
                            className="text-blue-600"
                        />

                        Work Mode
                    </label>

                    <select
                        id="job-alert-work-mode"
                        name="workMode"
                        value={
                            form.workMode
                        }
                        onChange={
                            handleChange
                        }
                        disabled={saving}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                        <option>
                            Any
                        </option>

                        <option>
                            Remote
                        </option>

                        <option>
                            Hybrid
                        </option>

                        <option>
                            On-site
                        </option>
                    </select>

                </div>

                {/* SALARY */}

                <div>

                    <label
                        htmlFor="job-alert-salary"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"
                    >
                        <Banknote
                            size={16}
                            className="text-blue-600"
                        />

                        Salary
                    </label>

                    <select
                        id="job-alert-salary"
                        name="salary"
                        value={
                            form.salary
                        }
                        onChange={
                            handleChange
                        }
                        disabled={saving}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                        <option>
                            Any Salary
                        </option>

                        <option>
                            ₹0–3 LPA
                        </option>

                        <option>
                            ₹3–5 LPA
                        </option>

                        <option>
                            ₹5–10 LPA
                        </option>

                        <option>
                            ₹10–20 LPA
                        </option>

                        <option>
                            ₹20+ LPA
                        </option>
                    </select>

                </div>

                {/* FREQUENCY */}

                <div>

                    <label
                        htmlFor="job-alert-frequency"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"
                    >
                        <CalendarClock
                            size={16}
                            className="text-blue-600"
                        />

                        Alert Frequency
                    </label>

                    <select
                        id="job-alert-frequency"
                        name="frequency"
                        value={
                            form.frequency
                        }
                        onChange={
                            handleChange
                        }
                        disabled={saving}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                        <option>
                            Instant
                        </option>

                        <option>
                            Daily
                        </option>

                        <option>
                            Weekly
                        </option>
                    </select>

                </div>

            </div>

            {/* ENABLE */}

            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">

                <label className="flex items-center justify-between gap-4 cursor-pointer">

                    <div>

                        <p className="font-semibold text-slate-700">
                            Enable Job Alert
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Receive matching job
                            notifications when this
                            alert is active.
                        </p>

                    </div>

                    <div className="relative">

                        <input
                            type="checkbox"
                            name="enabled"
                            checked={
                                form.enabled
                            }
                            onChange={
                                handleChange
                            }
                            disabled={saving}
                            className="sr-only peer"
                        />

                        <div className="w-12 h-7 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 transition" />

                        <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition peer-checked:translate-x-5" />

                    </div>

                </label>

            </div>

            {/* ACTIONS */}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">

                <button
                    type="submit"
                    disabled={
                        saving ||
                        !form.keyword.trim()
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                >

                    {saving ? (
                        <>
                            <Loader2
                                size={19}
                                className="animate-spin"
                            />

                            {isEditMode
                                ? "Updating..."
                                : "Creating..."}
                        </>
                    ) : (
                        <>
                            <Save
                                size={19}
                            />

                            {isEditMode
                                ? "Update Alert"
                                : "Create Alert"}
                        </>
                    )}

                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={
                            handleCancel
                        }
                        disabled={saving}
                        className="sm:w-32 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                        <X size={18} />

                        Cancel
                    </button>
                )}

            </div>

        </form>
    );
}

export default JobAlertForm;