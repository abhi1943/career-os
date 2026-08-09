const stopWords = [
    "with",
    "from",
    "have",
    "has",
    "will",
    "your",
    "their",
    "must",
    "should",
    "looking",
    "experience",
    "candidate",
    "developer",
    "engineer",
    "knowledge",
    "skills",
    "using",
    "ability",
    "good",
    "strong",
    "team",
    "work",
    "and",
    "the",
    "for",
    "are",
    "our",
    "you",
    "this",
    "that",
    "into",
    "able",
    "years",
    "year"
];

export function analyzeJobDescription(jobDescription, resumeData) {

    if (!jobDescription || !resumeData) {
        return null;
    }

    // Combine resume content

    const resumeText = [

        resumeData.targetRole,

        resumeData.summary,

        resumeData.programming,

        resumeData.frameworks,

        resumeData.databases,

        resumeData.tools,

        resumeData.cloud,

        resumeData.softSkills,

        resumeData.certifications,

        resumeData.achievements,

        resumeData.languages,

        resumeData.interests,

        resumeData.linkedin,

        resumeData.github,

        resumeData.portfolio,

        ...(resumeData.projects || []).map(project => `
            ${project.title || ""}
            ${project.technologies || ""}
            ${project.description || ""}
        `)

    ]
        .join(" ")
        .toLowerCase();

    // Extract keywords from Job Description

    const keywords = jobDescription
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(word => word.length > 2);

    // Remove duplicates + stop words

    const uniqueKeywords = [
        ...new Set(
            keywords.filter(
                word => !stopWords.includes(word)
            )
        )
    ];

    const matched = [];
    const missing = [];

    uniqueKeywords.forEach(keyword => {

        const regex = new RegExp(`\\b${keyword}\\b`, "i");

        if (regex.test(resumeText)) {

            matched.push(keyword);

        } else {

            missing.push(keyword);

        }

    });

    matched.sort();

    missing.sort();

    const score =
        uniqueKeywords.length === 0
            ? 0
            : Math.round(
                  (matched.length / uniqueKeywords.length) * 100
              );

    return {

        score,

        totalKeywords: uniqueKeywords.length,

        matched,

        missing

    };

}