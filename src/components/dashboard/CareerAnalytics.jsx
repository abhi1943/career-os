import {
  BarChart3,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";

function CareerAnalytics({
  student,
  career,
}) {

  if (!student || !career) return null;

  const totalSkills =
    career.skills?.length || 0;

  const matchedSkills =
    student.skills?.filter(skill =>
      career.skills?.includes(skill)
    ).length || 0;

  const skillProgress =
    totalSkills === 0
      ? 0
      : Math.round(
          (matchedSkills / totalSkills) * 100
        );

  const roadmapProgress = 40;

  const readiness = Math.round(
    (skillProgress + roadmapProgress) / 2
  );

  return (

    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        📊 Career Analytics
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <BarChart3 className="text-blue-600 mb-4"/>

          <h3 className="font-bold">
            Skill Match
          </h3>

          <p className="text-4xl font-bold text-blue-600 mt-3">
            {skillProgress}%
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <Target className="text-green-600 mb-4"/>

          <h3 className="font-bold">
            Skills Completed
          </h3>

          <p className="text-4xl font-bold text-green-600 mt-3">

            {matchedSkills}/{totalSkills}

          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <TrendingUp className="text-purple-600 mb-4"/>

          <h3 className="font-bold">

            Roadmap Progress

          </h3>

          <p className="text-4xl font-bold text-purple-600 mt-3">

            {roadmapProgress}%

          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <Award className="text-orange-600 mb-4"/>

          <h3 className="font-bold">

            Career Readiness

          </h3>

          <p className="text-4xl font-bold text-orange-600 mt-3">

            {readiness}%

          </p>

        </div>

      </div>

    </div>

  );

}

export default CareerAnalytics;