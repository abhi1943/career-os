function CareerFuture({ career }) {
  if (!career.futureScope) return null;

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        🚀 Future Scope
      </h2>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl shadow-lg p-8">

        <h3 className="text-2xl font-bold text-blue-700">
          Industry Outlook
        </h3>

        <p className="mt-5 text-gray-700 leading-8 text-lg">
          {career.futureScope}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white rounded-2xl shadow p-5">

            <h4 className="font-bold">
              📈 Growth
            </h4>

            <p className="mt-2">
              {career.growth}
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow p-5">

            <h4 className="font-bold">
              💼 Openings
            </h4>

            <p className="mt-2">
              {career.jobOpenings}
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow p-5">

            <h4 className="font-bold">
              🌍 Work Mode
            </h4>

            <p className="mt-2">
              {career.workMode}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CareerFuture;