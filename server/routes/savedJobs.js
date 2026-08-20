const express = require("express");

const {
    saveJob,
    removeSavedJob,
    getSavedJob,
    getSavedJobs,
    isJobSaved,
    getSavedJobCount,
} = require("../services/savedJobService");

const router = express.Router();

// ======================================================
// GET USER ID
// ======================================================
//
// Firebase UID is currently forwarded by the frontend
// through the x-user-id request header.
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

function requireUserId(req, res) {
    const userId =
        getUserId(req);

    if (!userId) {
        res.status(401).json({
            success: false,

            message:
                "Authentication required",
        });

        return null;
    }

    return userId;
}

// ======================================================
// GET ALL SAVED JOBS
// GET /api/saved-jobs
// ======================================================

router.get(
    "/",
    (req, res) => {
        try {
            const userId =
                requireUserId(
                    req,
                    res
                );

            if (!userId) {
                return;
            }

            const jobs =
                getSavedJobs(
                    userId
                );

            res.json({
                success: true,

                count:
                    jobs.length,

                jobs,
            });
        } catch (error) {
            console.error(
                "Get Saved Jobs Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to get saved jobs",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// GET SAVED JOB COUNT
// GET /api/saved-jobs/count
// ======================================================

router.get(
    "/count",
    (req, res) => {
        try {
            const userId =
                requireUserId(
                    req,
                    res
                );

            if (!userId) {
                return;
            }

            const count =
                getSavedJobCount(
                    userId
                );

            res.json({
                success: true,

                count,
            });
        } catch (error) {
            console.error(
                "Saved Job Count Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to get saved job count",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// CHECK IF JOB IS SAVED
// GET /api/saved-jobs/:id
// ======================================================

router.get(
    "/:id",
    (req, res) => {
        try {
            const userId =
                requireUserId(
                    req,
                    res
                );

            if (!userId) {
                return;
            }

            const { id } =
                req.params;

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
                getSavedJob(
                    userId,
                    id
                );

            res.json({
                success: true,

                saved:
                    isJobSaved(
                        userId,
                        id
                    ),

                job,
            });
        } catch (error) {
            console.error(
                "Check Saved Job Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to check saved job",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// SAVE JOB
// POST /api/saved-jobs
// ======================================================

router.post(
    "/",
    (req, res) => {
        try {
            const userId =
                requireUserId(
                    req,
                    res
                );

            if (!userId) {
                return;
            }

            const job =
                req.body;

            if (
                !job ||
                typeof job !==
                    "object"
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job data is required",
                    });
            }

            const savedJob =
                saveJob(
                    userId,
                    job
                );

            if (!savedJob) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Unable to save job",
                    });
            }

            res.status(201).json({
                success: true,

                message:
                    "Job saved successfully",

                job:
                    savedJob,
            });
        } catch (error) {
            console.error(
                "Save Job Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to save job",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// REMOVE SAVED JOB
// DELETE /api/saved-jobs/:id
// ======================================================

router.delete(
    "/:id",
    (req, res) => {
        try {
            const userId =
                requireUserId(
                    req,
                    res
                );

            if (!userId) {
                return;
            }

            const { id } =
                req.params;

            if (!id) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job ID is required",
                    });
            }

            const removed =
                removeSavedJob(
                    userId,
                    id
                );

            if (!removed) {
                return res
                    .status(404)
                    .json({
                        success: false,

                        message:
                            "Saved job not found",
                    });
            }

            res.json({
                success: true,

                message:
                    "Job removed from saved jobs",
            });
        } catch (error) {
            console.error(
                "Remove Saved Job Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to remove saved job",

                error:
                    error.message,
            });
        }
    }
);

module.exports = router;