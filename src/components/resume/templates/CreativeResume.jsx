function CreativeTemplate({ resume }) {
  return (
    <div className="bg-gradient-to-br from-indigo-100 to-pink-100 p-10 rounded-3xl shadow-xl">

      <div className="text-center mb-8">

        <h1 className="text-5xl font-black">
          {resume.name}
        </h1>

        <p className="text-xl text-indigo-700">
          {resume.targetRole}
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-8">

        <div>

          <h2 className="font-bold text-2xl mb-3">
            About Me
          </h2>

          <p>{resume.summary}</p>

        </div>

        <div>

          <h2 className="font-bold text-2xl mb-3">
            Skills
          </h2>

          {(resume.skills || []).map(skill => (

            <div
              key={skill}
              className="bg-white rounded-full px-4 py-2 mb-2 shadow"
            >
              {skill}
            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default CreativeTemplate;