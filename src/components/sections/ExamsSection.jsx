import {
  FileText
} from "lucide-react";

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
  "ICET"
];

function ExamsSection() {
  return (
    <section className="py-20 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center">

          Popular Entrance Exams

        </h2>

        <div className="flex flex-wrap justify-center gap-5 mt-16">

          {exams.map((exam) => (

            <div
              key={exam}
              className="bg-white rounded-full shadow-md px-8 py-4 flex items-center gap-3 hover:bg-blue-600 hover:text-white transition cursor-pointer"
            >

              <FileText />

              {exam}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default ExamsSection;