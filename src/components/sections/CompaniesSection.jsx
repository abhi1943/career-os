import {
  Building2,
  ArrowRight
} from "lucide-react";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Infosys",
  "TCS",
  "Accenture",
  "Wipro",
  "Capgemini",
  "Oracle",
  "IBM",
];

function CompaniesSection() {
  return (
    <section className="py-20 bg-slate-100">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center">
          Top Hiring Companies
        </h2>

        <p className="text-center text-slate-500 mt-4">
          Explore companies hiring across Engineering,
          Management, Medical and Government sectors.
        </p>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">

          {companies.map((company) => (

            <div
              key={company}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300 cursor-pointer"
            >

              <Building2 className="text-blue-600 w-10 h-10" />

              <h3 className="text-2xl font-bold mt-6">
                {company}
              </h3>

              <button className="flex items-center gap-2 text-blue-600 mt-6">
                Explore
                <ArrowRight size={18} />
              </button>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default CompaniesSection;