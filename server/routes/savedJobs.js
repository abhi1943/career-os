
// ======================================================
// CareerOS Saved Jobs Routes
// ======================================================

const express = require("express");

const {
    verifyFirebaseToken,
} = require("../middleware/firebaseAuth");

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
// SECURITY LIMITS
// ======================================================

const MAX_JOB_ID_LENGTH = 128;
const MAX_JOB_TITLE_LENGTH = 500;
const MAX_JOB_DESCRIPTION_LENGTH = 100000;
const MAX_STRING_FIELD_LENGTH = 2000;
const MAX_ARRAY_ITEMS = 100;

// ======================================================
// FIREBASE AUTHENTICATION
// ======================================================

router.use(
    verifyFirebaseToken
);

// ======================================================
// JOB ID VALIDATION
// ======================================================

function validateSavedJobId(
    req,
    res,
    next
) {
    const id =
        req.params.id;

    if (
        typeof id !==
        "string"
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid job ID.",
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
                "Job ID is required.",
        });
    }

    if (
        normalizedId.length >
        MAX_JOB_ID_LENGTH
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Job ID is too long.",
        });
    }

    if (
        !/^[A-Za-z0-9_.:/-]+$/.test(
            normalizedId
        )
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid job ID format.",
        });
    }

    req.params.id =
        normalizedId;

    next();
}

// ======================================================
// ALLOWED JOB FIELDS
// ======================================================
//
// Jobs returned by the CareerOS Job Store may contain
// internal metadata.
//
// These fields are accepted because the complete original
// job object is preserved inside savedJobService.job_data.
//
// ======================================================

const ALLOWED_JOB_FIELDS =
    new Set([
        // ------------------------------------------------
        // Core job information
        // ------------------------------------------------

        "id",
        "job_id",
        "jobId",

        "title",
        "description",

        "url",
        "redirect_url",
        "redirectUrl",

        // ------------------------------------------------
        // Company
        // ------------------------------------------------

        "company",

        // ------------------------------------------------
        // Location
        // ------------------------------------------------

        "location",

        // ------------------------------------------------
        // Salary
        // ------------------------------------------------

        "salary",
        "salary_min",
        "salary_max",
        "detected_salary",

        // ------------------------------------------------
        // Job type
        // ------------------------------------------------

        "job_type",
        "jobType",
        "detected_job_type",
        "contract_type",
        "contract_time",
        "type",

        // ------------------------------------------------
        // Work mode
        // ------------------------------------------------

        "workMode",
        "work_mode",
        "detected_work_mode",

        // ------------------------------------------------
        // Experience
        // ------------------------------------------------

        "experience",
        "detected_experience",
        "experienceLevel",
        "experience_level",

        // ------------------------------------------------
        // Category
        // ------------------------------------------------

        "category",
        "job_category",
        "jobCategory",

        "careerOSCategory",
        "careerosCategory",

        // ------------------------------------------------
        // Skills
        // ------------------------------------------------

        "skills",
        "tags",
        "technologies",
        "requirements",
        "responsibilities",
        "benefits",

        // ------------------------------------------------
        // Education / organization
        // ------------------------------------------------

        "education",
        "department",
        "industry",
        "seniority",

        // ------------------------------------------------
        // Employment
        // ------------------------------------------------

        "employmentType",
        "employment_type",

        // ------------------------------------------------
        // Adzuna fields
        // ------------------------------------------------

        "created",
        "created_at",

        "company_id",
        "category_id",
        "category_label",

        "latitude",
        "longitude",

        "location_area",
        "location_display_name",
        "location_country",
        "location_region",
        "location_city",
        "location_area_name",

        "salary_is_predicted",

        "adref",

        "source",
        "publisher",

        "redirect",
        "snippet",

        // ------------------------------------------------
        // Provider metadata
        // ------------------------------------------------

        "provider",
        "provider_id",
        "source_id",

        // ------------------------------------------------
        // Search metadata
        // ------------------------------------------------

        "search_query",
        "searchQuery",

        "search_location",
        "searchLocation",

        // ------------------------------------------------
        // Existing saved-job metadata
        // ------------------------------------------------

        "savedAt",
        "updatedAt",

        // ------------------------------------------------
        // CareerOS Job Store metadata
        // ------------------------------------------------

        "__CLASS__",

        "searchText",

        "firstSeenAt",
        "lastUpdatedAt",

        "storedAt",
        "expiresAt",

        "careeros_search_query",
        "careeros_search_page",

        "match",
    ]);

// ======================================================
// VALIDATE JOB OBJECT
// ======================================================

function validateJobBody(
    job
) {
    if (
        !job ||
        typeof job !==
            "object" ||
        Array.isArray(job)
    ) {
        return {
            valid: false,
            message:
                "Job data is required.",
        };
    }

    const fields =
        Object.keys(job);

    // --------------------------------------------------
    // Reject unexpected fields
    // --------------------------------------------------

    const unexpectedFields =
        fields.filter(
            (field) =>
                !ALLOWED_JOB_FIELDS.has(
                    field
                )
        );

    if (
        unexpectedFields.length >
        0
    ) {
        return {
            valid: false,
            message:
                `Unexpected job field(s): ${unexpectedFields.join(
                    ", "
                )}`,
        };
    }

    // --------------------------------------------------
    // Job ID
    // --------------------------------------------------

    const possibleId =
        job.id ||
        job.job_id ||
        job.jobId ||
        job.redirect_url ||
        job.redirectUrl;

    if (
        possibleId !==
            undefined &&
        possibleId !==
            null
    ) {
        const id =
            String(
                possibleId
            ).trim();

        if (
            id &&
            (
                id.length >
                    MAX_JOB_ID_LENGTH ||
                !/^[A-Za-z0-9_.:/-]+$/.test(
                    id
                )
            )
        ) {
            return {
                valid: false,
                message:
                    "Invalid job ID.",
            };
        }
    }

    // --------------------------------------------------
    // Title
    // --------------------------------------------------

    if (
        job.title !==
            undefined &&
        job.title !==
            null
    ) {
        if (
            typeof job.title !==
            "string"
        ) {
            return {
                valid: false,
                message:
                    "Job title must be a string.",
            };
        }

        if (
            job.title.length >
            MAX_JOB_TITLE_LENGTH
        ) {
            return {
                valid: false,
                message:
                    "Job title is too long.",
            };
        }
    }

    // --------------------------------------------------
    // Description
    // --------------------------------------------------

    if (
        job.description !==
            undefined &&
        job.description !==
            null
    ) {
        if (
            typeof job.description !==
            "string"
        ) {
            return {
                valid: false,
                message:
                    "Job description must be a string.",
            };
        }

        if (
            job.description.length >
            MAX_JOB_DESCRIPTION_LENGTH
        ) {
            return {
                valid: false,
                message:
                    "Job description is too long.",
            };
        }
    }

    // --------------------------------------------------
    // String fields
    // --------------------------------------------------
    //
    // IMPORTANT:
    // "category" is intentionally NOT here.
    //
    // CareerOS category may be either:
    //
    // category: "IT"
    //
    // or:
    //
    // category: {
    //     label: "IT"
    // }
    //
    // --------------------------------------------------

    const stringFields = [
        "url",
        "redirect_url",
        "redirectUrl",

        "salary",

        "job_type",
        "jobType",
        "detected_job_type",

        "contract_type",
        "contract_time",
        "type",

        "workMode",
        "work_mode",
        "detected_work_mode",

        "experience",
        "detected_experience",

        "job_category",
        "jobCategory",

        "careerOSCategory",
        "careerosCategory",

        "experienceLevel",
        "experience_level",

        "employmentType",
        "employment_type",

        "created",
        "created_at",

        "source",
        "publisher",

        "snippet",

        "adref",

        "provider",
        "provider_id",

        "source_id",

        "search_query",
        "searchQuery",

        "search_location",
        "searchLocation",

        "department",
        "industry",
        "seniority",

        "education",

        // ------------------------------------------------
        // CareerOS Job Store metadata
        // ------------------------------------------------

        "searchText",

        "firstSeenAt",
        "lastUpdatedAt",

        "storedAt",
        "expiresAt",

        "careeros_search_query",

        "careeros_search_page",
    ];

    for (
        const field of stringFields
    ) {
        if (
            job[field] ===
                undefined ||
            job[field] ===
                null
        ) {
            continue;
        }

        if (
            typeof job[field] !==
            "string"
        ) {
            return {
                valid: false,
                message:
                    `${field} must be a string.`,
            };
        }

        if (
            job[field].length >
            MAX_STRING_FIELD_LENGTH
        ) {
            return {
                valid: false,
                message:
                    `${field} is too long.`,
            };
        }
    }

    // --------------------------------------------------
    // CareerOS internal CLASS metadata
    // --------------------------------------------------

    if (
        job.__CLASS__ !==
            undefined &&
        job.__CLASS__ !==
            null
    ) {
        if (
            typeof job.__CLASS__ !==
            "string"
        ) {
            return {
                valid: false,
                message:
                    "__CLASS__ must be a string.",
            };
        }

        if (
            job.__CLASS__.length >
            MAX_STRING_FIELD_LENGTH
        ) {
            return {
                valid: false,
                message:
                    "__CLASS__ is too long.",
            };
        }
    }

    // --------------------------------------------------
    // CareerOS match metadata
    // --------------------------------------------------

    if (
        job.match !==
            undefined &&
        job.match !==
            null
    ) {
        const matchType =
            typeof job.match;

        if (
            ![
                "boolean",
                "string",
                "number",
                "object",
            ].includes(
                matchType
            )
        ) {
            return {
                valid: false,
                message:
                    "match contains an invalid value.",
            };
        }

        if (
            Array.isArray(
                job.match
            )
        ) {
            if (
                job.match.length >
                MAX_ARRAY_ITEMS
            ) {
                return {
                    valid: false,
                    message:
                        "match contains too many items.",
                };
            }
        }
    }

    // --------------------------------------------------
    // Category
    // --------------------------------------------------
    //
    // CareerOS supports both:
    //
    // category: "IT"
    //
    // and:
    //
    // category: {
    //     label: "IT"
    // }
    //
    // --------------------------------------------------

    if (
        job.category !==
            undefined &&
        job.category !==
            null
    ) {
        const validCategory =
            typeof job.category ===
                "string" ||
            (
                typeof job.category ===
                    "object" &&
                !Array.isArray(
                    job.category
                )
            );

        if (
            !validCategory
        ) {
            return {
                valid: false,
                message:
                    "Category must be a string or object.",
            };
        }

        if (
            typeof job.category ===
            "string"
        ) {
            if (
                job.category.length >
                MAX_STRING_FIELD_LENGTH
            ) {
                return {
                    valid: false,
                    message:
                        "category is too long.",
                };
            }
        }
    }

    // --------------------------------------------------
    // Array fields
    // --------------------------------------------------

    const arrayFields = [
        "skills",
        "tags",
        "technologies",
        "requirements",
        "responsibilities",
        "benefits",
    ];

    for (
        const field of arrayFields
    ) {
        if (
            job[field] ===
                undefined ||
            job[field] ===
                null
        ) {
            continue;
        }

        if (
            !Array.isArray(
                job[field]
            )
        ) {
            return {
                valid: false,
                message:
                    `${field} must be an array.`,
            };
        }

        if (
            job[field].length >
            MAX_ARRAY_ITEMS
        ) {
            return {
                valid: false,
                message:
                    `${field} contains too many items.`,
            };
        }
    }

    // --------------------------------------------------
    // Company
    // --------------------------------------------------

    if (
        job.company !==
            undefined &&
        job.company !==
            null
    ) {
        const validCompany =
            typeof job.company ===
                "string" ||
            (
                typeof job.company ===
                    "object" &&
                !Array.isArray(
                    job.company
                )
            );

        if (
            !validCompany
        ) {
            return {
                valid: false,
                message:
                    "Company must be a string or object.",
            };
        }
    }

    // --------------------------------------------------
    // Location
    // --------------------------------------------------

    if (
        job.location !==
            undefined &&
        job.location !==
            null
    ) {
        const validLocation =
            typeof job.location ===
                "string" ||
            (
                typeof job.location ===
                    "object" &&
                !Array.isArray(
                    job.location
                )
            );

        if (
            !validLocation
        ) {
            return {
                valid: false,
                message:
                    "Location must be a string or object.",
            };
        }
    }

    // --------------------------------------------------
    // Numeric fields
    // --------------------------------------------------

    const numericFields = [
        "salary_min",
        "salary_max",
        "latitude",
        "longitude",
    ];

    for (
        const field of numericFields
    ) {
        if (
            job[field] ===
                undefined ||
            job[field] ===
                null
        ) {
            continue;
        }

        if (
            typeof job[field] !==
                "number" &&
            typeof job[field] !==
                "string"
        ) {
            return {
                valid: false,
                message:
                    `${field} must be a number.`,
            };
        }
    }

    return {
        valid: true,
    };
}

// ======================================================
// GET ALL SAVED JOBS
// GET /api/saved-jobs
// ======================================================

router.get(
    "/",
    async (
        req,
        res
    ) => {
        try {
            const userId =
                req.user.uid;

            const jobs =
                await getSavedJobs(
                    userId
                );

            return res.json({
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

            return res.status(500).json({
                success: false,
                message:
                    "Failed to get saved jobs.",
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
    async (
        req,
        res
    ) => {
        try {
            const userId =
                req.user.uid;

            const count =
                await getSavedJobCount(
                    userId
                );

            return res.json({
                success: true,
                count,
            });
        } catch (error) {
            console.error(
                "Saved Job Count Error:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to get saved job count.",
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
    async (
        req,
        res
    ) => {
        try {
            // ------------------------------------------------
            // Authenticated UID ONLY
            // ------------------------------------------------

            const userId =
                req.user.uid;

            // ------------------------------------------------
            // Validate job
            // ------------------------------------------------

            const validation =
                validateJobBody(
                    req.body
                );

            if (
                !validation.valid
            ) {
                console.error(
                    "❌ Saved Job Validation Failed:",
                    validation.message
                );

                return res.status(400).json({
                    success: false,
                    message:
                        validation.message,
                });
            }

            const job =
                req.body;

            // ------------------------------------------------
            // Save
            // ------------------------------------------------

            const savedJob =
                await saveJob(
                    userId,
                    job
                );

            if (!savedJob) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Unable to save job. The job must contain a valid job ID or enough information to generate one.",
                });
            }

            return res.status(201).json({
                success: true,
                message:
                    "Job saved successfully.",
                job:
                    savedJob,
            });
        } catch (error) {
            console.error(
                "Save Job Error:",
                error.message
            );

            // ------------------------------------------------
            // Duplicate entry
            // ------------------------------------------------

            if (
                error?.code ===
                "ER_DUP_ENTRY"
            ) {
                return res.status(409).json({
                    success: false,
                    message:
                        "This job is already saved.",
                });
            }

            return res.status(500).json({
                success: false,
                message:
                    "Failed to save job.",
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
    validateSavedJobId,
    async (
        req,
        res
    ) => {
        try {
            const userId =
                req.user.uid;

            const id =
                req.params.id;

            const job =
                await getSavedJob(
                    userId,
                    id
                );

            const saved =
                await isJobSaved(
                    userId,
                    id
                );

            return res.json({
                success: true,
                saved:
                    Boolean(
                        saved
                    ),
                job:
                    job ||
                    null,
            });
        } catch (error) {
            console.error(
                "Check Saved Job Error:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to check saved job.",
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
    validateSavedJobId,
    async (
        req,
        res
    ) => {
        try {
            const userId =
                req.user.uid;

            const id =
                req.params.id;

            const removed =
                await removeSavedJob(
                    userId,
                    id
                );

            if (
                !removed
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Saved job not found.",
                });
            }

            return res.json({
                success: true,
                message:
                    "Job removed from saved jobs.",
            });
        } catch (error) {
            console.error(
                "Remove Saved Job Error:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to remove saved job.",
            });
        }
    }
);

// ======================================================
// EXPORT
// ======================================================

module.exports =
    router;

