import { useMemo } from "react";
import careerRoadmaps from "../../data/roadmaps";
import RoadmapProgress from "./RoadmapProgress";

function CareerRoadmapAI({ careerId = "software-engineer" }) {
  const roadmap = useMemo(() => {
    return careerRoadmaps[careerId] || [];
  }, [careerId]);

  return (
    <section className="bg-white rounded-3xl shadow-lg p-8">

      <h2 className="text-3xl font-bold mb-2">
        🚀 AI Career Roadmap
      </h2>

      <p className="text-gray-500 mb-8">
        Follow this roadmap step by step to become a successful{" "}
        <span className="font-semibold text-blue-600">
          {careerId.replace(/-/g, " ")}
        </span>.
      </p>

      {roadmap.length === 0 ? (
        <div className="text-center py-10">

          <h3 className="text-2xl font-semibold text-gray-700">
            Roadmap Coming Soon
          </h3>

          <p className="mt-3 text-gray-500">
            We are preparing a roadmap for this career.
          </p>

        </div>
      ) : (
        <>
          <div className="space-y-6">

            {roadmap.map((stage) => (

              <div
                key={stage.id}
                className="border rounded-2xl p-6 hover:shadow-lg transition"
              >

                <div className="flex justify-between items-center mb-5">

                  <h3 className="text-xl font-bold">
                    {stage.title}
                  </h3>

                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {stage.duration}
                  </span>

                </div>

                <div className="grid md:grid-cols-2 gap-3">

                  {stage.skills.map((skill) => (

                    <div
                      key={skill}
                      className="bg-slate-100 rounded-xl px-4 py-3 hover:bg-blue-50 transition"
                    >
                      ✅ {skill}
                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

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