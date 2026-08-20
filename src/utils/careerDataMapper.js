import database from "../data";

import roadmaps from "../data/roadmaps";
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

/**
 * Find a career anywhere inside the CareerOS database.
 */
function findCareerById(careerId) {
  if (!careerId) return null;

  let foundCareer = null;

  Object.values(database).forEach((careerList) => {
    if (!Array.isArray(careerList)) return;

    const career = careerList.find(
      (item) => item?.id === careerId
    );

    if (career) {
      foundCareer = career;
    }
  });

  return foundCareer;
}

/**
 * Convert different career data formats
 * into one consistent format for CareerOS.
 */
function normalizeCareer(career) {
  if (!career) return null;

  return {
    ...career,

    /* ---------------------------------------------
       BASIC INFORMATION
    --------------------------------------------- */

    id: career.id || "",
    name: career.name || "Career",
    icon: career.icon || "💼",
    category: career.category || "Career",

    duration: career.duration || "Learning + Career",

    eligibility:
      career.eligibility ||
      "Eligibility information unavailable",

    description:
      career.description ||
      "Career information is currently unavailable.",

    overview:
      career.overview ||
      career.description ||
      "",

    /* ---------------------------------------------
       SALARY
    --------------------------------------------- */

    averageSalary:
      career.averageSalary ||
      career.salary ||
      "Salary information unavailable",

    salary:
      career.salary ||
      career.averageSalary ||
      "Salary information unavailable",

    /* ---------------------------------------------
       GROWTH
    --------------------------------------------- */

    growth:
      career.growth ||
      career.futureScope ||
      "High",

    futureScope:
      career.futureScope ||
      "This career has opportunities for growth as technology and industry requirements evolve.",

    /* ---------------------------------------------
       CAREER INFORMATION
    --------------------------------------------- */

    rating:
      typeof career.rating === "number"
        ? career.rating
        : 4.5,

    streams: Array.isArray(career.streams)
      ? career.streams
      : [],

    entranceExams: Array.isArray(career.entranceExams)
      ? career.entranceExams
      : [],

    higherStudies: Array.isArray(career.higherStudies)
      ? career.higherStudies
      : [],

    careerOpportunities: Array.isArray(
      career.careerOpportunities
    )
      ? career.careerOpportunities
      : career.jobRoles || [],

    jobRoles: Array.isArray(career.jobRoles)
      ? career.jobRoles
      : career.careerOpportunities || [],

    /* ---------------------------------------------
       SKILLS
    --------------------------------------------- */

    skills: Array.isArray(career.skills)
      ? career.skills
      : [],

    technologies: Array.isArray(career.technologies)
      ? career.technologies
      : [],

    /* ---------------------------------------------
       ROADMAP
    --------------------------------------------- */

    roadmap: Array.isArray(roadmaps?.[career.id])
      ? roadmaps[career.id]
      : Array.isArray(career.roadmap)
        ? career.roadmap
        : [],

    /* ---------------------------------------------
       PROJECTS
    --------------------------------------------- */

    careerProjects: Array.isArray(career.projects)
      ? career.projects
      : [],

    /* ---------------------------------------------
       CERTIFICATIONS
    --------------------------------------------- */

    certifications: Array.isArray(
      career.certifications
    )
      ? career.certifications
      : [],

    /* ---------------------------------------------
       COMPANIES
    --------------------------------------------- */

    companies: Array.isArray(career.companies)
      ? career.companies
      : [],

    topCompanies: Array.isArray(career.topCompanies)
      ? career.topCompanies
      : Array.isArray(career.companies)
        ? career.companies
        : [],

    /* ---------------------------------------------
       COLLEGES
    --------------------------------------------- */

    topColleges: Array.isArray(career.topColleges)
      ? career.topColleges
      : [],

    /* ---------------------------------------------
       PROS / CONS
    --------------------------------------------- */

    pros: Array.isArray(career.pros)
      ? career.pros
      : [],

    cons: Array.isArray(career.cons)
      ? career.cons
      : [],

    /* ---------------------------------------------
       JOB INFORMATION
    --------------------------------------------- */

    jobOpenings:
      career.jobOpenings ||
      "Demand varies by company, location and experience.",

    workMode:
      career.workMode ||
      "Office / Hybrid / Remote",
  };
}

/**
 * Return complete CareerOS career data.
 */
export function getCareerCompleteData(careerId) {
  if (!careerId) {
    console.warn("CareerOS: Career ID is missing");
    return null;
  }

  const career = findCareerById(careerId);

  if (!career) {
    console.warn(
      "CareerOS: Career not found:",
      careerId
    );

    return null;
  }

  const normalizedCareer = normalizeCareer(career);

  return {
    ...normalizedCareer,

    /* ---------------------------------------------
       SALARY DATA
    --------------------------------------------- */

    salaryData: {
      india:
        indiaSalaries?.[careerId] || {},

      abroad:
        abroadSalaries?.[careerId] || {},
    },

    /* ---------------------------------------------
       INTERVIEW
    --------------------------------------------- */

    interview: {
      technical:
        technicalQuestions?.[careerId] || [],

      hr:
        Array.isArray(hrQuestions)
          ? hrQuestions
          : [],
    },

    /* ---------------------------------------------
       RESOURCES
    --------------------------------------------- */

    resources: {
      courses: Array.isArray(courses)
        ? courses
        : [],

      books: Array.isArray(books)
        ? books
        : [],

      projects: Array.isArray(projects)
        ? projects
        : [],

      youtube: Array.isArray(youtube)
        ? youtube
        : [],
    },

    /* ---------------------------------------------
       SKILL LIBRARY
    --------------------------------------------- */

    skillLibrary: {
      technical: Array.isArray(technicalSkills)
        ? technicalSkills
        : [],

      soft: Array.isArray(softSkills)
        ? softSkills
        : [],

      tools: Array.isArray(tools)
        ? tools
        : [],
    },
  };
}