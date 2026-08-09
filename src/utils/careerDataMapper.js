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
import professions from "../data/professions";

export function getCareerCompleteData(careerId) {
  let career = null;

  // Search Education Careers
  Object.values(database).forEach((list) => {
    const found = list.find((item) => item.id === careerId);

    if (found) {
      career = found;
    }
  });

  // Search Professional Careers
  if (!career) {
    career = professions.find((item) => item.id === careerId);
  }

  if (!career) {
  console.log("Career NOT Found:", careerId);
  return null;
}

console.log("Career Found:", career);

  return {
    ...career,

    roadmap: roadmaps[careerId] || career.roadmap || [],

    salary: {
      india: indiaSalaries[careerId] || {},
      abroad: abroadSalaries[careerId] || {},
    },

    interview: {
      technical: technicalQuestions[careerId] || [],
      hr: hrQuestions || [],
    },

    resources: {
      courses,
      books,
      projects,
      youtube,
    },

    skillLibrary: {
  technical: technicalSkills,
  soft: softSkills,
  tools,
},
  };
}