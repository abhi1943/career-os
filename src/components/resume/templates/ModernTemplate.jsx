function ModernTemplate({ resume, resumeRef }) {
    const internships = Array.isArray(resume.internships)
        ? resume.internships
        : resume.internships
        ? resume.internships.split("\n").filter(Boolean)
        : [];

    const experience = Array.isArray(resume.experience)
        ? resume.experience
        : resume.experience
        ? resume.experience.split("\n").filter(Boolean)
        : [];

    const achievements = Array.isArray(resume.achievements)
        ? resume.achievements
        : resume.achievements
        ? resume.achievements.split("\n").filter(Boolean)
        : [];

    const certifications = Array.isArray(resume.certifications)
        ? resume.certifications
        : resume.certifications
        ? resume.certifications.split("\n").filter(Boolean)
        : [];

    return (
        <div
            ref={resumeRef}
            className="bg-white rounded-3xl shadow-xl p-10 text-gray-800"
        >
            {/* HEADER */}

            <div className="border-b-4 border-blue-600 pb-6">

                <h1 className="text-4xl font-bold tracking-wide">
                    {resume.name || "Your Name"}
                </h1>

                <p className="text-xl text-blue-600 font-semibold mt-2">
                    {resume.targetRole || "Software Engineer"}
                </p>

                <div className="grid md:grid-cols-2 gap-y-2 text-sm mt-5">

                    <p>📧 {resume.email || "-"}</p>

                    <p>📱 {resume.phone || "-"}</p>

                    <p>📍 {resume.location || "-"}</p>

                    {resume.linkedin && (
                        <a
                            href={resume.linkedin}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noreferrer"
                        >
                            LinkedIn
                        </a>
                    )}

                    {resume.github && (
                        <a
                            href={resume.github}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                    )}

                    {resume.portfolio && (
                        <a
                            href={resume.portfolio}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Portfolio
                        </a>
                    )}

                </div>

            </div>

            {/* SUMMARY */}

            <section className="mt-8">

                <h2 className="text-xl font-bold text-blue-700 border-b pb-2">
                    Professional Summary
                </h2>

                <p className="mt-3 leading-7">
                    {resume.summary || "Professional summary not added."}
                </p>

            </section>

            {/* EDUCATION */}

            <section className="mt-8">

                <h2 className="text-xl font-bold text-blue-700 border-b pb-2">
                    Education
                </h2>

                <div className="mt-4">

                    <h3 className="font-bold">
                        {resume.degree}
                    </h3>

                    <p>{resume.branch}</p>

                    <p>{resume.college}</p>

                    <p>
                        CGPA : {resume.cgpa} | Graduation :{" "}
                        {resume.graduationYear}
                    </p>

                </div>

            </section>

            {/* TECHNICAL SKILLS */}

            <section className="mt-8">

                <h2 className="text-xl font-bold text-blue-700 border-b pb-2">
                    Technical Skills
                </h2>

                <div className="grid md:grid-cols-2 gap-3 mt-4">

                    <p>
                        <strong>Programming :</strong>{" "}
                        {resume.programming || "-"}
                    </p>

                    <p>
                        <strong>Frameworks :</strong>{" "}
                        {resume.frameworks || "-"}
                    </p>

                    <p>
                        <strong>Databases :</strong>{" "}
                        {resume.databases || "-"}
                    </p>

                    <p>
                        <strong>Tools :</strong>{" "}
                        {resume.tools || "-"}
                    </p>

                    <p>
                        <strong>Cloud :</strong>{" "}
                        {resume.cloud || "-"}
                    </p>

                    <p>
                        <strong>Soft Skills :</strong>{" "}
                        {resume.softSkills || "-"}
                    </p>

                </div>

            </section>

            {/* PROJECTS */}

            <section className="mt-8">

                <h2 className="text-xl font-bold text-blue-700 border-b pb-2">
                    Projects
                </h2>

                {resume.projects?.length ? (

                    <div className="space-y-5 mt-5">

                        {resume.projects.map((project, index) => (

                            <div
                                key={index}
                                className="border rounded-xl p-5 bg-gray-50"
                            >

                                <h3 className="text-lg font-bold">
                                    {project.title}
                                </h3>

                                <p className="text-blue-700 mt-1">
                                    {project.technologies}
                                </p>

                                <p className="mt-3 whitespace-pre-line">
                                    {project.description}
                                </p>

                                <div className="flex gap-6 mt-3">

                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            GitHub
                                        </a>
                                    )}

                                    {project.live && (
                                        <a
                                            href={project.live}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            Live Demo
                                        </a>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (
                    <p className="mt-4 text-gray-500">
                        No projects added.
                    </p>
                )}

            </section>

            {/* INTERNSHIP */}

            <section className="mt-8">

                <h2 className="text-xl font-bold text-blue-700 border-b pb-2">
                    Internships
                </h2>

                <ul className="list-disc ml-6 mt-4 space-y-2">

                    {internships.length ? (
                        internships.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No internship added.</li>
                    )}

                </ul>

            </section>

            {/* EXPERIENCE */}

            <section className="mt-8">

                <h2 className="text-xl font-bold text-blue-700 border-b pb-2">
                    Experience
                </h2>

                <ul className="list-disc ml-6 mt-4 space-y-2">

                    {experience.length ? (
                        experience.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No experience added.</li>
                    )}

                </ul>

            </section>

            {/* ACHIEVEMENTS */}

            <section className="mt-8">

                <h2 className="text-xl font-bold text-blue-700 border-b pb-2">
                    Achievements
                </h2>

                <ul className="list-disc ml-6 mt-4 space-y-2">

                    {achievements.length ? (
                        achievements.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No achievements added.</li>
                    )}

                </ul>

            </section>

            {/* CERTIFICATIONS */}

            <section className="mt-8">

                <h2 className="text-xl font-bold text-blue-700 border-b pb-2">
                    Certifications
                </h2>

                <ul className="list-disc ml-6 mt-4 space-y-2">

                    {certifications.length ? (
                        certifications.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No certifications added.</li>
                    )}

                </ul>

            </section>

            {/* LANGUAGES */}

            <section className="mt-8">

                <h2 className="text-xl font-bold text-blue-700 border-b pb-2">
                    Languages
                </h2>

                <p className="mt-4">
                    {resume.languages || "Not specified"}
                </p>

            </section>

            {/* INTERESTS */}

            <section className="mt-8">

                <h2 className="text-xl font-bold text-blue-700 border-b pb-2">
                    Interests
                </h2>

                <p className="mt-4">
                    {resume.interests || "Not specified"}
                </p>

            </section>

        </div>
    );
}

export default ModernTemplate;