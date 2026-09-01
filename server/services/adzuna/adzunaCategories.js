const {
    fetchAdzunaPage,
} = require("./adzunaApi");

// ======================================================
// CONSTANTS
// ======================================================

const ADZUNA_RESULTS_PER_PAGE = 50;
const CATEGORY_MAX_PAGES = 5;
const QUERY_CONCURRENCY = 1;

// ======================================================
// ADZUNA CATEGORIES
// ======================================================

const ADZUNA_CATEGORIES = {
    IT: "it-jobs",

    HEALTHCARE:
        "healthcare-nursing-jobs",

    ENGINEERING:
        "engineering-jobs",

    FINANCE:
        "accounting-finance-jobs",

    SALES:
        "sales-jobs",

    TEACHING:
        "teaching-jobs",

    ADMIN:
        "admin-jobs",

    CUSTOMER_SERVICE:
        "customer-services-jobs",

    RETAIL:
        "retail-jobs",

    LOGISTICS:
        "logistics-warehouse-jobs",

    MANUFACTURING:
        "manufacturing-jobs",

    CONSTRUCTION:
        "trade-construction-jobs",

    SCIENTIFIC:
        "scientific-qa-jobs",

    SOCIAL_WORK:
        "social-work-jobs",

    LEGAL:
        "legal-jobs",

    HOSPITALITY:
        "hospitality-catering-jobs",

    TRAVEL:
        "travel-jobs",
};

// ======================================================
// CAREEROS JOB CATEGORIES
// ======================================================

const CAREEROS_JOB_CATEGORIES = {
    IT: {
        key: "it",
        label: "IT",
        queries: [
            "software engineer",
            "software developer",
            "frontend developer",
            "backend developer",
            "full stack developer",
            "Java developer",
            "Python developer",
            "data analyst",
            "data scientist",
            "DevOps engineer",
            "cloud engineer",
            "cybersecurity",
            "UI UX designer",
            "mobile developer",
        ],
    },

    NON_IT: {
        key: "non-it",
        label: "Non-IT",
        queries: [
            "business operations",
            "operations executive",
            "office executive",
            "administrative executive",
            "customer service executive",
            "customer support",
            "retail executive",
            "logistics executive",
            "warehouse executive",
            "field executive",
        ],
    },

    MEDICAL: {
        key: "medical",
        label: "Medical",
        queries: [
            "MBBS",
            "doctor",
            "medical officer",
            "nurse",
            "pharmacist",
            "BDS",
            "dentist",
            "physiotherapist",
            "medical laboratory technician",
            "radiology technician",
            "clinical research associate",
            "medical coder",
            "medical representative",
        ],
    },

    ENGINEERING: {
        key: "engineering",
        label: "Engineering",
        queries: [
            "civil engineer",
            "electrical engineer",
            "electronics engineer",
            "chemical engineer",
            "industrial engineer",
            "automotive engineer",
            "structural engineer",
            "engineering graduate",
        ],
    },

    MECHANICAL: {
        key: "mechanical",
        label: "Mechanical",
        queries: [
            "mechanical engineer",
            "mechanical design engineer",
            "production engineer",
            "manufacturing engineer",
            "maintenance engineer",
            "automotive engineer",
            "CAD engineer",
            "CNC engineer",
        ],
    },

    EDUCATION: {
        key: "education",
        label: "Education",
        queries: [
            "teacher",
            "school teacher",
            "lecturer",
            "professor",
            "faculty",
            "teaching",
            "tutor",
            "academic coordinator",
        ],
    },

    FINANCE_ACCOUNTING: {
        key: "finance-accounting",
        label: "Finance & Accounting",
        queries: [
            "accountant",
            "accounting",
            "finance executive",
            "financial analyst",
            "banking",
            "auditor",
            "tax accountant",
            "accounts executive",
        ],
    },

    GOVERNMENT: {
        key: "government",
        label: "Government",
        queries: [
            "government jobs",
            "government employee",
            "public sector",
            "public administration",
            "government officer",
            "civil services",
        ],
    },

    SALES_MARKETING: {
        key: "sales-marketing",
        label: "Sales & Marketing",
        queries: [
            "sales executive",
            "sales manager",
            "business development",
            "marketing executive",
            "digital marketing",
            "marketing manager",
            "business development executive",
        ],
    },

    HR: {
        key: "hr",
        label: "HR",
        queries: [
            "HR executive",
            "human resources",
            "HR recruiter",
            "recruiter",
            "recruitment",
            "talent acquisition",
            "HR manager",
        ],
    },

    DESIGN: {
        key: "design",
        label: "Design",
        queries: [
            "graphic designer",
            "UI UX designer",
            "UX designer",
            "UI designer",
            "web designer",
            "product designer",
            "creative designer",
        ],
    },

    SKILLED_TRADES: {
        key: "skilled-trades",
        label: "Skilled Trades",
        queries: [
            "electrician",
            "plumber",
            "welder",
            "carpenter",
            "technician",
            "machine operator",
            "CNC operator",
            "maintenance technician",
            "fitter",
        ],
    },

    OTHER: {
        key: "other",
        label: "Other",
        queries: [
            "general jobs",
            "office jobs",
            "field jobs",
            "support executive",
            "operations",
            "assistant",
        ],
    },
};

// ======================================================
// CATEGORY SEARCH CONFIGURATION
// ======================================================

const CAREEROS_CATEGORY_SEARCH_CONFIG = {
    it: {
        queries:
            CAREEROS_JOB_CATEGORIES.IT.queries,
        adzunaCategory: null,
    },

    "non-it": {
        queries:
            CAREEROS_JOB_CATEGORIES.NON_IT
                .queries,
        adzunaCategory: null,
    },

    medical: {
        queries: [
            "nurse",
            "staff nurse",
            "registered nurse",
            "doctor",
            "medical officer",
            "MBBS",
            "pharmacist",
            "dentist",
            "BDS",
            "physiotherapist",
            "lab technician",
            "radiology technician",
            "medical coder",
            "medical representative",
        ],
        adzunaCategory: null,
    },

    engineering: {
        queries:
            CAREEROS_JOB_CATEGORIES
                .ENGINEERING.queries,
        adzunaCategory:
            ADZUNA_CATEGORIES.ENGINEERING,
    },

    mechanical: {
        queries:
            CAREEROS_JOB_CATEGORIES
                .MECHANICAL.queries,
        adzunaCategory:
            ADZUNA_CATEGORIES.ENGINEERING,
    },

    education: {
        queries:
            CAREEROS_JOB_CATEGORIES
                .EDUCATION.queries,
        adzunaCategory:
            ADZUNA_CATEGORIES.TEACHING,
    },

    "finance-accounting": {
        queries:
            CAREEROS_JOB_CATEGORIES
                .FINANCE_ACCOUNTING.queries,
        adzunaCategory:
            ADZUNA_CATEGORIES.FINANCE,
    },

    government: {
        queries:
            CAREEROS_JOB_CATEGORIES
                .GOVERNMENT.queries,
        adzunaCategory: null,
    },

    "sales-marketing": {
        queries:
            CAREEROS_JOB_CATEGORIES
                .SALES_MARKETING.queries,
        adzunaCategory:
            ADZUNA_CATEGORIES.SALES,
    },

    hr: {
        queries:
            CAREEROS_JOB_CATEGORIES.HR
                .queries,
        adzunaCategory:
            ADZUNA_CATEGORIES.ADMIN,
    },

    design: {
        queries:
            CAREEROS_JOB_CATEGORIES.DESIGN
                .queries,
        adzunaCategory: null,
    },

    "skilled-trades": {
        queries:
            CAREEROS_JOB_CATEGORIES
                .SKILLED_TRADES.queries,
        adzunaCategory: null,
    },

    other: {
        queries:
            CAREEROS_JOB_CATEGORIES.OTHER
                .queries,
        adzunaCategory: null,
    },
};

// ======================================================
// MEDICAL QUERY MAP
// ======================================================


const MEDICAL_KEYWORDS = [
    "mbbs",
    "bds",
    "bams",
    "bhms",
    "bpt",
    "doctor",
    "doctors",
    "physician",
    "medical",
    "medicine",
    "healthcare",
    "health care",
    "hospital",
    "hospitals",
    "clinical",
    "clinic",
    "nurse",
    "nursing",
    "pharmacist",
    "pharmacy",
    "dentist",
    "dental",
    "surgeon",
    "surgery",
    "cardiology",
    "cardiologist",
    "neurology",
    "neurologist",
    "oncology",
    "oncologist",
    "pediatrics",
    "pediatrician",
    "dermatology",
    "dermatologist",
    "psychiatry",
    "psychiatrist",
    "gynecology",
    "gynecologist",
    "obstetrics",
    "radiology",
    "radiologist",
    "radiographer",
    "anesthetist",
    "anesthesiologist",
    "physiotherapy",
    "physiotherapist",
    "rehabilitation",
    "laboratory",
    "lab technician",
    "medical lab",
    "pathology",
    "pathologist",
    "optometry",
    "optometrist",
    "pharmaceutical",
    "pharma",
    "clinical research",
    "clinical trial",
    "medical coding",
    "medical coder",
    "medical billing",
    "medical representative",
    "public health",
    "epidemiology",
    "hospital administrator",
    "healthcare administrator",
    "healthcare management",
    "hospital management",
];

// ======================================================
// CATEGORY HELPERS
// ======================================================

function normalizeCareerOSCategory(
    category = ""
) {
    return String(category)
        .trim()
        .toLowerCase();
}

function getCareerOSCategoryConfig(
    category = ""
) {
    const normalizedCategory =
        normalizeCareerOSCategory(
            category
        );

    if (!normalizedCategory) {
        return null;
    }

    return (
        CAREEROS_CATEGORY_SEARCH_CONFIG[
            normalizedCategory
        ] || null
    );
}

function getCareerOSCategoryQueries(
    category = ""
) {
    const config =
        getCareerOSCategoryConfig(
            category
        );

    return Array.isArray(
        config?.queries
    )
        ? config.queries
        : [];
}

function getCareerOSCategoryAdzunaCategory(
    category = ""
) {
    const config =
        getCareerOSCategoryConfig(
            category
        );

    return (
        config?.adzunaCategory ||
        null
    );
}

// ======================================================
// QUERY CATEGORY
// ======================================================

function getQueryCategory(
    query = ""
) {
    const value = String(query)
        .trim()
        .toLowerCase();

    if (
        MEDICAL_KEYWORDS.some(
            (keyword) =>
                value === keyword ||
                value.includes(keyword)
        )
    ) {
        return ADZUNA_CATEGORIES.HEALTHCARE;
    }

    const itKeywords = [
        "software",
        "developer",
        "development",
        "programmer",
        "programming",
        "react",
        "javascript",
        "java",
        "python",
        "node",
        "backend",
        "frontend",
        "full stack",
        "web developer",
        "devops",
        "cloud",
        "cyber",
        "data analyst",
        "data scientist",
        "machine learning",
        "artificial intelligence",
        "ai engineer",
        "android",
        "ios",
        "mobile developer",
        "ui ux",
    ];

    if (
        itKeywords.some(
            (keyword) =>
                value.includes(keyword)
        )
    ) {
        return ADZUNA_CATEGORIES.IT;
    }

    const engineeringKeywords = [
        "engineer",
        "engineering",
        "mechanical",
        "electrical",
        "electronics",
        "civil",
        "chemical",
        "automotive",
        "industrial",
    ];

    if (
        engineeringKeywords.some(
            (keyword) =>
                value.includes(keyword)
        )
    ) {
        return ADZUNA_CATEGORIES.ENGINEERING;
    }

    const financeKeywords = [
        "accountant",
        "accounting",
        "finance",
        "financial",
        "banking",
        "bank",
        "audit",
        "auditor",
    ];

    if (
        financeKeywords.some(
            (keyword) =>
                value.includes(keyword)
        )
    ) {
        return ADZUNA_CATEGORIES.FINANCE;
    }

    const teachingKeywords = [
        "teacher",
        "teaching",
        "lecturer",
        "professor",
        "education",
        "tutor",
        "school teacher",
        "college teacher",
    ];

    if (
        teachingKeywords.some(
            (keyword) =>
                value.includes(keyword)
        )
    ) {
        return ADZUNA_CATEGORIES.TEACHING;
    }

    const salesKeywords = [
        "sales",
        "marketing",
        "business development",
        "sales executive",
        "sales manager",
    ];

    if (
        salesKeywords.some(
            (keyword) =>
                value.includes(keyword)
        )
    ) {
        return ADZUNA_CATEGORIES.SALES;
    }

    if (
        value.includes(
            "customer service"
        ) ||
        value.includes(
            "customer support"
        )
    ) {
        return ADZUNA_CATEGORIES.CUSTOMER_SERVICE;
    }

    if (
        value === "hr" ||
        value.includes(
            "human resource"
        ) ||
        value.includes("recruiter") ||
        value.includes("recruitment")
    ) {
        return ADZUNA_CATEGORIES.ADMIN;
    }

    if (
        value.includes("logistics") ||
        value.includes("warehouse") ||
        value.includes("supply chain")
    ) {
        return ADZUNA_CATEGORIES.LOGISTICS;
    }

    if (
        value.includes("construction") ||
        value.includes("civil engineer")
    ) {
        return ADZUNA_CATEGORIES.CONSTRUCTION;
    }

    return null;
}

// ======================================================
// JOB TEXT
// ======================================================

function getJobText(job) {
    if (!job) {
        return "";
    }

    const location =
        typeof job.location === "string"
            ? job.location
            : job.location?.display_name ||
              "";

    const category =
        typeof job.category === "string"
            ? job.category
            : job.category?.label || "";

    const company =
        typeof job.company === "string"
            ? job.company
            : job.company?.display_name ||
              "";

    return `
        ${job.title || ""}
        ${job.description || ""}
        ${location}
        ${category}
        ${company}
        ${job.contract_time || ""}
        ${job.contract_type || ""}
        ${job.contractTime || ""}
        ${job.contractType || ""}
        ${job.work_mode || ""}
        ${job.workMode || ""}
        ${job.remote || ""}
        ${job.job_type || ""}
        ${job.jobType || ""}
        ${job.experience || ""}
        ${job.skills || ""}
    `.toLowerCase();
}

// ======================================================
// EXPERIENCE
// ======================================================

function getExperienceLevel(job) {
    const text = getJobText(job);

    const fresherKeywords = [
        "fresher",
        "freshers",
        "entry level",
        "entry-level",
        "recent graduate",
        "recent graduates",
        "new graduate",
        "graduate trainee",
        "campus hiring",
        "campus",
        "trainee",
        "intern",
        "internship",
    ];

    if (
        fresherKeywords.some(
            (keyword) =>
                text.includes(keyword)
        )
    ) {
        return "Fresher / 0 years";
    }

    const seniorKeywords = [
        "principal",
        "staff engineer",
        "staff developer",
        "technical lead",
        "tech lead",
        "team lead",
        "lead developer",
        "lead engineer",
        "engineering manager",
        "engineering director",
        "director of engineering",
        "director",
        "architect",
        "solution architect",
        "technical architect",
        "head of",
        "vice president",
        "vp ",
    ];

    if (
        seniorKeywords.some(
            (keyword) =>
                text.includes(keyword)
        )
    ) {
        return "5+ years";
    }

    const rangePatterns = [
        {
            regex: /\b(?:8|9|10|11|12|13|14|15|16|17|18|19|20)\+?\s*years?\b/i,
            result: "5+ years",
        },
        {
            regex: /\b5\s*(?:-|–|—|to)\s*(?:6|7|8|9|10)\s*years?\b/i,
            result: "5+ years",
        },
        {
            regex: /\b(?:6|7)\s*(?:-|–|—|to)\s*(?:8|9|10)\s*years?\b/i,
            result: "5+ years",
        },
        {
            regex: /\b(?:3|4)\s*(?:-|–|—|to)\s*(?:5|6|7)\s*years?\b/i,
            result: "3–5 years",
        },
        {
            regex: /\b2\s*(?:-|–|—|to)\s*4\s*years?\b/i,
            result: "1–3 years",
        },
        {
            regex: /\b1\s*(?:-|–|—|to)\s*3\s*years?\b/i,
            result: "1–3 years",
        },
        {
            regex: /\b0\s*(?:-|–|—|to)\s*1\s*years?\b/i,
            result: "0–1 years",
        },
        {
            regex: /\b1\s*(?:-|–|—|to)\s*2\s*years?\b/i,
            result: "0–1 years",
        },
    ];

    for (const pattern of rangePatterns) {
        if (pattern.regex.test(text)) {
            return pattern.result;
        }
    }

    if (
        /\b(?:8|9|10|11|12|13|14|15|16|17|18|19|20)\+?\s*years?\b/i.test(
            text
        )
    ) {
        return "5+ years";
    }

    if (
        /\b(?:5|6|7)\+?\s*years?\b/i.test(
            text
        )
    ) {
        return "5+ years";
    }

    if (
        /\b(?:3|4)\+?\s*years?\b/i.test(
            text
        )
    ) {
        return "3–5 years";
    }

    if (
        /\b(?:1|2)\+?\s*years?\b/i.test(
            text
        )
    ) {
        return "1–3 years";
    }

    if (
        /\b0\s*years?\b/i.test(text)
    ) {
        return "Fresher / 0 years";
    }

    return "Any Experience";
}

// ======================================================
// WORK MODE
// ======================================================

function getWorkMode(job) {
    if (!job) {
        return "Not Specified";
    }

    const explicitMode = String(
        job.work_mode ||
        job.workMode ||
        job.remote_type ||
        job.remoteType ||
        ""
    ).toLowerCase();

    if (
        explicitMode.includes(
            "remote"
        ) ||
        explicitMode === "wfh"
    ) {
        return "Remote";
    }

    if (
        explicitMode.includes(
            "hybrid"
        )
    ) {
        return "Hybrid";
    }

    if (
        explicitMode.includes(
            "onsite"
        ) ||
        explicitMode.includes(
            "on-site"
        ) ||
        explicitMode === "wfo"
    ) {
        return "On-site";
    }

    const text = getJobText(job);

    if (
        /\b(remote|fully remote|remote-first|remote first|work from home|work-from-home|wfh|anywhere)\b/i.test(
            text
        )
    ) {
        return "Remote";
    }

    if (
        /\b(hybrid|hybrid work|hybrid role|work from office and home|office and home)\b/i.test(
            text
        )
    ) {
        return "Hybrid";
    }

    if (
        /\b(on-site|onsite|on site|office-based|office based|work from office|wfo)\b/i.test(
            text
        )
    ) {
        return "On-site";
    }

    return "Not Specified";
}

// ======================================================
// JOB TYPE
// ======================================================

function getJobType(job) {
    if (!job) {
        return "Any Type";
    }

    const explicitType = String(
        job.job_type ||
        job.jobType ||
        job.contract_type ||
        job.contractType ||
        job.contract_time ||
        job.contractTime ||
        ""
    ).toLowerCase();

    if (
        /\b(intern|internship)\b/i.test(
            explicitType
        )
    ) {
        return "Internship";
    }

    if (
        /\b(contract|contractor|contractual|fixed-term|fixed term)\b/i.test(
            explicitType
        )
    ) {
        return "Contract";
    }

    if (
        /\b(part-time|part time|parttime)\b/i.test(
            explicitType
        )
    ) {
        return "Part-time";
    }

    if (
        /\b(full-time|full time|fulltime|permanent)\b/i.test(
            explicitType
        )
    ) {
        return "Full-time";
    }

    const text = getJobText(job);

    if (
        /\b(intern|internship|trainee)\b/i.test(
            text
        )
    ) {
        return "Internship";
    }

    if (
        /\b(contract|contractor|contractual|fixed-term|fixed term)\b/i.test(
            text
        )
    ) {
        return "Contract";
    }

    if (
        /\b(part-time|part time|parttime)\b/i.test(
            text
        )
    ) {
        return "Part-time";
    }

    if (
        /\b(full-time|full time|fulltime|permanent)\b/i.test(
            text
        ) ||
        text.includes("full_time")
    ) {
        return "Full-time";
    }

    return "Any Type";
}

// ======================================================
// SALARY
// ======================================================

function getSalaryRange(job) {
    if (!job) {
        return {
            min: 0,
            max: 0,
        };
    }

    const salaryMin =
        Number(job.salary_min) || 0;

    const salaryMax =
        Number(job.salary_max) || 0;

    const min = Math.max(
        0,
        salaryMin
    );

    const max = Math.max(
        0,
        salaryMax
    );

    return {
        min,
        max: max || min,
    };
}

function getSalaryLevel(job) {
    const {
        min,
        max,
    } = getSalaryRange(job);

    if (!min && !max) {
        return "Any Salary";
    }

    const salary =
        Math.max(
            min || 0,
            max || 0
        );

    if (salary <= 300000) {
        return "₹0–3 LPA";
    }

    if (salary <= 500000) {
        return "₹3–5 LPA";
    }

    if (salary <= 1000000) {
        return "₹5–10 LPA";
    }

    if (salary <= 2000000) {
        return "₹10–20 LPA";
    }

    return "₹20+ LPA";
}

function matchesSalary(
    job,
    salaryFilter
) {
    if (
        !salaryFilter ||
        salaryFilter === "Any Salary"
    ) {
        return true;
    }

    const {
        min,
        max,
    } = getSalaryRange(job);

    if (!min && !max) {
        return true;
    }

    const lower =
        min || max;

    const upper =
        max || min;

    switch (salaryFilter) {
        case "₹0–3 LPA":
            return lower <= 300000;

        case "₹3–5 LPA":
            return (
                upper >= 300000 &&
                lower <= 500000
            );

        case "₹5–10 LPA":
            return (
                upper >= 500000 &&
                lower <= 1000000
            );

        case "₹10–20 LPA":
            return (
                upper >= 1000000 &&
                lower <= 2000000
            );

        case "₹20+ LPA":
            return upper >= 2000000;

        default:
            return true;
    }
}

// ======================================================
// FILTERS
// ======================================================

function hasActiveFilters({
    experience,
    jobType,
    workMode,
    salary,
}) {
    return (
        (
            experience &&
            experience !==
                "Any Experience"
        ) ||
        (
            jobType &&
            jobType !== "Any Type"
        ) ||
        (
            workMode &&
            workMode !== "Any"
        ) ||
        (
            salary &&
            salary !== "Any Salary"
        )
    );
}

function jobMatchesFilters(
    job,
    {
        experience,
        jobType,
        workMode,
        salary,
    }
) {
    if (
        experience &&
        experience !==
            "Any Experience"
    ) {
        const detectedExperience =
            getExperienceLevel(job);

        if (
            detectedExperience !==
                "Any Experience" &&
            detectedExperience !==
                experience
        ) {
            return false;
        }
    }

    if (
        jobType &&
        jobType !== "Any Type"
    ) {
        const detectedJobType =
            getJobType(job);

        if (
            detectedJobType !==
                "Any Type" &&
            detectedJobType !==
                jobType
        ) {
            return false;
        }
    }

    if (
        workMode &&
        workMode !== "Any"
    ) {
        const detectedWorkMode =
            getWorkMode(job);

        if (
            detectedWorkMode !==
                "Not Specified" &&
            detectedWorkMode !==
                workMode
        ) {
            return false;
        }
    }

    return matchesSalary(
        job,
        salary
    );
}

// ======================================================
// ENRICH
// ======================================================

function enrichJob(job) {
    return {
        ...job,

        detected_experience:
            getExperienceLevel(job),

        detected_work_mode:
            getWorkMode(job),

        detected_job_type:
            getJobType(job),

        detected_salary:
            getSalaryLevel(job),
    };
}

// ======================================================
// UNIQUE JOB ID
// ======================================================

function getUniqueJobId(job) {
    if (!job) {
        return "";
    }

    const fallbackId = [
        job.title || "",

        typeof job.company === "string"
            ? job.company
            : job.company?.display_name ||
              "",

        typeof job.location === "string"
            ? job.location
            : job.location?.display_name ||
              "",
    ]
        .join("-")
        .toLowerCase()
        .replace(/\s+/g, "-");

    return String(
        job.id ||
        job.redirect_url ||
        fallbackId
    );
}

function removeDuplicateJobs(
    jobs
) {
    if (!Array.isArray(jobs)) {
        return [];
    }

    const seen = new Set();
    const unique = [];

    for (const job of jobs) {
        const id =
            getUniqueJobId(job);

        if (!id) {
            continue;
        }

        if (seen.has(id)) {
            continue;
        }

        seen.add(id);
        unique.push(job);
    }

    return unique;
}

// ======================================================
// SEARCH SPECIFIC CATEGORY
// ======================================================

async function searchSpecificCategory({
    appId,
    appKey,
    query,
    location,
    page,
    category,
}) {
    try {
        return await fetchAdzunaPage({
            appId,
            appKey,
            query,
            location,
            page,
            category,
        });
    } catch (
        categoryError
    ) {
        console.error(
            `❌ Category search failed for "${query}" using "${category}":`,
            categoryError?.response
                ?.data ||
                categoryError?.message
        );

        

        return fetchAdzunaPage({
            appId,
            appKey,
            query,
            location,
            page,
            category: null,
        });
    }
}

// ======================================================
// SEARCH CAREEROS CATEGORY
// ======================================================

async function searchCareerOSCategory({
    appId,
    appKey,
    category,
    location,
}) {
    const queries = [
        ...new Set(
            getCareerOSCategoryQueries(
                category
            )
                .map(
                    (query) =>
                        String(query)
                            .trim()
                            .toLowerCase()
                )
                .filter(Boolean)
        ),
    ];

    if (!queries.length) {
        return {
            results: [],
            count: 0,
            total: 0,
            filtered_total: 0,
            filtered_count: 0,
            jobs_scanned: 0,
            filtered_pages_scanned: 1,
            has_more: false,
            careeros_category:
                category,
            category_queries: [],
            category_queries_successful: 0,
        };
    }

    const configuredAdzunaCategory =
        getCareerOSCategoryAdzunaCategory(
            category
        );

    const allJobs = [];
    const categorySeenJobIds =
        new Set();

    let successfulQueries = 0;

    const processQuery =
        async (categoryQuery) => {
            try {
                const queryJobs = [];
                let querySuccessful =
                    false;

                for (
                    let currentPage = 1;
                    currentPage <=
                    CATEGORY_MAX_PAGES;
                    currentPage++
                ) {
                    let data;

                    try {
                        data =
                            await fetchAdzunaPage({
                                appId,
                                appKey,
                                query:
                                    categoryQuery,
                                location,
                                page:
                                    currentPage,
                                category:
                                    null,
                            });
                    } catch (
                        keywordError
                    ) {
                        if (
                            configuredAdzunaCategory
                        ) {
                            try {
                                data =
                                    await fetchAdzunaPage({
                                        appId,
                                        appKey,
                                        query:
                                            categoryQuery,
                                        location,
                                        page:
                                            currentPage,
                                        category:
                                            configuredAdzunaCategory,
                                    });
                            } catch (
                                categoryError
                            ) {
                                console.error(
                                    `❌ Category fallback failed for "${categoryQuery}" page ${currentPage}:`,
                                    categoryError?.response
                                        ?.data ||
                                        categoryError?.message
                                );

                                break;
                            }
                        } else {
                            console.error(
                                `❌ Keyword search failed for "${categoryQuery}" page ${currentPage}:`,
                                keywordError?.response
                                    ?.data ||
                                    keywordError?.message
                            );

                            break;
                        }
                    }

                    const results =
                        Array.isArray(
                            data?.results
                        )
                            ? data.results
                            : [];

                    if (
                        results.length ===
                        0
                    ) {
                        break;
                    }

                    querySuccessful =
                        true;

                    let newJobsOnPage =
                        0;

                    for (
                        const job of results
                    ) {
                        const jobId =
                            getUniqueJobId(
                                job
                            );

                        if (!jobId) {
                            continue;
                        }

                        if (
                            categorySeenJobIds.has(
                                jobId
                            )
                        ) {
                            continue;
                        }

                        categorySeenJobIds.add(
                            jobId
                        );

                        queryJobs.push({
                            ...job,

                            careeros_category:
                                category,

                            careeros_search_query:
                                categoryQuery,

                            careeros_search_page:
                                currentPage,
                        });

                        newJobsOnPage++;
                    }

                    if (
                        results.length <
                        ADZUNA_RESULTS_PER_PAGE
                    ) {
                        break;
                    }

                    if (
                        newJobsOnPage ===
                        0
                    ) {
                        break;
                    }
                }

                if (
                    querySuccessful
                ) {
                    successfulQueries++;
                }

                

                return queryJobs;
            } catch (error) {
                console.error(
                    `❌ CareerOS category query failed: "${categoryQuery}"`,
                    error?.response
                        ?.data ||
                        error?.message
                );

                return [];
            }
        };

    for (
        let i = 0;
        i < queries.length;
        i += QUERY_CONCURRENCY
    ) {
        const batch =
            queries.slice(
                i,
                i +
                    QUERY_CONCURRENCY
            );

        const batchResults =
            await Promise.all(
                batch.map(
                    processQuery
                )
            );

        for (
            const results of
                batchResults
        ) {
            allJobs.push(
                ...results
            );
        }
    }

    const uniqueJobs =
        removeDuplicateJobs(
            allJobs
        );

    const jobs =
        uniqueJobs.map(
            enrichJob
        );

    return {
        results: jobs,
        count: jobs.length,
        total: jobs.length,
        filtered_total:
            jobs.length,
        filtered_count:
            jobs.length,
        jobs_scanned:
            jobs.length,
        filtered_pages_scanned: 1,
        has_more:
            queries.length > 0 &&
            successfulQueries > 0,
        careeros_category:
            category,
        category_queries:
            queries,
        category_queries_successful:
            successfulQueries,
    };
}

module.exports = {
    ADZUNA_CATEGORIES,
    CAREEROS_JOB_CATEGORIES,
    CAREEROS_CATEGORY_SEARCH_CONFIG,
    normalizeCareerOSCategory,
    getCareerOSCategoryConfig,
    getCareerOSCategoryQueries,
    getCareerOSCategoryAdzunaCategory,
    getQueryCategory,
    getExperienceLevel,
    getWorkMode,
    getJobType,
    getSalaryRange,
    getSalaryLevel,
    matchesSalary,
    hasActiveFilters,
    jobMatchesFilters,
    enrichJob,
    getUniqueJobId,
    removeDuplicateJobs,
    searchSpecificCategory,
    searchCareerOSCategory,
};