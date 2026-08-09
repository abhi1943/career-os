import { useState } from "react";
import { getAllColleges } from "../../utils/collegeEngine";
import CollegeCard from "../../components/cards/CollegeCard";

function Colleges() {
  const [search, setSearch] = useState("");

  const colleges = getAllColleges().filter((college) =>
    college.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">

      <h1 className="text-5xl font-bold text-center">
        Colleges
      </h1>

      <p className="text-center text-gray-500 mt-4">
        Explore top colleges based on your career.
      </p>

      <div className="mt-10 flex justify-center">

        <input
          type="text"
          placeholder="Search colleges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

        {colleges.map((college) => (
          <CollegeCard
            key={college.id}
            college={college}
          />
        ))}

      </div>

    </div>
  );
}

export default Colleges;