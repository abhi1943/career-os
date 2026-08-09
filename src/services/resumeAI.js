// =========================
// Professional Summary
// =========================

export function generateSummary(data) {
  const role = data.targetRole || "Software Engineer";
  const degree = data.degree || "Bachelor's Degree";
  const branch = data.branch || "";
  const skills = data.skills || "";

  return `Results-driven ${degree} graduate in ${branch} seeking a ${role} position. Skilled in ${skills}. Passionate about building scalable software solutions, solving complex technical problems, and learning modern technologies. Strong analytical thinking, communication skills, teamwork, and commitment to continuous professional growth.`;
}

// =========================
// Project Description
// =========================

export function generateProjectDescription(projectName) {
  if (!projectName) return "";

  return `• Designed and developed ${projectName} using industry-standard technologies.
• Built responsive UI and reusable components.
• Integrated APIs and optimized application performance.
• Used Git for version control and followed clean coding practices.
• Tested and debugged the application to ensure reliability.`;
}

// =========================
// Internship
// =========================

export function generateInternship(role) {
  return `• Worked as a ${role || "Software Development"} Intern.
• Collaborated with developers to build production-ready features.
• Fixed bugs, improved application performance, and participated in code reviews.
• Worked with Git, Agile methodology, REST APIs, and modern development practices.`;
}

// =========================
// Experience
// =========================

export function generateExperience(role) {
  return `• Developed scalable applications as a ${role || "Software Engineer"}.
• Implemented new features and optimized existing modules.
• Worked closely with cross-functional teams to deliver high-quality software.
• Participated in debugging, testing, deployment, and maintenance activities.`;
}

// =========================
// Achievements
// =========================

export function generateAchievements(role) {
  return `• Built multiple industry-level ${role || "software"} projects.
• Improved problem-solving skills through Data Structures and Algorithms practice.
• Successfully completed technical certifications and self-learning programs.
• Consistently delivered high-quality academic and personal projects.`;
}

// =========================
// Skills
// =========================

export function generateSkills(role) {
  const skillMap = {

    "Frontend Developer":
      "HTML, CSS, JavaScript, React.js, Tailwind CSS, Bootstrap, Redux, REST API, Git, Responsive Design",

    "Backend Developer":
      "Java, Spring Boot, Hibernate, REST API, MySQL, SQL, Git, Maven",

    "Full Stack Developer":
      "HTML, CSS, JavaScript, React.js, Java, Spring Boot, MySQL, REST API, Git",

    "AI Engineer":
      "Python, Machine Learning, Deep Learning, TensorFlow, Scikit-learn, Pandas, NumPy",

    "Data Scientist":
      "Python, SQL, Pandas, NumPy, Power BI, Tableau, Machine Learning",

    "Cloud Engineer":
      "AWS, Docker, Kubernetes, Linux, CI/CD, Git",

    "Cyber Security Engineer":
      "Network Security, Linux, Python, Ethical Hacking, OWASP, SIEM"
  };

  return (
    skillMap[role] ||
    "Java, Python, SQL, Git, Problem Solving"
  );
}