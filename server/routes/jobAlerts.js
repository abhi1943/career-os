// ======================================================
// CareerOS Job Alerts Routes
// ======================================================

const express = require("express");

const {
    verifyFirebaseToken,
} = require("../middleware/firebaseAuth");

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
// FIREBASE AUTHENTICATION
// ======================================================
//
// Client-provided user IDs are NOT accepted.
// All user ownership comes from req.user.uid.
// ======================================================

router.use(
    verifyFirebaseToken
);

// ======================================================
// JOB ALERT ID VALIDATION
// ======================================================
//
// Validates IDs before they reach service/database
// operations.
//
// Allowed format:
// - Letters
// - Numbers
// - Underscores
// - Hyphens
//
// Maximum length: 128 characters.
//
// This protects all /:id routes consistently.
// ======================================================

function validateJobAlertId(
    req,
    res,
    next
) {
    const id =
        req.params.id;

    if (
        typeof id !== "string"
    ) {
        return res.status(400).json({
            success: false,

            message:
                "Invalid job alert ID.",
        });
    }

    const normalizedId =
        id.trim();

    if (
        !normalizedId
    ) {
        return res.status(400).json({
            success: false,

            message:
                "Job alert ID is required.",
        });
    }

    if (
        normalizedId.length > 128
    ) {
        return res.status(400).json({
            success: false,

            message:
                "Job alert ID is too long.",
        });
    }

    if (
        !/^[A-Za-z0-9_-]+$/.test(
            normalizedId
        )
    ) {
        return res.status(400).json({
            success: false,

            message:
                "Invalid job alert ID format.",
        });
    }

    req.params.id =
        normalizedId;

    next();
}

// ======================================================
// GET ALL JOB ALERTS
// GET /api/job-alerts
// ======================================================

router.get(
    "/",
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

            const alerts =
                await getAllJobAlerts(
                    userId
                );

            return res.json({
                success: true,

                count:
                    alerts.length,

                alerts,
            });
        } catch (error) {
            console.error(
                "Get Job Alerts Error:",
                error.message
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to get job alerts.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// GET ACTIVE JOB ALERTS
// GET /api/job-alerts/active
// ======================================================
//
// IMPORTANT:
// This route must appear before /:id.
// ======================================================

router.get(
    "/active",
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

            const alerts =
                await getActiveJobAlerts(
                    userId
                );

            return res.json({
                success: true,

                count:
                    alerts.length,

                alerts,
            });
        } catch (error) {
            console.error(
                "Get Active Job Alerts Error:",
                error.message
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to get active job alerts.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// GET JOB ALERT STATISTICS
// GET /api/job-alerts/stats
// ======================================================
//
// IMPORTANT:
// This route must appear before /:id.
// ======================================================

router.get(
    "/stats",
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

            const stats =
                await getJobAlertStats(
                    userId
                );

            return res.json({
                success: true,

                stats,
            });
        } catch (error) {
            console.error(
                "Job Alert Stats Error:",
                error.message
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to get job alert statistics.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// GET ALERT COUNTS
// GET /api/job-alerts/counts
// ======================================================

router.get(
    "/counts",
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

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

            return res.json({
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

            return res.status(500).json({
                success: false,

                message:
                    "Failed to get job alert counts.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// CREATE JOB ALERT
// POST /api/job-alerts
// ======================================================

router.post(
    "/",
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

            const alert =
                await createJobAlert(
                    req.body || {},
                    userId
                );

            return res.status(201).json({
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

            return res.status(400).json({
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
// POST /api/job-alerts/match
// ======================================================
//
// The service-level findMatchingAlerts()
// checks all active alerts.
//
// This route filters the result to the
// authenticated user before returning it.
// ======================================================

router.post(
    "/match",
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

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
                        ).trim() ===
                        userId
                );

            return res.json({
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

            return res.status(500).json({
                success: false,

                message:
                    "Failed to match job against alerts.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// RECORD ALERT MATCH
// POST /api/job-alerts/:id/match
// ======================================================

router.post(
    "/:id/match",
    validateJobAlertId,
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

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

            return res.json({
                success: true,

                message:
                    updated.alreadyMatched
                        ? "Alert match was already recorded."
                        : "Alert match recorded successfully.",

                alert:
                    updated,

                alreadyMatched:
                    updated.alreadyMatched ===
                    true,
            });
        } catch (error) {
            console.error(
                "Record Alert Match Error:",
                error.message
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to record alert match.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// TEST ONE ALERT AGAINST A JOB
// POST /api/job-alerts/:id/test
// ======================================================

router.post(
    "/:id/test",
    validateJobAlertId,
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

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

            return res.json({
                success: true,

                alert,

                result,
            });
        } catch (error) {
            console.error(
                "Test Job Alert Error:",
                error.message
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to test job alert.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// GET ONE JOB ALERT
// GET /api/job-alerts/:id
// ======================================================
//
// IMPORTANT:
// This route is below all named routes.
// ======================================================

router.get(
    "/:id",
    validateJobAlertId,
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

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

            return res.json({
                success: true,

                alert,
            });
        } catch (error) {
            console.error(
                "Get Job Alert Error:",
                error.message
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to get job alert.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// UPDATE JOB ALERT
// PUT /api/job-alerts/:id
// ======================================================

router.put(
    "/:id",
    validateJobAlertId,
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

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

            return res.json({
                success: true,

                message:
                    "Job alert updated successfully.",

                alert:
                    updated,
            });
        } catch (error) {
            console.error(
                "Update Job Alert Error:",
                error.message
            );

            return res.status(400).json({
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
// PATCH /api/job-alerts/:id/enable
// ======================================================

router.patch(
    "/:id/enable",
    validateJobAlertId,
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

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

            return res.json({
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

            return res.status(500).json({
                success: false,

                message:
                    "Failed to enable job alert.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// DISABLE JOB ALERT
// PATCH /api/job-alerts/:id/disable
// ======================================================

router.patch(
    "/:id/disable",
    validateJobAlertId,
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

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

            return res.json({
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

            return res.status(500).json({
                success: false,

                message:
                    "Failed to disable job alert.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// ACTIVATE JOB ALERT
// PATCH /api/job-alerts/:id/activate
// ======================================================

router.patch(
    "/:id/activate",
    validateJobAlertId,
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

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

            return res.json({
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

            return res.status(500).json({
                success: false,

                message:
                    "Failed to activate job alert.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// DEACTIVATE JOB ALERT
// PATCH /api/job-alerts/:id/deactivate
// ======================================================

router.patch(
    "/:id/deactivate",
    validateJobAlertId,
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

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

            return res.json({
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

            return res.status(500).json({
                success: false,

                message:
                    "Failed to deactivate job alert.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// DELETE JOB ALERT
// DELETE /api/job-alerts/:id
// ======================================================

router.delete(
    "/:id",
    validateJobAlertId,
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

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

            return res.json({
                success: true,

                message:
                    "Job alert deleted successfully.",

                id:
                    req.params.id,
            });
        } catch (error) {
            console.error(
                "Delete Job Alert Error:",
                error.message
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to delete job alert.",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;