const express = require("express");

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
// GET SEARCH HISTORY
// GET /api/search-history
// ======================================================

router.get(
    "/",
    (req, res) => {
        try {
            const history =
                getSearchHistory();

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
    (req, res) => {
        try {
            const count =
                getSearchHistoryCount();

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
    (req, res) => {
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

            const history =
                getSearchHistoryById(
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
    (req, res) => {
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

            const deleted =
                deleteSearchHistory(
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
    (req, res) => {
        try {
            const removed =
                clearSearchHistory();

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

module.exports = router;