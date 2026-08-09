import { Calendar, Clock, Monitor, ArrowRight } from "lucide-react";
import examsDatabase from "../../../data/exams";

function UpcomingExams() {
  const exams = examsDatabase.all.slice(0, 3);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 h-[650px] flex flex-col">

      <div className="flex items-center gap-3 mb-6">

        <Calendar className="text-red-500" />

        <h2 className="text-2xl font-bold">
          Entrance Exams
        </h2>

      </div>

      <div className="space-y-5 flex-1 overflow-y-auto pr-2">

        {exams.map((exam) => (

          <div
            key={exam.id}
            className="border rounded-2xl p-5 hover:border-red-500 transition"
          >

            <h3 className="text-lg font-bold">
              {exam.name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {exam.eligibility}
            </p>

            <div className="flex items-center gap-2 mt-3 text-gray-600">

              <Monitor size={16} />

              {exam.mode}

            </div>

            <div className="flex items-center gap-2 mt-2 text-gray-600">

              <Clock size={16} />

              {exam.duration}

            </div>

            <div className="mt-4 flex justify-between items-center">

              <span className="text-sm text-blue-600 font-medium">
                {exam.conductedBy}
              </span>

              <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold">
                Details
                <ArrowRight size={16} />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default UpcomingExams;