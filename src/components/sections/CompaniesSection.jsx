
import {
  Building2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

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
    <section
      aria-labelledby="companies-heading"
      className="py-20 bg-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

          <div>
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              OPPORTUNITIES
            </span>

            <h2
              id="companies-heading"
              className="text-4xl md:text-5xl font-bold mt-5"
            >
              Top Hiring Companies
            </h2>

            <p className="text-slate-500 mt-4 max-w-2xl">
              Explore companies and discover career opportunities
              across different industries.
            </p>
          </div>

          <Link
            to="/companies"
            className="
              inline-flex
              items-center
              gap-2
              bg-blue-600
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
              hover:bg-blue-700
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-600
              focus-visible:ring-offset-2
              transition
            "
          >
            View All Companies

            <ArrowRight
              size={18}
              aria-hidden="true"
            />
          </Link>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

          {companies.map((company) => (

            <Link
              key={company}
              to="/companies"
              className="
                group
                bg-white
                rounded-2xl
                border
                border-slate-200
                p-6
                hover:shadow-xl
                motion-safe:hover:-translate-y-1
                transition-all
                duration-300
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-600
                focus-visible:ring-offset-2
              "
            >

              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"
              >
                <Building2
                  className="text-blue-600"
                  size={25}
                />
              </div>

              <h3 className="text-xl font-bold mt-5 group-hover:text-blue-600 transition">
                {company}
              </h3>

              <div className="flex items-center gap-2 text-blue-600 mt-4 text-sm font-semibold">
                Explore company

                <ArrowRight
                  size={16}
                  className="motion-safe:group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </div>

            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}

export default CompaniesSection;

