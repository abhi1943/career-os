import { Link } from "react-router-dom";
import { recommendCareers } from "../../utils/recommendCareers";

function AIRecommendations({ student }) {
  if (!student) return null;

  const recommendations = recommendCareers(student);

  if (!recommendations.length) return null;

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        🤖 AI Recommended Careers
      </h2>

      <p className="text-gray-500 mb-8">
        These careers are recommended based on your
        education, interests, dream career and skills.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {recommendations.map((career) => (

          <Link
            key={career.id}
            to={`/career/${career.id}`}
            className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
          >

            <div className="flex justify-between items-center">

              <div className="text-5xl">
                {career.icon}
              </div>

              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {career.score}%
              </span>

            </div>

            <h3 className="text-2xl font-bold mt-5">
              {career.name}
            </h3>

            <p className="text-gray-500 mt-2">
              {career.category}
            </p>

            <p className="mt-4 text-sm text-gray-600 line-clamp-3">
              {career.description}
            </p>

            <div className="bg-gray-200 rounded-full h-3 mt-6">

              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${career.score}%`,
                }}
              />

            </div>

            <div className="mt-5 flex flex-wrap gap-2">

              {career.matchedSkills?.slice(0, 4).map((skill) => (

                <span
                  key={skill}
                  className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full"
                >
                  {skill}
                </span>

              ))}

            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}

export default AIRecommendations;