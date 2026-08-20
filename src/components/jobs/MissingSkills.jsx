import {
  AlertCircle,
  CheckCircle2,
  Target,
} from "lucide-react";

import {
  calculateJobMatch,
} from "../../utils/jobMatcher";

function MissingSkills({
  jobs = [],
  student,
}) {
  if (
    !student ||
    !Array.isArray(jobs) ||
    jobs.length === 0
  ) {
    return null;
  }

  // ==================================================
  // COLLECT MISSING SKILLS
  // ==================================================

  const skillMap =
    new Map();

  jobs.forEach((job) => {
    const match =
      calculateJobMatch(
        job,
        student
      );

    if (!match) {
      return;
    }

    const missingSkills =
      Array.isArray(
        match.missingSkills
      )
        ? match.missingSkills
        : [];

    missingSkills.forEach(
      (skill) => {
        if (
          typeof skill !==
          "string"
        ) {
          return;
        }

        const normalized =
          skill
            .trim()
            .toLowerCase();

        if (!normalized) {
          return;
        }

        const existing =
          skillMap.get(
            normalized
          );

        if (existing) {
          existing.count += 1;
        } else {
          skillMap.set(
            normalized,
            {
              skill:
                skill.trim(),
              count: 1,
            }
          );
        }
      }
    );
  });

  const missingSkills =
    Array.from(
      skillMap.values()
    )
      .sort(
        (a, b) =>
          b.count - a.count
      )
      .slice(0, 10);

  // ==================================================
  // NO MISSING SKILLS
  // ==================================================

  if (
    missingSkills.length === 0
  ) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle2
              size={23}
            />
          </div>

          <div>

            <p className="text-sm text-gray-500">
              CareerOS Skill Analysis
            </p>

            <h2 className="text-xl font-bold text-gray-900">
              Your current skills are looking strong
            </h2>

          </div>

        </div>

        <p className="text-gray-500 mt-4">
          No significant missing skills were
          detected across the currently
          available jobs.
        </p>

      </div>
    );
  }

  // ==================================================
  // DISPLAY
  // ==================================================

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
          <Target size={23} />
        </div>

        <div>

          <p className="text-sm text-gray-500">
            CareerOS Skill Gap
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            Skills to improve for more jobs
          </h2>

        </div>

      </div>

      <p className="text-gray-500 mt-4 max-w-3xl">
        These skills appear frequently among
        the jobs currently available for your
        profile but are not currently detected
        in your matching profile.
      </p>

      {/* ==================================================
          SKILLS
      ================================================== */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

        {missingSkills.map(
          ({
            skill,
            count,
          }) => (
            <div
              key={skill}
              className="border border-orange-200 bg-orange-50 rounded-2xl p-4"
            >

              <div className="flex items-start gap-3">

                <AlertCircle
                  size={19}
                  className="text-orange-600 mt-0.5 shrink-0"
                />

                <div>

                  <p className="font-bold text-gray-900">
                    {skill}
                  </p>

                  <p className="text-xs text-orange-700 mt-1">
                    Appears in {count}{" "}
                    {count === 1
                      ? "job"
                      : "jobs"}
                  </p>

                </div>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default MissingSkills;