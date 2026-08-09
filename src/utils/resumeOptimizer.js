export function optimizeResume(data) {
  const optimized = { ...data };

  // Generate Professional Summary if empty
  if (!optimized.summary || optimized.summary.trim() === "") {
    optimized.summary = `Results-driven ${optimized.targetRole || "Software Developer"} with strong knowledge of ${
      optimized.programming || "modern programming languages"
    }, ${
      optimized.frameworks || "software development frameworks"
    }, and ${
      optimized.databases || "database management"
    }. Passionate about developing scalable, user-focused applications while continuously improving technical and problem-solving skills.`;
  }

  // Improve Project Descriptions
  if (Array.isArray(optimized.projects)) {
    optimized.projects = optimized.projects.map((project) => {
      if (project.includes("Designed") || project.includes("Developed")) {
        return project;
      }

      return `• Developed ${project}
• Designed responsive and scalable application architecture.
• Implemented reusable components and optimized application performance.
• Utilized Git for version control and followed clean coding practices.`;
    });
  }

  // Default achievements
  if (
    !optimized.achievements ||
    optimized.achievements.length === 0
  ) {
    optimized.achievements = [
      "Built multiple real-world software development projects.",
      "Applied object-oriented programming principles.",
      "Collaborated using Git and GitHub version control."
    ];
  }

  // Default certifications
  if (
    !optimized.certifications ||
    optimized.certifications.length === 0
  ) {
    optimized.certifications = [
      "Professional Certification (Add Yours)"
    ];
  }

  // ATS keyword optimization
  optimized.atsKeywords = [
    optimized.programming,
    optimized.frameworks,
    optimized.databases,
    optimized.tools,
    optimized.cloud,
    optimized.targetRole,
  ]
    .filter(Boolean)
    .join(", ");

  return optimized;
}