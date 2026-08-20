import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    ArrowLeft,
    BriefcaseBusiness,
    MapPin,
    IndianRupee,
    Clock3,
    ExternalLink,
    Building2,
    CheckCircle2,
} from "lucide-react";

import {
    getJobById,
    getRelatedJobs,
} from "../../services/jobService";

import JobCard from "../../components/jobs/JobCard";

function JobDetails() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [relatedJobs, setRelatedJobs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [relatedLoading, setRelatedLoading] = useState(false);

    const [error, setError] = useState("");

    // ======================================================
    // LOAD JOB
    // ======================================================

    useEffect(() => {
        async function loadJob() {
            try {
                setLoading(true);
                setError("");

                setRelatedJobs([]);

                if (!id) {
                    throw new Error("Job ID is missing.");
                }

                // --------------------------------------------------
                // GET SINGLE JOB
                // --------------------------------------------------

                const data = await getJobById(id);

                if (!data?.success) {
                    throw new Error(
                        data?.message ||
                            "Unable to load job details."
                    );
                }

                const foundJob = data?.job;

                if (!foundJob) {
                    throw new Error(
                        "Job opportunity not found."
                    );
                }

                setJob(foundJob);

                // --------------------------------------------------
                // GET RELATED JOBS
                // --------------------------------------------------

                try {
                    setRelatedLoading(true);

                    const relatedData =
                        await getRelatedJobs(
                            foundJob.id
                        );

                    if (relatedData?.success) {
                        setRelatedJobs(
                            Array.isArray(
                                relatedData.jobs
                            )
                                ? relatedData.jobs
                                : []
                        );
                    } else {
                        setRelatedJobs([]);
                    }
                } catch (relatedError) {
                    console.error(
                        "Related Jobs Error:",
                        relatedError
                    );

                    setRelatedJobs([]);
                } finally {
                    setRelatedLoading(false);
                }
            } catch (err) {
                console.error(
                    "Job Details Error:",
                    err
                );

                setError(
                    err?.message ||
                        "Unable to load job details."
                );

                setJob(null);
            } finally {
                setLoading(false);
            }
        }

        loadJob();
    }, [id]);

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">

                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-gray-500">
                        Loading job details...
                    </p>

                </div>
            </div>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

    if (error || !job) {
        return (
            <div className="min-h-screen bg-slate-100 py-16">

                <div className="max-w-4xl mx-auto px-6">

                    <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

                        <BriefcaseBusiness
                            size={50}
                            className="mx-auto text-gray-400"
                        />

                        <h1 className="text-2xl font-bold text-slate-800 mt-5">
                            Job Not Found
                        </h1>

                        <p className="text-gray-500 mt-2">
                            {error ||
                                "This job opportunity is no longer available."}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                window.history.back()
                            }
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                        >
                            Go Back
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    // ======================================================
    // COMPANY
    // ======================================================

    const company =
        typeof job.company === "string"
            ? job.company
            : job.company?.display_name ||
              "Company not specified";

    // ======================================================
    // LOCATION
    // ======================================================

    const location =
        typeof job.location === "string"
            ? job.location
            : job.location?.display_name ||
              job.location?.area?.join(", ") ||
              "India";

    // ======================================================
    // SALARY
    // ======================================================

    const salary =
        job?.salary_min &&
        job?.salary_max
            ? `₹${Math.round(
                  job.salary_min
              ).toLocaleString(
                  "en-IN"
              )} - ₹${Math.round(
                  job.salary_max
              ).toLocaleString(
                  "en-IN"
              )}`
            : job?.salary_min
                ? `From ₹${Math.round(
                      job.salary_min
                  ).toLocaleString(
                      "en-IN"
                  )}`
                : job?.salary_max
                    ? `Up to ₹${Math.round(
                          job.salary_max
                      ).toLocaleString(
                          "en-IN"
                      )}`
                    : job?.detected_salary ||
                      "Salary not specified";

    // ======================================================
    // DESCRIPTION
    // ======================================================

    const description =
        job?.description ||
        "No job description available.";

    // ======================================================
    // JOB TYPE
    // ======================================================

    const jobType =
        job?.detected_job_type ||
        job?.job_type ||
        job?.contract_type ||
        job?.contract_time ||
        "Not specified";

    // ======================================================
    // EXPERIENCE
    // ======================================================

    const experience =
        job?.detected_experience ||
        job?.experience ||
        "Any Experience";

    // ======================================================
    // WORK MODE
    // ======================================================

    const workMode =
        job?.detected_work_mode ||
        job?.work_mode ||
        job?.workMode ||
        "Not Specified";

    // ======================================================
    // CATEGORY
    // ======================================================

    const category =
        typeof job.category === "string"
            ? job.category
            : job?.category?.label ||
              "Technology";

    // ======================================================
    // SKILLS
    // ======================================================

    const skills = Array.isArray(job?.skills)
        ? job.skills.filter(
              (skill) =>
                  typeof skill === "string"
          )
        : Array.isArray(job?.tags)
            ? job.tags.filter(
                  (skill) =>
                      typeof skill ===
                      "string"
              )
            : [];

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="min-h-screen bg-slate-100 py-12">

            <div className="max-w-5xl mx-auto px-6">

                {/* ==================================================
                    BACK
                ================================================== */}

                <button
                    type="button"
                    onClick={() =>
                        window.history.back()
                    }
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold mb-6 transition"
                >
                    <ArrowLeft size={19} />

                    Back to Jobs
                </button>

                {/* ==================================================
                    JOB HEADER
                ================================================== */}

                <div className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                        <div>

                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">

                                <BriefcaseBusiness
                                    size={28}
                                    className="text-blue-600"
                                />

                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                                {job.title ||
                                    "Job Opportunity"}
                            </h1>

                            <p className="text-blue-600 font-semibold text-lg mt-3 flex items-center gap-2">

                                <Building2
                                    size={19}
                                />

                                {company}

                            </p>

                        </div>

                        {job.redirect_url && (
                            <a
                                href={
                                    job.redirect_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                            >
                                Apply Now

                                <ExternalLink
                                    size={18}
                                />
                            </a>
                        )}

                    </div>

                    {/* ==================================================
                        JOB DETAILS
                    ================================================== */}

                    <div className="grid md:grid-cols-2 gap-4 mt-8">

                        {/* LOCATION */}

                        <div className="bg-slate-50 rounded-2xl p-5">

                            <MapPin
                                size={21}
                                className="text-red-500"
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Location
                            </p>

                            <p className="font-semibold text-slate-800 mt-1">
                                {location}
                            </p>

                        </div>

                        {/* SALARY */}

                        <div className="bg-slate-50 rounded-2xl p-5">

                            <IndianRupee
                                size={21}
                                className="text-green-600"
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Salary
                            </p>

                            <p className="font-semibold text-slate-800 mt-1">
                                {salary}
                            </p>

                        </div>

                        {/* JOB TYPE */}

                        <div className="bg-slate-50 rounded-2xl p-5">

                            <Clock3
                                size={21}
                                className="text-orange-500"
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Job Type
                            </p>

                            <p className="font-semibold text-slate-800 mt-1">
                                {jobType}
                            </p>

                        </div>

                        {/* EXPERIENCE */}

                        <div className="bg-slate-50 rounded-2xl p-5">

                            <BriefcaseBusiness
                                size={21}
                                className="text-blue-600"
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Experience
                            </p>

                            <p className="font-semibold text-slate-800 mt-1">
                                {experience}
                            </p>

                        </div>

                        {/* WORK MODE */}

                        <div className="bg-slate-50 rounded-2xl p-5">

                            <Building2
                                size={21}
                                className="text-purple-600"
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Work Mode
                            </p>

                            <p className="font-semibold text-slate-800 mt-1">
                                {workMode}
                            </p>

                        </div>

                        {/* CATEGORY */}

                        <div className="bg-slate-50 rounded-2xl p-5">

                            <BriefcaseBusiness
                                size={21}
                                className="text-indigo-600"
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Category
                            </p>

                            <p className="font-semibold text-slate-800 mt-1">
                                {category}
                            </p>

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

                    <h2 className="text-2xl font-bold text-slate-800">
                        Job Description
                    </h2>

                    <div className="mt-5 text-gray-600 leading-7 whitespace-pre-line">
                        {description}
                    </div>

                </div>

                {/* ==================================================
                    SKILLS
                ================================================== */}

                {skills.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

                        <h2 className="text-2xl font-bold text-slate-800">
                            Skills & Requirements
                        </h2>

                        <div className="flex flex-wrap gap-3 mt-5">

                            {skills.map(
                                (
                                    skill,
                                    index
                                ) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-full font-medium"
                                    >
                                        <CheckCircle2
                                            size={16}
                                        />

                                        {skill}
                                    </span>
                                )
                            )}

                        </div>

                    </div>
                )}

                {/* ==================================================
                    RELATED JOBS
                ================================================== */}

                <div className="mt-10">

                    <div className="mb-6">

                        <h2 className="text-2xl font-bold text-slate-800">
                            Related Jobs
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Jobs that match this opportunity
                            based on role, skills,
                            experience, location and job
                            type.
                        </p>

                    </div>

                    {relatedLoading ? (
                        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

                            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

                            <p className="text-gray-500 mt-4">
                                Finding related jobs...
                            </p>

                        </div>
                    ) : relatedJobs.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">

                            {relatedJobs.map(
                                (relatedJob) => (
                                    <JobCard
                                        key={
                                            relatedJob.id
                                        }
                                        job={
                                            relatedJob
                                        }
                                    />
                                )
                            )}

                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

                            <BriefcaseBusiness
                                size={42}
                                className="mx-auto text-gray-400"
                            />

                            <h3 className="text-lg font-bold text-slate-800 mt-4">
                                No related jobs found
                            </h3>

                            <p className="text-gray-500 mt-1">
                                We couldn't find similar
                                opportunities right now.
                            </p>

                        </div>
                    )}

                </div>

                {/* ==================================================
                    APPLY CTA
                ================================================== */}

                {job.redirect_url && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg p-8 mt-8 text-white">

                        <h2 className="text-2xl font-bold">
                            Interested in this opportunity?
                        </h2>

                        <p className="text-blue-100 mt-2">
                            Apply directly through the
                            employer or original job
                            listing.
                        </p>

                        <a
                            href={
                                job.redirect_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-6 bg-white text-blue-700 hover:bg-blue-50 px-7 py-3 rounded-xl font-bold transition"
                        >
                            Apply for this Job

                            <ExternalLink
                                size={18}
                            />
                        </a>

                    </div>
                )}

            </div>

        </div>
    );
}

export default JobDetails;