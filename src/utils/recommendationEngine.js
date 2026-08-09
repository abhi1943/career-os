import database from "../data";
import professions from "../data/professions";

export function getRecommendations(student) {
  if (!student) return [];

  const allCareers = [
    ...Object.values(database).flat(),
    ...professions,
  ];

  const recommendations = allCareers.map((career) => {
    let score = 0;

    // Education Match
    if (
      student.education &&
      career.eligibility?.toLowerCase().includes(student.education.toLowerCase())
    ) {
      score += 35;
    }

    // Dream Career Match
    if (
      student.dreamCareer &&
      career.name.toLowerCase().includes(student.dreamCareer.toLowerCase())
    ) {
      score += 40;
    }

    // Interest Match
    if (
      student.interest &&
      (
        career.description?.toLowerCase().includes(student.interest.toLowerCase()) ||
        career.category?.toLowerCase().includes(student.interest.toLowerCase()) ||
        career.skills?.some((skill) =>
          skill.toLowerCase().includes(student.interest.toLowerCase())
        )
      )
    ) {
      score += 20;
    }

    // High Growth Bonus
    if (career.growth?.toLowerCase().includes("excellent")) {
      score += 5;
    }

    return {
      ...career,
      match: Math.min(score, 100),
    };
  });

  return recommendations
    .filter((career) => career.match > 20)
    .sort((a, b) => b.match - a.match)
    .slice(0, 6);
}