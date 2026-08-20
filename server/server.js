// ======================================================
// CareerOS Job Server
// ======================================================
//
// Responsibilities:
// - Start Express server
// - Connect Jobs API
// - Automatically refresh jobs
// - Remove stale jobs
// - Track refresh status
// - Track job freshness
// - Provide Saved Jobs API
// - Provide Job Alerts API
//
// Automatic refresh:
// - Runs when server starts
// - Runs every 6 hours
// - Removes jobs older than 24 hours
//
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

    getStoredJobCount,

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

function delay(milliseconds) {
    return new Promise(
        (resolve) => {
            setTimeout(
                resolve,
                milliseconds
            );
        }
    );
}

// ======================================================
// AUTOMATIC JOB REFRESH
// ======================================================

async function refreshJobs() {

    // --------------------------------------------------
    // PREVENT DUPLICATE REFRESH
    // --------------------------------------------------

    if (
        refreshState.isRefreshing
    ) {
        console.log(
            "⏳ Job refresh already running. Skipping this refresh."
        );

        return;
    }

    // --------------------------------------------------
    // START REFRESH
    // --------------------------------------------------

    refreshState.isRefreshing =
        true;

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

    console.log("");

    console.log(
        "======================================================"
    );

    console.log(
        "🔄 CareerOS automatic job refresh started"
    );

    console.log(
        "======================================================"
    );

    try {

        // ==================================================
        // REMOVE EXPIRED JOBS
        // ==================================================

        console.log(
            "🧹 Removing expired jobs..."
        );

        const removedCount =
            removeStaleJobs(
                STALE_JOB_MAX_AGE
            );

        refreshState.lastRefreshRemovedCount =
            Number(
                removedCount || 0
            );

        console.log(
            `🧹 Removed ${refreshState.lastRefreshRemovedCount} expired job(s).`
        );

        // ==================================================
        // FETCH JOBS
        // ==================================================

        let totalFetched = 0;

        let totalStored = 0;

        let totalUpdated = 0;

        let totalSkipped = 0;

        // --------------------------------------------------
        // RUN DEFAULT SEARCHES
        // --------------------------------------------------

        for (
            let index = 0;
            index <
            DEFAULT_JOB_SEARCHES.length;
            index++
        ) {

            const query =
                DEFAULT_JOB_SEARCHES[
                    index
                ];

            try {

                console.log(
                    `🔎 Searching jobs: ${query}`
                );

                const data =
                    await searchJobs({
                        query,

                        location:
                            "India",

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

                const jobs =
                    Array.isArray(
                        data?.results
                    )
                        ? data.results
                        : [];

                // --------------------------------------------------
                // STORE JOBS
                // --------------------------------------------------

                const storeResult =
                    storeJobs(
                        jobs
                    );

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

                console.log(
                    `   ✅ ${jobs.length} job(s) received`
                );

                console.log(
                    `   📦 Stored: ${
                        storeResult?.stored ||
                        0
                    } | Updated: ${
                        storeResult?.updated ||
                        0
                    } | Skipped: ${
                        storeResult?.skipped ||
                        0
                    }`
                );

                // --------------------------------------------------
                // DELAY BEFORE NEXT SEARCH
                // --------------------------------------------------

                if (
                    index <
                    DEFAULT_JOB_SEARCHES.length -
                        1
                ) {
                    await delay(
                        1000
                    );
                }

            } catch (
                searchError
            ) {

                // --------------------------------------------------
                // ONE SEARCH FAILURE SHOULD NOT STOP
                // THE ENTIRE REFRESH
                // --------------------------------------------------

                console.error(
                    `❌ Failed search "${query}":`,

                    searchError
                        ?.response
                        ?.data ||
                        searchError?.message
                );
            }
        }

        // ==================================================
        // REMOVE ANY JOBS THAT BECAME EXPIRED
        // DURING THE REFRESH
        // ==================================================

        const removedAfterRefresh =
            removeStaleJobs(
                STALE_JOB_MAX_AGE
            );

        refreshState.lastRefreshRemovedCount +=
            Number(
                removedAfterRefresh || 0
            );

        // ==================================================
        // SAVE REFRESH STATISTICS
        // ==================================================

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

        // ==================================================
        // GET CURRENT FRESH STORE STATUS
        // ==================================================

        const storeStatus =
            getJobStoreStatus();

        // ==================================================
        // REFRESH COMPLETED
        // ==================================================

        console.log("");

        console.log(
            "======================================================"
        );

        console.log(
            "✅ CareerOS automatic job refresh completed"
        );

        console.log(
            `📥 Jobs fetched: ${totalFetched}`
        );

        console.log(
            `📦 New jobs stored: ${totalStored}`
        );

        console.log(
            `🔄 Existing jobs updated: ${totalUpdated}`
        );

        console.log(
            `⚠️ Jobs skipped: ${totalSkipped}`
        );

        console.log(
            `🧹 Expired jobs removed: ${refreshState.lastRefreshRemovedCount}`
        );

        console.log(
            `🟢 Fresh jobs available: ${storeStatus.freshJobs}`
        );

        console.log(
            `📦 Jobs currently stored: ${getStoredJobCount()}`
        );

        console.log(
            "======================================================"
        );

        console.log("");

    } catch (error) {

        // ==================================================
        // REFRESH FAILURE
        // ==================================================

        refreshState.lastRefreshFailedAt =
            new Date().toISOString();

        refreshState.lastRefreshError =
            error?.message ||
            "Unknown refresh error";

        console.error(
            "❌ CareerOS automatic job refresh failed:",

            error
                ?.response
                ?.data ||
                error?.message
        );

    } finally {

        // ==================================================
        // RELEASE REFRESH LOCK
        // ==================================================

        refreshState.isRefreshing =
            false;
    }
}

// ======================================================
// MIDDLEWARE
// ======================================================

// // Frontend URL
// const FRONTEND_URL =
//     process.env.FRONTEND_URL ||
//     "http://localhost:5174";

// Allow requests from the CareerOS frontend.
// ======================================================
// CORS
// ======================================================

const allowedOrigin =
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
    })
);

// ======================================================
// JSON BODY PARSER
// ======================================================

app.use(
    express.json()
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
// Shows:
// - Is refresh currently running?
// - Last refresh started
// - Last refresh completed
// - Last refresh failed
// - Jobs fetched
// - Jobs stored
// - Jobs updated
// - Jobs skipped
// - Jobs expired
// - Current freshness status
// - Next refresh countdown
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
                refreshState.lastRefreshStartedAt
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

                success:
                    true,

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

            res.status(
                500
            ).json({

                success:
                    false,

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
// Existing routes:
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

        res.status(
            404
        ).json({

            success:
                false,

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

            success:
                false,

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
    `📝 Applications: http://localhost:${PORT}/api/applications`
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