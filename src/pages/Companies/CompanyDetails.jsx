import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
} from "lucide-react";

import { getCompanyById } from "../../utils/companyEngine";

function CompanyDetails() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ======================================================
  // COMPANY DATA
  // ======================================================

  /*
   * Companies.jsx passes the complete company object
   * through React Router state.
   *
   * This is now the primary source.
   */
  const stateCompany = location.state?.company;

  /*
   * Decode the URL parameter because the company name
   * may contain spaces or special characters.
   */
 const decodedCompanyId = (() => {
  try {
    return decodeURIComponent(companyId || "");
  } catch {
    return companyId || "";
  }
})();

  /*

   * This keeps the existing static company data working
   * if someone directly opens an old company URL.
   */
  const staticCompany =
    getCompanyById(decodedCompanyId) ||
    getCompanyById(companyId);

  const company =
    stateCompany || staticCompany;

  // ======================================================
  // COMPANY NOT FOUND
  // ======================================================

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">

        <div className="text-6xl mb-5">
          🏢
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Company Not Found
        </h1>

        <p className="text-gray-500 mt-3">
          The company you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() => navigate("/companies")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          ← Back to Companies
        </button>

      </div>
    );
  }

  // ======================================================
  // NORMALIZE COMPANY DATA
  // ======================================================

  const companyName =
    company.name ||
    company.shortName ||
    decodedCompanyId;

  const companyLocation =
    company.location ||
    "India";

  const companyCategory =
    company.category ||
    company.industry ||
    "Other";

  const companyJobs =
    Array.isArray(company.jobs)
      ? company.jobs
      : [];

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* ==================================================
          BACK BUTTON
      ================================================== */}

      <button
        type="button"
        onClick={() => navigate("/companies")}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition mb-6"
      >
        <ArrowLeft size={18} />
        Back to Companies
      </button>

      {/* ==================================================
          COMPANY HEADER
      ================================================== */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl text-white p-8 md:p-10 shadow-lg">

        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">

          {company.logo || (
            <span>
              {companyName
                .slice(0, 2)
                .toUpperCase()}
            </span>
          )}

        </div>

        <h1 className="text-4xl md:text-5xl font-bold mt-5">
          {companyName}
        </h1>

        {company.shortName &&
          company.shortName !== companyName && (
            <p className="text-xl mt-2 opacity-90">
              {company.shortName}
            </p>
          )}

        <div className="flex flex-wrap gap-5 mt-6">

          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span>
              {companyLocation}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase size={18} />
            <span>
              {companyCategory}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Building2 size={18} />
            <span>
              {companyJobs.length}{" "}
              {companyJobs.length === 1
                ? "Open Job"
                : "Open Jobs"}
            </span>
          </div>

        </div>

      </div>

      {/* ==================================================
          COMPANY INFORMATION + JOB SUMMARY
      ================================================== */}

      <div className="grid md:grid-cols-2 gap-8 mt-10">

        {/* COMPANY INFORMATION */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Company Information
          </h2>

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <MapPin
                size={20}
                className="text-blue-600"
              />

              <div>
                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="font-semibold text-gray-800">
                  {companyLocation}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <Briefcase
                size={20}
                className="text-blue-600"
              />

              <div>
                <p className="text-sm text-gray-500">
                  Category
                </p>

                <p className="font-semibold text-gray-800">
                  {companyCategory}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <Building2
                size={20}
                className="text-blue-600"
              />

              <div>
                <p className="text-sm text-gray-500">
                  Open Positions
                </p>

                <p className="font-semibold text-gray-800">
                  {companyJobs.length}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            COMPANY SKILLS
        ================================================== */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Skills
          </h2>

          {Array.isArray(company.skills) &&
          company.skills.length > 0 ? (

            <div className="flex flex-wrap gap-3">

              {company.skills.map(
                (skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>

          ) : (

            <p className="text-gray-500">
              Skills will be available based on
              current job openings.
            </p>

          )}

        </div>

      </div>

      {/* ==================================================
          OPEN JOBS
      ================================================== */}

      <div className="mt-10 bg-white rounded-2xl shadow p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Current Job Openings
            </h2>

            <p className="text-gray-500 mt-1">
              Jobs currently available at{" "}
              {companyName}.
            </p>

          </div>

          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-semibold">
            {companyJobs.length}{" "}
            {companyJobs.length === 1
              ? "Job"
              : "Jobs"}
          </div>

        </div>

        {companyJobs.length > 0 ? (

          <div className="space-y-4">

            {companyJobs.map(
              (job, index) => {

                const jobId =
                  job?.id ||
                  job?.redirect_url;

                return (
                  <div
                    key={
                      jobId ||
                      `${job?.title}-${index}`
                    }
                    className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>

                        <h3 className="text-lg font-bold text-gray-900">
                          {job?.title ||
                            "Job Opening"}
                        </h3>

                        {job?.location && (
                          <p className="text-sm text-gray-500 mt-1">
                            📍{" "}
                            {typeof job.location ===
                            "string"
                              ? job.location
                              : job.location
                                  ?.display_name ||
                                "India"}
                          </p>
                        )}

                      </div>

                      {jobId && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/companies/job/${encodeURIComponent(
                                String(jobId)
                              )}`,
                              {
                                state: {
                                  job,
                                  company,
                                },
                              }
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
                        >
                          View Job →
                        </button>
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <div className="bg-gray-50 rounded-xl p-8 text-center">

            <Building2
              size={45}
              className="mx-auto text-gray-400"
            />

            <p className="text-gray-500 mt-3">
              No job openings are currently
              available for this company.
            </p>

          </div>

        )}

      </div>

      {/* ==================================================
          BROWSE COMPANIES
      ================================================== */}

      <div className="mt-10 text-center">

        <button
          type="button"
          onClick={() =>
            navigate("/companies")
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold transition"
        >
          ← Browse All Companies
        </button>

      </div>

    </div>
  );
}

export default CompanyDetails;