// ======================================================
// CareerOS Job Server
// ======================================================

const dotenv = require("dotenv");
const path = require("path");

// ======================================================
// ENVIRONMENT
// ======================================================

dotenv.config({
    path: path.join(__dirname, ".env"),
});

// ======================================================
// DEPENDENCIES
// ======================================================

const express = require("express");
const cors = require("cors");

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

const notificationRoutes =
    require("./routes/notifications");

// ======================================================
// AI MENTOR ROUTE
// ======================================================

const mentorRoute =
    require("./routes/mentor");

// ======================================================
// JOB SERVICES
// ======================================================

const {
    searchJobs,
    searchAllJobCategories,
} = require("./services/adzunaService");

const {
    storeJobs,
    removeStaleJobs,
    getJobStoreStatus,
} = require("./services/jobService");

// ======================================================
// EXPRESS APP
// ======================================================

const app =
    express();

const PORT =
    Number(process.env.PORT) || 5000;

// ======================================================
// SECURITY SETTINGS
// ======================================================

const JSON_BODY_LIMIT =
    "1mb";

// ======================================================
// CORS SETTINGS
// ======================================================

const configuredOrigins =
    process.env.FRONTEND_URL ||
    "http://localhost:5173,http://localhost:4173";

// ======================================================
// NORMALIZE ORIGIN
// ======================================================

function normalizeOrigin(origin) {
    return String(origin || "")
        .trim()
        .replace(/\/+$/, "")
        .toLowerCase();
}

// ======================================================
// ALLOWED ORIGINS
// ======================================================

const allowedOrigins =
    configuredOrigins
        .split(",")
        .map(normalizeOrigin)
        .filter(Boolean);

// ======================================================
// CORS CONFIGURATION
// ======================================================
//
// IMPORTANT:
//
// Do NOT add:
//     app.options("*", ...)
//
// Express 5 does not accept "*" there.
//
// This single CORS middleware handles:
//
// GET
// POST
// PUT
// PATCH
// DELETE
// OPTIONS
//
// and supports:
//
// Content-Type
// Authorization
// X-User-Id
//
// ======================================================

const corsOptions = {
    origin: (
        requestOrigin,
        callback
    ) => {
        // Requests without an Origin header
        // are allowed (PowerShell, Postman, server-to-server, etc.)
        if (!requestOrigin) {
            return callback(
                null,
                true
            );
        }

        const normalizedRequestOrigin =
            normalizeOrigin(
                requestOrigin
            );

        if (
            allowedOrigins.includes(
                normalizedRequestOrigin
            )
        ) {
            return callback(
                null,
                true
            );
        }

        console.warn(
            `⚠️ CORS blocked origin: ${requestOrigin}`
        );

        return callback(
            new Error(
                "Not allowed by CareerOS CORS policy."
            )
        );
    },

    credentials:
        true,

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
    ],

    optionsSuccessStatus:
        204,
};

// ======================================================
// CORS MIDDLEWARE
// ======================================================

app.use(
    cors(
        corsOptions
    )
);

// ======================================================
// JSON BODY PARSER
// ======================================================

app.use(
    express.json({
        limit:
            JSON_BODY_LIMIT,
    })
);

// ======================================================
// AUTOMATIC REFRESH SETTINGS
// ======================================================

const JOB_REFRESH_INTERVAL =
    6 * 60 * 60 * 1000;

const STALE_JOB_MAX_AGE =
    24 * 60 * 60 * 1000;

// ======================================================
// DEFAULT JOB SEARCHES
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
// CAREEROS PRELOAD SETTINGS
// ======================================================

const CAREEROS_PRELOAD_LOCATION =
    "India";

const CAREEROS_PRELOAD_PAGE =
    1;

const CAREEROS_PRELOAD_EXPERIENCE =
    "Any Experience";

const CAREEROS_PRELOAD_JOB_TYPE =
    "Any Type";

const CAREEROS_PRELOAD_WORK_MODE =
    "Any";

const CAREEROS_PRELOAD_SALARY =
    "Any Salary";

// ======================================================
// PRELOAD STATE
// ======================================================

const preloadState = {
    isPreloading: false,

    lastPreloadStartedAt: null,

    lastPreloadCompletedAt: null,

    lastPreloadFailedAt: null,

    lastPreloadFetchedCount: 0,

    lastPreloadStoredCount: 0,

    lastPreloadUpdatedCount: 0,

    lastPreloadSkippedCount: 0,

    lastPreloadError: null,

    lastPreloadTrigger: null,
};

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

function delay(
    milliseconds
) {
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
// CAREEROS CATEGORY PRELOAD
// ======================================================

async function preloadCareerOSJobs(
    trigger = "unknown"
) {
    if (
        preloadState.isPreloading
    ) {
        return {
            started: false,
            alreadyRunning: true,
        };
    }

    preloadState.isPreloading =
        true;

    preloadState.lastPreloadStartedAt =
        new Date().toISOString();

    preloadState.lastPreloadCompletedAt =
        null;

    preloadState.lastPreloadFailedAt =
        null;

    preloadState.lastPreloadFetchedCount =
        0;

    preloadState.lastPreloadStoredCount =
        0;

    preloadState.lastPreloadUpdatedCount =
        0;

    preloadState.lastPreloadSkippedCount =
        0;

    preloadState.lastPreloadError =
        null;

    preloadState.lastPreloadTrigger =
        trigger;

    try {
        // Remove expired jobs before loading fresh jobs.
        removeStaleJobs(
            STALE_JOB_MAX_AGE
        );

        const data =
            await searchAllJobCategories({
                location:
                    CAREEROS_PRELOAD_LOCATION,

                page:
                    CAREEROS_PRELOAD_PAGE,

                experience:
                    CAREEROS_PRELOAD_EXPERIENCE,

                jobType:
                    CAREEROS_PRELOAD_JOB_TYPE,

                workMode:
                    CAREEROS_PRELOAD_WORK_MODE,

                salary:
                    CAREEROS_PRELOAD_SALARY,
            });

        const jobs =
            Array.isArray(
                data?.results
            )
                ? data.results
                : [];

        preloadState.lastPreloadFetchedCount =
            jobs.length;

        if (
            jobs.length > 0
        ) {
            const storeResult =
                storeJobs(
                    jobs
                );

            preloadState.lastPreloadStoredCount =
                Number(
                    storeResult?.stored ||
                    0
                );

            preloadState.lastPreloadUpdatedCount =
                Number(
                    storeResult?.updated ||
                    0
                );

            preloadState.lastPreloadSkippedCount =
                Number(
                    storeResult?.skipped ||
                    0
                );
        }

        preloadState.lastPreloadCompletedAt =
            new Date().toISOString();

        return {
            started: true,

            completed: true,

            jobsFetched:
                preloadState
                    .lastPreloadFetchedCount,

            jobsStored:
                preloadState
                    .lastPreloadStoredCount,

            jobsUpdated:
                preloadState
                    .lastPreloadUpdatedCount,
        };
    } catch (error) {
        preloadState.lastPreloadFailedAt =
            new Date().toISOString();

        preloadState.lastPreloadError =
            error?.message ||
            "Unknown preload error";

        console.error(
            "❌ CareerOS category preload failed:",
            error
                ?.response
                ?.data ||
                error?.message
        );

        return {
            started: true,

            completed: false,

            error:
                error?.message ||
                "Unknown error",
        };
    } finally {
        preloadState.isPreloading =
            false;
    }
}

// ======================================================
// AUTOMATIC JOB REFRESH
// ======================================================

async function refreshJobs() {
    if (
        refreshState.isRefreshing
    ) {
        return;
    }

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

    try {
        // Remove expired jobs before refresh.
        const removedBeforeRefresh =
            removeStaleJobs(
                STALE_JOB_MAX_AGE
            );

        refreshState.lastRefreshRemovedCount =
            Number(
                removedBeforeRefresh || 0
            );

        let totalFetched = 0;
        let totalStored = 0;
        let totalUpdated = 0;
        let totalSkipped = 0;

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
                console.error(
                    `❌ Failed job search "${query}":`,
                    searchError
                        ?.response
                        ?.data ||
                        searchError?.message
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
    } catch (error) {
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
        refreshState.isRefreshing =
            false;
    }
}

// ======================================================
// HEALTH CHECK
// ======================================================

app.get(
    "/",
    (req, res) => {
        res.status(200).json({
            success: true,

            message:
                "CareerOS Job Server is running 🚀",

            serverTime:
                new Date().toISOString(),

            environment:
                process.env.NODE_ENV ||
                "development",
        });
    }
);

// ======================================================
// CAREEROS PRELOAD API
// ======================================================

app.post(
    "/api/jobs/preload",
    (req, res) => {
        try {
            const storeStatus =
                getJobStoreStatus();

            if (
                preloadState.isPreloading
            ) {
                return res.json({
                    success: true,

                    started: false,

                    alreadyRunning:
                        true,

                    message:
                        "CareerOS job preload is already running.",

                    preload: {
                        isPreloading:
                            true,

                        startedAt:
                            preloadState
                                .lastPreloadStartedAt,
                    },

                    store:
                        storeStatus,
                });
            }

            preloadCareerOSJobs(
                "user-login"
            ).catch(
                (error) => {
                    console.error(
                        "❌ Background CareerOS preload error:",
                        error?.message ||
                            error
                    );
                }
            );

            return res.json({
                success: true,

                started: true,

                background: true,

                message:
                    "CareerOS job preload started in the background.",

                store:
                    storeStatus,
            });
        } catch (error) {
            console.error(
                "❌ CareerOS preload endpoint error:",
                error?.message ||
                    error
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to start CareerOS job preload.",

                    error:
                        error?.message ||
                        "Unknown error",
                });
        }
    }
);

// ======================================================
// PRELOAD STATUS API
// ======================================================

app.get(
    "/api/jobs/preload-status",
    (req, res) => {
        try {
            const storeStatus =
                getJobStoreStatus();

            return res.json({
                success: true,

                preload: {
                    isPreloading:
                        preloadState
                            .isPreloading,

                    lastPreloadStartedAt:
                        preloadState
                            .lastPreloadStartedAt,

                    lastPreloadCompletedAt:
                        preloadState
                            .lastPreloadCompletedAt,

                    lastPreloadFailedAt:
                        preloadState
                            .lastPreloadFailedAt,

                    lastPreloadFetchedCount:
                        preloadState
                            .lastPreloadFetchedCount,

                    lastPreloadStoredCount:
                        preloadState
                            .lastPreloadStoredCount,

                    lastPreloadUpdatedCount:
                        preloadState
                            .lastPreloadUpdatedCount,

                    lastPreloadSkippedCount:
                        preloadState
                            .lastPreloadSkippedCount,

                    lastPreloadError:
                        preloadState
                            .lastPreloadError,

                    lastPreloadTrigger:
                        preloadState
                            .lastPreloadTrigger,
                },

                store:
                    storeStatus,

                serverTime:
                    new Date().toISOString(),
            });
        } catch (error) {
            console.error(
                "Preload Status Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to get preload status",

                    error:
                        error.message,
                });
        }
    }
);

// ======================================================
// REFRESH STATUS
// ======================================================

app.get(
    "/api/jobs/refresh-status",
    (req, res) => {
        try {
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

            const storeStatus =
                getJobStoreStatus();

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

                preload: {
                    isPreloading:
                        preloadState
                            .isPreloading,

                    lastPreloadStartedAt:
                        preloadState
                            .lastPreloadStartedAt,

                    lastPreloadCompletedAt:
                        preloadState
                            .lastPreloadCompletedAt,

                    lastPreloadFailedAt:
                        preloadState
                            .lastPreloadFailedAt,

                    lastPreloadFetchedCount:
                        preloadState
                            .lastPreloadFetchedCount,

                    lastPreloadStoredCount:
                        preloadState
                            .lastPreloadStoredCount,

                    lastPreloadUpdatedCount:
                        preloadState
                            .lastPreloadUpdatedCount,

                    lastPreloadSkippedCount:
                        preloadState
                            .lastPreloadSkippedCount,

                    lastPreloadError:
                        preloadState
                            .lastPreloadError,

                    lastPreloadTrigger:
                        preloadState
                            .lastPreloadTrigger,
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
// MANUAL JOB REFRESH API
// ======================================================

app.post(
    "/api/jobs/refresh",
    (req, res) => {
        try {
            if (
                refreshState.isRefreshing
            ) {
                return res.json({
                    success: true,

                    started: false,

                    alreadyRunning:
                        true,

                    message:
                        "CareerOS job refresh is already running.",
                });
            }

            refreshJobs().catch(
                (error) => {
                    console.error(
                        "❌ Manual job refresh failed:",
                        error?.message ||
                            error
                    );
                }
            );

            return res.json({
                success: true,

                started: true,

                background: true,

                message:
                    "CareerOS job refresh started in the background.",
            });
        } catch (error) {
            console.error(
                "❌ Manual refresh endpoint error:",
                error?.message ||
                    error
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to start job refresh.",

                    error:
                        error?.message ||
                        "Unknown error",
                });
        }
    }
);

// ======================================================
// JOBS API
// ======================================================

app.use(
    "/api/jobs",
    jobsRoute
);

// ======================================================
// SAVED JOBS API
// ======================================================

app.use(
    "/api/saved-jobs",
    savedJobsRoute
);

// ======================================================
// JOB ALERTS API
// ======================================================

app.use(
    "/api/job-alerts",
    jobAlertsRoute
);

// ======================================================
// NOTIFICATIONS API
// ======================================================

app.use(
    "/api/notifications",
    notificationRoutes
);

// ======================================================
// SEARCH HISTORY API
// ======================================================

app.use(
    "/api/search-history",
    searchHistoryRoute
);

// ======================================================
// APPLICATIONS API
// ======================================================

app.use(
    "/api/applications",
    applicationsRoute
);

// ======================================================
// AI MENTOR API
// ======================================================

app.use(
    "/api/ai/mentor",
    mentorRoute
);

// ======================================================
// 404 HANDLER
// ======================================================

app.use(
    (req, res) => {
        res.status(
            404
        ).json({
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

        // --------------------------------------------------
        // CORS ERROR
        // --------------------------------------------------

        if (
            error?.message ===
            "Not allowed by CareerOS CORS policy."
        ) {
            return res
                .status(403)
                .json({
                    success: false,

                    message:
                        "Request origin is not allowed by CareerOS CORS policy.",
                });
        }

        // --------------------------------------------------
        // BODY TOO LARGE
        // --------------------------------------------------

        if (
            error?.type ===
                "entity.too.large" ||
            error?.status ===
                413
        ) {
            return res
                .status(413)
                .json({
                    success: false,

                    message:
                        "Request body is too large. Maximum allowed size is 1 MB.",
                });
        }

        return res
            .status(
                error?.status ||
                500
            )
            .json({
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

const server =
    app.listen(
        PORT,
        () => {
            

            // Initial background refresh.
            refreshJobs().catch(
                (error) => {
                    console.error(
                        "❌ Background initial job refresh failed:",
                        error?.message ||
                            error
                    );
                }
            );

            // Scheduled refresh.
            setInterval(
                () => {
                    refreshJobs().catch(
                        (error) => {
                            console.error(
                                "❌ Scheduled job refresh failed:",
                                error?.message ||
                                    error
                            );
                        }
                    );
                },
                JOB_REFRESH_INTERVAL
            );
        }
    );

// ======================================================
// GRACEFUL SHUTDOWN
// ======================================================

function shutdown(
    signal
) {
    console.log(
        `🛑 ${signal} received. Shutting down CareerOS server...`
    );

    server.close(
        () => {
            

            process.exit(
                0
            );
        }
    );

    setTimeout(
        () => {
            console.error(
                "⚠️ Forced shutdown after timeout."
            );

            process.exit(
                1
            );
        },
        10000
    ).unref();
}

// ======================================================
// PROCESS SIGNALS
// ======================================================

process.on(
    "SIGINT",
    () => {
        shutdown(
            "SIGINT"
        );
    }
);

process.on(
    "SIGTERM",
    () => {
        shutdown(
            "SIGTERM"
        );
    }
);