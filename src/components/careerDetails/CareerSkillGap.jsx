import { analyzeSkillGap } from "../../utils/skillGapEngine";

function CareerSkillGap({ student, career }) {
  if (!student || !career) return null;

  const result = analyzeSkillGap(student, career);

  if (!result) return null;

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        🧠 AI Skill Gap Analysis
      </h2>

      <div className="bg-white rounded-3xl shadow-lg p-8">

        {/* Progress */}

        <div className="flex justify-between items-center mb-4">

          <h3 className="text-2xl font-bold">
            Career Readiness
          </h3>

          <span className="text-3xl font-bold text-blue-600">
            {result.percentage}%
          </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-5">

          <div
            className="bg-green-600 h-5 rounded-full transition-all duration-700"
            style={{
              width: `${result.percentage}%`,
            }}
          />

        </div>

        <p className="mt-4 font-semibold text-green-600">
          {result.level}
        </p>

        {/* Skills */}

        <div className="grid md:grid-cols-2 gap-10 mt-10">

          <div>

            <h4 className="text-xl font-bold text-green-600 mb-4">
              ✅ Skills You Already Have
            </h4>

            <div className="space-y-3">

              {result.matched.length ? (
                result.matched.map((skill) => (
                  <div
                    key={skill}
                    className="bg-green-100 text-green-700 px-4 py-3 rounded-xl"
                  >
                    {skill}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No matching skills yet.
                </p>
              )}

            </div>

          </div>

          <div>

            <h4 className="text-xl font-bold text-red-600 mb-4">
              ❌ Skills To Learn
            </h4>

            <div className="space-y-3">

              {result.missing.map((skill) => (
                <div
                  key={skill}
                  className="bg-red-100 text-red-700 px-4 py-3 rounded-xl"
                >
                  {skill}
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CareerSkillGap;