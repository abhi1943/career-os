import {
  CheckCircle2,
  Circle,
  Clock3,
  RotateCcw,
} from "lucide-react";

import { useMemo, useState } from "react";

import { generateLearningPath } from "../../utils/learningPathEngine";

import {
  getCareerLearningProgress,
  updateSkillStatus,
  resetCareerLearningProgress,
  calculateLearningProgress,
} from "../../utils/learningProgressEngine";

function CareerLearningPath({
  student,
  career,
  onProgressChange,
}) {

  /* ==================================================
     CREATE STABLE SKILL ID
  ================================================== */

  function createSkillId(skill) {
    return String(skill)
      .toLowerCase()
      .trim()
      .replace(/[.&/]/g, " ")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  /* ==================================================
     LOAD ROADMAP
  ================================================== */

   /* ==================================================
     CREATE ROADMAP
  ================================================== */

  const initialRoadmap = useMemo(() => {
    if (!student || !career) {
      return [];
    }

    const generatedPath = generateLearningPath(
      student,
      career
    );

    const savedProgress =
      getCareerLearningProgress(career.id) || {};

    return generatedPath.map((item, index) => {
      const skillId =
        item.id || createSkillId(item.skill);

      return {
        ...item,

        id: skillId,

        week:
          item.week ||
          `Week ${index + 1}`,

        status:
          savedProgress[skillId] ||
          "not-started",
      };
    });
  }, [student, career]);

  const [roadmap, setRoadmap] =
    useState(initialRoadmap);

  /* ==================================================
     SAFETY
  ================================================== */

  if (!student || !career) {
    return null;
  }

  /* ==================================================
     UPDATE STATUS
  ================================================== */

  function handleStatusChange(item) {
    let nextStatus;

    if (item.status === "not-started") {
      nextStatus = "in-progress";
    } else if (
      item.status === "in-progress"
    ) {
      nextStatus = "completed";
    } else {
      nextStatus = "not-started";
    }

    updateSkillStatus(
      career.id,
      item.id,
      nextStatus
    );

    const updatedRoadmap =
      roadmap.map((roadmapItem) =>
        roadmapItem.id === item.id
          ? {
              ...roadmapItem,
              status: nextStatus,
            }
          : roadmapItem
      );

    setRoadmap(updatedRoadmap);

    const progress =
      calculateLearningProgress(
        updatedRoadmap
      );

    if (onProgressChange) {
      onProgressChange(progress);
    }
  }

  /* ==================================================
     RESET
  ================================================== */

  function handleReset() {
    const confirmed =
      window.confirm(
        "Reset your learning progress for this career?"
      );

    if (!confirmed) {
      return;
    }

    resetCareerLearningProgress(
      career.id
    );

    const resetRoadmap =
      roadmap.map((item) => ({
        ...item,
        status: "not-started",
      }));

    setRoadmap(resetRoadmap);

    if (onProgressChange) {
      onProgressChange(0);
    }
  }

  /* ==================================================
     PROGRESS
  ================================================== */

  const progress =
    calculateLearningProgress(
      roadmap
    );

  const completedCount =
    roadmap.filter(
      (item) =>
        item.status === "completed"
    ).length;

  const inProgressCount =
    roadmap.filter(
      (item) =>
        item.status === "in-progress"
    ).length;

  const notStartedCount =
    roadmap.filter(
      (item) =>
        item.status === "not-started"
    ).length;

  /* ==================================================
     EMPTY STATE
  ================================================== */

  if (roadmap.length === 0) {
    return (
      <div className="mt-20">

        <h2 className="text-3xl font-bold mb-8">
          🧠 Personalized AI Learning Path
        </h2>

        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

          <div className="text-6xl mb-5">
            🎉
          </div>

          <h3 className="text-2xl font-bold text-green-600">
            You are already prepared!
          </h3>

          <p className="mt-3 text-gray-600">
            You already have all the required
            skills for this career.
          </p>

        </div>

      </div>
    );
  }

  /* ==================================================
     RENDER
  ================================================== */

  return (
    <div className="mt-20">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h2 className="text-3xl font-bold">
            🧠 Personalized AI Learning Path
          </h2>

          <p className="text-gray-500 mt-2">
            Build the skills required for{" "}
            <span className="font-semibold text-gray-700">
              {career.name}
            </span>
          </p>

        </div>

        <button
          onClick={handleReset}
          className="
            flex
            items-center
            justify-center
            gap-2
            px-5
            py-3
            rounded-xl
            bg-gray-100
            hover:bg-gray-200
            transition
            font-semibold
            text-gray-700
          "
        >
          <RotateCcw size={18} />

          Reset Progress
        </button>

      </div>

      {/* ==================================================
          PROGRESS CARD
      ================================================== */}

      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h3 className="text-xl font-bold">
              Learning Progress
            </h3>

            <p className="text-gray-500 mt-1">
              {completedCount} of{" "}
              {roadmap.length} skills completed
            </p>

          </div>

          <div className="text-4xl font-bold text-blue-600">
            {progress}%
          </div>

        </div>

        {/* Progress bar */}

        <div className="w-full bg-gray-200 rounded-full h-5 mt-6 overflow-hidden">

          <div
            className="
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              h-5
              rounded-full
              transition-all
              duration-700
            "
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        {/* Statistics */}

        <div className="flex flex-wrap gap-5 mt-5 text-sm">

          <span className="text-green-600 font-semibold">
            ✓ {completedCount} Completed
          </span>

          <span className="text-blue-600 font-semibold">
            ⏳ {inProgressCount} In Progress
          </span>

          <span className="text-gray-500 font-semibold">
            ○ {notStartedCount} Not Started
          </span>

        </div>

      </div>

      {/* ==================================================
          ROADMAP
      ================================================== */}

      <div className="bg-white rounded-3xl shadow-lg p-8">

        <div className="space-y-6">

          {roadmap.map(
            (item, index) => {

              const isCompleted =
                item.status === "completed";

              const isInProgress =
                item.status === "in-progress";

              return (
                <div
                  key={item.id}
                  className="
                    flex
                    items-center
                    gap-5
                  "
                >

                  {/* ==================================================
                      NUMBER / STATUS
                  ================================================== */}

                  <div
                    className={`
                      w-12
                      h-12
                      rounded-full
                      flex
                      items-center
                      justify-center
                      font-bold
                      flex-shrink-0
                      ${
                        isCompleted
                          ? "bg-green-600 text-white"
                          : isInProgress
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                      }
                    `}
                  >

                    {isCompleted ? (
                      <CheckCircle2
                        size={24}
                      />
                    ) : isInProgress ? (
                      <Clock3
                        size={24}
                      />
                    ) : (
                      index + 1
                    )}

                  </div>

                  {/* ==================================================
                      SKILL CARD
                  ================================================== */}

                  <div
                    className={`
                      flex-1
                      rounded-2xl
                      p-5
                      border
                      transition
                      ${
                        isCompleted
                          ? "bg-green-50 border-green-200"
                          : isInProgress
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                      }
                    `}
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>

                        <p
                          className={`
                            font-semibold
                            ${
                              isCompleted
                                ? "text-green-600"
                                : isInProgress
                                  ? "text-blue-600"
                                  : "text-gray-500"
                            }
                          `}
                        >
                          {item.week}
                        </p>

                        <h3 className="text-xl font-bold mt-1">
                          Learn{" "}
                          {item.skill}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                          Required skill for{" "}
                          {career.name}
                        </p>

                      </div>

                      {/* ==================================================
                          STATUS BUTTON
                      ================================================== */}

                      <button
                        onClick={() =>
                          handleStatusChange(
                            item
                          )
                        }
                        className={`
                          px-5
                          py-3
                          rounded-xl
                          font-semibold
                          transition
                          flex
                          items-center
                          justify-center
                          gap-2
                          ${
                            isCompleted
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : isInProgress
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }
                        `}
                      >

                        {isCompleted ? (
                          <>
                            <CheckCircle2
                              size={18}
                            />
                            Completed
                          </>
                        ) : isInProgress ? (
                          <>
                            <Clock3
                              size={18}
                            />
                            In Progress
                          </>
                        ) : (
                          <>
                            <Circle
                              size={18}
                            />
                            Start Learning
                          </>
                        )}

                      </button>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}

export default CareerLearningPath;