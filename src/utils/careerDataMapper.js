
import database from "../data";

// ======================================================
// ROADMAP DATABASE
// ======================================================
//
// ======================================================

import { careerRoadmaps } from "../data/roadmaps";

import indiaSalaries from "../data/salaries/india";
import abroadSalaries from "../data/salaries/abroad";

import technicalQuestions from "../data/interview/technicalQuestions";
import hrQuestions from "../data/interview/hrQuestions";

import courses from "../data/resources/courses";
import books from "../data/resources/books";
import projects from "../data/resources/projects";
import youtube from "../data/resources/youtube";

import technicalSkills from "../data/skills/technicalSkills";
import softSkills from "../data/skills/softSkills";
import tools from "../data/skills/tools";

// ======================================================
// CAREER DATA KEY MAPPING
// ======================================================

const CAREER_DATA_KEYS = {
  // ====================================================
  // ENGINEERING SPECIALIZATIONS
  // ====================================================

  cse: {
    roadmap: "software-engineer",
    salary: "software-engineer",
    interview: "software-engineer",
    education: "btech",
    specialization: "CSE",
  },

  aiml: {
    roadmap: "software-engineer",
    salary: "ai-engineer",
    interview: "ai-engineer",
    education: "btech",
    specialization: "AI & ML",
  },

  datascience: {
    roadmap: "software-engineer",
    salary: "data-scientist",
    interview: "data-scientist",
    education: "btech",
    specialization: "Data Science",
  },

  cybersecurity: {
    roadmap: "software-engineer",
    salary: "cyber-security-engineer",
    interview: "cyber-security-engineer",
    education: "btech",
    specialization: "Cyber Security",
  },

  // ====================================================
  // PROFESSIONAL CAREERS
  // ====================================================

  "software-engineer": {
    roadmap: "software-engineer",
    salary: "software-engineer",
    interview: "software-engineer",
    education: "btech",
    specialization: "CSE",
  },

  "full-stack-developer": {
    roadmap: "software-engineer",
    salary: "full-stack-developer",
    interview: "full-stack-developer",
    education: "btech",
    specialization: "CSE",
  },

  "frontend-developer": {
    roadmap: "software-engineer",
    salary: "frontend-developer",
    interview: "frontend-developer",
    education: "btech",
    specialization: "CSE",
  },

  "backend-developer": {
    roadmap: "software-engineer",
    salary: "backend-developer",
    interview: "backend-developer",
    education: "btech",
    specialization: "CSE",
  },

  "ai-engineer": {
    roadmap: "software-engineer",
    salary: "ai-engineer",
    interview: "ai-engineer",
    education: "btech",
    specialization: "AI & ML",
  },

  "data-scientist": {
    roadmap: "software-engineer",
    salary: "data-scientist",
    interview: "data-scientist",
    education: "btech",
    specialization: "Data Science",
  },

  "data-analyst": {
    roadmap: "software-engineer",
    salary: "data-analyst",
    interview: "data-analyst",
    education: "degree",
    specialization: "Data Analytics",
  },

  "business-analyst": {
    roadmap: "software-engineer",
    salary: "business-analyst",
    interview: "business-analyst",
    education: "degree",
    specialization: "Business Analytics",
  },

  "machine-learning-engineer": {
    roadmap: "software-engineer",
    salary: "machine-learning-engineer",
    interview: "machine-learning-engineer",
    education: "btech",
    specialization: "AI & ML",
  },

  "research-analyst": {
    roadmap: "software-engineer",
    salary: "research-analyst",
    interview: "research-analyst",
    education: "degree",
    specialization: "Research & Analytics",
  },

  "cloud-engineer": {
    roadmap: "software-engineer",
    salary: "cloud-engineer",
    interview: "cloud-engineer",
    education: "btech",
    specialization: "Cloud Computing",
  },

  "devops-engineer": {
    roadmap: "software-engineer",
    salary: "devops-engineer",
    interview: "devops-engineer",
    education: "btech",
    specialization: "DevOps",
  },

  "cyber-security-engineer": {
    roadmap: "software-engineer",
    salary: "cyber-security-engineer",
    interview: "cyber-security-engineer",
    education: "btech",
    specialization: "Cyber Security",
  },

  "mobile-app-developer": {
    roadmap: "software-engineer",
    salary: "mobile-app-developer",
    interview: "mobile-app-developer",
    education: "btech",
    specialization: "Mobile Development",
  },

  "ui-ux-designer": {
    roadmap: "software-engineer",
    salary: "ui-ux-designer",
    interview: "ui-ux-designer",
    education: "degree",
    specialization: "UI/UX Design",
  },

  "qa-engineer": {
    roadmap: "software-engineer",
    salary: "qa-engineer",
    interview: "qa-engineer",
    education: "btech",
    specialization: "Software Testing",
  },

  // ====================================================
  // EDUCATION CAREERS
  // ====================================================

  intermediate: {
    roadmap: "intermediate",
    education: "intermediate",
  },

  polytechnic: {
    roadmap: "polytechnic",
    education: "polytechnic",
  },

  iti: {
    roadmap: "iti",
    education: "iti",
  },

  degree: {
    roadmap: "degree",
    education: "degree",
  },

  engineering: {
    roadmap: "engineering",
    education: "btech",
  },

  medical: {
    roadmap: "medical",
    education: "medical",
  },

  government: {
    roadmap: "government",
    education: "government",
  },
};

// ======================================================
// FIND CAREER BY ID
// ======================================================

function findCareerById(careerId) {
  if (!careerId) {
    return null;
  }

  let foundCareer = null;

  Object.values(database).forEach((careerList) => {
    if (!Array.isArray(careerList)) {
      return;
    }

    const career = careerList.find(
      (item) =>
        String(item?.id) === String(careerId)
    );

    if (career) {
      foundCareer = career;
    }
  });

  return foundCareer;
}

// ======================================================
// NORMALIZE ROADMAP
// ======================================================

function normalizeRoadmap(roadmap) {
  if (!Array.isArray(roadmap)) {
    return [];
  }

  return roadmap.map((stage, index) => {
    if (
      stage &&
      typeof stage === "object" &&
      !Array.isArray(stage)
    ) {
      return {
        id:
          stage.id ??
          index + 1,

        title:
          stage.title ||
          `Stage ${index + 1}`,

        duration:
          stage.duration ||
          "Ongoing",

        skills:
          Array.isArray(stage.skills)
            ? stage.skills
            : [],
      };
    }

    return {
      id:
        index + 1,

      title:
        String(
          stage ||
          `Stage ${index + 1}`
        ),

      duration:
        "Ongoing",

      skills: [
        String(stage || ""),
      ],
    };
  });
}

// ======================================================
// NORMALIZE CAREER
// ======================================================

function normalizeCareer(career) {
  if (!career) {
    return null;
  }

  const dataKeys =
    CAREER_DATA_KEYS[career.id] || {};

  const roadmapKey =
    dataKeys.roadmap ||
    career.id;

  // ====================================================
  // ROADMAP SOURCE
  // ====================================================

  const centralizedRoadmap =
    Array.isArray(
      careerRoadmaps?.[roadmapKey]
    )
      ? careerRoadmaps[roadmapKey]
      : null;

  const careerRoadmap =
    Array.isArray(career.roadmap)
      ? career.roadmap
      : [];

  const finalRoadmap =
    centralizedRoadmap ||
    careerRoadmap;

  return {
    ...career,

    // ==================================================
    // BASIC INFORMATION
    // ==================================================

    id:
      career.id || "",

    name:
      career.name || "Career",

    icon:
      career.icon || "💼",

    category:
      career.category || "Career",

    duration:
      career.duration || "Learning + Career",

    // ==================================================
    // EDUCATION / SPECIALIZATION
    // ==================================================

    education:
      career.education ||
      dataKeys.education ||
      null,

    specialization:
      career.specialization ||
      dataKeys.specialization ||
      null,

    // ==================================================
    // DATA KEYS
    // ==================================================

    roadmapKey,

    salaryKey:
      dataKeys.salary ||
      career.id,

    interviewKey:
      dataKeys.interview ||
      career.id,

    // ==================================================
    // ELIGIBILITY
    // ==================================================

    eligibility:
      career.eligibility ||
      "Eligibility information unavailable",

    // ==================================================
    // DESCRIPTION
    // ==================================================

    description:
      career.description ||
      "Career information is currently unavailable.",

    overview:
      career.overview ||
      career.description ||
      "",

    // ==================================================
    // SALARY
    // ==================================================

    averageSalary:
      career.averageSalary ||
      career.salary ||
      "Salary information unavailable",

    salary:
      career.salary ||
      career.averageSalary ||
      "Salary information unavailable",

    // ==================================================
    // GROWTH
    // ==================================================

    growth:
      career.growth ||
      career.futureScope ||
      "High",

    futureScope:
      career.futureScope ||
      "This career has opportunities for growth as technology and industry requirements evolve.",

    // ==================================================
    // RATING
    // ==================================================

    rating:
      typeof career.rating === "number"
        ? career.rating
        : 4.5,

    // ==================================================
    // STREAMS
    // ==================================================

    streams:
      Array.isArray(career.streams)
        ? career.streams
        : [],

    // ==================================================
    // ENTRANCE EXAMS
    // ==================================================

    entranceExams:
      Array.isArray(career.entranceExams)
        ? career.entranceExams
        : [],

    // ==================================================
    // HIGHER STUDIES
    // ==================================================

    higherStudies:
      Array.isArray(career.higherStudies)
        ? career.higherStudies
        : [],

    // ==================================================
    // CAREER OPPORTUNITIES
    // ==================================================

    careerOpportunities:
      Array.isArray(career.careerOpportunities)
        ? career.careerOpportunities
        : Array.isArray(career.jobRoles)
          ? career.jobRoles
          : [],

    jobRoles:
      Array.isArray(career.jobRoles)
        ? career.jobRoles
        : Array.isArray(career.careerOpportunities)
          ? career.careerOpportunities
          : [],

    // ==================================================
    // SKILLS
    // ==================================================

    skills:
      Array.isArray(career.skills)
        ? career.skills
        : [],

    technologies:
      Array.isArray(career.technologies)
        ? career.technologies
        : [],

    // ==================================================
    // ROADMAP
    // ==================================================

    roadmap:
      normalizeRoadmap(finalRoadmap),

    // ==================================================
    // CAREER GROWTH PATH
    // ==================================================

    careerPath:
      Array.isArray(career.careerPath)
        ? career.careerPath
        : Array.isArray(career.growthPath)
          ? career.growthPath
          : [],

    // ==================================================
    // PROJECTS
    // ==================================================

    careerProjects:
      Array.isArray(career.projects)
        ? career.projects
        : [],

    // ==================================================
    // CERTIFICATIONS
    // ==================================================

    certifications:
      Array.isArray(career.certifications)
        ? career.certifications
        : [],

    // ==================================================
    // COMPANIES
    // ==================================================

    companies:
      Array.isArray(career.companies)
        ? career.companies
        : [],

    topCompanies:
      Array.isArray(career.topCompanies)
        ? career.topCompanies
        : Array.isArray(career.companies)
          ? career.companies
          : [],

    // ==================================================
    // COLLEGES
    // ==================================================

    topColleges:
      Array.isArray(career.topColleges)
        ? career.topColleges
        : [],

    // ==================================================
    // PROS / CONS
    // ==================================================

    pros:
      Array.isArray(career.pros)
        ? career.pros
        : [],

    cons:
      Array.isArray(career.cons)
        ? career.cons
        : [],

    // ==================================================
    // JOB INFORMATION
    // ==================================================

    jobOpenings:
      career.jobOpenings ||
      "Demand varies by company, location and experience.",

    workMode:
      career.workMode ||
      "Office / Hybrid / Remote",
  };
}

// ======================================================
// CAREER RESOURCE KEYWORDS
// ======================================================

const CAREER_RESOURCE_KEYWORDS = {
  "software-engineer": [
    "software",
    "programming",
    "java",
    "python",
    "javascript",
    "dsa",
    "sql",
    "backend",
    "frontend",
    "react",
    "spring boot",
    "system design",
    "web",
  ],

  "full-stack-developer": [
    "html",
    "css",
    "javascript",
    "react",
    "frontend",
    "backend",
    "java",
    "spring boot",
    "sql",
    "web",
    "e-commerce",
    "portfolio",
    "career",
  ],

  "frontend-developer": [
    "html",
    "css",
    "javascript",
    "react",
    "frontend",
    "web",
    "portfolio",
    "ui",
    "e-commerce",
    "weather",
  ],

  "backend-developer": [
    "java",
    "python",
    "sql",
    "backend",
    "spring boot",
    "api",
    "database",
    "server",
    "student management",
    "e-commerce",
  ],

  "ai-engineer": [
    "python",
    "machine learning",
    "ai",
    "data",
    "deep learning",
    "chatbot",
    "recommendation",
    "image",
    "analytics",
  ],

  "data-scientist": [
    "python",
    "machine learning",
    "data",
    "statistics",
    "analytics",
    "analysis",
    "dashboard",
    "recommendation",
    "sales",
    "customer",
  ],

  "data-analyst": [
    "excel",
    "sql",
    "python",
    "data",
    "analysis",
    "analytics",
    "dashboard",
    "sales",
    "business",
    "customer",
  ],

  "business-analyst": [
    "excel",
    "sql",
    "business",
    "analysis",
    "analytics",
    "dashboard",
    "sales",
    "finance",
    "inventory",
  ],

  "machine-learning-engineer": [
    "python",
    "machine learning",
    "ai",
    "data",
    "recommendation",
    "customer",
    "image",
    "analytics",
  ],

  "research-analyst": [
    "research",
    "data",
    "analysis",
    "analytics",
    "statistics",
    "survey",
    "business",
    "market",
    "report",
  ],

  "cloud-engineer": [
    "aws",
    "cloud",
    "server",
    "deployment",
    "web",
    "application",
  ],

  "devops-engineer": [
    "aws",
    "cloud",
    "deployment",
    "docker",
    "kubernetes",
    "application",
    "web",
  ],

  "cyber-security-engineer": [
    "cybersecurity",
    "security",
    "network",
    "python",
    "web",
    "password",
    "intrusion",
  ],

  "mobile-app-developer": [
    "mobile",
    "android",
    "ios",
    "flutter",
    "react native",
    "application",
    "app",
    "weather",
    "chat",
    "expense",
  ],

  "ui-ux-designer": [
    "ui",
    "ux",
    "design",
    "figma",
    "portfolio",
    "website",
    "e-commerce",
    "education",
    "career",
    "mobile",
  ],

  "qa-engineer": [
    "testing",
    "test",
    "qa",
    "quality",
    "automation",
    "api",
    "web",
    "e-commerce",
    "application",
  ],
};

// ======================================================
// GENERAL RESOURCE TEXT NORMALIZER
// ======================================================

function normalizeResourceText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9+#./ -]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ======================================================
// RESOURCE TEXT MATCHING
// ======================================================
//
// Matches complete words/phrases instead of arbitrary
// partial substrings.
//
// Example:
// "data" matches "data analysis"
// but "art" does not accidentally match "cart".
//
// ======================================================

function resourceTextContainsKeyword(
  resourceText,
  keyword
) {
  const normalizedKeyword =
    normalizeResourceText(keyword);

  if (!resourceText || !normalizedKeyword) {
    return false;
  }

  if (resourceText === normalizedKeyword) {
    return true;
  }

  const escapedKeyword =
    normalizedKeyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  const keywordPattern =
    new RegExp(
      `(^|\\s)${escapedKeyword}(?=\\s|$)`,
      "i"
    );

  return keywordPattern.test(resourceText);
}

// ======================================================
// GENERAL RESOURCE KEYWORD MATCHER
// ======================================================

function resourceMatchesKeywords(
  resourceValues,
  keywords
) {
  const resourceText = resourceValues
    .filter(Boolean)
    .map(normalizeResourceText)
    .filter(Boolean)
    .join(" ");

  if (!resourceText) {
    return false;
  }

  return keywords.some((keyword) =>
    resourceTextContainsKeyword(
      resourceText,
      keyword
    )
  );
}

// ======================================================
// RESOURCE OBJECT TEXT
// ======================================================
//
// Converts different resource formats into searchable
// text without relying on object -> "[object Object]".
//
// ======================================================

function getResourceSearchValues(resource) {
  if (!resource) {
    return [];
  }

  if (typeof resource === "string") {
    return [resource];
  }

  if (typeof resource !== "object") {
    return [];
  }

  return [
    resource.title,
    resource.name,
    resource.description,
    resource.category,
    resource.platform,
    resource.author,
    resource.type,
    resource.level,
    resource.duration,

    ...(Array.isArray(resource.skills)
      ? resource.skills
      : []),

    ...(Array.isArray(resource.technologies)
      ? resource.technologies
      : []),
  ].filter(Boolean);
}

// ======================================================
// GET CAREER RESOURCE DATA
// ======================================================

function getCareerResourceData(career) {
  if (!career) {
    return {
      courses: [],
      books: [],
      projects: [],
      youtube: [],
    };
  }

  // ====================================================
  // CAREER-SPECIFIC KEYWORDS
  // ====================================================

  const mappedKeywords =
    CAREER_RESOURCE_KEYWORDS[career.id] || [];

  // ====================================================
  // CAREER DATA KEYWORDS
  // ====================================================

  const careerKeywords = [
    career.id,
    career.name,
    career.category,
    career.specialization,

    ...(Array.isArray(career.skills)
      ? career.skills
      : []),

    ...(Array.isArray(career.technologies)
      ? career.technologies
      : []),

    ...(Array.isArray(career.streams)
      ? career.streams
      : []),
  ]
    .filter(Boolean)
    .map(normalizeResourceText);

  const allKeywords = [
    ...mappedKeywords,
    ...careerKeywords,
  ]
    .filter(Boolean)
    .map(normalizeResourceText);

  // ====================================================
  // COURSES
  // ====================================================

  const matchedCourses = courses.filter(
    (course) =>
      resourceMatchesKeywords(
        getResourceSearchValues(course),
        allKeywords
      )
  );

  // ====================================================
  // BOOKS
  // ====================================================

  const matchedBooks = books.filter(
    (book) =>
      resourceMatchesKeywords(
        getResourceSearchValues(book),
        allKeywords
      )
  );

  // ====================================================
  // PROJECTS
  // ====================================================

  const matchedProjects = projects.filter(
    (project) =>
      resourceMatchesKeywords(
        getResourceSearchValues(project),
        allKeywords
      )
  );

  // ====================================================
  // YOUTUBE
  // ====================================================
  //
  // youtube.js contains objects such as:
  //
  // {
  //   id: "apna-college",
  //   name: "Apna College",
  //   url: "..."
  // }
  //
  // Therefore compare against channel.name rather than
  // comparing the complete object with a string.
  //
  // ====================================================

  const YOUTUBE_BY_CAREER = {
    "software-engineer": [
      "Apna College",
      "CodeWithHarry",
      "freeCodeCamp",
      "Programming with Mosh",
      "Telusko",
      "Traversy Media",
      "Hitesh Choudhary",
      "Love Babbar",
      "NPTEL",
      "Gate Smashers",
    ],

    "full-stack-developer": [
      "Apna College",
      "CodeWithHarry",
      "freeCodeCamp",
      "Traversy Media",
      "Hitesh Choudhary",
      "Telusko",
    ],

    "frontend-developer": [
      "freeCodeCamp",
      "Traversy Media",
      "CodeWithHarry",
      "Hitesh Choudhary",
      "Apna College",
    ],

    "backend-developer": [
      "Telusko",
      "Programming with Mosh",
      "CodeWithHarry",
      "Apna College",
      "NPTEL",
    ],

    "ai-engineer": [
      "freeCodeCamp",
      "Great Learning",
      "NPTEL",
      "Khan Academy",
      "CodeWithHarry",
    ],

    "data-scientist": [
      "freeCodeCamp",
      "Great Learning",
      "Khan Academy",
      "NPTEL",
      "CodeWithHarry",
    ],

    "data-analyst": [
      "Great Learning",
      "Khan Academy",
      "freeCodeCamp",
      "WsCube Tech",
      "NPTEL",
    ],

    "business-analyst": [
      "Great Learning",
      "Khan Academy",
      "WsCube Tech",
      "NPTEL",
    ],

    "machine-learning-engineer": [
      "freeCodeCamp",
      "Great Learning",
      "NPTEL",
      "Khan Academy",
    ],

    "research-analyst": [
      "Khan Academy",
      "Great Learning",
      "NPTEL",
      "WsCube Tech",
    ],

    "cloud-engineer": [
      "freeCodeCamp",
      "Great Learning",
      "NPTEL",
      "Gate Smashers",
    ],

    "devops-engineer": [
      "freeCodeCamp",
      "Great Learning",
      "NPTEL",
      "Gate Smashers",
      "TechWorld with Nana",
    ],

    "cyber-security-engineer": [
      "freeCodeCamp",
      "Great Learning",
      "Gate Smashers",
      "NPTEL",
      "WsCube Tech",
    ],

    "mobile-app-developer": [
      "CodeWithHarry",
      "freeCodeCamp",
      "Apna College",
      "Hitesh Choudhary",
      "Great Learning",
    ],

    "ui-ux-designer": [
      "Great Learning",
      "freeCodeCamp",
      "WsCube Tech",
      "Khan Academy",
    ],

    "qa-engineer": [
      "Great Learning",
      "freeCodeCamp",
      "WsCube Tech",
      "NPTEL",
      "Gate Smashers",
    ],
  };

  const mappedYoutube =
    YOUTUBE_BY_CAREER[career.id] || [];

  const normalizedYoutubeNames =
    mappedYoutube.map(
      normalizeResourceText
    );

  const matchedYoutube = youtube.filter(
    (channel) => {
      const channelName =
        typeof channel === "string"
          ? channel
          : channel?.name ||
            channel?.title ||
            "";

      return normalizedYoutubeNames.includes(
        normalizeResourceText(channelName)
      );
    }
  );

  return {
    courses: matchedCourses,
    books: matchedBooks,
    projects: matchedProjects,
    youtube: matchedYoutube,
  };
}

// ======================================================
// MERGE CAREER RESOURCE DATA
// ======================================================
//
// If a career contains manually supplied resources,
// keep them.
//
// If any resource category is empty, fill that category
// using the centralized resource matcher.
//
// This prevents partially populated career.resources
// objects from hiding the centralized resource database.
//
// ======================================================

function mergeCareerResources(career) {
  const matchedResources =
    getCareerResourceData(career);

  const existingResources =
    career?.resources &&
    typeof career.resources === "object"
      ? career.resources
      : {};

  return {
    courses:
      Array.isArray(existingResources.courses) &&
      existingResources.courses.length > 0
        ? existingResources.courses
        : matchedResources.courses,

    books:
      Array.isArray(existingResources.books) &&
      existingResources.books.length > 0
        ? existingResources.books
        : matchedResources.books,

    projects:
      Array.isArray(existingResources.projects) &&
      existingResources.projects.length > 0
        ? existingResources.projects
        : matchedResources.projects,

    youtube:
      Array.isArray(existingResources.youtube) &&
      existingResources.youtube.length > 0
        ? existingResources.youtube
        : matchedResources.youtube,
  };
}

// ======================================================
// GET COMPLETE CAREER DATA
// ======================================================

export function getCareerCompleteData(careerId) {
  if (!careerId) {
    console.warn(
      "CareerOS: Career ID is missing"
    );

    return null;
  }

  // ====================================================
  // FIND CAREER
  // ====================================================

  const career =
    findCareerById(careerId);

  if (!career) {
    console.warn(
      "CareerOS: Career not found:",
      careerId
    );

    return null;
  }

  // ====================================================
  // GET DATA MAPPING
  // ====================================================

  const dataKeys =
    CAREER_DATA_KEYS[career.id] || {};

  // ====================================================
  // NORMALIZE CAREER
  // ====================================================

  const normalizedCareer =
    normalizeCareer(career);

  // ====================================================
  // RESOURCE DATA
  // ====================================================

  const resourceData =
    mergeCareerResources(career);

  // ====================================================
  // RETURN COMPLETE DATA
  // ====================================================

  return {
    ...normalizedCareer,

    // ==================================================
    // SALARY DATA
    // ==================================================

    salaryData: {
      india:
        indiaSalaries?.[
          dataKeys.salary || careerId
        ] || {},

      abroad:
        abroadSalaries?.[
          dataKeys.salary || careerId
        ] || {},
    },

    // ==================================================
    // INTERVIEW DATA
    // ==================================================

    interview: {
      technical:
        technicalQuestions?.[
          dataKeys.interview || careerId
        ] || [],

      hr:
        Array.isArray(hrQuestions)
          ? hrQuestions
          : [],
    },

    // ==================================================
    // RESOURCES
    // ==================================================

    resources: resourceData,

    // ==================================================
    // SKILL LIBRARY
    // ==================================================

    skillLibrary: {
      technical:
        Array.isArray(technicalSkills)
          ? technicalSkills
          : [],

      soft:
        Array.isArray(softSkills)
          ? softSkills
          : [],

      tools:
        Array.isArray(tools)
          ? tools
          : [],
    },
  };
}

// ======================================================
// OPTIONAL EXPORT
// ======================================================

export {
  CAREER_DATA_KEYS,
};

