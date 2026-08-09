function ExecutiveTemplate({ resume }) {
  return (
    <div className="bg-white p-10 shadow rounded-lg text-gray-900 font-serif">

      <div className="border-b-4 border-blue-700 pb-5 mb-6">
        <h1 className="text-4xl font-bold">
          {resume.name}
        </h1>

        <p className="text-lg text-blue-700">
          {resume.targetRole}
        </p>

        <p className="text-sm mt-2">
          {resume.email} | {resume.phone}
        </p>

        <p className="text-sm">
          {resume.location}
        </p>
      </div>

      <section className="mb-6">
        <h2 className="font-bold text-xl border-b mb-2">
          Executive Summary
        </h2>

        <p>{resume.summary}</p>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-xl border-b mb-2">
          Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {(resume.skills || []).map(skill => (
            <span
              key={skill}
              className="bg-blue-100 px-3 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-bold text-xl border-b mb-2">
          Projects
        </h2>

        {(resume.projects || []).map((project, index) => (
          <div key={index} className="mb-3">

            <strong>{project.title}</strong>

            <p>{project.description}</p>

          </div>
        ))}
      </section>

    </div>
  );
}

export default ExecutiveTemplate;