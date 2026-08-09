export function generateInterviewQuestions(resume) {
    const role = resume.targetRole || "Software Engineer";

    const hrQuestions = [
        "Tell me about yourself.",
        `Why do you want to become a ${role}?`,
        "What are your strengths?",
        "What is your biggest weakness?",
        "Describe a difficult situation and how you handled it.",
        "Where do you see yourself in 5 years?"
    ];

    const technicalQuestions = [];

    switch (role.toLowerCase()) {

        case "Frontend Developer":
            technicalQuestions.push(
                "Explain React Hooks.",
                "Difference between useState and useEffect.",
                "Virtual DOM vs Real DOM.",
                "What is JSX?",
                "Explain React Router."
            );
            break;

        case "Backend Developer":
            technicalQuestions.push(
                "Explain Spring Boot.",
                "Difference between REST and SOAP.",
                "Explain Dependency Injection.",
                "How does Hibernate work?",
                "JWT Authentication?"
            );
            break;

        case "Full Stack Developer":
            technicalQuestions.push(
                "Explain MERN architecture.",
                "REST API lifecycle.",
                "Authentication using JWT.",
                "Database normalization.",
                "React state management."
            );
            break;

        case "Data Scientist":
            technicalQuestions.push(
                "Difference between AI, ML and DL.",
                "What is Pandas?",
                "Explain Overfitting.",
                "Confusion Matrix.",
                "Random Forest."
            );
            break;

        default:
            technicalQuestions.push(
                "Explain OOP Concepts.",
                "Difference between Array and LinkedList.",
                "Explain REST APIs.",
                "What is Git?",
                "Explain SQL JOINs."
            );
    }

    const projectQuestions = [];

if (Array.isArray(resume.projects)) {
    resume.projects.forEach((project) => {
        const title =
            project.title ||
            project.projectTitle ||
            "your project";

        const tech =
            project.techStack ||
            project.technologies ||
            project.tech ||
            "the technologies used";

        projectQuestions.push(
            `Explain your project "${title}".`
        );

        projectQuestions.push(
            `What challenges did you face while building "${title}"?`
        );

        projectQuestions.push(
            `Why did you choose ${tech}?`
        );

        projectQuestions.push(
            `If you rebuild "${title}", what would you improve?`
        );
    });
}

    const codingQuestions = [
        "Reverse a String.",
        "Two Sum Problem.",
        "Palindrome Check.",
        "Remove Duplicate Elements.",
        "Find Maximum Element.",
        "FizzBuzz.",
        "Merge Two Sorted Arrays."
    ];

    return {
        hrQuestions,
        technicalQuestions,
        projectQuestions,
        codingQuestions,
    };
}