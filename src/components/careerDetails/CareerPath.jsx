function CareerPath({ career }) {

  if (!career.careerPath) return null;

  return (

    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        📈 Career Growth Path
      </h2>

      <div className="flex flex-wrap gap-4 items-center">

        {career.careerPath.map((step, index) => (

          <div
            key={step}
            className="flex items-center gap-3"
          >

            <div className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold">
              {step}
            </div>

            {index !== career.careerPath.length - 1 && (
              <span className="text-3xl">
                →
              </span>
            )}

          </div>

        ))}

      </div>

    </div>

  );
}

export default CareerPath;