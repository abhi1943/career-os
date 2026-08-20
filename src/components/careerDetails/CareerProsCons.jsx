function CareerProsCons({ career }) {
  if (!career) return null;

  const pros = Array.isArray(career.pros)
    ? career.pros
    : [];

  const cons = Array.isArray(career.cons)
    ? career.cons
    : [];

  if (pros.length === 0 && cons.length === 0) {
    return null;
  }

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        👍 Pros & 👎 Cons
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Advantages */}

        {pros.length > 0 && (
          <div className="bg-green-50 rounded-3xl shadow-lg p-8">

            <h3 className="text-2xl font-bold text-green-700 mb-6">
              Advantages
            </h3>

            <ul className="space-y-4">

              {pros.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="text-gray-700"
                >
                  ✅ {item}
                </li>
              ))}

            </ul>

          </div>
        )}

        {/* Challenges */}

        {cons.length > 0 && (
          <div className="bg-red-50 rounded-3xl shadow-lg p-8">

            <h3 className="text-2xl font-bold text-red-700 mb-6">
              Challenges
            </h3>

            <ul className="space-y-4">

              {cons.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="text-gray-700"
                >
                  ❌ {item}
                </li>
              ))}

            </ul>

          </div>
        )}

      </div>

    </div>
  );
}

export default CareerProsCons;