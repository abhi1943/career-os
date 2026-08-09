import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../../components/common/SearchBar";
import { globalSearch } from "../../utils/searchEngine";
import CareerCard from "../../components/cards/CareerCard";

function Search() {
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

const results = globalSearch(query);
  const handleSuggestionClick = (item) => {
    setQuery(item.name);

    switch (item.type) {
      case "Career":
      case "Profession":
        navigate(`/careers/${item.id}`);
        break;

      case "College":
        navigate("/colleges");
        break;

      case "Exam":
        navigate("/exams");
        break;

      case "Company":
        navigate("/companies");
        break;

      default:
        break;
    }
  };

  return (
    <section className="py-20 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-bold text-center mb-10">
          Search CareerOS
        </h1>

        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          suggestions={results}
          onSuggestionClick={handleSuggestionClick}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

          {results.map((item) => (
            <div key={item.id}>

              {(item.type === "Career" ||
                item.type === "Profession") && (
                <CareerCard career={item} />
              )}

              {item.type === "College" && (
                <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">
                  <span className="text-sm bg-green-100 px-3 py-1 rounded-full">
                    College
                  </span>

                  <h2 className="text-2xl font-bold mt-4">
                    {item.name}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    {item.location}
                  </p>
                </div>
              )}

              {item.type === "Exam" && (
                <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">
                  <span className="text-sm bg-orange-100 px-3 py-1 rounded-full">
                    Exam
                  </span>

                  <h2 className="text-2xl font-bold mt-4">
                    {item.name}
                  </h2>
                </div>
              )}

              {item.type === "Company" && (
                <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">
                  <span className="text-sm bg-blue-100 px-3 py-1 rounded-full">
                    Company
                  </span>

                  <h2 className="text-2xl font-bold mt-4">
                    {item.logo} {item.name}
                  </h2>

                  <p className="mt-2">
                    {item.location}
                  </p>

                  <p className="font-semibold mt-3">
                    {item.package}
                  </p>
                </div>
              )}

            </div>
          ))}

        </div>

        {query && results.length === 0 && (
          <p className="text-center mt-10 text-gray-500 text-lg">
            No matching careers, colleges, companies or exams found.
          </p>
        )}

      </div>
    </section>
  );
}

export default Search;