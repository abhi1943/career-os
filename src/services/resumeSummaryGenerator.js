export function generateProfessionalSummary(resume) {
    const role = resume.targetRole || "Software Engineer";

    const skills = [
        resume.programming,
        resume.frameworks,
        resume.databases,
        resume.tools,
        resume.cloud
    ]
        .filter(Boolean)
        .join(", ");

    const projectCount = resume.projects?.length || 0;

    const experience =
        resume.experience?.length || 0;

    return `Highly motivated ${role} with ${
        experience
            ? `${experience} professional experience`
            : "strong academic knowledge"
    } and ${projectCount} completed software projects. Skilled in ${skills}. Passionate about developing scalable, user-friendly applications while continuously learning modern technologies and following industry best practices.`;
}