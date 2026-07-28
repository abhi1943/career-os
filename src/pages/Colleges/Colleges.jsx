import CollegeCard from "@/components/cards/CollegeCard";
import { getColleges } from "@/utils/collegeEngine";

function Colleges() {
  const colleges = getColleges("intermediate");

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">

      <h1 className="text-5xl font-bold">
        Top Colleges
      </h1>

      <p className="mt-4 text-gray-600">
        Browse colleges based on your career.
      </p>

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