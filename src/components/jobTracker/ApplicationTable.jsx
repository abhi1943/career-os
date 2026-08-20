import {
    CheckCircle2,
    Trash2,
} from "lucide-react";

import {
    APPLICATION_STATUSES,
} from "../../services/applicationService";

function ApplicationTable({
    applications,
    onStatusChange,
    onDelete,
}) {
    function getCompany(job) {
        if (!job) {
            return "-";
        }

        if (typeof job.company === "string") {
            return job.company;
        }

        return (
            job.company?.display_name ||
            job.company?.name ||
            "-"
        );
    }

    function getLocation(job) {
        if (!job) {
            return "-";
        }

        if (typeof job.location === "string") {
            return job.location;
        }

        return (
            job.location?.display_name ||
            "-"
        );
    }

    function getSalary(job) {
        if (!job) {
            return "-";
        }

        if (typeof job.salary === "string") {
            return job.salary;
        }

        if (typeof job.salary === "number") {
            return String(job.salary);
        }

        if (job.salary_min || job.salary_max) {
            const min = job.salary_min || "";
            const max = job.salary_max || "";

            if (min && max) {
                return `${min} - ${max}`;
            }

            return min || max;
        }

        return "-";
    }

    function formatDate(date) {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }

    function statusColor(status) {
        switch (status) {
            case "Applied":
                return "bg-blue-100 text-blue-700";

            case "Interview":
                return "bg-yellow-100 text-yellow-700";

            case "Offer":
                return "bg-green-100 text-green-700";

            case "Rejected":
                return "bg-red-100 text-red-700";

            case "Withdrawn":
                return "bg-gray-100 text-gray-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    }

    if (!applications.length) {
        return (
            <div className="bg-white rounded-3xl shadow-lg p-10 mt-8 text-center">

                <CheckCircle2
                    size={40}
                    className="mx-auto text-gray-300"
                />

                <h2 className="text-xl font-semibold text-gray-600 mt-4">
                    No Job Applications Found
                </h2>

                <p className="text-gray-500 mt-2">
                    Applications you mark as applied
                    will appear here.
                </p>

            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-lg mt-8 overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                                Company
                            </th>

                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                                Role
                            </th>

                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                                Location
                            </th>

                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                                Salary
                            </th>

                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                                Applied
                            </th>

                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                                Status
                            </th>

                            <th className="p-4 text-center text-sm font-semibold text-gray-700">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {applications.map(
                            (application) => {
                                const job =
                                    application.job || {};

                                const company =
                                    getCompany(job);

                                const role =
                                    job.title || "-";

                                const location =
                                    getLocation(job);

                                const salary =
                                    getSalary(job);

                                const status =
                                    application.status ||
                                    "Applied";

                                return (
                                    <tr
                                        key={
                                            application.jobId
                                        }
                                        className="border-t border-gray-100 hover:bg-slate-50 transition"
                                    >

                                        {/* COMPANY */}
                                        <td className="p-4">

                                            <div className="font-semibold text-gray-900">
                                                {company}
                                            </div>

                                            {job.category && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {typeof job.category === "string"
                                                        ? job.category
                                                        : job.category?.label ||
                                                        job.category?.tag ||
                                                        "-"}
                                                </div>
                                            )}

                                        </td>

                                        {/* ROLE */}
                                        <td className="p-4 text-gray-700">
                                            {role}
                                        </td>

                                        {/* LOCATION */}
                                        <td className="p-4 text-gray-700">
                                            {location}
                                        </td>

                                        {/* SALARY */}
                                        <td className="p-4 text-gray-700">
                                            {salary}
                                        </td>

                                        {/* APPLIED DATE */}
                                        <td className="p-4 text-gray-700 whitespace-nowrap">
                                            {formatDate(
                                                application.appliedAt
                                            )}
                                        </td>

                                        {/* STATUS */}
                                        <td className="p-4">

                                            <select
                                                value={status}
                                                onChange={(event) =>
                                                    onStatusChange(
                                                        application.jobId,
                                                        event.target.value
                                                    )
                                                }
                                                className={`
                                                    px-3
                                                    py-2
                                                    rounded-full
                                                    text-sm
                                                    font-semibold
                                                    border-0
                                                    outline-none
                                                    cursor-pointer
                                                    ${statusColor(status)}
                                                `}
                                            >

                                                {APPLICATION_STATUSES.map(
                                                    (statusOption) => (
                                                        <option
                                                            key={
                                                                statusOption
                                                            }
                                                            value={
                                                                statusOption
                                                            }
                                                        >
                                                            {
                                                                statusOption
                                                            }
                                                        </option>
                                                    )
                                                )}

                                            </select>

                                        </td>

                                        {/* ACTIONS */}
                                        <td className="p-4">

                                            <div className="flex justify-center">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDelete(
                                                            application.jobId
                                                        )
                                                    }
                                                    className="
                                                        bg-red-50
                                                        hover:bg-red-100
                                                        text-red-600
                                                        px-3
                                                        py-2
                                                        rounded-lg
                                                        flex
                                                        items-center
                                                        gap-2
                                                        transition
                                                    "
                                                    title="Remove application"
                                                >

                                                    <Trash2
                                                        size={16}
                                                    />

                                                    Remove

                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                );
                            }
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default ApplicationTable;