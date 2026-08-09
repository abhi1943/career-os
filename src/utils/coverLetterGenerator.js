export function generateCoverLetter(resume, company) {
    return `Dear Hiring Manager,

I am excited to apply for the ${resume.targetRole} position at ${company}.

My experience with ${resume.programming}, ${resume.frameworks}, and ${resume.projects.length} projects makes me a strong candidate.

I look forward to discussing how I can contribute to your team.

Sincerely,

${resume.name}`;
}