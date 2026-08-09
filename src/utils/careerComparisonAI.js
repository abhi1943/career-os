export function compareCareers(career1, career2, student) {
  if (!career1 || !career2) return null;

  let score1 = 0;
  let score2 = 0;

  // Dream Career
  if (
    student?.dreamCareer?.toLowerCase() ===
    career1.name.toLowerCase()
  ) {
    score1 += 30;
  }

  if (
    student?.dreamCareer?.toLowerCase() ===
    career2.name.toLowerCase()
  ) {
    score2 += 30;
  }

  // Skills
  student?.skills?.forEach((skill) => {
    if (career1.skills?.includes(skill)) score1 += 8;

    if (career2.skills?.includes(skill)) score2 += 8;
  });

  // Interest
  if (
    student?.interest &&
    career1.description
      ?.toLowerCase()
      .includes(student.interest.toLowerCase())
  ) {
    score1 += 15;
  }

  if (
    student?.interest &&
    career2.description
      ?.toLowerCase()
      .includes(student.interest.toLowerCase())
  ) {
    score2 += 15;
  }

  score1 = Math.min(score1, 100);
  score2 = Math.min(score2, 100);

  let recommendation;

  if (score1 > score2) {
    recommendation = `${career1.name} is a better fit for your profile.`;
  } else if (score2 > score1) {
    recommendation = `${career2.name} is a better fit for your profile.`;
  } else {
    recommendation = `Both careers are equally suitable for your profile.`;
  }

  return {
    score1,
    score2,
    recommendation,
  };
}