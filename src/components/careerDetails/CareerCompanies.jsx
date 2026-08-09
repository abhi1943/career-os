import companies from "../../data/companies/companies";

function CareerCompanies({ topCompanies = [] }) {
  if (!topCompanies.length) return null;

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        🏢 Top Hiring Companies
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {topCompanies.map((companyName) => {

          const company = companies.find(
            (item) =>
              item.shortName === companyName ||
              item.name === companyName
          );

          if (!company) return null;

          return (
            <div
              key={company.id}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
            >

              <div className="text-5xl">
                {company.logo}
              </div>

              <h3 className="text-2xl font-bold mt-4">
                {company.shortName}
              </h3>

              <p className="text-gray-500">
                {company.industry}
              </p>

              <p className="mt-3">
                📍 {company.location}
              </p>

              <p>
                ⭐ {company.rating}
              </p>

              <p>
                💰 {company.package}
              </p>

              <div className="mt-4">

                <h4 className="font-semibold">
                  Skills
                </h4>

                <div className="flex flex-wrap gap-2 mt-2">

                  {company.skills.map(skill => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

              <div className="mt-5">

                <h4 className="font-semibold">
                  Careers
                </h4>

                <ul className="list-disc ml-5 mt-2 text-gray-600">

                  {company.careers.map(job => (
                    <li key={job}>{job}</li>
                  ))}

                </ul>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default CareerCompanies;