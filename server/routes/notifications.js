
// ======================================================
// CareerOS Notification Routes
// ======================================================

const express = require("express");

const {
    verifyFirebaseToken,
} = require("../middleware/firebaseAuth");

const {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} = require("../services/notificationService");

const router =
    express.Router();

// ======================================================
// FIREBASE AUTHENTICATION
// ======================================================
//
// Client-provided user IDs are NOT accepted.
// ======================================================

router.use(
    verifyFirebaseToken
);

// ======================================================
// NOTIFICATION ID VALIDATION
// ======================================================
//
// Security requirements:
// - ID must exist
// - ID must not be empty
// - Maximum length: 128 characters
// - No whitespace
// - No control characters
//
// ======================================================

function validateNotificationId(
    id
) {
    if (
        id === undefined ||
        id === null
    ) {
        return false;
    }

    const normalizedId =
        String(id).trim();

    if (!normalizedId) {
        return false;
    }

    if (
        normalizedId.length >
        128
    ) {
        return false;
    }

    // Reject whitespace and ASCII control characters
    // without using a control-character regex.
    for (
        const character of normalizedId
    ) {
        if (
            /\s/.test(character)
        ) {
            return false;
        }

        const code =
            character.charCodeAt(0);

        if (
            code <= 31 ||
            code === 127
        ) {
            return false;
        }
    }

    return true;
}

// ======================================================
// AUTOMATIC :ID VALIDATION
// ======================================================
//
// Applies to every notification route using :id.
//
// ======================================================

router.param(
    "id",
    (req, res, next, id) => {
        if (
            !validateNotificationId(
                id
            )
        ) {
            return res
                .status(400)
                .json({
                    success: false,

                    message:
                        "Invalid notification ID.",
                });
        }

        next();
    }
);

// ======================================================
// GET NOTIFICATIONS
// ======================================================

router.get(
    "/",
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

            const notifications =
                await getNotifications(
                    userId,
                    {
                        limit:
                            req.query.limit,
                    }
                );

            return res.json({
                success: true,

                notifications,
            });
        } catch (error) {
            console.error(
                "Get notifications error:",
                error
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to get notifications.",
            });
        }
    }
);

// ======================================================
// GET UNREAD COUNT
// ======================================================

router.get(
    "/unread-count",
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

            const count =
                await getUnreadNotificationCount(
                    userId
                );

            return res.json({
                success: true,

                count,
            });
        } catch (error) {
            console.error(
                "Get unread notification count error:",
                error
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to get unread notification count.",
            });
        }
    }
);

// ======================================================
// MARK ALL AS READ
// ======================================================

router.patch(
    "/read-all",
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

            const updated =
                await markAllNotificationsAsRead(
                    userId
                );

            return res.json({
                success: true,

                updated,
            });
        } catch (error) {
            console.error(
                "Mark all notifications as read error:",
                error
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to mark notifications as read.",
            });
        }
    }
);

// ======================================================
// MARK ONE AS READ
// ======================================================

router.patch(
    "/:id/read",
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

            const updated =
                await markNotificationAsRead(
                    req.params.id,
                    userId
                );

            if (!updated) {
                return res.status(404).json({
                    success: false,

                    message:
                        "Notification not found.",
                });
            }

            return res.json({
                success: true,
            });
        } catch (error) {
            console.error(
                "Mark notification as read error:",
                error
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to mark notification as read.",
            });
        }
    }
);

// ======================================================
// DELETE NOTIFICATION
// ======================================================

router.delete(
    "/:id",
    async (req, res) => {
        try {
            const userId =
                req.user.uid;

            const deleted =
                await deleteNotification(
                    req.params.id,
                    userId
                );

            if (!deleted) {
                return res.status(404).json({
                    success: false,

                    message:
                        "Notification not found.",
                });
            }

            return res.json({
                success: true,
            });
        } catch (error) {
            console.error(
                "Delete notification error:",
                error
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to delete notification.",
            });
        }
    }
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports =
    router;
