import { calculateCareerMatch } from "../../utils/aiCareerMatch";

function CareerMatchScore({ student, career }) {
  if (!student || !career) return null;

  const result = calculateCareerMatch(student, career);

  const score = result.score;
  const matchedSkills = result.matchedSkills;

  let message = "";

  if (score >= 90) {
    message = "Excellent Career Match";
  } else if (score >= 75) {
    message = "Very Good Match";
  } else if (score >= 60) {
    message = "Good Match";
  } else {
    message = "Needs Improvement";
  }

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold mb-8">
        🤖 AI Career Match
      </h2>

      <div className="bg-white rounded-3xl shadow-lg p-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">
            {career.name}
          </h3>

          <span className="text-4xl font-bold text-blue-600">
            {score}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-5 mt-8">
          <div
            className="bg-blue-600 h-5 rounded-full transition-all duration-700"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Match Message */}
        <p className="mt-6 text-xl font-semibold text-green-600">
          {message}
        </p>

        {/* Matching Skills */}
        <div className="mt-8">

          <h3 className="text-xl font-bold mb-4">
            🎯 Matching Skills
          </h3>

          <div className="flex flex-wrap gap-3">

            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-500">
                No matching skills found yet.
              </span>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default CareerMatchScore;