export function analyzeResume(resume) {
    let score = 100;

    const strengths = [];
    const suggestions = [];
    const missing = [];

    let keywordScore = 100;
    let formattingScore = 100;
    let projectScore = 100;
    let experienceScore = 100;

    // ==========================
    // Personal Information
    // ==========================

    if (!resume.name) {
        score -= 5;
        missing.push("Full Name");
    } else {
        strengths.push("Name added");
    }

    if (!resume.email) {
        score -= 5;
        missing.push("Email");
    }

    if (!resume.phone) {
        score -= 5;
        missing.push("Phone Number");
    }

    if (!resume.location) {
        score -= 3;
        suggestions.push("Add your location.");
    }

    if (!resume.linkedin) {
        score -= 4;
        suggestions.push("Add LinkedIn profile.");
    } else {
        strengths.push("LinkedIn profile included");
    }

    if (!resume.github) {
        score -= 4;
        suggestions.push("Add GitHub profile.");
    } else {
        strengths.push("GitHub profile included");
    }

    if (!resume.portfolio) {
        suggestions.push("Portfolio website will improve your profile.");
    }

    // ==========================
    // Target Role
    // ==========================

    if (!resume.targetRole) {
        score -= 5;
        missing.push("Target Job Role");
    } else {
        strengths.push("Target role selected");
    }

    // ==========================
    // Summary
    // ==========================

    if (!resume.summary || resume.summary.length < 120) {
        score -= 10;
        formattingScore -= 10;

        suggestions.push(
            "Write a stronger ATS-friendly professional summary."
        );
    } else {
        strengths.push("Professional summary looks good");
    }

    // ==========================
    // Education
    // ==========================

    if (
        !resume.degree ||
        !resume.college ||
        !resume.branch ||
        !resume.cgpa
    ) {
        score -= 10;
        missing.push("Complete Education Details");
    } else {
        strengths.push("Education section completed");
    }

    // ==========================
    // Skills
    // ==========================

    const skills = Array.isArray(resume.skills)
        ? resume.skills
        : (resume.skills || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);

    if (skills.length < 8) {
        score -= 12;
        keywordScore -= 15;

        suggestions.push(
            "Include at least 8 technical skills."
        );
    } else {
        strengths.push("Strong technical skills");
    }

    // ==========================
    // Projects
    // ==========================

    const projects = Array.isArray(resume.projects)
        ? resume.projects
        : [];

    if (projects.length < 2) {
        score -= 10;
        projectScore -= 20;

        suggestions.push(
            "Include at least two projects."
        );
    } else {
        strengths.push("Projects section completed");
    }

    // ==========================
    // Experience
    // ==========================

    const experience = Array.isArray(resume.experience)
        ? resume.experience
        : (resume.experience || "")
              .split("\n")
              .filter(Boolean);

    if (experience.length === 0) {
        experienceScore -= 20;

        suggestions.push(
            "Add work experience if available."
        );
    } else {
        strengths.push("Experience added");
    }

    // ==========================
    // Internship
    // ==========================

    const internships = Array.isArray(resume.internships)
        ? resume.internships
        : (resume.internships || "")
              .split("\n")
              .filter(Boolean);

    if (internships.length === 0) {
        suggestions.push(
            "Internship experience will improve ATS score."
        );
    }

    // ==========================
    // Certifications
    // ==========================

    const certs = Array.isArray(resume.certifications)
        ? resume.certifications
        : (resume.certifications || "")
              .split("\n")
              .filter(Boolean);

    if (certs.length === 0) {
        score -= 5;

        suggestions.push(
            "Add relevant certifications."
        );
    } else {
        strengths.push("Certifications included");
    }

    // ==========================
    // Achievements
    // ==========================

    const achievements = Array.isArray(resume.achievements)
        ? resume.achievements
        : (resume.achievements || "")
              .split("\n")
              .filter(Boolean);

    if (achievements.length === 0) {
        suggestions.push(
            "Add measurable achievements."
        );
    }

    // ==========================
    // Languages
    // ==========================

    const languages = Array.isArray(resume.languages)
        ? resume.languages
        : (resume.languages || "")
              .split(",")
              .filter(Boolean);

    if (languages.length === 0) {
        suggestions.push(
            "Mention languages known."
        );
    }

    // ==========================
    // ATS Keywords
    // ==========================

    const roleKeywords = {
        "Frontend Developer": [
            "React",
            "JavaScript",
            "HTML",
            "CSS",
            "Tailwind",
            "Bootstrap",
            "Redux",
            "REST API",
        ],

        "Backend Developer": [
            "Java",
            "Spring Boot",
            "Node.js",
            "SQL",
            "REST API",
        ],

        "Full Stack Developer": [
            "React",
            "Java",
            "Spring Boot",
            "SQL",
            "REST API",
        ],

        "AI Engineer": [
            "Python",
            "TensorFlow",
            "Machine Learning",
            "Deep Learning",
            "NLP",
        ],

        "Data Scientist": [
            "Python",
            "Pandas",
            "NumPy",
            "SQL",
            "Machine Learning",
            "Power BI",
        ],

        "Cloud Engineer": [
            "AWS",
            "Docker",
            "Kubernetes",
            "Linux",
            "CI/CD",
        ],
    };

    const required = roleKeywords[resume.targetRole] || [];

    required.forEach((keyword) => {
        if (
            !skills.some((skill) =>
                skill.toLowerCase().includes(keyword.toLowerCase())
            )
        ) {
            keywordScore -= 5;
            missing.push(keyword);
        }
    });

    score = Math.max(0, Math.min(100, score));

    keywordScore = Math.max(0, keywordScore);
    formattingScore = Math.max(0, formattingScore);
    projectScore = Math.max(0, projectScore);
    experienceScore = Math.max(0, experienceScore);

    return {
        score,
        keywordScore,
        formattingScore,
        projectScore,
        experienceScore,
        strengths,
        suggestions,
        missing,
    };
}