import database from "../data";
import professions from "../data/professions";
import { calculateCareerMatch } from "./aiCareerMatch";

export function recommendCareers(student) {
  if (!student) return [];

  const allCareers = [];

  // Education careers
  Object.values(database).forEach((list) => {
    list.forEach((career) => {
      allCareers.push(career);
    });
  });

  // Professional careers
  professions.forEach((career) => {
    // Prevent duplicates
    if (!allCareers.find((c) => c.id === career.id)) {
      allCareers.push(career);
    }
  });

  const recommendations = allCareers
    .map((career) => {
      const result = calculateCareerMatch(student, career);

      return {
        ...career,
        score: result.score,
        matchedSkills: result.matchedSkills,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return recommendations;
}