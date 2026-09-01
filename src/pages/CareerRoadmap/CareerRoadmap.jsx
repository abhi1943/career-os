
import {
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";

import { CareerContext } from "../../context/CareerContext";
import { useAuth } from "../../context/AuthContext";

import { generateRoadmap } from "../../utils/roadmapGenerator";

import RoadmapTimeline from "../../components/careerRoadmap/RoadmapTimeline";
import RoadmapProgress from "../../components/careerRoadmap/RoadmapProgress";
import RoadmapSkills from "../../components/careerRoadmap/RoadmapSkills";


// ======================================================
// CAREERS
// ======================================================

const careers = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "AI Engineer",
  "Data Scientist",
];


// ======================================================
// STORAGE
// ======================================================

function getStorageKey(uid) {
  return `careerOS_roadmap_progress_${uid}`;
}


// ======================================================
// LOAD USER ROADMAP
// ======================================================

function loadRoadmapProgress(uid) {
  if (!uid) {
    return {};
  }

  try {
    const stored =
      localStorage.getItem(
        getStorageKey(uid)
      );

    if (!stored) {
      return {};
    }

    const parsed =
      JSON.parse(stored);

    return (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    )
      ? parsed
      : {};

  } catch (error) {
    console.error(
      "CareerOS Roadmap load error:",
      error
    );

    return {};
  }
}


// ======================================================
// CAREER ROADMAP
// ======================================================

function CareerRoadmap() {

  const { student } =
    useContext(CareerContext);

  const { user } =
    useAuth();

  const uid =
    user?.uid || null;


  // ====================================================
  // INITIAL CAREER
  // ====================================================

  const initialCareer =
    careers.includes(
      student?.dreamCareer
    )
      ? student.dreamCareer
      : careers.includes(
          student?.targetRole
        )
        ? student.targetRole
        : "Frontend Developer";


  const [
    selectedCareer,
    setSelectedCareer,
  ] = useState(initialCareer);


  // ====================================================
  // ROADMAP PROGRESS BY USER
  //
  // The state stores progress separately for each UID.
  //
  // {
  //   "uid-1": {
  //     "Frontend Developer": ["HTML", "CSS"]
  //   },
  //   "uid-2": {
  //     "Backend Developer": ["Java"]
  //   }
  // }
  //
  // This avoids calling setState() inside an effect.
  // ====================================================

  const [
    progressByUser,
    setProgressByUser,
  ] = useState(() => {

    if (!uid) {
      return {};
    }

    return {
      [uid]: loadRoadmapProgress(uid),
    };
  });


  // ====================================================
  // CURRENT USER PROGRESS
  // ====================================================

 const roadmapProgress = useMemo(() => {
  if (!uid) {
    return {};
  }

  return (
    progressByUser[uid] ??
    loadRoadmapProgress(uid)
  );
}, [uid, progressByUser]);


  // ====================================================
  // CURRENT CAREER COMPLETED SKILLS
  // ====================================================

  const completedSkills =
    roadmapProgress[
      selectedCareer
    ] || [];


  // ====================================================
  // SAVE CURRENT USER PROGRESS
  // ====================================================

  useEffect(() => {

    if (!uid) {
      return;
    }

    try {

      localStorage.setItem(
        getStorageKey(uid),
        JSON.stringify(
          roadmapProgress
        )
      );

    } catch (error) {

      console.error(
        "CareerOS Roadmap save error:",
        error
      );

    }

  }, [
    uid,
    roadmapProgress,
  ]);


  // ====================================================
  // GENERATE ROADMAP
  // ====================================================

  const roadmap =
    useMemo(() => {

      return generateRoadmap(
        selectedCareer
      );

    }, [selectedCareer]);


  // ====================================================
  // TOGGLE SKILL
  // ====================================================

  function toggleSkill(skill) {

    if (!uid) {
      return;
    }

    setProgressByUser(
      (previous) => {

        const currentUserProgress =
          previous[uid] ??
          loadRoadmapProgress(uid);

        const currentSkills =
          currentUserProgress[
            selectedCareer
          ] || [];

        const alreadyCompleted =
          currentSkills.includes(
            skill
          );


        // ----------------------------------------------
        // REMOVE
        // ----------------------------------------------

        if (alreadyCompleted) {

          return {
            ...previous,

            [uid]: {
              ...currentUserProgress,

              [selectedCareer]:
                currentSkills.filter(
                  (item) =>
                    item !== skill
                ),
            },
          };
        }


        // ----------------------------------------------
        // ADD
        // ----------------------------------------------

        return {
          ...previous,

          [uid]: {
            ...currentUserProgress,

            [selectedCareer]: [
              ...currentSkills,
              skill,
            ],
          },
        };
      }
    );
  }


  // ====================================================
  // CHANGE CAREER
  // ====================================================

  function handleCareerChange(
    career
  ) {

    setSelectedCareer(
      career
    );

    // IMPORTANT:
    // Do NOT clear progress here.
    //
    // Each career has its own
    // saved progress.
  }


  // ====================================================
  // RESET CURRENT CAREER
  // ====================================================

  function resetProgress() {

    if (!uid) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to reset your ${selectedCareer} roadmap progress?`
      );

    if (!confirmed) {
      return;
    }

    setProgressByUser(
      (previous) => {

        const currentUserProgress =
          previous[uid] ??
          loadRoadmapProgress(uid);

        const updated = {
          ...currentUserProgress,
        };

        delete updated[
          selectedCareer
        ];

        return {
          ...previous,

          [uid]: updated,
        };
      }
    );
  }


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <section className="min-h-screen bg-slate-100 py-12">

      <div className="max-w-7xl mx-auto px-6">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="text-center mb-10">

          <p className="text-blue-600 font-semibold">
            CAREEROS LEARNING PLAN
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Career Roadmap
          </h1>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Follow a structured learning path,
            complete important skills, and track
            your progress toward your career goal.
          </p>

        </div>


        {/* ==================================================
            CAREER SELECTOR
        ================================================== */}

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
                handleCareerChange(
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-3 w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-500"
            >

              {careers.map(
                (career) => (

                  <option
                    key={career}
                    value={career}
                  >
                    {career}
                  </option>

                )
              )}

            </select>

          </div>

        </div>


        {/* ==================================================
            PROGRESS
        ================================================== */}

        <div className="mb-8">

          <RoadmapProgress
            roadmap={roadmap}
            completedSkills={
              completedSkills
            }
          />

        </div>


        {/* ==================================================
            SKILLS
        ================================================== */}

        <div className="mb-8">

          <RoadmapSkills
            roadmap={roadmap}
            completedSkills={
              completedSkills
            }
          />

        </div>


        {/* ==================================================
            TIMELINE
        ================================================== */}

        <div className="mb-8">

          <RoadmapTimeline
            roadmap={roadmap}
            completedSkills={
              completedSkills
            }
            onToggleSkill={
              toggleSkill
            }
          />

        </div>


        {/* ==================================================
            RESET
        ================================================== */}

        <div className="flex justify-center">

          <button
            type="button"
            onClick={
              resetProgress
            }
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
  
