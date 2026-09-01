// ======================================================
// CareerOS Job Category Count Service
// ======================================================


const {
    getAllStoredJobs,
} = require("./jobService");

// ======================================================
// NORMALIZE CATEGORY
// ======================================================

function normalizeCategory(category) {
    if (!category) {
        return "Other";
    }

    if (typeof category === "string") {
        return category
            .trim()
            .replace(/\s+/g, " ");
    }

    return (
        category.label ||
        category.name ||
        "Other"
    )
        .trim()
        .replace(/\s+/g, " ");
}

// ======================================================
// GET JOB CATEGORY COUNTS
// ======================================================

function getJobCategoryCounts() {
    // Get all currently fresh jobs
    // from the existing job store.
    const jobs = getAllStoredJobs();

    const categoryCounts = {};

    for (const job of jobs) {
        const category = normalizeCategory(
            job.category
        );

        if (!categoryCounts[category]) {
            categoryCounts[category] = 0;
        }

        categoryCounts[category]++;
    }

    return categoryCounts;
}

// ======================================================
// GET CATEGORY COUNT STATUS
// ======================================================

function getJobCategoryCountStatus() {
    const jobs = getAllStoredJobs();

    const categoryCounts =
        getJobCategoryCounts();

    return {
        totalJobs: jobs.length,

        categoryCounts,

        checkedAt:
            new Date().toISOString(),
    };
}

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    getJobCategoryCounts,
    getJobCategoryCountStatus,
};