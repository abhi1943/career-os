import {
    MapPin,
    Building2,
    Briefcase,
    Clock3,
    Banknote,
    ExternalLink,
    Layers,
} from "lucide-react";

import JobMatchBadge from "./JobMatchBadge";
import SaveJobButton from "./SaveJobButton";
import ApplicationButton from "./ApplicationButton";

function JobCard({
    job,
    match,
    onView,
    onSavedChange,
    onApplicationChange,
}) {
    if (!job) {
        return null;
    }

    // ======================================================
    // STABLE JOB ID
    // ======================================================

    const jobId = String(
        job.id ||
        job.redirect_url ||
        job.redirectUrl ||
        `${job.title || ""}-${typeof job.company === "string"
            ? job.company
            : job.company?.display_name ||
            job.company?.name ||
            ""
        }`
    );

    // ======================================================
    // COMPANY
    // ======================================================

    const companyName =
        typeof job.company === "string"
            ? job.company
            : job.company?.display_name ||
            job.company?.name ||
            "Company not specified";

    // ======================================================
    // LOCATION
    // ======================================================

    const locationName =
        typeof job.location === "string"
            ? job.location
            : job.location?.display_name ||
            job.location?.area?.join(", ") ||
            job.location?.name ||
            "Location not specified";

    // ======================================================
    // WORK MODE
    // ======================================================

    const workMode =
        job.detected_work_mode ||
        job.workMode ||
        job.work_mode ||
        "Not Specified";

    // <div className="flex items-start gap-3">

    //     <Layers
    //         size={18}
    //         className="text-gray-400 shrink-0 mt-0.5"
    //     />

    //     <span>
    //         Category: {careerCategory}
    //     </span>

    // </div>

    // ======================================================
    // EXPERIENCE
    // ======================================================

    const experience =
        job.detected_experience ||
        job.experience ||
        "Any Experience";

    // ======================================================
    // JOB TYPE
    // ======================================================

    const jobType =
        job.detected_job_type ||
        job.job_type ||
        job.jobType ||
        job.contract_type ||
        job.contract_time ||
        job.type ||
        "Any Type";

    // ======================================================
    // CAREEROS CATEGORY
    // ======================================================

    const careerCategory =
        job.careeros_category_label ||
        job.careeros_category ||
        "Other";

    // ======================================================
    // SALARY
    // ======================================================

    let salary =
        job.salary ||
        job.detected_salary ||
        "";

    if (!salary) {
        if (
            job.salary_min != null &&
            job.salary_max != null
        ) {
            salary = `₹${Number(
                job.salary_min
            ).toLocaleString(
                "en-IN"
            )} - ₹${Number(
                job.salary_max
            ).toLocaleString(
                "en-IN"
            )}`;
        } else if (
            job.salary_min != null
        ) {
            salary = `From ₹${Number(
                job.salary_min
            ).toLocaleString(
                "en-IN"
            )}`;
        } else if (
            job.salary_max != null
        ) {
            salary = `Up to ₹${Number(
                job.salary_max
            ).toLocaleString(
                "en-IN"
            )}`;
        } else {
            salary =
                "Salary not specified";
        }
    }

    // ======================================================
    // SKILLS
    // ======================================================

    // let skills = [];

    // if (Array.isArray(job.skills)) {
    //     skills = job.skills;
    // } else if (
    //     Array.isArray(job.tags)
    // ) {
    //     skills = job.tags;
    // } else if (
    //     typeof job.skills === "string"
    // ) {
    //     skills = job.skills
    //         .split(",")
    //         .map((skill) =>
    //             skill.trim()
    //         )
    //         .filter(Boolean);
    // }

    // skills = skills
    //     .filter(
    //         (skill) =>
    //             typeof skill === "string"
    //     )
    //     .slice(0, 6);

    // ======================================================
    // DESCRIPTION
    // ======================================================

    // const description =
    //     typeof job.description === "string"
    //         ? job.description
    //         : "No job description available.";

    // ======================================================
    // TITLE
    // ======================================================

    const title =
        job.title ||
        "Job Opportunity";

    // ======================================================
    // APPLY URL
    // ======================================================

    const applyUrl =
        job.redirect_url ||
        job.redirectUrl ||
        job.url ||
        "";

    // ======================================================
    // SAVE STATE CHANGE
    // ======================================================

    const handleSavedChange = (
        jobIdFromButton,
        saved,
        normalizedJob = null
    ) => {
        const finalJob = {
            ...(normalizedJob || job),
            id: jobId,
        };

        const finalSaved =
            Boolean(saved);

        if (onSavedChange) {
            onSavedChange(
                finalJob,
                finalSaved
            );
        }
    };
    // ======================================================
    // APPLICATION STATE CHANGE
    // ======================================================

    const handleApplicationChange = (
        application,
        applied
    ) => {
        if (!onSavedChange) {
            // Application state is managed internally
            // when no parent callback is required.
        }

        // Keep this callback available for future
        // application tracking/dashboard integration.
        if (typeof onApplicationChange === "function") {
            onApplicationChange(
                application,
                applied
            );
        }
    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <article className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition duration-200">

            {/* MATCH */}

            {match && (
                <div className="flex justify-end mb-4">
                    <JobMatchBadge
                        match={match}
                        compact
                    />
                </div>
            )}

            {/* HEADER */}

            <div className="flex justify-between gap-4">

                <div className="min-w-0 flex-1">

                    <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {title}
                    </h2>

                    <p className="text-blue-600 font-semibold mt-1 line-clamp-1">
                        {companyName}
                    </p>

                </div>

                <div className="flex items-start gap-2 shrink-0">

                    <SaveJobButton
                        job={{
                            ...job,
                            id: jobId,
                        }}
                        compact
                        onSavedChange={
                            handleSavedChange
                        }
                    />

                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Briefcase size={24} />
                    </div>

                </div>

            </div>

            {/* DETAILS */}

            <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">

                    <Layers
                        size={18}
                        className="text-gray-400 shrink-0 mt-0.5"
                    />

                    <span>
                        Category: {careerCategory}
                    </span>

                </div>

                <div className="flex items-start gap-3">

                    <MapPin
                        size={18}
                        className="text-gray-400 shrink-0 mt-0.5"
                    />

                    <span className="line-clamp-2">
                        {locationName}
                    </span>

                </div>

                <div className="flex items-start gap-3">

                    <Building2
                        size={18}
                        className="text-gray-400 shrink-0 mt-0.5"
                    />

                    <span>
                        {workMode}
                    </span>

                </div>

                <div className="flex items-start gap-3">

                    <Clock3
                        size={18}
                        className="text-gray-400 shrink-0 mt-0.5"
                    />

                    <span>
                        {experience}
                    </span>

                </div>

                <div className="flex items-start gap-3">

                    <Briefcase
                        size={18}
                        className="text-gray-400 shrink-0 mt-0.5"
                    />

                    <span>
                        {jobType}
                    </span>

                </div>

                <div className="flex items-start gap-3">

                    <Banknote
                        size={18}
                        className="text-gray-400 shrink-0 mt-0.5"
                    />

                    <span>
                        {salary}
                    </span>

                </div>

            </div>

            {/* ACTIONS */}

            <div className="flex gap-3 mt-6">

                {onView && (
                    <button
                        type="button"
                        onClick={onView}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                        View Job →
                    </button>
                )}

                {applyUrl && (
                    <a
                        href={applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center justify-center transition"
                        title="Apply on employer/job site"
                    >
                        <ExternalLink
                            size={19}
                        />
                    </a>
                )}

                <ApplicationButton
                    job={{
                        ...job,
                        id: jobId,
                    }}
                    onApplicationChange={
                        handleApplicationChange
                    }
                />

            </div>

        </article>
    );
}

export default JobCard;