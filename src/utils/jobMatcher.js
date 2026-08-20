// ======================================================
// CareerOS Job Matcher
// ======================================================
// Purpose:
// - Calculate realistic job/profile compatibility
// - Match career goals
// - Match technical skills
// - Match education
// - Match experience
// - Detect job requirements safely
// - Provide matched/missing skills
// - Provide readable explanations
//
// Public API kept compatible with existing CareerOS files:
//
// calculateJobMatch()
// getMatchLabel()
// getMatchColor()
// getMatchExplanation()
// getMatchStrength()
// getSkillDetails()
// getJobSkills()
// getJobText()
// getStudentText()
// getCareerKeywords()
// normalizeExperience()
// ======================================================

// ======================================================
// NORMALIZE TEXT
// ======================================================

export function normalize(value = "") {
    return String(value)
        .toLowerCase()
        .replace(/[–—−]/g, "-")
        .replace(/[^\w+#.\-/ ]/g, " ")
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// ======================================================
// CONVERT VALUE TO ARRAY
// ======================================================

export function toArray(value) {
    if (Array.isArray(value)) {
        return value
            .filter(
                (item) =>
                    typeof item === "string" ||
                    typeof item === "number"
            )
            .map((item) => String(item).trim())
            .filter(Boolean);
    }

    if (typeof value === "string") {
        return value
            .split(/[,|;/]+/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

// ======================================================
// SKILL ALIASES
// ======================================================

const skillAliases = {
    html5: "html",
    css3: "css",

    "react.js": "react",
    reactjs: "react",

    "next.js": "next.js",
    nextjs: "next.js",

    "node.js": "node",
    nodejs: "node",

    "express.js": "express",
    expressjs: "express",

    "spring boot": "spring boot",
    springboot: "spring boot",

    powerbi: "power bi",
    "power-bi": "power bi",

    "scikit learn": "scikit-learn",
    sklearn: "scikit-learn",

    "machine-learning": "machine learning",

    "artificial-intelligence":
        "artificial intelligence",

    "generative-ai":
        "generative ai",

    genai: "generative ai",

    tailwindcss:
        "tailwind css",

    "rest apis":
        "rest api",

    "rest-api":
        "rest api",

    "ci cd":
        "ci/cd",

    "continuous integration":
        "ci/cd",

    "continuous deployment":
        "ci/cd",

    "github-action":
        "github actions",

    "github-actions":
        "github actions",
};

// ======================================================
// NORMALIZE SKILL
// ======================================================

function normalizeSkill(skill = "") {
    const normalized =
        normalize(skill);

    return (
        skillAliases[normalized] ||
        normalized
    );
}

// ======================================================
// KNOWN TECHNICAL SKILLS
// ======================================================

const knownSkills = [
    "html",
    "css",
    "javascript",
    "typescript",

    "react",
    "next.js",
    "vue",
    "angular",
    "tailwind",
    "tailwind css",
    "bootstrap",

    "java",
    "spring",
    "spring boot",
    "hibernate",
    "maven",
    "gradle",

    "python",
    "django",
    "flask",

    "node",
    "express",

    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "oracle",

    "git",
    "github",
    "gitlab",

    "docker",
    "kubernetes",

    "aws",
    "azure",
    "gcp",

    "rest api",
    "graphql",

    "pandas",
    "numpy",
    "matplotlib",
    "scikit-learn",

    "tensorflow",
    "pytorch",

    "power bi",
    "tableau",
    "excel",

    "machine learning",
    "deep learning",
    "artificial intelligence",
    "generative ai",

    "figma",
    "adobe xd",

    "android",
    "kotlin",
    "swift",
    "ios",

    "ci/cd",
    "github actions",
    "jenkins",
    "terraform",
    "ansible",
    "linux",
    "bash",
    "shell scripting",
    "jira",
    "artifactory",
];

// ======================================================
// SAFE TEXT MATCH
// ======================================================

export function containsTerm(
    text,
    term
) {
    const normalizedText =
        normalize(text);

    const normalizedTerm =
        normalize(term);

    if (
        !normalizedText ||
        !normalizedTerm
    ) {
        return false;
    }

    return normalizedText.includes(
        normalizedTerm
    );
}

// ======================================================
// WORD MATCH
// ======================================================

function containsWord(
    text,
    word
) {
    const normalizedText =
        normalize(text);

    const normalizedWord =
        normalize(word);

    if (
        !normalizedText ||
        !normalizedWord
    ) {
        return false;
    }

    const escaped =
        normalizedWord.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

    return new RegExp(
        `\\b${escaped}\\b`,
        "i"
    ).test(normalizedText);
}

// ======================================================
// SAFE SKILL MATCH
// ======================================================
//
// Important:
//
// Java !== JavaScript
// React !== Reactive
// SQL !== sequel
//
// Multi-word skills use phrase matching.
// Single-word skills use word boundaries.
// ======================================================

function containsSkill(
    text,
    skill
) {
    const normalizedText =
        normalize(text);

    const normalizedSkill =
        normalizeSkill(skill);

    if (
        !normalizedText ||
        !normalizedSkill
    ) {
        return false;
    }

    if (
        normalizedSkill.includes(" ")
    ) {
        return containsTerm(
            normalizedText,
            normalizedSkill
        );
    }

    return containsWord(
        normalizedText,
        normalizedSkill
    );
}

// ======================================================
// GET STUDENT SKILLS
// ======================================================

export function getStudentSkills(
    student
) {
    if (!student) {
        return [];
    }

    const allSkills = [
        ...toArray(student.skills),
        ...toArray(student.skillSet),
        ...toArray(student.technicalSkills),
        ...toArray(student.technical_skills),
        ...toArray(student.techSkills),
    ];

    const uniqueSkills = [];

    allSkills.forEach(
        (skill) => {
            const normalized =
                normalizeSkill(skill);

            if (!normalized) {
                return;
            }

            if (
                !uniqueSkills.includes(
                    normalized
                )
            ) {
                uniqueSkills.push(
                    normalized
                );
            }
        }
    );

    return uniqueSkills;
}

// ======================================================
// GET JOB ARRAY FIELDS
// ======================================================

function getJobArrayFields(job) {
    if (!job) {
        return [];
    }

    return [
        ...toArray(job.skills),
        ...toArray(job.requiredSkills),
        ...toArray(job.required_skills),
        ...toArray(job.technicalSkills),
        ...toArray(job.technical_skills),
        ...toArray(job.tags),
        ...toArray(job.keywords),
    ];
}

// ======================================================
// GET JOB TEXT
// ======================================================

export function getJobText(job) {
    if (!job) {
        return "";
    }

    const title =
        typeof job.title === "string"
            ? job.title
            : "";

    const description =
        typeof job.description === "string"
            ? job.description
            : "";

    const summary =
        typeof job.summary === "string"
            ? job.summary
            : "";

    const content =
        typeof job.content === "string"
            ? job.content
            : "";

    const requirements =
        typeof job.requirements === "string"
            ? job.requirements
            : "";

    const category =
        typeof job.category === "string"
            ? job.category
            : job.category?.label || "";

    const categoryTag =
        job.category?.tag || "";

    const company =
        typeof job.company === "string"
            ? job.company
            : job.company?.display_name ||
              job.company?.name ||
              "";

    const location =
        typeof job.location === "string"
            ? job.location
            : job.location?.display_name ||
              job.location?.name ||
              "";

    const experience =
        job.experience ||
        job.detected_experience ||
        job.experienceLevel ||
        job.experience_level ||
        "";

    const explicitSkills =
        getJobArrayFields(job).join(" ");

    return normalize(`
        ${title}
        ${description}
        ${summary}
        ${content}
        ${requirements}
        ${category}
        ${categoryTag}
        ${company}
        ${location}
        ${experience}
        ${explicitSkills}
    `);
}

// ======================================================
// GET JOB TITLE
// ======================================================

function getJobTitleText(job) {
    if (!job) {
        return "";
    }

    return normalize(
        [
            job.title,

            typeof job.category === "string"
                ? job.category
                : job.category?.label,

            job.category?.tag,

            job.role,
            job.position,
        ]
            .filter(Boolean)
            .join(" ")
    );
}

// ======================================================
// GET STUDENT TEXT
// ======================================================

export function getStudentText(
    student
) {
    if (!student) {
        return "";
    }

    return normalize(
        [
            student.dreamCareer,
            student.targetRole,
            student.specialization,
            student.education,
            student.interest,
            student.hobbies,
            student.experience,
            ...getStudentSkills(student),
        ]
            .filter(Boolean)
            .join(" ")
    );
}

// ======================================================
// CAREER ALIASES
// ======================================================

const careerAliases = {
    "react developer": [
        "react developer",
        "frontend developer",
        "front end developer",
        "ui developer",
        "javascript developer",
        "web developer",
    ],

    "frontend developer": [
        "frontend developer",
        "front end developer",
        "react developer",
        "ui developer",
        "javascript developer",
        "web developer",
    ],

    "front end developer": [
        "frontend developer",
        "front end developer",
        "react developer",
        "ui developer",
        "javascript developer",
        "web developer",
    ],

    "backend developer": [
        "backend developer",
        "back end developer",
        "node developer",
        "java developer",
        "spring boot developer",
        "backend",
    ],

    "full stack developer": [
        "full stack developer",
        "full-stack developer",
        "full stack",
        "mern",
        "mean",
        "web developer",
    ],

    "java developer": [
        "java developer",
        "spring boot developer",
        "backend developer",
    ],

    "python developer": [
        "python developer",
        "django developer",
        "flask developer",
        "backend developer",
    ],

    "data analyst": [
        "data analyst",
        "data analytics",
        "business analyst",
        "sql analyst",
    ],

    "data scientist": [
        "data scientist",
        "data science",
        "machine learning",
        "ml engineer",
    ],

    "machine learning": [
        "machine learning",
        "ml engineer",
        "machine learning engineer",
    ],

    "ai engineer": [
        "ai engineer",
        "artificial intelligence engineer",
        "machine learning engineer",
        "deep learning engineer",
        "generative ai",
    ],

    "software engineer": [
        "software engineer",
        "software development engineer",
        "software developer",
        "sde",
    ],

    "software developer": [
        "software developer",
        "software engineer",
        "software development engineer",
        "sde",
    ],

    "web developer": [
        "web developer",
        "frontend developer",
        "front end developer",
        "backend developer",
        "full stack developer",
    ],

    "devops engineer": [
        "devops engineer",
        "devops",
        "cloud engineer",
    ],

    "cloud engineer": [
        "cloud engineer",
        "aws engineer",
        "azure engineer",
        "gcp engineer",
        "devops engineer",
    ],

    cybersecurity: [
        "cybersecurity",
        "cyber security",
        "information security",
        "security engineer",
    ],

    "ui ux designer": [
        "ui ux",
        "ui designer",
        "ux designer",
        "product designer",
    ],

    "mobile developer": [
        "mobile developer",
        "android developer",
        "ios developer",
    ],

    "android developer": [
        "android developer",
        "android",
    ],

    "ios developer": [
        "ios developer",
        "ios",
    ],
};

// ======================================================
// CAREER KEYWORDS
// ======================================================

export function getCareerKeywords(
    career
) {
    const normalizedCareer =
        normalize(career);

    if (!normalizedCareer) {
        return [];
    }

    return (
        careerAliases[
            normalizedCareer
        ] || [normalizedCareer]
    );
}

// ======================================================
// GET JOB SKILLS
// ======================================================

export function getJobSkills(
    job
) {
    if (!job) {
        return [];
    }

    const jobText =
        getJobText(job);

    const explicitSkills =
        getJobArrayFields(job);

    const detectedSkills =
        knownSkills.filter(
            (skill) =>
                containsSkill(
                    jobText,
                    skill
                )
        );

    const combined = [
        ...explicitSkills,
        ...detectedSkills,
    ];

    const unique = [];

    combined.forEach(
        (skill) => {
            const normalized =
                normalizeSkill(skill);

            if (!normalized) {
                return;
            }

            // Ignore obvious non-skill values.
            if (
                normalized.length < 2
            ) {
                return;
            }

            if (
                !unique.includes(
                    normalized
                )
            ) {
                unique.push(
                    normalized
                );
            }
        }
    );

    return unique;
}

// ======================================================
// SKILL EQUIVALENCE
// ======================================================

function skillsMatch(
    studentSkill,
    jobSkill
) {
    const student =
        normalizeSkill(
            studentSkill
        );

    const job =
        normalizeSkill(
            jobSkill
        );

    if (!student || !job) {
        return false;
    }

    if (student === job) {
        return true;
    }

    const equivalentGroups = [
        ["html", "html5"],
        ["css", "css3"],
        ["react", "react.js"],
        ["node", "node.js"],
        ["express", "express.js"],
        ["power bi", "powerbi"],
        ["scikit-learn", "sklearn"],
        ["rest api", "rest apis"],
        ["generative ai", "genai"],
    ];

    return equivalentGroups.some(
        (group) =>
            group.includes(student) &&
            group.includes(job)
    );
}

// ======================================================
// CAREER MATCH
// ======================================================

function getCareerMatch(
    job,
    student
) {
    const career =
        student?.dreamCareer ||
        student?.targetRole ||
        student?.specialization ||
        "";

    if (!career) {
        return 50;
    }

    const careerText =
        normalize(career);

    const jobTitle =
        getJobTitleText(job);

    const jobText =
        getJobText(job);

    if (!careerText) {
        return 50;
    }

    // Exact title match.
    if (
        containsTerm(
            jobTitle,
            careerText
        )
    ) {
        return 100;
    }

    const keywords =
        getCareerKeywords(career);

    if (!keywords.length) {
        return 0;
    }

    // Strong title match.
    const titleMatches =
        keywords.filter(
            (keyword) =>
                containsTerm(
                    jobTitle,
                    keyword
                )
        );

    if (
        titleMatches.length > 0
    ) {
        return Math.min(
            95,
            65 +
                titleMatches.length * 10
        );
    }

    // Description/category match.
    const descriptionMatches =
        keywords.filter(
            (keyword) =>
                containsTerm(
                    jobText,
                    keyword
                )
        );

    if (
        descriptionMatches.length === 0
    ) {
        return 0;
    }

    return Math.min(
        70,
        40 +
            descriptionMatches.length *
                5
    );
}

// ======================================================
// SKILL MATCH
// ======================================================

function getSkillMatch(
    job,
    student
) {
    const studentSkills =
        getStudentSkills(student);

    const jobSkills =
        getJobSkills(job);

    if (
        studentSkills.length === 0
    ) {
        return 40;
    }

    if (
        jobSkills.length === 0
    ) {
        // Unknown skill requirements should
        // not be treated as a strong match.
        return 50;
    }

    const matchedJobSkills =
        jobSkills.filter(
            (jobSkill) =>
                studentSkills.some(
                    (studentSkill) =>
                        skillsMatch(
                            studentSkill,
                            jobSkill
                        )
                )
        );

    const requiredSkillMatch =
        (matchedJobSkills.length /
            jobSkills.length) *
        100;

    const matchedStudentSkills =
        studentSkills.filter(
            (studentSkill) =>
                jobSkills.some(
                    (jobSkill) =>
                        skillsMatch(
                            studentSkill,
                            jobSkill
                        )
                )
        );

    const profileSkillMatch =
        (matchedStudentSkills.length /
            studentSkills.length) *
        100;

    const finalSkillMatch =
        requiredSkillMatch * 0.75 +
        profileSkillMatch * 0.25;

    return Math.round(
        Math.min(
            100,
            Math.max(
                0,
                finalSkillMatch
            )
        )
    );
}

// ======================================================
// SKILL DETAILS
// ======================================================

export function getSkillDetails(
    job,
    student
) {
    const originalStudentSkills = [
        ...toArray(student?.skills),
        ...toArray(student?.skillSet),
        ...toArray(student?.technicalSkills),
        ...toArray(student?.technical_skills),
        ...toArray(student?.techSkills),
    ];

    const studentSkills =
        getStudentSkills(student);

    const jobSkills =
        getJobSkills(job);

    const matchedSkills = [];
    const unmatchedStudentSkills = [];

    originalStudentSkills.forEach(
        (originalSkill) => {
            const normalized =
                normalizeSkill(
                    originalSkill
                );

            if (!normalized) {
                return;
            }

            const matched =
                jobSkills.some(
                    (jobSkill) =>
                        skillsMatch(
                            normalized,
                            jobSkill
                        )
                );

            if (matched) {
                if (
                    !matchedSkills.includes(
                        originalSkill
                    )
                ) {
                    matchedSkills.push(
                        originalSkill
                    );
                }
            } else {
                if (
                    !unmatchedStudentSkills.includes(
                        originalSkill
                    )
                ) {
                    unmatchedStudentSkills.push(
                        originalSkill
                    );
                }
            }
        }
    );

    const missingSkills =
        jobSkills.filter(
            (jobSkill) =>
                !studentSkills.some(
                    (studentSkill) =>
                        skillsMatch(
                            studentSkill,
                            jobSkill
                        )
                )
        );

    return {
        matchedSkills,
        missingSkills,
        unmatchedStudentSkills,
    };
}

// ======================================================
// EDUCATION NORMALIZATION
// ======================================================

function normalizeEducation(
    value
) {
    const text =
        normalize(value);

    if (!text) {
        return "";
    }

    if (
        text.includes("b tech") ||
        text.includes("btech") ||
        text.includes("engineering") ||
        text.includes("b e")
    ) {
        return "engineering";
    }

    if (
        text.includes("degree") ||
        text.includes("bachelor") ||
        text.includes("graduate")
    ) {
        return "degree";
    }

    if (
        text.includes("diploma") ||
        text.includes("polytechnic")
    ) {
        return "diploma";
    }

    if (
        text.includes("intermediate") ||
        text.includes("12th") ||
        text.includes("higher secondary")
    ) {
        return "intermediate";
    }

    if (
        text.includes("10th") ||
        text.includes("ssc") ||
        text.includes("secondary")
    ) {
        return "10th";
    }

    return text;
}

// ======================================================
// EDUCATION MATCH
// ======================================================

function getEducationMatch(
    job,
    student
) {
    const education =
        normalizeEducation(
            student?.education
        );

    if (!education) {
        return 50;
    }

    const jobText =
        getJobText(job);

    const educationMap = {
        engineering: [
            "b.tech",
            "btech",
            "b.e",
            "b e",
            "engineering",
            "computer science",
            "bachelor",
            "degree",
        ],

        degree: [
            "degree",
            "graduate",
            "bachelor",
            "engineering",
            "b.tech",
            "btech",
        ],

        diploma: [
            "diploma",
            "polytechnic",
        ],

        intermediate: [
            "intermediate",
            "12th",
            "higher secondary",
        ],

        "10th": [
            "10th",
            "secondary",
            "ssc",
        ],
    };

    const keywords =
        educationMap[education] ||
        [];

    if (!keywords.length) {
        return 50;
    }

    const explicitEducationMatch =
        keywords.some(
            (keyword) =>
                containsTerm(
                    jobText,
                    keyword
                )
        );

    // No recognizable education requirement.
    if (!explicitEducationMatch) {
        return 75;
    }

    // If the job contains a matching education
    // keyword, give a strong score.
    return 100;
}

// ======================================================
// CATEGORY / ROLE MATCH
// ======================================================

function getCategoryMatch(
    job,
    student
) {
    const specialization =
        student?.specialization ||
        student?.targetRole ||
        student?.dreamCareer ||
        "";

    if (!specialization) {
        return 50;
    }

    const jobTitle =
        getJobTitleText(job);

    const specializationText =
        normalize(
            specialization
        );

    if (!specializationText) {
        return 50;
    }

    if (
        containsTerm(
            jobTitle,
            specializationText
        )
    ) {
        return 100;
    }

    const careerKeywords =
        getCareerKeywords(
            specialization
        );

    const keywordMatch =
        careerKeywords.some(
            (keyword) =>
                containsTerm(
                    jobTitle,
                    keyword
                )
        );

    if (keywordMatch) {
        return 90;
    }

    const words =
        specializationText
            .split(" ")
            .filter(
                (word) =>
                    word.length >= 3
            );

    if (!words.length) {
        return 50;
    }

    const matched =
        words.filter(
            (word) =>
                containsWord(
                    jobTitle,
                    word
                )
        );

    if (
        matched.length ===
        words.length
    ) {
        return 85;
    }

    if (
        matched.length === 0
    ) {
        return 20;
    }

    return Math.round(
        (matched.length /
            words.length) *
            70
    );
}

// ======================================================
// EXPERIENCE NORMALIZATION
// ======================================================

export function normalizeExperience(
    value
) {
    const text =
        normalize(value);

    if (!text) {
        return "";
    }

    if (
        text.includes("fresher") ||
        text.includes("freshers") ||
        text.includes("entry level") ||
        text.includes("trainee") ||
        text.includes("0 years")
    ) {
        return "0";
    }

    if (
        /\b0\s*-\s*1\b/.test(text)
    ) {
        return "0-1";
    }

    if (
        /\b1\s*-\s*2\b/.test(text)
    ) {
        return "1-2";
    }

    if (
        /\b1\s*-\s*3\b/.test(text)
    ) {
        return "1-3";
    }

    if (
        /\b2\s*-\s*4\b/.test(text)
    ) {
        return "2-4";
    }

    if (
        /\b3\s*-\s*5\b/.test(text)
    ) {
        return "3-5";
    }

    if (
        /\b3\s*-\s*6\b/.test(text)
    ) {
        return "3-6";
    }

    if (
        /\b4\s*-\s*6\b/.test(text)
    ) {
        return "4-6";
    }

    if (
        /\b5\s*-\s*9\b/.test(text)
    ) {
        return "5-9";
    }

    if (
        text.includes("senior") ||
        text.includes("lead") ||
        text.includes("principal") ||
        text.includes("staff") ||
        text.includes("5+")
    ) {
        return "5+";
    }

    const yearsMatch =
        text.match(
            /(\d+)\s*(?:years?|yrs?)/
        );

    if (yearsMatch) {
        return yearsMatch[1];
    }

    return "";
}

// ======================================================
// GET NUMERIC EXPERIENCE
// ======================================================

function getExperienceValue(
    experience
) {
    if (!experience) {
        return null;
    }

    if (
        experience === "5+"
    ) {
        return 6;
    }

    if (
        experience.includes("-")
    ) {
        const parts =
            experience
                .split("-")
                .map(Number);

        if (
            parts.length === 2 &&
            Number.isFinite(parts[0]) &&
            Number.isFinite(parts[1])
        ) {
            return (
                (parts[0] +
                    parts[1]) /
                2
            );
        }
    }

    const numeric =
        Number(experience);

    return Number.isFinite(
        numeric
    )
        ? numeric
        : null;
}

// ======================================================
// EXPERIENCE MATCH
// ======================================================

function getExperienceMatch(
    job,
    student
) {
    const studentExperience =
        normalizeExperience(
            student?.experience ||
                student?.experienceLevel ||
                student?.yearsOfExperience ||
                ""
        );

    const jobExperience =
        normalizeExperience(
            job?.detected_experience ||
                job?.experience ||
                job?.experienceLevel ||
                job?.experience_level ||
                ""
        );

    if (
        !studentExperience ||
        !jobExperience
    ) {
        return 75;
    }

    const studentYears =
        getExperienceValue(
            studentExperience
        );

    const jobYears =
        getExperienceValue(
            jobExperience
        );

    if (
        studentYears === null ||
        jobYears === null
    ) {
        return 75;
    }

    if (
        studentYears === 0 &&
        jobYears <= 1
    ) {
        return 100;
    }

    const difference =
        jobYears -
        studentYears;

    if (difference <= 0) {
        return 100;
    }

    if (difference <= 1) {
        return 80;
    }

    if (difference <= 2) {
        return 60;
    }

    if (difference <= 3) {
        return 40;
    }

    return 20;
}

// ======================================================
// CALCULATE JOB MATCH
// ======================================================
//
// Career       35%
// Skills       30%
// Education    15%
// Role         10%
// Experience   10%
//
// Total        100%
// ======================================================

export function calculateJobMatch(
    job,
    student
) {
    if (!job || !student) {
        return {
            score: 0,

            careerMatch: 0,
            skillMatch: 0,
            educationMatch: 0,
            categoryMatch: 0,
            experienceMatch: 0,

            matchedSkills: [],
            missingSkills: [],
            unmatchedStudentSkills: [],

            label: "Low Match",

            summary:
                "Unable to calculate a job match.",
        };
    }

    const careerMatch =
        getCareerMatch(
            job,
            student
        );

    const skillMatch =
        getSkillMatch(
            job,
            student
        );

    const educationMatch =
        getEducationMatch(
            job,
            student
        );

    const categoryMatch =
        getCategoryMatch(
            job,
            student
        );

    const experienceMatch =
        getExperienceMatch(
            job,
            student
        );

    const skillDetails =
        getSkillDetails(
            job,
            student
        );

    const score =
        Math.round(
            careerMatch * 0.35 +
                skillMatch * 0.30 +
                educationMatch * 0.15 +
                categoryMatch * 0.10 +
                experienceMatch * 0.10
        );

    return {
        score,

        careerMatch,
        skillMatch,
        educationMatch,
        categoryMatch,
        experienceMatch,

        matchedSkills:
            skillDetails.matchedSkills,

        missingSkills:
            skillDetails.missingSkills,

        unmatchedStudentSkills:
            skillDetails.unmatchedStudentSkills,

        label:
            getMatchLabel(score),

        summary:
            getMatchSummary(score),
    };
}

// ======================================================
// MATCH LABEL
// ======================================================

export function getMatchLabel(
    score
) {
    const numericScore =
        Number(score) || 0;

    if (
        numericScore >= 85
    ) {
        return "Excellent Match";
    }

    if (
        numericScore >= 70
    ) {
        return "Strong Match";
    }

    if (
        numericScore >= 50
    ) {
        return "Good Match";
    }

    if (
        numericScore >= 30
    ) {
        return "Partial Match";
    }

    return "Low Match";
}

// ======================================================
// MATCH COLOR
// ======================================================

export function getMatchColor(
    score
) {
    const numericScore =
        Number(score) || 0;

    if (
        numericScore >= 85
    ) {
        return "green";
    }

    if (
        numericScore >= 70
    ) {
        return "blue";
    }

    if (
        numericScore >= 50
    ) {
        return "yellow";
    }

    return "red";
}

// ======================================================
// MATCH SUMMARY
// ======================================================

function getMatchSummary(
    score
) {
    if (score >= 85) {
        return "This job is an excellent match for your CareerOS profile.";
    }

    if (score >= 70) {
        return "This job strongly matches your career profile.";
    }

    if (score >= 50) {
        return "This job is a reasonable match for your profile.";
    }

    if (score >= 30) {
        return "This job partially matches your profile but may require additional skills or experience.";
    }

    return "This job may require significant additional skills, education or experience.";
}

// ======================================================
// MATCH EXPLANATION
// ======================================================

export function getMatchExplanation(
    job,
    student
) {
    const match =
        calculateJobMatch(
            job,
            student
        );

    const reasons = [];

    if (
        match.careerMatch >= 85
    ) {
        reasons.push(
            "Your career goal closely matches this role."
        );
    } else if (
        match.careerMatch >= 60
    ) {
        reasons.push(
            "The role is related to your career goal."
        );
    } else {
        reasons.push(
            "The role is different from your primary career goal."
        );
    }

    if (
        match.skillMatch >= 80
    ) {
        reasons.push(
            "Most of your skills are relevant to this job."
        );
    } else if (
        match.skillMatch >= 50
    ) {
        reasons.push(
            "Several of your skills are relevant to this job."
        );
    } else {
        reasons.push(
            "You may need additional technical skills for this role."
        );
    }

    if (
        match.educationMatch >= 90
    ) {
        reasons.push(
            "Your education appears to meet the job requirements."
        );
    } else if (
        match.educationMatch >= 60
    ) {
        reasons.push(
            "The job does not clearly conflict with your education."
        );
    } else {
        reasons.push(
            "Check the education requirements before applying."
        );
    }

    if (
        match.experienceMatch >= 90
    ) {
        reasons.push(
            "Your experience level matches the role."
        );
    } else if (
        match.experienceMatch >= 60
    ) {
        reasons.push(
            "Your experience level is reasonably close to the role."
        );
    } else {
        reasons.push(
            "The required experience may be higher than your current level."
        );
    }

    if (
        match.missingSkills.length > 0
    ) {
        reasons.push(
            `Consider improving: ${match.missingSkills
                .slice(0, 5)
                .join(", ")}.`
        );
    }

    return {
        ...match,

        label:
            getMatchLabel(
                match.score
            ),

        summary:
            getMatchSummary(
                match.score
            ),

        reasons,
    };
}

// ======================================================
// MATCH STRENGTH
// ======================================================

export function getMatchStrength(
    score
) {
    const numericScore =
        Number(score) || 0;

    if (
        numericScore >= 85
    ) {
        return "excellent";
    }

    if (
        numericScore >= 70
    ) {
        return "strong";
    }

    if (
        numericScore >= 50
    ) {
        return "good";
    }

    if (
        numericScore >= 30
    ) {
        return "partial";
    }

    return "low";
}