import collegesDatabase from "../data/colleges";

export function getColleges(careerId) {
  return collegesDatabase[careerId] || [];
}