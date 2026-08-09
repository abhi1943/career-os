const jobSkills = {
    "Frontend Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Tailwind CSS",
        "Bootstrap",
        "Redux",
        "React Router",
        "REST API",
        "Axios",
        "Responsive Design",
        "Vite",
        "Git",
        "GitHub",
        "TypeScript"
    ],

    "Backend Developer": [
        "Java",
        "Spring Boot",
        "Hibernate",
        "REST API",
        "JWT",
        "MySQL",
        "Postman",
        "Git",
        "Maven",
        "JPA"
    ],

    "Full Stack Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Java",
        "Spring Boot",
        "MySQL",
        "REST API",
        "Git",
        "GitHub",
        "Bootstrap",
        "Tailwind CSS"
    ],

    "Software Engineer": [
        "Java",
        "Python",
        "JavaScript",
        "Git",
        "Data Structures",
        "Algorithms",
        "OOP",
        "SQL",
        "Problem Solving"
    ],

    "AI Engineer": [
        "Python",
        "Machine Learning",
        "Deep Learning",
        "TensorFlow",
        "PyTorch",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "OpenCV"
    ],

    "Data Scientist": [
        "Python",
        "Pandas",
        "NumPy",
        "Matplotlib",
        "Power BI",
        "Tableau",
        "Machine Learning",
        "SQL",
        "Statistics"
    ],

    "Cloud Engineer": [
        "AWS",
        "Azure",
        "Google Cloud",
        "Docker",
        "Kubernetes",
        "Linux",
        "Terraform",
        "Git",
        "CI/CD"
    ],

    "Cyber Security Engineer": [
        "Networking",
        "Linux",
        "Cyber Security",
        "Firewalls",
        "OWASP",
        "Wireshark",
        "Penetration Testing",
        "Python"
    ],

    "DevOps Engineer": [
        "Docker",
        "Kubernetes",
        "Jenkins",
        "GitHub Actions",
        "Linux",
        "AWS",
        "Terraform",
        "CI/CD"
    ],

    "QA Engineer": [
        "Manual Testing",
        "Automation Testing",
        "Selenium",
        "JUnit",
        "Postman",
        "API Testing",
        "Git"
    ]
};

export function checkATSKeywords(resumeData) {

    const required =
        jobSkills[resumeData.targetRole] || [];

    const userSkills = [

    resumeData.programming,

    resumeData.frameworks,

    resumeData.databases,

    resumeData.tools,

    resumeData.cloud,

    resumeData.softSkills,

    resumeData.summary,

    resumeData.targetRole,

    resumeData.certifications,

    resumeData.achievements,

    resumeData.projects
        .map(
            project =>
                `${project.technologies} ${project.description}`
        )
        .join(" ")

]
.join(" ")
.toLowerCase();

    const found = [];
    const missing = [];

    required.forEach((skill) => {

        if (userSkills.includes(skill.toLowerCase())) {
            found.push(skill);
        } else {
            missing.push(skill);
        }

    });

    const score =
        required.length === 0
            ? 0
            : Math.round(
                  (found.length / required.length) * 100
              );

    return {
        score,
        found,
        missing
    };
}