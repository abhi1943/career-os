// ======================================================
// CareerOS Applications Routes
// ======================================================

const express =
    require("express");

const {
    verifyFirebaseToken,
} = require(
    "../middleware/firebaseAuth"
);

const {
    createApplication,
    getApplications,
    getApplication,
    updateApplicationStatus,
    removeApplication,
    getApplicationCount,
    clearApplications,
    APPLICATION_STATUSES,
} =
    require(
        "../services/applicationService"
    );

const router =
    express.Router();

// ======================================================
// FIREBASE AUTHENTICATION
// ======================================================

//
// ======================================================

router.use(
    verifyFirebaseToken
);

// ======================================================
// GET VERIFIED USER ID
// ======================================================

//
// ======================================================

function getUserId(req) {
    return String(
        req.user?.uid ||
        ""
    ).trim();
}

// ======================================================
// GET ALL APPLICATIONS
// GET /api/applications
// ======================================================

router.get(
    "/",
    async (req, res) => {
        try {
            const userId =
                getUserId(req);

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        success: false,

                        message:
                            "Authenticated user ID is unavailable.",
                    });
            }

            const applications =
                await getApplications(
                    userId
                );

            return res.json({
                success: true,

                count:
                    applications.length,

                applications,
            });

        } catch (error) {
            console.error(
                "Get Applications Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to get applications",

                    error:
                        error.message,
                });
        }
    }
);

// ======================================================
// GET APPLICATION COUNT
// GET /api/applications/count
// ======================================================

router.get(
    "/count",
    async (req, res) => {
        try {
            const userId =
                getUserId(req);

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        success: false,

                        message:
                            "Authenticated user ID is unavailable.",
                    });
            }

            const count =
                await getApplicationCount(
                    userId
                );

            return res.json({
                success: true,

                count,
            });

        } catch (error) {
            console.error(
                "Get Application Count Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to get application count",

                    error:
                        error.message,
                });
        }
    }
);

// ======================================================
// GET APPLICATION STATUS OPTIONS
// GET /api/applications/statuses
// ======================================================

router.get(
    "/statuses",
    (req, res) => {
        return res.json({
            success: true,

            statuses:
                APPLICATION_STATUSES,
        });
    }
);

// ======================================================
// GET ONE APPLICATION
// GET /api/applications/:jobId
// ======================================================

router.get(
    "/:jobId",
    async (req, res) => {
        try {
            const {
                jobId,
            } = req.params;

            const userId =
                getUserId(req);

            if (!jobId) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job ID is required",
                    });
            }

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        success: false,

                        message:
                            "Authenticated user ID is unavailable.",
                    });
            }

            const application =
                await getApplication(
                    jobId,
                    userId
                );

            return res.json({
                success: true,

                applied:
                    Boolean(
                        application
                    ),

                application:
                    application ||
                    null,
            });

        } catch (error) {
            console.error(
                "Get Application Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to get application",

                    error:
                        error.message,
                });
        }
    }
);

// ======================================================
// CREATE APPLICATION
// POST /api/applications
// ======================================================

router.post(
    "/",
    async (req, res) => {
        try {
            const data =
                req.body;

            const userId =
                getUserId(req);

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        success: false,

                        message:
                            "Authenticated user ID is unavailable.",
                    });
            }

            if (
                !data ||
                typeof data !==
                    "object"
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Application data is required",
                    });
            }

            // --------------------------------------------------
            // IGNORE CLIENT-PROVIDED USER ID
            // --------------------------------------------------
            //
            // Even if the client sends:
            //
            // {
            //     userId: "another-user"
            // }
            //
            // the backend uses the verified Firebase UID.
            //
            // --------------------------------------------------

            const application =
                await createApplication(
                    data,
                    userId
                );

            if (!application) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Unable to create application. A valid Job ID is required.",
                    });
            }

            return res
                .status(201)
                .json({
                    success: true,

                    message:
                        "Application created successfully",

                    application,
                });

        } catch (error) {
            console.error(
                "Create Application Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to create application",

                    error:
                        error.message,
                });
        }
    }
);

// ======================================================
// UPDATE APPLICATION STATUS
// PATCH /api/applications/:jobId
// ======================================================

router.patch(
    "/:jobId",
    async (req, res) => {
        try {
            const {
                jobId,
            } = req.params;

            const {
                status,
            } =
                req.body || {};

            const userId =
                getUserId(req);

            if (!jobId) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job ID is required",
                    });
            }

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        success: false,

                        message:
                            "Authenticated user ID is unavailable.",
                    });
            }

            if (!status) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Application status is required",

                        allowedStatuses:
                            APPLICATION_STATUSES,
                    });
            }

            const application =
                await updateApplicationStatus(
                    jobId,
                    status,
                    userId
                );

            if (!application) {
                return res
                    .status(404)
                    .json({
                        success: false,

                        message:
                            "Application not found",
                    });
            }

            return res.json({
                success: true,

                message:
                    "Application status updated successfully",

                application,
            });

        } catch (error) {
            console.error(
                "Update Application Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to update application",

                    error:
                        error.message,
                });
        }
    }
);

// ======================================================
// CLEAR USER APPLICATIONS
// DELETE /api/applications
// ======================================================

router.delete(
    "/",
    async (req, res) => {
        try {
            const userId =
                getUserId(req);

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        success: false,

                        message:
                            "Authenticated user ID is unavailable.",
                    });
            }

            const count =
                await clearApplications(
                    userId
                );

            return res.json({
                success: true,

                message:
                    "Applications cleared successfully",

                count,
            });

        } catch (error) {
            console.error(
                "Clear Applications Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to clear applications",

                    error:
                        error.message,
                });
        }
    }
);

// ======================================================
// DELETE APPLICATION
// DELETE /api/applications/:jobId
// ======================================================

router.delete(
    "/:jobId",
    async (req, res) => {
        try {
            const {
                jobId,
            } = req.params;

            const userId =
                getUserId(req);

            if (!jobId) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job ID is required",
                    });
            }

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        success: false,

                        message:
                            "Authenticated user ID is unavailable.",
                    });
            }

            const removed =
                await removeApplication(
                    jobId,
                    userId
                );

            if (!removed) {
                return res
                    .status(404)
                    .json({
                        success: false,

                        message:
                            "Application not found",
                    });
            }

            return res.json({
                success: true,

                message:
                    "Application removed successfully",
            });

        } catch (error) {
            console.error(
                "Remove Application Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to remove application",

                    error:
                        error.message,
                });
        }
    }
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports =
    router;