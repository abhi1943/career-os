import CareerSalaryChart from "./CareerSalaryChart";

function CareerSalary({ salary }) {
  if (!salary) return null;

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold mb-8">
        💰 Salary Insights
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* India Salary */}

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-blue-600 mb-6">
            🇮🇳 India
          </h3>

          <div className="space-y-5">
            <div>
              <strong>Fresher</strong>
              <p>{salary.india?.fresher || "N/A"}</p>
            </div>

            <div>
              <strong>Experienced</strong>
              <p>{salary.india?.experienced || "N/A"}</p>
            </div>

            <div>
              <strong>Senior</strong>
              <p>{salary.india?.senior || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Abroad Salary */}

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-green-600 mb-6">
            🌍 Abroad
          </h3>

          <div className="space-y-5">
            <div>
              <strong>USA</strong>
              <p>{salary.abroad?.usa || "N/A"}</p>
            </div>

            <div>
              <strong>UK</strong>
              <p>{salary.abroad?.uk || "N/A"}</p>
            </div>

            <div>
              <strong>Canada</strong>
              <p>{salary.abroad?.canada || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Growth Chart */}

      <CareerSalaryChart salary={salary} />
    </div>
  );
}

export default CareerSalary;