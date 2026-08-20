// ======================================================
// CareerOS Job Alerts Routes
// ======================================================
//
// STEP 19 — SAVED JOB ALERTS
// STEP 19.7A — USER-SPECIFIC JOB ALERTS
// STEP 20.5 — MYSQL ASYNC ROUTES
//
// Base URL:
// /api/job-alerts
//
// Responsibilities:
// - Create saved job alerts
// - Get all saved job alerts for a user
// - Get active alerts for a user
// - Get one alert for a user
// - Update alerts for a user
// - Delete alerts for a user
// - Enable / disable alerts
// - Activate / deactivate alerts
// - Test alert against a job
// - Find alerts matching a job
// - Record alert matches
// - Get alert statistics
//
// IMPORTANT:
// The current CareerOS backend does not yet have a full
// authentication middleware connected to this route.
//
// For now, the user ID is supplied through:
//
//     x-user-id
//
// Example:
//
//     x-user-id: user_123
//
// This keeps userId out of the request body and allows
// the route to be connected to real authentication later.
//
// IMPORTANT — STEP 20:
// Job alert service functions now use MySQL and therefore
// return Promises.
//
// All database/service calls below use async/await.
//
// ======================================================

const express = require("express");

const {
    createJobAlert,
    getAllJobAlerts,
    getActiveJobAlerts,
    getJobAlertById,
    updateJobAlert,
    deleteJobAlert,
    enableJobAlert,
    disableJobAlert,
    activateJobAlert,
    deactivateJobAlert,
    matchJobToAlert,
    findMatchingAlerts,
    recordAlertMatch,
    getJobAlertCount,
    getEnabledJobAlertCount,
    getDisabledJobAlertCount,
    getJobAlertStats,
} = require("../services/jobAlertsService");

// ======================================================
// ROUTER
// ======================================================

const router = express.Router();

// ======================================================
// GET USER ID
// ======================================================
//
// Current temporary user identification.
//
// Later this can be replaced by real authentication
// middleware, for example:
//
// req.user.id
//
// ======================================================

function getUserId(req) {
    return String(
        req.headers["x-user-id"] || ""
    ).trim();
}

// ======================================================
// REQUIRE USER ID
// ======================================================
//
// Returns the userId when available.
//
// Sends 401 response when userId is missing.
//
// ======================================================

function requireUserId(req, res) {
    const userId = getUserId(req);

    if (!userId) {
        res.status(401).json({
            success: false,
            message: "User ID is required.",
        });

        return null;
    }

    return userId;
}

// ======================================================
// GET ALL JOB ALERTS
// ======================================================
//
// GET /api/job-alerts
//
// Header:
//
// x-user-id: user_123
//
// Returns only alerts belonging to that user.
//
// ======================================================

router.get("/", async (req, res) => {
    try {
        const userId =
            requireUserId(req, res);

        if (!userId) {
            return;
        }

        const alerts =
            await getAllJobAlerts(userId);

        res.json({
            success: true,
            count: alerts.length,
            alerts,
        });
    } catch (error) {
        console.error(
            "Get Job Alerts Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to get job alerts.",
            error: error.message,
        });
    }
});

// ======================================================
// GET ACTIVE JOB ALERTS
// ======================================================
//
// GET /api/job-alerts/active
//
// Header:
//
// x-user-id: user_123
//
// Returns only:
//
// enabled === true
// active === true
//
// for the requested user.
//
// IMPORTANT:
// This route must appear before /:id.
//
// ======================================================

router.get(
    "/active",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const alerts =
                await getActiveJobAlerts(
                    userId
                );

            res.json({
                success: true,
                count: alerts.length,
                alerts,
            });
        } catch (error) {
            console.error(
                "Get Active Job Alerts Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to get active job alerts.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// GET JOB ALERT STATISTICS
// ======================================================
//
// GET /api/job-alerts/stats
//
// Header:
//
// x-user-id: user_123
//
// IMPORTANT:
// This route must appear before /:id.
//
// ======================================================

router.get(
    "/stats",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const stats =
                await getJobAlertStats(
                    userId
                );

            res.json({
                success: true,
                stats,
            });
        } catch (error) {
            console.error(
                "Job Alert Stats Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to get job alert statistics.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// GET ALERT COUNTS
// ======================================================
//
// GET /api/job-alerts/counts
//
// Header:
//
// x-user-id: user_123
//
// Returns:
//
// - total
// - enabled
// - disabled
//
// ======================================================

router.get(
    "/counts",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const total =
                await getJobAlertCount(
                    userId
                );

            const enabled =
                await getEnabledJobAlertCount(
                    userId
                );

            const disabled =
                await getDisabledJobAlertCount(
                    userId
                );

            res.json({
                success: true,

                counts: {
                    total,
                    enabled,
                    disabled,
                },
            });
        } catch (error) {
            console.error(
                "Job Alert Counts Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to get job alert counts.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// CREATE JOB ALERT
// ======================================================
//
// POST /api/job-alerts
//
// Header:
//
// x-user-id: user_123
//
// Example body:
//
// {
//     "keyword": "React Developer",
//     "location": "India",
//     "experience": "Fresher / 0 years",
//     "jobType": "Full-time",
//     "workMode": "Remote",
//     "salary": "Any Salary",
//     "frequency": "Daily"
// }
//
// ======================================================

router.post(
    "/",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const alert =
                await createJobAlert(
                    req.body || {},
                    userId
                );

            res.status(201).json({
                success: true,
                message:
                    "Job alert created successfully.",
                alert,
            });
        } catch (error) {
            console.error(
                "Create Job Alert Error:",
                error.message
            );

            res.status(400).json({
                success: false,
                message:
                    error.message ||
                    "Failed to create job alert.",
            });
        }
    }
);

// ======================================================
// MATCH JOB AGAINST USER'S ACTIVE ALERTS
// ======================================================
//
// POST /api/job-alerts/match
//
// Header:
//
// x-user-id: user_123
//
// Example body:
//
// {
//     "id": "12345",
//     "title": "React Developer",
//     "location": "Hyderabad",
//     "description": "React developer required"
// }
//
// IMPORTANT:
// The service-level findMatchingAlerts() checks all active
// alerts because the backend matching system may need
// global matching.
//
// This route filters the result to the requesting user
// before sending the response.
//
// ======================================================

router.post(
    "/match",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const job =
                req.body || {};

            if (
                !job.title &&
                !job.id
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "A valid job is required.",
                });
            }

            const allMatches =
                await findMatchingAlerts(
                    job
                );

            const matches =
                allMatches.filter(
                    (match) =>
                        String(
                            match?.alert?.userId ||
                                ""
                        ).trim() === userId
                );

            res.json({
                success: true,
                matched:
                    matches.length > 0,
                count:
                    matches.length,
                matches,
            });
        } catch (error) {
            console.error(
                "Match Job Alerts Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to match job against alerts.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// RECORD ALERT MATCH
// ======================================================
//
// POST /api/job-alerts/:id/match
//
// Header:
//
// x-user-id: user_123
//
// Used when a job actually matches a saved alert.
//
// ======================================================

router.post(
    "/:id/match",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const alert =
                await getJobAlertById(
                    req.params.id,
                    userId
                );

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Job alert not found.",
                });
            }

            const job =
                req.body || {};

            const updated =
                await recordAlertMatch(
                    req.params.id,
                    job,
                    userId
                );

            if (!updated) {
                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to record alert match.",
                });
            }

            res.json({
                success: true,

                message:
                    updated.alreadyMatched
                        ? "Alert match was already recorded."
                        : "Alert match recorded successfully.",

                alert: updated,

                alreadyMatched:
                    updated.alreadyMatched === true,
            });
        } catch (error) {
            console.error(
                "Record Alert Match Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to record alert match.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// TEST ONE ALERT AGAINST A JOB
// ======================================================
//
// POST /api/job-alerts/:id/test
//
// Header:
//
// x-user-id: user_123
//
// ======================================================

router.post(
    "/:id/test",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const alert =
                await getJobAlertById(
                    req.params.id,
                    userId
                );

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Job alert not found.",
                });
            }

            const job =
                req.body || {};

            if (
                !job.title &&
                !job.id
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "A valid job is required.",
                });
            }

            // matchJobToAlert is synchronous.
            const result =
                matchJobToAlert(
                    job,
                    alert
                );

            res.json({
                success: true,
                alert,
                result,
            });
        } catch (error) {
            console.error(
                "Test Job Alert Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to test job alert.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// GET ONE JOB ALERT
// ======================================================
//
// GET /api/job-alerts/:id
//
// Header:
//
// x-user-id: user_123
//
// IMPORTANT:
// This route is below all named routes such as:
//
// /active
// /stats
// /counts
// /match
//
// ======================================================

router.get(
    "/:id",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const alert =
                await getJobAlertById(
                    req.params.id,
                    userId
                );

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Job alert not found.",
                });
            }

            res.json({
                success: true,
                alert,
            });
        } catch (error) {
            console.error(
                "Get Job Alert Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to get job alert.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// UPDATE JOB ALERT
// ======================================================
//
// PUT /api/job-alerts/:id
//
// Header:
//
// x-user-id: user_123
//
// ======================================================

router.put(
    "/:id",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const existing =
                await getJobAlertById(
                    req.params.id,
                    userId
                );

            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Job alert not found.",
                });
            }

            const updated =
                await updateJobAlert(
                    req.params.id,
                    req.body || {},
                    userId
                );

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Job alert not found.",
                });
            }

            res.json({
                success: true,
                message:
                    "Job alert updated successfully.",
                alert: updated,
            });
        } catch (error) {
            console.error(
                "Update Job Alert Error:",
                error.message
            );

            res.status(400).json({
                success: false,
                message:
                    error.message ||
                    "Failed to update job alert.",
            });
        }
    }
);

// ======================================================
// ENABLE JOB ALERT
// ======================================================
//
// PATCH /api/job-alerts/:id/enable
//
// Header:
//
// x-user-id: user_123
//
// ======================================================

router.patch(
    "/:id/enable",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const alert =
                await enableJobAlert(
                    req.params.id,
                    userId
                );

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Job alert not found.",
                });
            }

            res.json({
                success: true,
                message:
                    "Job alert enabled.",
                alert,
            });
        } catch (error) {
            console.error(
                "Enable Job Alert Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to enable job alert.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// DISABLE JOB ALERT
// ======================================================
//
// PATCH /api/job-alerts/:id/disable
//
// Header:
//
// x-user-id: user_123
//
// ======================================================

router.patch(
    "/:id/disable",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const alert =
                await disableJobAlert(
                    req.params.id,
                    userId
                );

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Job alert not found.",
                });
            }

            res.json({
                success: true,
                message:
                    "Job alert disabled.",
                alert,
            });
        } catch (error) {
            console.error(
                "Disable Job Alert Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to disable job alert.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// ACTIVATE JOB ALERT
// ======================================================
//
// PATCH /api/job-alerts/:id/activate
//
// Header:
//
// x-user-id: user_123
//
// ======================================================

router.patch(
    "/:id/activate",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const alert =
                await activateJobAlert(
                    req.params.id,
                    userId
                );

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Job alert not found.",
                });
            }

            res.json({
                success: true,
                message:
                    "Job alert activated.",
                alert,
            });
        } catch (error) {
            console.error(
                "Activate Job Alert Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to activate job alert.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// DEACTIVATE JOB ALERT
// ======================================================
//
// PATCH /api/job-alerts/:id/deactivate
//
// Header:
//
// x-user-id: user_123
//
// ======================================================

router.patch(
    "/:id/deactivate",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const alert =
                await deactivateJobAlert(
                    req.params.id,
                    userId
                );

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Job alert not found.",
                });
            }

            res.json({
                success: true,
                message:
                    "Job alert deactivated.",
                alert,
            });
        } catch (error) {
            console.error(
                "Deactivate Job Alert Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to deactivate job alert.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// DELETE JOB ALERT
// ======================================================
//
// DELETE /api/job-alerts/:id
//
// Header:
//
// x-user-id: user_123
//
// ======================================================

router.delete(
    "/:id",
    async (req, res) => {
        try {
            const userId =
                requireUserId(req, res);

            if (!userId) {
                return;
            }

            const existing =
                await getJobAlertById(
                    req.params.id,
                    userId
                );

            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Job alert not found.",
                });
            }

            const deleted =
                await deleteJobAlert(
                    req.params.id,
                    userId
                );

            if (!deleted) {
                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to delete job alert.",
                });
            }

            res.json({
                success: true,
                message:
                    "Job alert deleted successfully.",
                id: req.params.id,
            });
        } catch (error) {
            console.error(
                "Delete Job Alert Error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to delete job alert.",
                error: error.message,
            });
        }
    }
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;