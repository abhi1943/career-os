// ======================================================
// CareerOS Application Service

const {
    pool,
} = require("../config/database");

// ======================================================
// APPLICATION STATUSES
// ======================================================

const APPLICATION_STATUSES = [
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
];

// ======================================================
// NORMALIZE USER ID
// ======================================================

function normalizeUserId(userId) {
    if (
        userId === undefined ||
        userId === null
    ) {
        return "";
    }

    return String(
        userId
    ).trim();
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
        return String(
            jobOrId
        ).trim();
    }

    const job =
        jobOrId;

    // --------------------------------------------------
    // Direct / nested IDs
    // --------------------------------------------------

    const id =
        job.jobId ||
        job.job_id ||
        job.id ||
        job.job?.id ||
        job.job?.jobId ||
        job.job?.job_id ||
        job.redirect_url ||
        job.redirectUrl ||
        job.job?.redirect_url ||
        job.job?.redirectUrl;

    if (id) {
        return String(
            id
        ).trim();
    }

    // --------------------------------------------------
    // Fallback ID
    // --------------------------------------------------

    const source =
        job.job &&
        typeof job.job ===
            "object"
            ? job.job
            : job;

    const title =
        source.title ||
        "";

    const company =
        typeof source.company ===
        "string"
            ? source.company
            : source.company
                ?.display_name ||
              source.company?.name ||
              "";

    const location =
        typeof source.location ===
        "string"
            ? source.location
            : source.location
                ?.display_name ||
              source.location?.name ||
              "";

    const fallbackId =
        [
            title,
            company,
            location,
        ]
            .filter(Boolean)
            .join("-")
            .trim()
            .toLowerCase()
            .replace(
                /\s+/g,
                "-"
            );

    return fallbackId;
}

// ======================================================
// CLONE DATA
// ======================================================

function cloneData(
    data
) {
    if (
        data === null ||
        data === undefined
    ) {
        return null;
    }

    try {
        return JSON.parse(
            JSON.stringify(
                data
            )
        );
    } catch (error) {
        console.error(
            "Clone Application Data Error:",
            error.message
        );

        return {
            ...data,
        };
    }
}

// ======================================================
// NORMALIZE STATUS
// ======================================================

function normalizeStatus(
    status
) {
    if (!status) {
        return "Applied";
    }

    const normalized =
        String(
            status
        ).trim();

    const matchedStatus =
        APPLICATION_STATUSES.find(
            (item) =>
                item.toLowerCase() ===
                normalized.toLowerCase()
        );

    return (
        matchedStatus ||
        "Applied"
    );
}

// ======================================================
// MYSQL DATE FORMAT
// ======================================================

function toMySQLDateTime(
    value = new Date()
) {
    const date =
        value instanceof Date
            ? value
            : new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return null;
    }

    return date
        .toISOString()
        .slice(0, 19)
        .replace(
            "T",
            " "
        );
}

// ======================================================
// MAP DATABASE ROW
// ======================================================

function mapApplicationRow(
    row
) {
    if (!row) {
        return null;
    }

    let job = null;

    if (row.job_data) {
        try {
            job =
                typeof row.job_data ===
                "string"
                    ? JSON.parse(
                        row.job_data
                    )
                    : row.job_data;
        } catch (error) {
            console.error(
                "CareerOS: Failed to parse application job data:",
                error.message
            );

            job = null;
        }
    }

    job =
        job || {};

    job.id =
        job.id ||
        job.jobId ||
        job.job_id ||
        row.job_id;

    return {
        id:
            row.id,

        userId:
            row.user_id,

        jobId:
            row.job_id,

        job,

        status:
            normalizeStatus(
                row.status
            ),

        appliedAt:
            row.applied_at,

        createdAt:
            row.created_at,

        updatedAt:
            row.updated_at,
    };
}

// ======================================================
// CREATE APPLICATION
// ======================================================

async function createApplication(
    data,
    userId
) {
    const normalizedUserId =
        normalizeUserId(
            userId
        );

    if (!normalizedUserId) {
        throw new Error(
            "User ID is required to create an application."
        );
    }

    if (
        !data ||
        typeof data !==
            "object"
    ) {
        return null;
    }

    const jobId =
        normalizeJobId(
            data
        );

    if (!jobId) {
        return null;
    }

    // --------------------------------------------------
    // CHECK EXISTING APPLICATION
    // --------------------------------------------------

    const [
        existingRows,
    ] = await pool.execute(
        `
        SELECT *
        FROM applications
        WHERE user_id = ?
          AND job_id = ?
        LIMIT 1
        `,
        [
            normalizedUserId,
            jobId,
        ]
    );

    if (existingRows.length) {
        return mapApplicationRow(
            existingRows[0]
        );
    }

    // --------------------------------------------------
    // EXTRACT JOB
    // --------------------------------------------------

    const sourceJob =
        data.job &&
        typeof data.job ===
            "object"
            ? data.job
            : data;

    const job =
        cloneData(
            sourceJob
        ) || {};

    job.id =
        job.id ||
        job.jobId ||
        job.job_id ||
        jobId;

    // --------------------------------------------------
    // TIMESTAMPS
    // --------------------------------------------------

    const now =
        toMySQLDateTime();

    const applicationId =
        data.id ||
        `application_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 10)}`;

    const status =
        normalizeStatus(
            data.status
        );

    // --------------------------------------------------
    // INSERT
    // --------------------------------------------------

    await pool.execute(
        `
        INSERT INTO applications (
            id,
            user_id,
            job_id,
            job_data,
            status,
            applied_at,
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
            ?
        )
        `,
        [
            String(
                applicationId
            ),

            normalizedUserId,

            jobId,

            JSON.stringify(
                job
            ),

            status,

            data.appliedAt
                ? toMySQLDateTime(
                    data.appliedAt
                )
                : now,

            now,

            now,
        ]
    );

    return getApplication(
        jobId,
        normalizedUserId
    );
}

// ======================================================
// GET ALL APPLICATIONS
// ======================================================

async function getApplications(
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
        FROM applications
        WHERE user_id = ?
        ORDER BY applied_at DESC
        `,
        [
            normalizedUserId,
        ]
    );

    return rows.map(
        mapApplicationRow
    );
}

// ======================================================
// GET ONE APPLICATION
// ======================================================

async function getApplication(
    jobId,
    userId
) {
    const normalizedUserId =
        normalizeUserId(
            userId
        );

    const normalizedJobId =
        normalizeJobId(
            jobId
        );

    if (
        !normalizedUserId ||
        !normalizedJobId
    ) {
        return null;
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT *
        FROM applications
        WHERE user_id = ?
          AND job_id = ?
        LIMIT 1
        `,
        [
            normalizedUserId,
            normalizedJobId,
        ]
    );

    if (!rows.length) {
        return null;
    }

    return mapApplicationRow(
        rows[0]
    );
}

// ======================================================
// CHECK APPLICATION
// ======================================================

async function isApplicationCreated(
    jobId,
    userId
) {
    const application =
        await getApplication(
            jobId,
            userId
        );

    return Boolean(
        application
    );
}

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

async function updateApplicationStatus(
    jobId,
    status,
    userId
) {
    const normalizedUserId =
        normalizeUserId(
            userId
        );

    const normalizedJobId =
        normalizeJobId(
            jobId
        );

    if (
        !normalizedUserId ||
        !normalizedJobId
    ) {
        return null;
    }

    const normalizedStatus =
        normalizeStatus(
            status
        );

    const now =
        toMySQLDateTime();

    const [
        result,
    ] = await pool.execute(
        `
        UPDATE applications
        SET
            status = ?,
            updated_at = ?
        WHERE user_id = ?
          AND job_id = ?
        `,
        [
            normalizedStatus,

            now,

            normalizedUserId,

            normalizedJobId,
        ]
    );

    if (
        result.affectedRows ===
        0
    ) {
        return null;
    }

    return getApplication(
        normalizedJobId,
        normalizedUserId
    );
}

// ======================================================
// REMOVE APPLICATION
// ======================================================

async function removeApplication(
    jobId,
    userId
) {
    const normalizedUserId =
        normalizeUserId(
            userId
        );

    const normalizedJobId =
        normalizeJobId(
            jobId
        );

    if (
        !normalizedUserId ||
        !normalizedJobId
    ) {
        return false;
    }

    const [
        result,
    ] = await pool.execute(
        `
        DELETE FROM applications
        WHERE user_id = ?
          AND job_id = ?
        `,
        [
            normalizedUserId,
            normalizedJobId,
        ]
    );

    return (
        result.affectedRows >
        0
    );
}

// ======================================================
// GET APPLICATION COUNT
// ======================================================

async function getApplicationCount(
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
        FROM applications
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
// CLEAR APPLICATIONS
// ======================================================

async function clearApplications(
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
        DELETE FROM applications
        WHERE user_id = ?
        `,
        [
            normalizedUserId,
        ]
    );

    return result.affectedRows;
}

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createApplication,

    getApplications,

    getApplication,

    isApplicationCreated,

    updateApplicationStatus,

    removeApplication,

    getApplicationCount,

    clearApplications,

    APPLICATION_STATUSES,
};