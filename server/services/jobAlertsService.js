// ======================================================
// CareerOS Job Alerts Service
// ======================================================


const {
    pool,
} = require("../config/database");


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

    return String(userId).trim();
}


// ======================================================
// NORMALIZE TEXT
// ======================================================

function normalizeText(value = "") {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}


// ======================================================
// NORMALIZE FREQUENCY
// ======================================================

function normalizeFrequency(
    value = "Daily"
) {
    const frequency =
        normalizeText(value);

    if (frequency === "instant") {
        return "Instant";
    }

    if (frequency === "weekly") {
        return "Weekly";
    }

    if (frequency === "daily") {
        return "Daily";
    }

    return "Daily";
}


// ======================================================
// NORMALIZE ALERT INPUT
// ======================================================

function normalizeAlertInput(
    data = {}
) {
    return {
        keyword: String(
            data.keyword ||
            data.search ||
            ""
        ).trim(),

        location: String(
            data.location ||
            "India"
        ).trim(),

        experience: String(
            data.experience ||
            "Any Experience"
        ).trim(),

        jobType: String(
            data.jobType ||
            "Any Type"
        ).trim(),

        workMode: String(
            data.workMode ||
            "Any"
        ).trim(),

        salary: String(
            data.salary ||
            "Any Salary"
        ).trim(),

        frequency:
            normalizeFrequency(
                data.frequency
            ),

        enabled:
            data.enabled !== false,

        active:
            data.active !== false,
    };
}


// ======================================================
// CREATE ALERT ID
// ======================================================

function createAlertId() {
    return `alert_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
}


// ======================================================
// CREATE SEARCH KEY
// ======================================================


function createAlertSearchKey(
    alert
) {
    return [
        normalizeText(
            alert.keyword
        ),

        normalizeText(
            alert.location
        ),

        normalizeText(
            alert.experience
        ),

        normalizeText(
            alert.jobType
        ),

        normalizeText(
            alert.workMode
        ),

        normalizeText(
            alert.salary
        ),
    ].join("|");
}


// ======================================================
// VALIDATE ALERT
// ======================================================

function validateAlert(alert) {
    const errors = [];

    if (!alert.keyword) {
        errors.push(
            "Job keyword is required."
        );
    }

    if (
        alert.keyword &&
        alert.keyword.length > 100
    ) {
        errors.push(
            "Job keyword must be 100 characters or less."
        );
    }

    if (
        alert.location &&
        alert.location.length > 100
    ) {
        errors.push(
            "Location must be 100 characters or less."
        );
    }

    if (
        alert.experience &&
        alert.experience.length > 100
    ) {
        errors.push(
            "Experience must be 100 characters or less."
        );
    }

    if (
        alert.jobType &&
        alert.jobType.length > 100
    ) {
        errors.push(
            "Job type must be 100 characters or less."
        );
    }

    if (
        alert.workMode &&
        alert.workMode.length > 100
    ) {
        errors.push(
            "Work mode must be 100 characters or less."
        );
    }

    if (
        alert.salary &&
        alert.salary.length > 100
    ) {
        errors.push(
            "Salary must be 100 characters or less."
        );
    }

    return errors;
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
        .replace("T", " ");
}


// ======================================================
// PARSE MATCHED JOB IDS
// ======================================================

function parseMatchedJobIds(
    value
) {
    if (Array.isArray(value)) {
        return value.map(
            (id) => String(id)
        );
    }

    if (
        value === null ||
        value === undefined
    ) {
        return [];
    }

    if (
        typeof value === "string"
    ) {
        try {
            const parsed =
                JSON.parse(value);

            if (
                Array.isArray(parsed)
            ) {
                return parsed.map(
                    (id) => String(id)
                );
            }
        } catch {
            return [];
        }
    }

    return [];
}


// ======================================================
// CONVERT DATABASE ROW
// TO APPLICATION ALERT
// ======================================================

function mapAlertRow(row) {
    if (!row) {
        return null;
    }

    return {
        id: row.id,

        userId:
            row.user_id,

        keyword:
            row.keyword,

        location:
            row.location,

        experience:
            row.experience,

        jobType:
            row.job_type,

        workMode:
            row.work_mode,

        salary:
            row.salary,

        frequency:
            row.frequency,

        enabled:
            Boolean(row.enabled),

        active:
            Boolean(row.active),

        searchKey:
            row.search_key,

        createdAt:
            row.created_at,

        updatedAt:
            row.updated_at,

        lastMatchedAt:
            row.last_matched_at,

        matchCount:
            Number(
                row.match_count || 0
            ),

        matchedJobIds:
            parseMatchedJobIds(
                row.matched_job_ids
            ),
    };
}


// ======================================================
// FIND DUPLICATE ALERT
// ======================================================

async function findDuplicateAlert(
    normalized,
    userId,
    excludeId = null
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (!normalizedUserId) {
        return null;
    }

    const searchKey =
        createAlertSearchKey(
            normalized
        );

    let sql = `
        SELECT *
        FROM job_alerts
        WHERE user_id = ?
          AND search_key = ?
    `;

    const params = [
        normalizedUserId,
        searchKey,
    ];

    if (excludeId) {
        sql += `
            AND id <> ?
        `;

        params.push(
            String(excludeId)
        );
    }

    sql += `
        LIMIT 1
    `;

    const [
        rows,
    ] = await pool.execute(
        sql,
        params
    );

    if (!rows.length) {
        return null;
    }

    return mapAlertRow(
        rows[0]
    );
}


// ======================================================
// CREATE JOB ALERT
// ======================================================

async function createJobAlert(
    data = {},
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (!normalizedUserId) {
        throw new Error(
            "User ID is required to create a job alert."
        );
    }

    const normalized =
        normalizeAlertInput(data);

    const errors =
        validateAlert(
            normalized
        );

    if (errors.length > 0) {
        throw new Error(
            errors.join(" ")
        );
    }

    // --------------------------------------------------
    // DUPLICATE CHECK
    // --------------------------------------------------

    const duplicate =
        await findDuplicateAlert(
            normalized,
            normalizedUserId
        );

    if (duplicate) {
        throw new Error(
            "A saved job alert with the same search criteria already exists."
        );
    }

    const id =
        createAlertId();

    const searchKey =
        createAlertSearchKey(
            normalized
        );

    const now =
        toMySQLDateTime();

    try {
        await pool.execute(
            `
            INSERT INTO job_alerts (
                id,
                user_id,
                keyword,
                location,
                experience,
                job_type,
                work_mode,
                salary,
                frequency,
                enabled,
                active,
                search_key,
                created_at,
                updated_at,
                last_matched_at,
                match_count,
                matched_job_ids
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
                NULL,
                0,
                ?
            )
            `,
            [
                id,
                normalizedUserId,
                normalized.keyword,
                normalized.location,
                normalized.experience,
                normalized.jobType,
                normalized.workMode,
                normalized.salary,
                normalized.frequency,
                normalized.enabled ? 1 : 0,
                normalized.active ? 1 : 0,
                searchKey,
                now,
                now,
                JSON.stringify([]),
            ]
        );
    } catch (error) {
        // ------------------------------------------------
        // MYSQL UNIQUE CONSTRAINT
        // ------------------------------------------------

        if (
    error.code ===
    "ER_DUP_ENTRY"
) {
    throw new Error(
        "A saved job alert with the same search criteria already exists.",
        {
            cause: error,
        }
    );
}

        throw error;
    }

    return getJobAlertById(
        id,
        normalizedUserId
    );
}


// ======================================================
// GET ALL JOB ALERTS
// ======================================================

async function getAllJobAlerts(
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (!normalizedUserId) {
        return [];
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT *
        FROM job_alerts
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [
            normalizedUserId,
        ]
    );

    return rows.map(
        mapAlertRow
    );
}


// ======================================================
// GET ACTIVE JOB ALERTS
// ======================================================
//
// IMPORTANT:
//
// If userId is supplied:
//   return that user's active alerts.
//
// If userId is omitted:
//   return ALL active alerts.
//
// The second behavior is required by the
// background job matching system.
//
// ======================================================

async function getActiveJobAlerts(
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    let rows;

    if (normalizedUserId) {
        [
            rows,
        ] = await pool.execute(
            `
            SELECT *
            FROM job_alerts
            WHERE user_id = ?
              AND enabled = 1
              AND active = 1
            ORDER BY created_at DESC
            `,
            [
                normalizedUserId,
            ]
        );
    } else {
        [
            rows,
        ] = await pool.execute(
            `
            SELECT *
            FROM job_alerts
            WHERE enabled = 1
              AND active = 1
            ORDER BY created_at DESC
            `
        );
    }

    return rows.map(
        mapAlertRow
    );
}


// ======================================================
// GET ALERT BY ID
// ======================================================

async function getJobAlertById(
    id,
    userId
) {
    if (!id) {
        return null;
    }

    const normalizedUserId =
        normalizeUserId(userId);

    if (!normalizedUserId) {
        return null;
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT *
        FROM job_alerts
        WHERE id = ?
          AND user_id = ?
        LIMIT 1
        `,
        [
            String(id),
            normalizedUserId,
        ]
    );

    if (!rows.length) {
        return null;
    }

    return mapAlertRow(
        rows[0]
    );
}


// ======================================================
// UPDATE JOB ALERT
// ======================================================

async function updateJobAlert(
    id,
    data = {},
    userId
) {
    const alert =
        await getJobAlertById(
            id,
            userId
        );

    if (!alert) {
        return null;
    }

    const normalized =
        normalizeAlertInput({
            ...alert,
            ...data,
        });

    const errors =
        validateAlert(
            normalized
        );

    if (errors.length > 0) {
        throw new Error(
            errors.join(" ")
        );
    }

    // --------------------------------------------------
    // DUPLICATE CHECK
    // --------------------------------------------------

    const duplicate =
        await findDuplicateAlert(
            normalized,
            alert.userId,
            alert.id
        );

    if (duplicate) {
        throw new Error(
            "Another saved job alert with the same search criteria already exists."
        );
    }

    const searchKey =
        createAlertSearchKey(
            normalized
        );

    const now =
        toMySQLDateTime();

    try {
        await pool.execute(
            `
            UPDATE job_alerts
            SET
                keyword = ?,
                location = ?,
                experience = ?,
                job_type = ?,
                work_mode = ?,
                salary = ?,
                frequency = ?,
                enabled = ?,
                active = ?,
                search_key = ?,
                updated_at = ?
            WHERE id = ?
              AND user_id = ?
            `,
            [
                normalized.keyword,
                normalized.location,
                normalized.experience,
                normalized.jobType,
                normalized.workMode,
                normalized.salary,
                normalized.frequency,
                normalized.enabled ? 1 : 0,
                normalized.active ? 1 : 0,
                searchKey,
                now,
                String(id),
                alert.userId,
            ]
        );
    } catch (error) {
        if (
    error.code ===
    "ER_DUP_ENTRY"
) {
    throw new Error(
        "Another saved job alert with the same search criteria already exists.",
        {
            cause: error,
        }
    );
}

        throw error;
    }

    return getJobAlertById(
        id,
        alert.userId
    );
}


// ======================================================
// DELETE JOB ALERT
// ======================================================

async function deleteJobAlert(
    id,
    userId
) {
    if (!id) {
        return false;
    }

    const normalizedUserId =
        normalizeUserId(userId);

    if (!normalizedUserId) {
        return false;
    }

    const [
        result,
    ] = await pool.execute(
        `
        DELETE FROM job_alerts
        WHERE id = ?
          AND user_id = ?
        `,
        [
            String(id),
            normalizedUserId,
        ]
    );

    return result.affectedRows > 0;
}


// ======================================================
// ENABLE ALERT
// ======================================================

async function enableJobAlert(
    id,
    userId
) {
    return updateJobAlert(
        id,
        {
            enabled: true,
            active: true,
        },
        userId
    );
}


// ======================================================
// DISABLE ALERT
// ======================================================

async function disableJobAlert(
    id,
    userId
) {
    return updateJobAlert(
        id,
        {
            enabled: false,
            active: false,
        },
        userId
    );
}


// ======================================================
// ACTIVATE ALERT
// ======================================================

async function activateJobAlert(
    id,
    userId
) {
    return updateJobAlert(
        id,
        {
            active: true,
            enabled: true,
        },
        userId
    );
}


// ======================================================
// DEACTIVATE ALERT
// ======================================================

async function deactivateJobAlert(
    id,
    userId
) {
    return updateJobAlert(
        id,
        {
            active: false,
            enabled: false,
        },
        userId
    );
}


// ======================================================
// TEXT MATCHING
// ======================================================

function textMatches(
    value,
    searchText
) {
    const valueText =
        normalizeText(value);

    const search =
        normalizeText(
            searchText
        );

    if (!search) {
        return true;
    }

    if (!valueText) {
        return false;
    }

    return valueText.includes(
        search
    );
}


// ======================================================
// COMPANY NORMALIZATION
// ======================================================

function getCompanyName(job) {
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
        job.company.display_name ||
        job.company.name ||
        ""
    );
}


// ======================================================
// LOCATION NORMALIZATION
// ======================================================

function getJobLocation(job) {
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
        job.location.display_name ||
        job.location.name ||
        job.location.area?.join(
            ", "
        ) ||
        ""
    );
}


// ======================================================
// JOB TYPE
// ======================================================

function getJobType(job) {
    return (
        job.detected_job_type ||
        job.job_type ||
        job.jobType ||
        job.contract_type ||
        job.contract_time ||
        job.type ||
        "Any Type"
    );
}


// ======================================================
// WORK MODE
// ======================================================

function getWorkMode(job) {
    return (
        job.detected_work_mode ||
        job.workMode ||
        job.work_mode ||
        "Not Specified"
    );
}


// ======================================================
// EXPERIENCE
// ======================================================

function getExperience(job) {
    return (
        job.detected_experience ||
        job.experience ||
        "Any Experience"
    );
}


// ======================================================
// SALARY
// ======================================================

function getSalaryText(job) {
    if (job?.salary) {
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
        job?.salary_min != null ||
        job?.salary_max != null
    ) {
        return [
            job.salary_min,
            job.salary_max,
        ]
            .filter(
                (value) =>
                    value != null
            )
            .join(" ");
    }

    return "";
}


// ======================================================
// MATCH JOB AGAINST ALERT
// ======================================================

function matchJobToAlert(
    job,
    alert
) {
    if (
        !job ||
        !alert ||
        alert.enabled === false ||
        alert.active === false
    ) {
        return {
            matched: false,
            score: 0,
            reasons: [],
        };
    }

    let score = 0;

    const reasons = [];

    // ==================================================
    // KEYWORD
    // ==================================================

    const keyword =
        normalizeText(
            alert.keyword
        );

    const title =
        normalizeText(
            job.title
        );

    const description =
        normalizeText(
            job.description
        );

    const company =
        normalizeText(
            getCompanyName(job)
        );

    if (keyword) {
        if (
            title.includes(keyword)
        ) {
            score += 50;

            reasons.push(
                "Job title matches alert keyword"
            );
        } else if (
            description.includes(
                keyword
            )
        ) {
            score += 30;

            reasons.push(
                "Job description matches alert keyword"
            );
        } else if (
            company.includes(keyword)
        ) {
            score += 20;

            reasons.push(
                "Company matches alert keyword"
            );
        } else {
            return {
                matched: false,
                score: 0,
                reasons: [],
            };
        }
    }

    // ==================================================
    // LOCATION
    // ==================================================

    if (
        alert.location &&
        alert.location !==
            "Any Location"
    ) {
        const requestedLocation =
            normalizeText(
                alert.location
            );

        if (
            requestedLocation !==
            "india"
        ) {
            if (
                textMatches(
                    getJobLocation(job),
                    requestedLocation
                )
            ) {
                score += 15;

                reasons.push(
                    "Location matches alert"
                );
            } else {
                return {
                    matched: false,
                    score: 0,
                    reasons: [],
                };
            }
        } else {
            score += 5;
        }
    }

    // ==================================================
    // EXPERIENCE
    // ==================================================

    if (
        alert.experience &&
        alert.experience !==
            "Any Experience"
    ) {
        if (
            textMatches(
                getExperience(job),
                alert.experience
            )
        ) {
            score += 10;

            reasons.push(
                "Experience matches alert"
            );
        } else {
            return {
                matched: false,
                score: 0,
                reasons: [],
            };
        }
    }

    // ==================================================
    // JOB TYPE
    // ==================================================

    if (
        alert.jobType &&
        alert.jobType !==
            "Any Type"
    ) {
        if (
            textMatches(
                getJobType(job),
                alert.jobType
            )
        ) {
            score += 10;

            reasons.push(
                "Job type matches alert"
            );
        } else {
            return {
                matched: false,
                score: 0,
                reasons: [],
            };
        }
    }

    // ==================================================
    // WORK MODE
    // ==================================================

    if (
        alert.workMode &&
        alert.workMode !==
            "Any"
    ) {
        if (
            textMatches(
                getWorkMode(job),
                alert.workMode
            )
        ) {
            score += 10;

            reasons.push(
                "Work mode matches alert"
            );
        } else {
            return {
                matched: false,
                score: 0,
                reasons: [],
            };
        }
    }

    // ==================================================
    // SALARY
    // ==================================================

    if (
        alert.salary &&
        alert.salary !==
            "Any Salary"
    ) {
        const salaryText =
            normalizeText(
                getSalaryText(job)
            );

        const requestedSalary =
            normalizeText(
                alert.salary
            );

        if (
            salaryText.includes(
                requestedSalary
            )
        ) {
            score += 5;

            reasons.push(
                "Salary matches alert"
            );
        }
    }

    // ==================================================
    // FINAL MATCH
    // ==================================================

    return {
        matched:
            score >= 50,

        score,

        reasons,
    };
}


// ======================================================
// FIND MATCHING ALERTS
// ======================================================
//
// Checks ALL active alerts.
//
// This is intentionally NOT user-specific because the
// background matching system needs to discover which
// users have matching alerts.
//
// ======================================================

async function findMatchingAlerts(
    job
) {
    if (!job) {
        return [];
    }

    const alerts =
        await getActiveJobAlerts();

    const matches = [];

    for (
        const alert
        of alerts
    ) {
        const result =
            matchJobToAlert(
                job,
                alert
            );

        if (result.matched) {
            matches.push({
                alert,

                score:
                    result.score,

                reasons:
                    result.reasons,
            });
        }
    }

    return matches.sort(
        (a, b) =>
            b.score -
            a.score
    );
}


// ======================================================
// RECORD ALERT MATCH
// ======================================================
//
// Records a job match permanently in MySQL.
//
// matched_job_ids is stored as JSON.
//
// ======================================================

async function recordAlertMatch(
    alertId,
    job = null,
    userId
) {
    const alert =
        await getJobAlertById(
            alertId,
            userId
        );

    if (!alert) {
        return null;
    }

    const jobId =
        job?.id != null
            ? String(job.id)
            : null;

    const matchedJobIds =
        Array.isArray(
            alert.matchedJobIds
        )
            ? alert.matchedJobIds
            : [];

    // --------------------------------------------------
    // DUPLICATE MATCH
    // --------------------------------------------------

    if (
        jobId &&
        matchedJobIds.includes(
            jobId
        )
    ) {
        return {
            ...alert,

            alreadyMatched: true,
        };
    }

    const now =
        toMySQLDateTime();

    const updatedMatchedJobIds =
        jobId
            ? [
                  ...matchedJobIds,
                  jobId,
              ]
            : matchedJobIds;

    await pool.execute(
        `
        UPDATE job_alerts
        SET
            last_matched_at = ?,
            match_count = match_count + 1,
            matched_job_ids = ?,
            updated_at = ?
        WHERE id = ?
          AND user_id = ?
        `,
        [
            now,
            JSON.stringify(
                updatedMatchedJobIds
            ),
            now,
            String(alertId),
            normalizeUserId(
                userId
            ),
        ]
    );

    const updated =
        await getJobAlertById(
            alertId,
            userId
        );

    if (!updated) {
        return null;
    }

    return {
        ...updated,

        alreadyMatched: false,
    };
}


// ======================================================
// GET ALERT COUNT
// ======================================================

async function getJobAlertCount(
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (!normalizedUserId) {
        const [
            rows,
        ] = await pool.execute(
            `
            SELECT COUNT(*) AS count
            FROM job_alerts
            `
        );

        return Number(
            rows[0].count
        );
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT COUNT(*) AS count
        FROM job_alerts
        WHERE user_id = ?
        `,
        [
            normalizedUserId,
        ]
    );

    return Number(
        rows[0].count
    );
}


// ======================================================
// GET ENABLED ALERT COUNT
// ======================================================

async function getEnabledJobAlertCount(
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    let rows;

    if (normalizedUserId) {
        [
            rows,
        ] = await pool.execute(
            `
            SELECT COUNT(*) AS count
            FROM job_alerts
            WHERE user_id = ?
              AND enabled = 1
              AND active = 1
            `,
            [
                normalizedUserId,
            ]
        );
    } else {
        [
            rows,
        ] = await pool.execute(
            `
            SELECT COUNT(*) AS count
            FROM job_alerts
            WHERE enabled = 1
              AND active = 1
            `
        );
    }

    return Number(
        rows[0].count
    );
}


// ======================================================
// GET DISABLED ALERT COUNT
// ======================================================

async function getDisabledJobAlertCount(
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    let rows;

    if (normalizedUserId) {
        [
            rows,
        ] = await pool.execute(
            `
            SELECT COUNT(*) AS count
            FROM job_alerts
            WHERE user_id = ?
              AND (
                  enabled = 0
                  OR active = 0
              )
            `,
            [
                normalizedUserId,
            ]
        );
    } else {
        [
            rows,
        ] = await pool.execute(
            `
            SELECT COUNT(*) AS count
            FROM job_alerts
            WHERE enabled = 0
               OR active = 0
            `
        );
    }

    return Number(
        rows[0].count
    );
}


// ======================================================
// GET ALERT STATISTICS
// ======================================================

async function getJobAlertStats(
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    let rows;

    if (normalizedUserId) {
        [
            rows,
        ] = await pool.execute(
            `
            SELECT
                COUNT(*) AS total,

                SUM(
                    CASE
                        WHEN enabled = 1
                         AND active = 1
                        THEN 1
                        ELSE 0
                    END
                ) AS enabled,

                SUM(
                    CASE
                        WHEN enabled = 0
                          OR active = 0
                        THEN 1
                        ELSE 0
                    END
                ) AS disabled,

                COALESCE(
                    SUM(match_count),
                    0
                ) AS totalMatches

            FROM job_alerts
            WHERE user_id = ?
            `,
            [
                normalizedUserId,
            ]
        );
    } else {
        [
            rows,
        ] = await pool.execute(
            `
            SELECT
                COUNT(*) AS total,

                SUM(
                    CASE
                        WHEN enabled = 1
                         AND active = 1
                        THEN 1
                        ELSE 0
                    END
                ) AS enabled,

                SUM(
                    CASE
                        WHEN enabled = 0
                          OR active = 0
                        THEN 1
                        ELSE 0
                    END
                ) AS disabled,

                COALESCE(
                    SUM(match_count),
                    0
                ) AS totalMatches

            FROM job_alerts
            `
        );
    }

    const stats =
        rows[0];

    return {
        total:
            Number(
                stats.total || 0
            ),

        enabled:
            Number(
                stats.enabled || 0
            ),

        disabled:
            Number(
                stats.disabled || 0
            ),

        totalMatches:
            Number(
                stats.totalMatches || 0
            ),
    };
}


// ======================================================
// CLEAR ALL ALERTS
// ======================================================
//
// Development/testing only.
//
// WARNING:
// This permanently deletes all alerts.
//
// ======================================================

async function clearJobAlerts() {
    await pool.execute(
        `
        DELETE FROM job_alerts
        `
    );

    return true;
}


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
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

    clearJobAlerts,
};