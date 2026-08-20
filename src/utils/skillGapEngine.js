import {
  getMatchedSkills,
  getMissingSkills,
} from "./skillEngine";

/* ==================================================
   SKILL GAP ENGINE
================================================== */

export function analyzeSkillGap(
  student,
  career
) {
  if (!student || !career) {
    return null;
  }

  const userSkills = Array.isArray(
    student.skills
  )
    ? student.skills
    : [];

  const requiredSkills = Array.isArray(
    career.skills
  )
    ? career.skills
    : [];

  /* ==================================================
     MATCHED SKILLS
  ================================================== */

  const matched =
    getMatchedSkills(
      userSkills,
      requiredSkills
    );

  /* ==================================================
     MISSING SKILLS
  ================================================== */

  const missing =
    getMissingSkills(
      userSkills,
      requiredSkills
    );

  /* ==================================================
     PERCENTAGE
  ================================================== */

  const percentage =
    requiredSkills.length === 0
      ? 0
      : Math.round(
          (matched.length /
            requiredSkills.length) *
            100
        );

  /* ==================================================
     READINESS LEVEL
  ================================================== */

  let level =
    "Needs Learning";

  if (percentage >= 90) {
    level = "Industry Ready";
  } else if (percentage >= 75) {
    level = "Almost Ready";
  } else if (percentage >= 50) {
    level = "Good Foundation";
  }

  /* ==================================================
     RETURN
  ================================================== */

  return {
    matched,
    missing,
    percentage,
    level,
  };
}