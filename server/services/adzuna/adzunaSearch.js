const {
    searchCareerOSCategory,
    searchSpecificCategory,
    normalizeCareerOSCategory,
    getCareerOSCategoryConfig,
    getCareerOSCategoryQueries,
    getCareerOSCategoryAdzunaCategory,
    getQueryCategory,
    jobMatchesFilters,
    hasActiveFilters,
    enrichJob,
    removeDuplicateJobs,
    getUniqueJobId,
} = require("./adzunaCategories");

// ======================================================
// CONSTANTS
// ======================================================

const ADZUNA_RESULTS_PER_PAGE = 50;
const MAX_FILTER_PAGES = 5;
const MAX_REQUESTED_PAGE = 100;

const CATEGORY_CONCURRENCY = 3;

// Prevent overlapping all-category refresh/search runs.
let activeAllCategoriesRefresh = null;

// ======================================================
// BROAD SEARCH
// ======================================================

function isBroadJobSearch(query = "") {
    const value = String(query)
        .trim()
        .toLowerCase();

    return (
        value === "" ||
        value === "all" ||
        value === "all jobs" ||
        value === "all job" ||
        value === "jobs" ||
        value === "latest jobs" ||
        value === "latest job openings"
    );
}

// ======================================================
// ALL CAREEROS CATEGORIES
// ======================================================

async function searchAllJobCategories({
    appId,
    appKey,
    location = "India",
    page = 1,
    experience = "Any Experience",
    jobType = "Any Type",
    workMode = "Any",
    salary = "Any Salary",
} = {}) {
    if (activeAllCategoriesRefresh) {
        

        return activeAllCategoriesRefresh;
    }

    const refreshPromise =
        executeAllJobCategoriesSearch({
            appId,
            appKey,
            location,
            page,
            experience,
            jobType,
            workMode,
            salary,
        });

    activeAllCategoriesRefresh =
        refreshPromise;

    try {
        return await refreshPromise;
    } finally {
        if (
            activeAllCategoriesRefresh ===
            refreshPromise
        ) {
            activeAllCategoriesRefresh =
                null;
        }
    }
}

// ======================================================
// EXECUTE ALL CATEGORIES
// ======================================================

async function executeAllJobCategoriesSearch({
    appId,
    appKey,
    location = "India",
    page = 1,
    experience = "Any Experience",
    jobType = "Any Type",
    workMode = "Any",
    salary = "Any Salary",
} = {}) {
    const categories = [
        "it",
        "non-it",
        "medical",
        "engineering",
        "mechanical",
        "education",
        "finance-accounting",
        "government",
        "sales-marketing",
        "hr",
        "design",
        "skilled-trades",
        "other",
    ];

    const filters = {
        experience,
        jobType,
        workMode,
        salary,
    };

    // --------------------------------------------------
    // Search one CareerOS category
    // --------------------------------------------------

    async function searchOneCategory(
        category
    ) {
        const categoryJobs = [];
        let firstResponse = null;
        let lastFetchedPage = page;
        let reachedEnd = false;

        try {
            for (
                let currentPage = page;
                currentPage <
                page + MAX_FILTER_PAGES;
                currentPage++
            ) {
                try {
                    const data =
                        await searchCareerOSCategory({
                            appId,
                            appKey,
                            category,
                            location,
                            page: currentPage,
                        });

                    if (!firstResponse) {
                        firstResponse = data;
                    }

                    lastFetchedPage =
                        currentPage;

                    const pageJobs =
                        Array.isArray(
                            data?.results
                        )
                            ? data.results
                            : [];

                    if (
                        pageJobs.length === 0
                    ) {
                        reachedEnd = true;
                        break;
                    }

                    categoryJobs.push(
                        ...pageJobs
                    );

                    

                    if (
                        pageJobs.length <
                        ADZUNA_RESULTS_PER_PAGE
                    ) {
                        reachedEnd = true;
                        break;
                    }
                } catch (error) {
                    console.error(
                        `❌ Failed to fetch ${category} page ${currentPage}:`,
                        error?.response
                            ?.data ||
                            error?.message
                    );

                    if (
                        !firstResponse
                    ) {
                        throw error;
                    }

                    break;
                }
            }

            const uniqueCategoryJobs =
                removeDuplicateJobs(
                    categoryJobs
                );

            const filteredCategoryJobs =
                uniqueCategoryJobs.filter(
                    (job) =>
                        jobMatchesFilters(
                            job,
                            filters
                        )
                );

            const enrichedCategoryJobs =
                filteredCategoryJobs.map(
                    enrichJob
                );

            return {
                category,
                jobs: enrichedCategoryJobs,
                jobsScanned:
                    uniqueCategoryJobs.length,
                pagesScanned:
                    lastFetchedPage -
                    page +
                    1,
                hasMore:
                    !reachedEnd &&
                    lastFetchedPage <
                        page +
                            MAX_FILTER_PAGES -
                            1,
                success: true,
            };
        } catch (error) {
            console.error(
                `❌ Failed to fetch category "${category}":`,
                error?.response?.data ||
                    error?.message
            );

            return {
                category,
                jobs: [],
                jobsScanned: 0,
                pagesScanned: 0,
                hasMore: false,
                success: false,
            };
        }
    }

    // --------------------------------------------------
    // Run categories with controlled concurrency
    // --------------------------------------------------

    const categoryResults = [];

    for (
        let start = 0;
        start < categories.length;
        start += CATEGORY_CONCURRENCY
    ) {
        const batch =
            categories.slice(
                start,
                start +
                    CATEGORY_CONCURRENCY
            );

        

        const batchResults =
            await Promise.all(
                batch.map(
                    searchOneCategory
                )
            );

        categoryResults.push(
            ...batchResults
        );
    }

    // --------------------------------------------------
    // Merge all categories
    // --------------------------------------------------

    const allJobs = [];
    const seenJobIds = new Set();

    for (
        const category of categories
    ) {
        const categoryResult =
            categoryResults.find(
                (result) =>
                    result.category ===
                    category
            );

        if (
            !categoryResult ||
            !Array.isArray(
                categoryResult.jobs
            )
        ) {
            continue;
        }

        for (
            const job of
                categoryResult.jobs
        ) {
            if (!job) {
                continue;
            }

            const jobId =
                getUniqueJobId(
                    job
                );

            if (!jobId) {
                continue;
            }

            if (
                seenJobIds.has(
                    jobId
                )
            ) {
                continue;
            }

            seenJobIds.add(
                jobId
            );

            allJobs.push(job);
        }
    }

    // --------------------------------------------------
    // Category statistics
    // --------------------------------------------------

    const successfulCategories =
        categoryResults.filter(
            (result) =>
                result.success
        ).length;

    const requestedCategories =
        categories.length;

    const skippedCategories =
        categories.length -
        successfulCategories;

    const totalJobsScanned =
        categoryResults.reduce(
            (
                total,
                result
            ) =>
                total +
                Number(
                    result.jobsScanned ||
                        0
                ),
            0
        );

    const totalPagesScanned =
        categoryResults.reduce(
            (
                total,
                result
            ) =>
                total +
                Number(
                    result.pagesScanned ||
                        0
                ),
            0
        );

    const hasMore =
        categoryResults.some(
            (result) =>
                result.hasMore
        );

    

    return {
        success: true,

        results: allJobs,

        count: allJobs.length,

        total: allJobs.length,

        filtered_total:
            allJobs.length,

        filtered_count:
            allJobs.length,

        page,

        results_per_page:
            ADZUNA_RESULTS_PER_PAGE,

        has_more: hasMore,

        experience,

        jobType,

        workMode,

        salary,

        category: "All",

        filtered_pages_scanned:
            totalPagesScanned,

        jobs_scanned:
            totalJobsScanned,

        categories_requested:
            requestedCategories,

        categories_skipped:
            skippedCategories,

        categories_successful:
            successfulCategories,
    };
}

// ======================================================
// MAIN JOB SEARCH
// ======================================================

async function searchJobs({
    query = "all jobs",
    category = "",
    location = "India",
    page = 1,
    experience = "Any Experience",
    jobType = "Any Type",
    workMode = "Any",
    salary = "Any Salary",
}) {
    const appId =
        process.env.ADZUNA_APP_ID;

    const appKey =
        process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
        throw new Error(
            "Adzuna API credentials are missing. Please check ADZUNA_APP_ID and ADZUNA_APP_KEY in your .env file."
        );
    }

    const requestedPage =
        Math.min(
            Math.max(
                Number(page) || 1,
                1
            ),
            MAX_REQUESTED_PAGE
        );

    const normalizedCareerOSCategory =
        normalizeCareerOSCategory(
            category
        );

    const careerOSCategoryConfig =
        getCareerOSCategoryConfig(
            normalizedCareerOSCategory
        );

    const selectedCareerOSCategory =
        careerOSCategoryConfig
            ? normalizedCareerOSCategory
            : "";

    const categorySearchQueries =
        getCareerOSCategoryQueries(
            selectedCareerOSCategory
        );

    const categorySearchQuery =
        categorySearchQueries.join(
            " "
        );

    const categoryAdzunaCategory =
        getCareerOSCategoryAdzunaCategory(
            selectedCareerOSCategory
        );

    console.log(
        `🏷️ CareerOS Adzuna category: ${
            categoryAdzunaCategory ||
            "KEYWORD SEARCH"
        }`
    );

    const filters = {
        experience,
        jobType,
        workMode,
        salary,
    };

    const filtersActive =
        hasActiveFilters(
            filters
        );

    // ==================================================
    // ALL JOBS
    // ==================================================

    if (
        isBroadJobSearch(query) &&
        !selectedCareerOSCategory
    ) {
        const broadData =
            await searchAllJobCategories({
                appId,
                appKey,
                location,
                page: requestedPage,
                experience,
                jobType,
                workMode,
                salary,
            });

        /*
         * searchAllJobCategories()
         * already applies the filters.
         *
         * Keep this second filter as a
         * defensive validation layer.
         */
        const filteredJobs =
            broadData.results.filter(
                (job) =>
                    jobMatchesFilters(
                        job,
                        filters
                    )
            );

        const uniqueFilteredJobs =
            removeDuplicateJobs(
                filteredJobs
            );

        const enrichedJobs =
            uniqueFilteredJobs.map(
                enrichJob
            );

        return {
            ...broadData,

            results:
                enrichedJobs,

            total:
                broadData.total,

            filtered_total:
                enrichedJobs.length,

            filtered_count:
                enrichedJobs.length,

            jobs_scanned:
                broadData.jobs_scanned,

            filtered_pages_scanned:
                broadData.filtered_pages_scanned,

            has_more:
                broadData.has_more,
        };
    }

    // ==================================================
    // DETECT CATEGORY
    // ==================================================

    const detectedQueryCategory =
        getQueryCategory(
            query
        );

    const detectedCategory =
        selectedCareerOSCategory
            ? null
            : detectedQueryCategory;

    

    // ==================================================
    // EFFECTIVE QUERY
    // ==================================================

    const effectiveQuery =
        selectedCareerOSCategory &&
        isBroadJobSearch(query)
            ? categorySearchQuery
            : query;

    

    // ==================================================
    // SPECIFIC CAREEROS CATEGORY
    // ==================================================

    if (selectedCareerOSCategory) {
        const categoryData =
            await searchCareerOSCategory({
                appId,
                appKey,
                category:
                    selectedCareerOSCategory,
                location,
                page:
                    requestedPage,
            });

        const categoryJobs =
            Array.isArray(
                categoryData?.results
            )
                ? categoryData.results
                : [];

        const filteredCategoryJobs =
            categoryJobs.filter(
                (job) =>
                    jobMatchesFilters(
                        job,
                        filters
                    )
            );

        const uniqueCategoryJobs =
            removeDuplicateJobs(
                filteredCategoryJobs
            );

        const enrichedCategoryJobs =
            uniqueCategoryJobs.map(
                enrichJob
            );

        return {
            ...categoryData,

            results:
                enrichedCategoryJobs,

            total:
                categoryJobs.length,

            filtered_total:
                enrichedCategoryJobs.length,

            filtered_count:
                enrichedCategoryJobs.length,

            jobs_scanned:
                categoryJobs.length,

            filtered_pages_scanned:
                1,

            has_more:
                categoryData.has_more,
        };
    }

    // ==================================================
    // NO FILTERS
    // ==================================================

    if (!filtersActive) {
        const data =
            await searchSpecificCategory({
                appId,
                appKey,
                query:
                    effectiveQuery,
                location,
                page:
                    requestedPage,
                category:
                    detectedCategory,
            });

        const rawJobs =
            Array.isArray(
                data?.results
            )
                ? data.results
                : [];

        const jobs =
            removeDuplicateJobs(
                rawJobs
            ).map(
                enrichJob
            );

        const total =
            Number(
                data?.count || 0
            );

        return {
            ...data,

            total,

            results:
                jobs,

            filtered_total:
                total,

            filtered_count:
                jobs.length,

            jobs_scanned:
                jobs.length,

            filtered_pages_scanned:
                1,

            has_more:
                requestedPage *
                    ADZUNA_RESULTS_PER_PAGE <
                total,
        };
    }

    // ==================================================
    // FILTERED SEARCH
    // ==================================================

    const allJobs = [];
    const filteredJobs = [];

    let firstResponse = null;

    let lastFetchedPage =
        requestedPage;

    let reachedEnd = false;

    const targetFilteredJobs =
        ADZUNA_RESULTS_PER_PAGE;

    for (
        let currentPage =
            requestedPage;

        currentPage <
        requestedPage +
            MAX_FILTER_PAGES;

        currentPage++
    ) {
        try {
            const data =
                await searchSpecificCategory({
                    appId,
                    appKey,
                    query:
                        effectiveQuery,
                    location,
                    page:
                        currentPage,
                    category:
                        detectedCategory,
                });

            if (!firstResponse) {
                firstResponse = data;
            }

            lastFetchedPage =
                currentPage;

            const pageJobs =
                Array.isArray(
                    data?.results
                )
                    ? data.results
                    : [];

            if (
                pageJobs.length ===
                0
            ) {
                reachedEnd = true;
                break;
            }

            allJobs.push(
                ...pageJobs
            );

            const pageFilteredJobs =
                pageJobs.filter(
                    (job) =>
                        jobMatchesFilters(
                            job,
                            filters
                        )
                );

            filteredJobs.push(
                ...pageFilteredJobs
            );

            const uniqueFilteredJobs =
                removeDuplicateJobs(
                    filteredJobs
                );

            if (
                uniqueFilteredJobs.length >=
                targetFilteredJobs
            ) {
                

                break;
            }

            if (
                pageJobs.length <
                ADZUNA_RESULTS_PER_PAGE
            ) {
                reachedEnd = true;
                break;
            }
        } catch (error) {
            console.error(
                `Adzuna page ${currentPage} failed:`,
                error?.response
                    ?.data ||
                    error?.message
            );

            if (!firstResponse) {
                throw error;
            }

            break;
        }
    }

    const uniqueJobs =
        removeDuplicateJobs(
            allJobs
        );

    const uniqueFilteredJobs =
        removeDuplicateJobs(
            filteredJobs
        );

    const enrichedJobs =
        uniqueFilteredJobs.map(
            enrichJob
        );

    const total =
        Number(
            firstResponse?.count ||
                0
        );

    const reachedFilterTarget =
        uniqueFilteredJobs.length >=
        targetFilteredJobs;

    const hasMore =
        !reachedEnd &&
        !reachedFilterTarget &&
        lastFetchedPage <
            requestedPage +
                MAX_FILTER_PAGES -
                1;

    return {
        ...(firstResponse || {}),

        total,

        results:
            enrichedJobs,

        filtered_total:
            enrichedJobs.length,

        filtered_count:
            enrichedJobs.length,

        jobs_scanned:
            uniqueJobs.length,

        filtered_pages_scanned:
            lastFetchedPage -
            requestedPage +
            1,

        has_more:
            hasMore,
    };
}

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    searchJobs,
    searchAllJobCategories,
};