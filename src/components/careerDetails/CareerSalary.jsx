import CareerSalaryChart from "./CareerSalaryChart";

function CareerSalary({ salary }) {
  if (!salary) return null;

  return (
    <section
      aria-labelledby="salary-heading"
      className="mt-12 sm:mt-20"
    >

      <h2
        id="salary-heading"
        className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-slate-800"
      >
        💰 Salary Insights
      </h2>

      <div className="grid lg:grid-cols-2 gap-5 sm:gap-8">

        {/* India Salary */}
        <article className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-5 sm:p-8">

          <h3 className="text-xl sm:text-2xl font-bold text-blue-600 mb-5 sm:mb-6">
            🇮🇳 India
          </h3>

          <dl className="space-y-5">

            <div>
              <dt className="font-semibold text-slate-800">
                Fresher
              </dt>

              <dd className="mt-1 break-words text-gray-600">
                {salary.india?.fresher || "N/A"}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-800">
                Experienced
              </dt>

              <dd className="mt-1 break-words text-gray-600">
                {salary.india?.experienced || "N/A"}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-800">
                Senior
              </dt>

              <dd className="mt-1 break-words text-gray-600">
                {salary.india?.senior || "N/A"}
              </dd>
            </div>

          </dl>

        </article>

        {/* Abroad Salary */}
        <article className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-5 sm:p-8">

          <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-5 sm:mb-6">
            🌍 Abroad
          </h3>

          <dl className="space-y-5">

            <div>
              <dt className="font-semibold text-slate-800">
                USA
              </dt>

              <dd className="mt-1 break-words text-gray-600">
                {salary.abroad?.usa || "N/A"}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-800">
                UK
              </dt>

              <dd className="mt-1 break-words text-gray-600">
                {salary.abroad?.uk || "N/A"}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-800">
                Canada
              </dt>

              <dd className="mt-1 break-words text-gray-600">
                {salary.abroad?.canada || "N/A"}
              </dd>
            </div>

          </dl>

        </article>

      </div>

      <CareerSalaryChart salary={salary} />

    </section>
  );
}

export default CareerSalary;