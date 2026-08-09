export function generateResume(data) {
    return {
        ...data,

        // Personal
        name: data.name?.trim() || "",
        email: data.email?.trim() || "",
        phone: data.phone?.trim() || "",
        location: data.location?.trim() || "",
        linkedin: data.linkedin?.trim() || "",
        github: data.github?.trim() || "",
        portfolio: data.portfolio?.trim() || "",
        targetRole: data.targetRole?.trim() || "",

        // Summary
        summary: data.summary?.trim() || "",

        // Education
        college: data.college?.trim() || "",
        degree: data.degree?.trim() || "",
        branch: data.branch?.trim() || "",
        cgpa: data.cgpa?.trim() || "",
        graduationYear: data.graduationYear?.trim() || "",

        // Skills
        skills: Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "")
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),

        // Experience
        experience: Array.isArray(data.experience)
            ? data.experience
            : (data.experience || "")
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),

        // Internship
        internships: Array.isArray(data.internships)
            ? data.internships
            : (data.internships || "")
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),

        // Projects
        projects: Array.isArray(data.projects)
            ? data.projects
            : [],

        // Certifications
        certifications: Array.isArray(data.certifications)
            ? data.certifications
            : (data.certifications || "")
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),

        // Achievements
        achievements: Array.isArray(data.achievements)
            ? data.achievements
            : (data.achievements || "")
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),

        // Languages
        languages: Array.isArray(data.languages)
            ? data.languages
            : (data.languages || "")
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),

        // Interests
        interests: Array.isArray(data.interests)
            ? data.interests
            : (data.interests || "")
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
    };
}