import { useContext } from "react";
import {
  GraduationCap,
  ArrowRight,
  // TrendingUp,
} from "lucide-react";

import { CareerContext } from "../../../context/CareerContext";
import { getRecommendations } from "../../../utils/recommendationEngine";

function RecommendedCareers() {
  const { student } = useContext(CareerContext);

  const recommendations = getRecommendations(student);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">

      <div className="flex items-center gap-3 mb-6">
        <GraduationCap className="text-purple-600" />

        <h2 className="text-2xl font-bold">
          Recommended Careers
        </h2>
      </div>

      {recommendations.length === 0 ? (

        <div className="text-center py-10">

          <GraduationCap
            className="mx-auto text-gray-300"
            size={55}
          />

          <p className="mt-5 text-gray-500">
            Fill your student profile to get
            personalized career recommendations.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {recommendations.map((career) => (

            <div
              key={career.id}
              className="border rounded-2xl p-5 hover:border-blue-500 hover:shadow-md transition"
            >

              <div className="flex justify-between items-center">

                <h3 className="font-bold text-lg">
                  {career.name}
                </h3>

                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  Recommended
                </span>

              </div>

              <p className="text-gray-600 mt-3">

                {career.description}

              </p>

              <div className="mt-4 flex justify-between text-sm">

                <span>

                  Duration

                </span>

                <span className="font-semibold">

                  {career.duration}

                </span>

              </div>

              <div className="mt-3 flex justify-between text-sm">

                <span>

                  Eligibility

                </span>

                <span className="font-semibold">

                  {career.eligibility}

                </span>

              </div>

              <button className="mt-5 flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800">

                View Roadmap

                <ArrowRight size={18} />

              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default RecommendedCareers;