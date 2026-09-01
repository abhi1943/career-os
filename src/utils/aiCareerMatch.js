import {
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
SPECIALIZATION → CAREER MATCH MAP
================================================== */

const specializationCareerMap = {
CSE: {
"software-engineer": 15,
"full-stack-developer": 14,
"backend-developer": 14,
"frontend-developer": 13,
"qa-engineer": 10,
"mobile-app-developer": 9,
"cloud-engineer": 9,
"devops-engineer": 9,
},

"AI & ML": {
  "ai-engineer": 15,
  "machine-learning-engineer": 15,
  "data-scientist": 14,
  "software-engineer": 8,
  "backend-developer": 6,
},

"Data Science": {
"data-scientist": 15,
"data-analyst": 14,
"business-analyst": 11,
"ai-engineer": 10,
},

"Cyber Security": {
"cyber-security-engineer": 15,
"security-analyst": 14,
"soc-analyst": 14,
"ethical-hacker": 13,
"penetration-tester": 12,
"cloud-engineer": 8,
"devops-engineer": 8,
},

IT: {
"software-engineer": 15,
"full-stack-developer": 14,
"backend-developer": 14,
"frontend-developer": 13,
"cloud-engineer": 11,
"devops-engineer": 11,
"qa-engineer": 9,
},

ECE: {
"embedded-engineer": 15,
"vlsi-engineer": 15,
"iot-engineer": 13,
"electronics-engineer": 13,
"hardware-engineer": 12,
"network-engineer": 9,
},

EEE: {
"electrical-engineer": 15,
"power-systems-engineer": 14,
"electrical-design-engineer": 14,
"control-systems-engineer": 13,
"maintenance-engineer": 11,
},

Mechanical: {
"mechanical-engineer": 15,
"automobile-engineer": 14,
"production-engineer": 14,
"design-engineer": 13,
"manufacturing-engineer": 13,
},

Civil: {
"civil-engineer": 15,
"structural-engineer": 14,
"construction-engineer": 14,
"site-engineer": 13,
"quantity-surveyor": 11,
},

BCA: {
"software-engineer": 13,
"full-stack-developer": 13,
"frontend-developer": 12,
"backend-developer": 12,
"qa-engineer": 9,
"mobile-app-developer": 8,
"data-analyst": 12,
},

"B.Sc": {
"data-scientist": 13,
"data-analyst": 14,
"software-engineer": 9,
"business-analyst": 10,
"research-analyst": 11,
},

"B.Com": {
accountant: 14,
"financial-analyst": 15,
"business-analyst": 13,
"bank-officer": 11,
"chartered-accountant": 15,
"tax-consultant": 12,
},

BBA: {
"business-analyst": 14,
"marketing-manager": 13,
"hr-manager": 13,
"business-executive": 11,
"operations-manager": 13,
entrepreneur: 10,
},

BA: {
"government-officer": 13,
lawyer: 13,
journalist: 13,
teacher: 13,
"content-writer": 12,
"social-worker": 10,
},
};

/* ==================================================
DREAM CAREER ALIASES
================================================== */

const dreamCareerAliases = {
"data scientist": [
"data scientist",
"data science",
],

"data analyst": [
"data analyst",
"data analytics",
"data analysis",
],

"business analyst": [
"business analyst",
"business analysis",
],

"ai engineer": [
"ai engineer",
"artificial intelligence engineer",
"machine learning engineer",
],

"machine learning engineer": [
"machine learning engineer",
"ml engineer",
],

"software engineer": [
"software engineer",
"software developer",
"software programmer",
],

"frontend developer": [
"frontend developer",
"front end developer",
"ui developer",
],

"backend developer": [
"backend developer",
"back end developer",
"server developer",
],

"full stack developer": [
"full stack developer",
"full-stack developer",
"fullstack developer",
"web developer",
],

"cloud engineer": [
"cloud engineer",
"cloud developer",
],

"devops engineer": [
"devops engineer",
"devops developer",
],

"cyber security engineer": [
"cyber security engineer",
"cybersecurity engineer",
"security engineer",
],

"ethical hacker": [
"ethical hacker",
"penetration tester",
"pen tester",
],

"soc analyst": [
"soc analyst",
"security operations analyst",
],
};

/* ==================================================
CAREER NAME MATCHING
================================================== */

function careerNameMatches(
dreamCareer,
careerName
) {
const dream = normalizeText(dreamCareer);
const name = normalizeText(careerName);

if (!dream || !name) {
return false;
}

if (dream === name) {
return true;
}

if (
name.includes(dream) ||
dream.includes(name)
) {
return true;
}

const dreamAliases =
dreamCareerAliases[dream] || [dream];

return dreamAliases.some(
(alias) =>
name === alias ||
name.includes(alias) ||
alias.includes(name)
);
}

/* ==================================================
INTEREST MAP
================================================== */

const interestMap = {
  technology: [
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

  data: [
    "excel",
    "sql",
    "python",
    "pandas",
    "power bi",
    "tableau",
    "statistics",
    "data analysis",
  ],

  "artificial-intelligence": [
    "python",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "statistics",
    "ai",
  ],

  business: [
    "management",
    "marketing",
    "finance",
    "leadership",
    "business",
  ],

  finance: [
    "accounting",
    "finance",
    "taxation",
    "auditing",
    "financial analysis",
    "excel",
  ],

  healthcare: [
    "biology",
    "chemistry",
    "patient care",
    "medicine",
  ],

  design: [
    "design",
    "drawing",
    "creativity",
    "writing",
  ],

  government: [
    "reasoning",
    "general knowledge",
    "aptitude",
    "current affairs",
  ],

  engineering: [
    "engineering",
    "mechanical",
    "electrical",
    "electronics",
    "design",
    "technical",
  ],

  research: [
    "research",
    "statistics",
    "analysis",
    "python",
    "data analysis",
  ],
};

/* ==================================================
EDUCATION MATCHING
================================================== */

function educationMatches(
studentEducation,
careerEligibility
) {
if (
!studentEducation ||
!careerEligibility
) {
return false;
}

const education =
normalizeText(studentEducation);

const eligibility =
normalizeText(careerEligibility);

const educationAliases = {
btech: [
"b.tech",
"btech",
"b.e",
"engineering",
],


degree: [
  "degree",
  "bca",
  "b.sc",
  "b.com",
  "bba",
  "ba",
],

intermediate: [
  "intermediate",
  "12th",
  "10+2",
],

medical: [
  "medical",
  "mbbs",
  "bds",
],

polytechnic: [
  "polytechnic",
  "diploma",
],

iti: [
  "iti",
],


};

const aliases =
educationAliases[education] ||
[education];

return aliases.some(
(alias) =>
eligibility.includes(alias)
);
}

/* ==================================================
INTEREST MATCH CALCULATION
================================================== */

function calculateInterestMatch(
interest,
careerSkills
) {
if (
!interest ||
!Array.isArray(careerSkills) ||
careerSkills.length === 0
) {
return {
score: 0,
matchedSkills: [],
};
}

const interestAliases = {
  Technology: "technology",
  "Data & Analytics": "data",
  "Data Analytics": "data",
  "Artificial Intelligence": "artificial-intelligence",
  Business: "business",
  Finance: "finance",
  Healthcare: "healthcare",
  "Design & Creativity": "design",
  "Government & Public Service": "government",
  Engineering: "engineering",
  Research: "research",
};

const interestKey =
  interestAliases[interest] || interest;

const expectedSkills =
  interestMap[interestKey] || [];

if (!expectedSkills.length) {
return {
score: 0,
matchedSkills: [],
};
}

const matchedSkills = [];

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
  }
}


);

/*
Interest is worth a maximum of 15 points.

```
These skills are used ONLY to determine
how well the career matches the student's
interest.

They are NOT treated as skills the student
already knows.
```

*/

const percentage =
expectedSkills.length > 0
? matchedSkills.length /
expectedSkills.length
: 0;

const score = Math.min(
15,
Math.round(percentage * 15)
);

return {
score,
matchedSkills,
};
}

/* ==================================================
MAIN CAREER MATCH ENGINE
================================================== */

export function calculateCareerMatch(
student,
career
) {
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

const careerSkills =
Array.isArray(career.skills)
? career.skills
: [];

const studentSkills =
Array.isArray(student.skills)
? student.skills
: [];

/* --------------------------------------------------
SCORE COMPONENTS

```
 Maximum:
 Dream Career     = 25
 Education        = 20
 Interest         = 15
 Skills           = 25
 Specialization   = 15

 TOTAL             = 100
```

-------------------------------------------------- */

let score = 0;

const reasons = [];

/* ==================================================
1. DREAM CAREER MATCH — 25 POINTS
================================================== */

if (
student.dreamCareer &&
career.name &&
careerNameMatches(
student.dreamCareer,
career.name
)
) {
score += 25;


reasons.push(
  `Matches your career goal (${student.dreamCareer})`
);


}

/* ==================================================
2. EDUCATION MATCH — 20 POINTS
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
3. INTEREST MATCH — 15 POINTS
================================================== */

const interestResult =
  calculateInterestMatch(
    student.interestKey || student.interest,
    careerSkills
  );

score += interestResult.score;

/*
IMPORTANT:
Interest-matched skills are NOT added
to matchedSkills.

```
They only contribute to the interest
score because interest does not mean
the student has already learned those
skills.
```

*/

if (
interestResult.score > 0
) {
reasons.push(
`Matches your interest (${student.interest})`
);
}

/* ==================================================
4. STUDENT SKILL MATCH — 25 POINTS
================================================== */

/*
These are the ONLY skills that should
appear as "Matched Skills".

```
They come directly from the student's
actual skills and are compared against
the career's required skills.
```

*/

const matchedCareerSkills =
getMatchedSkills(
studentSkills,
careerSkills
);

/*
Skill score is based on the actual
percentage of career skills the
student already has.

```
Maximum = 25 points.
```

*/

const skillPercentage =
careerSkills.length > 0
? matchedCareerSkills.length /
careerSkills.length
: 0;

const skillScore = Math.min(
25,
Math.round(
skillPercentage * 25
)
);

score += skillScore;

if (
matchedCareerSkills.length > 0
) {
reasons.push(
`You already know ${matchedCareerSkills.length} required skill${matchedCareerSkills.length === 1 ? "" : "s"}`
);
}

/* ==================================================
5. SPECIALIZATION MATCH — 15 POINTS
================================================== */

if (
student.specialization &&
career.id
) {
const specializationMap =
specializationCareerMap[
student.specialization
];


const specializationScore =
  specializationMap?.[
    career.id
  ] || 0;

if (
  specializationScore > 0
) {
  score += Math.min(
    15,
    specializationScore
  );

  reasons.push(
    `Strong match for your specialization (${student.specialization})`
  );
}

}

/* ==================================================
6. FINAL MATCH SCORE
================================================== */

score = Math.min(
100,
Math.round(score)
);

/* ==================================================
7. MISSING SKILLS
================================================== */

/*
Missing skills are calculated from
the student's ACTUAL skills only.

```
Therefore a skill cannot appear in both
matchedSkills and missingSkills.
```

*/

const missingSkills =
getMissingSkills(
studentSkills,
careerSkills
);

/* ==================================================
8. LEARNING PROGRESS

```
 Based ONLY on actual career
 skills already matched.
```

================================================== */

const learningProgress =
careerSkills.length > 0
? Math.min(
100,
Math.round(
(
matchedCareerSkills.length /
careerSkills.length
) * 100
)
)
: 0;

/* ==================================================
9. PLACEMENT CHANCE
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
10. SALARY POTENTIAL

```
 This represents career potential,
 NOT student's current salary.
```

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
11. FUTURE DEMAND
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
12. RETURN
================================================== */

return {
score,


/*
  IMPORTANT:
  matchedSkills contains ONLY skills the
  student actually has.
*/
matchedSkills: matchedCareerSkills,

/*
  missingSkills contains ONLY required
  career skills the student does not have.
*/
missingSkills,

reasons,

placementChance,

salaryPotential,

learningProgress,

futureDemand,

skillPercentage: Math.round(
  skillPercentage * 100
),


};
}
