import { useState, useContext } from "react";
import { CareerContext } from "../../context/CareerContext";

import {
  GraduationCap,
  Target,
  Code2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Heart,
} from "lucide-react";

/* =========================================================
   CAREER ID ALIASES
   ---------------------------------------------------------
   Display names used by the form are intentionally kept
   separate from database / career-engine IDs.
========================================================= */

const CAREER_ID_ALIASES = {
  /* =====================================================
     TECHNOLOGY
  ===================================================== */

  "Software Engineer": "software-engineer",
  "Frontend Developer": "frontend-developer",
  "Backend Developer": "backend-developer",
  "Full Stack Developer": "full-stack-developer",
  "Cloud Engineer": "cloud-engineer",
  "DevOps Engineer": "devops-engineer",
  "QA Engineer": "qa-engineer",
  "Mobile App Developer": "mobile-app-developer",

  /* =====================================================
     DATA / AI
  ===================================================== */

  "AI Engineer": "ai-engineer",
  "Machine Learning Engineer": "machine-learning-engineer",
  "Data Scientist": "data-scientist",
  "Data Analyst": "data-analyst",
  "Business Analyst": "business-analyst",
  "Research Analyst": "research-analyst",
  "Research Engineer": "research-engineer",

  /* =====================================================
     CYBER SECURITY
  ===================================================== */

  "Cyber Security Engineer": "cyber-security-engineer",
  "Ethical Hacker": "ethical-hacker",
  "SOC Analyst": "soc-analyst",
  "Security Consultant": "security-consultant",
  "Cyber Security Analyst": "cyber-security-analyst",

  /* =====================================================
     ENGINEERING
  ===================================================== */

  "Embedded Engineer": "embedded-engineer",
  "VLSI Engineer": "vlsi-engineer",
  "IoT Engineer": "iot-engineer",
  "Electronics Engineer": "electronics-engineer",
  "Hardware Engineer": "hardware-engineer",

  "Electrical Engineer": "electrical-engineer",
  "Power Systems Engineer": "power-systems-engineer",
  "Electrical Design Engineer": "electrical-design-engineer",
  "Electrical Maintenance Engineer":
    "electrical-maintenance-engineer",

  "Mechanical Engineer": "mechanical-engineer",
  "Automobile Engineer": "automobile-engineer",
  "Production Engineer": "production-engineer",
  "Design Engineer": "design-engineer",
  "Maintenance Engineer": "maintenance-engineer",

  "Civil Engineer": "civil-engineer",
  "Structural Engineer": "structural-engineer",
  "Construction Engineer": "construction-engineer",
  "Site Engineer": "site-engineer",

  /* =====================================================
     COMMERCE / BUSINESS
  ===================================================== */

  Accountant: "accountant",
  "Financial Analyst": "financial-analyst",
  "Bank Officer": "bank-officer",
  "Chartered Accountant": "chartered-accountant",
  "Marketing Manager": "marketing-manager",
  "HR Manager": "hr-manager",
  "Business Executive": "business-executive",
  Entrepreneur: "entrepreneur",

  /* =====================================================
     ARTS / SOCIAL
  ===================================================== */

  "Government Officer": "government-officer",
  Lawyer: "lawyer",
  Journalist: "journalist",
  Teacher: "teacher",
  "Content Writer": "content-writer",

  /* =====================================================
     MEDICAL
  ===================================================== */

  Doctor: "doctor",
  "Medical Researcher": "medical-researcher",
  "Medical Officer": "medical-officer",
  "Healthcare Administrator": "healthcare-administrator",

  Dentist: "dentist",
  "Dental Surgeon": "dental-surgeon",
  "Dental Researcher": "dental-researcher",

  "Ayurvedic Doctor": "ayurvedic-doctor",
  "Homeopathic Doctor": "homeopathic-doctor",

  Pharmacist: "pharmacist",
  "Clinical Researcher": "clinical-researcher",
  "Drug Safety Associate": "drug-safety-associate",
  "Pharmaceutical Analyst": "pharmaceutical-analyst",

  /* =====================================================
     ITI / TECHNICAL
  ===================================================== */

  "Electrical Technician": "electrical-technician",
  "Maintenance Technician": "maintenance-technician",
  "Electrical Assistant": "electrical-assistant",

  "Fitter Technician": "fitter-technician",
  "Production Technician": "production-technician",

  "Computer Operator": "computer-operator",
  "IT Support Specialist": "it-support-specialist",
  "Web Developer": "web-developer",

  "Electronics Technician": "electronics-technician",
  "IoT Technician": "iot-technician",

  "Automobile Technician": "automobile-technician",
  "Mechanical Technician": "mechanical-technician",
  "Service Engineer": "service-engineer",

  /* =====================================================
     GOVERNMENT
  ===================================================== */

  "SSC CGL Officer": "ssc-cgl",
  "SSC CHSL Officer": "ssc-chsl",
  "Probationary Officer": "bank-po",
  "Bank Clerk": "bank-clerk",

  "Railway Officer": "rrb-je",
  "Railway Technician": "railway-technician",
  "Railway Engineer": "railway-engineer",

  "IAS Officer": "upsc",
  "IPS Officer": "upsc",

  "State Government Officer": "state-government",
  "Public Service Officer": "state-government",

  /* =====================================================
     GENERIC / PATH OPTIONS
  ===================================================== */

  "Skill-based Employment": "skill-based-employment",
  Technician: "technician",
  Apprentice: "apprentice",
  "Technical Specialist": "technical-specialist",
};

/* =========================================================
   DATABASE COURSE / CAREER IDS
   ---------------------------------------------------------
   These are the established education-path IDs.
========================================================= */

const EDUCATION_CAREER_IDS = {
  /* Polytechnic */
  CSE: "diploma-cse",
  ECE: "diploma-ece",
  EEE: "diploma-eee",
  Mechanical: "diploma-mechanical",
  Civil: "diploma-civil",

  /* ITI */
  Electrician: "iti-electrician",
  Fitter: "iti-fitter",
  "Computer Operator": "iti-copa",
  Electronics: "iti-copa",
  Mechanic: "iti-fitter",

  /* Medical */
  MBBS: "mbbs",
  BDS: "bds",
  "B.Pharmacy": "bpharm",
};

/* =========================================================
   INTEREST MAP
   ---------------------------------------------------------
   IMPORTANT:
   These values are the stable keys consumed by the
   career-engine interest matching logic.
========================================================= */

const interestMap = {
  Technology: "technology",
  "Data & Analytics": "data",
  "Artificial Intelligence": "artificial-intelligence",
  Business: "business",
  Finance: "finance",
  Healthcare: "healthcare",
  "Design & Creativity": "design",
  "Government & Public Service": "government",
  Engineering: "engineering",
  Research: "research",
};

/* =========================================================
   NORMALIZE CAREER ID
========================================================= */

const getCareerId = (career) => {
  if (!career) return "";

  return (
    CAREER_ID_ALIASES[career] ||
    career
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
};

/* =========================================================
   EDUCATION + SPECIALIZATION KEY
========================================================= */

const getEducationSpecializationKey = (
  education,
  specialization
) => {
  if (!education || !specialization) {
    return "";
  }

  return `${education}:${specialization}`;
};

/* =========================================================
   COMPONENT
========================================================= */

function StudentForm() {
  const { setStudent } = useContext(CareerContext);

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    education: "",
    specialization: "",
    dreamCareer: "",
    interest: "",
    state: "",
    skills: [],
  });

  /* ======================================================
     SPECIALIZATION / BRANCH OPTIONS
  ====================================================== */

  const specializationOptions = {
    after10th: ["General"],

    intermediate: [
      "MPC",
      "BiPC",
      "MEC",
      "CEC",
      "HEC",
      "Vocational",
    ],

    polytechnic: [
      "CSE",
      "ECE",
      "EEE",
      "Mechanical",
      "Civil",
      "AI & ML",
    ],

    iti: [
      "Electrician",
      "Fitter",
      "Computer Operator",
      "Electronics",
      "Mechanic",
    ],

    btech: [
      "CSE",
      "AI & ML",
      "Data Science",
      "Cyber Security",
      "ECE",
      "EEE",
      "Mechanical",
      "Civil",
      "IT",
    ],

    degree: [
      "B.Sc",
      "B.Com",
      "BBA",
      "BA",
      "BCA",
    ],

    medical: [
      "MBBS",
      "BDS",
      "BAMS",
      "BHMS",
      "B.Pharmacy",
    ],

    government: [
      "SSC",
      "Banking",
      "Railway",
      "UPSC",
      "State Government",
    ],
  };

  /* ======================================================
     CAREER / JOB ROLE OPTIONS
     ------------------------------------------------------
     These remain display labels.
     Stable IDs are generated separately.
  ====================================================== */

  const careerPathOptions = {
    after10th: [
      "Intermediate - MPC",
      "Intermediate - BiPC",
      "Intermediate - MEC",
      "Intermediate - CEC",
      "Intermediate - HEC",
      "Polytechnic",
      "ITI",
      "Government Jobs",
    ],

    MPC: [
      "Software Engineer",
      "Data Analyst",
      "Data Scientist",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
    ],

    BiPC: [
      "Doctor",
      "Dentist",
      "Pharmacist",
      "Medical Researcher",
      "Healthcare Administrator",
    ],

    MEC: [
      "Accountant",
      "Financial Analyst",
      "Business Analyst",
      "Bank Officer",
      "Chartered Accountant",
    ],

    CEC: [
      "Government Officer",
      "Lawyer",
      "Journalist",
      "Teacher",
      "Content Writer",
    ],

    HEC: [
      "Government Officer",
      "Teacher",
      "Journalist",
      "Lawyer",
      "Content Writer",
    ],

    Vocational: [
      "Skill-based Employment",
      "Technician",
      "Apprentice",
      "Technical Specialist",
      "Entrepreneur",
    ],

    CSE: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Cloud Engineer",
      "DevOps Engineer",
      "QA Engineer",
      "Mobile App Developer",
    ],

    "AI & ML": [
      "AI Engineer",
      "Machine Learning Engineer",
      "Data Scientist",
      "Data Analyst",
      "Research Engineer",
    ],

    "Data Science": [
      "Data Scientist",
      "Data Analyst",
      "Business Analyst",
      "Machine Learning Engineer",
      "AI Engineer",
      "Research Analyst",
    ],

    "Cyber Security": [
      "Cyber Security Engineer",
      "Ethical Hacker",
      "SOC Analyst",
      "Security Consultant",
      "Cyber Security Analyst",
    ],

    ECE: [
      "Embedded Engineer",
      "VLSI Engineer",
      "IoT Engineer",
      "Electronics Engineer",
      "Hardware Engineer",
    ],

    EEE: [
      "Electrical Engineer",
      "Power Systems Engineer",
      "Electrical Design Engineer",
      "Electrical Maintenance Engineer",
    ],

    Mechanical: [
      "Mechanical Engineer",
      "Automobile Engineer",
      "Production Engineer",
      "Design Engineer",
      "Maintenance Engineer",
    ],

    Civil: [
      "Civil Engineer",
      "Structural Engineer",
      "Construction Engineer",
      "Site Engineer",
      "Design Engineer",
    ],

    IT: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Cloud Engineer",
      "DevOps Engineer",
      "QA Engineer",
    ],

    "B.Sc": [
      "Data Scientist",
      "Data Analyst",
      "Software Engineer",
      "Research Analyst",
      "Teacher",
    ],

    "B.Com": [
      "Accountant",
      "Financial Analyst",
      "Business Analyst",
      "Bank Officer",
      "Chartered Accountant",
    ],

    BBA: [
      "Business Analyst",
      "Marketing Manager",
      "HR Manager",
      "Business Executive",
      "Entrepreneur",
    ],

    BA: [
      "Government Officer",
      "Lawyer",
      "Journalist",
      "Teacher",
      "Content Writer",
    ],

    BCA: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Data Analyst",
    ],

    MBBS: [
      "Doctor",
      "Medical Researcher",
      "Medical Officer",
      "Healthcare Administrator",
    ],

    BDS: [
      "Dentist",
      "Dental Surgeon",
      "Dental Researcher",
    ],

    BAMS: [
      "Ayurvedic Doctor",
      "Medical Researcher",
      "Healthcare Consultant",
    ],

    BHMS: [
      "Homeopathic Doctor",
      "Healthcare Consultant",
      "Medical Researcher",
    ],

    "B.Pharmacy": [
      "Pharmacist",
      "Clinical Researcher",
      "Drug Safety Associate",
      "Pharmaceutical Analyst",
    ],

    Electrician: [
      "Electrical Technician",
      "Maintenance Technician",
      "Electrical Assistant",
    ],

    Fitter: [
      "Fitter Technician",
      "Production Technician",
      "Maintenance Technician",
    ],

    "Computer Operator": [
      "Computer Operator",
      "IT Support Specialist",
      "Web Developer",
    ],

    Electronics: [
      "Electronics Technician",
      "Embedded Engineer",
      "IoT Technician",
    ],

    Mechanic: [
      "Automobile Technician",
      "Mechanical Technician",
      "Service Engineer",
    ],

    SSC: [
      "Government Officer",
      "SSC CGL Officer",
      "SSC CHSL Officer",
    ],

    Banking: [
      "Bank Officer",
      "Probationary Officer",
      "Bank Clerk",
    ],

    Railway: [
      "Railway Officer",
      "Railway Technician",
      "Railway Engineer",
    ],

    UPSC: [
      "IAS Officer",
      "IPS Officer",
      "Government Officer",
    ],

    "State Government": [
      "State Government Officer",
      "Government Officer",
      "Public Service Officer",
    ],
  };

  /* ======================================================
     OPTIONAL INTEREST OPTIONS
  ====================================================== */

  const interestOptions = [
    "Technology",
    "Data & Analytics",
    "Artificial Intelligence",
    "Business",
    "Finance",
    "Healthcare",
    "Design & Creativity",
    "Government & Public Service",
    "Engineering",
    "Research",
  ];

  /* ======================================================
     CAREER SKILLS
  ====================================================== */

  const careerSkillOptions = {
    "Frontend Developer": [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Tailwind CSS",
      "Bootstrap",
      "Redux",
      "TypeScript",
      "Next.js",
      "Git",
    ],

    "Backend Developer": [
      "Java",
      "Spring Boot",
      "Hibernate",
      "Node.js",
      "Express.js",
      "SQL",
      "MongoDB",
      "REST API",
      "Docker",
      "Git",
    ],

    "Full Stack Developer": [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "SQL",
      "MongoDB",
      "Git",
    ],

    "Software Engineer": [
      "Java",
      "Python",
      "DSA",
      "SQL",
      "Git",
      "OOP",
      "Problem Solving",
    ],

    "AI Engineer": [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "Pandas",
      "NumPy",
      "Statistics",
    ],

    "Machine Learning Engineer": [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "Statistics",
      "Git",
    ],

    "Data Scientist": [
      "Python",
      "SQL",
      "Pandas",
      "NumPy",
      "Statistics",
      "Machine Learning",
      "Power BI",
      "Tableau",
    ],

    "Data Analyst": [
      "Excel",
      "SQL",
      "Python",
      "Pandas",
      "Power BI",
      "Tableau",
      "Statistics",
    ],

    "Business Analyst": [
      "Excel",
      "SQL",
      "Power BI",
      "Data Analysis",
      "Communication",
      "Problem Solving",
    ],

    "Cyber Security Engineer": [
      "Linux",
      "Networking",
      "Ethical Hacking",
      "Python",
      "Cryptography",
      "Kali Linux",
    ],

    "Ethical Hacker": [
      "Linux",
      "Networking",
      "Kali Linux",
      "Ethical Hacking",
      "Python",
      "Web Security",
    ],

    "SOC Analyst": [
      "Networking",
      "Linux",
      "SIEM",
      "Cyber Security",
      "Incident Response",
      "Threat Analysis",
    ],

    "Cloud Engineer": [
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "Linux",
      "Terraform",
    ],

    "DevOps Engineer": [
      "Linux",
      "Git",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "AWS",
      "Terraform",
    ],

    Doctor: [
      "Biology",
      "Patient Care",
      "Diagnosis",
      "Communication",
    ],

    Dentist: [
      "Dental Anatomy",
      "Patient Care",
      "Diagnosis",
      "Communication",
    ],

    Pharmacist: [
      "Pharmacology",
      "Medicines",
      "Drug Safety",
      "Patient Care",
    ],

    "Government Officer": [
      "Reasoning",
      "Aptitude",
      "General Knowledge",
      "Current Affairs",
      "Communication",
    ],

    "Bank Officer": [
      "Quantitative Aptitude",
      "Reasoning",
      "English",
      "Banking Awareness",
      "Current Affairs",
    ],

    "Chartered Accountant": [
      "Accounting",
      "Taxation",
      "Auditing",
      "Financial Analysis",
      "Excel",
    ],

    Accountant: [
      "Accounting",
      "Excel",
      "Tally",
      "Taxation",
      "Financial Reporting",
    ],

    Lawyer: [
      "Legal Research",
      "Communication",
      "Logical Reasoning",
      "Legal Writing",
    ],

    Teacher: [
      "Communication",
      "Subject Knowledge",
      "Teaching",
      "Presentation",
    ],

    Journalist: [
      "Writing",
      "Communication",
      "Research",
      "Current Affairs",
    ],

    "Electrical Technician": [
      "Electrical Wiring",
      "Electrical Safety",
      "Circuit Testing",
      "Maintenance",
    ],

    "Maintenance Technician": [
      "Equipment Maintenance",
      "Troubleshooting",
      "Safety",
      "Technical Knowledge",
    ],

    "Mechanical Technician": [
      "Mechanical Systems",
      "Machine Maintenance",
      "Troubleshooting",
      "Safety",
    ],

    "Automobile Technician": [
      "Automobile Systems",
      "Vehicle Maintenance",
      "Diagnostics",
      "Mechanical Knowledge",
    ],
  };

  /* ======================================================
     HANDLE FORM CHANGE
  ====================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "education") {
      setFormData((prev) => ({
        ...prev,
        education: value,
        specialization: "",
        dreamCareer: "",
        interest: "",
        skills: [],
      }));

      return;
    }

    if (name === "specialization") {
      setFormData((prev) => ({
        ...prev,
        specialization: value,
        dreamCareer: "",
        skills: [],
      }));

      return;
    }

    if (name === "dreamCareer") {
      setFormData((prev) => ({
        ...prev,
        dreamCareer: value,
        skills: [],
      }));

      return;
    }

    if (name === "interest") {
      setFormData((prev) => ({
        ...prev,
        interest: value,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ======================================================
     SKILL CHANGE
  ====================================================== */

  const handleSkillChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      skills: checked
        ? [...prev.skills, value]
        : prev.skills.filter((skill) => skill !== value),
    }));
  };

  /* ======================================================
     STEP VALIDATION
  ====================================================== */

  const canGoToStep2 = Boolean(
    formData.name.trim() &&
      formData.age &&
      formData.education &&
      formData.specialization
  );

  const canGoToStep3 = Boolean(
    canGoToStep2 && formData.dreamCareer
  );

  /* ======================================================
     NEXT
  ====================================================== */

  const handleNext = () => {
    if (step === 1 && canGoToStep2) {
      setStep(2);
      return;
    }

    if (step === 2 && canGoToStep3) {
      setStep(3);
    }
  };

  /* ======================================================
     BACK
  ====================================================== */

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  /* ======================================================
     SUBMIT
     ------------------------------------------------------
     IMPORTANT:
     Student receives both:
       dreamCareer      = display label
       careerId         = stable engine/database ID
       interest         = display label
       interestKey      = stable interestMap key
  ====================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.age ||
      !formData.education ||
      !formData.specialization ||
      !formData.dreamCareer
    ) {
      return;
    }

    const careerId = getCareerId(formData.dreamCareer);

    const interestKey = formData.interest
      ? interestMap[formData.interest] || ""
      : "";

    const educationSpecializationKey =
      getEducationSpecializationKey(
        formData.education,
        formData.specialization
      );

    /*
     * Preserve the original form fields while adding
     * normalized fields required by the career engine.
     */
    setStudent({
      ...formData,

      /* Original display values */
      dreamCareer: formData.dreamCareer,
      interest: formData.interest || "",

      /* Stable career-engine/database values */
      careerId,
      dreamCareerId: careerId,
      selectedCareerId: careerId,

      /* Stable interest value */
      interestKey,

      /* Education + specialization identity */
      educationId: formData.education,
      specializationId: formData.specialization,
      educationSpecializationKey,

      /*
       * Keep an explicit mapping available to downstream
       * consumers without changing the existing form API.
       */
      specializationCareerId:
        EDUCATION_CAREER_IDS[formData.specialization] || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ======================================================
     STEPS
  ====================================================== */

  const steps = [
    {
      number: 1,
      title: "Education",
      icon: GraduationCap,
    },
    {
      number: 2,
      title: "Career Path",
      icon: Target,
    },
    {
      number: 3,
      title: "Skills",
      icon: Code2,
    },
  ];

  /* ======================================================
     CURRENT CAREER OPTIONS
     ------------------------------------------------------
     Education is now part of the selection logic.
  ====================================================== */

  const currentCareerOptions =
    formData.education === "after10th"
      ? careerPathOptions.after10th
      : careerPathOptions[formData.specialization] || [];

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <section className="bg-slate-100 py-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles size={16} />
            Personalized Career Planning
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 mt-5">
            Build Your Career Profile
          </h2>

          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Tell CareerOS about yourself and we'll use your
            education, career goals and skills to create your
            personalized career journey.
          </p>

        </div>

        {/* MAIN CARD */}

        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden">

          {/* PROGRESS HEADER */}

          <div className="border-b bg-slate-50 px-6 md:px-10 py-7">

            <div className="flex items-center justify-between max-w-3xl mx-auto">

              {steps.map((item, index) => {

                const Icon = item.icon;

                const completed = step > item.number;
                const active = step === item.number;

                return (
                  <div
                    key={item.number}
                    className="flex items-center flex-1"
                  >

                    <div className="flex flex-col items-center">

                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
                          completed
                            ? "bg-green-500 text-white"
                            : active
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >

                        {completed ? (
                          <CheckCircle2 size={21} />
                        ) : (
                          <Icon size={21} />
                        )}

                      </div>

                      <span
                        className={`text-xs md:text-sm font-semibold mt-2 ${
                          active
                            ? "text-blue-600"
                            : completed
                            ? "text-green-600"
                            : "text-slate-400"
                        }`}
                      >
                        {item.title}
                      </span>

                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 md:mx-4 rounded-full ${
                          step > item.number
                            ? "bg-green-500"
                            : "bg-slate-200"
                        }`}
                      />
                    )}

                  </div>
                );
              })}

            </div>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-10"
          >

            {/* ==================================================
                STEP 1
            ================================================== */}

            {step === 1 && (
              <div>

                <div className="mb-8">

                  <h3 className="text-2xl font-bold text-slate-800">
                    Let's start with the basics
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Tell us about yourself and your current education.
                  </p>

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  {/* NAME */}

                  <div>

                    <label className="block font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      placeholder="Enter your name"
                      className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* AGE */}

                  <div>

                    <label className="block font-semibold text-slate-700 mb-2">
                      Age
                    </label>

                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      placeholder="Your age"
                      min="10"
                      max="100"
                      className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* EDUCATION */}

                  <div>

                    <label className="block font-semibold text-slate-700 mb-2">
                      Completed Education
                    </label>

                    <select
                      name="education"
                      value={formData.education}
                      className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Select your education
                      </option>

                      <option value="after10th">
                        10th
                      </option>

                      <option value="intermediate">
                        Intermediate
                      </option>

                      <option value="polytechnic">
                        Polytechnic
                      </option>

                      <option value="iti">
                        ITI
                      </option>

                      <option value="degree">
                        Degree
                      </option>

                      <option value="btech">
                        B.Tech / Engineering
                      </option>

                      <option value="medical">
                        Medical
                      </option>

                      <option value="government">
                        Government Jobs
                      </option>

                    </select>

                  </div>

                  {/* STATE */}

                  <div>

                    <label className="block font-semibold text-slate-700 mb-2">
                      State
                    </label>

                    <div className="relative">

                      <MapPin
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        placeholder="e.g. Andhra Pradesh"
                        className="w-full border border-slate-200 p-4 pl-11 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                </div>

                {/* SPECIALIZATION */}

                {specializationOptions[formData.education] && (
                  <div className="mt-6">

                    <label className="block font-semibold text-slate-700 mb-2">
                      Stream / Branch
                    </label>

                    <select
                      name="specialization"
                      value={formData.specialization}
                      className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Select Stream / Branch
                      </option>

                      {specializationOptions[
                        formData.education
                      ].map((item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ))}

                    </select>

                  </div>
                )}

                {/* OPTIONAL INTEREST */}

                <div className="mt-6">

                  <label className="block font-semibold text-slate-700 mb-2">

                    <span className="inline-flex items-center gap-2">

                      <Heart
                        size={18}
                        className="text-pink-500"
                      />

                      Area of Interest

                      <span className="text-sm font-normal text-slate-400">
                        (Optional)
                      </span>

                    </span>

                  </label>

                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >

                    <option value="">
                      Prefer not to specify
                    </option>

                    {interestOptions.map((interest) => (
                      <option
                        key={interest}
                        value={interest}
                      >
                        {interest}
                      </option>
                    ))}

                  </select>

                  <p className="text-xs text-slate-400 mt-2">
                    This is optional. If you select an interest,
                    CareerOS may use it to improve career ranking.
                    It will not replace your selected career path.
                  </p>

                </div>

              </div>
            )}

            {/* ==================================================
                STEP 2
            ================================================== */}

            {step === 2 && (
              <div>

                <div className="mb-8">

                  <h3 className="text-2xl font-bold text-slate-800">
                    Choose your career direction
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Based on your education and specialization,
                    choose the job role you want to explore.
                  </p>

                </div>

                {currentCareerOptions.length > 0 ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">

                    {currentCareerOptions.map((career) => {

                      const careerId = getCareerId(career);

                      return (
                        <label
                          key={careerId}
                          className={`cursor-pointer border-2 rounded-2xl p-5 transition ${
                            formData.dreamCareer === career
                              ? "border-blue-600 bg-blue-50 shadow-md"
                              : "border-slate-200 hover:border-blue-300"
                          }`}
                        >

                          <input
                            type="radio"
                            name="dreamCareer"
                            value={career}
                            checked={
                              formData.dreamCareer === career
                            }
                            onChange={handleChange}
                            className="sr-only"
                          />

                          <div className="flex items-start gap-3">

                            <Target
                              size={21}
                              className={
                                formData.dreamCareer === career
                                  ? "text-blue-600"
                                  : "text-slate-400"
                              }
                            />

                            <div>

                              <p className="font-semibold text-slate-800">
                                {career}
                              </p>

                              {formData.dreamCareer === career && (
                                <p className="text-xs text-blue-600 mt-1">
                                  Selected
                                </p>
                              )}

                              <p className="text-[10px] text-slate-400 mt-1">
                                {careerId}
                              </p>

                            </div>

                          </div>

                        </label>
                      );
                    })}

                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

                    <p className="font-semibold text-blue-800">
                      No job roles are available for this selection yet.
                    </p>

                    <p className="text-sm text-blue-600 mt-2">
                      Please go back and choose another education
                      or specialization.
                    </p>

                  </div>
                )}

              </div>
            )}

            {/* ==================================================
                STEP 3
            ================================================== */}

            {step === 3 && (
              <div>

                <div className="mb-8">

                  <h3 className="text-2xl font-bold text-slate-800">
                    What skills do you have?
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Select the skills you already have. You can
                    update them later from your profile.
                  </p>

                </div>

                {formData.dreamCareer &&
                careerSkillOptions[formData.dreamCareer] ? (
                  <div>

                    <div className="bg-blue-50 rounded-2xl p-5 mb-6">

                      <p className="text-sm text-blue-600 font-semibold">
                        Selected Career / Job Role
                      </p>

                      <p className="text-xl font-bold text-blue-800 mt-1">
                        {formData.dreamCareer}
                      </p>

                      <p className="text-xs text-blue-500 mt-1">
                        Career ID:{" "}
                        {getCareerId(formData.dreamCareer)}
                      </p>

                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

                      {careerSkillOptions[
                        formData.dreamCareer
                      ].map((skill) => {

                        const selected =
                          formData.skills.includes(skill);

                        return (
                          <label
                            key={skill}
                            className={`cursor-pointer border rounded-xl p-3 transition ${
                              selected
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-slate-50 border-slate-200 hover:border-blue-300"
                            }`}
                          >

                            <input
                              type="checkbox"
                              value={skill}
                              checked={selected}
                              onChange={handleSkillChange}
                              className="sr-only"
                            />

                            <div className="flex items-center gap-2">

                              {selected && (
                                <CheckCircle2 size={17} />
                              )}

                              <span className="text-sm font-medium">
                                {skill}
                              </span>

                            </div>

                          </label>
                        );
                      })}

                    </div>

                    <p className="text-sm text-slate-500 mt-5">

                      {formData.skills.length} skill
                      {formData.skills.length !== 1
                        ? "s"
                        : ""}{" "}
                      selected

                    </p>

                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-8 text-center">

                    <Code2
                      size={40}
                      className="mx-auto text-slate-400 mb-3"
                    />

                    <p className="text-slate-500">
                      This path does not require technical
                      skills selection yet.
                    </p>

                    <p className="text-sm text-slate-400 mt-2">
                      You can continue and update your skills
                      later.
                    </p>

                  </div>
                )}

              </div>
            )}

            {/* ==================================================
                NAVIGATION
            ================================================== */}

            <div className="flex justify-between items-center mt-10 pt-7 border-t">

              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                  step === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >

                <ArrowLeft size={18} />

                Back

              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !canGoToStep2) ||
                    (step === 2 && !canGoToStep3)
                  }
                  className={`flex items-center gap-2 px-7 py-3 rounded-xl font-semibold transition ${
                    (step === 1 && !canGoToStep2) ||
                    (step === 2 && !canGoToStep3)
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                  }`}
                >

                  Continue

                  <ArrowRight size={18} />

                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-7 py-3 rounded-xl font-semibold hover:scale-[1.02] transition shadow-lg"
                >

                  <Sparkles size={18} />

                  Generate My Career Roadmap

                  <ArrowRight size={18} />

                </button>
              )}

            </div>

          </form>

        </div>

      </div>
    </section>
  );
}

export default StudentForm;