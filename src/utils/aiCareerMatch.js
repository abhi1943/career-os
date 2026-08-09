export function calculateCareerMatch(student, career) {
  let score = 0;
  const matchedSkills = [];

// Dream Career Matching

if (student.dreamCareer) {

  const dream = student.dreamCareer.toLowerCase();

  const careerName = career.name.toLowerCase();

  if (
    careerName.includes(dream) ||
    dream.includes(careerName)
  ) {

    score += 30;

  } else {

    const synonyms = {
      developer: [
        "engineer",
        "programmer",
      ],

      engineer: [
        "developer",
      ],

      ai: [
        "artificial intelligence",
        "machine learning",
      ],

      software: [
        "programming",
        "developer",
      ],

      data: [
        "analytics",
        "scientist",
      ],
    };

    Object.keys(synonyms).forEach((key) => {

      if (
        dream.includes(key) &&
        synonyms[key].some((word) =>
          careerName.includes(word)
        )
      ) {
        score += 25;
      }

    });

  }

}

  // Education
  if (
    student.education &&
    career.eligibility
      .toLowerCase()
      .includes(student.education.toLowerCase())
  ) {
    score += 20;
  }

  // Interest Matching

const interestMap = {
  Technology: [
    "Java",
    "Python",
    "React",
    "JavaScript",
    "SQL",
    "Programming",
    "DSA",
    "Cloud",
    "Machine Learning",
  ],

  Medical: [
    "Biology",
    "Chemistry",
    "Patient Care",
    "Medicine",
  ],

  Business: [
    "Management",
    "Marketing",
    "Finance",
    "Leadership",
  ],

  Arts: [
    "Design",
    "Drawing",
    "Creativity",
    "Writing",
  ],

  "Government Jobs": [
    "Reasoning",
    "General Knowledge",
    "Aptitude",
  ],
};

if (student.interest) {
  const expectedSkills =
    interestMap[student.interest] || [];

  expectedSkills.forEach((expected) => {
    career.skills?.forEach((skill) => {
      if (
        skill.toLowerCase() ===
        expected.toLowerCase()
      ) {
        score += 5;

        if (!matchedSkills.includes(skill)) {
          matchedSkills.push(skill);
        }
      }
    });
  });
}

 // Student Skills (Weighted)
if (student.skills?.length) {
  student.skills.forEach((userSkill) => {
    career.skills?.forEach((skill) => {
      if (
        userSkill.toLowerCase() === skill.toLowerCase()
      ) {
        score += 10;

        if (!matchedSkills.includes(skill)) {
          matchedSkills.push(skill);
        }
      }
    });
  });
}

  // Small bonus
if (career.growth === "Excellent") score += 8;
else if (career.growth === "Very High") score += 6;
else if (career.growth === "High") score += 4;

  if (score > 100) score = 100;

  const reasons = [];

// Dream Career
if (
  student.dreamCareer &&
  career.name === student.dreamCareer
) {
  reasons.push(
    `Matches your career goal (${student.dreamCareer})`
  );
}

// Education
if (
  student.education &&
  career.eligibility
    .toLowerCase()
    .includes(student.education.toLowerCase())
) {
  reasons.push(
    `Suitable for your education`
  );
}

// Specialization
if (
  student.specialization &&
  career.description
    .toLowerCase()
    .includes(student.specialization.toLowerCase())
) {
  reasons.push(
    `Matches your specialization (${student.specialization})`
  );
}

// Skills
matchedSkills.forEach(skill => {
  reasons.push(
    `You already know ${skill}`
  );
});

if (career.growth === "Excellent") {
  reasons.push(
    "Excellent future demand"
  );
}
const missingSkills = [];

career.skills?.forEach((skill) => {
  const hasSkill = student.skills?.some(
    (userSkill) =>
      userSkill.toLowerCase() === skill.toLowerCase()
  );

  if (!hasSkill) {
    missingSkills.push(skill);
  }
});
const placementChance = Math.min(
  100,
  score +
    Math.floor((matchedSkills.length * 100) / career.skills.length)
);

const salaryPotential =
  career.growth === "Excellent"
    ? 95
    : career.growth === "Very High"
    ? 90
    : career.growth === "High"
    ? 80
    : 70;

const learningProgress = Math.round(
  (matchedSkills.length /
    career.skills.length) *
    100
);

const futureDemand =
  career.growth === "Excellent"
    ? 98
    : career.growth === "Very High"
    ? 92
    : 80;

return {
  score,
  matchedSkills,
  missingSkills,
  reasons, placementChance,
  salaryPotential,
  learningProgress,
  futureDemand,
};
}