import jobs from "../data/jobs/jobs";

export function getJobsForStudent(student) {
  if (!student) {
    return [];
  }

  const career =
    student.dreamCareer ||
    student.targetRole ||
    "";

  if (!career) {
    return [];
  }


  const careerId = career
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

  return jobs[careerId] || [];
}


export function searchJobs(
  jobList,
  searchTerm = ""
) {
  const search =
    searchTerm.trim().toLowerCase();

  if (!search) {
    return jobList;
  }

  return jobList.filter((job) => {

    const title =
      job.title?.toLowerCase() || "";

    const company =
  typeof job.company === "string"
    ? job.company.toLowerCase()
    : job.company?.display_name?.toLowerCase() || "";

    const location =
  typeof job.location === "string"
    ? job.location.toLowerCase()
    : job.location?.display_name?.toLowerCase() || "";

    const experience =
  typeof job.experience === "string"
    ? job.experience.toLowerCase()
    : job.detected_experience?.toLowerCase() || "";

    const description =
  typeof job.description === "string"
    ? job.description.toLowerCase()
    : "";

    const skills = `
  ${Array.isArray(job.skills)
    ? job.skills
        .filter((skill) => typeof skill === "string")
        .join(" ")
    : ""}
  ${job.title || ""}
  ${job.description || ""}
`.toLowerCase();
    

    return (
  title.includes(search) ||
  company.includes(search) ||
  location.includes(search) ||
  experience.includes(search) ||
  description.includes(search) ||
  skills.includes(search)
);
  });
}

// 

export function filterJobs(
  jobList,
  {
    location = "All",
    workMode = "All",
    experience = "All",
    category = "All",
  } = {}
) {
  return jobList.filter((job) => {

    // ----------------------------------------------
    // Location
    // ----------------------------------------------

    const jobLocation =
      typeof job.location === "string"
        ? job.location
        : job.location?.display_name || "";

    const normalizedJobLocation =
  jobLocation
    .toLowerCase()
    .replace("bengaluru", "bangalore")
    .trim();

const normalizedFilterLocation =
  location
    .toLowerCase()
    .replace("bengaluru", "bangalore")
    .trim();

const locationMatch =
  location === "All" ||
  normalizedJobLocation.includes(
    normalizedFilterLocation
  );


    // ----------------------------------------------
    // Work Mode
    // ----------------------------------------------

    const jobWorkMode =
      job.detected_work_mode ||
      job.workMode ||
      "Not Specified";

    const workModeMatch =
      workMode === "All" ||
      jobWorkMode === workMode;


    // ----------------------------------------------
    // Experience
    // ----------------------------------------------

    const jobExperience =
      job.detected_experience ||
      job.experience ||
      "Any Experience";

    const experienceMatch =
      experience === "All" ||
      jobExperience === experience;


    // ----------------------------------------------
    // Category
    // ----------------------------------------------

    const categoryText = `
  ${job.title || ""}
  ${job.description || ""}
  ${job.category?.label || ""}
  ${job.category?.tag || ""}
`.toLowerCase();

let detectedCategory = "Other";

if (
  /\b(frontend|front-end|react|angular|vue|javascript|ui developer)\b/.test(
    categoryText
  )
) {
  detectedCategory = "Frontend Development";
} else if (
  /\b(backend|back-end|node|spring boot|java developer|django|flask|api developer)\b/.test(
    categoryText
  )
) {
  detectedCategory = "Backend Development";
} else if (
  /\b(full stack|full-stack|mern|mean)\b/.test(
    categoryText
  )
) {
  detectedCategory = "Full Stack Development";
} else if (
  /\b(data analyst|data analytics|power bi|tableau|sql analyst)\b/.test(
    categoryText
  )
) {
  detectedCategory = "Data & Analytics";
} else if (
  /\b(data scientist|data science|machine learning scientist)\b/.test(
    categoryText
  )
) {
  detectedCategory = "Data Science";
} else if (
  /\b(ai engineer|artificial intelligence|machine learning|deep learning|generative ai|genai)\b/.test(
    categoryText
  )
) {
  detectedCategory = "Artificial Intelligence";
} else if (
  /\b(test engineer|testing|qa engineer|quality assurance|automation tester)\b/.test(
    categoryText
  )
) {
  detectedCategory = "Testing";
} else if (
  /\b(devops|cloud engineer|aws|azure|gcp|kubernetes|docker)\b/.test(
    categoryText
  )
) {
  detectedCategory = "Cloud & DevOps";
} else if (
  /\b(software engineer|software developer|developer|programmer)\b/.test(
    categoryText
  )
) {
  detectedCategory = "Software Development";
}

const categoryMatch =
  category === "All" ||
  detectedCategory === category;


    return (
      locationMatch &&
      workModeMatch &&
      experienceMatch &&
      categoryMatch
    );
  });
}

// 

export function getJobById(
  careerId,
  jobId
) {
  const careerJobs =
    jobs[careerId] || [];

  return (
    careerJobs.find(
      (job) =>
        String(job.id) === String(jobId)
    ) || null
  );
}


export function getAllJobs() {
  return Object.values(jobs).flat();
}
