// ======================================================
// CareerOS Saved Job Service
// ======================================================
//
// Responsibilities:
// - Save jobs per authenticated user
// - Remove saved jobs per authenticated user
// - Get saved jobs per authenticated user
// - Get one saved job per authenticated user
// - Check whether a job is saved per authenticated user
// - Get saved job count per authenticated user
// - Prevent duplicate saved jobs per user
//
// ======================================================

// ======================================================
// IN-MEMORY STORAGE
// ======================================================
//
// Structure:
//
// userId
//   ↓
// Map of saved jobs
//
// Example:
//
// {
//     "firebase-uid-user-a" => Map(...),
//     "firebase-uid-user-b" => Map(...)
// }
//
// ======================================================

const savedJobsByUser = new Map();

// ======================================================
// GET USER STORAGE
// ======================================================

function getUserSavedJobs(userId) {
    const normalizedUserId =
        String(userId || "").trim();

    if (!normalizedUserId) {
        return null;
    }

    if (
        !savedJobsByUser.has(
            normalizedUserId
        )
    ) {
        savedJobsByUser.set(
            normalizedUserId,
            new Map()
        );
    }

    return savedJobsByUser.get(
        normalizedUserId
    );
}

// ======================================================
// NORMALIZE JOB ID
// ======================================================

function normalizeJobId(jobOrId) {
    if (
        jobOrId === null ||
        jobOrId === undefined
    ) {
        return "";
    }

    // --------------------------------------------------
    // Direct ID
    // --------------------------------------------------

    if (
        typeof jobOrId !== "object"
    ) {
        return String(
            jobOrId
        ).trim();
    }

    // --------------------------------------------------
    // Job object
    // --------------------------------------------------

    const job = jobOrId;

    const id =
        job.id ||
        job.job_id ||
        job.jobId ||
        job.redirect_url ||
        job.redirectUrl;

    if (id) {
        return String(
            id
        ).trim();
    }

    // --------------------------------------------------
    // Fallback ID
    // --------------------------------------------------

    const title =
        job.title || "";

    const company =
        typeof job.company ===
        "string"
            ? job.company
            : job.company
                  ?.display_name ||
              "";

    const location =
        typeof job.location ===
        "string"
            ? job.location
            : job.location
                  ?.display_name ||
              "";

    const fallback =
        [
            title,
            company,
            location,
        ]
            .join("-")
            .trim()
            .toLowerCase()
            .replace(
                /\s+/g,
                "-"
            );

    return fallback;
}

// ======================================================
// CLONE JOB
// ======================================================

function cloneJob(job) {
    if (!job) {
        return null;
    }

    try {
        return JSON.parse(
            JSON.stringify(job)
        );
    } catch (error) {
        console.error(
            "Clone Saved Job Error:",
            error.message
        );

        return {
            ...job,
        };
    }
}

// ======================================================
// SAVE JOB
// ======================================================

function saveJob(
    userId,
    job
) {
    // --------------------------------------------------
    // Validate user
    // --------------------------------------------------

    const userSavedJobs =
        getUserSavedJobs(
            userId
        );

    if (!userSavedJobs) {
        return null;
    }

    // --------------------------------------------------
    // Validate job
    // --------------------------------------------------

    if (
        !job ||
        typeof job !==
            "object"
    ) {
        return null;
    }

    const id =
        normalizeJobId(job);

    if (!id) {
        return null;
    }

    // --------------------------------------------------
    // Check existing job
    // --------------------------------------------------

    const existing =
        userSavedJobs.get(id);

    // --------------------------------------------------
    // Already saved
    // --------------------------------------------------

    if (existing) {
        return existing;
    }

    // --------------------------------------------------
    // Create saved job
    // --------------------------------------------------

    const now =
        new Date().toISOString();

    const savedJob = {
        ...cloneJob(job),

        id,

        savedAt: now,

        updatedAt: now,
    };

    userSavedJobs.set(
        id,
        savedJob
    );

    return savedJob;
}

// ======================================================
// REMOVE SAVED JOB
// ======================================================

function removeSavedJob(
    userId,
    id
) {
    const userSavedJobs =
        getUserSavedJobs(
            userId
        );

    if (!userSavedJobs) {
        return false;
    }

    const normalizedId =
        normalizeJobId(id);

    if (!normalizedId) {
        return false;
    }

    return userSavedJobs.delete(
        normalizedId
    );
}

// ======================================================
// GET ONE SAVED JOB
// ======================================================

function getSavedJob(
    userId,
    id
) {
    const userSavedJobs =
        getUserSavedJobs(
            userId
        );

    if (!userSavedJobs) {
        return null;
    }

    const normalizedId =
        normalizeJobId(id);

    if (!normalizedId) {
        return null;
    }

    return (
        userSavedJobs.get(
            normalizedId
        ) || null
    );
}

// ======================================================
// GET ALL SAVED JOBS
// ======================================================

function getSavedJobs(
    userId
) {
    const userSavedJobs =
        getUserSavedJobs(
            userId
        );

    if (!userSavedJobs) {
        return [];
    }

    return Array.from(
        userSavedJobs.values()
    ).sort(
        (a, b) =>
            new Date(
                b.savedAt || 0
            ) -
            new Date(
                a.savedAt || 0
            )
    );
}

// ======================================================
// CHECK IF JOB IS SAVED
// ======================================================

function isJobSaved(
    userId,
    id
) {
    const userSavedJobs =
        getUserSavedJobs(
            userId
        );

    if (!userSavedJobs) {
        return false;
    }

    const normalizedId =
        normalizeJobId(id);

    if (!normalizedId) {
        return false;
    }

    return userSavedJobs.has(
        normalizedId
    );
}

// ======================================================
// GET SAVED JOB COUNT
// ======================================================

function getSavedJobCount(
    userId
) {
    const userSavedJobs =
        getUserSavedJobs(
            userId
        );

    if (!userSavedJobs) {
        return 0;
    }

    return userSavedJobs.size;
}

// ======================================================
// CLEAR ALL SAVED JOBS
// ======================================================

function clearSavedJobs(
    userId
) {
    const normalizedUserId =
        String(userId || "").trim();

    if (!normalizedUserId) {
        return 0;
    }

    const userSavedJobs =
        savedJobsByUser.get(
            normalizedUserId
        );

    if (!userSavedJobs) {
        return 0;
    }

    const count =
        userSavedJobs.size;

    userSavedJobs.clear();

    return count;
}

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    saveJob,

    removeSavedJob,

    getSavedJob,

    getSavedJobs,

    isJobSaved,

    getSavedJobCount,

    clearSavedJobs,
};