import { Link } from "react-router-dom";
import { recommendCareers } from "../../utils/recommendCareers";

function AIRecommendations({ student }) {
  if (!student) return null;

  const recommendations = recommendCareers(student);

  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    return (
      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-8">
          🤖 AI Recommended Careers
        </h2>

        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">
            🔍
          </div>

          <h3 className="text-2xl font-bold">
            No career recommendations yet
          </h3>

          <p className="text-gray-500 mt-3">
            Complete your career profile with your education,
            interests, dream career and skills to get
            personalized recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20">

      {/* --------------------------------------------------
          HEADER
      -------------------------------------------------- */}

      <div className="mb-8">

        <h2 className="text-3xl font-bold">
          🤖 AI Recommended Careers
        </h2>

        <p className="text-gray-500 mt-3 max-w-3xl">
          These careers are recommended based on your
          education, interests, dream career and skills.
        </p>

      </div>

      {/* --------------------------------------------------
          RECOMMENDATION CARDS
      -------------------------------------------------- */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {recommendations.map((career, index) => {

          if (!career || !career.id) {
            return null;
          }

          const score = Math.min(
            100,
            Math.max(
              0,
              Number(career.score) || 0
            )
          );

          const matchedSkills =
            Array.isArray(career.matchedSkills)
              ? career.matchedSkills
              : [];

          return (

            <Link
              key={`${career.id}-${index}`}
              to={`/career/${career.id}`}
              className="group bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >

              {/* ------------------------------------------------
                  ICON + SCORE
              ------------------------------------------------ */}

              <div className="flex justify-between items-center">

                <div className="text-5xl">
                  {career.icon || "💼"}
                </div>

                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                  {score}% Match
                </span>

              </div>

              {/* ------------------------------------------------
                  CAREER NAME
              ------------------------------------------------ */}

              <h3 className="text-2xl font-bold mt-5 group-hover:text-blue-600 transition">
                {career.name || "Career"}
              </h3>

              {/* ------------------------------------------------
                  CATEGORY
              ------------------------------------------------ */}

              {career.category && (
                <p className="text-gray-500 mt-2">
                  {career.category}
                </p>
              )}

              {/* ------------------------------------------------
                  DESCRIPTION
              ------------------------------------------------ */}

              <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                {career.description ||
                  career.overview ||
                  "Explore this career and discover the required skills, learning path and opportunities."}
              </p>

              {/* ------------------------------------------------
                  MATCH PROGRESS
              ------------------------------------------------ */}

              <div className="mt-6">

                <div className="flex justify-between text-sm mb-2">

                  <span className="text-gray-500">
                    Career Match
                  </span>

                  <span className="font-semibold text-blue-600">
                    {score}%
                  </span>

                </div>

                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">

                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-700"
                    style={{
                      width: `${score}%`,
                    }}
                  />

                </div>

              </div>

              {/* ------------------------------------------------
                  MATCHED SKILLS
              ------------------------------------------------ */}

              {matchedSkills.length > 0 && (

                <div className="mt-5">

                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    🎯 Matching Skills
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {matchedSkills
                      .slice(0, 4)
                      .map((skill) => (

                        <span
                          key={skill}
                          className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>

                      ))}

                  </div>

                </div>

              )}

              {/* ------------------------------------------------
                  VIEW CAREER
              ------------------------------------------------ */}

              <div className="mt-6 pt-5 border-t">

                <span className="text-blue-600 font-semibold group-hover:text-blue-700">
                  View Career Details →
                </span>

              </div>

            </Link>

          );
        })}

      </div>

    </div>
  );
}

export default AIRecommendations;