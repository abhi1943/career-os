import careerKnowledge from "../data/ai/careerKnowledge";

export function getCareerAI(id) {
  return careerKnowledge[id] || null;
}