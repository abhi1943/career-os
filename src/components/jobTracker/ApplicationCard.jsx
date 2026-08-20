import {
    Trash2,
} from "lucide-react";

function ApplicationCard({
    application,
    onDelete,
}) {
    const job =
        application?.job || {};

    function getCompany() {
        if (typeof job.company === "string") {
            return job.company;
        }

        return (
            job.company?.display_name ||
            job.company?.name ||
            "-"
        );
    }

    function getLocation() {
        if (typeof job.location === "string") {
            return job.location;
        }

        return (
            job.location?.display_name ||
            "-"
        );
    }

    function getSalary() {
        if (typeof job.salary === "string") {
            return job.salary;
        }

        if (typeof job.salary === "number") {
            return String(job.salary);
        }

        if (job.salary_min || job.salary_max) {
            const min =
                job.salary_min || "";

            const max =
                job.salary_max || "";

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

        const parsedDate =
            new Date(date);

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

    const company =
        getCompany();

    const location =
        getLocation();

    const salary =
        getSalary();

    const status =
        application?.status ||
        "Applied";

    return (
        <div className="bg-white rounded-3xl shadow-lg p-6">

            {/* COMPANY */}
            <div>
                <h2 className="text-xl font-bold text-gray-900">
                    {company}
                </h2>

                <p className="text-gray-600 mt-1">
                    {job.title || "-"}
                </p>
            </div>

            {/* DETAILS */}
            <div className="mt-5 space-y-2 text-sm text-gray-600">

                <p>
                    <span className="font-semibold text-gray-700">
                        Location:
                    </span>{" "}
                    {location}
                </p>

                <p>
                    <span className="font-semibold text-gray-700">
                        Salary:
                    </span>{" "}
                    {salary}
                </p>

                <p>
                    <span className="font-semibold text-gray-700">
                        Applied:
                    </span>{" "}
                    {formatDate(
                        application?.appliedAt
                    )}
                </p>

            </div>

            {/* STATUS */}
            <div className="mt-4">

                <span
                    className={`
                        inline-flex
                        px-3
                        py-1.5
                        rounded-full
                        text-sm
                        font-semibold
                        ${statusColor(status)}
                    `}
                >
                    {status}
                </span>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-6">

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
                        px-4
                        py-2
                        rounded-lg
                        flex
                        items-center
                        gap-2
                        font-semibold
                        transition
                    "
                >
                    <Trash2 size={16} />

                    Remove
                </button>

            </div>

        </div>
    );
}

export default ApplicationCard;