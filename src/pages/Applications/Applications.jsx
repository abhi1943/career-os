import {
Briefcase,
CalendarDays,
Building2,
MapPin,
ExternalLink,
Plus,
Trash2,
} from "lucide-react";

import {
useEffect,
useState,
} from "react";

// ======================================================
// DEFAULT FORM
// ======================================================

const DEFAULT_FORM = {
jobTitle: "",
company: "",
location: "",
status: "Applied",
appliedDate: "",
jobUrl: "",
notes: "",
};

// ======================================================
// LOAD APPLICATIONS
// ======================================================

function loadApplications() {
try {
const saved =
localStorage.getItem(
"careerOS_applications"
);

  
    if (!saved) {
        return [];
    }

    const parsed =
        JSON.parse(saved);

    return Array.isArray(parsed)
        ? parsed
        : [];

} catch (error) {

    console.error(
        "Applications Load Error:",
        error
    );

    return [];
}
  

}

// ======================================================
// COMPONENT
// ======================================================

function Applications() {

  
const [
    applications,
    setApplications,
] = useState(loadApplications);

const [
    showForm,
    setShowForm,
] = useState(false);

const [
    form,
    setForm,
] = useState({
    ...DEFAULT_FORM,
});


// ==================================================
// SAVE APPLICATIONS
// ==================================================

useEffect(() => {

    try {

        localStorage.setItem(
            "careerOS_applications",
            JSON.stringify(
                applications
            )
        );

    } catch (error) {

        console.error(
            "Applications Save Error:",
            error
        );
    }

}, [applications]);


// ==================================================
// FORM CHANGE
// ==================================================

const handleChange = (
    event
) => {

    const {
        name,
        value,
    } = event.target;

    setForm(
        (previous) => ({
            ...previous,
            [name]: value,
        })
    );
};


// ==================================================
// ADD APPLICATION
// ==================================================

const handleSubmit = (
    event
) => {

    event.preventDefault();

    if (
        !form.jobTitle.trim() ||
        !form.company.trim()
    ) {
        return;
    }

    const newApplication = {
        id: Date.now(),
        ...form,
    };

    setApplications(
        (previous) => [
            newApplication,
            ...previous,
        ]
    );

    setForm({
        ...DEFAULT_FORM,
    });

    setShowForm(false);
};


// ==================================================
// DELETE APPLICATION
// ==================================================

const handleDelete = (
    id
) => {

    setApplications(
        (previous) =>
            previous.filter(
                (application) =>
                    application.id !== id
            )
    );
};


// ==================================================
// STATUS STYLE
// ==================================================

const getStatusClass = (
    status
) => {

    switch (status) {

        case "Applied":
            return "bg-blue-100 text-blue-700";

        case "Under Review":
            return "bg-yellow-100 text-yellow-700";

        case "Interview":
            return "bg-purple-100 text-purple-700";

        case "Selected":
            return "bg-green-100 text-green-700";

        case "Rejected":
            return "bg-red-100 text-red-700";

        case "Withdrawn":
            return "bg-gray-100 text-gray-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
};


// ==================================================
// STATS
// ==================================================

const totalApplications =
    applications.length;

const interviews =
    applications.filter(
        (application) =>
            application.status ===
            "Interview"
    ).length;

const selected =
    applications.filter(
        (application) =>
            application.status ===
            "Selected"
    ).length;

const rejected =
    applications.filter(
        (application) =>
            application.status ===
            "Rejected"
    ).length;


// ==================================================
// UI
// ==================================================

return (
    <div className="min-h-screen bg-gray-50">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="bg-white border-b border-gray-200">

            <div className="max-w-7xl mx-auto px-6 py-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">

                                <Briefcase
                                    size={25}
                                    className="text-blue-600"
                                />

                            </div>

                            <div>

                                <h1 className="text-3xl font-bold text-gray-900">
                                    Applications
                                </h1>

                                <p className="text-gray-500 mt-1">
                                    Track and manage your job applications.
                                </p>

                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setShowForm(
                                !showForm
                            )
                        }
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                    >
                        <Plus size={19} />

                        Add Application
                    </button>

                </div>

            </div>

        </div>


        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="max-w-7xl mx-auto px-6 py-8">

            {/* ==================================================
                STATS
            ================================================== */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                <div className="bg-white rounded-2xl border border-gray-200 p-5">

                    <p className="text-sm text-gray-500">
                        Total Applications
                    </p>

                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {totalApplications}
                    </p>

                </div>


                <div className="bg-white rounded-2xl border border-gray-200 p-5">

                    <p className="text-sm text-gray-500">
                        Interviews
                    </p>

                    <p className="text-3xl font-bold text-purple-600 mt-2">
                        {interviews}
                    </p>

                </div>


                <div className="bg-white rounded-2xl border border-gray-200 p-5">

                    <p className="text-sm text-gray-500">
                        Selected
                    </p>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {selected}
                    </p>

                </div>


                <div className="bg-white rounded-2xl border border-gray-200 p-5">

                    <p className="text-sm text-gray-500">
                        Rejected
                    </p>

                    <p className="text-3xl font-bold text-red-600 mt-2">
                        {rejected}
                    </p>

                </div>

            </div>


            {/* ==================================================
                ADD FORM
            ================================================== */}

            {showForm && (

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mb-8">

                    <div className="flex items-center justify-between mb-6">

                        <div>

                            <h2 className="text-xl font-bold text-gray-900">
                                Add Job Application
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Enter the details of the job you applied for.
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >

                        {/* JOB TITLE */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Title *
                            </label>

                            <input
                                type="text"
                                name="jobTitle"
                                value={
                                    form.jobTitle
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. React Developer"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />

                        </div>


                        {/* COMPANY */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Company *
                            </label>

                            <input
                                type="text"
                                name="company"
                                value={
                                    form.company
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. TCS"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />

                        </div>


                        {/* LOCATION */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={
                                    form.location
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Chennai / Remote"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* STATUS */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Status
                            </label>

                            <select
                                name="status"
                                value={
                                    form.status
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option>
                                    Applied
                                </option>

                                <option>
                                    Under Review
                                </option>

                                <option>
                                    Interview
                                </option>

                                <option>
                                    Selected
                                </option>

                                <option>
                                    Rejected
                                </option>

                                <option>
                                    Withdrawn
                                </option>

                            </select>

                        </div>


                        {/* DATE */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Applied Date
                            </label>

                            <input
                                type="date"
                                name="appliedDate"
                                value={
                                    form.appliedDate
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* URL */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job URL
                            </label>

                            <input
                                type="url"
                                name="jobUrl"
                                value={
                                    form.jobUrl
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="https://..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* NOTES */}

                        <div className="md:col-span-2">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Notes
                            </label>

                            <textarea
                                name="notes"
                                value={
                                    form.notes
                                }
                                onChange={
                                    handleChange
                                }
                                rows="3"
                                placeholder="Add notes about this application..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                            />

                        </div>


                        {/* BUTTONS */}

                        <div className="md:col-span-2 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowForm(
                                        false
                                    )
                                }
                                className="px-5 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                            >
                                Save Application
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* ==================================================
                APPLICATIONS
            ================================================== */}

            {applications.length === 0 ? (

                <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">

                    <div className="h-16 w-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-5">

                        <Briefcase
                            size={30}
                            className="text-blue-500"
                        />

                    </div>

                    <h2 className="text-xl font-bold text-gray-900">
                        No applications yet
                    </h2>

                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                        Start tracking your job applications by adding the jobs you have applied for.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setShowForm(true)
                        }
                        className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                    >
                        <Plus size={18} />

                        Add Application
                    </button>

                </div>

            ) : (

                <div className="space-y-4">

                    {applications.map(
                        (application) => (

                            <div
                                key={
                                    application.id
                                }
                                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition"
                            >

                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                                    <div className="flex gap-4">

                                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">

                                            <Building2
                                                size={22}
                                                className="text-blue-600"
                                            />

                                        </div>


                                        <div>

                                            <div className="flex flex-wrap items-center gap-3">

                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {
                                                        application.jobTitle
                                                    }
                                                </h3>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                        application.status
                                                    )}`}
                                                >
                                                    {
                                                        application.status
                                                    }
                                                </span>

                                            </div>


                                            <p className="text-gray-700 font-medium mt-1">
                                                {
                                                    application.company
                                                }
                                            </p>


                                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">

                                                {application.location && (

                                                    <span className="flex items-center gap-1">

                                                        <MapPin
                                                            size={15}
                                                        />

                                                        {
                                                            application.location
                                                        }

                                                    </span>
                                                )}


                                                {application.appliedDate && (

                                                    <span className="flex items-center gap-1">

                                                        <CalendarDays
                                                            size={15}
                                                        />

                                                        {
                                                            application.appliedDate
                                                        }

                                                    </span>
                                                )}

                                            </div>


                                            {application.notes && (

                                                <p className="text-sm text-gray-500 mt-3">
                                                    {
                                                        application.notes
                                                    }
                                                </p>
                                            )}

                                        </div>

                                    </div>


                                    <div className="flex items-center gap-2">

                                        {application.jobUrl && (

                                            <a
                                                href={
                                                    application.jobUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-10 px-4 rounded-xl border border-gray-200 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition"
                                            >

                                                <ExternalLink
                                                    size={16}
                                                />

                                                View Job

                                            </a>
                                        )}


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    application.id
                                                )
                                            }
                                            className="h-10 w-10 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                                            aria-label="Delete application"
                                        >

                                            <Trash2
                                                size={17}
                                            />

                                        </button>

                                    </div>

                                </div>

                            </div>
                        )
                    )}

                </div>

            )}

        </div>

    </div>
);
  

}

export default Applications;
