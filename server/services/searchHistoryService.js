// ======================================================
// CareerOS Search History Service
// ======================================================

const {
    pool,
} = require("../config/database");

// ======================================================
// CONFIGURATION
// ======================================================

const MAX_SEARCH_HISTORY = 50;

// ======================================================
// NORMALIZE TEXT
// ======================================================

function normalizeText(value) {
    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ");
}

// ======================================================
// NORMALIZE USER ID
// ======================================================

function normalizeUserId(uid) {
    return normalizeText(uid);
}

// ======================================================
// NORMALIZE FILTER VALUE
// ======================================================

function normalizeFilter(
    value,
    defaultValue
) {
    const normalized =
        normalizeText(value);

    return normalized || defaultValue;
}

// ======================================================
// CREATE SEARCH SIGNATURE
// ======================================================

function createSearchSignature({
    query,
    location,
    experience,
    jobType,
    workMode,
    salary,
}) {
    return [
        normalizeText(query).toLowerCase(),

        normalizeText(location).toLowerCase(),

        normalizeText(experience).toLowerCase(),

        normalizeText(jobType).toLowerCase(),

        normalizeText(workMode).toLowerCase(),

        normalizeText(salary).toLowerCase(),
    ].join("|");
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
// CLONE HISTORY ITEM
// ======================================================

function cloneHistoryItem(item) {
    if (!item) {
        return null;
    }

    try {
        return JSON.parse(
            JSON.stringify(item)
        );
    } catch {
        

        return {
            ...item,
        };
    }
}

// ======================================================
// MAP DATABASE ROW
// ======================================================

function mapSearchHistoryRow(row) {
    if (!row) {
        return null;
    }

    return {
        id:
            row.id,

        userId:
            row.user_id,

        query:
            row.query,

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

        resultCount:
            Number(
                row.result_count || 0
            ),

        searchedAt:
            row.searched_at,

        createdAt:
            row.created_at,

        updatedAt:
            row.updated_at,

        searchCount:
            Number(
                row.search_count || 1
            ),

        signature:
            row.signature,
    };
}

// ======================================================
// ADD SEARCH HISTORY
// ======================================================

async function addSearchHistory({
    uid,
    query = "",
    location = "India",
    experience = "Any Experience",
    jobType = "Any Type",
    workMode = "Any",
    salary = "Any Salary",
    resultCount = 0,
} = {}) {


    // --------------------------------------------------
    // USER REQUIRED
    // --------------------------------------------------

    const normalizedUid =
        normalizeUserId(uid);

    if (!normalizedUid) {
        console.warn(
            "CareerOS Search History: uid is required."
        );

        return null;
    }

    // --------------------------------------------------
    // NORMALIZE VALUES
    // --------------------------------------------------

    const normalizedQuery =
        normalizeText(query);

    const normalizedLocation =
        normalizeFilter(
            location,
            "India"
        );

    const normalizedExperience =
        normalizeFilter(
            experience,
            "Any Experience"
        );

    const normalizedJobType =
        normalizeFilter(
            jobType,
            "Any Type"
        );

    const normalizedWorkMode =
        normalizeFilter(
            workMode,
            "Any"
        );

    const normalizedSalary =
        normalizeFilter(
            salary,
            "Any Salary"
        );

    const normalizedResultCount =
        Math.max(
            0,
            Number(resultCount) || 0
        );

    // --------------------------------------------------
    // IGNORE EMPTY SEARCHES
    // --------------------------------------------------

    if (!normalizedQuery) {
        

        return null;
    }

    // --------------------------------------------------
    // CREATE SIGNATURE
    // --------------------------------------------------

    const signature =
        createSearchSignature({
            query:
                normalizedQuery,

            location:
                normalizedLocation,

            experience:
                normalizedExperience,

            jobType:
                normalizedJobType,

            workMode:
                normalizedWorkMode,

            salary:
                normalizedSalary,
        });

    // --------------------------------------------------
    // CURRENT TIME
    // --------------------------------------------------

    const now =
        toMySQLDateTime();

    // --------------------------------------------------
    // CHECK EXISTING SEARCH
    // --------------------------------------------------

    const [
        existingRows,
    ] = await pool.execute(
        `
        SELECT *
        FROM search_history
        WHERE user_id = ?
          AND signature = ?
        LIMIT 1
        `,
        [
            normalizedUid,
            signature,
        ]
    );

    // --------------------------------------------------
    // UPDATE EXISTING SEARCH
    // --------------------------------------------------

    if (existingRows.length > 0) {

        const existing =
            existingRows[0];

        const newSearchCount =
            Number(
                existing.search_count || 0
            ) + 1;

        await pool.execute(
            `
            UPDATE search_history
            SET
                query = ?,
                location = ?,
                experience = ?,
                job_type = ?,
                work_mode = ?,
                salary = ?,
                result_count = ?,
                searched_at = ?,
                updated_at = ?,
                search_count = ?
            WHERE id = ?
              AND user_id = ?
            `,
            [
                normalizedQuery,

                normalizedLocation,

                normalizedExperience,

                normalizedJobType,

                normalizedWorkMode,

                normalizedSalary,

                normalizedResultCount,

                now,

                now,

                newSearchCount,

                existing.id,

                normalizedUid,
            ]
        );

        
        return getSearchHistoryById(
            normalizedUid,
            existing.id
        );
    }

    // --------------------------------------------------
    // CREATE NEW HISTORY ITEM
    // --------------------------------------------------
    //
    // IMPORTANT:
    // id is BIGINT AUTO_INCREMENT.
    // DO NOT generate a string ID here.
    //
    // --------------------------------------------------

    const [
        insertResult,
    ] = await pool.execute(
        `
        INSERT INTO search_history (
            user_id,
            query,
            location,
            experience,
            job_type,
            work_mode,
            salary,
            result_count,
            searched_at,
            created_at,
            updated_at,
            search_count,
            signature
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
            ?
        )
        `,
        [
            normalizedUid,

            normalizedQuery,

            normalizedLocation,

            normalizedExperience,

            normalizedJobType,

            normalizedWorkMode,

            normalizedSalary,

            normalizedResultCount,

            now,

            now,

            now,

            1,

            signature,
        ]
    );

    // --------------------------------------------------
    // MYSQL GENERATED ID
    // --------------------------------------------------

    const insertedId =
        insertResult.insertId;

    

    // --------------------------------------------------
    // LIMIT USER HISTORY TO 50
    // --------------------------------------------------

    const [
        historyRows,
    ] = await pool.execute(
        `
        SELECT id
        FROM search_history
        WHERE user_id = ?
        ORDER BY searched_at DESC, id DESC
        LIMIT 18446744073709551615
        OFFSET ?
        `,
        [
            normalizedUid,

            MAX_SEARCH_HISTORY,
        ]
    );

    if (historyRows.length > 0) {

        const idsToDelete =
            historyRows.map(
                (row) => row.id
            );

        await pool.execute(
            `
            DELETE FROM search_history
            WHERE user_id = ?
              AND id IN (
                  ${idsToDelete
                      .map(() => "?")
                      .join(",")}
              )
            `,
            [
                normalizedUid,

                ...idsToDelete,
            ]
        );
    }

    // --------------------------------------------------
    // RETURN CREATED ITEM
    // --------------------------------------------------

    return getSearchHistoryById(
        normalizedUid,
        insertedId
    );
}

// ======================================================
// GET SEARCH HISTORY
// ======================================================

async function getSearchHistory(uid) {

    const normalizedUid =
        normalizeUserId(uid);

    if (!normalizedUid) {
        return [];
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT
            id,
            user_id,
            query,
            location,
            experience,
            job_type,
            work_mode,
            salary,
            result_count,
            searched_at,
            created_at,
            updated_at,
            search_count,
            signature
        FROM search_history
        WHERE user_id = ?
        ORDER BY searched_at DESC, id DESC
        LIMIT ${MAX_SEARCH_HISTORY}
        `,
        [
            normalizedUid,
        ]
    );

    return rows
        .map(mapSearchHistoryRow)
        .map(cloneHistoryItem);
}

// ======================================================
// GET SEARCH HISTORY COUNT
// ======================================================

async function getSearchHistoryCount(uid) {

    const normalizedUid =
        normalizeUserId(uid);

    if (!normalizedUid) {
        return 0;
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT COUNT(*) AS count
        FROM search_history
        WHERE user_id = ?
        `,
        [
            normalizedUid,
        ]
    );

    return Number(
        rows[0]?.count || 0
    );
}

// ======================================================
// GET ONE SEARCH HISTORY ITEM
// ======================================================

async function getSearchHistoryById(
    uid,
    id
) {

    const normalizedUid =
        normalizeUserId(uid);

    const normalizedId =
        Number(id);

    if (
        !normalizedUid ||
        !Number.isInteger(
            normalizedId
        ) ||
        normalizedId <= 0
    ) {
        return null;
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT
            id,
            user_id,
            query,
            location,
            experience,
            job_type,
            work_mode,
            salary,
            result_count,
            searched_at,
            created_at,
            updated_at,
            search_count,
            signature
        FROM search_history
        WHERE id = ?
          AND user_id = ?
        LIMIT 1
        `,
        [
            normalizedId,

            normalizedUid,
        ]
    );

    if (!rows.length) {
        return null;
    }

    return cloneHistoryItem(
        mapSearchHistoryRow(
            rows[0]
        )
    );
}

// ======================================================
// DELETE SEARCH HISTORY ITEM
// ======================================================

async function deleteSearchHistory(
    uid,
    id
) {

    const normalizedUid =
        normalizeUserId(uid);

    const normalizedId =
        Number(id);

    if (
        !normalizedUid ||
        !Number.isInteger(
            normalizedId
        ) ||
        normalizedId <= 0
    ) {
        return false;
    }

    const [
        result,
    ] = await pool.execute(
        `
        DELETE FROM search_history
        WHERE id = ?
          AND user_id = ?
        `,
        [
            normalizedId,

            normalizedUid,
        ]
    );

    return (
        result.affectedRows > 0
    );
}

// ======================================================
// CLEAR SEARCH HISTORY
// ======================================================

async function clearSearchHistory(uid) {

    const normalizedUid =
        normalizeUserId(uid);

    if (!normalizedUid) {
        return 0;
    }

    const [
        result,
    ] = await pool.execute(
        `
        DELETE FROM search_history
        WHERE user_id = ?
        `,
        [
            normalizedUid,
        ]
    );

    return result.affectedRows;
}

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    addSearchHistory,

    getSearchHistory,

    getSearchHistoryCount,

    getSearchHistoryById,

    deleteSearchHistory,

    clearSearchHistory,
};