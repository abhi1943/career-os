
export function generatePortfolio(resume) {

    return {

        hero: {

            name: resume.name,

            role: resume.targetRole,

            summary: resume.summary

        },

        about: {

            email: resume.email,

            phone: resume.phone,

            location: resume.location,

            linkedin: resume.linkedin,

            github: resume.github

        },

        skills: [

            ...(resume.skills || [])

        ],

        projects: [

            ...(resume.projects || [])

        ],

        education: {

            college: resume.college,

            degree: resume.degree,

            branch: resume.branch,

            cgpa: resume.cgpa

        },

        experience: [

            ...(resume.experience || [])

        ],

        // ======================================================
        // CAREER OBJECTIVE
        // ======================================================

        careerObjective:
            resume.careerObjective || "",

        // ======================================================
        // CERTIFICATIONS
        // ======================================================

        certifications: [

            ...(resume.certifications || [])

        ],

        // ======================================================
        // ACHIEVEMENTS
        // ======================================================

        achievements: [

            ...(resume.achievements || [])

        ],

        // ======================================================
        // LANGUAGES
        // ======================================================

        languages: [

            ...(resume.languages || [])

        ]

    };

}
