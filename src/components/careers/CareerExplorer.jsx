
import { useContext, useMemo, useState } from "react";
import { CareerContext } from "../../context/CareerContext";
import { getCareerOptions } from "../../utils/careerEngine";

import CareerCard from "../cards/CareerCard";
import CareerSearch from "./CareerSearch";
import CareerFilters from "./CareerFilters";

function CareerExplorer() {
  const { student } = useContext(CareerContext);



  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const filteredCareers = useMemo(() => {
    if (!student || !student.education) {
      return [];
    }

    // IMPORTANT:
    // getCareerOptions expects the complete student object
    const careers = getCareerOptions(student);


    return careers.filter((career) => {
      if (!career || !career.name) {
        return false;
      }

      const matchesSearch = career.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        career.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [student, search, selectedCategory]);

  if (!student) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <h2 className="text-3xl font-bold text-slate-800">
            No Student Profile Found
          </h2>

          <p className="mt-4 text-gray-500">
            Please fill out your Student Career Profile
            to explore careers.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center">
          Career Explorer
        </h2>

        <p className="text-center text-gray-500 mt-4">
          Discover the best career opportunities after{" "}
          <span className="font-semibold text-blue-600">
            {student.education}
          </span>
        </p>

        <CareerSearch
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <CareerFilters
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="mt-10 mb-6 flex justify-between items-center">

          <h3 className="text-2xl font-bold">
            Available Careers
          </h3>

          <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            {filteredCareers.length} Careers
          </span>

        </div>

        {filteredCareers.length > 0 ? (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredCareers.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
              />
            ))}

          </div>

        ) : (

          <div className="bg-white rounded-3xl shadow-lg py-20 text-center">

            <h3 className="text-3xl font-bold text-gray-700">
              No Careers Found
            </h3>

            <p className="mt-4 text-gray-500">
              No careers are available for the selected
              education and specialization.
            </p>

          </div>

        )}

      </div>
    </section>
  );
}

export default CareerExplorer;