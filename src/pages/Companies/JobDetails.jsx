
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  calculateJobMatch,
  getMatchLabel,
} from "../../utils/jobMatcher";

import {
  getJobById,
  getRelatedJobs,
} from "../../services/jobService";

import { CareerContext } from "../../context/CareerContext";

import JobMatchBadge from "../../components/jobs/JobMatchBadge";
import SaveJobButton from "../../components/jobs/SaveJobButton";
import JobCard from "../../components/jobs/JobCard";

function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { student } = useContext(CareerContext);

  // ==================================================
  // JOB STATE
  // ==================================================

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==================================================
  // RELATED JOBS STATE
  // ==================================================

  const [relatedJobs, setRelatedJobs] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  // ==================================================
  // GET RELATED JOB ID
  // ==================================================

  const getRelatedJobId = useCallback(
    (relatedJob) => {
      if (!relatedJob) {
        return "";
      }

      if (
        relatedJob.id !== undefined &&
        relatedJob.id !== null &&
        String(relatedJob.id).trim() !== ""
      ) {
        return String(relatedJob.id);
      }

      return "";
    },
    []
  );

  // ==================================================
  // LOAD JOB
  // ==================================================

  const loadJob = useCallback(
    async ({ showLoader = true } = {}) => {
      if (!id) {
        setJob(null);
        setLoading(false);
        setRefreshing(false);
        setError("Job ID is missing.");
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const response = await getJobById(id);

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to load job details."
          );
        }

        const fetchedJob =
          response.job ||
          response.data ||
          null;

        if (!fetchedJob) {
          throw new Error(
            "Job details were not found."
          );
        }

        setJob(fetchedJob);
      } catch (err) {
        console.error(
          "CareerOS Job Details Error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load job details."
        );

        if (showLoader) {
          setJob(null);
        }
      } finally {
        if (showLoader) {
          setLoading(false);
        } else {
          setRefreshing(false);
        }
      }
    },
    [id]
  );

  // ==================================================
  // INITIAL JOB LOAD
  // ==================================================

  useEffect(() => {
    let cancelled = false;

    const loadInitialJob = async () => {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getJobById(id);

        if (cancelled) {
          return;
        }

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to load job details."
          );
        }

        const fetchedJob =
          response.job ||
          response.data ||
          null;

        if (!fetchedJob) {
          throw new Error(
            "Job details were not found."
          );
        }

        setJob(fetchedJob);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "CareerOS Job Details Error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load job details."
        );

        setJob(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialJob();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ==================================================
  // FETCH RELATED JOBS
  // ==================================================

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    const fetchRelatedJobs = async () => {
      try {
        setRelatedLoading(true);

        const response = await getRelatedJobs(id);

        if (cancelled) {
          return;
        }

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to load related jobs."
          );
        }

        const jobs = Array.isArray(response.jobs)
          ? response.jobs
          : Array.isArray(response.data)
            ? response.data
            : [];

        setRelatedJobs(jobs);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "CareerOS Related Jobs Error:",
          err
        );

        setRelatedJobs([]);
      } finally {
        if (!cancelled) {
          setRelatedLoading(false);
        }
      }
    };

    fetchRelatedJobs();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ==================================================
  // UNIQUE RELATED JOBS
  // ==================================================

  const uniqueRelatedJobs = useMemo(() => {
    const seen = new Set();

    return relatedJobs.reduce(
      (result, relatedJob) => {
        if (!relatedJob) {
          return result;
        }

        const relatedJobId =
          getRelatedJobId(relatedJob);

        if (!relatedJobId) {
          return result;
        }

        const normalizedId =
          String(relatedJobId);

        // Never show current job
        if (
          normalizedId === String(id)
        ) {
          return result;
        }

        // Remove duplicates
        if (seen.has(normalizedId)) {
          return result;
        }

        seen.add(normalizedId);

        result.push({
          ...relatedJob,
          id: normalizedId,
        });

        return result;
      },
      []
    );
  }, [
    relatedJobs,
    id,
    getRelatedJobId,
  ]);

  // ==================================================
  // REFRESH JOB
  // ==================================================

  const handleRefresh = async () => {
    if (!id) {
      return;
    }

    try {
      setRefreshing(true);
      setError("");

      const [
        jobResponse,
        relatedResponse,
      ] = await Promise.all([
        getJobById(id),
        getRelatedJobs(id),
      ]);

      if (!jobResponse?.success) {
        throw new Error(
          jobResponse?.message ||
            "Failed to refresh job."
        );
      }

      const refreshedJob =
        jobResponse.job ||
        jobResponse.data ||
        null;

      if (!refreshedJob) {
        throw new Error(
          "Refreshed job details were not found."
        );
      }

      setJob(refreshedJob);

      if (relatedResponse?.success) {
        const refreshedRelatedJobs =
          Array.isArray(
            relatedResponse.jobs
          )
            ? relatedResponse.jobs
            : Array.isArray(
                relatedResponse.data
              )
              ? relatedResponse.data
              : [];

        setRelatedJobs(
          refreshedRelatedJobs
        );
      } else {
        setRelatedJobs([]);
      }
    } catch (err) {
      console.error(
        "CareerOS Job Refresh Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to refresh job details."
      );
    } finally {
      setRefreshing(false);
    }
  };

  // ==================================================
  // DERIVED JOB DATA
  // ==================================================

  const match = student
    ? calculateJobMatch(job, student)
    : null;

  const matchLabel = match
    ? getMatchLabel(match.score)
    : "";

  const companyName =
    typeof job?.company === "string"
      ? job.company
      : job?.company?.display_name ||
        job?.company?.name ||
        "Company not specified";

  const locationName =
    typeof job?.location === "string"
      ? job.location
      : job?.location?.display_name ||
        job?.location?.name ||
        "Location not specified";

  const jobTitle =
    job?.title ||
    job?.role ||
    "Job Opportunity";

  const salaryMin =
    Number(job?.salary_min) || 0;

  const salaryMax =
    Number(job?.salary_max) || 0;

  const formatLpa = (value) => {
    if (!value) {
      return "";
    }

    return `${(value / 100000).toFixed(1)} LPA`;
  };

  const contractTime =
    job?.contract_time
      ? String(job.contract_time)
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) =>
            char.toUpperCase()
          )
      : "";

  const experience =
    job?.detected_experience ||
    job?.experience ||
    "Not specified";

  const workMode =
    job?.detected_work_mode ||
    job?.workMode ||
    job?.work_mode ||
    "Not specified";

  const jobType =
    job?.detected_job_type ||
    job?.jobType ||
    job?.job_type ||
    "Not specified";

  // ==================================================
  // OPEN RELATED JOB
  // ==================================================

  const openRelatedJob = (relatedJob) => {
    if (!relatedJob) {
      return;
    }

    const relatedJobId =
      getRelatedJobId(relatedJob);

    if (!relatedJobId) {
      return;
    }

    navigate(
      `/companies/job/${encodeURIComponent(
        String(relatedJobId)
      )}`
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // LOADING STATE
  // ==================================================

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-4">
          🔄
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Loading job details...
        </h1>

        <p className="text-gray-500 mt-2">
          Please wait while we load the opportunity.
        </p>
      </div>
    );
  }

  // ==================================================
  // JOB NOT FOUND
  // ==================================================

  if (error || !job) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-4">
          🔍
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Job Not Found
        </h1>

        <p className="text-gray-500 mt-3">
          {error ||
            "We couldn't find the job details."}
        </p>

        <div className="flex justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            ← Back to Jobs
          </button>

          <button
            type="button"
            onClick={() =>
              loadJob({
                showLoader: true,
              })
            }
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* ==================================================
          TOP ACTIONS
      ================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Jobs
        </button>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 px-4 py-2 rounded-xl font-semibold transition"
        >
          {refreshing
            ? "Refreshing..."
            : "🔄 Refresh Job"}
        </button>

      </div>

      {/* ==================================================
          JOB HEADER
      ================================================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

          <div className="flex items-start gap-4">

            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-blue-600">
                {companyName
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>

            <div className="min-w-0">

              <h1 className="text-3xl font-bold text-gray-900">
                {jobTitle}
              </h1>

              <p className="text-blue-600 font-semibold text-lg mt-2">
                🏢 {companyName}
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <SaveJobButton job={job} />

            {job.redirect_url && (
              <a
                href={job.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold text-center"
              >
                Apply Now →
              </a>
            )}

          </div>

        </div>

        {/* ==================================================
            JOB INFORMATION
        ================================================== */}

        <div className="flex flex-wrap gap-3 mt-8">

          <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full">
            📍 {locationName}
          </span>

          <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
            👨‍💻 {experience}
          </span>

          <span className="bg-orange-50 text-orange-700 px-4 py-2 rounded-full">
            🏢 {workMode}
          </span>

          <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full">
            💼 {jobType}
          </span>

          {contractTime && (
            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full">
              📄 {contractTime}
            </span>
          )}

          {salaryMin > 0 && (
            <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full">
              💰 From {formatLpa(salaryMin)}
            </span>
          )}

          {salaryMax > salaryMin && (
            <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full">
              💰 Up to {formatLpa(salaryMax)}
            </span>
          )}

          {job.category?.label && (
            <span className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full">
              📂 {job.category.label}
            </span>
          )}

        </div>

        {match && (
          <div className="mt-6">
            <JobMatchBadge match={match} />
          </div>
        )}

      </div>

      {/* ==================================================
          CAREEROS MATCH
      ================================================== */}

      {student && match && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mt-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                CareerOS Match
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {matchLabel}
              </h2>

              <p className="text-gray-600 mt-2">
                This job matches your career
                profile based on your career
                goal, skills, education and
                experience.
              </p>

            </div>

            <div className="text-center shrink-0">

              <div className="w-24 h-24 rounded-full bg-white border-8 border-blue-500 flex items-center justify-center shadow-sm">

                <span className="text-2xl font-bold text-blue-600">
                  {match.score}%
                </span>

              </div>

              <p className="text-sm font-semibold text-gray-600 mt-2">
                Match Score
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">

            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-500">
                Career
              </p>

              <p className="font-bold text-gray-800">
                {match.careerMatch}%
              </p>
            </div>

            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-500">
                Skills
              </p>

              <p className="font-bold text-gray-800">
                {match.skillMatch}%
              </p>
            </div>

            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-500">
                Education
              </p>

              <p className="font-bold text-gray-800">
                {match.educationMatch}%
              </p>
            </div>

            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-500">
                Role
              </p>

              <p className="font-bold text-gray-800">
                {match.categoryMatch}%
              </p>
            </div>

            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-500">
                Experience
              </p>

              <p className="font-bold text-gray-800">
                {match.experienceMatch}%
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          JOB DESCRIPTION
      ================================================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mt-6">

        <h2 className="text-2xl font-bold text-gray-900">
          About this opportunity
        </h2>

        <p className="text-gray-600 leading-8 mt-5 whitespace-pre-line">
          {job.description ||
            "No job description available."}
        </p>

      </div>

      {/* ==================================================
          ADDITIONAL INFORMATION
      ================================================== */}

      <div className="grid md:grid-cols-2 gap-6 mt-6">

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-bold text-gray-900">
            Company
          </h2>

          <p className="text-gray-600 mt-3">
            🏢 {companyName}
          </p>

        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-bold text-gray-900">
            Location
          </h2>

          <p className="text-gray-600 mt-3">
            📍 {locationName}
          </p>

        </div>

      </div>

      {/* ==================================================
          SKILLS
      ================================================== */}

      {Array.isArray(job.skills) &&
        job.skills.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mt-6">

            <h2 className="text-2xl font-bold text-gray-900">
              Skills
            </h2>

            <div className="flex flex-wrap gap-3 mt-5">

              {job.skills.map(
                (skill, index) => (
                  <span
                    key={`${String(
                      skill
                    )}-${index}`}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>

          </div>
        )}

      {/* ==================================================
          POSTED DATE
      ================================================== */}

      {job.created && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mt-6">

          <p className="text-gray-500 text-sm">
            📅 Posted on{" "}

            <span className="font-semibold text-gray-700">
              {new Date(
                job.created
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </span>
          </p>

        </div>
      )}

      {/* ==================================================
          APPLICATION SECTION
      ================================================== */}

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mt-6">

        <h2 className="text-xl font-bold text-gray-900">
          Interested in this opportunity?
        </h2>

        <p className="text-gray-600 mt-2">
          Click below to continue your
          application on the employer's
          job platform.
        </p>

        {job.redirect_url ? (
          <a
            href={job.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold"
          >
            Apply for this Job →
          </a>
        ) : (
          <p className="text-gray-500 mt-5">
            Application link is currently
            unavailable.
          </p>
        )}

      </div>

      {/* ==================================================
          SIMILAR JOBS
      ================================================== */}

      {(relatedLoading ||
        uniqueRelatedJobs.length > 0) && (
        <div className="mt-10">

          <div className="mb-6">

            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
              CareerOS Recommendations
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              Similar Jobs You May Like
            </h2>

            <p className="text-gray-500 mt-2">
              More opportunities related to this job.
            </p>

          </div>

          {relatedLoading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

              <div className="text-3xl mb-3">
                🔄
              </div>

              <p className="text-gray-500">
                Finding similar jobs...
              </p>

            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">

              {uniqueRelatedJobs.map(
                (relatedJob) => {

                  const relatedMatch =
                    student
                      ? calculateJobMatch(
                          relatedJob,
                          student
                        )
                      : null;

                  return (
                    <JobCard
                      key={relatedJob.id}
                      job={relatedJob}
                      match={relatedMatch}
                      onView={() =>
                        openRelatedJob(
                          relatedJob
                        )
                      }
                    />
                  );
                }
              )}

            </div>
          )}

        </div>
      )}

      {/* ==================================================
          BACK TO JOBS
      ================================================== */}

      <div className="flex justify-center mt-10">

        <button
          type="button"
          onClick={() =>
            navigate("/jobs")
          }
          className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition"
        >
          ← Browse More Jobs
        </button>

      </div>

    </div>
  );
}

export default JobDetails;
