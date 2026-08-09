import { useState } from "react";
import ExamCard from "../../components/cards/ExamCard";
import { getAllExams } from "../../utils/examEngine";

function Exams() {
  const [search, setSearch] = useState("");

  const exams = getAllExams().filter((exam) =>
    exam.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">

      <h1 className="text-5xl font-bold text-center">
        Entrance Exams
      </h1>

      <p className="text-center text-gray-500 mt-4">
        Explore entrance exams, eligibility, duration and conducting authorities.
      </p>

      <div className="flex justify-center mt-10">
        <input
          type="text"
          placeholder="Search exams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
          />
        ))}

      </div>

    </div>
  );
}

export default Exams;