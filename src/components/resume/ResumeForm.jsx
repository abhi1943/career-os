import {
    generateSkills,
    generateInternship,
    generateExperience,
    generateAchievements,
} from "../../services/resumeAI";
import {
    improveProject,
    improveExperience,
    improveAchievement,
} from "../../services/bulletImprover";
import { generateProfessionalSummary } from "../../services/resumeSummaryGenerator";
function ResumeForm({ resumeData, setResumeData }) {
    const handleChange = (e) => {
        setResumeData({
            ...resumeData,
            [e.target.name]: e.target.value,
        });
    };

    const inputClass =
        "w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-3xl font-bold mb-8">
                Resume Details
            </h2>

            <div className="space-y-6">

                {/* Personal Information */}

                <h3 className="text-xl font-semibold text-blue-700">
                    Personal Information
                </h3>

                <input
                    className={inputClass}
                    name="name"
                    placeholder="Full Name"
                    value={resumeData.name}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="email"
                    placeholder="Email"
                    value={resumeData.email}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="phone"
                    placeholder="Phone Number"
                    value={resumeData.phone}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="location"
                    placeholder="Location"
                    value={resumeData.location}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="linkedin"
                    placeholder="LinkedIn Profile"
                    value={resumeData.linkedin}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="github"
                    placeholder="GitHub Profile"
                    value={resumeData.github}
                    onChange={handleChange}
                />
                <input
                    className={inputClass}
                    name="portfolio"
                    placeholder="Portfolio Website (Optional)"
                    value={resumeData.portfolio}
                    onChange={handleChange}
                /><h3 className="text-xl font-semibold text-blue-700">
                    Target Job Role
                </h3>

                <select
                    className={inputClass}
                    name="targetRole"
                    value={resumeData.targetRole}
                    onChange={handleChange}
                >
                    <option value="">Select Target Job</option>

                    <option>Software Engineer</option>

                    <option>Frontend Developer</option>

                    <option>Backend Developer</option>

                    <option>Full Stack Developer</option>

                    <option>AI Engineer</option>

                    <option>Data Scientist</option>

                    <option>Cloud Engineer</option>

                    <option>Cyber Security Engineer</option>

                    <option>DevOps Engineer</option>

                    <option>QA Engineer</option>
                </select>


                {/* Education */}

                <h3 className="text-xl font-semibold text-blue-700">
                    Education
                </h3>

                <input
                    className={inputClass}
                    name="college"
                    placeholder="College / University"
                    value={resumeData.college}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="degree"
                    placeholder="Degree"
                    value={resumeData.degree}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="branch"
                    placeholder="Branch / Specialization"
                    value={resumeData.branch}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="cgpa"
                    placeholder="CGPA"
                    value={resumeData.cgpa}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="graduationYear"
                    placeholder="Graduation Year"
                    value={resumeData.graduationYear}
                    onChange={handleChange}
                />

                {/* Career Objective */}

                <h3 className="text-xl font-semibold text-blue-700">
                    Professional Summary
                </h3>
                <div className="flex justify-end mb-2">
                    <button
                        type="button"
                        onClick={() =>
                            setResumeData({
                                ...resumeData,
                                summary: generateProfessionalSummary(resumeData),
                            })
                        }
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                        ✨ Generate AI summary
                    </button>
                </div>

                <textarea
                    className={inputClass}
                    rows={5}
                    name="summary"
                    placeholder="Professional Summary"
                    value={resumeData.summary}
                    onChange={handleChange}
                />

                {/* Skills */}

                <h3 className="text-xl font-semibold text-blue-700">
                    Technical Skills
                </h3>

                <div className="flex justify-end mb-2">

                    <button
                        type="button"
                        onClick={() => {
                            const skills = generateSkills(resumeData.targetRole);

                            setResumeData({

                                ...resumeData,

                                programming: skills.programming,

                                frameworks: skills.frameworks,

                                databases: skills.databases,

                                tools: skills.tools,

                                cloud: skills.cloud,

                                softSkills: skills.softSkills

                            });
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        ✨ Generate AI Skills
                    </button>

                </div>

                <input
                    className={inputClass}
                    name="programming"
                    placeholder="Programming Languages"
                    value={resumeData.programming}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="frameworks"
                    placeholder="Frameworks & Libraries"
                    value={resumeData.frameworks}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="databases"
                    placeholder="Databases"
                    value={resumeData.databases}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="tools"
                    placeholder="Developer Tools"
                    value={resumeData.tools}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="cloud"
                    placeholder="Cloud / DevOps"
                    value={resumeData.cloud}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="softSkills"
                    placeholder="Soft Skills"
                    value={resumeData.softSkills}
                    onChange={handleChange}
                />

                {/* Projects */}

                <h3 className="text-xl font-semibold text-blue-700">
                    Projects
                </h3>

                <input
                    className={inputClass}
                    name="projectTitle"
                    placeholder="Project Title"
                    value={resumeData.projectTitle}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="projectTech"
                    placeholder="Technologies Used (React, Spring Boot, MySQL)"
                    value={resumeData.projectTech}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="projectGithub"
                    placeholder="GitHub Repository"
                    value={resumeData.projectGithub}
                    onChange={handleChange}
                />

                <input
                    className={inputClass}
                    name="projectLive"
                    placeholder="Live Demo URL (Optional)"
                    value={resumeData.projectLive}
                    onChange={handleChange}
                />


                <div className="flex justify-end mb-2">

                    <button
                        type="button"
                        onClick={() =>
                            setResumeData({
                                ...resumeData,
                                projectDescription: improveProject(
                                    {
                                        title: resumeData.projectTitle,
                                        technologies: resumeData.projectTech,
                                    },
                                    resumeData.targetRole
                                ),
                            })
                        }
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                    >

                        ✨ Generate AI Description

                    </button>

                </div>

                <textarea
                    className={inputClass}
                    rows={6}
                    name="projectDescription"
                    placeholder="Project Description"
                    value={resumeData.projectDescription}
                    onChange={handleChange}
                />
                <button
                    type="button"
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700"
                    onClick={() => {

                        if (
                            !resumeData.projectTitle ||
                            !resumeData.projectTech ||
                            !resumeData.projectDescription
                        ) {
                            alert("Please fill Project Title, Technologies and Description.");
                            return;
                        }

                        const newProject = {
                            title: resumeData.projectTitle,
                            technologies: resumeData.projectTech,
                            github: resumeData.projectGithub,
                            live: resumeData.projectLive,
                            description: resumeData.projectDescription,
                        };

                        setResumeData({
                            ...resumeData,
                            projects: [...resumeData.projects, newProject],

                            projectTitle: "",
                            projectTech: "",
                            projectGithub: "",
                            projectLive: "",
                            projectDescription: "",
                        });

                    }}
                >

                    + Add Project

                </button>
                {resumeData.projects.length > 0 && (
                    <div className="mt-6">

                        <h4 className="font-semibold mb-3">
                            Added Projects
                        </h4>

                        <div className="space-y-3">

                            {resumeData.projects.map((project, index) => (

                                <div
                                    key={index}
                                    className="border rounded-xl p-4 bg-gray-50"
                                >

                                    <h5 className="font-bold">
                                        {project.title}
                                    </h5>

                                    <p className="text-sm text-gray-600">
                                        {project.technologies}
                                    </p>

                                    <button
                                        type="button"
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                        onClick={() => {
                                            setResumeData({
                                                ...resumeData,
                                                projects: resumeData.projects.filter((_, i) => i !== index),
                                            });
                                        }}
                                    >
                                        Delete
                                    </button>

                                </div>

                            ))}

                        </div>

                    </div>
                )}

                {/* {Internship} */}
                <h3 className="text-xl font-semibold text-blue-700">
                    Internship
                </h3>

                <div className="flex justify-end mb-2">

                    <button
                        type="button"
                        onClick={() =>
                            setResumeData({

                                ...resumeData,

                                internships: generateInternship(resumeData.targetRole)

                            })
                        }
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg"
                    >
                        ✨ Generate AI Internship
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            setResumeData({
                                ...resumeData,
                                internships: improveExperience(
                                    resumeData.internships
                                ),
                            })
                        }
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-2"
                    >
                        ✨ Improve Internship
                    </button>

                </div>

                <textarea
                    className={inputClass}
                    rows={5}
                    name="internships"
                    value={resumeData.internships}
                    onChange={handleChange}
                />

                {/* Experinece */}
                <h3 className="text-xl font-semibold text-blue-700">
                    Experience
                </h3>

                <div className="flex justify-end mb-2">

                    <button
                        type="button"
                        onClick={() =>
                            setResumeData({

                                ...resumeData,

                                experience: generateExperience(resumeData.targetRole)

                            })
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        ✨ Generate AI Experience
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            setResumeData({
                                ...resumeData,
                                experience: improveExperience(
                                    resumeData.experience
                                ),
                            })
                        }
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-2"
                    >
                        ✨ Improve Experience
                    </button>

                </div>

                <textarea
                    className={inputClass}
                    rows={5}
                    name="experience"
                    value={resumeData.experience}
                    onChange={handleChange}
                />
                {/* Achievements */}
                <h3 className="text-xl font-semibold text-blue-700">
                    Achievements
                </h3>

                <div className="flex justify-end mb-2">

                    <button
                        type="button"
                        onClick={() =>
                            setResumeData({

                                ...resumeData,

                                achievements: generateAchievements(resumeData.targetRole)

                            })
                        }
                        className="bg-pink-600 text-white px-4 py-2 rounded-lg"
                    >
                        ✨ Generate AI Achievements
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            setResumeData({
                                ...resumeData,
                                achievements: improveAchievement(
                                    resumeData.achievements
                                ),
                            })
                        }
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-2"
                    >
                        ✨ Improve Achievement
                    </button>

                </div>

                <textarea
                    className={inputClass}
                    rows={5}
                    name="achievements"
                    value={resumeData.achievements}
                    onChange={handleChange}
                />

                {/* Certifications */}

                <h3 className="text-xl font-semibold text-blue-700">
                    Certifications
                </h3>

                <textarea
                    className={inputClass}
                    rows={5}
                    name="certifications"
                    placeholder="One certification per line"
                    value={resumeData.certifications}
                    onChange={handleChange}
                />

            </div>

        </div>
    );
}

export default ResumeForm;