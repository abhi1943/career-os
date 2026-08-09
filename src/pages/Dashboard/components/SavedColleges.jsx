import { BookOpen, Star, MapPin } from "lucide-react";
import collegesDatabase from "../../../data/colleges";
function SavedColleges() {
  const colleges = collegesDatabase.engineering.slice(0, 3);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 h-[650px] flex flex-col">

      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-blue-600" />

        <h2 className="text-2xl font-bold">
          Saved Colleges
        </h2>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto pr-2">

        {colleges.map((college) => (

          <div
            key={college.id}
            className="border rounded-2xl p-5 hover:border-blue-500 transition"
          >

            <div className="flex justify-between items-center">

              <h3 className="font-bold">
                {college.name}
              </h3>

              <span className="flex items-center gap-1 text-yellow-500 font-semibold">

                <Star size={16} fill="currentColor" />

                {college.rating}

              </span>

            </div>

            <div className="flex items-center gap-2 mt-3 text-gray-500">

              <MapPin size={16} />

              {college.location}

            </div>

            <div className="flex justify-between mt-3">

              <span>{college.course}</span>

              <span className="font-semibold">
                {college.fees}
              </span>

            </div>

            <button className="mt-5 w-full rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700 transition">
              View Details
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default SavedColleges;