function MinimalTemplate({ resume, resumeRef }) {
    return (
        <div
            ref={resumeRef}
            className="bg-white shadow-lg"
        >

            {/* Header */}

            <div className="bg-gray-900 text-white p-8">

                <h1 className="text-4xl font-bold">
                    {resume.name}
                </h1>

                <p className="text-xl mt-2">
                    {resume.targetRole}
                </p>

            </div>

            <div className="grid grid-cols-3">

                {/* LEFT */}

                <div className="bg-gray-100 p-6">

                    <h2 className="font-bold text-lg">
                        Contact
                    </h2>

                    <p>{resume.email}</p>

                    <p>{resume.phone}</p>

                    <p>{resume.location}</p>

                    <p>{resume.linkedin}</p>

                    <p>{resume.github}</p>

                    <hr className="my-5" />

                    <h2 className="font-bold text-lg">
                        Skills
                    </h2>

                    <p>{resume.programming}</p>

                    <p>{resume.frameworks}</p>

                    <p>{resume.databases}</p>

                    <p>{resume.tools}</p>

                    <p>{resume.cloud}</p>

                    <hr className="my-5" />

                    <h2 className="font-bold text-lg">
                        Languages
                    </h2>

                    <p>{resume.languages}</p>

                    <hr className="my-5" />

                    <h2 className="font-bold text-lg">
                        Certifications
                    </h2>

                    <ul className="list-disc ml-5">

                        {resume.certifications?.map((item, index) => (

                            <li key={index}>{item}</li>

                        ))}

                    </ul>

                </div>

                {/* RIGHT */}

                <div className="col-span-2 p-8">

                    <h2 className="text-2xl font-bold">
                        Professional Summary
                    </h2>

                    <p className="mt-3">
                        {resume.summary}
                    </p>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-bold">
                        Experience
                    </h2>

                    <ul className="list-disc ml-6 mt-3">

                        {resume.experience?.map((item, index) => (

                            <li key={index}>{item}</li>

                        ))}

                    </ul>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-bold">
                        Projects
                    </h2>

                    <div className="space-y-5 mt-5">

                        {resume.projects?.map((project, index) => (

                            <div key={index}>

                                <h3 className="font-bold">

                                    {project.title}

                                </h3>

                                <p>{project.description}</p>

                            </div>

                        ))}

                    </div>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-bold">
                        Education
                    </h2>

                    <p className="mt-3">

                        <strong>{resume.degree}</strong>

                    </p>

                    <p>{resume.branch}</p>

                    <p>{resume.college}</p>

                    <p>CGPA : {resume.cgpa}</p>

                    <p>{resume.graduationYear}</p>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-bold">
                        Achievements
                    </h2>

                    <ul className="list-disc ml-6 mt-3">

                        {resume.achievements?.map((item, index) => (

                            <li key={index}>{item}</li>

                        ))}

                    </ul>

                </div>

            </div>

        </div>
    );
}

export default MinimalTemplate;