import { useEffect, useMemo, useState, useContext } from "react";
import { CareerContext } from "../../context/CareerContext";

import { generateRoadmap } from "../../utils/roadmapGenerator";

import RoadmapTimeline from "../../components/careerRoadmap/RoadmapTimeline";
import RoadmapProgress from "../../components/careerRoadmap/RoadmapProgress";
import RoadmapSkills from "../../components/careerRoadmap/RoadmapSkills";

function CareerRoadmap() {
  const { student } = useContext(CareerContext);

  const careers = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Software Engineer",
    "AI Engineer",
    "Data Scientist",
  ];

  const initialCareer =
    careers.includes(student?.dreamCareer)
      ? student.dreamCareer
      : careers.includes(student?.targetRole)
        ? student.targetRole
        : "Frontend Developer";

  const [selectedCareer, setSelectedCareer] =
    useState(initialCareer);

  const [completedSkills, setCompletedSkills] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "careeros_roadmap_progress"
      );

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const roadmap = useMemo(() => {
    return generateRoadmap(selectedCareer);
  }, [selectedCareer]);

  useEffect(() => {
    localStorage.setItem(
      "careeros_roadmap_progress",
      JSON.stringify(completedSkills)
    );
  }, [completedSkills]);

  function toggleSkill(skill) {
    setCompletedSkills((previous) => {
      if (previous.includes(skill)) {
        return previous.filter(
          (item) => item !== skill
        );
      }

      return [...previous, skill];
    });
  }

  function handleCareerChange(career) {
    setSelectedCareer(career);
    setCompletedSkills([]);
  }

  function resetProgress() {
    const confirmed = window.confirm(
      "Are you sure you want to reset your roadmap progress?"
    );

    if (!confirmed) return;

    setCompletedSkills([]);
  }

  return (
    <section className="min-h-screen bg-slate-100 py-12">

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="text-center mb-10">

          <p className="text-blue-600 font-semibold">
            CAREEROS LEARNING PLAN
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Career Roadmap
          </h1>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Follow a structured learning path, complete important
            skills, and track your progress toward your career goal.
          </p>

        </div>

        {/* Career Selector */}

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-gray-500">
                Choose your career
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {selectedCareer}
              </h2>

            </div>

            <select
              value={selectedCareer}
              onChange={(e) =>
                handleCareerChange(e.target.value)
              }
              className="border rounded-xl px-4 py-3 w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-500"
            >

              {careers.map((career) => (
                <option
                  key={career}
                  value={career}
                >
                  {career}
                </option>
              ))}

            </select>

          </div>

        </div>

        {/* Progress */}

        <div className="mb-8">

          <RoadmapProgress
            roadmap={roadmap}
            completedSkills={completedSkills}
          />

        </div>

        {/* Skills */}

        <div className="mb-8">

          <RoadmapSkills
            roadmap={roadmap}
            completedSkills={completedSkills}
          />

        </div>

        {/* Timeline */}

        <div className="mb-8">

          <RoadmapTimeline
            roadmap={roadmap}
            completedSkills={completedSkills}
            onToggleSkill={toggleSkill}
          />

        </div>

        {/* Reset */}

        <div className="flex justify-center">

          <button
            type="button"
            onClick={resetProgress}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition"
          >
            Reset Roadmap Progress
          </button>

        </div>

      </div>

    </section>
  );
}

export default CareerRoadmap;