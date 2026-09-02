
// ======================================================
// CareerOS Job Server
// ======================================================
// ======================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// ======================================================
// ROUTES
// ======================================================

const jobsRoute =
    require("./routes/jobs");

const savedJobsRoute =
    require("./routes/savedJobs");

const jobAlertsRoute =
    require("./routes/jobAlerts");

const searchHistoryRoute =
    require("./routes/searchHistory");

const applicationsRoute =
    require("./routes/applications");

// ======================================================
// JOB SERVICES
// ======================================================

const {
    searchJobs,
} = require("./services/adzunaService");

const {
    storeJobs,
    removeStaleJobs,
    getJobStoreStatus,
} = require("./services/jobService");

// ======================================================
// ENVIRONMENT
// ======================================================

dotenv.config();

// ======================================================
// EXPRESS APP
// ======================================================

const app =
    express();

const PORT =
    process.env.PORT || 5000;

// ======================================================
// AUTOMATIC REFRESH SETTINGS
// ======================================================

// Refresh every 6 hours.
const JOB_REFRESH_INTERVAL =
    6 * 60 * 60 * 1000;

// Jobs older than 24 hours are considered expired.
const STALE_JOB_MAX_AGE =
    24 * 60 * 60 * 1000;

// ======================================================
// DEFAULT JOB SEARCHES
// ======================================================
//
// These searches keep the CareerOS job database
// automatically populated with different types
// of technology and data jobs.
//
// ======================================================

const DEFAULT_JOB_SEARCHES = [
    "software engineer",
    "frontend developer",
    "backend developer",
    "full stack developer",
    "react developer",
    "java developer",
    "python developer",
    "data analyst",
];

// ======================================================
// REFRESH STATE
// ======================================================

const refreshState = {
    isRefreshing: false,

    lastRefreshStartedAt: null,

    lastRefreshCompletedAt: null,

    lastRefreshFailedAt: null,

    lastRefreshFetchedCount: 0,

    lastRefreshStoredCount: 0,

    lastRefreshUpdatedCount: 0,

    lastRefreshSkippedCount: 0,

    lastRefreshRemovedCount: 0,

    lastRefreshError: null,
};

// ======================================================
// DELAY HELPER
// ======================================================


// ======================================================
// AUTOMATIC JOB REFRESH
// ======================================================

async function refreshJobs() {
    if (refreshState.isRefreshing) {
        return false;
    }

    refreshState.isRefreshing = true;

    refreshState.lastRefreshStartedAt =
        new Date().toISOString();

    refreshState.lastRefreshCompletedAt =
        null;

    refreshState.lastRefreshFailedAt =
        null;

    refreshState.lastRefreshFetchedCount =
        0;

    refreshState.lastRefreshStoredCount =
        0;

    refreshState.lastRefreshUpdatedCount =
        0;

    refreshState.lastRefreshSkippedCount =
        0;

    refreshState.lastRefreshRemovedCount =
        0;

    refreshState.lastRefreshError =
        null;

    let totalFetched = 0;
    let totalStored = 0;
    let totalUpdated = 0;
    let totalSkipped = 0;

    try {
        const removedBeforeRefresh =
            removeStaleJobs(
                STALE_JOB_MAX_AGE
            );

        refreshState.lastRefreshRemovedCount =
            Number(
                removedBeforeRefresh || 0
            );

        // --------------------------------------------------
        // Background refresh deliberately uses one request
        // at a time.
        // --------------------------------------------------

        for (
            const query
            of DEFAULT_JOB_SEARCHES
        ) {
            try {
                const data =
                    await searchJobs({
                        query,
                        location: "India",
                        page: 1,
                        experience:
                            "Any Experience",
                        jobType:
                            "Any Type",
                        workMode:
                            "Any",
                        salary:
                            "Any Salary",
                        backgroundRefresh:
                            true,
                    });

                const jobs =
                    Array.isArray(
                        data?.results
                    )
                        ? data.results
                        : [];

                const storeResult =
                    storeJobs(jobs);

                totalFetched +=
                    jobs.length;

                totalStored +=
                    Number(
                        storeResult?.stored ||
                        0
                    );

                totalUpdated +=
                    Number(
                        storeResult?.updated ||
                        0
                    );

                totalSkipped +=
                    Number(
                        storeResult?.skipped ||
                        0
                    );
            } catch (searchError) {
                // One query failure must not stop
                // the remaining refresh work.

                const status =
                    searchError?.response?.status;

                if (
                    status === 429 ||
                    status === 503
                ) {
                    // fetchAdzunaPage already
                    // performed limited retries.
                    continue;
                }

                console.error(
                    `Background refresh failed for "${query}":`,
                    searchError?.message ||
                        searchError
                );
            }
        }

        const removedAfterRefresh =
            removeStaleJobs(
                STALE_JOB_MAX_AGE
            );

        refreshState.lastRefreshRemovedCount +=
            Number(
                removedAfterRefresh || 0
            );

        refreshState.lastRefreshFetchedCount =
            totalFetched;

        refreshState.lastRefreshStoredCount =
            totalStored;

        refreshState.lastRefreshUpdatedCount =
            totalUpdated;

        refreshState.lastRefreshSkippedCount =
            totalSkipped;

        refreshState.lastRefreshCompletedAt =
            new Date().toISOString();

        return true;
    } catch (error) {
        refreshState.lastRefreshFailedAt =
            new Date().toISOString();

        refreshState.lastRefreshError =
            error?.message ||
            "Unknown refresh error";

        console.error(
            "CareerOS automatic refresh error:",
            error
        );

        return false;
    } finally {
        refreshState.isRefreshing =
            false;
    }
}

// ======================================================
// MIDDLEWARE
// ======================================================

// ======================================================
// CORS CONFIGURATION
// ======================================================
//
// Production frontend:
// https://career-5bszfhdpl-career-os13.vercel.app


function normalizeOrigin(origin) {
    return String(
        origin || ""
    )
        .trim()
        .replace(/\/+$/, "");
}

const configuredFrontendUrl =
    normalizeOrigin(
        process.env.FRONTEND_URL
    );

const allowedOrigins = [
    configuredFrontendUrl,

    "https://career-os13.vercel.app",
    "https://career-os-peach.vercel.app",

    "https://career-5bszfhdpl-career-os13.vercel.app",

    "http://localhost:5173",

    "http://localhost:5174",

    "http://127.0.0.1:5173",

    "http://127.0.0.1:5174",
].filter(Boolean);

// ------------------------------------------------------
// Vercel preview deployment pattern
// ------------------------------------------------------

function isAllowedOrigin(origin) {
    if (!origin) {
        return true;
    }

    const normalizedOrigin =
        normalizeOrigin(origin);

    // Exact allowlist
    if (
        allowedOrigins.includes(
            normalizedOrigin
        )
    ) {
        return true;
    }

    // CareerOS Vercel preview deployments
    if (
        /^https:\/\/career-[a-z0-9-]+-career-os13\.vercel\.app$/i.test(
            normalizedOrigin
        )
    ) {
        return true;
    }

    return false;
}

// ------------------------------------------------------
// CORS OPTIONS
// ------------------------------------------------------

const corsOptions = {
    origin: (
        origin,
        callback
    ) => {
        if (
            isAllowedOrigin(origin)
        ) {
            callback(
                null,
                true
            );
        } else {
            console.error(
                `CORS blocked origin: ${origin}`
            );

            callback(
                new Error(
                    `CORS blocked origin: ${origin}`
                )
            );
        }
    },

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-User-Id",
        "X-CareerOS-User-Id",
    ],

    exposedHeaders: [
        "Content-Length",
    ],

    optionsSuccessStatus: 204,
};

// ------------------------------------------------------
// APPLY CORS
// ------------------------------------------------------

app.use(
    cors(corsOptions)
);

// ======================================================
// JSON BODY PARSER
// ======================================================

app.use(
    express.json({
        limit: "1mb",
    })
);

// ======================================================
// HOME ROUTE
// ======================================================

app.get(
    "/",
    (req, res) => {
        res.json({
            success: true,

            message:
                "CareerOS Job Server is running 🚀",
        });
    }
);

// ======================================================
// REFRESH STATUS
// ======================================================
//
// GET /api/jobs/refresh-status
//
// ======================================================

app.get(
    "/api/jobs/refresh-status",
    (req, res) => {
        try {
            // --------------------------------------------------
            // CALCULATE NEXT REFRESH
            // --------------------------------------------------

            let nextRefreshIn =
                null;

            if (
                refreshState
                    .lastRefreshStartedAt
            ) {
                const lastStarted =
                    new Date(
                        refreshState
                            .lastRefreshStartedAt
                    ).getTime();

                const nextRefreshTime =
                    lastStarted +
                    JOB_REFRESH_INTERVAL;

                const remaining =
                    nextRefreshTime -
                    Date.now();

                nextRefreshIn =
                    Math.max(
                        0,
                        remaining
                    );
            }

            // --------------------------------------------------
            // CURRENT STORE STATUS
            // --------------------------------------------------

            const storeStatus =
                getJobStoreStatus();

            // --------------------------------------------------
            // RESPONSE
            // --------------------------------------------------

            res.json({
                success: true,

                refresh: {
                    isRefreshing:
                        refreshState
                            .isRefreshing,

                    lastRefreshStartedAt:
                        refreshState
                            .lastRefreshStartedAt,

                    lastRefreshCompletedAt:
                        refreshState
                            .lastRefreshCompletedAt,

                    lastRefreshFailedAt:
                        refreshState
                            .lastRefreshFailedAt,

                    lastRefreshFetchedCount:
                        refreshState
                            .lastRefreshFetchedCount,

                    lastRefreshStoredCount:
                        refreshState
                            .lastRefreshStoredCount,

                    lastRefreshUpdatedCount:
                        refreshState
                            .lastRefreshUpdatedCount,

                    lastRefreshSkippedCount:
                        refreshState
                            .lastRefreshSkippedCount,

                    lastRefreshRemovedCount:
                        refreshState
                            .lastRefreshRemovedCount,

                    lastRefreshError:
                        refreshState
                            .lastRefreshError,

                    refreshIntervalMs:
                        JOB_REFRESH_INTERVAL,

                    refreshIntervalHours:
                        JOB_REFRESH_INTERVAL /
                        (60 * 60 * 1000),

                    staleJobMaxAgeMs:
                        STALE_JOB_MAX_AGE,

                    staleJobMaxAgeHours:
                        STALE_JOB_MAX_AGE /
                        (60 * 60 * 1000),

                    nextRefreshInMs:
                        nextRefreshIn,

                    nextRefreshInMinutes:
                        nextRefreshIn ===
                        null
                            ? null
                            : Math.ceil(
                                  nextRefreshIn /
                                      (60 *
                                          1000)
                              ),
                },

                store:
                    storeStatus,

                serverTime:
                    new Date().toISOString(),
            });
        } catch (error) {
            console.error(
                "Refresh Status Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to get refresh status",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// JOBS API
// ======================================================
//
// GET /api/jobs
// GET /api/jobs/:id
// GET /api/jobs/:id/related
//
// ======================================================

app.use(
    "/api/jobs",
    jobsRoute
);

// ======================================================
// SAVED JOBS API
// ======================================================
//
// GET    /api/saved-jobs
// POST   /api/saved-jobs
// GET    /api/saved-jobs/:id
// DELETE /api/saved-jobs/:id
//
// ======================================================

app.use(
    "/api/saved-jobs",
    savedJobsRoute
);

// ======================================================
// JOB ALERTS API
// ======================================================
//
// GET    /api/job-alerts
// POST   /api/job-alerts
// GET    /api/job-alerts/stats
// POST   /api/job-alerts/match
// POST   /api/job-alerts/:id/test
// GET    /api/job-alerts/:id
// PUT    /api/job-alerts/:id
// PATCH  /api/job-alerts/:id/enable
// PATCH  /api/job-alerts/:id/disable
// DELETE /api/job-alerts/:id
//
// ======================================================

app.use(
    "/api/job-alerts",
    jobAlertsRoute
);

// ======================================================
// SEARCH HISTORY API
// ======================================================
//
// GET    /api/search-history
// GET    /api/search-history/count
// GET    /api/search-history/:id
// DELETE /api/search-history/:id
// DELETE /api/search-history
//
// ======================================================

app.use(
    "/api/search-history",
    searchHistoryRoute
);

// ======================================================
// APPLICATIONS API
// ======================================================
//
// GET    /api/applications
// GET    /api/applications/count
// GET    /api/applications/statuses
// GET    /api/applications/:jobId
// POST   /api/applications
// PATCH  /api/applications/:jobId
// DELETE /api/applications/:jobId
//
// ======================================================

app.use(
    "/api/applications",
    applicationsRoute
);

// ======================================================
// 404 HANDLER
// ======================================================

app.use(
    (req, res) => {
        res.status(404).json({
            success: false,

            message:
                "CareerOS API route not found.",

            path:
                req.originalUrl,
        });
    }
);

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {
        console.error(
            "CareerOS Server Error:",
            error
        );

        if (
            res.headersSent
        ) {
            return next(
                error
            );
        }

        res.status(
            error?.status ||
            500
        ).json({
            success: false,

            message:
                error?.message ||
                "Internal server error.",
        });
    }
);

// ======================================================
// START SERVER
// ======================================================

app.listen(
    PORT,
    async () => {
        console.log("");

        console.log(
            "======================================================"
        );

        console.log(
            "🚀 CareerOS Job Server"
        );

        console.log(
            "======================================================"
        );

        console.log(
            `🌐 Server: http://localhost:${PORT}`
        );

        console.log(
            `📡 Jobs API: http://localhost:${PORT}/api/jobs`
        );

        console.log(
            `📊 Store Status: http://localhost:${PORT}/api/jobs/refresh-status`
        );

        console.log(
            `🔄 Refresh Status: http://localhost:${PORT}/api/jobs/refresh-status`
        );

        console.log(
            `💾 Saved Jobs: http://localhost:${PORT}/api/saved-jobs`
        );

        console.log(
            `🔔 Job Alerts: http://localhost:${PORT}/api/job-alerts`
        );

        console.log(
            `📝 Search History: http://localhost:${PORT}/api/search-history`
        );

        console.log(
            `📄 Applications: http://localhost:${PORT}/api/applications`
        );

        console.log(
            `⏰ Automatic Refresh: Every 6 hours`
        );

        console.log(
            `🧹 Job Expiration: After 24 hours without refresh`
        );

        console.log(
            "======================================================"
        );

        console.log("");

        console.log(
            "🌍 Allowed CORS origins:"
        );

        allowedOrigins.forEach(
            (origin) => {
                console.log(
                    `   ✓ ${origin}`
                );
            }
        );

        console.log(
            "   ✓ Vercel CareerOS preview deployments"
        );

        console.log("");

        // ==================================================
        // INITIAL REFRESH
        // ==================================================
        //
        // Populate the job store immediately when the
        // backend starts.
        //
        // ==================================================

        await refreshJobs();

        // ==================================================
        // AUTOMATIC REFRESH TIMER
        // ==================================================
        //
        // After the initial refresh, automatically refresh
        // the jobs every 6 hours.
        //
        // ==================================================

        setInterval(
            refreshJobs,
            JOB_REFRESH_INTERVAL
        );
    }
);
  
