import { useContext } from "react";
import { GoalContext } from "../../../context/GoalContext";
import { Target } from "lucide-react";

function CareerGoal() {
  const { goal } = useContext(GoalContext);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 h-[420px]">

      <div className="flex items-center gap-3 mb-6">

        <Target className="text-red-500" />

        <h2 className="text-2xl font-bold">
          Career Goal
        </h2>

      </div>

      {!goal ? (

        <div className="text-gray-500">
          No goal selected yet.
        </div>

      ) : (

        <>

          <h3 className="text-3xl font-bold text-blue-700">
            {goal.name}
          </h3>

          <p className="mt-4 text-gray-600">
            Current Stage
          </p>

          <h4 className="text-xl font-semibold">
            {goal.eligibility}
          </h4>

          <div className="mt-8">

            <div className="bg-gray-200 rounded-full h-4">

              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: "60%" }}
              />

            </div>

            <p className="mt-3 font-semibold">
              60% Progress
            </p>

          </div>

        </>

      )}

    </div>
  );
}

export default CareerGoal;