import { CheckCircle, Circle } from "lucide-react";

function RoadmapTimeline({
  roadmap = [],
  completedSkills = [],
  onToggleSkill,
}) {
  if (!roadmap.length) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
        <p className="text-gray-500">
          No roadmap available for this career.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-8">
        Learning Timeline
      </h2>

      <div className="space-y-8">

        {roadmap.map((step, index) => (

          <div
            key={`${step.month}-${step.title}-${index}`}
            className="relative flex gap-5"
          >

            {/* Timeline indicator */}

            <div className="flex flex-col items-center">

              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">

                <span className="text-blue-600 font-bold text-sm">
                  {index + 1}
                </span>

              </div>

              {index !== roadmap.length - 1 && (
                <div className="w-0.5 h-full bg-blue-100 mt-2" />
              )}

            </div>

            {/* Content */}

            <div className="pb-8 flex-1">

              <p className="text-sm font-semibold text-blue-600">
                {step.month}
              </p>

              <h3 className="text-xl font-bold mt-1 text-gray-800">
                {step.title}
              </h3>

              {/* Skills */}

              {Array.isArray(step.skills) &&
                step.skills.length > 0 && (

                  <div className="mt-5 space-y-3">

                    {step.skills.map((skill) => {

                      const completed =
                        completedSkills.includes(skill);

                      return (
                        <button
                          type="button"
                          key={`${step.month}-${step.title}-${skill}`}
                          onClick={() =>
                            onToggleSkill &&
                            onToggleSkill(skill)
                          }
                          className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border transition ${
                            completed
                              ? "bg-green-50 border-green-200"
                              : "bg-slate-50 border-slate-200 hover:bg-blue-50"
                          }`}
                        >

                          {completed ? (
                            <CheckCircle
                              size={22}
                              className="text-green-600 shrink-0"
                            />
                          ) : (
                            <Circle
                              size={22}
                              className="text-blue-500 shrink-0"
                            />
                          )}

                          <span
                            className={
                              completed
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            }
                          >
                            {skill}
                          </span>

                        </button>
                      );
                    })}

                  </div>
                )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RoadmapTimeline;