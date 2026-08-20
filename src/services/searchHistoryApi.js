// ======================================================
// CareerOS Search History API
// ======================================================
//
// Frontend API service for CareerOS search history.
//
// Backend route:
// career path/career-os/server/routes/searchHistory.js
//
// Backend base endpoint:
// /api/search-history
//
// ======================================================

import api from "./api";

// ======================================================
// GET SEARCH HISTORY
// ======================================================
//
// Backend:
// GET /api/search-history
//
// Response:
// {
//   success: true,
//   count: 5,
//   history: [...]
// }
//
// ======================================================

export async function getSearchHistory() {
  try {
    const response = await api.get(
      "/search-history"
    );

    return (
      response?.data?.history ||
      []
    );
  } catch (error) {
    console.error(
      "CareerOS Search History Error:",
      error
    );

    throw error;
  }
}

// ======================================================
// GET SEARCH HISTORY COUNT
// ======================================================
//
// Backend:
// GET /api/search-history/count
//
// ======================================================

export async function getSearchHistoryCount() {
  try {
    const response = await api.get(
      "/search-history/count"
    );

    return Number(
      response?.data?.count || 0
    );
  } catch (error) {
    console.error(
      "CareerOS Search History Count Error:",
      error
    );

    throw error;
  }
}

// ======================================================
// GET SINGLE SEARCH HISTORY ITEM
// ======================================================
//
// Backend:
// GET /api/search-history/:id
//
// ======================================================

export async function getSearchHistoryById(
  id
) {
  if (!id) {
    return null;
  }

  try {
    const response =
      await api.get(
        `/search-history/${id}`
      );

    return (
      response?.data?.history ||
      null
    );
  } catch (error) {
    console.error(
      "CareerOS Search History Details Error:",
      error
    );

    throw error;
  }
}

// ======================================================
// DELETE SEARCH HISTORY ITEM
// ======================================================
//
// Backend:
// DELETE /api/search-history/:id
//
// ======================================================

export async function deleteSearchHistory(
  id
) {
  if (!id) {
    return false;
  }

  try {
    const response =
      await api.delete(
        `/search-history/${id}`
      );

    return Boolean(
      response?.data?.success
    );
  } catch (error) {
    console.error(
      "CareerOS Delete Search History Error:",
      error
    );

    throw error;
  }
}

// ======================================================
// CLEAR SEARCH HISTORY
// ======================================================
//
// Backend:
// DELETE /api/search-history
//
// ======================================================

export async function clearSearchHistory() {
  try {
    const response =
      await api.delete(
        "/search-history"
      );

    return {
      success:
        Boolean(
          response?.data?.success
        ),

      removed:
        Number(
          response?.data?.removed || 0
        ),
    };
  } catch (error) {
    console.error(
      "CareerOS Clear Search History Error:",
      error
    );

    throw error;
  }
}

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default {
  getSearchHistory,
  getSearchHistoryCount,
  getSearchHistoryById,
  deleteSearchHistory,
  clearSearchHistory,
};