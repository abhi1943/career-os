
export function generatePortfolio(resume) {
    return {
        hero: {
            name: resume.name || "",
            role: resume.targetRole || "",
            summary: resume.summary || "",
        },

        about: {
            email: resume.email || "",
            phone: resume.phone || "",
            location: resume.location || "",
            linkedin: resume.linkedin || "",
            github: resume.github || "",
        },

        skills: [
            ...(resume.skills || []),
        ],

        projects: [
            ...(resume.projects || []),
        ],

        experience: [
            ...(resume.experience || []),
        ],

        education: {
            college: resume.college || "",
            degree: resume.degree || "",
            branch: resume.branch || "",
            cgpa: resume.cgpa || "",
            startYear: resume.startYear || "",
            endYear: resume.endYear || "",
        },

        certifications: [
            ...(resume.certifications || []),
        ],

        achievements: [
            ...(resume.achievements || []),
        ],

        languages: [
            ...(resume.languages || []),
        ],

        careerObjective:
            resume.careerObjective || "",
    };
}

