import collegesDatabase from "../data/colleges";

export function getColleges(careerId) {
  return collegesDatabase[careerId] || [];
}

export function getAllColleges() {
  return Object.values(collegesDatabase).flat();
}