export function generateLearningPath(student, career) {
  if (!student || !career) return [];

  const userSkills = (student.skills || []).map((s) =>
    s.toLowerCase()
  );

  const roadmap = [];

  (career.skills || []).forEach((skill, index) => {
    if (!userSkills.includes(skill.toLowerCase())) {
      roadmap.push({
        week: `Week ${index + 1}`,
        skill,
      });
    }
  });

  return roadmap;
}