function CareerComparison({ career1, career2 }) {
  if (!career1 || !career2) return null;

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        ⚖ AI Career Comparison
      </h2>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h3 className="text-2xl font-bold">
            {career1.icon} {career1.name}
          </h3>

          <p className="mt-4">
            💰 Salary : {career1.averageSalary}
          </p>

          <p>
            📈 Growth : {career1.growth}
          </p>

          <p>
            ⭐ Rating : {career1.rating}
          </p>

          <div className="mt-6">

            <strong>Skills</strong>

            <div className="flex flex-wrap gap-2 mt-3">

              {career1.skills?.map(skill => (

                <span
                  key={skill}
                  className="bg-blue-100 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h3 className="text-2xl font-bold">
            {career2.icon} {career2.name}
          </h3>

          <p className="mt-4">
            💰 Salary : {career2.averageSalary}
          </p>

          <p>
            📈 Growth : {career2.growth}
          </p>

          <p>
            ⭐ Rating : {career2.rating}
          </p>

          <div className="mt-6">

            <strong>Skills</strong>

            <div className="flex flex-wrap gap-2 mt-3">

              {career2.skills?.map(skill => (

                <span
                  key={skill}
                  className="bg-green-100 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CareerComparison;