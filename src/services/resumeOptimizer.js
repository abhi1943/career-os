export function optimizeProject(project, role) {

    if (!project.title) return project;

    let extra = "";

    switch (role) {

        case "Frontend Developer":
            extra =
                "Developed responsive UI using reusable React components, optimized performance, integrated REST APIs, and improved user experience.";
            break;

        case "Backend Developer":
            extra =
                "Designed scalable REST APIs, optimized database queries, implemented authentication, and followed secure backend practices.";
            break;

        case "Full Stack Developer":
            extra =
                "Built end-to-end web applications with frontend, backend, authentication, APIs, and database integration.";
            break;

        case "AI Engineer":
            extra =
                "Implemented machine learning workflows, data preprocessing, model evaluation, and prediction pipelines.";
            break;

        default:
            extra =
                "Applied industry-standard software engineering practices and clean architecture.";
    }

    return {
        ...project,
        description:
            project.description +
            "\n\n• " +
            extra,
    };
}

export function optimizeResume(resume) {

    return `
Professional Summary
--------------------
${resume.summary}

Skills
--------------------
${resume.programming}
${resume.frameworks}
${resume.databases}
${resume.tools}

Projects
--------------------
${resume.projects
    .map(
        p =>
`• ${p.title}
${p.description}`
    )
    .join("\n\n")}

Suggestions
--------------------
✔ Use action verbs.

✔ Add measurable achievements.

✔ Include ATS keywords.

✔ Quantify project impact.

✔ Keep resume to one page.
`;
}