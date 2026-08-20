import hiringCompanies from "../../data/hiringCompanies";

/*
 * Convert CareerOS career names into
 * the standard career ID used by hiringCompanies.js
 */
const careerIdMap = {
  "Frontend Developer": "frontend-developer",
  "React Developer": "react-developer",
  "Software Engineer": "software-engineer",
  "Full Stack Developer": "full-stack-developer",
  "Backend Developer": "backend-developer",
  "Java Developer": "java-developer",
  "Python Developer": "python-developer",
  "Web Developer": "web-developer",
  "Mobile Developer": "mobile-developer",
  "AI Engineer": "ai-engineer",
  "Data Scientist": "data-scientist",
  "Data Analyst": "data-analyst",
  "Machine Learning Engineer":
    "machine-learning-engineer",
  "DevOps Engineer": "devops-engineer",
  "Cloud Engineer": "cloud-engineer",
  "Cyber Security":
    "cyber-security",
  "Cyber Security Engineer":
    "cybersecurity-engineer",
  "Cybersecurity Engineer":
    "cybersecurity-engineer",
  "Ethical Hacker":
    "ethical-hacker",
  "SOC Analyst":
    "soc-analyst",
  "UI UX Designer":
    "ui-ux-designer",
  "Product Designer":
    "product-designer",
  "Business Analyst":
    "business-analyst",
  "Power BI Developer":
    "power-bi-developer",
  "SQL Developer":
    "sql-developer",
  "Embedded Engineer":
    "embedded-engineer",
  "VLSI Engineer":
    "vlsi-engineer",
  "IoT Engineer":
    "iot-engineer",
  "Electronics Engineer":
    "electronics-engineer",
  "Electrical Engineer":
    "electrical-engineer",
  "Mechanical Engineer":
    "mechanical-engineer",
  "Civil Engineer":
    "civil-engineer",
  "Automobile Engineer":
    "automobile-engineer",
  "Production Engineer":
    "production-engineer",
  "Research Engineer":
    "research-engineer",
  "Research Analyst":
    "research-analyst",
  Accountant: "accountant",
  "Financial Analyst":
    "financial-analyst",
  "Bank Officer":
    "bank-officer",
  "Chartered Accountant":
    "chartered-accountant",
  Teacher: "teacher",
  Lawyer: "lawyer",
  Journalist: "journalist",
  Doctor: "doctor",
  Dentist: "dentist",
  Pharmacist: "pharmacist",
  "Government Officer":
    "government-officer",
  "Content Writer":
    "content-writer",
};

function normalizeCareerId(
  careerId,
  careerName
) {
  /*
   * If already a valid ID
   */
  if (
    careerId &&
    hiringCompanies[careerId]
  ) {
    return careerId;
  }

  /*
   * Career name mapping
   */
  if (
    careerName &&
    careerIdMap[careerName]
  ) {
    return careerIdMap[careerName];
  }

  /*
   * Try converting text to slug
   */
  const value =
    careerName || careerId || "";

  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function CareerHiringCompanies({
  careerId,
  careerName,
}) {
  const normalizedCareerId =
    normalizeCareerId(
      careerId,
      careerName
    );

  const companies =
    hiringCompanies[
      normalizedCareerId
    ];

  if (
    !companies ||
    companies.length === 0
  ) {
    return null;
  }

  return (
    <section className="mt-14">

      {/* HEADER */}

      <div className="mb-6">

        <div className="flex items-center gap-3">

          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">
              🔥
            </span>
          </div>

          <div>

            <h2 className="text-3xl font-bold text-slate-800">
              Companies Hiring for this Role
            </h2>

            <p className="text-gray-500 mt-1">
              Companies that commonly hire
              professionals for{" "}
              <span className="font-semibold text-blue-600">
                {careerName ||
                  normalizedCareerId}
              </span>
            </p>

          </div>

        </div>

      </div>

      {/* COMPANY CARDS */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {companies.map(
          (company) => (

            <div
              key={company}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6 border border-gray-100"
            >

              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-3xl mb-4">
                🏢
              </div>

              <h3 className="font-bold text-xl text-slate-800">
                {company}
              </h3>

              <p className="text-gray-500 mt-2">
                Frequently hires
                professionals for this role.
              </p>

              <button
                type="button"
                onClick={() => {
                  const searchUrl =
                    `https://www.google.com/search?q=${encodeURIComponent(
                      `${company} ${careerName || normalizedCareerId} jobs India`
                    )}`;

                  window.open(
                    searchUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                View Jobs
              </button>

            </div>

          )
        )}

      </div>

    </section>
  );
}

export default CareerHiringCompanies;