import professions from "../../data/professions";
import CareerCard from "../../components/cards/CareerCard";

function ProfessionalCareers() {
  return (
    <div className="min-h-screen bg-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold">
            Professional Careers
          </h1>

          <p className="text-gray-500 mt-4 text-lg">
            Explore high-demand careers and build your roadmap.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {professions.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
            />
          ))}

        </div>

      </div>
    </div>
  );
}

export default ProfessionalCareers;