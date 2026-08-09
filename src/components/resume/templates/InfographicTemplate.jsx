function InfographicTemplate({ resume }) {
  return (
    <div className="grid grid-cols-3 bg-white shadow-lg">

      <aside className="bg-blue-700 text-white p-6">

        <h1 className="text-3xl font-bold">
          {resume.name}
        </h1>

        <p>{resume.targetRole}</p>

        <div className="mt-8">

          <h2 className="font-bold mb-3">
            Skills
          </h2>

          {(resume.skills || []).map(skill=>(

            <div
              key={skill}
              className="bg-white text-blue-700 rounded px-3 py-1 mb-2"
            >
              {skill}
            </div>

          ))}

        </div>

      </aside>

      <main className="col-span-2 p-8">

        <h2 className="text-2xl font-bold mb-3">
          Summary
        </h2>

        <p>{resume.summary}</p>

      </main>

    </div>
  );
}

export default InfographicTemplate;