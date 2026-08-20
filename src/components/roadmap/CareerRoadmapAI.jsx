import { useMemo } from "react";
import careerRoadmaps from "../../data/roadmaps";
import RoadmapProgress from "./RoadmapProgress";

function CareerRoadmapAI({ careerId = "cse" }) {
  /* ==================================================
     GET ROADMAP
  ================================================== */

  const roadmap = useMemo(() => {
    if (!careerId) {
      return [];
    }

    return careerRoadmaps[careerId] || [];
  }, [careerId]);

  /* ==================================================
     DISPLAY CAREER NAME
  ================================================== */

  const careerNameMap = {
    cse: "Computer Science Engineering",
    aiml: "Artificial Intelligence & Machine Learning",
    datascience: "Data Science",
    cybersecurity: "Cyber Security",
    "frontend-developer": "Frontend Developer",
    "full-stack-developer": "Full Stack Developer",
  };

  const careerName =
    careerNameMap[careerId] ||
    careerId.replace(/-/g, " ");

  /* ==================================================
     RENDER
  ================================================== */

  return (
    <section className="bg-white rounded-3xl shadow-lg p-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h2 className="text-3xl font-bold text-slate-800">
              🚀 AI Career Roadmap
            </h2>

            <p className="text-gray-500 mt-2">
              Follow this roadmap step by step to become a successful{" "}
              <span className="font-semibold text-blue-600">
                {careerName}
              </span>.
            </p>

          </div>

          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
            {roadmap.length} Stages
          </div>

        </div>

      </div>

      {/* ==================================================
          ROADMAP NOT FOUND
      ================================================== */}

      {roadmap.length === 0 ? (

        <div className="text-center py-12">

          <div className="text-5xl mb-5">
            🗺️
          </div>

          <h3 className="text-2xl font-semibold text-gray-700">
            Roadmap Coming Soon
          </h3>

          <p className="mt-3 text-gray-500">
            We are preparing a roadmap for this career.
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Career ID: {careerId}
          </p>

        </div>

      ) : (

        <>

          {/* ==================================================
              ROADMAP STAGES
          ================================================== */}

          <div className="space-y-6">

            {roadmap.map((stage, index) => (

              <div
                key={stage.id}
                className="
                  relative
                  border
                  border-gray-200
                  rounded-2xl
                  p-6
                  bg-white
                  hover:shadow-lg
                  transition
                "
              >

                {/* Stage number */}

                <div className="flex items-start gap-5">

                  <div
                    className="
                      w-12
                      h-12
                      rounded-full
                      bg-blue-600
                      text-white
                      flex
                      items-center
                      justify-center
                      font-bold
                      flex-shrink-0
                    "
                  >
                    {index + 1}
                  </div>

                  {/* Stage content */}

                  <div className="flex-1">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                      <h3 className="text-xl font-bold text-slate-800">
                        {stage.title}
                      </h3>

                      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold w-fit">
                        {stage.duration}
                      </span>

                    </div>

                    {/* Skills */}

                    {Array.isArray(stage.skills) &&
                      stage.skills.length > 0 && (

                        <div className="grid md:grid-cols-2 gap-3 mt-5">

                          {stage.skills.map((skill) => (

                            <div
                              key={skill}
                              className="
                                bg-slate-100
                                rounded-xl
                                px-4
                                py-3
                                text-gray-700
                                hover:bg-blue-50
                                hover:text-blue-700
                                transition
                              "
                            >
                              ✅ {skill}
                            </div>

                          ))}

                        </div>

                      )}

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* ==================================================
              ROADMAP PROGRESS
          ================================================== */}

          <div className="mt-10">

            <RoadmapProgress
              careerId={careerId}
              roadmap={roadmap}
            />

          </div>

        </>

      )}

    </section>
  );
}

export default CareerRoadmapAI;