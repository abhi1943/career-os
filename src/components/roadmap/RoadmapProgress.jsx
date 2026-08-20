import {  useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  RotateCcw,
} from "lucide-react";

function RoadmapProgress({ careerId, roadmap }) {
  const storageKey = `roadmap-${careerId}`;

  const [completed, setCompleted] = useState(() => {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      "Failed to load roadmap progress:",
      error
    );

    return [];
  }
});
  /* ==================================================
     VALID COMPLETED STEPS
  ================================================== */

  const validStepIds = useMemo(() => {
    return new Set(
      roadmap.map((step) => step.id)
    );
  }, [roadmap]);

  /* ==================================================
     TOGGLE STEP
  ================================================== */

  const toggleStep = (id) => {
    let updated;

    if (completed.includes(id)) {
      updated = completed.filter(
        (item) => item !== id
      );
    } else {
      updated = [...completed, id];
    }

    setCompleted(updated);

    localStorage.setItem(
      storageKey,
      JSON.stringify(updated)
    );
  };

  /* ==================================================
     RESET
  ================================================== */

  const resetProgress = () => {
    const confirmed = window.confirm(
      "Reset your roadmap progress for this career?"
    );

    if (!confirmed) return;

    setCompleted([]);

    localStorage.removeItem(storageKey);
  };

  /* ==================================================
     PROGRESS
  ================================================== */

  const validCompletedCount =
    completed.filter((id) =>
      validStepIds.has(id)
    ).length;

  const totalSteps = roadmap.length;

  const progress = totalSteps
    ? Math.round(
        (validCompletedCount / totalSteps) * 100
      )
    : 0;

  /* ==================================================
     EMPTY STATE
  ================================================== */

  if (!roadmap.length) {
    return null;
  }

  /* ==================================================
     RENDER
  ================================================== */

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            📈 Roadmap Progress
          </h2>

          <p className="text-gray-500 mt-1">
            Track the major stages of your career journey.
          </p>

        </div>

        <div className="flex items-center gap-4">

          <span className="text-3xl font-bold text-blue-600">
            {progress}%
          </span>

          <button
            type="button"
            onClick={resetProgress}
            className="
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-xl
              bg-gray-100
              text-gray-700
              font-semibold
              hover:bg-gray-200
              transition
            "
          >
            <RotateCcw size={17} />

            Reset
          </button>

        </div>

      </div>

      {/* ==================================================
          PROGRESS BAR
      ================================================== */}

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

        <div
          className="
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            h-4
            rounded-full
            transition-all
            duration-700
          "
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      {/* ==================================================
          PROGRESS SUMMARY
      ================================================== */}

      <div className="flex flex-wrap gap-4 mt-5 text-sm">

        <span className="font-semibold text-green-600">
          ✓ {validCompletedCount} Completed
        </span>

        <span className="font-semibold text-gray-500">
          ○ {totalSteps - validCompletedCount} Remaining
        </span>

        <span className="font-semibold text-blue-600">
          {totalSteps} Total Stages
        </span>

      </div>

      {/* ==================================================
          ROADMAP STEPS
      ================================================== */}

      <div className="mt-8 space-y-4">

        {roadmap.map((step, index) => {

          const isCompleted =
            completed.includes(step.id);

          return (
            <label
              key={step.id}
              className={`
                flex
                items-center
                gap-4
                p-4
                rounded-2xl
                border
                cursor-pointer
                transition
                ${
                  isCompleted
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200"
                }
              `}
            >

              {/* ==================================================
                  CHECKBOX
              ================================================== */}

              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() =>
                  toggleStep(step.id)
                }
                className="sr-only"
              />

              {/* ==================================================
                  STATUS ICON
              ================================================== */}

              <div className="flex-shrink-0">

                {isCompleted ? (
                  <CheckCircle2
                    size={28}
                    className="text-green-600"
                  />
                ) : (
                  <Circle
                    size={28}
                    className="text-gray-400"
                  />
                )}

              </div>

              {/* ==================================================
                  NUMBER
              ================================================== */}

              <div
                className={`
                  w-9
                  h-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-sm
                  font-bold
                  flex-shrink-0
                  ${
                    isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
              >
                {index + 1}
              </div>

              {/* ==================================================
                  CONTENT
              ================================================== */}

              <div className="flex-1">

                <h3
                  className={`
                    font-semibold
                    ${
                      isCompleted
                        ? "text-green-700"
                        : "text-slate-800"
                    }
                  `}
                >
                  {step.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {step.duration}
                </p>

                {step.skills?.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    {step.skills.length} skills
                  </p>
                )}

              </div>

              {/* ==================================================
                  STATUS
              ================================================== */}

              <div
                className={`
                  hidden
                  sm:block
                  text-sm
                  font-semibold
                  ${
                    isCompleted
                      ? "text-green-600"
                      : "text-gray-400"
                  }
                `}
              >
                {isCompleted
                  ? "Completed"
                  : "Not Started"}
              </div>

            </label>
          );
        })}

      </div>

    </div>
  );
}

export default RoadmapProgress;