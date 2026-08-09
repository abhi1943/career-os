function ClassicTemplate({ resume, resumeRef }) {
    return (
        <div
            ref={resumeRef}
            className="bg-white border-4 border-gray-800 p-10 font-serif text-gray-900"
        >
            {/* Header */}

            <div className="text-center border-b-2 border-gray-800 pb-5">

                <h1 className="text-4xl font-bold uppercase tracking-wide">
                    {resume.name || "Your Name"}
                </h1>

                <p className="text-lg mt-2">
                    {resume.targetRole || "Target Job Role"}
                </p>

                <div className="text-sm mt-3 space-y-1">

                    <p>{resume.email}</p>

                    <p>{resume.phone}</p>

                    <p>{resume.location}</p>

                    <p>{resume.linkedin}</p>

                    <p>{resume.github}</p>

                    {resume.portfolio && (
                        <p>{resume.portfolio}</p>
                    )}

                </div>

            </div>

            {/* Professional Summary */}

            <div className="mt-8">

                <h2 className="text-xl font-bold uppercase border-b border-gray-800 pb-2">
                    Professional Summary
                </h2>

                <p className="mt-3 leading-7 text-justify">
                    {resume.summary || "Professional summary goes here."}
                </p>

            </div>

            {/* Education */}

            <div className="mt-8">

                <h2 className="text-xl font-bold uppercase border-b border-gray-800 pb-2">
                    Education
                </h2>

                <div className="mt-3">

                    <p className="font-bold">
                        {resume.degree}
                    </p>

                    <p>{resume.branch}</p>

                    <p>{resume.college}</p>

                    <p>CGPA: {resume.cgpa}</p>

                    <p>Graduation: {resume.graduationYear}</p>

                </div>

            </div>

            {/* Technical Skills */}

            <div className="mt-8">

                <h2 className="text-xl font-bold uppercase border-b border-gray-800 pb-2">
                    Technical Skills
                </h2>

                <div className="mt-3 space-y-2">

                    <p><strong>Programming:</strong> {resume.programming}</p>

                    <p><strong>Frameworks:</strong> {resume.frameworks}</p>

                    <p><strong>Databases:</strong> {resume.databases}</p>

                    <p><strong>Tools:</strong> {resume.tools}</p>

                    <p><strong>Cloud:</strong> {resume.cloud}</p>

                    <p><strong>Soft Skills:</strong> {resume.softSkills}</p>

                </div>

            </div>

            {/* Projects */}

            <div className="mt-8">

                <h2 className="text-xl font-bold uppercase border-b border-gray-800 pb-2">
                    Projects
                </h2>

                {resume.projects?.length ? (
                    <div className="space-y-5 mt-4">

                        {resume.projects.map((project, index) => (
                            <div key={index}>

                                <p className="font-bold">
                                    {project.title}
                                </p>

                                <p className="text-sm italic">
                                    Technologies: {project.technologies}
                                </p>

                                <p className="mt-2 whitespace-pre-line">
                                    {project.description}
                                </p>

                                {project.github && (
                                    <p className="text-sm mt-1">
                                        GitHub: {project.github}
                                    </p>
                                )}

                                {project.live && (
                                    <p className="text-sm">
                                        Live Demo: {project.live}
                                    </p>
                                )}

                            </div>
                        ))}

                    </div>
                ) : (
                    <p className="mt-3">No projects added.</p>
                )}

            </div>

            {/* Experience */}

            <div className="mt-8">

                <h2 className="text-xl font-bold uppercase border-b border-gray-800 pb-2">
                    Experience
                </h2>

                {resume.experience?.length ? (
                    <ul className="list-disc ml-6 mt-3 space-y-1">

                        {resume.experience.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}

                    </ul>
                ) : (
                    <p className="mt-3">No experience added.</p>
                )}

            </div>

            {/* Internships */}

            <div className="mt-8">

                <h2 className="text-xl font-bold uppercase border-b border-gray-800 pb-2">
                    Internships
                </h2>

                {resume.internships?.length ? (
                    <ul className="list-disc ml-6 mt-3 space-y-1">

                        {resume.internships.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}

                    </ul>
                ) : (
                    <p className="mt-3">No internship added.</p>
                )}

            </div>

            {/* Achievements */}

            <div className="mt-8">

                <h2 className="text-xl font-bold uppercase border-b border-gray-800 pb-2">
                    Achievements
                </h2>

                {resume.achievements?.length ? (
                    <ul className="list-disc ml-6 mt-3 space-y-1">

                        {resume.achievements.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}

                    </ul>
                ) : (
                    <p className="mt-3">No achievements added.</p>
                )}

            </div>

            {/* Certifications */}

            <div className="mt-8">

                <h2 className="text-xl font-bold uppercase border-b border-gray-800 pb-2">
                    Certifications
                </h2>

                {resume.certifications?.length ? (
                    <ul className="list-disc ml-6 mt-3 space-y-1">

                        {resume.certifications.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}

                    </ul>
                ) : (
                    <p className="mt-3">No certifications added.</p>
                )}

            </div>

            {/* Languages */}

            <div className="mt-8">

                <h2 className="text-xl font-bold uppercase border-b border-gray-800 pb-2">
                    Languages
                </h2>

                <p className="mt-3">
                    {resume.languages || "Not specified"}
                </p>

            </div>

            {/* Interests */}

            <div className="mt-8">

                <h2 className="text-xl font-bold uppercase border-b border-gray-800 pb-2">
                    Interests
                </h2>

                <p className="mt-3">
                    {resume.interests || "Not specified"}
                </p>

            </div>

        </div>
    );
}

export default ClassicTemplate;