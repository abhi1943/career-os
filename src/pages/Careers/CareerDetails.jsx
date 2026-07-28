import { useParams } from "react-router-dom";
import { getCareerById } from "../../utils/careerEngine";
import RoadmapFlow from "../../components/roadmap/RoadmapFlow";
import { getColleges } from "../../utils/collegeEngine";
import CollegeCard from "../../components/cards/CollegeCard";
import { getExams } from "../../utils/examEngine";
import ExamCard from "../../components/cards/ExamCard";

function CareerDetails() {
  const { careerId } = useParams();

  const career = getCareerById(careerId);
  const colleges = getColleges(career.id);
  const exams = getExams(career.id);

  if (!career) {
    return (
      <h1 className="text-center text-4xl mt-20">
        Career Not Found
      </h1>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">

      <h1 className="text-5xl font-bold">
        {career.name}
      </h1>

      <p className="text-blue-600 text-xl mt-3">
        {career.duration}
      </p>

      <p className="mt-6 text-gray-700">
        {career.description}
      </p>

      <div className="mt-10">

        <h2 className="text-3xl font-bold">
          Eligibility
        </h2>

        <p className="mt-3">
          {career.eligibility}
        </p>

      </div>

      <div className="mt-10">

        <h2 className="text-3xl font-bold">
          Streams
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mt-5">

          {career.streams.map((stream) => (
            <div
              key={stream}
              className="p-4 rounded-xl bg-blue-50"
            >
              {stream}
            </div>
          ))}

        </div>

      </div>

      <div className="mt-12">

        <h2 className="text-3xl font-bold">
          Entrance Exams
        </h2>

        <div className="flex flex-wrap gap-4 mt-5">

          {career.entranceExams.map((exam) => (
            <span
              key={exam}
              className="bg-green-100 px-4 py-2 rounded-full"
            >
              {exam}
            </span>
          ))}

        </div>

      </div>

      <div className="mt-12">

        <h2 className="text-3xl font-bold">
          Higher Studies
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mt-5">

          {career.higherStudies.map((study) => (
            <div
              key={study}
              className="bg-purple-100 p-4 rounded-xl"
            >
              {study}
            </div>
          ))}

        </div>

      </div>

      {/* Skills Required */}

      <div className="mt-12">

        <h2 className="text-3xl font-bold">
          Skills Required
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mt-5">

          {career.skills?.map((skill) => (
            <div
              key={skill}
              className="bg-orange-100 p-4 rounded-xl font-medium"
            >
              ✅ {skill}
            </div>
          ))}

        </div>

      </div>

      {/* Top Colleges */}

      <div className="mt-12">

        <h2 className="text-3xl font-bold">
          Top Colleges
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mt-5">

          {career.topColleges?.map((college) => (
            <div
              key={college}
              className="bg-blue-100 p-4 rounded-xl"
            >
              🏫 {college}
            </div>
          ))}

        </div>

      </div>

      {/* Career Opportunities */}

      <div className="mt-12">

        <h2 className="text-3xl font-bold">
          Career Opportunities
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mt-5">

          {career.careerOpportunities?.map((job) => (
            <div
              key={job}
              className="bg-green-100 p-4 rounded-xl"
            >
              🚀 {job}
            </div>
          ))}

        </div>

      </div>
      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-8">
          Career Roadmap
        </h2>

        <RoadmapFlow roadmap={career.roadmap} />
        <div className="mt-20">

          <h2 className="text-3xl font-bold mb-8">
            Recommended Colleges
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
              />
            ))}

          </div>

        </div>
        <div className="mt-20">

          <h2 className="text-3xl font-bold mb-8">
            Entrance Exams
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {exams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
              />
            ))}

          </div>

        </div>
      </div>

    </div>
  );
}

export default CareerDetails;