import { TrendingUp } from "lucide-react";

const skills = [
  { skill: "HTML & CSS", progress: "90%", width: "90%" },
  { skill: "JavaScript", progress: "70%", width: "70%" },
  { skill: "React.js", progress: "55%", width: "55%" },
  { skill: "Projects", progress: "35%", width: "35%" },
];

function ProgressCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">

      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">

          <TrendingUp className="text-green-600" />

          <h2 className="text-2xl font-bold">
            Learning Progress
          </h2>

        </div>

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          80%
        </span>

      </div>

      <div className="mb-6">

        <div className="flex justify-between mb-2">

          <span>Overall Progress</span>

          <span>80%</span>

        </div>

        <div className="h-3 bg-gray-200 rounded-full">

          <div className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 w-4/5"></div>

        </div>

      </div>

      {skills.map((item) => (
        <div key={item.skill} className="mb-5">

          <div className="flex justify-between text-sm mb-2">

            <span>{item.skill}</span>

            <span>{item.progress}</span>

          </div>

          <div className="h-2 bg-gray-200 rounded-full">

            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: item.width }}
            />

          </div>

        </div>
      ))}

    </div>
  );
}

export default ProgressCard;