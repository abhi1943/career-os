function CareerSkills({ career, skillLibrary }) {

  if (!career || !skillLibrary) return null;

  const technical = skillLibrary.technical.filter((skill) =>
    career.skills?.includes(skill.name)
  );

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        🚀 Skills Required
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {technical.map(skill => (

          <div
            key={skill.id}
            className="bg-white rounded-2xl shadow-lg p-6"
          >

            <h3 className="text-xl font-bold">
              {skill.name}
            </h3>

            <p className="text-gray-500 mt-2">
              {skill.category}
            </p>

            <div className="mt-4 flex justify-between">

              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {skill.level}
              </span>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {skill.demand}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CareerSkills;