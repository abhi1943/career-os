import database from "../data";
import professions from "../data/professions";
import collegesDatabase from "@/data/colleges/colleges";
import exams from "../data/exams";
import { recommendCareers } from "./recommendCareers";
import { getJobs } from "../services/jobService";
import { getJobAlerts } from "../services/jobAlertsService";

const allCareers = [
    ...Object.values(database).flat(),
    ...professions,
];

const mentorContext = new Map();

function getMentorContextKey(student) {
    if (!student) {
        return "anonymous";
    }

    return (
        student.uid ||
        student.userId ||
        student.id ||
        student.email ||
        "anonymous"
    );
}

function getMentorContext(student) {
    const key =
        getMentorContextKey(student);

    return (
        mentorContext.get(key) || {
            careerId: null,
            careerName: null,
            intent: null,
            lastQuestion: "",
        }
    );
}

function saveMentorContext(
    student,
    {
        career = null,
        intent = null,
        question = "",
    } = {}
) {
    const key =
        getMentorContextKey(student);

    const previous =
        mentorContext.get(key) || {};

    mentorContext.set(key, {
        careerId:
            career?.id ||
            previous.careerId ||
            null,

        careerName:
            career?.name ||
            previous.careerName ||
            null,

        intent:
            intent ||
            previous.intent ||
            null,

        lastQuestion:
            question ||
            previous.lastQuestion ||
            "",
    });
}

function normalize(value = "") {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[?!.:,;]+/g, " ")
        .replace(/\s+/g, " ");
}

function contains(text = "", query = "") {
    const a = normalize(text);
    const b = normalize(query);
    return Boolean(a && b && a.includes(b));
}

function formatList(items = []) {
    if (!Array.isArray(items) || !items.length) {
        return "Not available";
    }

    return items
        .filter(Boolean)
        .map((item) =>
            typeof item === "object"
                ? item.name || item.title || ""
                : String(item)
        )
        .filter(Boolean)
        .join(", ");
}

function getArrayValue(value) {
    return Array.isArray(value)
        ? value.filter(Boolean)
        : [];
}

const careerAliases = {
    "software engineer": [
        "software engineer",
        "software developer",
        "software programmer",
        "software development",
    ],
    "frontend developer": [
        "frontend developer",
        "front end developer",
        "frontend development",
        "ui developer",
        "react developer",
        "react js developer",
        "reactjs developer",
    ],
    "backend developer": [
        "backend developer",
        "back end developer",
        "backend development",
        "server developer",
        "node developer",
        "node js developer",
        "nodejs developer",
    ],
    "full stack developer": [
        "full stack developer",
        "full-stack developer",
        "fullstack developer",
        "full stack development",
        "web developer",
        "web development",
    ],
    "data scientist": [
        "data scientist",
        "data science",
    ],
    "data analyst": [
        "data analyst",
        "data analytics",
        "data analysis",
    ],
    "business analyst": [
        "business analyst",
        "business analysis",
    ],
    "ai engineer": [
        "ai engineer",
        "artificial intelligence engineer",
        "ai developer",
        "artificial intelligence developer",
    ],
    "machine learning engineer": [
        "machine learning engineer",
        "ml engineer",
        "machine learning developer",
        "ml developer",
    ],
    "cyber security engineer": [
        "cyber security engineer",
        "cybersecurity engineer",
        "security engineer",
        "cyber security developer",
        "cybersecurity developer",
    ],
    "ethical hacker": [
        "ethical hacker",
        "penetration tester",
        "pen tester",
        "penetration testing",
    ],
    "cloud engineer": [
        "cloud engineer",
        "cloud developer",
        "cloud computing engineer",
    ],
    "devops engineer": [
        "devops engineer",
        "devops developer",
        "devops",
    ],
};

function findCanonicalCareerKey(value = "") {
    const q = normalize(value);

    if (!q) {
        return null;
    }

    const entries = Object.entries(careerAliases)
        .sort(
            (a, b) =>
                Math.max(
                    ...b[1].map((x) =>
                        normalize(x).length
                    )
                ) -
                Math.max(
                    ...a[1].map((x) =>
                        normalize(x).length
                    )
                )
        );

    for (const [key, aliases] of entries) {
        if (
            aliases.some(
                (alias) =>
                    normalize(alias) === q
            )
        ) {
            return key;
        }
    }

    return null;
}

function findCareerByCanonicalKey(
    canonicalKey = ""
) {
    const q = normalize(canonicalKey);

    if (!q) {
        return null;
    }

    return (
        allCareers.find((career) => {
            const name = normalize(career?.name);
            const id = normalize(career?.id)
                .replace(/-/g, " ");

            return (
                name === q ||
                id === q ||
                name.includes(q) ||
                q.includes(name)
            );
        }) || null
    );
}

function findCareerByAlias(question = "") {
    const q = normalize(question);

    if (!q) {
        return null;
    }

    const entries = Object.entries(careerAliases)
        .sort(
            (a, b) =>
                Math.max(
                    ...b[1].map((x) =>
                        normalize(x).length
                    )
                ) -
                Math.max(
                    ...a[1].map((x) =>
                        normalize(x).length
                    )
                )
        );

    for (const [key, aliases] of entries) {
        if (
            aliases.some((alias) =>
                q.includes(normalize(alias))
            )
        ) {
            const career =
                findCareerByCanonicalKey(key);

            if (career) {
                return career;
            }
        }
    }

    return null;
}

function findCareer(question = "") {
    const q = normalize(question);

    if (!q) {
        return null;
    }

    const aliasCareer =
        findCareerByAlias(q);

    if (aliasCareer) {
        return aliasCareer;
    }

    const canonicalKey =
        findCanonicalCareerKey(q);

    if (canonicalKey) {
        const career =
            findCareerByCanonicalKey(
                canonicalKey
            );

        if (career) {
            return career;
        }
    }

    return (
        [...allCareers]
            .filter(Boolean)
            .sort(
                (a, b) =>
                    normalize(b?.name).length -
                    normalize(a?.name).length
            )
            .find((career) => {
                const name = normalize(
                    career?.name
                );

                const id = normalize(
                    career?.id
                ).replace(/-/g, " ");

                return (
                    (name &&
                        q.includes(name)) ||
                    (id &&
                        q.includes(id))
                );
            }) || null
    );
}

function findStudentCareer(student) {
    if (!student) {
        return null;
    }

    const dreamCareer =
        normalize(student.dreamCareer);

    if (!dreamCareer) {
        return null;
    }

    const canonicalKey =
        findCanonicalCareerKey(
            dreamCareer
        );

    if (canonicalKey) {
        const career =
            findCareerByCanonicalKey(
                canonicalKey
            );

        if (career) {
            return career;
        }
    }

    const aliasCareer =
        findCareerByAlias(
            dreamCareer
        );

    if (aliasCareer) {
        return aliasCareer;
    }

    return (
        allCareers.find((career) => {
            const name =
                normalize(career?.name);

            const id =
                normalize(career?.id)
                    .replace(/-/g, " ");

            return (
                name === dreamCareer ||
                name.includes(dreamCareer) ||
                dreamCareer.includes(name) ||
                id === dreamCareer
            );
        }) || null
    );
}

function getTopRecommendedCareer(student) {
    if (!student) {
        return null;
    }

    return (
        recommendCareers(student)?.[0] ||
        null
    );
}

function isFollowUpQuestion(q) {
    return (
        q.includes("what about") ||q.includes("how about") ||q.includes("and salary") ||q.includes("and the salary") ||q.includes("what about salary") ||q.includes("what about jobs") ||q.includes("what about companies") ||q.includes("what about colleges") ||q.includes("what about exams") ||q.includes("what about skills") ||q.includes("what should i learn") ||q.includes("what should i do next") ||q.includes("what next") ||q.includes("which one") ||q.includes("which ones") ||q.includes("is it good") ||q.includes("is that good") ||q.includes("is this good") ||q.includes("can i do it") ||q.includes("can i pursue it") ||q.includes("can i do that") ||q.includes("tell me more") ||q.includes("explain more") ||q.includes("more details") ||q.includes("more about it") ||q.includes("continue") ||q === "yes" ||
        q === "no"
    );
}

function getContextCareer(
    student,
    question
) {
    const context =
        getMentorContext(student);

    if (
        !isFollowUpQuestion(
            normalize(question)
        )
    ) {
        return null;
    }

    if (
        context?.careerId
    ) {
        const byId =
            allCareers.find(
                (career) =>
                    career?.id ===
                    context.careerId
            );

        if (byId) {
            return byId;
        }
    }

    if (
        context?.careerName
    ) {
        return (
            findCareerByCanonicalKey(
                context.careerName
            ) ||
            findCareer(
                context.careerName
            )
        );
    }

    return null;
}

function getConversationAwareCareer(
    question,
    student
) {
    const directCareer =
        findCareer(question);

    if (directCareer) {
        return directCareer;
    }

    const contextCareer =
        getContextCareer(
            student,
            question
        );

    if (contextCareer) {
        return contextCareer;
    }

    return (
        findStudentCareer(student) ||
        getTopRecommendedCareer(student) ||
        null
    );
}

function detectMentorIntent(q) {
    if (isMyJobAlertIntent(q)) {
        return "my_job_alerts";
    }

    if (
        isJobAlertIntent(q) &&
        isLiveJobSearchIntent(q)
    ) {
        return "job_alerts_and_jobs";
    }

    if (isLiveJobSearchIntent(q)) {
        return "live_jobs";
    }

    if (
        isMissingSkillsAndNextIntent(q)
    ) {
        return "missing_skills_and_next";
    }

    if (
        isRoadmapSalaryFutureIntent(q)
    ) {
        return "roadmap_salary_future";
    }

    if (
        isCollegeAndExamIntent(q)
    ) {
        return "college_and_exam";
    }

    if (
        isSuitabilityJobsCompaniesIntent(q)
    ) {
        return "suitability_jobs_companies";
    }

    if (isRoadmapIntent(q)) {
        return "roadmap";
    }

    if (isNextStepIntent(q)) {
        return "next_step";
    }

    if (isMissingSkillsIntent(q)) {
        return "missing_skills";
    }

    if (isSuitabilityIntent(q)) {
        return "suitability";
    }

    if (isCollegeIntent(q)) {
        return "college";
    }

    if (isExamIntent(q)) {
        return "exam";
    }

    if (isFutureIntent(q)) {
        return "future";
    }

    if (isJobIntent(q)) {
        return "job_roles";
    }

    if (isSkillsIntent(q)) {
        return "skills";
    }

    if (isSalaryIntent(q)) {
        return "salary";
    }

    if (isCompanyIntent(q)) {
        return "company";
    }

    if (isRecommendationIntent(q)) {
        return "recommendation";
    }

    return "career";
}


function isGreeting(q) {
    return /^(hi|hello|hey|hii|hiii|good morning|good afternoon|good evening)\b/.test(
        q
    );
}

function isRecommendationIntent(q) {
    return (q.includes("recommend a career") ||q.includes("recommend career") ||q.includes("best career") ||q.includes("suggest a career") ||q.includes("suggest career") ||q.includes("career for me") ||q.includes("which career") ||q.includes("what career") ||q.includes("suitable career") ||q.includes("right career") ||q.includes("career should i choose") ||q.includes("career should i select") ||q.includes("what career suits me") ||q.includes("which career suits me")
    );
}

function isRoadmapIntent(q) {
    return ( q.includes("roadmap") || q.includes("career path") || q.includes("how do i become") || q.includes("how to become") || q.includes("how can i become") || q.includes("steps to become") || q.includes("steps to get into") || q.includes("how do i prepare") || q.includes("how should i prepare") || q.includes("how can i prepare")
    );
}

function isSuitabilityIntent(q) {
    return (q.startsWith("can i become") ||q.startsWith("can i be") ||q.includes("am i suitable") ||q.includes("am i fit") ||q.includes("am i a good fit") ||q.includes("is this career good for me") ||q.includes("is this suitable for me") ||q.includes("would i be good") ||q.includes("will i be good") ||q.includes("do i qualify") ||q.includes("can i pursue")
    );
}

function isSkillsIntent(q) {
    return (q.includes("what skills") ||q.includes("skills required") ||q.includes("skills needed") ||q.includes("what skills do i need") ||q.includes("what should i learn") ||q.includes("what should i know") ||q.includes("what to learn") ||q.includes("technologies") ||q.includes("technology should i learn") ||q.includes("tools should i learn")
    );
}

function isMissingSkillsIntent(q) {
    return (q.includes("skills am i missing") ||q.includes("what skills am i missing") ||q.includes("what skills am i lacking") ||q.includes("which skills am i missing") ||q.includes("skills i am missing") ||q.includes("skills i need to improve") ||q.includes("what should i improve") ||q.includes("what do i need to improve") ||q.includes("what can i improve") ||q.includes("where can i improve") ||q.includes("what am i missing")
    );
}

function isNextStepIntent(q) {
    return (q.includes("what next") ||q.includes("what should i do next") ||q.includes("what do i do next") ||q.includes("what should i learn next") ||q.includes("what do i learn next") ||q.includes("what next should i learn") ||q.includes("next skill") ||q.includes("next skills") ||q.includes("next step") ||q.includes("next steps") ||q.includes("what should i learn first") ||q.includes("what do i learn first") ||q.includes("what should i start with")
    );
}

function isSalaryIntent(q) {
    return (q.includes("salary") ||q.includes("salaries") ||q.includes("pay") ||q.includes("earn") ||q.includes("earning") ||q.includes("income") ||q.includes("package") ||q.includes("ctc") ||q.includes("how much can i make") ||q.includes("how much can i earn")
    );
}

function isCompanyIntent(q) {
    return (q.includes("company") ||q.includes("companies") ||q.includes("employer") ||q.includes("employers") ||q.includes("where can i work") ||q.includes("who hires") ||q.includes("who is hiring")
    );
}

function isCollegeIntent(q) {
    return (q.includes("college") ||q.includes("colleges") ||q.includes("university") ||q.includes("universities") ||q.includes("where should i study") ||q.includes("best college") ||q.includes("suitable college") ||q.includes("colleges suitable") ||q.includes("which college") ||q.includes("which colleges") ||q.includes("good college") ||q.includes("good colleges") ||q.includes("study in")
    );
}

function isExamIntent(q) {
    return (q.includes("exam") ||q.includes("exams") ||q.includes("entrance") ||q.includes("entrance exam") ||q.includes("entrance test") ||q.includes("which exam") ||q.includes("which exams") ||q.includes("which test") ||q.includes("what exam") ||q.includes("what exams") ||q.includes("what test") ||q.includes("tests can i write") ||q.includes("exams can i write") ||q.includes("exam can i write") ||q.includes("exam should i take") ||q.includes("exams should i take") ||q.includes("exam after") ||q.includes("exams after")
    );
}

function isJeeIntent(q) {
    return (
        q.includes("jee") ||
        q.includes("jee main") ||
        q.includes("jee advanced")
    );
}

function isFutureIntent(q) {
    return (q.includes("future") ||q.includes("future of") ||q.includes("in demand") ||q.includes("demand") ||q.includes("career outlook") ||q.includes("job outlook") ||q.includes("long term") ||q.includes("long-term")
    );
}

function isJobIntent(q) {
    return (
        q.includes("what jobs") ||
        q.includes("which jobs") ||
        q.includes("job roles") ||
        q.includes("roles can i get") ||
        q.includes("what role") ||
        q.includes("which role") ||
        q.includes("jobs can i get") ||
        q.includes("job opportunities") ||
        q.includes("job opportunity")
    );
}

function isLiveJobSearchIntent(q) {
    return (q.includes("find jobs") ||q.includes("search jobs") ||q.includes("show jobs") ||q.includes("show me jobs") ||q.includes("latest jobs") ||q.includes("latest job") ||q.includes("available jobs") ||q.includes("job openings") ||q.includes("open jobs") ||q.includes("current jobs") ||q.includes("current openings") ||q.includes("hiring now") ||q.includes("jobs available") ||q.includes("jobs for me") ||q.includes("jobs matching") ||q.includes("opportunities for me")
    );
}

function isJobAlertIntent(q) {
    return (
        q.includes("job alert") ||
        q.includes("job alerts") ||
        q.includes("alerts") ||
        q.includes("alert")
    );
}

function isMyJobAlertIntent(q) {
    return (
        q.includes("my job alert") ||
        q.includes("my job alerts") ||
        q.includes("my alerts") ||
        q.includes("saved job alert") ||
        q.includes("saved job alerts") ||
        q.includes("active job alert") ||
        q.includes("active job alerts") ||
        q.includes("job alerts do i have") ||
        q.includes("alerts do i have")
    );
}

function isCollegeAndExamIntent(q) {
    return (
        isCollegeIntent(q) &&
        isExamIntent(q)
    );
}

function isMissingSkillsAndNextIntent(q) {
    return (
        isMissingSkillsIntent(q) &&
        isNextStepIntent(q)
    );
}

function isRoadmapSalaryFutureIntent(q) {
    return (
        isRoadmapIntent(q) &&
        isSalaryIntent(q) &&
        isFutureIntent(q)
    );
}

function isSuitabilityJobsCompaniesIntent(q) {
    return (
        isSuitabilityIntent(q) &&
        (
            isJobIntent(q) ||
            isLiveJobSearchIntent(q)
        ) &&
        isCompanyIntent(q)
    );
}

function getNormalizedEducation(student) {
    return normalize(student?.education);
}

function isBtechEducation(student) {
    const education =
        getNormalizedEducation(student);

    return (
        education === "btech" ||
        education === "b tech" ||
        education === "b tech degree" ||
        education === "bachelor of technology" ||
        education === "b.tech"
    );
}

function isDiplomaEducation(student) {
    const education =
        getNormalizedEducation(student);

    return (
        education === "polytechnic" ||
        education === "iti" ||
        education === "diploma"
    );
}

function isIntermediateEducation(student) {
    const education =
        getNormalizedEducation(student);

    return (
        education === "intermediate" ||
        education === "12th" ||
        education === "12" ||
        education === "after10th" ||
        education === "after 10th"
    );
}

function isDegreeEducation(student) {
    const education =
        getNormalizedEducation(student);

    return (
        education === "degree" ||
        education === "graduation" ||
        education === "bachelor"
    );
}

function getCollegeCategory(student) {
    if (isBtechEducation(student)) {
        return null;
    }

    if (isIntermediateEducation(student)) {
        return "intermediate";
    }

    if (isDiplomaEducation(student)) {
        return "diploma";
    }

    if (isDegreeEducation(student)) {
        return "degree";
    }

    const education =
        getNormalizedEducation(student);

    if (
        education === "medical" ||
        education === "mbbs"
    ) {
        return "medical";
    }

    return null;
}

function getCollegeRecordText(college) {
    if (!college) {
        return "";
    }

    const values = [];

    const addValue = (value) => {
        if (Array.isArray(value)) {
            value.forEach(addValue);
            return;
        }

        if (
            typeof value === "string" ||
            typeof value === "number"
        ) {
            values.push(String(value));
        }
    };

    [
        college.name,
        college.description,
        college.type,
        college.category,
        college.level,
        college.degree,
        college.degrees,
        college.course,
        college.courses,
        college.program,
        college.programs,
        college.stream,
        college.streams,
        college.branch,
        college.branches,
        college.department,
        college.departments,
        college.specialization,
        college.specializations,
        college.tags,
    ].forEach(addValue);

    return normalize(values.join(" "));
}

function isPostgraduateCollege(college) {
    const text =
        getCollegeRecordText(college);

    return (text.includes("postgraduate") ||text.includes("post graduate") ||text.includes(" m tech") ||text.includes("mtech") ||text.includes("mca") ||text.includes("mba") ||text.includes("master of technology") ||text.includes("master of computer applications") ||text.includes("master of business administration")
    );
}

function getAllCollegeCollections() {
    if (!collegesDatabase) {
        return [];
    }

    if (Array.isArray(collegesDatabase)) {
        return [
            {
                category: "all",
                colleges: collegesDatabase,
            },
        ];
    }

    if (
        typeof collegesDatabase !==
        "object"
    ) {
        return [];
    }

    return Object.entries(
        collegesDatabase
    )
        .filter(([, value]) =>
            Array.isArray(value)
        )
        .map(
            ([category, colleges]) => ({
                category,
                colleges,
            })
        );
}

function scoreCollege(
    college,
    student,
    career
) {
    const text =
        getCollegeRecordText(college);

    let score = 0;

    const specialization =
        normalize(
            student?.specialization
        );

    const state =
        normalize(student?.state);

    const careerName =
        normalize(
            career?.name ||
            student?.dreamCareer
        );

    const interest =
        normalize(student?.interest);

    if (
        specialization &&
        contains(
            text,
            specialization
        )
    ) {
        score += 40;
    }

    if (
        state &&
        contains(text, state)
    ) {
        score += 25;
    }

    if (
        careerName &&
        contains(text, careerName)
    ) {
        score += 25;
    }

    if (
        interest &&
        contains(text, interest)
    ) {
        score += 10;
    }

    return score;
}

function getCollegeRecommendations(
    student,
    career
) {
    if (!student) {
        return [];
    }

    if (isBtechEducation(student)) {
        const colleges =
            getAllCollegeCollections()
                .flatMap(
                    ({ colleges }) =>
                        Array.isArray(colleges)
                            ? colleges
                            : []
                )
                .filter(Boolean)
                .filter(
                    isPostgraduateCollege
                );

        const seen = new Set();

        return colleges
            .filter((college) => {
                const key = normalize(
                    college?.id ||
                    college?.name ||
                    JSON.stringify(college)
                );

                if (!key || seen.has(key)) {
                    return false;
                }

                seen.add(key);
                return true;
            })
            .map((college, index) => ({
                college,
                index,
                score: scoreCollege(
                    college,
                    student,
                    career
                ),
            }))
            .sort((a, b) =>
                b.score !== a.score
                    ? b.score - a.score
                    : a.index - b.index
            )
            .slice(0, 5)
            .map(
                (item) => item.college
            );
    }

    const category =
        getCollegeCategory(student);

    if (!category) {
        return [];
    }

    const colleges =
        collegesDatabase?.[category];

    if (
        !Array.isArray(colleges)
    ) {
        return [];
    }

    return colleges
        .filter(Boolean)
        .map((college, index) => ({
            college,
            index,
            score: scoreCollege(
                college,
                student,
                career
            ),
        }))
        .sort((a, b) =>
            b.score !== a.score
                ? b.score - a.score
                : a.index - b.index
        )
        .slice(0, 5)
        .map(
            (item) => item.college
        );
}

function getExamSearchText(exam) {
    if (!exam) {
        return "";
    }

    return normalize(
        [
            exam.name,
            exam.id,
            exam.category,
            exam.level,
            exam.eligibility,
            exam.description,
            exam.conductedBy,
            exam.stream,
            exam.streams,
            exam.course,
            exam.courses,
            exam.program,
            exam.programs,
            exam.tags,
        ].flat().join(" ")
    );
}

function getExamName(exam) {
    return normalize(exam?.name);
}

function isKnownPostgraduateExamName(
    exam
) {
    const name =
        getExamName(exam);

    const names = [
        "gate",
        "cat",
        "cmat",
        "mat",
        "xat",
        "nmat",
        "gmat",
        "atma",
        "mh cet mba",
        "ts icet",
        "ap icet",
        "cuet pg",
        "neet pg",
        "neet mds",
        "aiims pg",
        "inicet",
        "jipmer pg",
        "clat pg",
        "ailet pg",
    ];

    return names.some(
        (item) =>
            name === item ||
            name.includes(item)
    );
}

function isBachelorEligibleExam(
    exam
) {
    const eligibility =
        normalize(
            exam?.eligibility
        );

    if (!eligibility) {
        return false;
    }

    return (
        eligibility.includes(
            "bachelor"
        ) ||
        eligibility.includes(
            "bachelor's"
        ) ||
        eligibility.includes(
            "graduation"
        ) ||
        eligibility.includes(
            "graduate"
        ) ||
        eligibility.includes(
            "b.e"
        ) ||
        eligibility.includes(
            "be degree"
        ) ||
        eligibility.includes(
            "b tech"
        ) ||
        eligibility.includes(
            "btech"
        ) ||
        eligibility.includes(
            "engineering degree"
        ) ||
        eligibility.includes(
            "degree holder"
        )
    );
}

function isUndergraduateOrLateralExam(
    exam
) {
    if (!exam) {
        return false;
    }

    const name =
        getExamName(exam);

    const eligibility =
        normalize(
            exam?.eligibility
        );

    const category =
        normalize(exam?.category);

    const text =
        getExamSearchText(exam);

    const ugNames = [
        "jee main",
        "jee advanced",
        "eapcet",
        "eamcet",
        "viteee",
        "bitsat",
        "srmjeee",
        "wbjee",
        "mht cet",
        "mhtcet",
        "kcet",
        "comedk",
        "ugee",
    ];

    if (
        ugNames.some((item) =>
            name.includes(item)
        )
    ) {
        return true;
    }

    const lateralNames = [
        "ecet",
        "polyset",
        "polycet",
        "diploma entrance",
        "lateral entry",
    ];

    if (
        lateralNames.some((item) =>
            name.includes(item)
        )
    ) {
        return true;
    }

    if (
        eligibility.includes(
            "lateral"
        )
    ) {
        return true;
    }

    const ugIndicators = [
        "10+2",
        "10 2",
        "12th",
        "intermediate",
        "pcm",
        "pcb",
        "higher secondary",
        "class 12",
    ];

    return (
        ugIndicators.some(
            (indicator) =>
                eligibility.includes(
                    indicator
                )
        ) &&
        (
            category === "engineering" ||
            category === "medical" ||
            category === "design" ||
            category === "architecture" ||
            text.includes(
                "undergraduate"
            )
        )
    );
}

function getExamCategory(
    student,
    career
) {
    const education =
        getNormalizedEducation(student);

    const careerText =
        normalize(
            [
                career?.name,
                career?.category,
                career?.field,
                career?.stream,
                student?.dreamCareer,
                student?.interest,
                student?.specialization,
            ].join(" ")
        );

    if (isBtechEducation(student)) {
        if (
            careerText.includes(
                "management"
            ) ||
            careerText.includes("mba") ||
            careerText.includes(
                "business"
            )
        ) {
            return "Management";
        }

        if (
            careerText.includes(
                "computer"
            ) ||
            careerText.includes(
                "software"
            ) ||
            careerText.includes(
                "engineering"
            ) ||
            careerText.includes(
                "technology"
            ) ||
            careerText.includes("data") ||
            careerText.includes(
                "artificial intelligence"
            ) ||
            careerText.includes(
                "machine learning"
            ) ||
            careerText.includes(
                "cyber"
            )
        ) {
            return "Engineering";
        }

        return null;
    }

    if (
        education === "polytechnic" ||
        education === "diploma" ||
        education === "iti"
    ) {
        return "Engineering";
    }

    if (
        careerText.includes("medical") ||
        careerText.includes("doctor") ||
        careerText.includes("mbbs") ||
        careerText.includes("medicine")
    ) {
        return "Medical";
    }

    if (
        careerText.includes("law") ||
        careerText.includes("legal")
    ) {
        return "Law";
    }

    if (
        careerText.includes("design") ||
        careerText.includes("fashion")
    ) {
        return "Design";
    }

    if (
        careerText.includes(
            "architecture"
        ) ||
        careerText.includes(
            "architect"
        )
    ) {
        return "Architecture";
    }

    if (
        careerText.includes(
            "management"
        ) ||
        careerText.includes("mba") ||
        careerText.includes("mca")
    ) {
        return "Management";
    }

    if (
        careerText.includes(
            "agriculture"
        )
    ) {
        return "Agriculture";
    }

    if (
        careerText.includes("pharmacy")
    ) {
        return "Pharmacy";
    }

    return null;
}

function getPostBtechExamPathway(
    student,
    career,
    question = ""
) {
    if (
        !isBtechEducation(student) ||
        !Array.isArray(exams)
    ) {
        return [];
    }

    const q = normalize(question);

    const careerText =
        normalize(
            [
                career?.name,
                career?.category,
                career?.field,
                student?.dreamCareer,
                student?.specialization,
                student?.interest,
            ].join(" ")
        );

    const wantsMtech =
        q.includes("mtech") ||
        q.includes("m tech") ||
        q.includes("m.tech") ||
        q.includes(
            "postgraduate engineering"
        ) ||
        q.includes(
            "higher engineering"
        ) ||
        q.includes(
            "masters in engineering"
        ) ||
        q.includes(
            "masters in technology"
        ) ||
        careerText.includes(
            "software"
        ) ||
        careerText.includes(
            "engineering"
        ) ||
        careerText.includes(
            "computer"
        ) ||
        careerText.includes(
            "technology"
        ) ||
        careerText.includes("data") ||
        careerText.includes(
            "artificial intelligence"
        ) ||
        careerText.includes(
            "machine learning"
        ) ||
        careerText.includes(
            "cyber"
        );

    const wantsMca =
        q.includes("mca") ||
        q.includes(
            "master of computer applications"
        );

    const wantsMba =
        q.includes("mba") ||
        q.includes(
            "master of business administration"
        ) ||
        q.includes("management") ||
        q.includes("business school") ||
        careerText.includes(
            "management"
        ) ||
        careerText.includes(
            "business"
        );

    return exams
        .filter(Boolean)
        .filter(
            (exam) =>
                !isUndergraduateOrLateralExam(
                    exam
                )
        )
        .filter(
            (exam) =>
                isBachelorEligibleExam(
                    exam
                ) ||
                isKnownPostgraduateExamName(
                    exam
                ) ||
                normalize(
                    exam?.eligibility
                ).includes(
                    "postgraduate"
                ) ||
                normalize(
                    exam?.level
                ).includes(
                    "postgraduate"
                )
        )
        .map((exam, index) => {
            const name =
                getExamName(exam);

            const text =
                getExamSearchText(exam);

            const category =
                normalize(exam?.category);

            let score = 0;

            if (name.includes("gate")) {
                score += wantsMtech
                    ? 160
                    : 120;
            }

            if (name.includes("cat")) {
                score += wantsMba
                    ? 160
                    : 35;
            }

            if (name.includes("cmat")) {
                score += wantsMba
                    ? 150
                    : 30;
            }

            if (name.includes("mat")) {
                score += wantsMba
                    ? 145
                    : 25;
            }

            if (name.includes("xat")) {
                score += wantsMba
                    ? 145
                    : 25;
            }

            if (name.includes("nmat")) {
                score += wantsMba
                    ? 140
                    : 25;
            }

            if (name.includes("gmat")) {
                score += wantsMba
                    ? 135
                    : 20;
            }

            if (
                wantsMca &&
                (
                    name.includes("cuet pg") ||
                    text.includes("mca") ||
                    text.includes(
                        "computer applications"
                    )
                )
            ) {
                score += 150;
            }

            if (
                q.includes(name) ||
                name.includes(q)
            ) {
                score += 80;
            }

            if (
                wantsMtech &&
                category === "engineering"
            ) {
                score += 40;
            }

            if (
                wantsMba &&
                (
                    category ===
                        "management" ||
                    text.includes(
                        "management"
                    ) ||
                    text.includes("mba")
                )
            ) {
                score += 50;
            }

            if (
                student?.specialization &&
                contains(
                    text,
                    student.specialization
                )
            ) {
                score += 25;
            }

            if (
                career?.name &&
                contains(
                    text,
                    career.name
                )
            ) {
                score += 20;
            }

            return {
                exam,
                index,
                score,
            };
        })
        .filter(
            (item) => item.score > 0
        )
        .sort((a, b) =>
            b.score !== a.score
                ? b.score - a.score
                : a.index - b.index
        )
        .slice(0, 5)
        .map(
            (item) => item.exam
        );
}

function isExamEligibleForStudent(
    exam,
    student
) {
    if (!exam || !student) {
        return false;
    }

    const eligibility =
        normalize(exam?.eligibility);

    if (isBtechEducation(student)) {
        if (
            isUndergraduateOrLateralExam(
                exam
            )
        ) {
            return false;
        }

        return (
            isKnownPostgraduateExamName(
                exam
            ) ||
            isBachelorEligibleExam(
                exam
            ) ||
            eligibility.includes(
                "postgraduate"
            ) ||
            normalize(
                exam?.level
            ).includes("postgraduate")
        );
    }

    if (isDiplomaEducation(student)) {
        return (
            eligibility.includes("diploma") ||
            eligibility.includes("b.sc") ||
            eligibility.includes("12th")
        );
    }

    if (isIntermediateEducation(student)) {
        return (
            eligibility.includes("12th") ||
            eligibility.includes("12") ||
            eligibility.includes("10+2") ||
            eligibility.includes("10 2")
        );
    }

    if (isDegreeEducation(student)) {
        return (
            eligibility.includes(
                "bachelor"
            ) ||
            eligibility.includes(
                "graduation"
            ) ||
            eligibility.includes(
                "graduate"
            )
        );
    }

    return true;
}

function scoreExam(
    exam,
    student,
    career
) {
    if (
        !isExamEligibleForStudent(
            exam,
            student
        )
    ) {
        return 0;
    }

    const category =
        getExamCategory(
            student,
            career
        );

    const examCategory =
        normalize(exam?.category);

    const examText =
        getExamSearchText(exam);

    const examName =
        getExamName(exam);

    let score = 0;

    if (
        category &&
        examCategory ===
            normalize(category)
    ) {
        score += 50;
    }

    const careerName =
        normalize(
            career?.name ||
            student?.dreamCareer
        );

    if (
        careerName &&
        contains(
            examText,
            careerName
        )
    ) {
        score += 30;
    }

    if (
        student?.specialization &&
        contains(
            examText,
            student.specialization
        )
    ) {
        score += 20;
    }

    if (
        student?.interest &&
        contains(
            examText,
            student.interest
        )
    ) {
        score += 10;
    }

    if (
        student?.state &&
        contains(
            examText,
            student.state
        )
    ) {
        score += 20;
    }

    if (isBtechEducation(student)) {
        if (examName.includes("gate")) {
            score += 100;
        }

        if (
            examName.includes("mtech") ||
            examText.includes("m tech") ||
            examText.includes(
                "master of technology"
            )
        ) {
            score += 70;
        }

        if (
            examName.includes("cat") ||
            examName.includes("cmat") ||
            examName.includes("mat") ||
            examName.includes("xat") ||
            examName.includes("nmat") ||
            examName.includes("gmat")
        ) {
            score += 25;
        }
    }

    return score;
}

function getExamRecommendations(
    student,
    career,
    question = ""
) {
    if (
        !student ||
        !Array.isArray(exams)
    ) {
        return [];
    }

    /*
     * B.Tech students must use postgraduate pathways.
     * This prevents undergraduate exams such as JEE,
     * EAPCET, VITEEE, BITSAT, POLYCET and ECET
     * from being recommended after completion of B.Tech.
     */
    if (isBtechEducation(student)) {
        const postBtech =
            getPostBtechExamPathway(
                student,
                career,
                question
            );

        if (postBtech.length) {
            return postBtech;
        }

        return [];
    }

    return exams
        .filter(Boolean)
        .map((exam, index) => ({
            exam,
            index,
            score: scoreExam(
                exam,
                student,
                career
            ),
        }))
        .filter(
            (item) =>
                item.score > 0
        )
        .sort((a, b) =>
            b.score !== a.score
                ? b.score - a.score
                : a.index - b.index
        )
        .slice(0, 5)
        .map(
            (item) =>
                item.exam
        );
}

function getJeeResponse(student) {
    if (!student) {
        return (
            "📝 JEE eligibility\n\n" +
            "JEE Main and JEE Advanced are primarily undergraduate engineering entrance examinations.\n\n" +
            "Complete your CareerOS profile for personalized guidance."
        );
    }

    if (isBtechEducation(student)) {
        return `📝 Can you write JEE after B.Tech?

🎓 Your Education:
${student.education || "B.Tech"}

📚 Specialization:
${student.specialization || "Not specified"}

🎯 Career Goal:
${student.dreamCareer || "Not specified"}

❌ JEE Main / JEE Advanced are not the appropriate next-step entrance exams for a completed B.Tech degree.

JEE is primarily used for undergraduate engineering admission.

For postgraduate engineering after B.Tech, look for pathways such as M.Tech where an appropriate examination such as GATE may be relevant when available in CareerOS.

CareerOS will not recommend JEE as a postgraduate pathway for your profile.`;
    }

    return `📝 JEE guidance

JEE is primarily an undergraduate engineering entrance pathway.

Based on your current education level, CareerOS will recommend JEE only when appropriate for your undergraduate admission path.`;
}

function getCollegeResponse(
    student,
    career
) {
    if (!student) {
        return (
            "🏫 I need your student profile to recommend colleges.\n\n" +
            "Please complete your education, specialization and career goal first."
        );
    }

    const colleges =
        getCollegeRecommendations(
            student,
            career
        );

    if (isBtechEducation(student)) {
        if (!colleges.length) {
            return `🏫 College Guidance After B.Tech

🎓 Education:
${student.education || "B.Tech"}

📚 Specialization:
${student.specialization || "Not specified"}

🎯 Career Goal:
${student.dreamCareer || career?.name || "Not specified"}

Your B.Tech degree is already an undergraduate qualification, so CareerOS will not recommend undergraduate engineering colleges.

No suitable postgraduate college records are currently available in the CareerOS college database.

💡 You can consider M.Tech, MCA or MBA depending on your goal.`;
        }

        return `🏫 Postgraduate Colleges Recommended For You

🎓 Education:
${student.education || "B.Tech"}

📚 Specialization:
${student.specialization || "Not specified"}

🎯 Career Goal:
${student.dreamCareer || career?.name || "Not specified"}

Recommended postgraduate colleges:

${colleges
    .map(
        (college, index) =>
            `${index + 1}. ${
                college?.name ||
                "College"
            }`
    )
    .join("\n")}

💡 Undergraduate engineering colleges are excluded for completed B.Tech students.`;
    }

    if (!colleges.length) {
        return `🏫 I couldn't find matching colleges in the CareerOS college database yet.

🎓 Education:
${student.education || "Not specified"}

📚 Specialization:
${student.specialization || "Not specified"}

🎯 Career Goal:
${student.dreamCareer || career?.name || "Not specified"}

The Mentor only recommends colleges appropriate for your current education path.`;
    }

    return `🏫 Colleges Recommended For You

🎓 Education:
${student.education || "Not specified"}

📚 Specialization:
${student.specialization || "Not specified"}

🎯 Career Goal:
${student.dreamCareer || career?.name || "Not specified"}

Recommended colleges:

${colleges
    .map(
        (college, index) =>
            `${index + 1}. ${
                college?.name ||
                "College"
            }`
    )
    .join("\n")}

💡 These recommendations are selected from the CareerOS college database.`;
}

function getExamResponse(
    student,
    career,
    question = ""
) {
    if (!student) {
        return (
            "📝 I need your student profile to recommend entrance exams.\n\n" +
            "Please complete your education, specialization and career goal first."
        );
    }

    const recommendedExams =
        getExamRecommendations(
            student,
            career,
            question
        );

    if (isBtechEducation(student)) {
        if (!recommendedExams.length) {
            return `📝 Entrance Exam Guidance After B.Tech

🎓 Education:
${student.education || "B.Tech"}

📚 Specialization:
${student.specialization || "Not specified"}

🎯 Career Goal:
${student.dreamCareer || career?.name || "Not specified"}

No suitable postgraduate entrance exam is currently available in the CareerOS exam database.

❌ CareerOS will not recommend undergraduate or lateral-entry exams such as JEE Main, JEE Advanced, AP EAPCET, VITEEE, BITSAT, POLYCET or ECET for a completed B.Tech profile.

💡 For M.Tech, MCA or MBA, CareerOS will recommend the relevant exam when it is available in its database.`;
        }

        return `📝 Entrance Exams Recommended After B.Tech

🎓 Education:
${student.education || "B.Tech"}

📚 Specialization:
${student.specialization || "Not specified"}

🎯 Career Goal:
${student.dreamCareer || career?.name || "Not specified"}

Recommended postgraduate exams:

${recommendedExams
    .map(
        (exam, index) =>
            `${index + 1}. ${
                exam?.name ||
                "Entrance Exam"
            }`
    )
    .join("\n\n")}

💡 These exams are selected from the CareerOS exam database.`;
    }

    if (!recommendedExams.length) {
        return `📝 I couldn't find a matching entrance exam in the CareerOS exam database yet.

🎓 Education:
${student.education || "Not specified"}

📚 Specialization:
${student.specialization || "Not specified"}

🎯 Career Goal:
${student.dreamCareer || career?.name || "Not specified"}`;
    }

    return `📝 Entrance Exams Recommended For You

🎓 Education:
${student.education || "Not specified"}

📚 Specialization:
${student.specialization || "Not specified"}

🎯 Career Goal:
${student.dreamCareer || career?.name || "Not specified"}

Recommended exams:

${recommendedExams
    .map(
        (exam, index) =>
            `${index + 1}. ${
                exam?.name ||
                "Entrance Exam"
            }`
    )
    .join("\n\n")}

💡 These exams are selected dynamically from the CareerOS entrance-exam database.`;
}

function getCollegeAndExamResponse(
    student,
    career,
    question = ""
) {
    if (!student) {
        return (
            "🏫📝 I need your student profile to recommend colleges and entrance exams."
        );
    }

    const collegeResponse =
        getCollegeResponse(
            student,
            career
        );

    const examResponse =
        getExamResponse(
            student,
            career,
            question
        );

    return (
        collegeResponse +
        "\n\n━━━━━━━━━━━━━━━━━━━━\n\n" +
        examResponse
    );
}

function getLearnNextResponse(
    student,
    career
) {
    if (!career) {
        return (
            "📚 Tell me which career you want to prepare for."
        );
    }

    const recommendations =
        student
            ? recommendCareers(student)
            : [];

    const found =
        recommendations.find(
            (item) =>
                item?.id ===
                career?.id
        );

    const missingSkills =
        getArrayValue(
            found?.missingSkills
        );

    if (!missingSkills.length) {
        return `🚀 You're doing well for **${career.name}**!

I couldn't identify any major missing skills from your current profile.

Keep strengthening your existing skills, build real projects and prepare for interviews.`;
    }

    return `🚀 What you should learn next for **${career.name}**

📖 Priority Skills:
${missingSkills
    .slice(0, 5)
    .map(
        (skill, index) =>
            `${index + 1}. ${skill}`
    )
    .join("\n")}

💡 Recommended approach:

1. Learn the fundamentals.
2. Practice with small exercises.
3. Build a real project.
4. Add the project to your portfolio.
5. Move to the next skill.`;
}

function getMissingSkillsResponse(
    student,
    career
) {
    if (!career) {
        return (
            "🛠 Tell me which career you want to improve for."
        );
    }

    const recommendations =
        student
            ? recommendCareers(student)
            : [];

    const found =
        recommendations.find(
            (item) =>
                item?.id ===
                career?.id
        );

    const matchedSkills =
        getArrayValue(
            found?.matchedSkills
        );

    const missingSkills =
        getArrayValue(
            found?.missingSkills
        );

    return `🎯 How you can improve for **${career.name}**

🛠 Skills You Already Have:
${formatList(matchedSkills)}

📖 Skills You Should Develop:
${formatList(missingSkills)}

🚀 Recommended next step:
Start with the first missing skill, practice it and build a project around it.`;
}

function getMissingSkillsAndNextResponse(
    student,
    career
) {
    if (!career) {
        return (
            "🛠 Tell me which career you want to improve for."
        );
    }

    const recommendations =
        student
            ? recommendCareers(student)
            : [];

    const found =
        recommendations.find(
            (item) =>
                item?.id ===
                career?.id
        );

    const matchedSkills =
        getArrayValue(
            found?.matchedSkills
        );

    const missingSkills =
        getArrayValue(
            found?.missingSkills
        );

    const nextSkills =
        missingSkills.slice(0, 5);

    return `🎯 How you can improve for **${career.name}**

🛠 Skills You Already Have:
${formatList(matchedSkills)}

📖 Skills You Should Develop:
${formatList(missingSkills)}

━━━━━━━━━━━━━━━━━━━━

🚀 What you should learn next for **${career.name}**

📖 Priority Skills:
${
    nextSkills.length
        ? nextSkills
            .map(
                (skill, index) =>
                    `${index + 1}. ${skill}`
            )
            .join("\n")
        : "No additional missing skills were identified."
}

💡 Recommended approach:

1. Learn the fundamentals.
2. Practice with small exercises.
3. Build a real project.
4. Add the project to your portfolio.
5. Move to the next skill.`;
}

function getFutureResponse(
    student,
    career
) {
    if (!career) {
        return (
            "📈 Tell me which career you want to know about."
        );
    }

    let futureDemand =
        career?.futureDemand;

    if (student) {
        const found =
            recommendCareers(
                student
            ).find(
                (item) =>
                    item?.id ===
                    career?.id
            );

        if (
            found?.futureDemand !==
                undefined &&
            found?.futureDemand !==
                null
        ) {
            futureDemand =
                found.futureDemand;
        }
    }

    return `📈 Career growth for **${career.name}**

🚀 Growth:
${career.growth || "Not specified"}

📊 Future Demand:
${
    futureDemand !== undefined &&
    futureDemand !== null &&
    String(futureDemand).trim()
        ? typeof futureDemand === "number"
            ? `${futureDemand}%`
            : futureDemand
        : "Career demand information is not available in the CareerOS database"
}

💡 The long-term outlook depends on industry demand, skills, specialization and experience.`;
}

function getRoadmapSalaryFutureResponse(
    student,
    career
) {
    if (!career) {
        return (
            "🗺 Tell me which career you want to explore."
        );
    }

    const roadmap =
        getArrayValue(
            career.roadmap
        );

    let response =
        `🗺 Roadmap to become a **${career.name}**\n\n`;

    response += roadmap.length
        ? roadmap
            .map(
                (step, index) =>
                    `${index + 1}. ${
                        typeof step ===
                        "string"
                            ? step
                            : step?.title ||
                              step?.name ||
                              "Roadmap step"
                    }`
            )
            .join("\n")
        : "A detailed roadmap is not available in the CareerOS database yet.";

    response += `

🚀 Follow the steps gradually and build projects along the way.

━━━━━━━━━━━━━━━━━━━━

💰 Salary information for **${career.name}**

Average Salary:
${career.averageSalary || "Not available"}

🚀 Growth:
${career.growth || "Not specified"}

Salary can vary based on skills, experience, company, location and specialization.

━━━━━━━━━━━━━━━━━━━━

${getFutureResponse(
    student,
    career
)}`;

    return response;
}

function getJobRolesResponse(career) {
    if (!career) {
        return (
            "💼 Tell me which career you want to explore."
        );
    }

    const jobRoles =
        getArrayValue(
            career.jobRoles
        );

    const roles =
        jobRoles.length
            ? jobRoles
            : getArrayValue(
                  career.roles
              ).length
                ? getArrayValue(
                      career.roles
                  )
                : getArrayValue(
                      career.jobs
                  );

    if (!roles.length) {
        return `💼 Job opportunities for **${career.name}**

A detailed job-role list is not available in the career database yet.

You can explore current opportunities through the CareerOS Jobs section.`;
    }

    return `💼 Jobs you can get as a **${career.name}**

${roles
    .map(
        (role, index) =>
            `${index + 1}. ${role}`
    )
    .join("\n")}

🚀 Your exact opportunities depend on your skills, experience and specialization.`;
}

function getCompanyResponse(career) {
    const companies =
        getArrayValue(
            career?.topCompanies
        ).length
            ? getArrayValue(
                  career?.topCompanies
              )
            : getArrayValue(
                  career?.companies
              );

    if (companies.length) {
        return `🏢 Top companies for **${career.name}**

${companies.join(", ")}`;
    }

    return (
        "🏢 Visit the Companies section to explore companies according to your career."
    );
}

function getSuitabilityJobsCompaniesResponse(
    student,
    career
) {
    if (!student) {
        return (
            "🎯 I need your student profile to assess your career match."
        );
    }

    if (!career) {
        return (
            "🤖 Tell me the career you are interested in."
        );
    }

    const recommendations =
        recommendCareers(
            student
        );

    const found =
        recommendations.find(
            (item) =>
                item?.id ===
                career?.id
        );

    const score =
        found?.score || 0;

    const missingSkills =
        getArrayValue(
            found?.missingSkills
        );

    return `🎯 Career Match

**${career.name}**

✅ Match Score:
${score}%

📚 Education:
${student.education || "Not specified"}

❤️ Interest:
${student.interest || "Not specified"}

🛠 Your Skills:
${formatList(student.skills)}

📖 Skills to Learn:
${formatList(missingSkills)}

🚀 Growth:
${career.growth || "Not specified"}

━━━━━━━━━━━━━━━━━━━━

${getJobRolesResponse(
    career
)}

━━━━━━━━━━━━━━━━━━━━

${getCompanyResponse(
    career
)}

🚀 Keep improving your skills and building projects to increase your career readiness.`;
}

function getJobTitle(job) {
    return (
        job?.title ||
        job?.job_title ||
        job?.name ||
        "Job title not specified"
    );
}

function getJobCompany(job) {
    if (
        typeof job?.company ===
        "string"
    ) {
        return job.company;
    }

    return (
        job?.company?.display_name ||
        job?.company?.name ||
        job?.employer?.name ||
        "Company not specified"
    );
}

function getJobLocation(job) {
    if (
        typeof job?.location ===
        "string"
    ) {
        return job.location;
    }

    return (
        job?.location?.display_name ||
        job?.location?.name ||
        job?.location?.area?.join(", ") ||
        "Location not specified"
    );
}

function getJobSalary(job) {
    return (
        job?.detected_salary ||
        job?.salary ||
        job?.salary_display ||
        ""
    );
}

function getJobExperience(job) {
    return (
        job?.detected_experience ||
        job?.experience ||
        "Any Experience"
    );
}

function getJobType(job) {
    return (
        job?.detected_job_type ||
        job?.job_type ||
        job?.jobType ||
        job?.contract_type ||
        job?.contract_time ||
        "Any Type"
    );
}

function getJobWorkMode(job) {
    return (
        job?.detected_work_mode ||
        job?.workMode ||
        job?.work_mode ||
        "Not specified"
    );
}

function getJobUrl(job) {
    return (
        job?.redirect_url ||
        job?.url ||
        job?.apply_url ||
        ""
    );
}

function getJobSearchText(job) {
    return normalize(
        [
            getJobTitle(job),
            getJobCompany(job),
            getJobLocation(job),
            job?.description,
            job?.category,
            job?.category?.label,
            job?.skills,
            job?.tags,
        ]
            .flat()
            .filter(Boolean)
            .join(" ")
    );
}

function extractJobs(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (
        Array.isArray(
            response?.jobs
        )
    ) {
        return response.jobs;
    }

    if (
        Array.isArray(
            response?.results
        )
    ) {
        return response.results;
    }

    if (
        Array.isArray(
            response?.data
        )
    ) {
        return response.data;
    }

    return [];
}

function getJobQuery(
    question,
    student,
    career
) {
    const q = normalize(question);

    const genericPhrases = [
        "find jobs for me",
        "search jobs for me",
        "show jobs for me",
        "show me jobs",
        "show latest jobs",
        "find latest jobs",
        "search latest jobs",
        "latest jobs",
        "latest job",
        "available jobs",
        "job openings",
        "open jobs",
        "current jobs",
        "current openings",
        "hiring now",
        "jobs available",
        "jobs for me",
        "jobs matching",
        "opportunities for me",
        "find jobs",
        "search jobs",
        "show jobs",
        "jobs",
        "job"
    ];

    let cleaned = q;

    genericPhrases.forEach(
        (phrase) => {
            cleaned =
                cleaned.replace(
                    phrase,
                    " "
                );
        }
    );

    cleaned = cleaned
        .replace(
            /\bfind\b/g,
            " "
        )
        .replace(
            /\bsearch\b/g,
            " "
        )
        .replace(
            /\bshow\b/g,
            " "
        )
        .replace(
            /\bget\b/g,
            " "
        )
        .replace(
            /\bme\b/g,
            " "
        )
        .replace(
            /\bfor\b/g,
            " "
        )
        .replace(
            /\bthe\b/g,
            " "
        )
        .replace(
            /\blatest\b/g,
            " "
        )
        .replace(
            /\bcurrent\b/g,
            " "
        )
        .replace(
            /\bavailable\b/g,
            " "
        )
        .replace(
            /\bopenings\b/g,
            " "
        )
        .replace(
            /\bopening\b/g,
            " "
        )
        .replace(
            /\bopportunities\b/g,
            " "
        )
        .replace(
            /\bin india\b/g,
            " "
        )
        .replace(
            /\bnear india\b/g,
            " "
        )
        .replace(
            /\bin my area\b/g,
            " "
        )
        .replace(
            /\bnear me\b/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

    if (
        cleaned &&
        cleaned.length > 2
    ) {
        return cleaned;
    }

    return (
        career?.name ||
        student?.dreamCareer ||
        "software engineer"
    );
}

function getJobSearchLocation(
    question,
    student
) {
    const q = normalize(question);

    const knownLocations = [
        "hyderabad",
        "bangalore",
        "bengaluru",
        "chennai",
        "mumbai",
        "delhi",
        "new delhi",
        "pune",
        "kolkata",
        "ahmedabad",
        "gurgaon",
        "gurugram",
        "noida",
        "kochi",
        "jaipur",
        "india",
        "remote",
    ];

    const found =
        knownLocations.find(
            (location) =>
                q.includes(location)
        );

    if (found) {
        return found;
    }

    return (
        student?.state?.trim() ||
        "India"
    );
}

function scoreLiveJob(
    job,
    student,
    career,
    query
) {
    const text =
        getJobSearchText(job);

    let score = 0;

    if (
        query &&
        contains(text, query)
    ) {
        score += 50;
    }

    const careerName =
        normalize(career?.name);

    if (
        careerName &&
        contains(
            text,
            careerName
        )
    ) {
        score += 35;
    }

    const specialization =
        normalize(
            student?.specialization
        );

    if (
        specialization &&
        contains(
            text,
            specialization
        )
    ) {
        score += 20;
    }

    const skills =
        Array.isArray(student?.skills)
            ? student.skills
            : typeof student?.skills ===
                "string"
              ? student.skills.split(",")
              : [];

    skills.forEach(
        (skill) => {
            if (
                contains(
                    text,
                    skill
                )
            ) {
                score += 5;
            }
        }
    );

    return score;
}

function formatLiveJob(
    job,
    index
) {
    const title =
        getJobTitle(job);

    const company =
        getJobCompany(job);

    const location =
        getJobLocation(job);

    const salary =
        getJobSalary(job);

    const experience =
        getJobExperience(job);

    const workMode =
        getJobWorkMode(job);

    const jobType =
        getJobType(job);

    const url =
        getJobUrl(job);

    let result =
        `${index + 1}. ${title}\n` +
        `   🏢 Company: ${company}\n` +
        `   📍 Location: ${location}`;

    if (workMode) {
        result +=
            `\n   🏠 Work Mode: ${workMode}`;
    }

    if (experience) {
        result +=
            `\n   🎓 Experience: ${experience}`;
    }

    if (jobType) {
        result +=
            `\n   💼 Type: ${jobType}`;
    }

    if (salary) {
        result +=
            `\n   💰 Salary: ${salary}`;
    }

    if (url) {
        result +=
            `\n   🔗 Apply: ${url}`;
    }

    return result;
}

async function getLiveJobsResponse(
    question,
    student,
    career
) {
    const query =
        getJobQuery(
            question,
            student,
            career
        );

    const location =
        getJobSearchLocation(
            question,
            student
        );

    try {
        const response =
            await getJobs({
                career: query,
                location,
                page: 1,
                experience:
                    "Any Experience",
                jobType: "Any Type",
                workMode: "Any",
                salary: "Any Salary"
            });

        const jobs =
            extractJobs(response);

        if (!jobs.length) {
            return `💼 No current jobs were found for **${query}** in **${location}**.

Try another job title, skill or location.

Examples:
• Find React developer jobs
• Show Python jobs in Hyderabad
• Find software engineer jobs
• Show data analyst jobs`;
        }

        const ranked =
            jobs
                .map(
                    (job, index) => ({
                        job,
                        index,
                        score:
                            scoreLiveJob(
                                job,
                                student,
                                career,
                                query
                            )
                    })
                )
                .sort(
                    (a, b) => {
                        if (
                            b.score !==
                            a.score
                        ) {
                            return (
                                b.score -
                                a.score
                            );
                        }

                        return (
                            a.index -
                            b.index
                        );
                    }
                )
                .slice(0, 8)
                .map(
                    (item) =>
                        item.job
                );

        return `💼 Current CareerOS Job Opportunities

🎯 Search:
${query}

📍 Location:
${location}

Found ${jobs.length} job${
            jobs.length === 1
                ? ""
                : "s"
        }.

${ranked
    .map(formatLiveJob)
    .join("\n\n")}

━━━━━━━━━━━━━━━━━━━━

💡 These opportunities are fetched through CareerOS's Jobs service. Availability can change, so check the application link before applying.`;
    } catch (error) {
        console.error(
            "CareerOS Mentor Job Search Error:",
            error
        );

        return `💼 Job Search

I couldn't load current job opportunities right now.

🎯 Search:
${query}

📍 Location:
${location}

Please open the CareerOS Jobs section and try again.`;
    }
}

function formatAlert(
    alert,
    index
) {
    const keyword =
        alert?.keyword ||
        "Any job";

    const location =
        alert?.location ||
        "India";

    const experience =
        alert?.experience ||
        "Any Experience";

    const jobType =
        alert?.jobType ||
        "Any Type";

    const workMode =
        alert?.workMode ||
        "Any";

    const salary =
        alert?.salary ||
        "Any Salary";

    const enabled =
        alert?.enabled !== false;

    return `${index + 1}. ${keyword}
   📍 Location: ${location}
   🎓 Experience: ${experience}
   💼 Type: ${jobType}
   🏠 Work Mode: ${workMode}
   💰 Salary: ${salary}
   🔔 Status: ${
       enabled
           ? "Active"
           : "Disabled"
   }`;
}

async function getJobAlertsResponse() {
    try {
        const alerts =
            await getJobAlerts();

        if (!alerts.length) {
            return `🔔 Job Alerts

You currently don't have any saved job alerts.

You can create a job alert from the CareerOS Jobs / Job Alerts section.

For example:
• Software Engineer
• React Developer
• Data Analyst
• Python Developer`;
        }

        return `🔔 Your CareerOS Job Alerts

You have ${alerts.length} saved job alert${
            alerts.length === 1
                ? ""
                : "s"
        }.

${alerts
    .map(formatAlert)
    .join("\n\n")}

━━━━━━━━━━━━━━━━━━━━

💡 Active alerts can be used by CareerOS to identify matching job opportunities.`;
    } catch (error) {
        console.error(
            "CareerOS Mentor Job Alert Error:",
            error
        );

        return `🔔 Job Alerts

I couldn't load your job alerts right now.

Please open the CareerOS Job Alerts section and try again.`;
    }
}

async function getJobAlertAndJobsResponse(
    question,
    student,
    career
) {
    const alertResponse =
    await getJobAlertsResponse();

    const jobResponse =
        await getLiveJobsResponse(
            question,
            student,
            career
        );

    return `${alertResponse}

━━━━━━━━━━━━━━━━━━━━

${jobResponse}`;
}

function isKnownMentorIntent(q) {
    return (
        isGreeting(q) ||
        isJeeIntent(q) ||
        isRecommendationIntent(q) ||
        isMyJobAlertIntent(q) ||
        isJobAlertIntent(q) ||
        isLiveJobSearchIntent(q) ||
        isMissingSkillsAndNextIntent(q) ||
        isRoadmapSalaryFutureIntent(q) ||
        isCollegeAndExamIntent(q) ||
        isSuitabilityJobsCompaniesIntent(q) ||
        isRoadmapIntent(q) ||
        isNextStepIntent(q) ||
        isMissingSkillsIntent(q) ||
        isSuitabilityIntent(q) ||
        isCollegeIntent(q) ||
        isExamIntent(q) ||
        isFutureIntent(q) ||
        isJobIntent(q) ||
        isSkillsIntent(q) ||
        isSalaryIntent(q) ||
        isCompanyIntent(q) ||
        Boolean(findCareer(q))
    );
}

function getUnknownQuestionResponse() {
    return `🤖 I couldn't understand that question yet.

I can help you with CareerOS topics such as:

🎯 Career Guidance
• Recommend a career
• What career suits me?
• Can I become a Software Engineer?

🛠 Skills & Learning
• What skills do I need?
• What skills am I missing?
• What should I learn next?
• Show me the roadmap

🏫 Education
• Which colleges are suitable for me?
• Which entrance exams can I write?
• Can I write JEE after B.Tech?

💰 Career Information
• What is the salary of a Software Engineer?
• What is the future of Data Analyst?
• Which companies hire React Developers?

💼 Jobs
• What jobs can I get?
• Find jobs for me
• Show Software Engineer jobs
• Show latest jobs

🔔 Job Alerts
• What job alerts do I have?
• Show my job alerts

Please ask me a CareerOS-related question and I'll help you.`;
}

export async function getBotReply(
    question,
    student = null
) {
    const q = normalize(question);

    if (!q) {
        return (
            "🤖 Please ask me a career-related question."
        );
    }
    if (!isKnownMentorIntent(q)) {
        return getUnknownQuestionResponse();
    }

   

    /*
     * Keep the previous mentor career available
     * for follow-up questions such as:
     *
     * "what exams are needed?"
     * "which colleges?"
     * "what salary?"
     *
     * when the user does not repeat the career name.
     */
    const contextCareer =
        getContextCareer(
            student,
            q
        );

    const detectedCareer =
        getConversationAwareCareer(
            q,
            student
        );

    /*
     * Prefer the newly detected career.
     * Otherwise continue with the previous
     * conversation career.
     */
    const career =
        detectedCareer ||
        contextCareer ||
        null;

    const intent =
        detectMentorIntent(q);

    if (career) {
        saveMentorContext(
            student,
            {
                career,
                intent,
                question: q,
            }
        );
    }

    if (isGreeting(q)) {
        return (
            "👋 Hello! I'm your CareerOS AI Mentor. Ask me about careers, skills, roadmaps, colleges, exams, salaries, jobs or job alerts."
        );
    }

    if (isJeeIntent(q)) {
        return getJeeResponse(
            student
        );
    }

    if (
        student &&
        isRecommendationIntent(q)
    ) {
        const recommendations =
            recommendCareers(
                student
            );

        if (!recommendations.length) {
            return (
                "🤖 I couldn't generate a career recommendation from your profile yet."
            );
        }

        const top =
            recommendations[0];

        saveMentorContext(
            student,
            {
                career: top,
                intent,
                question: q,
            }
        );

        return `🎯 Based on your profile, I recommend **${top.name}**.

✅ Match Score: ${top.score}%

📚 Education:
${student.education || "Not specified"}

❤️ Interest:
${student.interest || "Not specified"}

🛠 Matched Skills:
${formatList(top.matchedSkills)}

📖 Skills to Learn:
${formatList(top.missingSkills)}

🚀 Growth:
${top.growth || "Not specified"}

💰 Average Salary:
${top.averageSalary || "N/A"}

📈 Placement Readiness:
${top.placementChance || 0}%

Keep learning the required skills and build real projects to improve your chances.`;
    }

    if (
        isMyJobAlertIntent(q)
    ) {
        return getJobAlertsResponse();
    }

    if (
        isJobAlertIntent(q) &&
        isLiveJobSearchIntent(q)
    ) {
        return getJobAlertAndJobsResponse(
            q,
            student,
            career
        );
    }

    if (isLiveJobSearchIntent(q)) {
        return getLiveJobsResponse(
            q,
            student,
            career
        );
    }

    if (
        student &&
        isMissingSkillsAndNextIntent(q)
    ) {
        return getMissingSkillsAndNextResponse(
            student,
            career
        );
    }

    if (
        isRoadmapSalaryFutureIntent(q)
    ) {
        return getRoadmapSalaryFutureResponse(
            student,
            career
        );
    }

    /*
     * College + exam intent must be handled
     * before the individual college/exam intents.
     *
     * This allows:
     * "Which colleges and entrance exams
     * are suitable for me?"
     *
     * to return BOTH datasets in one response.
     */
    if (
        isCollegeAndExamIntent(q)
    ) {
        return getCollegeAndExamResponse(
            student,
            career,
            q
        );
    }

    if (
        student &&
        isSuitabilityJobsCompaniesIntent(q)
    ) {
        return getSuitabilityJobsCompaniesResponse(
            student,
            career
        );
    }

    if (isRoadmapIntent(q)) {
        if (!career) {
            return (
                "🗺 Tell me which career you want a roadmap for."
            );
        }

        const roadmap =
            getArrayValue(
                career.roadmap
            );

        return `🗺 Roadmap to become a **${career.name}**

${
    roadmap.length
        ? roadmap
            .map(
                (step, index) =>
                    `${index + 1}. ${
                        typeof step ===
                        "string"
                            ? step
                            : step?.title ||
                              step?.name ||
                              "Roadmap step"
                    }`
            )
            .join("\n")
        : "A detailed roadmap is not available yet."
}

🚀 Follow the steps gradually and build projects along the way.`;
    }

    if (
        student &&
        isNextStepIntent(q)
    ) {
        return getLearnNextResponse(
            student,
            career
        );
    }

    if (
        student &&
        isMissingSkillsIntent(q)
    ) {
        return getMissingSkillsResponse(
            student,
            career
        );
    }

    if (
        student &&
        isSuitabilityIntent(q)
    ) {
        if (!career) {
            return (
                "🤖 Tell me the career you are interested in."
            );
        }

        const found =
            recommendCareers(
                student
            ).find(
                (item) =>
                    item?.id ===
                    career?.id
            );

        return `🎯 Career Match

**${career.name}**

✅ Match Score:
${found?.score || 0}%

📚 Education:
${student.education || "Not specified"}

❤️ Interest:
${student.interest || "Not specified"}

🛠 Your Skills:
${formatList(student.skills)}

📖 Skills to Learn:
${formatList(found?.missingSkills)}

🚀 Growth:
${career.growth || "High"}

Keep improving your skills and building projects to increase your career readiness.`;
    }

    if (isCollegeIntent(q)) {
        return getCollegeResponse(
            student,
            career
        );
    }

    if (isExamIntent(q)) {
        return getExamResponse(
            student,
            career,
            q
        );
    }

    if (isFutureIntent(q)) {
        return getFutureResponse(
            student,
            career
        );
    }

    if (isJobIntent(q)) {
        return getJobRolesResponse(
            career
        );
    }

    if (isSkillsIntent(q)) {
        if (!career) {
            return (
                "🛠 Tell me a career name and I can show you the required skills."
            );
        }

        return `🛠 Skills required for **${career.name}**

📚 Core Skills:
${formatList(career.skills)}

💻 Technologies:
${formatList(career.technologies)}

Focus on learning the fundamentals first, then build real projects.`;
    }

    if (isSalaryIntent(q)) {
        if (!career) {
            return (
                "💰 Tell me which career you want salary information for."
            );
        }

        return `💰 Salary information for **${career.name}**

Average Salary:
${career.averageSalary || "Not available"}

🚀 Growth:
${career.growth || "Not specified"}

Salary can vary based on skills, experience, company, location and specialization.`;
    }

    if (isCompanyIntent(q)) {
        return getCompanyResponse(
            career
        );
    }

    if (career) {
        return `🎓 **${career.name}**

📚 Duration:
${career.duration || "Not available"}

✅ Eligibility:
${
    career.eligibility ||
    career.education?.minimum ||
    "Not available"
}

💰 Salary:
${career.averageSalary || "Not available"}

📈 Growth:
${career.growth || "High"}

📝 ${
    career.description ||
    career.shortDescription ||
    "Career information is available in CareerOS."
}`;
    }

    return `🤖 I couldn't understand that yet.

Try asking:

• Recommend a career
• What career suits me?
• What skills am I missing?
• What should I learn next?
• What is the roadmap, salary and future of Software Engineer?
• Which colleges and entrance exams are suitable for me?
• Which colleges are suitable for me?
• Which entrance exams should I write?
• Can I write JEE after B.Tech?
• Find jobs for me
• Show Software Engineer jobs
• Find React developer jobs
• Show latest jobs
• What job alerts do I have?
• Show my job alerts
• Can I become a Software Engineer, and what jobs and companies can I get?`;
}