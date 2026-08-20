const axios = require("axios");
const dns = require("dns");
const https = require("https");

// ======================================================
// NETWORK CONFIGURATION
// ======================================================

dns.setDefaultResultOrder("ipv4first");

const adzunaHttpsAgent = new https.Agent({
    family: 4,
    keepAlive: true,
});

// ======================================================
// CONSTANTS
// ======================================================

const ADZUNA_RESULTS_PER_PAGE = 50;

const MAX_FILTER_PAGES = 5;

const MAX_REQUESTED_PAGE = 100;

const ADZUNA_TIMEOUT = 60000;

const ADZUNA_MAX_RETRIES = 3;

const ADZUNA_RETRY_DELAY = 2000;

// ======================================================
// ADZUNA CAREER CATEGORIES
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
// CAREEROS OFFICIAL JOB CATEGORIES
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
// CAREEROS CATEGORY SEARCH CONFIGURATION
// ======================================================

const CAREEROS_CATEGORY_SEARCH_CONFIG = {
    it: {
        queries: [
            "software developer",
            "software engineer",
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
        adzunaCategory: null,
    },

    "non-it": {
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
        queries: [
            "civil engineer",
            "electrical engineer",
            "electronics engineer",
            "chemical engineer",
            "industrial engineer",
            "structural engineer",
            "engineering graduate",
        ],
        adzunaCategory:
            ADZUNA_CATEGORIES.ENGINEERING,
    },

    mechanical: {
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
        adzunaCategory:
            ADZUNA_CATEGORIES.ENGINEERING,
    },

    education: {
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
        adzunaCategory:
            ADZUNA_CATEGORIES.TEACHING,
    },

    "finance-accounting": {
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
        adzunaCategory:
            ADZUNA_CATEGORIES.FINANCE,
    },

    government: {
        queries: [
            "government jobs",
            "government employee",
            "public sector",
            "public administration",
            "government officer",
            "civil services",
        ],
        adzunaCategory: null,
    },

    "sales-marketing": {
        queries: [
            "sales executive",
            "sales manager",
            "business development",
            "marketing executive",
            "digital marketing",
            "marketing manager",
            "business development executive",
        ],
        adzunaCategory:
            ADZUNA_CATEGORIES.SALES,
    },

    hr: {
        queries: [
            "HR executive",
            "human resources",
            "HR recruiter",
            "recruiter",
            "recruitment",
            "talent acquisition",
            "HR manager",
        ],
        adzunaCategory:
            ADZUNA_CATEGORIES.ADMIN,
    },

    design: {
        queries: [
            "graphic designer",
            "UI UX designer",
            "UX designer",
            "UI designer",
            "web designer",
            "product designer",
            "creative designer",
        ],
        adzunaCategory: null,
    },

    "skilled-trades": {
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
        adzunaCategory: null,
    },

    other: {
        queries: [
            "general jobs",
            "office jobs",
            "field jobs",
            "support executive",
            "operations",
            "assistant",
        ],
        adzunaCategory: null,
    },
};

// ======================================================
// BROAD CAREER CATEGORIES
// ======================================================

const BROAD_JOB_CATEGORIES = [
    {
        category:
            CAREEROS_JOB_CATEGORIES.IT.key,
        label:
            CAREEROS_JOB_CATEGORIES.IT.label,
        query:
            "software developer technology IT",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.NON_IT.key,
        label:
            CAREEROS_JOB_CATEGORIES.NON_IT.label,
        query:
            "business operations office customer service",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.MEDICAL.key,
        label:
            CAREEROS_JOB_CATEGORIES.MEDICAL.label,
        query:
            "medical doctor nurse healthcare hospital",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.ENGINEERING.key,
        label:
            CAREEROS_JOB_CATEGORIES.ENGINEERING.label,
        query:
            "civil electrical electronics engineer",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.MECHANICAL.key,
        label:
            CAREEROS_JOB_CATEGORIES.MECHANICAL.label,
        query:
            "mechanical production manufacturing engineer",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.EDUCATION.key,
        label:
            CAREEROS_JOB_CATEGORIES.EDUCATION.label,
        query:
            "teacher lecturer professor faculty",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.FINANCE_ACCOUNTING.key,
        label:
            CAREEROS_JOB_CATEGORIES.FINANCE_ACCOUNTING.label,
        query:
            "accountant finance accounting banking",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.GOVERNMENT.key,
        label:
            CAREEROS_JOB_CATEGORIES.GOVERNMENT.label,
        query:
            "government public sector administration",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.SALES_MARKETING.key,
        label:
            CAREEROS_JOB_CATEGORIES.SALES_MARKETING.label,
        query:
            "sales marketing business development",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.HR.key,
        label:
            CAREEROS_JOB_CATEGORIES.HR.label,
        query:
            "human resources HR recruiter recruitment",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.DESIGN.key,
        label:
            CAREEROS_JOB_CATEGORIES.DESIGN.label,
        query:
            "graphic designer UI UX web designer",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.SKILLED_TRADES.key,
        label:
            CAREEROS_JOB_CATEGORIES.SKILLED_TRADES.label,
        query:
            "electrician plumber welder technician",
    },

    {
        category:
            CAREEROS_JOB_CATEGORIES.OTHER.key,
        label:
            CAREEROS_JOB_CATEGORIES.OTHER.label,
        query:
            "general office field support jobs",
    },
];

// ======================================================
// MEDICAL QUERY MAP
// ======================================================

const MEDICAL_QUERY_MAP = {
    mbbs:
        "MBBS doctor medical doctor physician medical officer duty doctor resident doctor hospital doctor clinical doctor",

    "mbbs doctor":
        "MBBS doctor medical doctor physician medical officer duty doctor resident doctor hospital doctor clinical doctor",

    doctor:
        "doctor medical doctor physician medical officer duty doctor resident doctor hospital doctor clinical doctor",

    doctors:
        "doctor doctors medical doctor physician medical officer duty doctor resident doctor hospital doctor clinical doctor",

    physician:
        "physician medical doctor doctor clinical physician hospital physician",

    physicians:
        "physician physicians medical doctor doctor clinical physician hospital physician",

    "medical doctor":
        "medical doctor doctor physician MBBS medical officer duty doctor resident doctor",

    "medical officer":
        "medical officer medical doctor MBBS doctor duty medical officer physician hospital doctor",

    "medical officers":
        "medical officer medical officers medical doctor MBBS doctor duty medical officer physician hospital doctor",

    "duty doctor":
        "duty doctor medical officer medical doctor MBBS doctor physician hospital doctor",

    "duty medical officer":
        "duty medical officer medical officer MBBS doctor physician hospital doctor",

    "resident doctor":
        "resident doctor resident physician medical doctor MBBS doctor hospital doctor",

    "resident physician":
        "resident physician resident doctor medical doctor MBBS doctor hospital",

    residency:
        "medical residency resident doctor resident physician MBBS doctor hospital",

    medical:
        "medical healthcare hospital doctor physician medical officer clinical healthcare",

    medicine:
        "medicine medical doctor physician MBBS medical officer hospital clinical",

    healthcare:
        "healthcare medical hospital doctor physician nursing clinical healthcare",

    "health care":
        "healthcare medical hospital doctor physician nursing clinical healthcare",

    hospital:
        "hospital healthcare medical doctor physician nurse nursing medical officer clinical",

    hospitals:
        "hospital hospitals healthcare medical doctor physician nurse nursing medical officer clinical",

    clinical:
        "clinical healthcare medical hospital doctor physician clinical officer clinical research",

    "clinical staff":
        "clinical staff healthcare hospital doctor nurse medical officer clinical",

    surgeon:
        "surgeon surgery surgical doctor medical doctor hospital physician",

    surgeons:
        "surgeon surgeons surgery surgical doctor medical doctor hospital physician",

    surgery:
        "surgery surgeon surgical doctor hospital physician medical doctor",

    cardiology:
        "cardiology cardiologist cardiac doctor heart specialist physician medical doctor",

    cardiologist:
        "cardiologist cardiology cardiac doctor heart specialist physician",

    neurology:
        "neurology neurologist neurological doctor physician medical specialist",

    neurologist:
        "neurologist neurology neurological doctor physician medical specialist",

    oncology:
        "oncology oncologist cancer specialist medical doctor physician",

    oncologist:
        "oncologist oncology cancer specialist medical doctor physician",

    pediatrics:
        "pediatrics pediatrician child doctor medical doctor physician hospital",

    pediatrician:
        "pediatrician pediatrics child doctor medical doctor physician hospital",

    dermatologist:
        "dermatologist dermatology skin doctor medical doctor physician",

    dermatology:
        "dermatology dermatologist skin doctor medical doctor physician",

    psychiatrist:
        "psychiatrist psychiatry mental health doctor physician medical doctor",

    psychiatry:
        "psychiatry psychiatrist mental health doctor physician medical doctor",

    gynecologist:
        "gynecologist gynecology obstetrics women's health doctor physician medical doctor",

    gynecology:
        "gynecology gynecologist obstetrics women's health doctor physician medical doctor",

    obstetrics:
        "obstetrics gynecology gynecologist obstetrician medical doctor physician",

    radiologist:
        "radiologist radiology imaging doctor medical specialist physician",

    radiology:
        "radiology radiologist medical imaging imaging technician radiographer hospital",

    anesthetist:
        "anesthetist anesthesiologist anesthesia doctor medical specialist hospital",

    anesthesiologist:
        "anesthesiologist anesthetist anesthesia doctor medical specialist hospital",

    bds:
        "BDS dentist dental surgeon dental doctor dental physician dental clinic hospital",

    dentist:
        "dentist dental doctor dental surgeon BDS dental clinic hospital",

    dentists:
        "dentist dentists dental doctor dental surgeon BDS dental clinic hospital",

    dental:
        "dental dentist BDS dental surgeon dental doctor dental clinic",

    "dental surgeon":
        "dental surgeon dentist BDS dental doctor dental clinic hospital",

    orthodontist:
        "orthodontist orthodontics dentist BDS dental specialist",

    bams:
        "BAMS ayurvedic doctor ayurveda physician medical doctor ayurvedic hospital",

    ayurveda:
        "ayurveda ayurvedic doctor BAMS physician medical doctor ayurvedic hospital",

    "ayurvedic doctor":
        "ayurvedic doctor ayurveda BAMS physician medical doctor",

    bhms:
        "BHMS homeopathic doctor homeopathy physician medical doctor homeopathic clinic",

    homeopathy:
        "homeopathy homeopathic doctor BHMS physician medical doctor",

    "homeopathic doctor":
        "homeopathic doctor homeopathy BHMS physician medical doctor",

    nursing:
        "nursing nurse staff nurse registered nurse clinical nurse hospital nurse healthcare",

    nurse:
        "nurse nursing staff nurse registered nurse clinical nurse hospital healthcare",

    nurses:
        "nurse nurses nursing staff nurse registered nurse clinical nurse hospital healthcare",

    "staff nurse":
        "staff nurse nurse nursing registered nurse clinical nurse hospital",

    "registered nurse":
        "registered nurse nurse nursing staff nurse clinical nurse hospital healthcare",

    "nursing officer":
        "nursing officer nurse staff nurse registered nurse hospital healthcare",

    "nurse practitioner":
        "nurse practitioner nurse nursing registered nurse healthcare clinical",

    pharmacy:
        "pharmacy pharmacist clinical pharmacist hospital pharmacist pharmaceutical healthcare",

    pharmacist:
        "pharmacist pharmacy clinical pharmacist hospital pharmacist pharmaceutical",

    pharmacists:
        "pharmacist pharmacists pharmacy clinical pharmacist hospital pharmacist pharmaceutical",

    "clinical pharmacist":
        "clinical pharmacist pharmacist pharmacy hospital pharmacist healthcare",

    "hospital pharmacist":
        "hospital pharmacist pharmacist pharmacy clinical pharmacist healthcare",

    bpt:
        "BPT physiotherapist physiotherapy physical therapist rehabilitation therapist hospital clinic",

    physiotherapy:
        "physiotherapy physiotherapist physical therapist rehabilitation therapist hospital clinic",

    physiotherapist:
        "physiotherapist physiotherapy physical therapist rehabilitation therapist hospital clinic",

    physiotherapists:
        "physiotherapist physiotherapists physiotherapy physical therapist rehabilitation",

    "physical therapist":
        "physical therapist physiotherapist physiotherapy rehabilitation therapist hospital",

    rehabilitation:
        "rehabilitation physiotherapist physical therapist occupational therapist healthcare hospital",

    "medical lab":
        "medical laboratory medical lab laboratory technician lab technician pathology technician healthcare hospital",

    "medical laboratory":
        "medical laboratory laboratory technician lab technician pathology technician hospital healthcare",

    "lab technician":
        "lab technician laboratory technician medical laboratory pathology technician hospital",

    "laboratory technician":
        "laboratory technician lab technician medical laboratory pathology technician hospital healthcare",

    pathology:
        "pathology pathologist pathology technician laboratory technician medical laboratory hospital",

    pathologist:
        "pathologist pathology pathology technician laboratory medical doctor hospital",

    "medical technician":
        "medical technician healthcare hospital laboratory technician medical technician clinical",

    "medical technologist":
        "medical technologist medical technician laboratory technician healthcare hospital",

    "radiology technician":
        "radiology technician radiographer radiology imaging technician hospital",

    radiographer:
        "radiographer radiology technician imaging technician medical imaging hospital",

    "x ray technician":
        "x ray technician radiology technician radiographer medical imaging hospital",

    "x-ray technician":
        "x ray technician radiology technician radiographer medical imaging hospital",

    optometry:
        "optometry optometrist eye care vision specialist healthcare hospital clinic",

    optometrist:
        "optometrist optometry eye care vision specialist healthcare clinic",

    "occupational therapist":
        "occupational therapist occupational therapy rehabilitation healthcare hospital clinic",

    "occupational therapy":
        "occupational therapy occupational therapist rehabilitation healthcare hospital",

    "medical coding":
        "medical coding medical coder healthcare hospital medical billing",

    "medical coder":
        "medical coder medical coding healthcare hospital medical billing",

    "medical billing":
        "medical billing medical coder healthcare hospital insurance medical",

    "medical billing executive":
        "medical billing medical billing executive medical coder healthcare hospital",

    "clinical research":
        "clinical research clinical research associate clinical trial research healthcare pharmaceutical medical",

    "clinical research associate":
        "clinical research associate clinical research clinical trial pharmaceutical healthcare medical",

    "clinical trial":
        "clinical trial clinical research clinical research associate pharmaceutical healthcare medical",

    "research associate":
        "research associate clinical research clinical trial healthcare pharmaceutical medical",

    pharmaceutical:
        "pharmaceutical pharma healthcare medical pharmacist clinical research",

    pharmaceuticals:
        "pharmaceutical pharmaceuticals pharma healthcare medical pharmacist clinical research",

    pharma:
        "pharma pharmaceutical healthcare medical pharmacist clinical research",

    "pharma jobs":
        "pharma pharmaceutical healthcare medical pharmacist clinical research",

    "medical representative":
        "medical representative pharma pharmaceutical healthcare medical sales",

    "medical sales":
        "medical sales medical representative pharmaceutical pharma healthcare",

    "public health":
        "public health healthcare medical health officer community health epidemiology",

    epidemiology:
        "epidemiology epidemiologist public health healthcare medical research",

    epidemiologist:
        "epidemiologist epidemiology public health healthcare medical research",

    "hospital administrator":
        "hospital administrator healthcare administration hospital management medical",

    "healthcare administrator":
        "healthcare administrator hospital administration healthcare management medical",

    "healthcare management":
        "healthcare management hospital administration healthcare administrator medical",

    "hospital management":
        "hospital management healthcare management hospital administrator healthcare",
};

// ======================================================
// MEDICAL KEYWORDS
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
// GENERAL QUERY MAP
// ======================================================

const QUERY_MAP = {
    "react developer":
        "react developer frontend developer",

    "frontend developer":
        "frontend developer react javascript",

    "front end developer":
        "frontend developer react javascript",

    "backend developer":
        "backend developer node java spring boot",

    "full stack developer":
        "full stack developer react node java",

    "java developer":
        "java developer spring boot",

    "python developer":
        "python developer django flask",

    "data analyst":
        "data analyst sql python excel power bi",

    "data scientist":
        "data scientist python machine learning",

    "machine learning":
        "machine learning python",

    "ai engineer":
        "AI engineer artificial intelligence machine learning",

    "software engineer":
        "software engineer software developer",

    "software developer":
        "software developer software engineer",

    "web developer":
        "web developer frontend backend",

    "devops engineer":
        "devops engineer cloud aws azure",

    "cloud engineer":
        "cloud engineer aws azure",

    "cyber security":
        "cyber security cybersecurity information security",

    cybersecurity:
        "cybersecurity cyber security information security",

    "ui ux designer":
        "UI UX designer user experience designer",

    "mobile developer":
        "mobile developer android ios",

    "android developer":
        "android developer kotlin java",

    "ios developer":
        "ios developer swift",

    teacher:
        "teacher teaching educator school",

    teachers:
        "teacher teaching educator school",

    lecturer:
        "lecturer teaching professor education",

    professor:
        "professor lecturer teaching education university",

    teaching:
        "teaching teacher lecturer education school",

    accountant:
        "accountant accounting finance",

    accounting:
        "accounting accountant finance",

    finance:
        "finance financial analyst accounting",

    banking:
        "banking bank finance",

    sales:
        "sales sales executive business development",

    marketing:
        "marketing digital marketing sales",

    "customer service":
        "customer service customer support",

    hr:
        "human resources HR recruiter",

    "human resources":
        "human resources HR recruiter",

    recruiter:
        "recruiter recruitment human resources",

    logistics:
        "logistics supply chain warehouse",

    warehouse:
        "warehouse logistics inventory",

    construction:
        "construction civil engineer site engineer",

    "civil engineer":
        "civil engineer construction structural engineer",
};

// ======================================================
// CAREEROS CATEGORY HELPERS
// ======================================================

function normalizeCareerOSCategory(category = "") {
    return String(category)
        .trim()
        .toLowerCase();
}

function getCareerOSCategoryConfig(category = "") {
    const normalizedCategory =
        normalizeCareerOSCategory(category);

    if (!normalizedCategory) {
        return null;
    }

    return (
        CAREEROS_CATEGORY_SEARCH_CONFIG[
            normalizedCategory
        ] || null
    );
}

function getCareerOSCategoryQueries(category = "") {
    const config =
        getCareerOSCategoryConfig(category);

    return Array.isArray(config?.queries)
        ? config.queries
        : [];
}

function getCareerOSCategoryQuery(category = "") {
    const queries =
        getCareerOSCategoryQueries(category);

    return queries.join(" ");
}

function getCareerOSCategoryAdzunaCategory(
    category = ""
) {
    const config =
        getCareerOSCategoryConfig(category);

    return config?.adzunaCategory || null;
}

// ======================================================
// QUERY CATEGORY DETECTION
// ======================================================

function getQueryCategory(query = "") {
    const value = String(query)
        .trim()
        .toLowerCase();

    // --------------------------------------------------
    // Medical
    // --------------------------------------------------

    if (
        MEDICAL_KEYWORDS.some(
            (keyword) =>
                value === keyword ||
                value.includes(keyword)
        )
    ) {
        return ADZUNA_CATEGORIES.HEALTHCARE;
    }

    // --------------------------------------------------
    // IT
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Engineering
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Finance
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Teaching
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Sales
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Customer Service
    // --------------------------------------------------

    if (
        value.includes("customer service") ||
        value.includes("customer support")
    ) {
        return ADZUNA_CATEGORIES.CUSTOMER_SERVICE;
    }

    // --------------------------------------------------
    // HR
    // --------------------------------------------------

    if (
        value === "hr" ||
        value.includes("human resource") ||
        value.includes("recruiter") ||
        value.includes("recruitment")
    ) {
        return ADZUNA_CATEGORIES.ADMIN;
    }

    // --------------------------------------------------
    // Logistics
    // --------------------------------------------------

    if (
        value.includes("logistics") ||
        value.includes("warehouse") ||
        value.includes("supply chain")
    ) {
        return ADZUNA_CATEGORIES.LOGISTICS;
    }

    // --------------------------------------------------
    // Construction
    // --------------------------------------------------

    if (
        value.includes("construction") ||
        value.includes("civil engineer")
    ) {
        return ADZUNA_CATEGORIES.CONSTRUCTION;
    }

    return null;
}

// ======================================================
// NORMALIZE JOB SEARCH QUERY
// ======================================================

function normalizeQuery(query = "") {
    const value = String(query)
        .trim()
        .toLowerCase();

    if (!value) {
        return "all jobs";
    }

    if (MEDICAL_QUERY_MAP[value]) {
        return MEDICAL_QUERY_MAP[value];
    }

    if (
        MEDICAL_KEYWORDS.some(
            (keyword) =>
                value === keyword ||
                value.includes(keyword)
        )
    ) {
        for (const [
            keyword,
            expansion,
        ] of Object.entries(
            MEDICAL_QUERY_MAP
        )) {
            if (
                value.includes(keyword)
            ) {
                return `${String(
                    query
                ).trim()} ${expansion}`;
            }
        }

        return `${String(
            query
        ).trim()} medical healthcare hospital clinical doctor physician`;
    }

    return (
        QUERY_MAP[value] ||
        String(query).trim()
    );
}

// ======================================================
// TEXT HELPER
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
// EXPERIENCE CLASSIFIER
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
// WORK MODE CLASSIFIER
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
        explicitMode.includes("remote") ||
        explicitMode === "wfh"
    ) {
        return "Remote";
    }

    if (
        explicitMode.includes("hybrid")
    ) {
        return "Hybrid";
    }

    if (
        explicitMode.includes("onsite") ||
        explicitMode.includes("on-site") ||
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
// JOB TYPE CLASSIFIER
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
// SALARY RANGE
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

// ======================================================
// SALARY CLASSIFIER
// ======================================================

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

// ======================================================
// SALARY FILTER
// ======================================================

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
// ACTIVE FILTERS
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
            experience !== "Any Experience"
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

// ======================================================
// JOB FILTER MATCH
// ======================================================

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
        experience !== "Any Experience"
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

    if (
        !matchesSalary(
            job,
            salary
        )
    ) {
        return false;
    }

    return true;
}

// ======================================================
// ENRICH JOB
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
            : job.company?.display_name || "",

        typeof job.location === "string"
            ? job.location
            : job.location?.display_name || "",
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

// ======================================================
// REMOVE DUPLICATES
// ======================================================

function removeDuplicateJobs(jobs) {
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
// BROAD JOB SEARCH CHECK
// ======================================================

function isBroadJobSearch(query = "") {
    const value = String(query)
        .trim()
        .toLowerCase();

    return (
        value === "" ||
        value === "all" ||
        value === "all jobs" ||
        value === "all job" ||
        value === "jobs" ||
        value === "latest jobs" ||
        value === "latest job openings"
    );
}

// ======================================================
// RETRY ERROR CHECK
// ======================================================

function shouldRetryAdzunaError(error) {
    if (!error) {
        return false;
    }

    const status =
        error.response?.status;

    const code =
        error.code;

    if (
        status === 429 ||
        status === 502 ||
        status === 503 ||
        status === 504
    ) {
        return true;
    }

    const retryableCodes = [
        "ETIMEDOUT",
        "ECONNABORTED",
        "ECONNRESET",
        "EAI_AGAIN",
        "ENETUNREACH",
        "EHOSTUNREACH",
    ];

    return retryableCodes.includes(
        code
    );
}

// ======================================================
// WAIT
// ======================================================

function wait(ms) {
    return new Promise(
        (resolve) =>
            setTimeout(
                resolve,
                ms
            )
    );
}

// ======================================================
// FETCH ONE ADZUNA PAGE
// ======================================================

async function fetchAdzunaPage({
    appId,
    appKey,
    query,
    location,
    page,
    category,
}) {
    const pageNumber =
        Math.min(
            Math.max(
                Number(page) || 1,
                1
            ),
            MAX_REQUESTED_PAGE
        );

    const url =
        `https://api.adzuna.com/v1/api/jobs/in/search/${pageNumber}`;

    let lastError = null;

    for (
        let attempt = 1;
        attempt <= ADZUNA_MAX_RETRIES;
        attempt++
    ) {
        try {
            const normalizedQuery =
                normalizeQuery(query);

            console.log(
                `🌐 Calling Adzuna: ${url}`
            );

            console.log(
                `   Query: ${normalizedQuery}`
            );

            console.log(
                `   Category: ${
                    category || "ANY"
                }`
            );

            console.log(
                `   Location: ${
                    location || "India"
                }`
            );

            if (attempt > 1) {
                console.log(
                    `🔁 Adzuna retry attempt ${attempt}/${ADZUNA_MAX_RETRIES}`
                );
            }

            const params = {
                app_id:
                    appId,

                app_key:
                    appKey,

                results_per_page:
                    ADZUNA_RESULTS_PER_PAGE,

                what:
                    normalizedQuery,

                where:
                    location ||
                    "India",
            };

            if (category) {
                params.category =
                    category;
            }

            const response =
                await axios.get(
                    url,
                    {
                        timeout:
                            ADZUNA_TIMEOUT,

                        httpsAgent:
                            adzunaHttpsAgent,

                        headers: {
                            Accept:
                                "application/json",

                            "User-Agent":
                                "CareerOS/1.0",
                        },

                        params,
                    }
                );

            console.log(
                `✅ Adzuna response received: ${response.status}`
            );

            console.log(
                `📊 Adzuna returned ${
                    Array.isArray(
                        response.data?.results
                    )
                        ? response.data.results.length
                        : 0
                } jobs`
            );

            return response.data;
        } catch (error) {
            lastError = error;

            const status =
                error.response?.status;

            const retryable =
                shouldRetryAdzunaError(
                    error
                );

            console.error(
                "❌ Adzuna request failed:",
                {
                    attempt,

                    maxRetries:
                        ADZUNA_MAX_RETRIES,

                    code:
                        error.code,

                    message:
                        error.message,

                    status,

                    statusText:
                        error.response
                            ?.statusText,

                    category,

                    query,

                    url,
                }
            );

            if (!retryable) {
                throw error;
            }

            if (
                attempt ===
                ADZUNA_MAX_RETRIES
            ) {
                break;
            }

            const delay =
                ADZUNA_RETRY_DELAY *
                attempt;

            console.log(
                `⏳ Waiting ${
                    delay / 1000
                }s before Adzuna retry...`
            );

            await wait(delay);
        }
    }

    console.error(
        `❌ Adzuna failed after ${ADZUNA_MAX_RETRIES} attempts.`
    );

    throw lastError;
}

// ======================================================
// SEARCH SPECIFIC CATEGORY
// ======================================================
//
// Used for direct searches such as:
//
// MBBS
// doctor
// nurse
// accountant
// teacher
// React developer
//
// IMPORTANT:
//
// First attempt uses the query/category combination.
// If the category request fails, fallback is performed
// without category.
//
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
    } catch (categoryError) {
        console.error(
            `❌ Category search failed for "${query}" using "${category}":`,
            categoryError?.response?.data ||
                categoryError?.message
        );

        console.log(
            `🔁 Retrying "${query}" without Adzuna category...`
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
//
// CareerOS categories contain multiple job types.
//
// Example:
//
// medical
//   -> nurse
//   -> staff nurse
//   -> registered nurse
//   -> doctor
//   -> medical officer
//   -> MBBS
//   -> pharmacist
//   -> dentist
//
// IMPORTANT:
//
// We intentionally perform KEYWORD-FIRST searches.
//
// This prevents Adzuna's category classification from
// hiding valid jobs.
//
// For example:
//
// MBBS
// Nurse
// Teacher
//
// may be classified differently by Adzuna depending on
// employer/job metadata.
//
// Therefore the CareerOS category is primarily enforced
// by its query list rather than a mandatory Adzuna
// category filter.
//
// ======================================================

async function searchCareerOSCategory({
    appId,
    appKey,
    category,
    location,
    page = 1,
}) {
    const queries =
        getCareerOSCategoryQueries(
            category
        );

    if (
        queries.length === 0
    ) {
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

    let successfulQueries = 0;

    console.log(
        `\n======================================================`
    );

    console.log(
        `🔎 CAREEROS CATEGORY SEARCH: ${category}`
    );

    console.log(
        `📋 Category queries: ${queries.length}`
    );

    console.log(
        `🏷️ Configured Adzuna category: ${
            configuredAdzunaCategory ||
            "KEYWORD SEARCH"
        }`
    );

    console.log(
        `======================================================`
    );

    for (
        const categoryQuery of queries
    ) {
        try {
            console.log(
                `🔍 CareerOS category query: "${categoryQuery}"`
            );

            let data;

            // --------------------------------------------------
            // KEYWORD-FIRST SEARCH
            // --------------------------------------------------
            //
            // This is the important change.
            //
            // We do NOT force Adzuna category on the first
            // request because keyword results are broader.
            //
            // This improves recall for:
            //
            // MBBS
            // doctor
            // nurse
            // teacher
            // accountant
            // technician
            //
            // --------------------------------------------------

            try {
                data =
                    await fetchAdzunaPage({
                        appId,

                        appKey,

                        query:
                            categoryQuery,

                        location,

                        page,

                        category:
                            null,
                    });
            } catch (keywordError) {
                console.error(
                    `❌ Keyword search failed for "${categoryQuery}":`,
                    keywordError?.response
                        ?.data ||
                        keywordError?.message
                );

                // --------------------------------------------------
                // SECONDARY CATEGORY FALLBACK
                // --------------------------------------------------

                if (
                    configuredAdzunaCategory
                ) {
                    console.log(
                        `🔁 Retrying "${categoryQuery}" with Adzuna category "${configuredAdzunaCategory}"`
                    );

                    data =
                        await fetchAdzunaPage({
                            appId,

                            appKey,

                            query:
                                categoryQuery,

                            location,

                            page,

                            category:
                                configuredAdzunaCategory,
                        });
                } else {
                    throw keywordError;
                }
            }

            const results =
                Array.isArray(
                    data?.results
                )
                    ? data.results
                    : [];

            console.log(
                `📊 "${categoryQuery}" returned ${results.length} jobs`
            );

            if (
                results.length > 0
            ) {
                successfulQueries++;
            }

            const taggedResults =
                results.map(
                    (job) => ({
                        ...job,

                        careeros_category:
                            category,

                        careeros_search_query:
                            categoryQuery,
                    })
                );

            allJobs.push(
                ...taggedResults
            );
        } catch (error) {
            console.error(
                `❌ CareerOS category query failed: "${categoryQuery}"`,
                error?.response
                    ?.data ||
                    error?.message
            );
        }
    }

    // ==================================================
    // REMOVE DUPLICATES
    // ==================================================

    const uniqueJobs =
        removeDuplicateJobs(
            allJobs
        );

    // ==================================================
    // ENRICH JOBS
    // ==================================================

    const jobs =
        uniqueJobs.map(
            enrichJob
        );

    console.log(
        `\n✅ CareerOS category "${category}" completed`
    );

    console.log(
        `📊 Successful queries: ${successfulQueries}/${queries.length}`
    );

    console.log(
        `📊 Raw jobs: ${allJobs.length}`
    );

    console.log(
        `📊 Unique jobs: ${jobs.length}`
    );

    return {
        results:
            jobs,

        count:
            jobs.length,

        total:
            jobs.length,

        filtered_total:
            jobs.length,

        filtered_count:
            jobs.length,

        jobs_scanned:
            jobs.length,

        filtered_pages_scanned:
            1,

        has_more:
            successfulQueries > 0,

        careeros_category:
            category,

        category_queries:
            queries,

        category_queries_successful:
            successfulQueries,
    };
}


// SEARCH ALL CAREEROS CATEGORIES
// ======================================================
//
// Used when the Jobs page opens with:
//
// query = all jobs
// category = ""
//
// PERFORMANCE:
//
// Categories are processed with controlled concurrency.
//
// Instead of:
//
// IT
//   ↓
// Non-IT
//   ↓
// Medical
//   ↓
// Engineering
//   ↓
// ...
//
// We process a small number of categories in parallel:
//
// IT          Non-IT       Medical
// Engineering Mechanical  Education
// ...
//
// This significantly reduces total waiting time while
// avoiding a large burst of simultaneous Adzuna requests.
//
// ======================================================

async function searchAllJobCategories({
    appId,
    appKey,
    location = "India",
    page = 1,
    experience = "Any Experience",
    jobType = "Any Type",
    workMode = "Any",
    salary = "Any Salary",
} = {}) {
    const categories = [
        "it",
        "non-it",
        "medical",
        "engineering",
        "mechanical",
        "education",
        "finance-accounting",
        "government",
        "sales-marketing",
        "hr",
        "design",
        "skilled-trades",
        "other",
    ];

    // ==================================================
    // PERFORMANCE CONFIGURATION
    // ==================================================
    //
    // Maximum number of useful jobs CareerOS wants
    // before stopping additional category requests.
    //
    // This prevents unnecessary Adzuna requests when
    // enough jobs have already been collected.
    //
    // ==================================================

    const CATEGORY_CONCURRENCY = 3;

    const TARGET_JOBS = 150;

    const filters = {
        experience,
        jobType,
        workMode,
        salary,
    };

    console.log(
        `\n======================================================`
    );

    console.log(
        `🌎 CAREEROS ALL JOBS SEARCH`
    );

    console.log(
        `📍 Location: ${location}`
    );

    console.log(
        `📂 Categories: ${categories.length}`
    );

    console.log(
        `⚡ Category concurrency: ${CATEGORY_CONCURRENCY}`
    );

    console.log(
        `🎯 Target jobs: ${TARGET_JOBS}`
    );

    console.log(
        `======================================================`
    );

    // ==================================================
    // SEARCH ONE CATEGORY
    // ==================================================

    async function searchOneCategory(
        category
    ) {
        try {
            console.log(
                `\n🔎 Loading CareerOS category: ${category}`
            );

            const data =
                await searchCareerOSCategory({
                    appId,
                    appKey,
                    category,
                    location,
                    page,
                });

            const jobs =
                Array.isArray(
                    data?.results
                )
                    ? data.results
                    : [];

            console.log(
                `📊 ${category}: ${jobs.length} unique jobs`
            );

            return {
                category,
                jobs,
                success: true,
            };
        } catch (error) {
            console.error(
                `❌ Failed to fetch category "${category}":`,
                error?.response?.data ||
                    error?.message
            );

            return {
                category,
                jobs: [],
                success: false,
            };
        }
    }

    // ==================================================
    // CONTROLLED CONCURRENCY + EARLY STOP
    // ==================================================
    //
    // We still process categories in batches.
    //
    // Example:
    //
    // Batch 1 → IT, Non-IT, Medical
    // Batch 2 → Engineering, Mechanical, Education
    //
    // After every completed batch we check whether
    // enough useful jobs have already been collected.
    //
    // If TARGET_JOBS is reached, no more category
    // requests are started.
    //
    // ==================================================

    const categoryResults = [];

    let collectedJobCount = 0;

    for (
        let start = 0;
        start < categories.length;
        start += CATEGORY_CONCURRENCY
    ) {
        // --------------------------------------------------
        // STOP BEFORE STARTING ANOTHER BATCH
        // --------------------------------------------------

        if (
            collectedJobCount >=
            TARGET_JOBS
        ) {
            console.log(
                `\n🛑 Target reached (${collectedJobCount} jobs).`
            );

            console.log(
                `⏭️ Skipping remaining category requests.`
            );

            break;
        }

        const batch =
            categories.slice(
                start,
                start +
                    CATEGORY_CONCURRENCY
            );

        console.log(
            `\n⚡ Starting category batch ${
                Math.floor(
                    start /
                        CATEGORY_CONCURRENCY
                ) + 1
            }`
        );

        console.log(
            `📂 Categories: ${batch.join(", ")}`
        );

        // --------------------------------------------------
        // RUN CURRENT BATCH IN PARALLEL
        // --------------------------------------------------

        const batchResults =
            await Promise.all(
                batch.map(
                    (category) =>
                        searchOneCategory(
                            category
                        )
                )
            );

        categoryResults.push(
            ...batchResults
        );

        // --------------------------------------------------
        // COUNT UNIQUE + FILTERED JOBS
        // --------------------------------------------------
        //
        // This count is only used to determine whether
        // another batch is necessary.
        //
        // Final deduplication is still performed below.
        //
        // --------------------------------------------------

        const temporaryJobIds =
            new Set();

        let temporaryCount =
            0;

        for (
            const result of
                categoryResults
        ) {
            if (
                !result ||
                !Array.isArray(
                    result.jobs
                )
            ) {
                continue;
            }

            for (
                const job of
                    result.jobs
            ) {
                if (!job) {
                    continue;
                }

                const jobId =
                    getUniqueJobId(job);

                if (!jobId) {
                    continue;
                }

                if (
                    temporaryJobIds.has(
                        jobId
                    )
                ) {
                    continue;
                }

                if (
                    !jobMatchesFilters(
                        job,
                        filters
                    )
                ) {
                    continue;
                }

                temporaryJobIds.add(
                    jobId
                );

                temporaryCount++;
            }
        }

        collectedJobCount =
            temporaryCount;

        console.log(
            `📈 Useful jobs collected so far: ${collectedJobCount}`
        );

        console.log(
            `🎯 Target: ${TARGET_JOBS}`
        );

        console.log(
            `✅ Category batch completed`
        );

        // --------------------------------------------------
        // STOP AFTER CURRENT BATCH
        // --------------------------------------------------

        if (
            collectedJobCount >=
            TARGET_JOBS
        ) {
            console.log(
                `\n🛑 Target of ${TARGET_JOBS} jobs reached.`
            );

            console.log(
                `⏭️ Remaining categories will not be requested.`
            );

            break;
        }
    }

    // ==================================================
    // COMBINE + DEDUPLICATE
    // ==================================================

    const allJobs = [];

    const seenJobIds =
        new Set();

    // ==================================================
    // PRESERVE ORIGINAL CATEGORY ORDER
    // ==================================================

    for (
        const category of categories
    ) {
        const categoryResult =
            categoryResults.find(
                (result) =>
                    result.category ===
                    category
            );

        if (
            !categoryResult ||
            !Array.isArray(
                categoryResult.jobs
            )
        ) {
            continue;
        }

        for (
            const job of
                categoryResult.jobs
        ) {
            if (!job) {
                continue;
            }

            const jobId =
                getUniqueJobId(job);

            if (!jobId) {
                continue;
            }

            if (
                seenJobIds.has(
                    jobId
                )
            ) {
                continue;
            }

            // --------------------------------------------------
            // APPLY REQUESTED FILTERS
            // --------------------------------------------------

            if (
                !jobMatchesFilters(
                    job,
                    filters
                )
            ) {
                continue;
            }

            seenJobIds.add(
                jobId
            );

            allJobs.push(
                enrichJob(job)
            );
        }
    }

    // ==================================================
    // STATISTICS
    // ==================================================

    const successfulCategories =
        categoryResults.filter(
            (result) =>
                result.success
        ).length;

    const requestedCategories =
        categoryResults.length;

    const skippedCategories =
        categories.length -
        requestedCategories;

    console.log(
        `\n======================================================`
    );

    console.log(
        `✅ ALL JOBS SEARCH COMPLETED`
    );

    console.log(
        `📂 Requested categories: ${requestedCategories}/${categories.length}`
    );

    console.log(
        `⏭️ Skipped categories: ${skippedCategories}`
    );

    console.log(
        `📂 Successful categories: ${successfulCategories}/${requestedCategories}`
    );

    console.log(
        `📊 Unique jobs: ${allJobs.length}`
    );

    console.log(
        `======================================================`
    );

    return {
        success: true,

        results:
            allJobs,

        count:
            allJobs.length,

        total:
            allJobs.length,

        filtered_total:
            allJobs.length,

        filtered_count:
            allJobs.length,

        page,

        results_per_page:
            allJobs.length,

        has_more:
            false,

        experience,

        jobType,

        workMode,

        salary,

        category:
            "All",

        filtered_pages_scanned:
            page,

        jobs_scanned:
            allJobs.length,

        // --------------------------------------------------
        // PERFORMANCE INFORMATION
        // --------------------------------------------------

        categories_requested:
            requestedCategories,

        categories_skipped:
            skippedCategories,

        target_jobs:
            TARGET_JOBS,

        target_reached:
            allJobs.length >=
            TARGET_JOBS,
    };
}

// ======================================================
// MAIN JOB SEARCH
// ======================================================

async function searchJobs({
    query = "all jobs",
    category = "",

    location = "India",

    page = 1,

    experience =
        "Any Experience",

    jobType =
        "Any Type",

    workMode =
        "Any",

    salary =
        "Any Salary",
}) {
    const appId =
        process.env.ADZUNA_APP_ID;

    const appKey =
        process.env.ADZUNA_APP_KEY;

    if (
        !appId ||
        !appKey
    ) {
        throw new Error(
            "Adzuna API credentials are missing. Please check ADZUNA_APP_ID and ADZUNA_APP_KEY in your .env file."
        );
    }

    const requestedPage =
        Math.min(
            Math.max(
                Number(page) || 1,
                1
            ),
            MAX_REQUESTED_PAGE
        );

    // ==================================================
    // CAREEROS CATEGORY
    // ==================================================

    const normalizedCareerOSCategory =
        normalizeCareerOSCategory(
            category
        );

    const careerOSCategoryConfig =
        getCareerOSCategoryConfig(
            normalizedCareerOSCategory
        );

    const selectedCareerOSCategory =
        careerOSCategoryConfig
            ? normalizedCareerOSCategory
            : "";

    const categorySearchQueries =
        getCareerOSCategoryQueries(
            selectedCareerOSCategory
        );

    const categorySearchQuery =
        categorySearchQueries.join(" ");

    const categoryAdzunaCategory =
        careerOSCategoryConfig
            ?.adzunaCategory ||
        null;

    console.log(
        `🗂️ CareerOS requested category: ${
            selectedCareerOSCategory ||
            "ALL"
        }`
    );

    console.log(
        `🔎 CareerOS category query: ${
            categorySearchQuery ||
            "NONE"
        }`
    );

    console.log(
        `🏷️ CareerOS Adzuna category: ${
            categoryAdzunaCategory ||
            "KEYWORD SEARCH"
        }`
    );

    // ==================================================
    // FILTERS
    // ==================================================

    const filters = {
        experience,
        jobType,
        workMode,
        salary,
    };

    const filtersActive =
        hasActiveFilters(
            filters
        );

    // ==================================================
    // ALL JOBS
    // ==================================================
    //
    // If no category is selected and query is broad,
    // search all CareerOS categories.
    //
    // ==================================================

    if (
        isBroadJobSearch(query) &&
        !selectedCareerOSCategory
    ) {
        const broadData =
            await searchAllJobCategories({
                appId,

                appKey,

                location,

                page:
                    requestedPage,

                experience,

                jobType,

                workMode,

                salary,
            });

        const filteredJobs =
            broadData.results.filter(
                (job) =>
                    jobMatchesFilters(
                        job,
                        filters
                    )
            );

        const enrichedJobs =
            filteredJobs.map(
                enrichJob
            );

        return {
            ...broadData,

            results:
                enrichedJobs,

            total:
                broadData.total,

            filtered_total:
                enrichedJobs.length,

            filtered_count:
                enrichedJobs.length,

            jobs_scanned:
                broadData.jobs_scanned,

            filtered_pages_scanned:
                broadData.filtered_pages_scanned,

            has_more:
                broadData.has_more,
        };
    }

    // ==================================================
    // DETECT ADZUNA CATEGORY FROM QUERY
    // ==================================================
    //
    // Explicit CareerOS category always has priority.
    //
    // If no CareerOS category was selected, detect a
    // suitable Adzuna category from the query.
    //
    // ==================================================

    const detectedQueryCategory =
        getQueryCategory(
            query
        );

    const detectedCategory =
        selectedCareerOSCategory
            ? null
            : detectedQueryCategory;

    console.log(
        `🎯 CareerOS detected Adzuna category for "${query}": ${
            detectedCategory ||
            "NONE"
        }`
    );

    // ==================================================
    // EFFECTIVE SEARCH QUERY
    // ==================================================

    const effectiveQuery =
        selectedCareerOSCategory &&
        isBroadJobSearch(query)
            ? categorySearchQuery
            : query;

    console.log(
        `🔍 CareerOS effective query: "${effectiveQuery}"`
    );

    // ==================================================
    // CAREEROS SPECIFIC CATEGORY
    // ==================================================
    //
    // Example:
    //
    // category = medical
    // query = all jobs
    //
    // Searches the individual medical queries.
    //
    // ==================================================

    if (
        selectedCareerOSCategory
    ) {
        const categoryData =
            await searchCareerOSCategory({
                appId,

                appKey,

                category:
                    selectedCareerOSCategory,

                location,

                page:
                    requestedPage,
            });

        const categoryJobs =
            Array.isArray(
                categoryData?.results
            )
                ? categoryData.results
                : [];

        const filteredCategoryJobs =
            categoryJobs.filter(
                (job) =>
                    jobMatchesFilters(
                        job,
                        filters
                    )
            );

        const enrichedCategoryJobs =
            filteredCategoryJobs.map(
                enrichJob
            );

        return {
            ...categoryData,

            results:
                enrichedCategoryJobs,

            total:
                categoryJobs.length,

            filtered_total:
                enrichedCategoryJobs.length,

            filtered_count:
                enrichedCategoryJobs.length,

            jobs_scanned:
                categoryJobs.length,

            filtered_pages_scanned:
                1,

            has_more:
                categoryData.has_more,
        };
    }

    // ==================================================
    // NO FILTERS
    // ==================================================

    if (!filtersActive) {
        const data =
            await searchSpecificCategory({
                appId,

                appKey,

                query:
                    effectiveQuery,

                location,

                page:
                    requestedPage,

                category:
                    detectedCategory,
            });

        const rawJobs =
            Array.isArray(
                data?.results
            )
                ? data.results
                : [];

        const jobs =
            removeDuplicateJobs(
                rawJobs
            ).map(
                enrichJob
            );

        const total =
            Number(
                data?.count ||
                0
            );

        return {
            ...data,

            total,

            results:
                jobs,

            filtered_total:
                total,

            filtered_count:
                jobs.length,

            jobs_scanned:
                jobs.length,

            filtered_pages_scanned:
                1,

            has_more:
                requestedPage *
                    ADZUNA_RESULTS_PER_PAGE <
                total,
        };
    }

    // ==================================================
    // FILTERED SEARCH
    // ==================================================
    //
    // Fetch multiple pages so filters do not accidentally
    // produce zero jobs simply because the first Adzuna
    // page did not contain matching jobs.
    //
    // ==================================================

    const allJobs = [];

    let firstResponse =
        null;

    let lastFetchedPage =
        requestedPage;

    let reachedEnd =
        false;

    for (
        let currentPage =
            requestedPage;

        currentPage <
        requestedPage +
            MAX_FILTER_PAGES;

        currentPage++
    ) {
        try {
            const data =
                await searchSpecificCategory({
                    appId,

                    appKey,

                    query:
                        effectiveQuery,

                    location,

                    page:
                        currentPage,

                    category:
                        detectedCategory,
                });

            if (!firstResponse) {
                firstResponse =
                    data;
            }

            lastFetchedPage =
                currentPage;

            const pageJobs =
                Array.isArray(
                    data?.results
                )
                    ? data.results
                    : [];

            if (
                pageJobs.length === 0
            ) {
                reachedEnd =
                    true;

                break;
            }

            allJobs.push(
                ...pageJobs
            );

            if (
                pageJobs.length <
                ADZUNA_RESULTS_PER_PAGE
            ) {
                reachedEnd =
                    true;

                break;
            }
        } catch (error) {
            console.error(
                `Adzuna page ${currentPage} failed:`,
                error?.response
                    ?.data ||
                    error?.message
            );

            if (!firstResponse) {
                throw error;
            }

            break;
        }
    }

    // ==================================================
    // UNIQUE JOBS
    // ==================================================

    const uniqueJobs =
        removeDuplicateJobs(
            allJobs
        );

    // ==================================================
    // FILTER JOBS
    // ==================================================

    const filteredJobs =
        uniqueJobs.filter(
            (job) =>
                jobMatchesFilters(
                    job,
                    filters
                )
        );

    // ==================================================
    // ENRICH
    // ==================================================

    const enrichedJobs =
        filteredJobs.map(
            enrichJob
        );

    // ==================================================
    // TOTAL
    // ==================================================

    const total =
        Number(
            firstResponse?.count ||
            0
        );

    // ==================================================
    // PAGINATION
    // ==================================================

    const hasMore =
        !reachedEnd &&
        lastFetchedPage <
            requestedPage +
                MAX_FILTER_PAGES -
                1;

    // ==================================================
    // RESPONSE
    // ==================================================

    return {
        ...(firstResponse || {}),

        total,

        results:
            enrichedJobs,

        filtered_total:
            enrichedJobs.length,

        filtered_count:
            enrichedJobs.length,

        jobs_scanned:
            uniqueJobs.length,

        filtered_pages_scanned:
            lastFetchedPage -
            requestedPage +
            1,

        has_more:
            hasMore,
    };
}

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    searchJobs,

    searchAllJobCategories,

    normalizeQuery,

    getExperienceLevel,

    getWorkMode,

    getJobType,

    getSalaryLevel,

    matchesSalary,

    jobMatchesFilters,

    enrichJob,

    getQueryCategory,

    normalizeCareerOSCategory,

    getCareerOSCategoryConfig,
};