import {
FileText,
ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const exams = [
"JEE Main",
"JEE Advanced",
"NEET",
"CUET",
"GATE",
"CAT",
"UPSC",
"SSC CGL",
"RRB JE",
"POLYCET",
"ECET",
"ICET",
];

function ExamsSection() {
return (
<section className="py-20 bg-slate-50">

  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center max-w-3xl mx-auto">

      <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
        EDUCATION
      </span>

      <h2 className="text-4xl md:text-5xl font-bold mt-5">
        Popular Entrance Exams
      </h2>

      <p className="text-slate-500 mt-4 text-lg">
        Find important entrance and competitive exams
        for your education and career goals.
      </p>

    </div>

    <div className="flex flex-wrap justify-center gap-4 mt-12">

      {exams.map((exam) => (

        <Link
          key={exam}
          to="/exams"
          className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-4 flex items-center gap-3 hover:bg-blue-600 hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 font-medium"
        >

          <FileText size={20} />

          {exam}

        </Link>

      ))}

    </div>

    <div className="flex justify-center mt-10">

      <Link
        to="/exams"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        Explore All Exams
        <ArrowRight size={18} />
      </Link>

    </div>

  </div>

</section>

);
}

export default ExamsSection;
