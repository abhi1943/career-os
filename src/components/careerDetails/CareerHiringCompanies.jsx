import hiringCompanies from "../../data/hiringCompanies";

function CareerHiringCompanies({ careerId }) {
  const companies = hiringCompanies[careerId];

  if (!companies) return null;

  return (
    <div className="mt-14">

      <h2 className="text-3xl font-bold mb-6">
        🔥 Companies Hiring for this Role
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {companies.map((company) => (
          <div
            key={company}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border"
          >
            <div className="text-5xl mb-3">
              🏢
            </div>

            <h3 className="font-bold text-xl">
              {company}
            </h3>

            <p className="text-gray-500 mt-2">
              Frequently hires professionals for this role.
            </p>

            <button
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              View Jobs
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}

export default CareerHiringCompanies;