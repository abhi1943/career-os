import {
  // normalizeSkill,
  skillsMatch,
  getMatchedSkills,
  getMissingSkills,
} from "./skillEngine";

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
    .replace(/\s+/g, " ");
}

/* ==================================================
   CAREER NAME MATCHING
================================================== */

function careerNameMatches(dreamCareer, careerName) {
  const dream = normalizeText(dreamCareer);
  const name = normalizeText(careerName);

  if (!dream || !name) {
    return false;
  }

  /* --------------------------------------------------
     Exact / Partial Match
  -------------------------------------------------- */

  if (
    name.includes(dream) ||
    dream.includes(name)
  ) {
    return true;
  }

  /* --------------------------------------------------
     Related Career Groups
  -------------------------------------------------- */

  const groups = [
    [
      "developer",
      "engineer",
      "programmer",
    ],

    [
      "software",
      "developer",
      "programming",
    ],

    [
      "ai",
      "artificial intelligence",
      "machine learning",
    ],

    [
      "data",
      "data science",
      "data scientist",
      "analytics",
    ],

    [
      "frontend",
      "front end",
      "ui developer",
    ],

    [
      "backend",
      "back end",
      "server",
    ],

    [
      "full stack",
      "full-stack",
      "web developer",
    ],

    [
      "cyber security",
      "cybersecurity",
      "security",
    ],
  ];

  return groups.some((group) => {
    const dreamMatches = group.some((word) =>
      dream.includes(word)
    );

    const careerMatches = group.some((word) =>
      name.includes(word)
    );

    return dreamMatches && careerMatches;
  });
}

/* ==================================================
   INTEREST MAP
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
    "machine learning",
    "software",
    "web",
  ],

  Medical: [
    "biology",
    "chemistry",
    "patient care",
    "medicine",
  ],

  Business: [
    "management",
    "marketing",
    "finance",
    "leadership",
  ],

  Arts: [
    "design",
    "drawing",
    "creativity",
    "writing",
  ],

  "Government Jobs": [
    "reasoning",
    "general knowledge",
    "aptitude",
  ],
};

/* ==================================================
   MAIN CAREER MATCH ENGINE
================================================== */

export function calculateCareerMatch(student, career) {
  /* --------------------------------------------------
     SAFE FALLBACK
  -------------------------------------------------- */

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

  /* --------------------------------------------------
     SAFE DATA
  -------------------------------------------------- */

  const careerSkills = Array.isArray(career.skills)
    ? career.skills
    : [];

  const studentSkills = Array.isArray(student.skills)
    ? student.skills
    : [];

  let score = 0;

  const matchedSkills = [];

  const reasons = [];

  /* ==================================================
     1. DREAM CAREER MATCH
  ================================================== */

  if (
    student.dreamCareer &&
    career.name &&
    careerNameMatches(
      student.dreamCareer,
      career.name
    )
  ) {
    score += 30;

    reasons.push(
      `Matches your career goal (${student.dreamCareer})`
    );
  }

  /* ==================================================
     2. EDUCATION MATCH
  ================================================== */

  if (
    student.education &&
    career.eligibility
  ) {
    const education = normalizeText(
      student.education
    );

    const eligibility = normalizeText(
      career.eligibility
    );

    if (
      eligibility.includes(education) ||
      education.includes(eligibility)
    ) {
      score += 20;

      reasons.push(
        "Suitable for your education"
      );
    }
  }

  /* ==================================================
     3. INTEREST MATCH
  ================================================== */

  if (student.interest) {
    const expectedSkills =
      interestMap[student.interest] || [];

    expectedSkills.forEach((expectedSkill) => {
      const matchedCareerSkill =
        careerSkills.find((careerSkill) =>
          skillsMatch(
            expectedSkill,
            careerSkill
          )
        );

      if (matchedCareerSkill) {
        score += 4;

        if (
          !matchedSkills.includes(
            matchedCareerSkill
          )
        ) {
          matchedSkills.push(
            matchedCareerSkill
          );
        }
      }
    });
  }

  /* ==================================================
     4. STUDENT SKILL MATCH
  ================================================== */

  const matchedCareerSkills =
    getMatchedSkills(
      studentSkills,
      careerSkills
    );

  matchedCareerSkills.forEach((skill) => {
    if (!matchedSkills.includes(skill)) {
      matchedSkills.push(skill);

      score += 8;

      reasons.push(
        `You already know ${skill}`
      );
    }
  });

  /* ==================================================
     5. CAREER GROWTH
  ================================================== */

  if (career.growth === "Excellent") {
    score += 8;
  } else if (career.growth === "Very High") {
    score += 6;
  } else if (career.growth === "High") {
    score += 4;
  }

  /* ==================================================
     6. SPECIALIZATION
  ================================================== */

  if (
    student.specialization &&
    career.description
  ) {
    const specialization = normalizeText(
      student.specialization
    );

    const description = normalizeText(
      career.description
    );

    if (
      specialization &&
      description.includes(specialization)
    ) {
      score += 10;

      reasons.push(
        `Matches your specialization (${student.specialization})`
      );
    }
  }

  /* ==================================================
     7. FINAL MATCH SCORE
  ================================================== */

  score = Math.min(
    100,
    Math.round(score)
  );

  /* ==================================================
     8. MISSING SKILLS
  ================================================== */

  const missingSkills = getMissingSkills(
    studentSkills,
    careerSkills
  );

  /* ==================================================
     9. LEARNING PROGRESS
  ================================================== */

  const learningProgress =
    careerSkills.length > 0
      ? Math.round(
          (matchedSkills.length /
            careerSkills.length) *
            100
        )
      : 0;

  /* ==================================================
     10. PLACEMENT CHANCE
  ================================================== */

  const placementChance = Math.min(
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

  if (career.growth === "Excellent") {
    salaryPotential = 95;
  } else if (career.growth === "Very High") {
    salaryPotential = 90;
  } else if (career.growth === "High") {
    salaryPotential = 80;
  }

  /* ==================================================
     12. FUTURE DEMAND
  ================================================== */

  let futureDemand = 80;

  if (career.growth === "Excellent") {
    futureDemand = 98;
  } else if (career.growth === "Very High") {
    futureDemand = 92;
  } else if (career.growth === "High") {
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