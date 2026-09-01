// ======================================================
// CareerOS Notification Service
// ======================================================

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
// CREATE NOTIFICATION ID
// ======================================================

function createNotificationId() {
    return `notification_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
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
// MAP DATABASE ROW
// ======================================================

function mapNotificationRow(row) {
    if (!row) {
        return null;
    }

    return {
        id: row.id,

        userId:
            row.user_id,

        type:
            row.type,

        title:
            row.title,

        message:
            row.message,

        jobId:
            row.job_id,

        alertId:
            row.alert_id,

        isRead:
            Boolean(row.is_read),

        createdAt:
            row.created_at,

        readAt:
            row.read_at,
    };
}

// ======================================================
// CREATE NOTIFICATION
// ======================================================

async function createNotification(
    data = {},
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (!normalizedUserId) {
        throw new Error(
            "User ID is required to create a notification."
        );
    }

    const title =
        String(
            data.title || ""
        ).trim();

    const message =
        String(
            data.message || ""
        ).trim();

    if (!title) {
        throw new Error(
            "Notification title is required."
        );
    }

    if (!message) {
        throw new Error(
            "Notification message is required."
        );
    }

    const id =
        data.id ||
        createNotificationId();

    const now =
        toMySQLDateTime();

    await pool.execute(
        `
        INSERT INTO notifications (
            id,
            user_id,
            type,
            title,
            message,
            job_id,
            alert_id,
            is_read,
            created_at,
            read_at
        )
        VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            0,
            ?,
            NULL
        )
        `,
        [
            id,
            normalizedUserId,

            String(
                data.type ||
                "job_match"
            ),

            title,

            message,

            data.jobId != null
                ? String(data.jobId)
                : null,

            data.alertId != null
                ? String(data.alertId)
                : null,

            now,
        ]
    );

    return getNotificationById(
        id,
        normalizedUserId
    );
}


// ======================================================
// GET NOTIFICATION BY ID
// ======================================================

async function getNotificationById(
    id,
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (
        !id ||
        !normalizedUserId
    ) {
        return null;
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT *
        FROM notifications
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

    return mapNotificationRow(
        rows[0]
    );
}

// ======================================================
// GET USER NOTIFICATIONS
// ======================================================

async function getNotifications(
    userId,
    options = {}
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (!normalizedUserId) {
        return [];
    }

    const limit =
        Math.min(
            Math.max(
                Number(
                    options.limit || 50
                ),
                1
            ),
            100
        );

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT *
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ${limit}
        `,
        [
            normalizedUserId,
        ]
    );

    return rows.map(
        mapNotificationRow
    );
}

// ======================================================
// GET UNREAD COUNT
// ======================================================

async function getUnreadNotificationCount(
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (!normalizedUserId) {
        return 0;
    }

    const [
        rows,
    ] = await pool.execute(
        `
        SELECT COUNT(*) AS count
        FROM notifications
        WHERE user_id = ?
          AND is_read = 0
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
// MARK ONE AS READ
// ======================================================

async function markNotificationAsRead(
    id,
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (
        !id ||
        !normalizedUserId
    ) {
        return false;
    }

    const now =
        toMySQLDateTime();

    const [
        result,
    ] = await pool.execute(
        `
        UPDATE notifications
        SET
            is_read = 1,
            read_at = ?
        WHERE id = ?
          AND user_id = ?
        `,
        [
            now,
            String(id),
            normalizedUserId,
        ]
    );

    return result.affectedRows > 0;
}

// ======================================================
// MARK ALL AS READ
// ======================================================

async function markAllNotificationsAsRead(
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (!normalizedUserId) {
        return 0;
    }

    const now =
        toMySQLDateTime();

    const [
        result,
    ] = await pool.execute(
        `
        UPDATE notifications
        SET
            is_read = 1,
            read_at = ?
        WHERE user_id = ?
          AND is_read = 0
        `,
        [
            now,
            normalizedUserId,
        ]
    );

    return result.affectedRows;
}


// ======================================================
// DELETE NOTIFICATION
// ======================================================

async function deleteNotification(
    id,
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (
        !id ||
        !normalizedUserId
    ) {
        return false;
    }

    const [
        result,
    ] = await pool.execute(
        `
        DELETE FROM notifications
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
// DELETE ALL USER NOTIFICATIONS
// ======================================================

async function clearNotifications(
    userId
) {
    const normalizedUserId =
        normalizeUserId(userId);

    if (!normalizedUserId) {
        return 0;
    }

    const [
        result,
    ] = await pool.execute(
        `
        DELETE FROM notifications
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
    createNotification,

    getNotificationById,

    getNotifications,

    getUnreadNotificationCount,

    markNotificationAsRead,

    markAllNotificationsAsRead,

    deleteNotification,

    clearNotifications,
};