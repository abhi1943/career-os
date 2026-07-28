import database from "../data";

export function searchCareers(query) {
  if (!query.trim()) return [];

  const allCareers = Object.values(database).flatMap(
    (level) => level.options || []
  );

  return allCareers.filter((career) =>
    career.name.toLowerCase().includes(query.toLowerCase())
  );
}