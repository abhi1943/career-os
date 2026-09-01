import { useContext } from "react";
import { GoalContext } from "../../../context/GoalContext";
import { Target } from "lucide-react";

function CareerGoal({
    progress = 0,
}) {
    const normalizedProgress =
        Math.min(
            Math.max(
                Number(progress) || 0,
                0
            ),
            100
        );
  const { goal } = useContext(GoalContext);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 h-full min-h-0 flex flex-col">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center gap-3 mb-6">

        <Target className="text-red-500" />

        <h2 className="text-2xl font-bold">
          Career Goal
        </h2>

      </div>

      {/* ==================================================
          NO GOAL
      ================================================== */}

      {!goal ? (

        <div className="flex flex-col items-center justify-center text-center flex-1">

          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">

            <Target
              className="text-red-400"
              size={30}
            />

          </div>

          <h3 className="mt-5 text-xl font-bold text-gray-800">
            No Career Goal Yet
          </h3>

          <p className="mt-2 text-gray-500 max-w-sm">
            Select a career goal to start tracking
            your progress toward your dream career.
          </p>

        </div>

      ) : (

        /* ==================================================
           GOAL EXISTS
        ================================================== */

        <>

          <h3 className="text-3xl font-bold text-blue-700">
            {goal.name}
          </h3>

          <p className="mt-4 text-gray-600">
            Current Stage
          </p>

          <h4 className="text-xl font-semibold">
            {goal.eligibility || "Getting Started"}
          </h4>

          {/* ==================================================
              PROGRESS
          ================================================== */}

          <div className="mt-8">

            <div className="flex justify-between mb-2">

              <span className="text-gray-600">
                Goal Progress
              </span>

              <span className="font-semibold">
                {normalizedProgress}%
              </span>

            </div>

            <div className="bg-gray-200 rounded-full h-4">

              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${normalizedProgress}%`,
                }}
              />

            </div>

            <p className="mt-3 font-semibold text-gray-700">
              {progress}% Progress
            </p>

          </div>

        </>

      )}

    </div>
  );
}

export default CareerGoal;