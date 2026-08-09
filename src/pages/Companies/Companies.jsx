import { useState } from "react";
import CompanyCard from "../../components/cards/CompanyCard";
import { getAllCompanies } from "../../utils/companyEngine";

function Companies() {
  const [search, setSearch] = useState("");

  const companies = getAllCompanies().filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">

      <h1 className="text-5xl font-bold text-center">
        Top Companies
      </h1>

      <p className="text-center text-gray-500 mt-4">
        Explore top recruiters, required skills, and salary packages.
      </p>

      <div className="flex justify-center mt-10">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
          />
        ))}

      </div>

    </div>
  );
}

export default Companies;