
const express = require("express");

const {
    verifyFirebaseToken,
} = require("../middleware/firebaseAuth");

const {
    getSearchHistory,
    getSearchHistoryCount,
    getSearchHistoryById,
    deleteSearchHistory,
    clearSearchHistory,
} = require("../services/searchHistoryService");

const router =
    express.Router();

// ======================================================
// FIREBASE AUTHENTICATION
// ======================================================

router.use(verifyFirebaseToken);

// ======================================================
// GET SEARCH HISTORY
// GET /api/search-history
// ======================================================

router.get(
    "/",
    async (req, res) => {
        try {
            const uid =
                req.user.uid;

            const history =
                await getSearchHistory(
                    uid
                );

            res.json({
                success: true,

                count:
                    history.length,

                history,
            });
        } catch (error) {
            console.error(
                "Search History Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to load search history",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// GET SEARCH HISTORY COUNT
// GET /api/search-history/count
// ======================================================

router.get(
    "/count",
    async (req, res) => {
        try {
            const uid =
                req.user.uid;

            const count =
                await getSearchHistoryCount(
                    uid
                );

            res.json({
                success: true,

                count,
            });
        } catch (error) {
            console.error(
                "Search History Count Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to get search history count",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// GET SINGLE SEARCH HISTORY ITEM
// GET /api/search-history/:id
// ======================================================

router.get(
    "/:id",
    async (req, res) => {
        try {
            const {
                id,
            } = req.params;

            if (!id) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Search history ID is required",
                    });
            }

            const uid =
                req.user.uid;

            const history =
                await getSearchHistoryById(
                    uid,
                    id
                );

            if (!history) {
                return res
                    .status(404)
                    .json({
                        success: false,

                        message:
                            "Search history entry not found",
                    });
            }

            res.json({
                success: true,

                history,
            });
        } catch (error) {
            console.error(
                "Search History Details Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to get search history entry",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// DELETE SEARCH HISTORY ITEM
// DELETE /api/search-history/:id
// ======================================================

router.delete(
    "/:id",
    async (req, res) => {
        try {
            const {
                id,
            } = req.params;

            if (!id) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Search history ID is required",
                    });
            }

            const uid =
                req.user.uid;

            const deleted =
                await deleteSearchHistory(
                    uid,
                    id
                );

            if (!deleted) {
                return res
                    .status(404)
                    .json({
                        success: false,

                        message:
                            "Search history entry not found",
                    });
            }

            res.json({
                success: true,

                message:
                    "Search history entry deleted",
            });
        } catch (error) {
            console.error(
                "Delete Search History Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to delete search history entry",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// CLEAR SEARCH HISTORY
// DELETE /api/search-history
// ======================================================

router.delete(
    "/",
    async (req, res) => {
        try {
            const uid =
                req.user.uid;

            const removed =
                await clearSearchHistory(
                    uid
                );

            res.json({
                success: true,

                message:
                    "Search history cleared",

                removed,
            });
        } catch (error) {
            console.error(
                "Clear Search History Error:",
                error.message
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to clear search history",

                error:
                    error.message,
            });
        }
    }
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;