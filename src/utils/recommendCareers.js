import database from "../data";
import { calculateCareerMatch } from "./aiCareerMatch";

export function recommendCareers(student) {
  if (!student) return [];

  const allCareers = [];

  Object.values(database).forEach((careerList) => {
    if (!Array.isArray(careerList)) return;

    careerList.forEach((career) => {
      if (
        career &&
        career.id &&
        !allCareers.some(
          (item) => item.id === career.id
        )
      ) {
        allCareers.push(career);
      }
    });
  });

  return allCareers
    .map((career) => {
      const result =
        calculateCareerMatch(
          student,
          career
        );

      return {
        ...career,

        score: result.score,

        matchedSkills:
          result.matchedSkills,

        missingSkills:
          result.missingSkills,

        placementChance:
          result.placementChance,

        learningProgress:
          result.learningProgress,
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, 6);
}