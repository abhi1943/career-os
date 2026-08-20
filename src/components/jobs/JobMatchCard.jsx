import {
  Target,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";

import {
  calculateJobMatch,
} from "../../utils/jobMatcher";

import JobMatchBadge from "./JobMatchBadge";

function JobMatchCard({
  job,
  student,
}) {
  if (!job || !student) {
    return null;
  }

  const match =
    calculateJobMatch(
      job,
      student
    );

  if (!match) {
    return null;
  }

  const {
    score = 0,
    matchedSkills = [],
    missingSkills = [],
  } = match;

  const companyName =
    typeof job.company === "string"
      ? job.company
      : job.company?.display_name ||
        "Company";

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target size={25} />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                CareerOS Job Match
              </p>

              <h2 className="text-2xl font-bold text-gray-900">
                {job.title ||
                  "Job Opportunity"}
              </h2>

            </div>

          </div>

          <p className="text-blue-600 font-semibold mt-3">
            {companyName}
          </p>

        </div>

        <JobMatchBadge
          match={match}
        />

      </div>

      {/* ==================================================
          MATCH SUMMARY
      ================================================== */}

      <div className="grid md:grid-cols-3 gap-4 mt-6">

        <div className="bg-gray-50 rounded-2xl p-4">

          <p className="text-sm text-gray-500">
            Match Score
          </p>

          <p className="text-3xl font-extrabold text-gray-900 mt-1">
            {score}%
          </p>

        </div>

        <div className="bg-green-50 rounded-2xl p-4">

          <p className="text-sm text-green-700">
            Matching Skills
          </p>

          <p className="text-3xl font-extrabold text-green-700 mt-1">
            {matchedSkills.length}
          </p>

        </div>

        <div className="bg-orange-50 rounded-2xl p-4">

          <p className="text-sm text-orange-700">
            Skills to Improve
          </p>

          <p className="text-3xl font-extrabold text-orange-700 mt-1">
            {missingSkills.length}
          </p>

        </div>

      </div>

      {/* ==================================================
          SKILL DETAILS
      ================================================== */}

      <div className="grid md:grid-cols-2 gap-5 mt-6">

        {/* Matching */}

        <div className="border border-green-200 rounded-2xl p-5">

          <div className="flex items-center gap-2 text-green-700 font-bold">

            <CheckCircle2
              size={20}
            />

            <span>
              Skills You Match
            </span>

          </div>

          {matchedSkills.length > 0 ? (

            <div className="flex flex-wrap gap-2 mt-4">

              {matchedSkills
                .map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  )
                )}

            </div>

          ) : (

            <p className="text-gray-500 text-sm mt-4">
              No matching skills detected yet.
            </p>

          )}

        </div>

        {/* Missing */}

        <div className="border border-orange-200 rounded-2xl p-5">

          <div className="flex items-center gap-2 text-orange-700 font-bold">

            <AlertCircle
              size={20}
            />

            <span>
              Skills to Improve
            </span>

          </div>

          {missingSkills.length > 0 ? (

            <div className="flex flex-wrap gap-2 mt-4">

              {missingSkills
                .map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  )
                )}

            </div>

          ) : (

            <p className="text-green-600 text-sm mt-4 font-medium">
              Excellent! No major missing skills detected.
            </p>

          )}

        </div>

      </div>

      {/* ==================================================
          PROFILE CONNECTION
      ================================================== */}

      <div className="mt-6 bg-blue-50 rounded-2xl p-5">

        <div className="flex items-start gap-3">

          <Briefcase
            size={21}
            className="text-blue-600 mt-0.5"
          />

          <div>

            <h3 className="font-bold text-gray-900">
              Why this job matches you
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              CareerOS compares this job with
              your career profile, skills,
              education and career goal to
              estimate how suitable the
              opportunity is for you.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default JobMatchCard;