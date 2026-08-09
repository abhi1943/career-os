import {
  Clock3,
  IndianRupee,
  TrendingUp,
  Star,
  Heart,
  Scale,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";

function CareerHero({
  career,
  favorite,
  compared,
  toggleFavorite,
  addToCompare,
  setGoal,
}) {
  return (
    <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-indigo-700 rounded-3xl text-white p-10 shadow-xl">
      <div className="flex flex-col lg:flex-row justify-between gap-10">

        <div className="flex-1">
          <h1 className="text-5xl font-bold">
            {career.icon} {career.name}
          </h1>

          <p className="text-xl mt-5 text-blue-100">
            {career.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-8">

            <span className="bg-white/20 px-5 py-2 rounded-full flex items-center gap-2">
              <Clock3 size={18}/>
              {career.duration}
            </span>

            <span className="bg-white/20 px-5 py-2 rounded-full">
              🎯 {career.eligibility}
            </span>

            <span className="bg-white/20 px-5 py-2 rounded-full flex items-center gap-2">
              <IndianRupee size={18}/>
              {career.averageSalary}
            </span>

            <span className="bg-white/20 px-5 py-2 rounded-full flex items-center gap-2">
              <TrendingUp size={18}/>
              {career.growth}
            </span>

          </div>
        </div>

        <div className="lg:w-72">

          <div className="bg-white/10 rounded-3xl p-6 backdrop-blur">

            <div className="flex items-center gap-2">
              <Star fill="currentColor" className="text-yellow-400"/>
              <span className="text-xl font-bold">
                {career.rating}
              </span>
            </div>

            <div className="space-y-4 mt-8">

              <button
                onClick={() => toggleFavorite(career)}
                className={`w-full rounded-xl py-3 flex items-center justify-center gap-2 ${
                  favorite
                    ? "bg-red-500"
                    : "bg-white text-blue-700"
                }`}
              >
                <Heart fill={favorite ? "currentColor" : "none"} />
                {favorite ? "Saved" : "Save Career"}
              </button>

              <button
                onClick={() => addToCompare(career)}
                disabled={compared}
                className={`w-full rounded-xl py-3 flex items-center justify-center gap-2 ${
                  compared
                    ? "bg-gray-300"
                    : "bg-yellow-400"
                }`}
              >
                <Scale/>
                {compared ? "Added" : "Compare"}
              </button>

              <button
                onClick={()=>{
                  navigator.clipboard.writeText(window.location.href);
                  alert("Career link copied!");
                }}
                className="w-full rounded-xl py-3 bg-white/20 flex items-center justify-center gap-2"
              >
                <Share2/>
                Share
              </button>

              <button
                onClick={()=>setGoal(career)}
                className="w-full rounded-xl py-3 bg-green-600"
              >
                🎯 Set as Career Goal
              </button>
              <Link to={`/chatbot?career=${career.id}`}>
  <button className="w-full rounded-xl py-3 bg-purple-600 hover:bg-purple-700 transition text-white">
    🤖 Ask AI Mentor
  </button>
</Link>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default CareerHero;