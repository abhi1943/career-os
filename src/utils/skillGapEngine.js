export function analyzeSkillGap(student, career) {
  if (!student || !career) return null;

  const userSkills = (student.skills || []).map((skill) =>
    skill.toLowerCase()
  );

  const requiredSkills = career.skills || [];

  const matched = [];
  const missing = [];

  requiredSkills.forEach((skill) => {
    if (userSkills.includes(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const percentage =
    requiredSkills.length === 0
      ? 0
      : Math.round(
          (matched.length / requiredSkills.length) * 100
        );

  let level = "";

  if (percentage >= 90)
    level = "Industry Ready";

  else if (percentage >= 75)
    level = "Almost Ready";

  else if (percentage >= 50)
    level = "Good Foundation";

  else
    level = "Needs Learning";

  return {
    matched,
    missing,
    percentage,
    level,
  };
}