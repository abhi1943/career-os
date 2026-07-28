import database from "../data";

export function getCareerOptions(education) {
  return database[education] || [];
}

export function getCareerById(careerId) {
  const levels = Object.values(database);

  for (const level of levels) {
    const career = level.find(
      (item) => item.id === careerId
    );

    if (career) {
      return career;
    }
  }

  return null;
}