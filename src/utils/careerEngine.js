import database from "../data";

/**
 * Get career options based on the student's
 * education and specialization.
 */
export function getCareerOptions(student) {
  if (!student) return [];

  const education = student.education;
  const specialization = student.specialization;

  // ---------- AFTER 10TH ----------
  if (education === "after10th") {
    return Array.isArray(database.after10th)
      ? database.after10th
      : [];
  }

  // ---------- INTERMEDIATE ----------
  if (education === "intermediate") {
    switch (specialization) {
      case "MPC":
        return Array.isArray(database.engineering)
          ? database.engineering
          : [];

      case "BiPC":
        return Array.isArray(database.medical)
          ? database.medical
          : [];

      case "MEC":
      case "CEC":
      case "HEC":
        return Array.isArray(database.degree)
          ? database.degree
          : [];

      default:
        return Array.isArray(database.intermediate)
          ? database.intermediate
          : [];
    }
  }

  // ---------- POLYTECHNIC ----------
  if (education === "polytechnic") {
    return Array.isArray(database.professionalCareers)
      ? database.professionalCareers
      : [];
  }

  // ---------- ITI ----------
  if (education === "iti") {
    return Array.isArray(database.professionalCareers)
      ? database.professionalCareers
      : [];
  }

  // ---------- DEGREE ----------
  if (education === "degree") {
    return Array.isArray(database.professionalCareers)
      ? database.professionalCareers
      : [];
  }

  // ---------- B.TECH ----------
  if (education === "btech") {
    const jobs = Array.isArray(database.professionalCareers)
      ? database.professionalCareers
      : [];

    switch (specialization) {
      case "CSE":
        return jobs.filter((job) =>
          [
            "software-engineer",
            "full-stack-developer",
            "frontend-developer",
            "backend-developer",
            "cloud-engineer",
            "devops-engineer",
            "qa-engineer",
          ].includes(job.id)
        );

      case "AI & ML":
        return jobs.filter((job) =>
          [
            "ai-engineer",
            "data-scientist",
            "software-engineer",
          ].includes(job.id)
        );

      case "Data Science":
        return jobs.filter((job) =>
          [
            "data-scientist",
            "ai-engineer",
            "software-engineer",
          ].includes(job.id)
        );

      case "Cyber Security":
        return jobs.filter((job) =>
          [
            "cyber-security-engineer",
            "cloud-engineer",
            "devops-engineer",
          ].includes(job.id)
        );

      case "ECE":
        return jobs.filter((job) =>
          [
            "software-engineer",
            "frontend-developer",
            "backend-developer",
            "cloud-engineer",
          ].includes(job.id)
        );

      default:
        return jobs;
    }
  }

  // ---------- MEDICAL ----------
  if (education === "medical") {
    return Array.isArray(database.professionalCareers)
      ? database.professionalCareers
      : [];
  }

  // ---------- GOVERNMENT ----------
  if (education === "government") {
    return Array.isArray(database.government)
      ? database.government
      : [];
  }

  return [];
}


/**
 * Find a career by ID.
 */
export function getCareerById(careerId) {
  if (!careerId) return null;

  const careerCollections = Object.values(database);

  for (const collection of careerCollections) {
    if (!Array.isArray(collection)) continue;

    const career = collection.find(
      (item) => item?.id === careerId
    );

    if (career) {
      return career;
    }
  }

  return null;
}