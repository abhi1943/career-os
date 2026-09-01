export function normalizeSkill(skill) {
  if (typeof skill !== "string") {
    return "";
  }

  return skill
    .toLowerCase()
    .trim()
    .replace(/[.&/]/g, " ")
    .replace(/\s+/g, " ");
}

const aliases = {
  javascript: [
    "javascript",
    "js",
  ],

  js: [
    "javascript",
    "js",
  ],

  react: [
    "react",
    "reactjs",
    "react js",
  ],

  python: [
    "python",
    "python3",
  ],

  sql: [
    "sql",
    "mysql",
    "postgresql",
    "database",
  ],

  "git github": [
    "git",
    "github",
    "git github",
    "git git hub",
  ],

  git: [
    "git github",
    "github",
    "git git hub",
  ],

  github: [
    "git github",
    "git",
    "git git hub",
  ],

  "data structures algorithms": [
    "data structures",
    "algorithms",
    "dsa",
    "data structures algorithms",
    "data structures  algorithms",
  ],

  machine: [
    "machine learning",
    "ml",
  ],

  "machine learning": [
    "ml",
    "machine learning",
  ],

  artificial: [
    "artificial intelligence",
    "ai",
  ],

  "artificial intelligence": [
    "ai",
    "artificial intelligence",
  ],
};

export function skillsMatch(studentSkill, careerSkill) {
  const student = normalizeSkill(studentSkill);
  const career = normalizeSkill(careerSkill);

  if (!student || !career) {
    return false;
  }

  // Exact match
  if (student === career) {
    return true;
  }

  // Alias match
  if (
    aliases[student]?.includes(career) ||
    aliases[career]?.includes(student)
  ) {
    return true;
  }

  return false;
}

export function getMatchedSkills(
  studentSkills = [],
  careerSkills = []
) {
  const matched = [];

  careerSkills.forEach((careerSkill) => {
    const exists = studentSkills.some(
      (studentSkill) =>
        skillsMatch(studentSkill, careerSkill)
    );

    if (
      exists &&
      !matched.includes(careerSkill)
    ) {
      matched.push(careerSkill);
    }
  });

  return matched;
}

export function getMissingSkills(
  studentSkills = [],
  careerSkills = []
) {
  const missing = [];

  careerSkills.forEach((careerSkill) => {
    const exists = studentSkills.some(
      (studentSkill) =>
        skillsMatch(studentSkill, careerSkill)
    );

    if (
      !exists &&
      !missing.includes(careerSkill)
    ) {
      missing.push(careerSkill);
    }
  });

  return missing;
}

export function getSkillMatchPercentage(
  studentSkills = [],
  careerSkills = []
) {
  if (!careerSkills.length) {
    return 0;
  }

  const matched = getMatchedSkills(
    studentSkills,
    careerSkills
  );

  return Math.round(
    (matched.length / careerSkills.length) * 100
  );
}

export function getSkillAnalysis(
  studentSkills = [],
  careerSkills = []
) {
  const matched = getMatchedSkills(
    studentSkills,
    careerSkills
  );

  const missing = getMissingSkills(
    studentSkills,
    careerSkills
  );

  const percentage =
    careerSkills.length === 0
      ? 0
      : Math.round(
          (matched.length / careerSkills.length) *
            100
        );

  return {
    matched,
    missing,
    percentage,
  };
}