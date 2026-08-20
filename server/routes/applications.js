// ======================================================
// CareerOS Applications Routes
// ======================================================
//
// Routes:
//
// GET    /api/applications
// GET    /api/applications/:jobId
// POST   /api/applications
// PATCH  /api/applications/:jobId
// DELETE /api/applications/:jobId
//
// ======================================================

const express =
    require("express");

const {
    createApplication,
    getApplications,
    getApplication,
    isApplicationCreated,
    updateApplicationStatus,
    removeApplication,
    getApplicationCount,
    APPLICATION_STATUSES,
} =
    require(
        "../services/applicationService"
    );

const router =
    express.Router();

// ======================================================
// GET ALL APPLICATIONS
// GET /api/applications
// ======================================================

router.get(
    "/",
    (req, res) => {
        try {
            const applications =
                getApplications();

            res.json({
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

            res.status(500).json({
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
    (req, res) => {
        try {
            res.json({
                success: true,

                count:
                    getApplicationCount(),
            });
        } catch (error) {
            console.error(
                "Get Application Count Error:",
                error.message
            );

            res.status(500).json({
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
        res.json({
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
    (req, res) => {
        try {
            const {
                jobId,
            } = req.params;

            if (!jobId) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job ID is required",
                    });
            }

            const application =
                getApplication(
                    jobId
                );

            // --------------------------------------------------
            // IMPORTANT:
            // A job that has not been applied to is NOT a
            // server error. Return 200 with application null.
            // This prevents the frontend from showing 404
            // errors for every job.
            // --------------------------------------------------

            return res.json({
                success: true,

                applied:
                    isApplicationCreated(
                        jobId
                    ),

                application,
            });
        } catch (error) {
            console.error(
                "Get Application Error:",
                error.message
            );

            return res.status(500).json({
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
    (req, res) => {
        try {
            const data =
                req.body;

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

            const application =
                createApplication(
                    data
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

            res.status(201).json({
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

            res.status(500).json({
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
    (req, res) => {
        try {
            const {
                jobId,
            } = req.params;

            const {
                status,
            } = req.body || {};

            if (!jobId) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job ID is required",
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
                updateApplicationStatus(
                    jobId,
                    status
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

            res.json({
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

            res.status(500).json({
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
// DELETE APPLICATION
// DELETE /api/applications/:jobId
// ======================================================

router.delete(
    "/:jobId",
    (req, res) => {
        try {
            const {
                jobId,
            } = req.params;

            if (!jobId) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job ID is required",
                    });
            }

            const removed =
                removeApplication(
                    jobId
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

            res.json({
                success: true,

                message:
                    "Application removed successfully",
            });
        } catch (error) {
            console.error(
                "Remove Application Error:",
                error.message
            );

            res.status(500).json({
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