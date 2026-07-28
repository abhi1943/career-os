import { useContext } from "react";
import { CareerContext } from "../../context/CareerContext";
import { getCareerOptions } from "../../utils/careerEngine";
import CareerCard from "../cards/CareerCard";

function CareerExplorer() {
  const { student } = useContext(CareerContext);

  if (!student) return null;

  const careers = getCareerOptions(student.education);

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center">
          Career Options
        </h2>

        <p className="text-center text-gray-500 mt-4">
          Explore the best career opportunities available after {student.education}.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">

          {careers.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
            />
          ))}

        </div>

      </div>
    </section>
  );
}

export default CareerExplorer;