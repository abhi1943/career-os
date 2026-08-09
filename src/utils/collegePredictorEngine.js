import collegePredictor from "../data/collegePredictor";

export function predictCollege(exam, branch,rank) {
  const list = collegePredictor[exam];

  if (!list) return [];

  const match = list.find(
    (item) =>
        item.branch === branch &&
        rank <= item.maxRank
);

  return match ? match.colleges : [];
}