import {
  skillsMatch,
  getMatchedSkills,
  getMissingSkills,
} from "./skillEngine";

import database from "../data";
/* ==================================================
   TEXT NORMALIZATION
================================================== */

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[-_/]/g, " ")
    .replace(/\s+/g, " ");
}

/* ==================================================
   CANONICAL CAREER IDS

   These IDs must match the IDs used by
   professionalCareers database.
================================================== */

const CAREER_IDS = {
  softwareEngineer: "software-engineer",
  fullStackDeveloper: "full-stack-developer",
  frontendDeveloper: "frontend-developer",
  backendDeveloper: "backend-developer",

  aiEngineer: "ai-engineer",
  machineLearningEngineer:
    "machine-learning-engineer",
  dataScientist: "data-scientist",
  dataAnalyst: "data-analyst",
  businessAnalyst: "business-analyst",
  researchAnalyst: "research-analyst",

  cloudEngineer: "cloud-engineer",
  devopsEngineer: "devops-engineer",

  cyberSecurityEngineer:
    "cyber-security-engineer",

  ethicalHacker: "ethical-hacker",
  socAnalyst: "soc-analyst",
  penetrationTester: "penetration-tester",

  qaEngineer: "qa-engineer",
  mobileAppDeveloper: "mobile-app-developer",

  embeddedEngineer: "embedded-engineer",
  vlsiEngineer: "vlsi-engineer",
  iotEngineer: "iot-engineer",
  electronicsEngineer: "electronics-engineer",
  hardwareEngineer: "hardware-engineer",
  networkEngineer: "network-engineer",

  electricalEngineer: "electrical-engineer",
  powerSystemsEngineer:
    "power-systems-engineer",
  electricalDesignEngineer:
    "electrical-design-engineer",
  controlSystemsEngineer:
    "control-systems-engineer",
  maintenanceEngineer:
    "maintenance-engineer",

  mechanicalEngineer: "mechanical-engineer",
  automobileEngineer: "automobile-engineer",
  productionEngineer: "production-engineer",
  designEngineer: "design-engineer",
  manufacturingEngineer:
    "manufacturing-engineer",

  civilEngineer: "civil-engineer",
  structuralEngineer: "structural-engineer",
  constructionEngineer:
    "construction-engineer",
  siteEngineer: "site-engineer",
  quantitySurveyor: "quantity-surveyor",

  accountant: "accountant",
  financialAnalyst: "financial-analyst",
  bankOfficer: "bank-officer",
  charteredAccountant:
    "chartered-accountant",
  taxConsultant: "tax-consultant",

  marketingManager: "marketing-manager",
  hrManager: "hr-manager",
  businessExecutive: "business-executive",
  operationsManager: "operations-manager",
  entrepreneur: "entrepreneur",

  governmentOfficer: "government-officer",
  lawyer: "lawyer",
  journalist: "journalist",
  teacher: "teacher",
  contentWriter: "content-writer",
  socialWorker: "social-worker",
};

/* ==================================================
   HELPERS
================================================== */


/* ==================================================
   SPECIALIZATION → CAREER IDS

   IMPORTANT:
   StudentForm specialization values are used
   directly here.
================================================== */

const specializationCareerMap = {
  /* --------------------------------------------------
     INTERMEDIATE - MPC
  -------------------------------------------------- */

  MPC: {
    [CAREER_IDS.softwareEngineer]: 25,
    [CAREER_IDS.dataAnalyst]: 23,
    [CAREER_IDS.dataScientist]: 22,
    [CAREER_IDS.frontendDeveloper]: 20,
    [CAREER_IDS.backendDeveloper]: 20,
    [CAREER_IDS.fullStackDeveloper]: 22,
  },

  /* --------------------------------------------------
     INTERMEDIATE - BIPC
  -------------------------------------------------- */

  BiPC: {
    doctor: 30,
    dentist: 28,
    pharmacist: 25,
    "medical-researcher": 22,
    "healthcare-administrator": 20,
  },

  /* --------------------------------------------------
     INTERMEDIATE - MEC
  -------------------------------------------------- */

  MEC: {
    [CAREER_IDS.accountant]: 28,
    [CAREER_IDS.financialAnalyst]: 30,
    [CAREER_IDS.businessAnalyst]: 27,
    [CAREER_IDS.bankOfficer]: 25,
    [CAREER_IDS.charteredAccountant]: 30,
  },

  /* --------------------------------------------------
     INTERMEDIATE - CEC / HEC
  -------------------------------------------------- */

  CEC: {
    [CAREER_IDS.governmentOfficer]: 25,
    [CAREER_IDS.lawyer]: 25,
    [CAREER_IDS.journalist]: 24,
    [CAREER_IDS.teacher]: 23,
    [CAREER_IDS.contentWriter]: 22,
  },

  HEC: {
    [CAREER_IDS.governmentOfficer]: 25,
    [CAREER_IDS.teacher]: 24,
    [CAREER_IDS.journalist]: 23,
    [CAREER_IDS.lawyer]: 23,
    [CAREER_IDS.contentWriter]: 22,
  },

  Vocational: {
    technician: 25,
    apprentice: 23,
    "technical-specialist": 25,
    entrepreneur: 18,
  },

  /* --------------------------------------------------
     CSE
  -------------------------------------------------- */

  CSE: {
    [CAREER_IDS.softwareEngineer]: 30,
    [CAREER_IDS.fullStackDeveloper]: 28,
    [CAREER_IDS.backendDeveloper]: 26,
    [CAREER_IDS.frontendDeveloper]: 25,
    [CAREER_IDS.qaEngineer]: 20,
    [CAREER_IDS.mobileAppDeveloper]: 20,
    [CAREER_IDS.cloudEngineer]: 20,
    [CAREER_IDS.devopsEngineer]: 20,
  },

  /* --------------------------------------------------
     AI & ML
  -------------------------------------------------- */

  "AI & ML": {
    [CAREER_IDS.aiEngineer]: 30,
    [CAREER_IDS.machineLearningEngineer]: 30,
    [CAREER_IDS.dataScientist]: 28,
    [CAREER_IDS.dataAnalyst]: 22,
    [CAREER_IDS.softwareEngineer]: 20,
    [CAREER_IDS.researchAnalyst]: 22,
  },

  /* --------------------------------------------------
     DATA SCIENCE
  -------------------------------------------------- */

  "Data Science": {
    [CAREER_IDS.dataScientist]: 30,
    [CAREER_IDS.dataAnalyst]: 28,
    [CAREER_IDS.businessAnalyst]: 23,
    [CAREER_IDS.machineLearningEngineer]: 27,
    [CAREER_IDS.aiEngineer]: 24,
    [CAREER_IDS.researchAnalyst]: 23,
  },

  /* --------------------------------------------------
     CYBER SECURITY
  -------------------------------------------------- */

  "Cyber Security": {
    [CAREER_IDS.cyberSecurityEngineer]: 30,
    [CAREER_IDS.ethicalHacker]: 28,
    [CAREER_IDS.socAnalyst]: 28,
    [CAREER_IDS.penetrationTester]: 27,
    [CAREER_IDS.cloudEngineer]: 18,
    [CAREER_IDS.devopsEngineer]: 18,
  },

  /* --------------------------------------------------
     IT
  -------------------------------------------------- */

  IT: {
    [CAREER_IDS.softwareEngineer]: 28,
    [CAREER_IDS.fullStackDeveloper]: 27,
    [CAREER_IDS.backendDeveloper]: 25,
    [CAREER_IDS.frontendDeveloper]: 24,
    [CAREER_IDS.cloudEngineer]: 22,
    [CAREER_IDS.devopsEngineer]: 22,
    [CAREER_IDS.qaEngineer]: 20,
  },

  /* --------------------------------------------------
     ECE
  -------------------------------------------------- */

  ECE: {
    [CAREER_IDS.embeddedEngineer]: 30,
    [CAREER_IDS.vlsiEngineer]: 30,
    [CAREER_IDS.iotEngineer]: 28,
    [CAREER_IDS.electronicsEngineer]: 27,
    [CAREER_IDS.hardwareEngineer]: 25,
    [CAREER_IDS.networkEngineer]: 20,
  },

  /* --------------------------------------------------
     EEE
  -------------------------------------------------- */

  EEE: {
    [CAREER_IDS.electricalEngineer]: 30,
    [CAREER_IDS.powerSystemsEngineer]: 28,
    [CAREER_IDS.electricalDesignEngineer]: 27,
    [CAREER_IDS.controlSystemsEngineer]: 25,
    [CAREER_IDS.maintenanceEngineer]: 23,
  },

  /* --------------------------------------------------
     MECHANICAL
  -------------------------------------------------- */

  Mechanical: {
    [CAREER_IDS.mechanicalEngineer]: 30,
    [CAREER_IDS.automobileEngineer]: 27,
    [CAREER_IDS.productionEngineer]: 27,
    [CAREER_IDS.designEngineer]: 25,
    [CAREER_IDS.manufacturingEngineer]: 25,
  },

  /* --------------------------------------------------
     CIVIL
  -------------------------------------------------- */

  Civil: {
    [CAREER_IDS.civilEngineer]: 30,
    [CAREER_IDS.structuralEngineer]: 28,
    [CAREER_IDS.constructionEngineer]: 27,
    [CAREER_IDS.siteEngineer]: 26,
    [CAREER_IDS.quantitySurveyor]: 23,
  },

  /* --------------------------------------------------
     DEGREE
  -------------------------------------------------- */

  BCA: {
    [CAREER_IDS.softwareEngineer]: 28,
    [CAREER_IDS.fullStackDeveloper]: 27,
    [CAREER_IDS.frontendDeveloper]: 25,
    [CAREER_IDS.backendDeveloper]: 25,
    [CAREER_IDS.qaEngineer]: 20,
    [CAREER_IDS.mobileAppDeveloper]: 20,
    [CAREER_IDS.dataAnalyst]: 22,
  },

  "B.Sc": {
    [CAREER_IDS.dataScientist]: 28,
    [CAREER_IDS.dataAnalyst]: 28,
    [CAREER_IDS.businessAnalyst]: 23,
    [CAREER_IDS.softwareEngineer]: 20,
    [CAREER_IDS.researchAnalyst]: 25,
  },

  "B.Com": {
    [CAREER_IDS.accountant]: 28,
    [CAREER_IDS.financialAnalyst]: 30,
    [CAREER_IDS.businessAnalyst]: 25,
    [CAREER_IDS.bankOfficer]: 23,
    [CAREER_IDS.charteredAccountant]: 30,
    [CAREER_IDS.taxConsultant]: 25,
  },

  BBA: {
    [CAREER_IDS.businessAnalyst]: 28,
    [CAREER_IDS.marketingManager]: 26,
    [CAREER_IDS.hrManager]: 26,
    [CAREER_IDS.businessExecutive]: 23,
    [CAREER_IDS.operationsManager]: 25,
    [CAREER_IDS.entrepreneur]: 22,
  },

  BA: {
    [CAREER_IDS.governmentOfficer]: 26,
    [CAREER_IDS.lawyer]: 26,
    [CAREER_IDS.journalist]: 25,
    [CAREER_IDS.teacher]: 25,
    [CAREER_IDS.contentWriter]: 24,
    [CAREER_IDS.socialWorker]: 20,
  },
};

/* ==================================================
   DREAM CAREER → CANONICAL ID ALIASES
================================================== */

const dreamCareerIdMap = {
  "software engineer": CAREER_IDS.softwareEngineer,
  "software developer": CAREER_IDS.softwareEngineer,
  "software programmer": CAREER_IDS.softwareEngineer,

  "frontend developer": CAREER_IDS.frontendDeveloper,
  "front end developer": CAREER_IDS.frontendDeveloper,
  "ui developer": CAREER_IDS.frontendDeveloper,

  "backend developer": CAREER_IDS.backendDeveloper,
  "back end developer": CAREER_IDS.backendDeveloper,
  "server developer": CAREER_IDS.backendDeveloper,

  "full stack developer":
    CAREER_IDS.fullStackDeveloper,
  "full-stack developer":
    CAREER_IDS.fullStackDeveloper,
  "fullstack developer":
    CAREER_IDS.fullStackDeveloper,

  "data scientist": CAREER_IDS.dataScientist,
  "data science": CAREER_IDS.dataScientist,

  "data analyst": CAREER_IDS.dataAnalyst,
  "data analytics": CAREER_IDS.dataAnalyst,
  "data analysis": CAREER_IDS.dataAnalyst,

  "business analyst":
    CAREER_IDS.businessAnalyst,
  "business analysis":
    CAREER_IDS.businessAnalyst,

  "ai engineer": CAREER_IDS.aiEngineer,
  "artificial intelligence engineer":
    CAREER_IDS.aiEngineer,

  "machine learning engineer":
    CAREER_IDS.machineLearningEngineer,
  "ml engineer":
    CAREER_IDS.machineLearningEngineer,

  "cloud engineer": CAREER_IDS.cloudEngineer,
  "cloud developer": CAREER_IDS.cloudEngineer,

  "devops engineer": CAREER_IDS.devopsEngineer,
  "devops developer": CAREER_IDS.devopsEngineer,

  "cyber security engineer":
    CAREER_IDS.cyberSecurityEngineer,
  "cybersecurity engineer":
    CAREER_IDS.cyberSecurityEngineer,
  "security engineer":
    CAREER_IDS.cyberSecurityEngineer,

  "ethical hacker":
    CAREER_IDS.ethicalHacker,
  "penetration tester":
    CAREER_IDS.penetrationTester,
  "pen tester":
    CAREER_IDS.penetrationTester,

  "soc analyst":
    CAREER_IDS.socAnalyst,
  "security operations analyst":
    CAREER_IDS.socAnalyst,

  "qa engineer": CAREER_IDS.qaEngineer,

  "mobile app developer":
    CAREER_IDS.mobileAppDeveloper,

  "embedded engineer":
    CAREER_IDS.embeddedEngineer,

  "vlsi engineer":
    CAREER_IDS.vlsiEngineer,

  "iot engineer":
    CAREER_IDS.iotEngineer,

  "electronics engineer":
    CAREER_IDS.electronicsEngineer,

  "hardware engineer":
    CAREER_IDS.hardwareEngineer,

  "network engineer":
    CAREER_IDS.networkEngineer,

  "electrical engineer":
    CAREER_IDS.electricalEngineer,

  "mechanical engineer":
    CAREER_IDS.mechanicalEngineer,

  "civil engineer":
    CAREER_IDS.civilEngineer,

  accountant: CAREER_IDS.accountant,

  "financial analyst":
    CAREER_IDS.financialAnalyst,

  "bank officer":
    CAREER_IDS.bankOfficer,

  "chartered accountant":
    CAREER_IDS.charteredAccountant,

  "government officer":
    CAREER_IDS.governmentOfficer,

  lawyer: CAREER_IDS.lawyer,

  journalist: CAREER_IDS.journalist,

  teacher: CAREER_IDS.teacher,

  "content writer":
    CAREER_IDS.contentWriter,
};

/* ==================================================
   DREAM CAREER MATCHING
================================================== */

function careerNameMatches(
  dreamCareer,
  career
) {
  const dream = normalizeText(dreamCareer);

  if (!dream || !career) {
    return false;
  }

  const careerId =
    normalizeText(career.id);

  const careerName =
    normalizeText(career.name);

  /* -----------------------------------------------
     1. DIRECT ID MATCH
  ----------------------------------------------- */

  const canonicalId =
    dreamCareerIdMap[dream];

  if (
    canonicalId &&
    career.id === canonicalId
  ) {
    return true;
  }

  /* -----------------------------------------------
     2. NAME MATCH
  ----------------------------------------------- */

  if (
    dream === careerName ||
    dream === careerId
  ) {
    return true;
  }

  /* -----------------------------------------------
     3. ALIAS / PARTIAL MATCH
  ----------------------------------------------- */

  if (
    careerName.includes(dream) ||
    dream.includes(careerName)
  ) {
    return true;
  }

  return false;
}

/* ==================================================
   INTEREST MAP

   MUST MATCH StudentForm OPTIONS
================================================== */

const interestMap = {
  Technology: [
    "java",
    "python",
    "react",
    "javascript",
    "sql",
    "programming",
    "dsa",
    "cloud",
    "software",
    "web",
  ],

  "Data & Analytics": [
    "excel",
    "sql",
    "python",
    "pandas",
    "power bi",
    "tableau",
    "statistics",
    "data analysis",
  ],

  "Artificial Intelligence": [
    "python",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "statistics",
    "ai",
  ],

  Business: [
    "management",
    "marketing",
    "leadership",
    "business",
    "operations",
  ],

  Finance: [
    "accounting",
    "finance",
    "taxation",
    "auditing",
    "financial analysis",
    "excel",
  ],

  Healthcare: [
    "biology",
    "chemistry",
    "patient care",
    "medicine",
    "diagnosis",
  ],

  "Design & Creativity": [
    "design",
    "drawing",
    "creativity",
    "writing",
    "ui",
    "ux",
  ],

  "Government & Public Service": [
    "reasoning",
    "general knowledge",
    "aptitude",
    "current affairs",
    "communication",
  ],

  Engineering: [
    "engineering",
    "technical",
    "design",
    "mechanical",
    "electrical",
    "electronics",
    "manufacturing",
  ],

  Research: [
    "research",
    "statistics",
    "analysis",
    "machine learning",
    "science",
  ],
};

/* ==================================================
   EDUCATION MATCH
================================================== */

const educationAliases = {
  after10th: [
    "10th",
    "after 10th",
    "secondary",
  ],

  intermediate: [
    "intermediate",
    "12th",
    "10+2",
    "higher secondary",
  ],

  polytechnic: [
    "polytechnic",
    "diploma",
  ],

  iti: [
    "iti",
    "industrial training institute",
  ],

  degree: [
    "degree",
    "bca",
    "b.sc",
    "b.com",
    "bba",
    "ba",
  ],

  btech: [
    "b.tech",
    "btech",
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
  ],

  government: [
    "government",
    "government jobs",
    "ssc",
    "banking",
    "railway",
    "upsc",
  ],
};

function educationMatches(
  studentEducation,
  eligibility
) {
  if (
    !studentEducation ||
    !eligibility
  ) {
    return false;
  }

  const education =
    normalizeText(studentEducation);

  const eligible =
    normalizeText(eligibility);

  const aliases =
    educationAliases[education] || [
      education,
    ];

  return aliases.some(
    (alias) =>
      eligible.includes(
        normalizeText(alias)
      )
  );
}

/* ==================================================
   SPECIALIZATION MATCH
================================================== */

function getSpecializationScore(
  specialization,
  careerId
) {
  if (
    !specialization ||
    !careerId
  ) {
    return 0;
  }

  const map =
    specializationCareerMap[
      specialization
    ];

  if (!map) {
    return 0;
  }

  return map[careerId] || 0;
}

/* ==================================================
   MAIN CAREER MATCH ENGINE
================================================== */

export function calculateCareerMatch(
  student,
  career
) {
  if (!student || !career) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      reasons: [],
      placementChance: 0,
      salaryPotential: 0,
      learningProgress: 0,
      futureDemand: 0,
    };
  }

  const careerSkills =
    Array.isArray(career.skills)
      ? career.skills
      : [];

  const studentSkills =
    Array.isArray(student.skills)
      ? student.skills
      : [];

  let score = 0;

  const matchedSkills = [];
  const reasons = [];

  /* ==================================================
     1. DREAM CAREER
  ================================================== */

  if (
    student.dreamCareer &&
    careerNameMatches(
      student.dreamCareer,
      career
    )
  ) {
    score += 30;

    reasons.push(
      `Matches your career goal (${student.dreamCareer})`
    );
  }

  /* ==================================================
     2. EDUCATION
  ================================================== */

  if (
    educationMatches(
      student.education,
      career.eligibility
    )
  ) {
    score += 20;

    reasons.push(
      "Suitable for your education"
    );
  }

  /* ==================================================
     3. INTEREST
  ================================================== */

  if (student.interest) {
    const expectedSkills =
      interestMap[
        student.interest
      ] || [];

    expectedSkills.forEach(
      (expectedSkill) => {
        const matchedCareerSkill =
          careerSkills.find(
            (careerSkill) =>
              skillsMatch(
                expectedSkill,
                careerSkill
              )
          );

        if (
          matchedCareerSkill &&
          !matchedSkills.includes(
            matchedCareerSkill
          )
        ) {
          matchedSkills.push(
            matchedCareerSkill
          );

          score += 4;
        }
      }
    );

    if (
      expectedSkills.length > 0 &&
      matchedSkills.length > 0
    ) {
      reasons.push(
        `Matches your interest (${student.interest})`
      );
    }
  }

  /* ==================================================
     4. STUDENT SKILLS
  ================================================== */

  const matchedCareerSkills =
    getMatchedSkills(
      studentSkills,
      careerSkills
    );

  matchedCareerSkills.forEach(
    (skill) => {
      if (
        !matchedSkills.includes(skill)
      ) {
        matchedSkills.push(skill);

        score += 8;

        reasons.push(
          `You already know ${skill}`
        );
      }
    }
  );

  /* ==================================================
     5. CAREER GROWTH
  ================================================== */

  if (
    career.growth === "Excellent"
  ) {
    score += 8;
  } else if (
    career.growth === "Very High"
  ) {
    score += 6;
  } else if (
    career.growth === "High"
  ) {
    score += 4;
  }

  /* ==================================================
     6. SPECIALIZATION
  ================================================== */

  const specializationScore =
    getSpecializationScore(
      student.specialization,
      career.id
    );

  if (specializationScore > 0) {
    score += specializationScore;

    reasons.push(
      `Strong match for your specialization (${student.specialization})`
    );
  }

  /* ==================================================
     7. FINAL SCORE
  ================================================== */

  score = Math.min(
    100,
    Math.round(score)
  );

  /* ==================================================
     8. MISSING SKILLS
  ================================================== */

  const missingSkills =
    getMissingSkills(
      studentSkills,
      careerSkills
    );

  /* ==================================================
     9. LEARNING PROGRESS
  ================================================== */

  const learningProgress =
    careerSkills.length > 0
      ? Math.min(
          100,
          Math.round(
            (matchedSkills.length /
              careerSkills.length) *
              100
          )
        )
      : 0;

  /* ==================================================
     10. PLACEMENT CHANCE
  ================================================== */

  const placementChance =
    Math.min(
      100,
      Math.round(
        score * 0.7 +
          learningProgress * 0.3
      )
    );

  /* ==================================================
     11. SALARY POTENTIAL
  ================================================== */

  let salaryPotential = 70;

  if (
    career.growth === "Excellent"
  ) {
    salaryPotential = 95;
  } else if (
    career.growth === "Very High"
  ) {
    salaryPotential = 90;
  } else if (
    career.growth === "High"
  ) {
    salaryPotential = 80;
  }

  /* ==================================================
     12. FUTURE DEMAND
  ================================================== */

  let futureDemand = 80;

  if (
    career.growth === "Excellent"
  ) {
    futureDemand = 98;
  } else if (
    career.growth === "Very High"
  ) {
    futureDemand = 92;
  } else if (
    career.growth === "High"
  ) {
    futureDemand = 86;
  }

  /* ==================================================
     13. RETURN
  ================================================== */

  return {
    score,
    matchedSkills,
    missingSkills,
    reasons,
    placementChance,
    salaryPotential,
    learningProgress,
    futureDemand,
  };
}
/* ==================================================
   GET CAREER OPTIONS
================================================== */

export function getCareerOptions(student) {
  if (!student) {
    return [];
  }

  const education = student.education;
  const specialization = student.specialization;

  /* ==================================================
     AFTER 10TH
  ================================================== */

  if (education === "after10th") {
    return Array.isArray(database.after10th)
      ? database.after10th
      : [];
  }

  /* ==================================================
     INTERMEDIATE
  ================================================== */

  if (education === "intermediate") {
    switch (specialization) {
      case "MPC":
        return Array.isArray(database.engineering)
          ? database.engineering
          : [];

      case "BiPC":
        return Array.isArray(database.medical)
          ? database.medical
          : [];

      case "MEC":
        return getCareersByIds(
          database.degree,
          [
            CAREER_IDS.accountant,
            CAREER_IDS.financialAnalyst,
            CAREER_IDS.businessAnalyst,
            CAREER_IDS.bankOfficer,
            CAREER_IDS.charteredAccountant,
          ]
        );

      case "CEC":
        return getCareersByIds(
          database.degree,
          [
            "ba",
            "bcom",
            "bba",
          ]
        );

      case "HEC":
        return getCareersByIds(
          database.degree,
          ["ba"]
        );

      case "Vocational":
        return Array.isArray(database.intermediate)
          ? database.intermediate
          : [];

      default:
        return Array.isArray(database.intermediate)
          ? database.intermediate
          : [];
    }
  }

  /* ==================================================
     POLYTECHNIC
  ================================================== */

  if (education === "polytechnic") {
    switch (specialization) {
      case "CSE":
        return getProfessionalCareers([
          CAREER_IDS.softwareEngineer,
          CAREER_IDS.fullStackDeveloper,
          CAREER_IDS.frontendDeveloper,
          CAREER_IDS.backendDeveloper,
          CAREER_IDS.qaEngineer,
          CAREER_IDS.mobileAppDeveloper,
        ]);

      case "AI & ML":
        return getProfessionalCareers([
          CAREER_IDS.aiEngineer,
          CAREER_IDS.machineLearningEngineer,
          CAREER_IDS.dataScientist,
          CAREER_IDS.researchAnalyst,
        ]);

      default:
        return Array.isArray(database.polytechnic)
          ? database.polytechnic
          : [];
    }
  }

  /* ==================================================
     ITI
  ================================================== */

  if (education === "iti") {
    return Array.isArray(database.iti)
      ? database.iti
      : [];
  }

  /* ==================================================
     DEGREE
  ================================================== */

  if (education === "degree") {
    switch (specialization) {
      case "BCA":
        return getProfessionalCareers([
          CAREER_IDS.softwareEngineer,
          CAREER_IDS.fullStackDeveloper,
          CAREER_IDS.frontendDeveloper,
          CAREER_IDS.backendDeveloper,
          CAREER_IDS.qaEngineer,
          CAREER_IDS.mobileAppDeveloper,
          CAREER_IDS.dataAnalyst,
        ]);

      case "B.Sc":
        return getProfessionalCareers([
          CAREER_IDS.dataScientist,
          CAREER_IDS.dataAnalyst,
          CAREER_IDS.businessAnalyst,
          CAREER_IDS.softwareEngineer,
          CAREER_IDS.researchAnalyst,
        ]);

      case "B.Com":
        return getCareersByIds(
          database.degree,
          ["bcom"]
        );

      case "BBA":
        return getCareersByIds(
          database.degree,
          ["bba"]
        );

      case "BA":
        return getCareersByIds(
          database.degree,
          ["ba"]
        );

      default:
        return Array.isArray(database.degree)
          ? database.degree
          : [];
    }
  }

  /* ==================================================
     B.TECH / ENGINEERING
  ================================================== */

  if (education === "btech") {
    switch (specialization) {
      case "CSE":
        return getProfessionalCareers([
          CAREER_IDS.softwareEngineer,
          CAREER_IDS.fullStackDeveloper,
          CAREER_IDS.frontendDeveloper,
          CAREER_IDS.backendDeveloper,
          CAREER_IDS.qaEngineer,
          CAREER_IDS.mobileAppDeveloper,
        ]);

      case "AI & ML":
        return getProfessionalCareers([
          CAREER_IDS.aiEngineer,
          CAREER_IDS.machineLearningEngineer,
          CAREER_IDS.dataScientist,
          CAREER_IDS.softwareEngineer,
          CAREER_IDS.backendDeveloper,
        ]);

      case "Data Science":
        return getProfessionalCareers([
          CAREER_IDS.dataScientist,
          CAREER_IDS.dataAnalyst,
          CAREER_IDS.businessAnalyst,
          CAREER_IDS.machineLearningEngineer,
          CAREER_IDS.researchAnalyst,
          CAREER_IDS.aiEngineer,
        ]);

      case "Cyber Security":
        return getProfessionalCareers([
          CAREER_IDS.cyberSecurityEngineer,
          CAREER_IDS.ethicalHacker,
          CAREER_IDS.socAnalyst,
          CAREER_IDS.penetrationTester,
          CAREER_IDS.cloudEngineer,
          CAREER_IDS.devopsEngineer,
        ]);

      case "IT":
        return getProfessionalCareers([
          CAREER_IDS.softwareEngineer,
          CAREER_IDS.fullStackDeveloper,
          CAREER_IDS.frontendDeveloper,
          CAREER_IDS.backendDeveloper,
          CAREER_IDS.cloudEngineer,
          CAREER_IDS.devopsEngineer,
          CAREER_IDS.qaEngineer,
        ]);

      case "ECE":
        return getCareersByIds(
          database.engineering,
          ["ece"]
        );

      case "EEE":
        return getCareersByIds(
          database.engineering,
          ["eee"]
        );

      case "Mechanical":
        return getCareersByIds(
          database.engineering,
          ["mechanical"]
        );

      case "Civil":
        return getCareersByIds(
          database.engineering,
          ["civil"]
        );

      default:
        return Array.isArray(database.engineering)
          ? database.engineering
          : [];
    }
  }

  /* ==================================================
     MEDICAL
  ================================================== */

  if (education === "medical") {
    return Array.isArray(database.medical)
      ? database.medical
      : [];
  }

  /* ==================================================
     GOVERNMENT
  ================================================== */

  if (education === "government") {
    return Array.isArray(database.government)
      ? database.government
      : [];
  }

  return [];
}

/* ==================================================
   CAREER DATABASE HELPERS
================================================== */

function getCareersByIds(collection, ids = []) {
  if (!Array.isArray(collection)) {
    return [];
  }

  return collection.filter((career) =>
    ids.includes(career?.id)
  );
}

function getProfessionalCareers(ids = []) {
  if (!Array.isArray(database.professionalCareers)) {
    return [];
  }

  return database.professionalCareers.filter((career) =>
    ids.includes(career?.id)
  );
}
/* ==================================================
   OPTIONAL EXPORTS FOR TESTING / DEBUGGING
================================================== */

export {
  CAREER_IDS,
  specializationCareerMap,
  dreamCareerIdMap,
  interestMap,
};