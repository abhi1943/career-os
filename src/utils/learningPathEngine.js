import {
  // skillsMatch,
  getMissingSkills,
} from "./skillEngine";

/* ==================================================
   CREATE STABLE SKILL ID
================================================== */

function createSkillId(skill) {
  return String(skill)
    .toLowerCase()
    .trim()
    .replace(/[.&/]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/* ==================================================
   GENERATE PERSONALIZED LEARNING PATH
================================================== */

export function generateLearningPath(
  student,
  career
) {
  if (!student || !career) {
    return [];
  }

  const studentSkills =
    Array.isArray(student.skills)
      ? student.skills
      : [];

  const careerSkills =
    Array.isArray(career.skills)
      ? career.skills
      : [];

  /* ==================================================
     FIND MISSING SKILLS
  ================================================== */

  const missingSkills =
    getMissingSkills(
      studentSkills,
      careerSkills
    );

  /* ==================================================
     GENERATE WEEK-BY-WEEK PATH
  ================================================== */

  return missingSkills.map(
    (skill, index) => ({
      id: createSkillId(skill),

      week: `Week ${index + 1}`,

      skill,

      status: "not-started",
    })
  );
}

export default generateLearningPath;