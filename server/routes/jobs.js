const express = require("express");

const {
    searchJobs,
    searchAllJobCategories,
} = require("../services/adzunaService");

const {
    storeJobs,
    getJobById,
    getRelatedJobs,
    getAllStoredJobs,
    getJobStoreStatus,
} = require("../services/jobService");

const {
    findMatchingAlerts,
    recordAlertMatch,
} = require("../services/jobAlertsService");

const {
    addSearchHistory,
} = require("../services/searchHistoryService");

const router = express.Router();

// ======================================================
// SEARCH JOBS
// GET /api/jobs
// ======================================================

router.get(
    "/",
    async (req, res) => {
        try {
            const {
                query,
                category = "",
                location = "India",
                page = 1,
                experience = "Any Experience",
                jobType = "Any Type",
                workMode = "Any",
                salary = "Any Salary",
            } = req.query;

            // ==================================================
            // NORMALIZE SEARCH QUERY
            // ==================================================
            //
            // Empty search means "all jobs".
            //
            // This allows CareerOS to show jobs from multiple
            // career categories instead of defaulting to
            // software engineer jobs.
            //
            // ==================================================

            const searchQuery =
                typeof query === "string" &&
                query.trim()
                    ? query.trim()
                    : "all jobs";

            // ==================================================
            // NORMALIZE PAGE
            // ==================================================

            const pageNumber = Math.min(
                Math.max(
                    Number(page) || 1,
                    1
                ),
                100
            );

            // ==================================================
// SEARCH ADZUNA JOBS
// ==================================================
//
// If the user has selected a specific category,
// search that category.
//
// If no category and no search query are provided,
// search across all configured job categories.
//
// ==================================================

let data;

const hasSearchQuery =
    typeof query === "string" &&
    query.trim();

const hasCategory =
    typeof category === "string" &&
    category.trim();

if (!hasSearchQuery && !hasCategory) {
    // --------------------------------------------------
    // ALL JOB CATEGORIES
    // --------------------------------------------------

    data =
        await searchAllJobCategories({
            location,
            page: pageNumber,
            experience,
            jobType,
            workMode,
            salary,
        });
} else {
    // --------------------------------------------------
    // NORMAL SEARCH / CATEGORY SEARCH
    // --------------------------------------------------

    data =
        await searchJobs({
            query: searchQuery,
            category,
            location,
            page: pageNumber,
            experience,
            jobType,
            workMode,
            salary,
        });
}

const jobs = Array.isArray(
    data?.results
)
    ? data.results
    : [];
            // ==================================================
            // STORE FRESH JOBS
            // ==================================================

            const storeResult =
                storeJobs(jobs);

            // ==================================================
            // AUTOMATIC JOB ALERT MATCHING
            // ==================================================
            //
            // jobAlertsService.js uses MySQL.
            //
            // Therefore:
            //
            // findMatchingAlerts()
            // recordAlertMatch()
            //
            // are async functions and MUST be awaited.
            //
            // ==================================================

            let alertMatchesFound = 0;
            let alertMatchesRecorded = 0;

            for (const job of jobs) {
                try {
                    if (
                        !job ||
                        !job.id
                    ) {
                        continue;
                    }

                    // --------------------------------------------------
                    // FIND ALL MATCHING ACTIVE ALERTS
                    // --------------------------------------------------

                    const matches =
                        await findMatchingAlerts(
                            job
                        );

                    if (
                        !Array.isArray(
                            matches
                        ) ||
                        matches.length === 0
                    ) {
                        continue;
                    }

                    alertMatchesFound +=
                        matches.length;

                    // --------------------------------------------------
                    // RECORD EACH MATCH
                    // --------------------------------------------------

                    for (
                        const match
                        of matches
                    ) {
                        if (
                            !match ||
                            !match.alert ||
                            !match.alert.id
                        ) {
                            continue;
                        }

                        const alertId =
                            match.alert.id;

                        const userId =
                            match.alert.userId;

                        if (!userId) {
                            console.warn(
                                "Skipping alert match because alert userId is missing:",
                                alertId
                            );

                            continue;
                        }

                        const updatedAlert =
                            await recordAlertMatch(
                                alertId,
                                job,
                                userId
                            );

                        if (
                            updatedAlert &&
                            !updatedAlert.alreadyMatched
                        ) {
                            alertMatchesRecorded++;
                        }
                    }
                } catch (alertError) {
                    console.error(
                        "Job Alert Matching Error:",
                        alertError.message
                    );
                }
            }

            // ==================================================
            // SAVE SEARCH HISTORY
            // ==================================================
            //
            // Every successful job search is saved with:
            //
            // query
            // location
            // experience
            // jobType
            // workMode
            // salary
            // resultCount
            //
            // This data is later displayed by:
            //
            // RecentSearches.jsx
            //
            // ==================================================

            try {
                await addSearchHistory({
                    query: searchQuery,
                    category,
                    location,
                    experience,
                    jobType,
                    workMode,
                    salary,
                    resultCount:
                        jobs.length,
                });
            } catch (historyError) {
                console.error(
                    "Search History Save Error:",
                    historyError.message
                );
            }

            // ==================================================
            // PAGINATION
            // ==================================================

            const total = Number(
                data?.total ||
                    data?.count ||
                    0
            );

            const resultsPerPage =
                Number(
                    data?.results_per_page ||
                        50
                );

            const hasMore =
                typeof data?.has_more ===
                "boolean"
                    ? data.has_more
                    : pageNumber *
                            resultsPerPage <
                        total;

            // ==================================================
            // RESPONSE
            // ==================================================

            res.json({
                success: true,

                count: jobs.length,

                alertMatchesFound,

                alertMatchesRecorded,

                total,

                filtered_total:
                    Number(
                        data?.filtered_total ??
                            jobs.length
                    ),

                filtered_count:
                    Number(
                        data?.filtered_count ??
                            jobs.length
                    ),

                page: pageNumber,

                results_per_page:
                    resultsPerPage,

                has_more: hasMore,

                experience,

                jobType,

                workMode,

                salary,
                category,

                filtered_pages_scanned:
                    Number(
                        data?.filtered_pages_scanned ||
                            1
                    ),

                jobs,

                store: {
                    stored:
                        storeResult.stored,

                    updated:
                        storeResult.updated,

                    total:
                        storeResult.total,
                },
            });
        } catch (error) {
            console.error(
                "Adzuna API Error:",
                error.response?.data ||
                    error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to fetch jobs",

                error:
                    error.response?.data ||
                    error.message,
            });
        }
    }
);

// ======================================================
// JOB STORE STATUS
// GET /api/jobs/status
// ======================================================

router.get(
    "/status",
    (req, res) => {
        try {
            const status =
                getJobStoreStatus();

            res.json({
                success: true,

                status,
            });
        } catch (error) {
            console.error(
                "Job Store Status Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to get job store status",

                error: error.message,
            });
        }
    }
);

// ======================================================
// GET SINGLE JOB
// GET /api/jobs/:id
// ======================================================

router.get(
    "/:id",
    (req, res) => {
        try {
            const {
                id,
            } = req.params;

            if (!id) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job ID is required",
                    });
            }

            const job =
                getJobById(id);

            if (!job) {
                return res
                    .status(404)
                    .json({
                        success: false,

                        message:
                            "Job not found. Please search for the job again.",
                    });
            }

            res.json({
                success: true,

                job,
            });
        } catch (error) {
            console.error(
                "Job Details Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to fetch job details",

                error: error.message,
            });
        }
    }
);

// ======================================================
// GET RELATED JOBS
// GET /api/jobs/:id/related
// ======================================================

router.get(
    "/:id/related",
    async (req, res) => {
        try {
            const {
                id,
            } = req.params;

            if (!id) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job ID is required",
                    });
            }

            // ==================================================
            // CURRENT JOB
            // ==================================================

            const currentJob =
                getJobById(id);

            if (!currentJob) {
                return res
                    .status(404)
                    .json({
                        success: false,

                        message:
                            "Job not found",
                    });
            }

            // ==================================================
            // FIRST: STORED JOBS
            // ==================================================

            let relatedJobs =
                getRelatedJobs(
                    currentJob,
                    4
                );

            // ==================================================
            // FALLBACK SEARCH
            // ==================================================

            if (
                relatedJobs.length < 4
            ) {
                const title =
                    currentJob.title ||
                    "";

                const category =
                    typeof currentJob.category ===
                    "string"
                        ? currentJob.category
                        : currentJob
                              .category
                              ?.label ||
                          "";

                const searchQuery = [
                    title,
                    category,
                ]
                    .filter(Boolean)
                    .join(" ");

                const location =
                    typeof currentJob.location ===
                    "string"
                        ? currentJob.location
                        : currentJob
                              .location
                              ?.display_name ||
                          "India";

                try {
                    const fallbackData =
                        await searchJobs({
                            query:
                                searchQuery ||
                                "software engineer",

                            location,

                            page: 1,

                            experience:
                                "Any Experience",

                            jobType:
                                "Any Type",

                            workMode:
                                "Any",

                            salary:
                                "Any Salary",
                        });

                    const fallbackJobs =
                        Array.isArray(
                            fallbackData?.results
                        )
                            ? fallbackData.results
                            : [];

                    storeJobs(
                        fallbackJobs
                    );

                    relatedJobs =
                        getRelatedJobs(
                            currentJob,
                            4
                        );
                } catch (
                    fallbackError
                ) {
                    console.error(
                        "Related jobs fallback search failed:",
                        fallbackError
                            ?.response
                            ?.data ||
                            fallbackError?.message
                    );
                }
            }

            // ==================================================
            // FINAL FALLBACK
            // ==================================================

            if (
                relatedJobs.length < 4
            ) {
                const storedJobs =
                    getAllStoredJobs();

                const currentId =
                    String(id);

                const additionalJobs =
                    storedJobs.filter(
                        (job) =>
                            String(
                                job.id
                            ) !==
                                currentId &&
                            !relatedJobs.some(
                                (
                                    related
                                ) =>
                                    String(
                                        related.id
                                    ) ===
                                    String(
                                        job.id
                                    )
                            )
                    );

                relatedJobs = [
                    ...relatedJobs,
                    ...additionalJobs,
                ].slice(0, 4);
            }

            // ==================================================
            // RESPONSE
            // ==================================================

            res.json({
                success: true,

                count:
                    relatedJobs.length,

                jobs:
                    relatedJobs,
            });
        } catch (error) {
            console.error(
                "Related Jobs Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to load related jobs",

                error: error.message,
            });
        }
    }
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;