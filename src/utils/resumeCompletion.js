export function calculateResumeCompletion(resume) {

    const sections = [

        {
            name: "Personal Details",
            completed:
                !!(
                    resume.name &&
                    resume.email &&
                    resume.phone &&
                    resume.location
                )
        },

        {
            name: "Target Role",
            completed: !!resume.targetRole
        },

        {
            name: "Professional Summary",
            completed: !!resume.summary
        },

        {
            name: "Education",
            completed:
                !!(
                    resume.college &&
                    resume.degree &&
                    resume.branch
                )
        },

        {
            name: "Technical Skills",
            completed:
                !!(
                    resume.programming ||
                    resume.frameworks ||
                    resume.databases ||
                    resume.tools
                )
        },

        {
            name: "Projects",
            completed:
                resume.projects &&
                resume.projects.length > 0
        },

        {
            name: "Experience",
            completed:
                resume.experience &&
                resume.experience.length > 0
        },

        {
            name: "Internships",
            completed:
                resume.internships &&
                resume.internships.length > 0
        },

        {
            name: "Certifications",
            completed:
                resume.certifications &&
                resume.certifications.length > 0
        },

        {
            name: "Achievements",
            completed:
                resume.achievements &&
                resume.achievements.length > 0
        },

        {
            name: "Languages",
            completed: !!resume.languages
        },

        {
            name: "Interests",
            completed: !!resume.interests
        }

    ];

    const completed =
        sections.filter(section => section.completed).length;

    const percentage = Math.round(
        (completed / sections.length) * 100
    );

    return {

        percentage,

        completed,

        total: sections.length,

        sections

    };
}