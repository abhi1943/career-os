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
      job.company?.toLowerCase() || "";

    const location =
      job.location?.toLowerCase() || "";

    const experience =
      job.experience?.toLowerCase() || "";

    return (
      title.includes(search) ||
      company.includes(search) ||
      location.includes(search) ||
      experience.includes(search)
    );
  });
}



export function filterJobs(
  jobList,
  {
    location = "All",
    experience = "All",
    type = "All",
  } = {}
) {
  return jobList.filter((job) => {

    const locationMatch =
      location === "All" ||
      job.location === location;

    const experienceMatch =
      experience === "All" ||
      job.experience === experience;

    const typeMatch =
      type === "All" ||
      job.type === type;

    return (
      locationMatch &&
      experienceMatch &&
      typeMatch
    );
  });
}



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
