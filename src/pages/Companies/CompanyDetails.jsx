import { useParams } from "react-router-dom";
import { getCompanyById } from "../../utils/companyEngine";

function CompanyDetails() {
  const { companyId } = useParams();

  const company = getCompanyById(companyId);

  if (!company) {
    return (
      <h1 className="text-center text-4xl mt-20">
        Company Not Found
      </h1>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl text-white p-10">

        <div className="text-6xl">
          {company.logo}
        </div>

        <h1 className="text-5xl font-bold mt-4">
          {company.name}
        </h1>

        <p className="text-xl mt-2">
          {company.industry}
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Company Information
          </h2>

          <p><strong>Location:</strong> {company.location}</p>
          <p><strong>Package:</strong> {company.package}</p>
          <p><strong>Rating:</strong> ⭐ {company.rating}</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold mb-4">
            Required Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {company.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

      </div>

      <div className="mt-12 bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-5">
          Hiring Roles
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          {company.careers.map((role) => (
            <div
              key={role}
              className="bg-slate-100 rounded-xl p-4"
            >
              🚀 {role}
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default CompanyDetails;