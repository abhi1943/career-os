// ======================================================
// CareerOS Search History Service
// ======================================================
//
// Responsibilities:
// - Add search history
// - Get search history
// - Get one history item
// - Delete one history item
// - Clear history
// - Get history count
// - Prevent unnecessary duplicate searches
//
// ======================================================

// ======================================================
// CONFIGURATION
// ======================================================

// Maximum number of history entries to keep.
//
// This prevents the in-memory store from growing
// indefinitely during long-term usage.
const MAX_SEARCH_HISTORY = 50;

// ======================================================
// IN-MEMORY STORAGE
// ======================================================

const searchHistory = new Map();

// ======================================================
// NORMALIZE TEXT
// ======================================================

function normalizeText(value) {
    return String(
        value ?? ""
    )
        .trim()
        .replace(/\s+/g, " ");
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

    return (
        normalized ||
        defaultValue
    );
}

// ======================================================
// CREATE SEARCH SIGNATURE
// ======================================================
//
// The signature identifies whether two searches have
// the same search parameters.
//
// Example:
//
// React Developer
// India
// Fresher / 0 years
// Full-time
// Remote
// Any Salary
//
// will produce the same signature even if the user
// changes capitalization or adds extra spaces.
//

function createSearchSignature({
    query,
    location,
    experience,
    jobType,
    workMode,
    salary,
}) {
    return [
        normalizeText(query)
            .toLowerCase(),

        normalizeText(location)
            .toLowerCase(),

        normalizeText(experience)
            .toLowerCase(),

        normalizeText(jobType)
            .toLowerCase(),

        normalizeText(workMode)
            .toLowerCase(),

        normalizeText(salary)
            .toLowerCase(),
    ].join("|");
}

// ======================================================
// CREATE HISTORY ID
// ======================================================

function createHistoryId() {
    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
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
    } catch (error) {
        console.error(
            "Clone Search History Error:",
            error.message
        );

        return {
            ...item,
        };
    }
}

// ======================================================
// ADD SEARCH HISTORY
// ======================================================

function addSearchHistory({
    query = "",
    location = "India",
    experience = "Any Experience",
    jobType = "Any Type",
    workMode = "Any",
    salary = "Any Salary",
    resultCount = 0,
} = {}) {
    // --------------------------------------------------
    // Normalize values
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
    // Ignore empty searches
    // --------------------------------------------------

    if (!normalizedQuery) {
        return null;
    }

    // --------------------------------------------------
    // Create signature
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
    // Check for existing identical search
    // --------------------------------------------------

    let existingId = null;
    let existingItem = null;

    for (
        const [id, item]
        of searchHistory.entries()
    ) {
        if (
            item.signature ===
            signature
        ) {
            existingId = id;
            existingItem = item;
            break;
        }
    }

    // --------------------------------------------------
    // If same search exists:
    // update it and move it to the top.
    // --------------------------------------------------

    if (
        existingId &&
        existingItem
    ) {
        searchHistory.delete(
            existingId
        );

        const updatedItem = {
            ...existingItem,

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

            resultCount:
                normalizedResultCount,

            searchedAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString(),

            searchCount:
                Number(
                    existingItem.searchCount
                ) + 1,
        };

        searchHistory.set(
            existingId,
            updatedItem
        );

        return cloneHistoryItem(
            updatedItem
        );
    }

    // --------------------------------------------------
    // Create new history item
    // --------------------------------------------------

    const now =
        new Date().toISOString();

    const historyItem = {
        id:
            createHistoryId(),

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

        resultCount:
            normalizedResultCount,

        searchedAt:
            now,

        createdAt:
            now,

        updatedAt:
            now,

        searchCount:
            1,

        signature,
    };

    searchHistory.set(
        historyItem.id,
        historyItem
    );

    // --------------------------------------------------
    // Limit history size
    // --------------------------------------------------

    while (
        searchHistory.size >
        MAX_SEARCH_HISTORY
    ) {
        const oldestId =
            searchHistory
                .keys()
                .next()
                .value;

        if (!oldestId) {
            break;
        }

        searchHistory.delete(
            oldestId
        );
    }

    return cloneHistoryItem(
        historyItem
    );
}

// ======================================================
// GET SEARCH HISTORY
// ======================================================

function getSearchHistory() {
    return Array.from(
        searchHistory.values()
    )
        .sort(
            (a, b) =>
                new Date(
                    b.searchedAt ||
                        b.createdAt ||
                        0
                ) -
                new Date(
                    a.searchedAt ||
                        a.createdAt ||
                        0
                )
        )
        .map(
            cloneHistoryItem
        );
}

// ======================================================
// GET SEARCH HISTORY COUNT
// ======================================================

function getSearchHistoryCount() {
    return searchHistory.size;
}

// ======================================================
// GET ONE SEARCH HISTORY ITEM
// ======================================================

function getSearchHistoryById(id) {
    const normalizedId =
        normalizeText(id);

    if (!normalizedId) {
        return null;
    }

    const item =
        searchHistory.get(
            normalizedId
        );

    return (
        item
            ? cloneHistoryItem(item)
            : null
    );
}

// ======================================================
// DELETE SEARCH HISTORY ITEM
// ======================================================

function deleteSearchHistory(id) {
    const normalizedId =
        normalizeText(id);

    if (!normalizedId) {
        return false;
    }

    return searchHistory.delete(
        normalizedId
    );
}

// ======================================================
// CLEAR SEARCH HISTORY
// ======================================================

function clearSearchHistory() {
    const removed =
        searchHistory.size;

    searchHistory.clear();

    return removed;
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