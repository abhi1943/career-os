import {
  BarChart3,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";

import {
  getMatchedSkills,
} from "../../utils/skillEngine";

function CareerAnalytics({
  student,
  career,
  learningProgress = 0,
}) {
  if (!student || !career) return null;

  /* ==================================================
     SAFE DATA
  ================================================== */

  const studentSkills = Array.isArray(student.skills)
    ? student.skills
    : [];

  const careerSkills = Array.isArray(career.skills)
    ? career.skills
    : [];

  /* ==================================================
     MATCHED SKILLS
  ================================================== */

  const matchedSkills = getMatchedSkills(
    studentSkills,
    careerSkills
  );

  const totalSkills = careerSkills.length;

  const matchedCount = matchedSkills.length;

  /* ==================================================
     SKILL PROGRESS
  ================================================== */

  const skillProgress =
    totalSkills === 0
      ? 0
      : Math.round(
          (matchedCount / totalSkills) * 100
        );

  /* ==================================================
     ROADMAP PROGRESS
     
     For now this is based on skill readiness.
     We will connect it to actual roadmap completion
     later.
  ================================================== */

  const roadmapProgress =
  learningProgress;

const readiness = Math.round(
  (skillProgress + roadmapProgress) / 2
);
  /* ==================================================
     RENDER
  ================================================== */

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        📊 Career Analytics
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* ==================================================
            SKILL MATCH
        ================================================== */}

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <BarChart3
            className="text-blue-600 mb-4"
            size={28}
          />

          <h3 className="font-bold">
            Skill Match
          </h3>

          <p className="text-4xl font-bold text-blue-600 mt-3">
            {skillProgress}%
          </p>

          <p className="text-sm text-gray-500 mt-2">
            {matchedCount} of {totalSkills} skills
          </p>

        </div>

        {/* ==================================================
            SKILLS COMPLETED
        ================================================== */}

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <Target
            className="text-green-600 mb-4"
            size={28}
          />

          <h3 className="font-bold">
            Skills Completed
          </h3>

          <p className="text-4xl font-bold text-green-600 mt-3">
            {matchedCount}/{totalSkills}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Required career skills
          </p>

        </div>

        {/* ==================================================
            ROADMAP PROGRESS
        ================================================== */}

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <TrendingUp
            className="text-purple-600 mb-4"
            size={28}
          />

          <h3 className="font-bold">
            Roadmap Progress
          </h3>

          <p className="text-4xl font-bold text-purple-600 mt-3">
            {roadmapProgress}%
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Based on current skill readiness
          </p>

        </div>

        {/* ==================================================
            CAREER READINESS
        ================================================== */}

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <Award
            className="text-orange-600 mb-4"
            size={28}
          />

          <h3 className="font-bold">
            Career Readiness
          </h3>

          <p className="text-4xl font-bold text-orange-600 mt-3">
            {readiness}%
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Overall preparation
          </p>

        </div>

      </div>

    </div>
  );
}

export default CareerAnalytics;