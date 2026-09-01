import database from "../data";
import professions from "../data/professions";
import exams from "../data/exams";
import { getCareerAI } from "../utils/aiEngine";
import { getBotReply } from "../utils/chatbotEngine";

/* ======================================================
   SAFE TEXT HELPERS
====================================================== */

function normalizeText(value = "") {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .toLowerCase()
    .trim()
    .replace(/[?!.:,;]+/g, " ")
    .replace(/\s+/g, " ");
}

function contains(text = "", query = "") {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);

  if (!normalizedText || !normalizedQuery) {
    return false;
  }

  return normalizedText.includes(normalizedQuery);
}

/* ======================================================
   FOLLOW-UP CONVERSATION CONTEXT
====================================================== */

const mentorContexts = new Map();

/* ------------------------------------------------------
   CREATE A STABLE PROFILE CONTEXT KEY
------------------------------------------------------ */

function getMentorContextKey(
  student = null,
  careerId = null
) {
  if (!student && !careerId) {
    return "anonymous";
  }

  const explicitUserId =
    student?.uid ||
    student?.userId ||
    student?.id;

  if (explicitUserId) {
    return `user:${String(explicitUserId)}`;
  }

  const profileSignature = [
    careerId,
    student?.education,
    student?.specialization,
    student?.dreamCareer,
    student?.career,
    student?.careerId,
    student?.dreamCareerId,
    student?.selectedCareerId,
  ]
    .filter(Boolean)
    .map(normalizeText)
    .join("|");

  return profileSignature
    ? `profile:${profileSignature}`
    : "anonymous";
}

/* ------------------------------------------------------
   GET CONTEXT
------------------------------------------------------ */

function getMentorContext(
  student = null,
  careerId = null
) {
  const key =
    getMentorContextKey(
      student,
      careerId
    );

  return (
    mentorContexts.get(key) || {
      lastQuestion: "",
      lastCareerId: null,
      lastCareerName: "",
      lastTopic: "",
      lastStudent: null,
    }
  );
}

/* ------------------------------------------------------
   SAVE CONTEXT
------------------------------------------------------ */

function saveMentorContext(
  student,
  careerId,
  question,
  career,
  topic
) {
  const key =
    getMentorContextKey(
      student,
      careerId
    );

  mentorContexts.set(
    key,
    {
      lastQuestion:
        question || "",

      lastCareerId:
        careerId ||
        career?.id ||
        null,

      lastCareerName:
        career?.name ||
        student?.dreamCareer ||
        student?.career ||
        student?.careerName ||
        "",

      lastTopic:
        topic || "",

      lastStudent:
        student || null,
    }
  );
}

/* ------------------------------------------------------
   CLEAR CONTEXT
------------------------------------------------------ */

export function clearMentorContext(
  student = null,
  careerId = null
) {
  const key =
    getMentorContextKey(
      student,
      careerId
    );

  mentorContexts.delete(key);
}

/* ======================================================
   FOLLOW-UP QUESTION DETECTION
====================================================== */

function isFollowUpQuestion(
  question
) {
  const q =
    normalizeText(question);

  if (!q) {
    return false;
  }

  const followUpPatterns = [
    "what about",
    "how about",
    "and salary",
    "and the salary",
    "what is the salary",
    "how much",
    "what skills",
    "which skills",
    "what are the skills",
    "which companies",
    "what companies",
    "which company",
    "where can i work",
    "where can i get a job",
    "which exam",
    "which exams",
    "what exam",
    "what exams",
    "which entrance exam",
    "which entrance exams",
    "what entrance exam",
    "what entrance exams",
    "what about exams",
    "what about entrance exams",
    "what about colleges",
    "which colleges",
    "what colleges",
    "which university",
    "which universities",
    "what about companies",
    "what about skills",
    "what about roadmap",
    "what about interview",
    "what about eligibility",
    "tell me more",
    "more about it",
    "more about this",
    "explain more",
    "and then",
    "then what",
    "what next",
    "next",
    "can i do it",
    "can i become one",
    "am i eligible",
  ];

  return followUpPatterns.some(
    (pattern) =>
      q === pattern ||
      q.startsWith(`${pattern} `) ||
      q.includes(` ${pattern} `)
  );
}

/* ======================================================
   RESOLVE CAREER FROM PREVIOUS CONTEXT
====================================================== */

function resolveFollowUpCareer(
  student,
  careerId,
  context
) {
  if (!context) {
    return null;
  }

  if (careerId) {
    return findCareerData(
      careerId,
      student
    );
  }

  if (context.lastCareerId) {
    const previousCareer =
      findCareerData(
        context.lastCareerId,
        student
      );

    if (previousCareer) {
      return previousCareer;
    }
  }

  if (context.lastCareerName) {
    const previousCareer =
      findCareerData(
        context.lastCareerName,
        student
      );

    if (previousCareer) {
      return previousCareer;
    }
  }

  return null;
}

/* ======================================================
   DETERMINE MENTOR TOPIC
====================================================== */

function detectMentorTopic(
  question
) {
  const q =
    normalizeText(question);

  const asksSalary =
    q.includes("salary") ||
    q.includes("earn") ||
    q.includes("earning") ||
    q.includes("pay") ||
    q.includes("income") ||
    q.includes("package") ||
    q.includes("ctc") ||
    q.includes("lpa") ||
    q.includes("how much");

  const asksCompanies =
    q.includes("company") ||
    q.includes("companies") ||
    q.includes("employer") ||
    q.includes("employers") ||
    q.includes("hire") ||
    q.includes("hiring");

  const asksCollege =
    q.includes("college") ||
    q.includes("colleges") ||
    q.includes("university") ||
    q.includes("universities");

  const asksExam =
    q.includes("exam") ||
    q.includes("exams") ||
    q.includes("entrance") ||
    q.includes("entrance exam") ||
    q.includes("entrance exams");

  if (
    asksCollege &&
    asksExam
  ) {
    return "college-exams";
  }

  if (
    asksSalary &&
    asksCompanies
  ) {
    return "salary-companies";
  }

  if (asksSalary) {
    return "salary";
  }

  if (asksCompanies) {
    return "companies";
  }

  if (asksCollege) {
    return "colleges";
  }

  if (asksExam) {
    return "exams";
  }

  if (
    q.includes("skill") ||
    q.includes("skills")
  ) {
    return "skills";
  }

  if (
    q.includes("roadmap") ||
    q.includes("path") ||
    q.includes("steps")
  ) {
    return "roadmap";
  }

  if (
    q.includes("interview")
  ) {
    return "interview";
  }

  if (
    q.includes("advice") ||
    q.includes("tip") ||
    q.includes("tips")
  ) {
    return "advice";
  }

  if (
    q.includes("eligibility") ||
    q.includes("eligible") ||
    q.includes("qualification")
  ) {
    return "eligibility";
  }

  return "general";
}

/* ======================================================
   GENERIC ARRAY HELPER
====================================================== */

function uniqueValues(values = []) {
  if (!Array.isArray(values)) {
    return [];
  }

  return [
    ...new Set(
      values
        .filter(Boolean)
        .map((value) =>
          String(value).trim()
        )
        .filter(Boolean)
    ),
  ];
}

/* ======================================================
   FLATTEN DATABASE
====================================================== */

function getAllDatabaseCareers() {
  const results = [];

  for (const category in database) {
    const careers =
      database[category];

    if (!Array.isArray(careers)) {
      continue;
    }

    results.push(...careers);
  }

  return results;
}

/* ======================================================
   GENERAL CAREER AI
====================================================== */

export function getAIResponse(
  question = ""
) {
  const query =
    normalizeText(question);

  if (!query) {
    return "Please ask me a career-related question.";
  }

  for (const category in database) {
    const careers =
      database[category];

    if (!Array.isArray(careers)) {
      continue;
    }

    for (const career of careers) {
      if (
        contains(career?.name, query) ||
        contains(career?.description, query) ||
        contains(career?.id, query)
      ) {
        return `
📘 ${career.name}

📅 Duration:
${career.duration || "Not Available"}

✅ Eligibility:
${career.eligibility || "Not Available"}

📝 ${career.description || "Information not available."}
`;
      }
    }
  }

  for (const career of professions) {
    if (
      contains(career?.name, query) ||
      contains(career?.description, query) ||
      contains(career?.id, query)
    ) {
      return `
💻 ${career.name}

📅 Duration:
${career.duration || "Not Available"}

💰 Salary:
${getCareerSalary(career)}

🎯 Eligibility:
${career.eligibility || "Not Available"}

📝 ${career.description || "Information not available."}
`;
    }
  }

  return `Sorry 😔 I couldn't find information about "${question}".`;
}

/* ======================================================
   EDUCATION ALIASES
====================================================== */

const educationAliases = {
  after10th: [
    "10th",
    "10th pass",
    "after 10th",
  ],

  intermediate: [
    "intermediate",
    "12th",
    "12th pass",
    "10+2",
  ],

  polytechnic: [
    "polytechnic",
    "poly tech",
    "diploma",
  ],

  iti: [
    "iti",
    "industrial training",
    "industrial training institute",
  ],

  degree: [
    "degree",
    "graduation",
    "graduate",
    "bca",
    "b.sc",
    "bsc",
    "b.com",
    "bcom",
    "bba",
    "ba",
  ],

  btech: [
    "btech",
    "b.tech",
    "b e",
    "b.e",
    "engineering",
  ],

  medical: [
    "medical",
    "mbbs",
    "bds",
    "bams",
    "bhms",
    "b.pharmacy",
    "bpharmacy",
  ],

  government: [
    "government",
    "govt",
  ],
};

/* ======================================================
   NORMALIZE EDUCATION
====================================================== */

function getNormalizedEducation(
  student
) {
  const education =
    normalizeText(
      student?.education
    );

  if (!education) {
    return null;
  }

  for (
    const [key, aliases] of
    Object.entries(
      educationAliases
    )
  ) {
    if (
      aliases.some(
        (alias) =>
          normalizeText(alias) ===
          education
      )
    ) {
      return key;
    }
  }

  return education;
}

/* ======================================================
   EDUCATION DATA
====================================================== */

function getEducationData(
  student
) {
  if (!student) {
    return null;
  }

  const education =
    getNormalizedEducation(
      student
    );

  if (!education) {
    return null;
  }

  const educationValues =
    educationAliases[
      education
    ] || [education];

  const allCareers =
    getAllDatabaseCareers();

  return (
    allCareers.find(
      (item) => {
        const itemId =
          normalizeText(
            item?.id
          );

        const itemName =
          normalizeText(
            item?.name
          );

        return educationValues.some(
          (alias) => {
            const normalizedAlias =
              normalizeText(alias);

            return (
              itemId ===
                normalizedAlias ||
              itemName ===
                normalizedAlias ||
              itemId.includes(
                normalizedAlias
              ) ||
              itemName.includes(
                normalizedAlias
              )
            );
          }
        );
      }
    ) || null
  );
}

/* ======================================================
   CAREER DATA MATCH
====================================================== */

function findCareerData(
  careerId,
  student = null
) {
  const normalizedCareerId =
    normalizeText(careerId);

  /* --------------------------------------------------
     1. DIRECT CAREER ID
  -------------------------------------------------- */

  if (normalizedCareerId) {
    const careerAI =
      getCareerAI(careerId);

    if (careerAI) {
      return careerAI;
    }

    const databaseCareer =
      getAllDatabaseCareers().find(
        (career) =>
          normalizeText(
            career?.id
          ) === normalizedCareerId ||
          normalizeText(
            career?.name
          ) === normalizedCareerId
      );

    if (databaseCareer) {
      return databaseCareer;
    }

    const professionalCareer =
      professions.find(
        (career) =>
          normalizeText(
            career?.id
          ) === normalizedCareerId ||
          normalizeText(
            career?.name
          ) === normalizedCareerId
      );

    if (professionalCareer) {
      return professionalCareer;
    }
  }

  /* --------------------------------------------------
     2. STUDENT CAREER FIELDS
  -------------------------------------------------- */

  const studentCareerValues = [
    student?.careerId,
    student?.dreamCareerId,
    student?.selectedCareerId,
    student?.career,
    student?.dreamCareer,
    student?.careerGoal,
    student?.careerName,
  ].filter(Boolean);

  for (
    const value of studentCareerValues
  ) {
    const normalizedValue =
      normalizeText(value);

    if (!normalizedValue) {
      continue;
    }

    const careerAI =
      getCareerAI(value);

    if (careerAI) {
      return careerAI;
    }

    const databaseCareer =
      getAllDatabaseCareers().find(
        (career) =>
          normalizeText(
            career?.id
          ) === normalizedValue ||
          normalizeText(
            career?.name
          ) === normalizedValue
      );

    if (databaseCareer) {
      return databaseCareer;
    }

    const professionalCareer =
      professions.find(
        (career) =>
          normalizeText(
            career?.id
          ) === normalizedValue ||
          normalizeText(
            career?.name
          ) === normalizedValue
      );

    if (professionalCareer) {
      return professionalCareer;
    }
  }

  return null;
}

/* ======================================================
   SALARY HELPERS
====================================================== */

function normalizeDisplayValue(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}

function getSalaryFromObject(
  salaryObject
) {
  if (
    !salaryObject ||
    typeof salaryObject !== "object" ||
    Array.isArray(salaryObject)
  ) {
    return "";
  }

  const directFields = [
    "averageSalary",
    "salary",
    "salaryRange",
    "salary_range",
    "startingSalary",
    "starting_salary",
    "entrySalary",
    "entry_salary",
    "fresherSalary",
    "fresher_salary",
    "expectedSalary",
    "expected_salary",
    "pay",
    "income",
    "averagePay",
    "average_pay",
    "range",
  ];

  for (
    const field of directFields
  ) {
    const value =
      normalizeDisplayValue(
        salaryObject[field]
      );

    if (value) {
      return value;
    }
  }

  return "";
}

function getCareerSalary(
  career
) {
  if (!career) {
    return "";
  }

  const directFields = [
    "averageSalary",
    "salary",
    "salaryRange",
    "salary_range",
    "startingSalary",
    "starting_salary",
    "entrySalary",
    "entry_salary",
    "fresherSalary",
    "fresher_salary",
    "expectedSalary",
    "expected_salary",
    "pay",
    "income",
    "averagePay",
    "average_pay",
  ];

  for (
    const field of directFields
  ) {
    const value =
      normalizeDisplayValue(
        career[field]
      );

    if (value) {
      return value;
    }
  }

  const objectSalary =
    getSalaryFromObject(
      career.salary
    );

  if (objectSalary) {
    return objectSalary;
  }

  const salaryDetails =
    getSalaryFromObject(
      career.salaryDetails
    );

  if (salaryDetails) {
    return salaryDetails;
  }

  const salaryInfo =
    getSalaryFromObject(
      career.salaryInfo
    );

  if (salaryInfo) {
    return salaryInfo;
  }

  const nestedObjects = [
    career.career,
    career.details,
    career.information,
    career.jobDetails,
    career.job,
  ];

  for (
    const object of nestedObjects
  ) {
    const value =
      getSalaryFromObject(
        object
      );

    if (value) {
      return value;
    }
  }

  const arrayFields = [
    "salaries",
    "salaryRanges",
    "salary_range",
    "payRanges",
  ];

  for (
    const field of arrayFields
  ) {
    if (
      Array.isArray(
        career[field]
      )
    ) {
      const values =
        career[field]
          .map(
            normalizeDisplayValue
          )
          .filter(Boolean);

      if (values.length > 0) {
        return values.join(" – ");
      }
    }
  }

  return "";
}

/* ======================================================
   COMPANY HELPERS
====================================================== */

function getCompaniesFromValue(
  value
) {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map(
        (item) =>
          item.trim()
      )
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value
      .flatMap(
        (item) => {
          if (
            typeof item === "string"
          ) {
            return [item];
          }

          if (
            item &&
            typeof item === "object"
          ) {
            return [
              item.name,
              item.company,
              item.companyName,
              item.employer,
              item.employerName,
            ].filter(Boolean);
          }

          return [];
        }
      )
      .map(
        (item) =>
          String(item).trim()
      )
      .filter(Boolean);
  }

  if (
    typeof value === "object"
  ) {
    return [
      value.name,
      value.company,
      value.companyName,
      value.employer,
      value.employerName,
    ]
      .filter(Boolean)
      .map(
        (item) =>
          String(item).trim()
      );
  }

  return [];
}

function getCareerCompanies(
  career
) {
  if (!career) {
    return [];
  }

  const fields = [
    "topCompanies",
    "companies",
    "company",
    "companyNames",
    "company_names",
    "employers",
    "topEmployers",
    "hiringCompanies",
    "hiring_companies",
    "employerNames",
    "employer_names",
  ];

  const companies = [];

  for (
    const field of fields
  ) {
    companies.push(
      ...getCompaniesFromValue(
        career[field]
      )
    );
  }

  const nestedObjects = [
    career.career,
    career.details,
    career.information,
    career.jobDetails,
    career.job,
  ];

  for (
    const object of nestedObjects
  ) {
    if (
      !object ||
      typeof object !== "object"
    ) {
      continue;
    }

    for (
      const field of fields
    ) {
      companies.push(
        ...getCompaniesFromValue(
          object[field]
        )
      );
    }
  }

  return uniqueValues(
    companies
  );
}

/* ======================================================
   COLLEGE TEXT
====================================================== */

function getCollegeSearchText(
  college
) {
  if (!college) {
    return "";
  }

  if (typeof college === "string") {
    return normalizeText(
      college
    );
  }

  return normalizeText(
    [
      college.name,
      college.description,
      college.location,
      college.city,
      college.state,
      college.district,
      college.type,
      college.category,
      college.stream,
      college.course,
      college.courses,
      college.program,
      college.programs,
      college.branch,
      college.branches,
      college.department,
      college.departments,
      college.specialization,
      college.specializations,
      college.tags,
    ]
      .flat()
      .filter(Boolean)
      .join(" ")
  );
}

/* ======================================================
   COLLEGE COMPATIBILITY
====================================================== */

function isCollegeCompatible(
  college,
  student
) {
  const education =
    getNormalizedEducation(
      student
    );

  if (!education) {
    return true;
  }

  const text =
    getCollegeSearchText(
      college
    );

  if (education === "btech") {
    const blockedTerms = [
      "polytechnic",
      "poly tech",
      "diploma college",
      "diploma institution",
      "diploma institute",
      "diploma",
      "iti college",
      "iti institute",
      "industrial training institute",
      "industrial training",
      "sbtet",
      "state board of technical education",
    ];

    return !blockedTerms.some(
      (term) =>
        text.includes(term)
    );
  }

  if (education === "polytechnic") {
    const isITI =
      text.includes(
        "industrial training"
      ) ||
      /\biti\b/.test(text);

    return !isITI;
  }

  if (education === "iti") {
    return (
      text.includes("iti") ||
      text.includes(
        "industrial training"
      ) ||
      text.includes(
        "industrial training institute"
      )
    );
  }

  return true;
}

/* ======================================================
   GET CAREER-SPECIFIC COLLEGES
====================================================== */

function getCareerColleges(
  career
) {
  if (
    !Array.isArray(
      career?.topColleges
    )
  ) {
    return [];
  }

  return career.topColleges;
}

/* ======================================================
   GET EDUCATION-PATH COLLEGES
====================================================== */

function getEducationColleges(
  student
) {
  const educationData =
    getEducationData(
      student
    );

  if (
    !Array.isArray(
      educationData?.topColleges
    )
  ) {
    return [];
  }

  return educationData.topColleges;
}

/* ======================================================
   GET STUDENT COLLEGES
====================================================== */

function getStudentColleges(
  student,
  career
) {
  if (!student) {
    return [];
  }

  const colleges = [
    ...getCareerColleges(
      career
    ),
    ...getEducationColleges(
      student
    ),
  ];

  const compatibleColleges =
    colleges.filter(
      (college) =>
        isCollegeCompatible(
          college,
          student
        )
    );

  const names =
    compatibleColleges.map(
      (college) =>
        typeof college === "string"
          ? college
          : college?.name || ""
    );

  return uniqueValues(
    names
  );
}

/* ======================================================
   EXAM SEARCH TEXT
====================================================== */

function getExamSearchText(
  exam
) {
  if (!exam) {
    return "";
  }

  if (typeof exam === "string") {
    return normalizeText(
      exam
    );
  }

  return normalizeText(
    [
      exam.name,
      exam.id,
      exam.category,
      exam.level,
      exam.eligibility,
      exam.description,
      exam.conductedBy,
      exam.mode,
      exam.frequency,
      exam.education,
      exam.educationLevel,
      exam.stream,
      exam.course,
      exam.courses,
      exam.tags,
    ]
      .flat()
      .filter(Boolean)
      .join(" ")
  );
}

/* ======================================================
   EXAM COMPATIBILITY
====================================================== */

function isExamCompatible(
  exam,
  student
) {
  const education =
    getNormalizedEducation(
      student
    );

  if (!education) {
    return true;
  }

  const text =
    getExamSearchText(
      exam
    );

  if (education === "btech") {
    const blockedTerms = [
      "polycet",
      "ap polycet",
      "ts polycet",
      "polytechnic entrance",
      "polytechnic admission",
      "diploma entrance",
      "diploma admission",
      "diploma course admission",
      "diploma to engineering",
      "lateral entry",
      "lateral-entry",
      "ecet",
      "ap ecet",
      "ts ecet",
    ];

    return !blockedTerms.some(
      (term) =>
        text.includes(term)
    );
  }

  return true;
}

/* ======================================================
   FIND EXAM DATABASE RECORD
====================================================== */

function findExam(
  examName
) {
  const query =
    normalizeText(examName);

  if (!query) {
    return null;
  }

  if (Array.isArray(exams)) {
    const match =
      exams.find(
        (exam) => {
          const examNameText =
            normalizeText(
              exam?.name
            );

          const examIdText =
            normalizeText(
              exam?.id
            );

          return (
            examNameText === query ||
            examIdText === query ||
            examNameText.includes(query) ||
            query.includes(
              examNameText
            )
          );
        }
      );

    if (match) {
      return match;
    }
  }

  const possibleCollections = [
    database.exams,
    database.allExams,
    database.entranceExams,
  ];

  for (
    const collection of possibleCollections
  ) {
    if (!Array.isArray(collection)) {
      continue;
    }

    const match =
      collection.find(
        (exam) => {
          const examNameText =
            normalizeText(
              exam?.name
            );

          const examIdText =
            normalizeText(
              exam?.id
            );

          return (
            examNameText === query ||
            examIdText === query ||
            examNameText.includes(query) ||
            query.includes(
              examNameText
            )
          );
        }
      );

    if (match) {
      return match;
    }
  }

  for (
    const career of
    getAllDatabaseCareers()
  ) {
    if (
      !Array.isArray(
        career?.entranceExams
      )
    ) {
      continue;
    }

    const exam =
      career.entranceExams.find(
        (item) => {
          if (
            typeof item === "string"
          ) {
            return (
              normalizeText(
                item
              ) === query
            );
          }

          return (
            normalizeText(
              item?.name
            ) === query ||
            normalizeText(
              item?.id
            ) === query
          );
        }
      );

    if (
      exam &&
      typeof exam === "object"
    ) {
      return exam;
    }
  }

  return null;
}

/* ======================================================
   CAREER-SPECIFIC EXAMS
====================================================== */

function getCareerExams(
  career
) {
  if (
    !Array.isArray(
      career?.entranceExams
    )
  ) {
    return [];
  }

  return career.entranceExams;
}

/* ======================================================
   EDUCATION-PATH EXAMS
====================================================== */

function getEducationExams(
  student
) {
  const educationData =
    getEducationData(
      student
    );

  if (
    !Array.isArray(
      educationData?.entranceExams
    )
  ) {
    return [];
  }

  return educationData.entranceExams;
}

/* ======================================================
   EXAM MATCH SCORE
====================================================== */

function scoreExam(
  exam,
  student,
  career
) {
  let score = 0;

  const examText =
    getExamSearchText(
      exam
    );

  const specialization =
    normalizeText(
      student?.specialization
    );

  const careerName =
    normalizeText(
      career?.name ||
        student?.dreamCareer
    );

  const interest =
    normalizeText(
      student?.interest
    );

  const state =
    normalizeText(
      student?.state
    );

  if (
    careerName &&
    examText.includes(
      careerName
    )
  ) {
    score += 40;
  }

  if (
    specialization &&
    examText.includes(
      specialization
    )
  ) {
    score += 30;
  }

  if (
    interest &&
    examText.includes(
      interest
    )
  ) {
    score += 15;
  }

  if (
    state &&
    examText.includes(
      state
    )
  ) {
    score += 15;
  }

  return score;
}

/* ======================================================
   GET STUDENT EXAMS
====================================================== */

function getStudentExamNames(
  student,
  career
) {
  if (!student) {
    return [];
  }

  const examValues = [];

  /*
     Career-specific exams have priority.
  */

  examValues.push(
    ...getCareerExams(
      career
    )
  );

  /*
     Education-path exams provide
     additional relevant options.
  */

  examValues.push(
    ...getEducationExams(
      student
    )
  );

  /*
     Resolve string IDs/names into
     complete exam records.
  */

  const resolvedExams =
    examValues
      .map(
        (examValue) => {
          if (
            typeof examValue ===
            "object"
          ) {
            return examValue;
          }

          return (
            findExam(
              examValue
            ) ||
            examValue
          );
        }
      )
      .filter(Boolean);

  /*
     Apply education compatibility.
  */

  const compatibleExams =
    resolvedExams.filter(
      (exam) =>
        isExamCompatible(
          exam,
          student
        )
    );

  /*
     Remove duplicates.
  */

  const seen = new Set();
  const uniqueExams = [];

  for (
    const exam of compatibleExams
  ) {
    const name =
      typeof exam === "string"
        ? exam
        : exam?.name || "";

    const key =
      normalizeText(name);

    if (
      !key ||
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    uniqueExams.push(exam);
  }

  /*
     Rank the exams using:
     career
     specialization
     interest
     state
  */

  return uniqueExams
    .map(
      (exam, index) => ({
        exam,
        index,
        score:
          scoreExam(
            exam,
            student,
            career
          ),
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
    .slice(0, 5)
    .map(
      (item) =>
        item.exam
    );
}

/* ======================================================
   PERSONALIZED COLLEGE ANSWER
====================================================== */

function getCollegeMentorReply(
  student,
  career
) {
  if (!student) {
    return `
🏫 Colleges

I can recommend colleges once I know your student profile.

Please complete your CareerOS profile with your education, specialization and career goal.
`;
  }

  const colleges =
    getStudentColleges(
      student,
      career
    );

  const education =
    student.education ||
    "Not specified";

  const specialization =
    student.specialization ||
    "Not specified";

  const careerName =
    career?.name ||
    student.dreamCareer ||
    student.career ||
    "your chosen career";

  if (
    getNormalizedEducation(
      student
    ) === "btech" &&
    colleges.length === 0
  ) {
    return `
🏫 College Guidance

Based on your current profile:

🎓 Education:
${education}

📚 Specialization:
${specialization}

🎯 Career Goal:
${careerName}

I don't currently have compatible college recommendations stored for this exact combination.

For a B.Tech student, CareerOS will not recommend diploma, polytechnic or ITI colleges as suitable next-step colleges.

You can explore the Colleges section of CareerOS for available options.
`;
  }

  if (
    colleges.length === 0
  ) {
    return `
🏫 College Guidance

Based on your current profile:

🎓 Education:
${education}

📚 Specialization:
${specialization}

🎯 Career Goal:
${careerName}

I don't currently have compatible college recommendations stored for this exact combination.

You can explore the Colleges section of CareerOS for available options.
`;
  }

  return `
🏫 Colleges Recommended For You

Based on your profile and current education level:

🎓 Education:
${education}

📚 Specialization:
${specialization}

🎯 Career Goal:
${careerName}

Recommended colleges:

${colleges
  .map(
    (college, index) =>
      `${index + 1}. ${college}`
  )
  .join("\n")}

💡 These recommendations come from CareerOS career and education data and are filtered according to your current education path.
`;
}

/* ======================================================
   PERSONALIZED ENTRANCE EXAM ANSWER
====================================================== */

function getExamMentorReply(
  student,
  career
) {
  if (!student) {
    return `
📝 Entrance Exams

I can recommend entrance exams once I know your student profile.

Please complete your CareerOS profile with your education, specialization and career goal.
`;
  }

  const examNames =
    getStudentExamNames(
      student,
      career
    );

  const education =
    student.education ||
    "Not specified";

  const specialization =
    student.specialization ||
    "Not specified";

  const careerName =
    career?.name ||
    student.dreamCareer ||
    student.career ||
    "your chosen career";

  if (
    getNormalizedEducation(
      student
    ) === "btech" &&
    examNames.length === 0
  ) {
    return `
📝 Entrance Exam Guidance

Based on your current profile:

🎓 Education:
${education}

📚 Specialization:
${specialization}

🎯 Career Goal:
${careerName}

I don't currently have a suitable next-step entrance exam stored in CareerOS for your current B.Tech education and selected career path.

⚠️ Exams such as POLYCET, AP ECET, TS ECET and other diploma/polytechnic entrance exams are not recommended because they are intended for diploma/polytechnic admission or lateral-entry pathways rather than students who are already pursuing or have completed B.Tech.

If you are looking for postgraduate options after B.Tech, such as M.Tech, MCA, MBA or other professional programs, CareerOS can recommend them when the corresponding exam data is available.
`;
  }

  if (
    examNames.length === 0
  ) {
    return `
📝 Entrance Exam Guidance

Based on your current profile:

🎓 Education:
${education}

📚 Specialization:
${specialization}

🎯 Career Goal:
${careerName}

I don't currently have compatible entrance-exam recommendations stored for this exact path.

You can explore the Entrance Exams section of CareerOS.
`;
  }

  const examDetails =
    examNames.map(
      (examName, index) => {
        const exam =
          typeof examName ===
          "object"
            ? examName
            : findExam(
                examName
              );

        if (!exam) {
          return `${
            index + 1
          }. ${examName}`;
        }

        return `${
          index + 1
        }. ${
          exam.name ||
          examName
        }${
          exam.eligibility
            ? `\n   🎓 Eligibility: ${exam.eligibility}`
            : ""
        }${
          exam.conductedBy
            ? `\n   🏛 Conducted By: ${exam.conductedBy}`
            : ""
        }${
          exam.mode
            ? `\n   💻 Mode: ${exam.mode}`
            : ""
        }${
          exam.frequency
            ? `\n   📅 Frequency: ${exam.frequency}`
            : ""
        }`;
      }
    );

  return `
📝 Entrance Exams Recommended For You

Based on your profile and current education level:

🎓 Education:
${education}

📚 Specialization:
${specialization}

🎯 Career Goal:
${careerName}

Recommended exams:

${examDetails.join(
    "\n\n"
  )}

💡 These exams are selected from CareerOS education/career data and filtered according to your current education path.
`;
}

/* ======================================================
   COLLEGE + EXAM ANSWER
====================================================== */

function getCollegeExamMentorReply(
  student,
  career
) {
  const collegeReply =
    getCollegeMentorReply(
      student,
      career
    );

  const examReply =
    getExamMentorReply(
      student,
      career
    );

  return `${collegeReply}

${examReply}`;
}

/* ======================================================
   CAREER-SPECIFIC AI
====================================================== */

export function askCareerAI(
  careerId,
  question,
  student = null
) {
  const career =
    findCareerData(
      careerId,
      student
    );

  if (!career) {
    return "I don't have information about this career yet.";
  }

  const q =
    normalizeText(question);

  if (!q) {
    return "Please ask me something about this career.";
  }

  /* ==================================================
     COLLEGE + EXAM
  ================================================== */

  if (
    (
      q.includes("college") ||
      q.includes("colleges") ||
      q.includes("university") ||
      q.includes("universities")
    ) &&
    (
      q.includes("exam") ||
      q.includes("entrance")
    )
  ) {
    return getCollegeExamMentorReply(
      student,
      career
    );
  }

  /* ==================================================
     COLLEGES
  ================================================== */

  if (
    q.includes("college") ||
    q.includes("colleges") ||
    q.includes("university") ||
    q.includes("universities")
  ) {
    return getCollegeMentorReply(
      student,
      career
    );
  }

  /* ==================================================
     ENTRANCE EXAMS
  ================================================== */

  if (
    q.includes("exam") ||
    q.includes("entrance")
  ) {
    return getExamMentorReply(
      student,
      career
    );
  }

  /* ==================================================
     PERSONALIZED CAREER MATCH
  ================================================== */

  if (
    student &&
    (
      q.includes("can i") ||
      q.includes("match") ||
      q.includes("am i suitable") ||
      q.includes("fit")
    )
  ) {
    let score = 0;

    if (
      student.dreamCareer &&
      career.name &&
      normalizeText(
        student.dreamCareer
      ) ===
      normalizeText(
        career.name
      )
    ) {
      score += 35;
    }

    if (
      Array.isArray(
        student.skills
      )
    ) {
      student.skills.forEach(
        (skill) => {
          const studentSkill =
            normalizeText(
              skill
            );

          const matched =
            career.skills?.some(
              (careerSkill) =>
                normalizeText(
                  careerSkill
                ) ===
                studentSkill
            );

          if (matched) {
            score += 8;
          }
        }
      );
    }

    if (
      student.interest &&
      career.description &&
      normalizeText(
        career.description
      ).includes(
        normalizeText(
          student.interest
        )
      )
    ) {
      score += 20;
    }

    score =
      Math.min(
        100,
        score
      );

    return `🎯 Career Match

${career.name}

✅ Match Score: ${score}%

📚 Education:
${student.education || "Not specified"}

📖 Specialization:
${student.specialization || "Not specified"}

❤️ Interest:
${student.interest || "Not specified"}

🛠 Skills:
${student.skills?.join(", ") || "None"}

Keep learning the required skills to improve your chances.`;
  }

  /* ==================================================
     ROADMAP
  ================================================== */

  if (
    q.includes("roadmap")
  ) {
    if (
      Array.isArray(
        career.roadmap
      )
    ) {
      return `
🗺️ ${career.name} Roadmap

${career.roadmap
  .map(
    (stage, index) =>
      `${index + 1}. ${
        typeof stage === "string"
          ? stage
          : stage?.title ||
            stage?.name ||
            "Stage"
      }`
  )
  .join("\n")}
`;
    }

    return "Career roadmap information is not available.";
  }

  /* ==================================================
     SKILLS
  ================================================== */

  if (
    q.includes("skill")
  ) {
    return Array.isArray(
      career.skills
    )
      ? career.skills.join(
          ", "
        )
      : "Career skill information is not available.";
  }

  /* ==================================================
     INTERVIEW
  ================================================== */

  if (
    q.includes("interview")
  ) {
    return Array.isArray(
      career.interview
    )
      ? career.interview.join(
          ", "
        )
      : "Interview questions are available in the Interview tab.";
  }

  /* ==================================================
     ADVICE
  ================================================== */

  if (
    q.includes("advice") ||
    q.includes("tip")
  ) {
    return (
      career.advice ||
      "Focus on building practical skills and real-world projects."
    );
  }

  /* ==================================================
     SALARY
  ================================================== */

  if (
    q.includes("salary") ||
    q.includes("earn") ||
    q.includes("earning") ||
    q.includes("pay") ||
    q.includes("income") ||
    q.includes("package") ||
    q.includes("ctc") ||
    q.includes("lpa") ||
    q.includes("how much can i make")
  ) {
    const salary =
      getCareerSalary(
        career
      );

    const education =
      student?.education ||
      "Not specified";

    const specialization =
      student?.specialization ||
      "Not specified";

    if (!salary) {
      return `
💰 Salary Information

Career:
${career.name}

🎓 Education:
${education}

📚 Specialization:
${specialization}

CareerOS does not currently have salary information stored for this career.

I won't invent a salary figure. You can check the Jobs section for current opportunities and salary information when employers provide it.
`;
    }

    return `
💰 Salary Information

Career:
${career.name}

🎓 Education:
${education}

📚 Specialization:
${specialization}

💵 Salary:
${salary}

This salary information comes from the CareerOS career data for this profession.
`;
  }

  /* ==================================================
     COMPANIES
  ================================================== */

  if (
    q.includes("company") ||
    q.includes("companies") ||
    q.includes("employer") ||
    q.includes("employers") ||
    q.includes("hire") ||
    q.includes("hiring")
  ) {
    const companies =
      getCareerCompanies(
        career
      );

    const education =
      student?.education ||
      "Not specified";

    const specialization =
      student?.specialization ||
      "Not specified";

    if (
      companies.length === 0
    ) {
      return `
🏢 Companies & Employers

Career:
${career.name}

🎓 Your Education:
${education}

📚 Specialization:
${specialization}

CareerOS does not currently have company information stored for this career.

You can use the Jobs section to find current employers and job openings.
`;
    }

    return `
🏢 Companies & Employers

Career:
${career.name}

🎓 Your Education:
${education}

📚 Specialization:
${specialization}

Companies that hire for this career:

${companies
  .map(
    (company, index) =>
      `${index + 1}. ${company}`
  )
  .join("\n")}

💡 These employers come from the CareerOS career data for this profession.
`;
  }

  /* ==================================================
     GENERAL CAREER INFORMATION
  ================================================== */

  if (
    q.includes("what") ||
    q.includes("about") ||
    q.includes("who")
  ) {
    return (
      career.introduction ||
      career.overview ||
      career.description ||
      "Career information is not available."
    );
  }

  return `Ask me about:

• Roadmap
• Skills
• Colleges
• Entrance Exams
• Interview
• Salary
• Companies
• Advice

You can also ask:
"Can I become this career?"

Or:
"Which colleges are suitable for me?"

Or:
"Which entrance exams should I take?"`;
}


/* ======================================================
   COMBINED SALARY + COMPANY ANSWER
====================================================== */

function getSalaryCompanyMentorReply(
  student,
  career
) {
  if (!career) {
    return "I don't have information about this career yet.";
  }

  const salary =
    getCareerSalary(
      career
    );

  const companies =
    getCareerCompanies(
      career
    );

  const education =
    student?.education ||
    "Not specified";

  const specialization =
    student?.specialization ||
    "Not specified";

  const careerName =
    career?.name ||
    student?.dreamCareer ||
    student?.career ||
    student?.careerName ||
    "your chosen career";

  const salarySection =
    salary
      ? `
💰 Salary

💵 Average Salary:
${salary}

🚀 Growth:
${
  career?.growth ||
  career?.careerGrowth ||
  "Not specified"
}
`
      : `
💰 Salary

Salary information is not available for ${careerName}.
`;

  const companySection =
    companies.length > 0
      ? `
🏢 Top Companies Hiring

${companies
  .map(
    (company, index) =>
      `${index + 1}. ${company}`
  )
  .join("\n")}
`
      : `
🏢 Top Companies Hiring

Company information is not available for ${careerName}.

You can use the Jobs section to find current employers and job openings.
`;

  return `
💰 Salary & Companies for ${careerName}

${salarySection}

${companySection}

🎓 Your Education:
${education}

📚 Specialization:
${specialization}

Salary can vary based on skills, experience, company, location and specialization.
`;
}

/* ======================================================
   UNIFIED CAREEROS AI MENTOR
   WITH FOLLOW-UP CONVERSATION CONTEXT
====================================================== */

export async function askCareerMentor(
  question,
  student = null,
  careerId = null
) {
  const q =
    normalizeText(question);

  if (!q) {
    return "Please ask me a career-related question.";
  }

  /* ==================================================
     PREVIOUS CONVERSATION CONTEXT
  ================================================== */

  const previousContext =
    getMentorContext(
      student,
      careerId
    );

  const followUp =
    isFollowUpQuestion(q);

  /* ==================================================
     RESOLVE CURRENT CAREER
  ================================================== */

  let resolvedCareer =
    findCareerData(
      careerId ||
        student?.careerId ||
        student?.dreamCareerId ||
        student?.selectedCareerId ||
        student?.career ||
        student?.dreamCareer ||
        student?.careerName,
      student
    );

  /* ==================================================
     FOLLOW-UP CAREER RESOLUTION
  ================================================== */

  if (
    followUp &&
    !resolvedCareer
  ) {
    resolvedCareer =
      resolveFollowUpCareer(
        student,
        careerId,
        previousContext
      );
  }

  if (
    followUp &&
    previousContext?.lastCareerId &&
    !careerId
  ) {
    const previousCareer =
      resolveFollowUpCareer(
        student,
        null,
        previousContext
      );

    if (previousCareer) {
      resolvedCareer =
        previousCareer;
    }
  }

  /* ==================================================
     CURRENT TOPIC
  ================================================== */

  const currentTopic =
    detectMentorTopic(q);

  /* ==================================================
     COLLEGE + EXAM
  ================================================== */

  if (
    currentTopic ===
      "college-exams"
  ) {
    const reply =
      getCollegeExamMentorReply(
        student,
        resolvedCareer
      );

    saveMentorContext(
      student,
      careerId ||
        resolvedCareer?.id ||
        previousContext?.lastCareerId,
      question,
      resolvedCareer,
      "college-exams"
    );

    return reply;
  }

  /* ==================================================
     COLLEGES
  ================================================== */

  if (
    currentTopic ===
    "colleges"
  ) {
    /*
       IMPORTANT:
       Always use the student's profile
       when asking about colleges.
    */

    const career =
      resolvedCareer ||
      resolveFollowUpCareer(
        student,
        null,
        previousContext
      );

    const reply =
      getCollegeMentorReply(
        student,
        career
      );

    saveMentorContext(
      student,
      careerId ||
        career?.id ||
        previousContext?.lastCareerId,
      question,
      career,
      "colleges"
    );

    return reply;
  }

  /* ==================================================
     ENTRANCE EXAMS
  ================================================== */

  if (
    currentTopic ===
    "exams"
  ) {
    /*
       IMPORTANT:
       Always use the student's profile
       when asking about entrance exams.
    */

    const career =
      resolvedCareer ||
      resolveFollowUpCareer(
        student,
        null,
        previousContext
      );

    const reply =
      getExamMentorReply(
        student,
        career
      );

    saveMentorContext(
      student,
      careerId ||
        career?.id ||
        previousContext?.lastCareerId,
      question,
      career,
      "exams"
    );

    return reply;
  }

  /* ==================================================
     SALARY + COMPANIES
  ================================================== */

  const asksSalary =
    q.includes("salary") ||
    q.includes("earn") ||
    q.includes("earning") ||
    q.includes("pay") ||
    q.includes("income") ||
    q.includes("package") ||
    q.includes("ctc") ||
    q.includes("lpa") ||
    q.includes("how much");

  const asksCompanies =
    q.includes("company") ||
    q.includes("companies") ||
    q.includes("employer") ||
    q.includes("employers") ||
    q.includes("hire") ||
    q.includes("hiring");

  if (
    asksSalary &&
    asksCompanies
  ) {
    let career =
      resolvedCareer;

    if (!career && student) {
      const possibleCareerNames = [
        student?.dreamCareer,
        student?.career,
        student?.careerName,
        student?.careerGoal,
      ].filter(Boolean);

      for (
        const careerName of
        possibleCareerNames
      ) {
        const normalizedName =
          normalizeText(
            careerName
          );

        career =
          getAllDatabaseCareers().find(
            (item) =>
              normalizeText(
                item?.name
              ) === normalizedName ||
              normalizeText(
                item?.id
              ) === normalizedName
          ) ||
          professions.find(
            (item) =>
              normalizeText(
                item?.name
              ) === normalizedName ||
              normalizeText(
                item?.id
              ) === normalizedName
          );

        if (career) {
          break;
        }
      }
    }

    if (!career) {
      career =
        resolveFollowUpCareer(
          student,
          null,
          previousContext
        );
    }

    const reply =
      getSalaryCompanyMentorReply(
        student,
        career
      );

    saveMentorContext(
      student,
      careerId ||
        career?.id ||
        previousContext?.lastCareerId,
      question,
      career,
      "salary-companies"
    );

    return reply;
  }

  /* ==================================================
     SALARY
  ================================================== */

  if (asksSalary) {
    const career =
      resolvedCareer ||
      resolveFollowUpCareer(
        student,
        null,
        previousContext
      );

    if (!career) {
      return `
💰 Salary Information

I don't currently have enough career context to identify which profession you mean.

Please mention the career once, for example:
"What is the salary of a Data Scientist?"

After that, you can simply ask:
"What about salary?"
`;
    }

    const salary =
      getCareerSalary(
        career
      );

    const careerName =
      career.name ||
      student?.dreamCareer ||
      previousContext?.lastCareerName ||
      "your chosen career";

    if (!salary) {
      const reply = `
💰 Salary information for ${careerName}

CareerOS does not currently have salary information stored for this career.

I won't invent a salary figure. You can check the Jobs section for current opportunities and salary information when employers provide it.
`;

      saveMentorContext(
        student,
        career.id,
        question,
        career,
        "salary"
      );

      return reply;
    }

    const reply = `
💰 Salary information for ${careerName}

Average Salary:
${salary}

🚀 Growth:
${
  career.growth ||
  career.careerGrowth ||
  "Not specified"
}

Salary can vary based on skills, experience, company, location and specialization.
`;

    saveMentorContext(
      student,
      career.id,
      question,
      career,
      "salary"
    );

    return reply;
  }

  /* ==================================================
     COMPANIES
  ================================================== */

  if (asksCompanies) {
    const career =
      resolvedCareer ||
      resolveFollowUpCareer(
        student,
        null,
        previousContext
      );

    if (!career) {
      return `
🏢 Companies & Employers

I don't currently have enough career context to identify which profession you mean.

Please mention the career once, for example:
"Which companies hire Data Scientists?"

After that, you can simply ask:
"Which companies hire?"
`;
    }

    const companies =
      getCareerCompanies(
        career
      );

    const careerName =
      career.name ||
      student?.dreamCareer ||
      previousContext?.lastCareerName ||
      "your chosen career";

    if (
      companies.length === 0
    ) {
      const reply = `
🏢 Top companies for ${careerName}

CareerOS does not currently have company information stored for this career.

You can use the Jobs section to find current employers and job openings.
`;

      saveMentorContext(
        student,
        career.id,
        question,
        career,
        "companies"
      );

      return reply;
    }

    const companyNames =
      companies
        .map(
          (company, index) =>
            `${index + 1}. ${company}`
        )
        .join("\n");

    const reply = `
🏢 Top companies for ${careerName}

${companyNames}

💡 These employers come from the CareerOS career data for this profession.
`;

    saveMentorContext(
      student,
      career.id,
      question,
      career,
      "companies"
    );

    return reply;
  }

  /* ==================================================
     FOLLOW-UP WITH PREVIOUS CAREER
  ================================================== */

  if (
    followUp &&
    resolvedCareer
  ) {
    /* ----------------------------------------------
       SKILLS
    ---------------------------------------------- */

    if (
      currentTopic ===
      "skills"
    ) {
      const reply =
        Array.isArray(
          resolvedCareer.skills
        )
          ? `
🛠 Skills Required for ${resolvedCareer.name}

${resolvedCareer.skills
  .map(
    (skill, index) =>
      `${index + 1}. ${skill}`
  )
  .join("\n")}
`
          : "Career skill information is not available.";

      saveMentorContext(
        student,
        resolvedCareer.id,
        question,
        resolvedCareer,
        "skills"
      );

      return reply;
    }

    /* ----------------------------------------------
       ROADMAP
    ---------------------------------------------- */

    if (
      currentTopic ===
      "roadmap"
    ) {
      if (
        Array.isArray(
          resolvedCareer.roadmap
        )
      ) {
        const reply = `
🗺️ ${resolvedCareer.name} Roadmap

${resolvedCareer.roadmap
  .map(
    (stage, index) =>
      `${index + 1}. ${
        typeof stage === "string"
          ? stage
          : stage?.title ||
            stage?.name ||
            "Stage"
      }`
  )
  .join("\n")}
`;

        saveMentorContext(
          student,
          resolvedCareer.id,
          question,
          resolvedCareer,
          "roadmap"
        );

        return reply;
      }

      return "Career roadmap information is not available.";
    }

    /* ----------------------------------------------
       INTERVIEW
    ---------------------------------------------- */

    if (
      currentTopic ===
      "interview"
    ) {
      const reply =
        Array.isArray(
          resolvedCareer.interview
        )
          ? `
🎤 ${resolvedCareer.name} Interview Questions

${resolvedCareer.interview
  .map(
    (item, index) =>
      `${index + 1}. ${item}`
  )
  .join("\n")}
`
          : "Interview questions are available in the Interview tab.";

      saveMentorContext(
        student,
        resolvedCareer.id,
        question,
        resolvedCareer,
        "interview"
      );

      return reply;
    }

    /* ----------------------------------------------
       ADVICE
    ---------------------------------------------- */

    if (
      currentTopic ===
      "advice"
    ) {
      const reply =
        resolvedCareer.advice ||
        "Focus on building practical skills and real-world projects.";

      saveMentorContext(
        student,
        resolvedCareer.id,
        question,
        resolvedCareer,
        "advice"
      );

      return reply;
    }

    /* ----------------------------------------------
       ELIGIBILITY
    ---------------------------------------------- */

    if (
      currentTopic ===
      "eligibility"
    ) {
      const reply = `
🎓 Eligibility for ${resolvedCareer.name}

${
  resolvedCareer.eligibility ||
  "Eligibility information is not available."
}
`;

      saveMentorContext(
        student,
        resolvedCareer.id,
        question,
        resolvedCareer,
        "eligibility"
      );

      return reply;
    }
  }

  /* ==================================================
     CAREER PAGE CONTEXT
  ================================================== */

  if (careerId) {
    const reply =
      askCareerAI(
        careerId,
        question,
        student
      );

    saveMentorContext(
      student,
      careerId,
      question,
      resolvedCareer,
      currentTopic
    );

    return reply;
  }

  /* ==================================================
     GENERAL CAREEROS MENTOR
  ================================================== */

  const contextCareer =
    resolvedCareer ||
    (
      previousContext?.lastCareerName
        ? findCareerData(
            previousContext.lastCareerName,
            student
          )
        : null
    );

  const reply =
    await getBotReply(
      question,
      student
    );

  saveMentorContext(
    student,
    contextCareer?.id ||
      careerId ||
      previousContext?.lastCareerId,
    question,
    contextCareer,
    currentTopic
  );

  return reply;
}