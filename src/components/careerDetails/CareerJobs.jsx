import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  Clock3,
  ExternalLink,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Target,
} from "lucide-react";

import { getJobs } from "../../services/jobService";

/*
 * ============================================================
 * CAREER NAME → CAREER ID
 * ============================================================
 */

const careerIdMap = {
  "frontend developer": "frontend-developer",
  "react developer": "react-developer",
  "software engineer": "software-engineer",
  "full stack developer": "full-stack-developer",
  "backend developer": "backend-developer",
  "java developer": "java-developer",
  "python developer": "python-developer",
  "web developer": "web-developer",
  "mobile developer": "mobile-developer",
  "ai engineer": "ai-engineer",
  "data scientist": "data-scientist",
  "data analyst": "data-analyst",
  "machine learning engineer": "machine-learning-engineer",
  "devops engineer": "devops-engineer",
  "cloud engineer": "cloud-engineer",
  "cyber security": "cyber-security",
  "cyber security engineer": "cybersecurity-engineer",
  "cybersecurity engineer": "cybersecurity-engineer",
  "ethical hacker": "ethical-hacker",
  "soc analyst": "soc-analyst",
  "ui ux designer": "ui-ux-designer",
  "product designer": "product-designer",
  "business analyst": "business-analyst",
  "power bi developer": "power-bi-developer",
  "sql developer": "sql-developer",
  "embedded engineer": "embedded-engineer",
  "vlsi engineer": "vlsi-engineer",
  "iot engineer": "iot-engineer",
  "electronics engineer": "electronics-engineer",
  "electrical engineer": "electrical-engineer",
  "mechanical engineer": "mechanical-engineer",
  "civil engineer": "civil-engineer",
  "automobile engineer": "automobile-engineer",
  "production engineer": "production-engineer",
  "research engineer": "research-engineer",
  "research analyst": "research-analyst",
  accountant: "accountant",
  "financial analyst": "financial-analyst",
  "bank officer": "bank-officer",
  "chartered accountant": "chartered-accountant",
  teacher: "teacher",
  lawyer: "lawyer",
  journalist: "journalist",
  doctor: "doctor",
  dentist: "dentist",
  pharmacist: "pharmacist",
  "government officer": "government-officer",
  "content writer": "content-writer",
};

/*
 * ============================================================
 * CAREER SEARCH QUERIES
 * ============================================================
 */

const careerQueries = {
  "frontend-developer": "frontend developer",
  "react-developer": "react developer",
  "software-engineer": "software engineer",
  "full-stack-developer": "full stack developer",
  "backend-developer": "backend developer",
  "java-developer": "java developer",
  "python-developer": "python developer",
  "web-developer": "web developer",
  "mobile-developer": "mobile developer",
  "ai-engineer": "AI engineer",
  "data-scientist": "data scientist",
  "data-analyst": "data analyst",
  "machine-learning-engineer": "machine learning engineer",
  "devops-engineer": "DevOps engineer",
  "cloud-engineer": "cloud engineer",
  "cyber-security": "cyber security",
  "cybersecurity-engineer": "cybersecurity engineer",
  "ethical-hacker": "ethical hacker",
  "soc-analyst": "SOC analyst",
  "ui-ux-designer": "UI UX designer",
  "product-designer": "product designer",
  "business-analyst": "business analyst",
  "power-bi-developer": "Power BI developer",
  "sql-developer": "SQL developer",
  "embedded-engineer": "embedded engineer",
  "vlsi-engineer": "VLSI engineer",
  "iot-engineer": "IoT engineer",
  "electronics-engineer": "electronics engineer",
  "electrical-engineer": "electrical engineer",
  "mechanical-engineer": "mechanical engineer",
  "civil-engineer": "civil engineer",
  "automobile-engineer": "automobile engineer",
  "production-engineer": "production engineer",
  "research-engineer": "research engineer",
  "research-analyst": "research analyst",
  accountant: "accountant",
  "financial-analyst": "financial analyst",
  "bank-officer": "bank officer",
  "chartered-accountant": "chartered accountant",
  teacher: "teacher",
  lawyer: "lawyer",
  journalist: "journalist",
  doctor: "doctor",
  dentist: "dentist",
  pharmacist: "pharmacist",
  "government-officer": "government officer",
  "content-writer": "content writer",
};

/*
 * ============================================================
 * CAREER SKILLS
 * ============================================================
 */

const careerSkills = {
  "frontend-developer": [
    "html",
    "css",
    "javascript",
    "react",
    "typescript",
    "tailwind",
    "bootstrap",
    "git",
  ],

  "react-developer": [
    "react",
    "javascript",
    "html",
    "css",
    "typescript",
    "redux",
    "git",
  ],

  "software-engineer": [
    "javascript",
    "java",
    "python",
    "sql",
    "git",
    "algorithms",
    "data structures",
  ],

  "full-stack-developer": [
    "javascript",
    "react",
    "node",
    "html",
    "css",
    "sql",
    "mongodb",
    "git",
  ],

  "backend-developer": [
    "java",
    "python",
    "node",
    "sql",
    "api",
    "spring",
    "spring boot",
    "git",
  ],

  "java-developer": [
    "java",
    "spring",
    "spring boot",
    "hibernate",
    "sql",
    "mysql",
    "git",
  ],

  "python-developer": [
    "python",
    "django",
    "flask",
    "fastapi",
    "sql",
    "git",
    "api",
  ],

  "data-analyst": [
    "sql",
    "excel",
    "python",
    "pandas",
    "power bi",
    "tableau",
    "statistics",
  ],

  "data-scientist": [
    "python",
    "pandas",
    "numpy",
    "scikit-learn",
    "machine learning",
    "statistics",
    "sql",
  ],

  "ai-engineer": [
    "python",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "nlp",
    "generative ai",
  ],

  "machine-learning-engineer": [
    "python",
    "machine learning",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "sql",
    "deep learning",
  ],

  "devops-engineer": [
    "linux",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "jenkins",
    "git",
  ],

  "cloud-engineer": [
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "linux",
    "terraform",
  ],

  "cybersecurity-engineer": [
    "network security",
    "linux",
    "cybersecurity",
    "python",
    "siem",
    "cloud security",
  ],

  "cyber-security": [
    "network security",
    "linux",
    "cybersecurity",
    "penetration testing",
    "python",
    "siem",
  ],

  "ethical-hacker": [
    "linux",
    "networking",
    "kali linux",
    "ethical hacking",
    "python",
    "web security",
  ],

  "soc-analyst": [
    "networking",
    "linux",
    "siem",
    "cyber security",
    "incident response",
    "threat analysis",
  ],

  "ui-ux-designer": [
    "figma",
    "ui",
    "ux",
    "wireframing",
    "prototyping",
    "user research",
  ],

  "business-analyst": [
    "sql",
    "excel",
    "power bi",
    "tableau",
    "business analysis",
    "requirements",
  ],

  "power-bi-developer": [
    "power bi",
    "dax",
    "power query",
    "sql",
    "excel",
    "data visualization",
  ],

  "sql-developer": [
    "sql",
    "mysql",
    "postgresql",
    "database",
    "stored procedures",
    "queries",
  ],
};

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

function normalizeText(value) {
  if (!value) return "";

  return String(value)
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function convertCareerToId(careerId, careerName) {
  if (careerId) {
    const normalizedId = normalizeText(careerId);

    if (Object.prototype.hasOwnProperty.call(careerQueries, careerId)) {
      return careerId;
    }

    if (careerIdMap[normalizedId]) {
      return careerIdMap[normalizedId];
    }

    return careerId
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  if (careerName) {
    const normalizedName = normalizeText(careerName);

    if (careerIdMap[normalizedName]) {
      return careerIdMap[normalizedName];
    }

    return normalizedName
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  return "software-engineer";
}

function getJobText(job) {
  return normalizeText(
    [
      job?.title,
      job?.description,
      job?.category?.label,
      job?.company?.display_name,
      ...(Array.isArray(job?.tags) ? job.tags : []),
    ].join(" ")
  );
}

/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

function CareerJobs({
  careerId,
  careerName,
  student,
}) {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * ==========================================================
   * NORMALIZED CAREER
   * ==========================================================
   */

  const normalizedCareerId = useMemo(() => {
    return convertCareerToId(careerId, careerName);
  }, [careerId, careerName]);

  /*
   * ==========================================================
   * SEARCH QUERY
   * ==========================================================
   */

  const searchQuery = useMemo(() => {
    return (
      careerQueries[normalizedCareerId] ||
      careerName ||
      normalizedCareerId ||
      "software engineer"
    );
  }, [normalizedCareerId, careerName]);

  /*
   * ==========================================================
   * LOCATION
   *
   * React Compiler requires the complete `student` object
   * dependency here instead of `student?.state`.
   * ==========================================================
   */

  const searchLocation = useMemo(() => {
    const state =
      typeof student?.state === "string"
        ? student.state.trim()
        : "";

    return state || "India";
  }, [student]);

  /*
   * ==========================================================
   * STUDENT SKILLS
   * ==========================================================
   */

  const studentSkills = useMemo(() => {
    const skills = [];

    if (Array.isArray(student?.skills)) {
      skills.push(...student.skills);
    }

    if (Array.isArray(student?.skillSet)) {
      skills.push(...student.skillSet);
    }

    if (Array.isArray(student?.technicalSkills)) {
      skills.push(...student.technicalSkills);
    }

    if (typeof student?.skills === "string") {
      skills.push(...student.skills.split(","));
    }

    return skills
      .map((skill) => normalizeText(skill))
      .filter(Boolean);
  }, [student]);

  /*
   * ==========================================================
   * REQUIRED CAREER SKILLS
   * ==========================================================
   */

  const requiredSkills = useMemo(() => {
    return (
      careerSkills[normalizedCareerId] || [
        "javascript",
        "html",
        "css",
        "sql",
        "git",
      ]
    );
  }, [normalizedCareerId]);

  /*
   * ==========================================================
   * MATCH SCORE
   * ==========================================================
   */

  function calculateJobMatch(job) {
    const jobText = getJobText(job);

    /*
     * Career relevance - 40%
     */

    const careerWords = normalizeText(searchQuery)
      .split(" ")
      .filter((word) => word.length > 2);

    const matchedCareerWords = careerWords.filter((word) =>
      jobText.includes(word)
    );

    const careerScore =
      careerWords.length > 0
        ? Math.min(
            100,
            Math.round(
              (matchedCareerWords.length /
                careerWords.length) *
                100
            )
          )
        : 50;

    /*
     * Skill relevance - 40%
     */

    const skillsToCheck =
      studentSkills.length > 0
        ? studentSkills
        : requiredSkills;

    const matchedSkills = skillsToCheck.filter((skill) =>
      jobText.includes(normalizeText(skill))
    );

    const skillScore =
      skillsToCheck.length > 0
        ? Math.min(
            100,
            Math.round(
              (matchedSkills.length /
                skillsToCheck.length) *
                100
            )
          )
        : 50;

    /*
     * Location relevance - 20%
     */

    const locationText = normalizeText(
      job?.location?.display_name ||
        job?.location?.area?.join(" ") ||
        ""
    );

    const requestedLocation = normalizeText(searchLocation);

    const locationScore =
      requestedLocation &&
      requestedLocation !== "india"
        ? locationText.includes(requestedLocation)
          ? 100
          : 50
        : locationText.includes("india") ||
            locationText === ""
          ? 100
          : 70;

    /*
     * Final score
     */

    const finalScore = Math.round(
      careerScore * 0.4 +
        skillScore * 0.4 +
        locationScore * 0.2
    );

    return Math.min(99, Math.max(45, finalScore));
  }

  /*
   * ==========================================================
   * MATCHED SKILLS
   * ==========================================================
   */

  function getMatchedSkills(job) {
    const jobText = getJobText(job);

    return requiredSkills.filter((skill) =>
      jobText.includes(normalizeText(skill))
    );
  }

  /*
   * ==========================================================
   * MATCH MESSAGE
   * ==========================================================
   */

  function getMatchMessage(score) {
    if (score >= 90) {
      return "Excellent match for your profile";
    }

    if (score >= 80) {
      return "Strong match for your profile";
    }

    if (score >= 70) {
      return "Good match with some skill gaps";
    }

    if (score >= 60) {
      return "Moderate match — review skill gaps";
    }

    return "Potential match — upskill recommended";
  }

  /*
   * ==========================================================
   * MATCH BREAKDOWN
   * ==========================================================
   */

  function getMatchBreakdown(job) {
    const jobText = getJobText(job);

    /*
     * Career score
     */

    const careerWords = normalizeText(searchQuery)
      .split(" ")
      .filter((word) => word.length > 2);

    const matchedCareerWords = careerWords.filter((word) =>
      jobText.includes(word)
    );

    const careerScore =
      careerWords.length > 0
        ? Math.min(
            100,
            Math.round(
              (matchedCareerWords.length /
                careerWords.length) *
                100
            )
          )
        : 50;

    /*
     * Skills score
     */

    const skillsToCheck =
      studentSkills.length > 0
        ? studentSkills
        : requiredSkills;

    const matchedSkills = skillsToCheck.filter((skill) =>
      jobText.includes(normalizeText(skill))
    );

    const skillScore =
      skillsToCheck.length > 0
        ? Math.min(
            100,
            Math.round(
              (matchedSkills.length /
                skillsToCheck.length) *
                100
            )
          )
        : 50;

    /*
     * Location score
     */

    const locationText = normalizeText(
      job?.location?.display_name ||
        job?.location?.area?.join(" ") ||
        ""
    );

    const requestedLocation = normalizeText(searchLocation);

    const locationScore =
      requestedLocation &&
      requestedLocation !== "india"
        ? locationText.includes(requestedLocation)
          ? 100
          : 50
        : locationText.includes("india") ||
            locationText === ""
          ? 100
          : 70;

    /*
     * Missing skills
     */

    const missingSkills = skillsToCheck.filter(
      (skill) => !jobText.includes(normalizeText(skill))
    );

    return {
      careerScore,
      skillScore,
      locationScore,
      matchedSkills,
      missingSkills,
    };
  }

  /*
   * ==========================================================
   * LOAD JOBS
   * ==========================================================
   */

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const data = await getJobs({
        career: searchQuery,
        location: searchLocation,
      });

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to fetch jobs"
        );
      }

      const fetchedJobs = Array.isArray(data?.jobs)
        ? data.jobs
        : [];

      const jobsWithMatch = fetchedJobs.map((job) => {
        const matchScore = calculateJobMatch(job);
        const matchedSkills = getMatchedSkills(job);
        const matchBreakdown = getMatchBreakdown(job);

        return {
          ...job,
          careerOSMatch: matchScore,
          matchedSkills,
          matchBreakdown,
          matchMessage: getMatchMessage(matchScore),
        };
      });

      jobsWithMatch.sort((a, b) => {
        if (b.careerOSMatch !== a.careerOSMatch) {
          return b.careerOSMatch - a.careerOSMatch;
        }

        return (
          new Date(b.created || 0).getTime() -
          new Date(a.created || 0).getTime()
        );
      });

      setJobs(jobsWithMatch);
    } catch (err) {
      console.error("CareerOS Jobs Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load jobs"
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  /*
   * ==========================================================
   * LOAD JOBS WHEN CAREER / LOCATION CHANGES
   *
   * The React Compiler's set-state-in-effect rule is overly
   * restrictive for this async data-fetching effect.
   *
   * We intentionally suppress only this specific rule here.
   * The rest of ESLint remains active.
   * ==========================================================
   */

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedCareerId, searchLocation]);

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <section className="mt-16">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BriefcaseBusiness
                size={26}
                className="text-blue-600"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                Latest Job Openings
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-gray-500">
                  {careerName || searchQuery}
                </span>

                <span className="text-gray-300">•</span>

                <span className="text-gray-500 flex items-center gap-1">
                  <MapPin size={15} />
                  {searchLocation}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-500 mt-4">
            Live opportunities ranked by your CareerOS AI
            match score.
          </p>
        </div>

        <button
          type="button"
          onClick={loadJobs}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl transition font-semibold"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Loading..." : "Refresh Jobs"}
        </button>
      </div>

      {/* AI INFO */}

      {!loading && !error && jobs.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Sparkles
                size={25}
                className="text-indigo-600"
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-800">
                CareerOS AI Job Matching
              </h3>

              <p className="text-gray-600 text-sm mt-1">
                Jobs are ranked using your selected career,
                profile skills and preferred location.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">
          <RefreshCw
            size={36}
            className="animate-spin mx-auto text-blue-600"
          />

          <p className="mt-4 text-gray-500">
            Finding the latest opportunities for you...
          </p>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-red-700">
            Unable to load jobs
          </h3>

          <p className="text-red-600 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={loadJobs}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

      {/* NO JOBS */}

      {!loading && !error && jobs.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">
          <BriefcaseBusiness
            size={45}
            className="mx-auto text-gray-400"
          />

          <h3 className="text-xl font-bold mt-5 text-slate-800">
            No jobs found
          </h3>

          <p className="text-gray-500 mt-2">
            We couldn't find current openings for this
            career.
          </p>

          <button
            type="button"
            onClick={loadJobs}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold"
          >
            Search Again
          </button>
        </div>
      )}

      {/* JOB SUMMARY */}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* TOTAL JOBS */}

          <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Opportunities
                </p>

                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {jobs.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <BriefcaseBusiness
                  size={22}
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>

          {/* BEST MATCH */}

          <div className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Best CareerOS Match
                </p>

                <p className="text-3xl font-bold text-green-600 mt-1">
                  {Math.max(
                    ...jobs.map(
                      (job) =>
                        Number(job.careerOSMatch) || 0
                    )
                  )}
                  %
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                <Target
                  size={22}
                  className="text-green-600"
                />
              </div>
            </div>
          </div>

          {/* AVERAGE MATCH */}

          <div className="bg-white border border-indigo-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Average Match
                </p>

                <p className="text-3xl font-bold text-indigo-600 mt-1">
                  {Math.round(
                    jobs.reduce(
                      (total, job) =>
                        total +
                        (Number(job.careerOSMatch) || 0),
                      0
                    ) / jobs.length
                  )}
                  %
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Sparkles
                  size={22}
                  className="text-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* MATCHED SKILLS */}

          <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Skills Matched
                </p>

                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {
                    new Set(
                      jobs.flatMap((job) =>
                        Array.isArray(job.matchedSkills)
                          ? job.matchedSkills
                          : []
                      )
                    ).size
                  }
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2
                  size={22}
                  className="text-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOB LIST */}

      {!loading && !error && jobs.length > 0 && (
        <div className="space-y-6">
          {jobs.map((job, index) => {
            const company =
              job?.company?.display_name ||
              "Company not specified";

            const location =
              job?.location?.display_name ||
              job?.location?.area?.join(", ") ||
              "India";

            const salary =
              job?.salary_min && job?.salary_max
                ? `₹${Math.round(
                    job.salary_min
                  ).toLocaleString(
                    "en-IN"
                  )} - ₹${Math.round(
                    job.salary_max
                  ).toLocaleString("en-IN")}`
                : job?.salary_min
                  ? `From ₹${Math.round(
                      job.salary_min
                    ).toLocaleString("en-IN")}`
                  : "Salary not specified";

            const matchScore =
              job?.careerOSMatch || 0;

            const matchedSkills =
              job?.matchedSkills || [];

            return (
              <article
                key={
                  job?.id ||
                  `${job?.title}-${company}-${index}`
                }
                className="bg-white shadow-sm hover:shadow-xl rounded-2xl p-6 border border-gray-100 transition"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                  <div className="flex-1">
                    {/* TITLE */}

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {job?.title ||
                            "Job Opportunity"}
                        </h3>

                        <p className="text-gray-600 mt-2 flex items-center gap-2">
                          <BriefcaseBusiness
                            size={17}
                            className="text-blue-600"
                          />

                          {company}
                        </p>
                      </div>

                      {/* MATCH */}

                      <div className="flex-shrink-0">
                        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Target
                              size={18}
                              className="text-green-600"
                            />

                            <span className="text-xs font-semibold text-green-700 uppercase">
                              AI Match
                            </span>
                          </div>

                          <p className="text-2xl font-bold text-green-700 mt-1">
                            {matchScore}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DETAILS */}

                    <div className="mt-5 space-y-2">
                      <p className="text-gray-600 flex items-center gap-2">
                        <MapPin
                          size={17}
                          className="text-red-500"
                        />

                        {location}
                      </p>

                      <p className="text-gray-600 flex items-center gap-2">
                        <IndianRupee
                          size={17}
                          className="text-green-600"
                        />

                        {salary}
                      </p>

                      {job?.contract_type && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <Clock3
                            size={17}
                            className="text-orange-500"
                          />

                          {job.contract_type}
                        </p>
                      )}
                    </div>

                    {/* TAGS */}

                    <div className="flex flex-wrap gap-2 mt-5">
                      {job?.category?.label && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {job.category.label}
                        </span>
                      )}

                      {job?.contract_time && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {job.contract_time}
                        </span>
                      )}
                    </div>

                    {/* MATCH MESSAGE */}

                    <div className="mt-5 bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2">
                        <Sparkles
                          size={17}
                          className="text-indigo-600"
                        />

                        <span className="font-semibold text-slate-700">
                          {job?.matchMessage}
                        </span>
                      </div>
                    </div>

                    {/* MATCH BREAKDOWN */}

                    <div className="mt-5 bg-white border border-gray-100 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-slate-800">
                            Why this job matches you
                          </h4>

                          <p className="text-xs text-gray-500 mt-1">
                            CareerOS match analysis
                          </p>
                        </div>

                        <Sparkles
                          size={20}
                          className="text-indigo-600"
                        />
                      </div>

                      {/* CAREER */}

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            Career relevance
                          </span>

                          <span className="font-semibold text-blue-600">
                            {job?.matchBreakdown
                              ?.careerScore || 0}
                            %
                          </span>
                        </div>

                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${
                                job?.matchBreakdown
                                  ?.careerScore || 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* SKILLS */}

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            Skills match
                          </span>

                          <span className="font-semibold text-emerald-600">
                            {job?.matchBreakdown
                              ?.skillScore || 0}
                            %
                          </span>
                        </div>

                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${
                                job?.matchBreakdown
                                  ?.skillScore || 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* LOCATION */}

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            Location match
                          </span>

                          <span className="font-semibold text-indigo-600">
                            {job?.matchBreakdown
                              ?.locationScore || 0}
                            %
                          </span>
                        </div>

                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{
                              width: `${
                                job?.matchBreakdown
                                  ?.locationScore || 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* MISSING SKILLS */}

                      {job?.matchBreakdown?.missingSkills
                        ?.length > 0 && (
                        <div className="mt-5 pt-4 border-t">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Skills you may need
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {job.matchBreakdown.missingSkills
                              .slice(0, 6)
                              .map((skill) => (
                                <span
                                  key={skill}
                                  className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full text-xs font-medium"
                                >
                                  ⚠️ {skill}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MATCHED SKILLS */}

                    {matchedSkills.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Skills detected in this
                          opportunity
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {matchedSkills
                            .slice(0, 8)
                            .map((skill) => (
                              <span
                                key={skill}
                                className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-sm"
                              >
                                <CheckCircle2
                                  size={14}
                                />

                                {skill}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div className="flex lg:flex-col items-start lg:items-end justify-between lg:justify-start gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/companies/jobs/${job.id}`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition whitespace-nowrap"
                    >
                      View Details

                      <BriefcaseBusiness size={17} />
                    </button>

                    {job?.redirect_url ? (
                      <a
                        href={job.redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition whitespace-nowrap"
                      >
                        Apply Now

                        <ExternalLink size={17} />
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="bg-gray-400 text-white px-6 py-3 rounded-xl cursor-not-allowed"
                      >
                        Apply Unavailable
                      </button>
                    )}
                  </div>
                </div>

                {/* POSTED */}

                {job?.created && (
                  <div className="text-sm text-gray-400 mt-6 border-t pt-4 flex flex-wrap items-center justify-between gap-2">
                    <span>
                      Posted:{" "}
                      {new Date(
                        job.created
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    <span>
                      CareerOS Job Match:{" "}
                      <strong className="text-green-600">
                        {matchScore}%
                      </strong>
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CareerJobs;