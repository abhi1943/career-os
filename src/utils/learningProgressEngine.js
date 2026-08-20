/* ==================================================
   STORAGE KEY
================================================== */

const STORAGE_KEY =
  "careerOS_learning_progress";

/* ==================================================
   GET ALL PROGRESS
================================================== */

export function getLearningProgress() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {};
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error(
      "Failed to load learning progress:",
      error
    );

    return {};
  }
}

/* ==================================================
   SAVE ALL PROGRESS
================================================== */

function saveLearningProgress(progress) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error(
      "Failed to save learning progress:",
      error
    );
  }
}

/* ==================================================
   GET CAREER PROGRESS
================================================== */

export function getCareerLearningProgress(
  careerId
) {
  const progress =
    getLearningProgress();

  return progress[careerId] || {};
}

/* ==================================================
   GET SKILL STATUS
================================================== */

export function getSkillStatus(
  careerId,
  skillId
) {
  const careerProgress =
    getCareerLearningProgress(
      careerId
    );

  return (
    careerProgress[skillId] ||
    "not-started"
  );
}

/* ==================================================
   UPDATE SKILL STATUS
================================================== */

export function updateSkillStatus(
  careerId,
  skillId,
  status
) {
  const progress =
    getLearningProgress();

  if (!progress[careerId]) {
    progress[careerId] = {};
  }

  progress[careerId][skillId] =
    status;

  saveLearningProgress(progress);

  return progress[careerId];
}

/* ==================================================
   RESET CAREER PROGRESS
================================================== */

export function resetCareerLearningProgress(
  careerId
) {
  const progress =
    getLearningProgress();

  delete progress[careerId];

  saveLearningProgress(progress);
}

/* ==================================================
   CALCULATE PROGRESS
================================================== */

export function calculateLearningProgress(
  roadmap
) {
  if (!Array.isArray(roadmap) || roadmap.length === 0) {
    return 100;
  }

  const completed =
    roadmap.filter(
      (item) =>
        item.status === "completed"
    ).length;

  return Math.round(
    (completed / roadmap.length) * 100
  );
}