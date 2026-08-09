function ATSProfessionalTemplate({ resume }) {
  return (
    <div className="bg-white p-8 text-black">

      <h1 className="text-3xl font-bold">
        {resume.name}
      </h1>

      <p>
        {resume.email} | {resume.phone}
      </p>

      <hr className="my-4"/>

      <h2 className="font-bold">
        SUMMARY
      </h2>

      <p className="mb-4">
        {resume.summary}
      </p>

      <h2 className="font-bold">
        SKILLS
      </h2>

      <p className="mb-4">
        {(resume.skills || []).join(", ")}
      </p>

      <h2 className="font-bold">
        PROJECTS
      </h2>

      {(resume.projects || []).map((project,index)=>(

        <div key={index} className="mb-3">

          <strong>{project.title}</strong>

          <p>{project.description}</p>

        </div>

      ))}

    </div>
  );
}

export default ATSProfessionalTemplate;