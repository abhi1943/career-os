function CorporateTemplate({ resume }) {
  return (
    <div className="bg-white border p-10">

      <h1 className="text-4xl font-bold">
        {resume.name}
      </h1>

      <p className="text-gray-600">
        {resume.targetRole}
      </p>

      <hr className="my-5"/>

      <section className="mb-5">

        <h2 className="font-bold">
          Professional Summary
        </h2>

        <p>{resume.summary}</p>

      </section>

      <section className="mb-5">

        <h2 className="font-bold">
          Experience
        </h2>

        {(resume.experience || []).map((exp,index)=>(

          <p key={index}>
            • {exp}
          </p>

        ))}

      </section>

      <section>

        <h2 className="font-bold">
          Education
        </h2>

        <p>
          {resume.degree}
        </p>

        <p>
          {resume.college}
        </p>

      </section>

    </div>
  );
}

export default CorporateTemplate;