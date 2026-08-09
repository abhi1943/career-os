export function generateCoverLetter(resume, company = "", position = "") {
    return `
Dear Hiring Manager,

I am excited to apply for the ${position || resume.targetRole} position ${company ? `at ${company}` : ""}.

I recently completed my ${resume.degree} in ${resume.branch} from ${resume.college}. During my academic journey, I developed strong technical skills in ${resume.programming}, ${resume.frameworks}, ${resume.databases}, and modern development tools.

I have built several projects demonstrating my ability to solve real-world problems while writing clean, scalable, and maintainable code. These projects strengthened my problem-solving skills, teamwork, and software development practices.

I am eager to contribute my knowledge while continuously learning from experienced professionals. I am confident that my technical background, enthusiasm, and willingness to grow make me a strong candidate for this role.

Thank you for considering my application. I look forward to discussing how I can contribute to your team.

Sincerely,

${resume.name}
`;
}