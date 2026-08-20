import { useMemo } from "react";
import { calculateCareerMatch } from "../../utils/aiCareerMatch";

function CareerMatchScore({ student, career }) {
  const result = useMemo(() => {
    if (!student || !career) {
      return {
        score: 0,
        matchedSkills: [],
      };
    }

    try {
      const matchResult = calculateCareerMatch(student, career);

      return {
        score: Math.min(
          100,
          Math.max(0, Number(matchResult?.score) || 0)
        ),
        matchedSkills: Array.isArray(matchResult?.matchedSkills)
          ? matchResult.matchedSkills
          : [],
      };
    } catch (error) {
      console.error("CareerOS AI Career Match Error:", error);

      return {
        score: 0,
        matchedSkills: [],
      };
    }
  }, [student, career]);

  if (!student || !career) {
    return null;
  }

const { score, matchedSkills } = result;

const { message, messageColor } =
  score >= 90
    ? {
        message: "Excellent Career Match",
        messageColor: "text-green-600",
      }
    : score >= 75
    ? {
        message: "Very Good Match",
        messageColor: "text-green-600",
      }
    : score >= 60
    ? {
        message: "Good Match",
        messageColor: "text-yellow-600",
      }
    : {
        message: "Needs Improvement",
        messageColor: "text-orange-600",
      };
  return (
    <section className="mt-20">
      {/* Section Header */}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          🤖 AI Career Match
        </h2>

        <p className="text-gray-500 mt-2">
          AI-powered analysis of how well this career matches your
          profile and skills.
        </p>
      </div>

      {/* Main Card */}

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">

        {/* Career + Score */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Career Match
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              {career.name}
            </h3>

            {career.category && (
              <p className="text-gray-500 mt-1">
                {career.category}
              </p>
            )}
          </div>

          {/* Score */}

          <div className="flex items-center gap-4">

            <div className="relative w-20 h-20">

              <div className="absolute inset-0 rounded-full border-8 border-gray-200" />

              <div
                className="absolute inset-0 rounded-full border-8 border-blue-600"
                style={{
                  clipPath: `inset(${100 - score}% 0 0 0)`,
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {score}%
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Progress Bar */}

        <div className="mt-8">

          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Career compatibility</span>
            <span>{score}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-700"
              style={{
                width: `${score}%`,
              }}
            />

          </div>

        </div>

        {/* Match Message */}

        <div className="mt-6">

          <p className={`text-xl font-bold ${messageColor}`}>
            {message}
          </p>

          <p className="text-gray-500 mt-1">
            Based on your current profile, interests and available
            skills.
          </p>

        </div>

        {/* Matching Skills */}

        <div className="mt-10">

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-xl font-bold text-slate-900">
              🎯 Matching Skills
            </h3>

            <span className="text-sm text-gray-500">
              {matchedSkills.length} matched
            </span>

          </div>

          {matchedSkills.length > 0 ? (

            <div className="flex flex-wrap gap-3">

              {matchedSkills.map((skill, index) => (

                <span
                  key={`${skill}-${index}`}
                  className="bg-green-100 text-green-700 border border-green-200 px-4 py-2 rounded-full font-medium"
                >
                  ✓ {skill}
                </span>

              ))}

            </div>

          ) : (

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">

              <p className="text-gray-500">
                No matching skills found yet.
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Continue building your skills and projects to
                improve your career match.
              </p>

            </div>

          )}

        </div>

      </div>
    </section>
  );
}

export default CareerMatchScore;