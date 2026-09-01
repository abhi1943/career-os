
// ======================================================

const {
    pool,
} = require("../config/database");

// ======================================================
// SECURITY LIMITS
// ======================================================

const MAX_USER_ID_LENGTH =
    128;

const MAX_JOB_ID_LENGTH =
    128;

// ======================================================
// CHECK INVALID ID CHARACTERS
// ======================================================


function hasInvalidIdCharacters(
    value
) {
    if (!value) {
        return false;
    }

    if (/\s/.test(value)) {
        return true;
    }

    for (
        let index = 0;
        index < value.length;
        index += 1
    ) {
        const code =
            value.charCodeAt(
                index
            );

        if (
            code <= 0x1f ||
            code === 0x7f
        ) {
            return true;
        }
    }

    return false;
}

// ======================================================
// NORMALIZE USER ID
// ======================================================

function normalizeUserId(
    userId
) {
    if (
        userId === null ||
        userId === undefined
    ) {
        return "";
    }

    const normalized =
        String(
            userId
        ).trim();

    if (
        !normalized ||
        normalized.length >
            MAX_USER_ID_LENGTH
    ) {
        return "";
    }

    if (
        hasInvalidIdCharacters(
            normalized
        )
    ) {
        return "";
    }

    return normalized;
}

// ======================================================
// VALIDATE NORMALIZED ID
// ======================================================


function isValidNormalizedId(
    value
) {
    if (!value) {
        return false;
    }

    if (
        value.length >
        MAX_JOB_ID_LENGTH
    ) {
        return false;
    }

    if (
        hasInvalidIdCharacters(
            value
        )
    ) {
        return false;
    }

    return true;
}

// ======================================================
// NORMALIZE JOB ID
// ======================================================

function normalizeJobId(
    jobOrId
) {
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
        typeof jobOrId !==
        "object"
    ) {
        const directId =
            String(
                jobOrId
            ).trim();

        return isValidNormalizedId(
            directId
        )
            ? directId
            : "";
    }

    // --------------------------------------------------
    // Job object
    // --------------------------------------------------

    const job =
        jobOrId;

    const id =
        job.id ||
        job.job_id ||
        job.jobId ||
        job.redirect_url ||
        job.redirectUrl;

    if (id) {
        const normalizedId =
            String(
                id
            ).trim();

        if (
            isValidNormalizedId(
                normalizedId
            )
        ) {
            return normalizedId;
        }

        return "";
    }

    // --------------------------------------------------
    // Fallback ID
    // --------------------------------------------------

    const title =
        typeof job.title ===
        "string"
            ? job.title.trim()
            : "";

    const company =
        typeof job.company ===
        "string"
            ? job.company.trim()
            : job.company
                  ?.display_name ||
              job.company
                  ?.name ||
              "";

    const location =
        typeof job.location ===
        "string"
            ? job.location.trim()
            : job.location
                  ?.display_name ||
              job.location
                  ?.name ||
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

    if (
        !isValidNormalizedId(
            fallback
        )
    ) {
        return "";
    }

    return fallback;
}

// ======================================================
// COMPANY NAME
// ======================================================

function getCompanyName(
    job
) {
    if (!job?.company) {
        return "";
    }

    if (
        typeof job.company ===
        "string"
    ) {
        return job.company;
    }

    return (
        job.company
            ?.display_name ||
        job.company
            ?.name ||
        ""
    );
}

// ======================================================
// LOCATION NAME
// ======================================================

function getLocationName(
    job
) {
    if (!job?.location) {
        return "";
    }

    if (
        typeof job.location ===
        "string"
    ) {
        return job.location;
    }

    return (
        job.location
            ?.display_name ||
        job.location
            ?.name ||
        job.location
            ?.area?.join(", ") ||
        ""
    );
}

// ======================================================
// GET SALARY
// ======================================================

function getSalary(
    job
) {
    if (
        job?.salary !==
            undefined &&
        job?.salary !==
            null
    ) {
        return String(
            job.salary
        );
    }

    if (
        job?.detected_salary
    ) {
        return String(
            job.detected_salary
        );
    }

    if (
        job?.salary_min !=
            null ||
        job?.salary_max !=
            null
    ) {
        return [
            job.salary_min,
            job.salary_max,
        ]
            .filter(
                (value) =>
                    value !==
                        null &&
                    value !==
                        undefined
            )
            .join(" - ");
    }

    return "";
}

// ======================================================
// GET JOB TYPE
// ======================================================

function getJobType(
    job
) {
    return String(
        job?.detected_job_type ||
        job?.job_type ||
        job?.jobType ||
        job?.contract_type ||
        job?.contract_time ||
        job?.type ||
        ""
    ).trim();
}

// ======================================================
// GET WORK MODE
// ======================================================

function getWorkMode(
    job
) {
    return String(
        job?.detected_work_mode ||
        job?.workMode ||
        job?.work_mode ||
        ""
    ).trim();
}

// ======================================================
// GET EXPERIENCE
// ======================================================

function getExperience(
    job
) {
    return String(
        job?.detected_experience ||
        job?.experience ||
        ""
    ).trim();
}

// ======================================================
// GET CATEGORY
// ======================================================

function getCategory(
    job
) {
    return String(
        job?.category ||
        job?.job_category ||
        job?.jobCategory ||
        ""
    ).trim();
}

// ======================================================
// GET SKILLS
// ======================================================

function getSkills(
    job
) {
    if (
        Array.isArray(
            job?.skills
        )
    ) {
        return job.skills;
    }

    if (
        typeof job?.skills ===
        "string"
    ) {
        return [
            job.skills,
        ];
    }

    return [];
}

// ======================================================
// CLONE / NORMALIZE JOB DATA
// ======================================================

function cloneJob(
    job
) {
    if (!job) {
        return null;
    }

    try {
        return JSON.parse(
            JSON.stringify(
                job
            )
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
// MAP DATABASE ROW
// TO APPLICATION JOB
// ======================================================

function mapSavedJobRow(
    row
) {
    if (!row) {
        return null;
    }

    let jobData = {};

    if (
        row.job_data
    ) {
        try {
            jobData =
                typeof row.job_data ===
                "string"
                    ? JSON.parse(
                          row.job_data
                      )
                    : row.job_data;
        } catch (error) {
            console.error(
                "Parse saved job_data error:",
                error.message
            );

            jobData = {};
        }
    }

    return {
        ...jobData,

        id:
            String(
                row.job_id
            ),

        title:
            row.title ||
            jobData.title ||
            "",

        company:
            jobData.company ||
            row.company ||
            "",

        location:
            jobData.location ||
            row.location ||
            "",

        description:
            row.description ||
            jobData.description ||
            "",

        redirect_url:
            jobData.redirect_url ||
            jobData.redirectUrl ||
            row.url ||
            "",

        salary:
            jobData.salary ||
            row.salary ||
            "",

        detected_job_type:
            jobData.detected_job_type ||
            row.job_type ||
            "",

        detected_work_mode:
            jobData.detected_work_mode ||
            row.work_mode ||
            "",

        detected_experience:
            jobData.detected_experience ||
            row.experience ||
            "",

        category:
            jobData.category ||
            row.category ||
            "",

        skills:
            jobData.skills ||
            row.skills ||
            [],

        savedAt:
            row.created_at,

        updatedAt:
            row.updated_at,
    };
}

// ======================================================
// SAVE JOB
// ======================================================

async function saveJob(
    userId,
    job
) {
    const normalizedUserId =
        normalizeUserId(
            userId
        );

    if (
        !normalizedUserId
    ) {
        return null;
    }

    if (
        !job ||
        typeof job !==
            "object" ||
        Array.isArray(job)
    ) {
        return null;
    }

    const jobId =
        normalizeJobId(
            job
        );

    if (!jobId) {
        return null;
    }

    const normalizedJob =
        cloneJob(
            job
        );

    if (!normalizedJob) {
        return null;
    }

    const company =
        getCompanyName(
            normalizedJob
        );

    const location =
        getLocationName(
            normalizedJob
        );

    const salary =
        getSalary(
            normalizedJob
        );

    const jobType =
        getJobType(
            normalizedJob
        );

    const workMode =
        getWorkMode(
            normalizedJob
        );

    const experience =
        getExperience(
            normalizedJob
        );

    const category =
        getCategory(
            normalizedJob
        );

    const skills =
        getSkills(
            normalizedJob
        );

    const now =
        new Date();

    // --------------------------------------------------
    // Insert job
    // --------------------------------------------------

    try {
        await pool.execute(
            `
            INSERT INTO saved_jobs (
                user_id,
                job_id,
                title,
                company,
                location,
                description,
                url,
                salary,
                job_type,
                work_mode,
                experience,
                category,
                skills,
                job_data,
                created_at,
                updated_at
            )
            VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )
            `,
            [
                normalizedUserId,

                jobId,

                normalizedJob.title ||
                    "",

                company,

                location,

                normalizedJob.description ||
                    "",

                normalizedJob.redirect_url ||
                    normalizedJob.redirectUrl ||
                    "",

                salary,

                jobType,

                workMode,

                experience,

                category,

                JSON.stringify(
                    skills
                ),

                JSON.stringify(
                    {
                        ...normalizedJob,

                        id:
                            jobId,
                    }
                ),

                now,

                now,
            ]
        );
    } catch (error) {
        // ------------------------------------------------
        // Duplicate saved job
        // ------------------------------------------------

        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {
            return getSavedJob(
                normalizedUserId,
                jobId
            );
        }

        console.error(
            "Save Saved Job DB Error:",
            error.message
        );

        throw error;
    }

    return getSavedJob(
        normalizedUserId,
        jobId
    );
}

// ======================================================
// REMOVE SAVED JOB
// ======================================================

async function removeSavedJob(
    userId,
    id
) {
    const normalizedUserId =
        normalizeUserId(
            userId
        );

    const normalizedId =
        normalizeJobId(
            id
        );

    if (
        !normalizedUserId ||
        !normalizedId
    ) {
        return false;
    }

    const [
        result,
    ] = await pool.execute(
        `
        DELETE FROM saved_jobs
        WHERE user_id = ?
          AND job_id = ?
        `,
        [
            normalizedUserId,
            normalizedId,
        ]
    );

    return (
        result.affectedRows >
        0
    );
}

// ======================================================
// GET ONE SAVED JOB
// ======================================================

async function getSavedJob(
    userId,
    id
) {
    const normalizedUserId =
        normalizeUserId(
            userId
        );

    const normalizedId =
        normalizeJobId(
            id
        );

    if (
        !normalizedUserId ||
        !normalizedId
    ) {
        return null;
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT *
        FROM saved_jobs
        WHERE user_id = ?
          AND job_id = ?
        LIMIT 1
        `,
        [
            normalizedUserId,
            normalizedId,
        ]
    );

    if (!rows.length) {
        return null;
    }

    return mapSavedJobRow(
        rows[0]
    );
}

// ======================================================
// GET ALL SAVED JOBS
// ======================================================

async function getSavedJobs(
    userId
) {
    const normalizedUserId =
        normalizeUserId(
            userId
        );

    if (!normalizedUserId) {
        return [];
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT *
        FROM saved_jobs
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [
            normalizedUserId,
        ]
    );

    return rows
        .map(
            mapSavedJobRow
        )
        .filter(
            Boolean
        );
}

// ======================================================
// CHECK IF JOB IS SAVED
// ======================================================

async function isJobSaved(
    userId,
    id
) {
    const normalizedUserId =
        normalizeUserId(
            userId
        );

    const normalizedId =
        normalizeJobId(
            id
        );

    if (
        !normalizedUserId ||
        !normalizedId
    ) {
        return false;
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT id
        FROM saved_jobs
        WHERE user_id = ?
          AND job_id = ?
        LIMIT 1
        `,
        [
            normalizedUserId,
            normalizedId,
        ]
    );

    return (
        rows.length >
        0
    );
}

// ======================================================
// GET SAVED JOB COUNT
// ======================================================

async function getSavedJobCount(
    userId
) {
    const normalizedUserId =
        normalizeUserId(
            userId
        );

    if (!normalizedUserId) {
        return 0;
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT COUNT(*) AS count
        FROM saved_jobs
        WHERE user_id = ?
        `,
        [
            normalizedUserId,
        ]
    );

    return Number(
        rows[0]?.count || 0
    );
}

// ======================================================
// CLEAR ALL SAVED JOBS
// ======================================================
//
// Development/testing helper.
//
// WARNING:
// Permanently removes all saved jobs for one user.
//
// ======================================================

async function clearSavedJobs(
    userId
) {
    const normalizedUserId =
        normalizeUserId(
            userId
        );

    if (!normalizedUserId) {
        return 0;
    }

    const [
        result,
    ] = await pool.execute(
        `
        DELETE FROM saved_jobs
        WHERE user_id = ?
        `,
        [
            normalizedUserId,
        ]
    );

    return Number(
        result.affectedRows || 0
    );
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

