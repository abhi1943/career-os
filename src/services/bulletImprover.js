const actionWords = [
  "Developed",
  "Designed",
  "Implemented",
  "Built",
  "Optimized",
  "Engineered",
  "Created",
  "Integrated",
  "Enhanced",
  "Automated",
];

export function improveProject(project, targetRole) {
  if (!project) return "";

  const action =
    actionWords[
      Math.floor(Math.random() * actionWords.length)
    ];

  return `• ${action} ${project.title} using ${project.technologies}.

• Applied modern software engineering principles to improve scalability and maintainability.

• Collaborated using Git version control and industry best coding practices.

• Built the project with focus on ${targetRole || "software development"} standards.`;
}

export function improveExperience(text) {
  if (!text) return "";

  return `• ${text}

• Collaborated with team members to deliver high-quality software.

• Improved productivity through problem solving and debugging.

• Followed Agile development methodology.`;
}

export function improveAchievement(text) {
  if (!text) return "";

  return `• ${text}

• Demonstrated strong technical and analytical abilities.

• Achieved measurable improvements through consistent effort.`;
}