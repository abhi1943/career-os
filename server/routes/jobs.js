const express = require("express");

const {
    searchJobs,
    searchAllJobCategories,
} = require("../services/adzunaService");

const {
    verifyFirebaseToken,
} = require("../middleware/firebaseAuth");

const {
    storeJobs,
    getJobById,
    getRelatedJobs,
    getAllStoredJobs,
    getJobStoreStatus,
} = require("../services/jobService");

const {
    findMatchingAlerts,
    recordAlertMatch,
} = require("../services/jobAlertsService");

const {
    createNotification,
} = require("../services/notificationService");

const {
    addSearchHistory,
} = require("../services/searchHistoryService");

const router = express.Router();

// ======================================================
// PAGINATION CONFIG
// ======================================================

const RESULTS_PER_PAGE = 50;

// ======================================================
// TOTAL CACHE
// ======================================================

let allJobsOriginalTotal = 0;
const categoryOriginalTotals = new Map();
const searchOriginalTotals = new Map();
// ======================================================
// TOTAL CACHE HELPERS
// ======================================================

const normalizeTotalCacheKey = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase();
};

const getAllJobsOriginalTotal = () => {
    return Number(allJobsOriginalTotal || 0);
};

const getCategoryOriginalTotal = (category) => {
    const key =
        normalizeTotalCacheKey(category);

    return Number(
        categoryOriginalTotals.get(key) || 0
    );
};

const getSearchOriginalTotal = (query) => {
    const key =
        normalizeTotalCacheKey(query);

    return Number(
        searchOriginalTotals.get(key) || 0
    );
};

// ======================================================
// USER CONFIG
// ======================================================

const getUserId = (req) => {
    // Firebase authentication middleware puts
    // the authenticated user in req.user.
    if (req.user?.uid) {
        return String(req.user.uid).trim();
    }

    // Backward compatibility if an older frontend
    // still sends x-user-id.
    if (req.headers["x-user-id"]) {
        return String(
            req.headers["x-user-id"]
        ).trim();
    }

    return "";
};

// ======================================================
// WARM STATE
// ======================================================

const warmState = {
    isWarming: false,
    startedAt: null,
    completedAt: null,
    failedAt: null,
    fetchedCount: 0,
    storedCount: 0,
    updatedCount: 0,
    error: null,
};

// ======================================================
// BACKGROUND REFRESH STATE
// ======================================================

const backgroundRefreshState = {
    allJobs: false,
    categories: new Set(),
    searches: new Set(),
    related: new Set(),
};

// ======================================================
// COMPANY CACHE
// ======================================================

let companyCache = {
    version: 0,
    companies: [],
};

let companyCacheVersion = 0;

const invalidateCompanyCache = () => {
    companyCacheVersion++;

    companyCache = {
        version: companyCacheVersion,
        companies: [],
    };
};

// ======================================================
// STORE JOBS + INVALIDATE COMPANY CACHE
// ======================================================

const storeJobsAndInvalidateCompanyCache = (jobs) => {
    const result =
        storeJobs(jobs);

    const stored =
        Number(result?.stored || 0);

    const updated =
        Number(result?.updated || 0);

    if (
        stored > 0 ||
        updated > 0
    ) {
        invalidateCompanyCache();
    }

    return result;
};

// ======================================================
// REFRESH ALL JOBS IN BACKGROUND
// ======================================================

const refreshAllJobsInBackground = () => {
    if (
        backgroundRefreshState.allJobs
    ) {
        return;
    }

    backgroundRefreshState.allJobs = true;

    Promise.resolve()
        .then(async () => {
            console.log(
                "🔄 Background refresh started for all jobs..."
            );

            const data =
                await searchAllJobCategories({
                    location: "India",
                    page: 1,
                    experience: "Any Experience",
                    jobType: "Any Type",
                    workMode: "Any",
                    salary: "Any Salary",
                });

            const originalTotal =
                Number(
                    data?.total ??
                    data?.filtered_total ??
                    data?.count ??
                    0
                );

            if (
                Number.isFinite(originalTotal) &&
                originalTotal > 0
            ) {
                allJobsOriginalTotal =
                    originalTotal;

                console.log(
                    `📊 Original ALL JOBS total: ${allJobsOriginalTotal}`
                );
            }

            const jobs =
                Array.isArray(data?.results)
                    ? data.results
                    : [];

            if (jobs.length > 0) {
                const result =
                    storeJobsAndInvalidateCompanyCache(
                        jobs
                    );

                console.log(
                    `✅ Background all-jobs refresh completed: ${jobs.length} fetched, ${result.stored} new, ${result.updated} updated`
                );
            } else {
                console.log(
                    "⚠️ Background all-jobs refresh returned no jobs."
                );
            }
        })
        .catch((error) => {
            console.error(
                "❌ Background all-jobs refresh failed:",
                error?.response?.data ||
                    error?.message ||
                    error
            );
        })
        .finally(() => {
            backgroundRefreshState.allJobs =
                false;
        });
};

// ======================================================
// REFRESH CATEGORY IN BACKGROUND
// ======================================================

const refreshCategoryInBackground = (
    category,
    location,
    experience,
    jobType,
    workMode,
    salary
) => {
    const key =
        String(category || "")
            .trim()
            .toLowerCase();

    if (!key) {
        return;
    }

    if (
        backgroundRefreshState.categories.has(
            key
        )
    ) {
        return;
    }

    backgroundRefreshState.categories.add(
        key
    );

    Promise.resolve()
        .then(async () => {
            console.log(
                `🔄 Background category refresh started: ${category}`
            );

            const data =
                await searchJobs({
                    query: "",
                    category,
                    location,
                    page: 1,
                    experience,
                    jobType,
                    workMode,
                    salary,
                });

            const originalTotal =
                Number(
                    data?.total ??
                    data?.filtered_total ??
                    data?.count ??
                    0
                );

            if (
                Number.isFinite(originalTotal) &&
                originalTotal > 0
            ) {
                categoryOriginalTotals.set(
                    key,
                    originalTotal
                );

                console.log(
                    `📊 Original ${category} total: ${originalTotal}`
                );
            }

            const jobs =
                Array.isArray(data?.results)
                    ? data.results
                    : [];

            if (jobs.length > 0) {
                const result =
                    storeJobsAndInvalidateCompanyCache(
                        jobs
                    );

                console.log(
                    `✅ Background category refresh completed: ${category} → ${jobs.length} fetched, ${result.stored} new, ${result.updated} updated`
                );
            } else {
                console.log(
                    `⚠️ Background category refresh returned no jobs: ${category}`
                );
            }
        })
        .catch((error) => {
            console.error(
                `❌ Background category refresh failed: ${category}`,
                error?.response?.data ||
                    error?.message ||
                    error
            );
        })
        .finally(() => {
            backgroundRefreshState.categories.delete(
                key
            );
        });
};

// ======================================================
// BACKGROUND SEARCH REFRESH
// ======================================================

const refreshSearchInBackground = (
    query,
    category,
    location,
    experience,
    jobType,
    workMode,
    salary
) => {
    const normalizedQuery =
        normalizeTotalCacheKey(query);

    if (!normalizedQuery) {
        return;
    }

    const key = [
        normalizedQuery,
        normalizeTotalCacheKey(category),
        normalizeTotalCacheKey(location),
        normalizeTotalCacheKey(experience),
        normalizeTotalCacheKey(jobType),
        normalizeTotalCacheKey(workMode),
        normalizeTotalCacheKey(salary),
    ].join("|");

    if (
        backgroundRefreshState.searches.has(key)
    ) {
        return;
    }

    backgroundRefreshState.searches.add(key);

    Promise.resolve()
        .then(async () => {
            console.log(
                `🔄 Background search refresh started: ${query}`
            );

            const data =
                await searchJobs({
                    query,
                    category,
                    location,
                    page: 1,
                    experience,
                    jobType,
                    workMode,
                    salary,
                });

            const providerTotal =
                Number(
                    data?.total ??
                    data?.filtered_total ??
                    data?.count ??
                    0
                );

            if (
                Number.isFinite(providerTotal) &&
                providerTotal > 0
            ) {
                searchOriginalTotals.set(
                    normalizedQuery,
                    providerTotal
                );

                console.log(
                    `📊 Original search "${query}" total: ${providerTotal}`
                );
            }

            const jobs =
                Array.isArray(data?.results)
                    ? data.results
                    : [];

            if (jobs.length > 0) {
                const result =
                    storeJobsAndInvalidateCompanyCache(
                        jobs
                    );

                console.log(
                    `✅ Background search refresh completed: ${query} → ${jobs.length} fetched, ${result.stored} new, ${result.updated} updated`
                );
            } else {
                console.log(
                    `⚠️ Background search refresh returned no jobs: ${query}`
                );
            }
        })
        .catch((error) => {
            console.error(
                `❌ Background search refresh failed: ${query}`,
                error?.response?.data ||
                    error?.message ||
                    error
            );
        })
        .finally(() => {
            backgroundRefreshState.searches.delete(
                key
            );
        });
};

// ======================================================
// COMPANY HELPERS
// ======================================================

const getCompanyName = (job) => {
    if (!job) {
        return "";
    }

    if (
        typeof job.company === "string" &&
        job.company.trim()
    ) {
        return job.company.trim();
    }

    if (
        job.company &&
        typeof job.company.display_name ===
            "string" &&
        job.company.display_name.trim()
    ) {
        return job.company.display_name.trim();
    }

    if (
        typeof job.company_name === "string" &&
        job.company_name.trim()
    ) {
        return job.company_name.trim();
    }

    return "Unknown Company";
};

const getCompanyLocation = (job) => {
    if (!job) {
        return "India";
    }

    if (
        typeof job.location === "string" &&
        job.location.trim()
    ) {
        return job.location.trim();
    }

    if (
        job.location &&
        typeof job.location.display_name ===
            "string" &&
        job.location.display_name.trim()
    ) {
        return job.location.display_name.trim();
    }

    return "India";
};

const getCompanyCategory = (job) => {
    if (!job) {
        return "Other";
    }

    if (
        typeof job.careeros_category === "string" &&
        job.careeros_category.trim()
    ) {
        return job.careeros_category.trim();
    }

    if (
        typeof job.category === "string" &&
        job.category.trim()
    ) {
        return job.category.trim();
    }

    if (
        job.category &&
        typeof job.category.label === "string" &&
        job.category.label.trim()
    ) {
        return job.category.label.trim();
    }

    return "Other";
};

const getCompanyKey = (name) => {
    return String(name || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
};

// ======================================================
// BUILD COMPANY CACHE
// ======================================================

const buildCompanyCache = () => {
    const storedJobs =
        getAllStoredJobs();

    const jobs =
        Array.isArray(storedJobs)
            ? storedJobs
            : [];

    const companyMap =
        new Map();

    for (const job of jobs) {
        if (!job) {
            continue;
        }

        const companyName =
            getCompanyName(job);

        if (
            !companyName ||
            companyName === "Unknown Company"
        ) {
            continue;
        }

        const companyKey =
            getCompanyKey(companyName);

        if (!companyKey) {
            continue;
        }

        const companyLocation =
            getCompanyLocation(job);

        const companyCategory =
            getCompanyCategory(job);

        if (
            !companyMap.has(companyKey)
        ) {
            companyMap.set(
                companyKey,
                {
                    id: companyKey,
                    name: companyName,
                    location: companyLocation,
                    category: companyCategory,
                    jobs: [],
                    jobIds: new Set(),
                }
            );
        }

        const company =
            companyMap.get(companyKey);

        const jobId =
            String(
                job.id ||
                    job.redirect_url ||
                    `${
                        job.title || ""
                    }-${companyName}`
            );

        if (
            company.jobIds.has(jobId)
        ) {
            continue;
        }

        company.jobIds.add(jobId);

        company.jobs.push(job);
    }

    const companies =
        Array.from(
            companyMap.values()
        ).map((company) => ({
            id: company.id,
            name: company.name,
            location: company.location,
            category: company.category,
            jobs: company.jobs,
            jobCount: company.jobs.length,
        }));

    companies.sort((a, b) => {
        if (
            b.jobCount !==
            a.jobCount
        ) {
            return (
                b.jobCount -
                a.jobCount
            );
        }

        return String(a.name).localeCompare(
            String(b.name)
        );
    });

    companyCache = {
        version: companyCacheVersion,
        companies,
    };

    return companyCache.companies;
};

// ======================================================
// GET COMPANY CACHE
// ======================================================

const getCompanyCache = () => {
    const storedJobs =
        getAllStoredJobs();

    const jobCount =
        Array.isArray(storedJobs)
            ? storedJobs.length
            : 0;

    // ==================================================
    // CACHE VERSION CHANGED
    // ==================================================

    if (
        companyCache.version !==
        companyCacheVersion
    ) {
        return buildCompanyCache();
    }

    // ==================================================
    // CACHE IS INVALID
    // ==================================================

    if (
        !Array.isArray(
            companyCache.companies
        )
    ) {
        return buildCompanyCache();
    }

    // ==================================================
    // JOB STORE HAS DATA BUT COMPANY CACHE IS EMPTY
    // ==================================================
    //
    // This protects against the exact situation where:
    //
    // job store  = 235 jobs
    // company cache = []
    //
    // ==================================================

    if (
        jobCount > 0 &&
        companyCache.companies.length === 0
    ) {
        console.log(
            `🔄 Rebuilding company cache: ${jobCount} jobs exist but company cache is empty.`
        );

        return buildCompanyCache();
    }

    return companyCache.companies;
};

// ======================================================
// JOB ID HELPERS
// ======================================================

const normalizeJobId = (value) => {
    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }

    let id =
        String(value).trim();

    if (!id) {
        return "";
    }

    for (
        let i = 0;
        i < 3;
        i++
    ) {
        try {
            const decoded =
                decodeURIComponent(id);

            if (
                decoded === id
            ) {
                break;
            }

            id = decoded;
        } catch {
            break;
        }
    }

    return id.trim();
};

// ======================================================
// FIND JOB IN STORE
// ======================================================

const findStoredJobById = (rawId) => {
    const normalizedId =
        normalizeJobId(rawId);

    if (!normalizedId) {
        return null;
    }

    const directJob =
        getJobById(normalizedId);

    if (directJob) {
        return directJob;
    }

    const storedJobs =
        getAllStoredJobs();

    if (
        !Array.isArray(storedJobs) ||
        storedJobs.length === 0
    ) {
        return null;
    }

    const normalizedLower =
        normalizedId.toLowerCase();

    for (const job of storedJobs) {
        if (!job) {
            continue;
        }

        const jobId =
            String(job.id || "").trim();

        const redirectUrl =
            String(
                job.redirect_url || ""
            ).trim();

        const url =
            String(job.url || "").trim();

        if (
            jobId === normalizedId ||
            redirectUrl === normalizedId ||
            url === normalizedId
        ) {
            return job;
        }

        if (
            jobId.toLowerCase() ===
            normalizedLower
        ) {
            return job;
        }
    }

    const numericMatches =
        normalizedId.match(
            /(?:\/ad\/|\/details\/)(\d+)/i
        );

    if (
        numericMatches &&
        numericMatches[1]
    ) {
        const numericId =
            numericMatches[1];

        const job =
            getJobById(numericId);

        if (job) {
            return job;
        }

        for (
            const storedJob
            of storedJobs
        ) {
            if (
                storedJob &&
                String(
                    storedJob.id || ""
                ) === numericId
            ) {
                return storedJob;
            }
        }
    }

    for (const job of storedJobs) {
        if (!job) {
            continue;
        }

        const redirectUrl =
            String(
                job.redirect_url || ""
            ).trim();

        const url =
            String(
                job.url || ""
            ).trim();

        if (
            redirectUrl &&
            redirectUrl.toLowerCase() ===
                normalizedLower
        ) {
            return job;
        }

        if (
            url &&
            url.toLowerCase() ===
                normalizedLower
        ) {
            return job;
        }
    }

    return null;
};

// ======================================================
// BACKGROUND WARM
// ======================================================

async function warmJobStore() {
    if (
        warmState.isWarming
    ) {
        console.log(
            "⏳ CareerOS job store warm operation already running."
        );

        return;
    }

    warmState.isWarming =
        true;

    warmState.startedAt =
        new Date().toISOString();

    warmState.completedAt =
        null;

    warmState.failedAt =
        null;

    warmState.fetchedCount =
        0;

    warmState.storedCount =
        0;

    warmState.updatedCount =
        0;

    warmState.error =
        null;

    console.log("");

    console.log(
        "======================================================"
    );

    console.log(
        "🔥 CareerOS job store warming started"
    );

    console.log(
        "======================================================"
    );

    try {
        console.log(
            "🔎 Warming job store from Adzuna..."
        );

        const data =
            await searchAllJobCategories({
                location: "India",
                page: 1,
                experience: "Any Experience",
                jobType: "Any Type",
                workMode: "Any",
                salary: "Any Salary",
            });

        const originalTotal =
            Number(
                data?.total ??
                data?.filtered_total ??
                data?.count ??
                0
            );

        if (
            Number.isFinite(originalTotal) &&
            originalTotal > 0
        ) {
            allJobsOriginalTotal =
                originalTotal;

            console.log(
                `📊 Original ALL JOBS total cached: ${allJobsOriginalTotal}`
            );
        }

        const jobs =
            Array.isArray(data?.results)
                ? data.results
                : [];

        warmState.fetchedCount =
            jobs.length;

        if (jobs.length > 0) {
            const storeResult =
                storeJobsAndInvalidateCompanyCache(
                    jobs
                );

            warmState.storedCount =
                Number(
                    storeResult?.stored || 0
                );

            warmState.updatedCount =
                Number(
                    storeResult?.updated || 0
                );

            console.log(
                `📦 Warm stored: ${warmState.storedCount}`
            );

            console.log(
                `🔄 Warm updated: ${warmState.updatedCount}`
            );
        }

        warmState.completedAt =
            new Date().toISOString();

        console.log("");

        console.log(
            "======================================================"
        );

        console.log(
            "✅ CareerOS job store warming completed"
        );

        console.log(
            `📥 Jobs fetched: ${warmState.fetchedCount}`
        );

        console.log(
            `📦 Jobs stored: ${warmState.storedCount}`
        );

        console.log(
            `🔄 Jobs updated: ${warmState.updatedCount}`
        );

        console.log(
            `📊 Original ALL JOBS total: ${allJobsOriginalTotal}`
        );

        console.log(
            `📦 Total jobs in store: ${getAllStoredJobs().length}`
        );

        console.log(
            "======================================================"
        );

        console.log("");
    } catch (error) {
        warmState.failedAt =
            new Date().toISOString();

        warmState.error =
            error?.message ||
            "Unknown warm error";

        console.error(
            "❌ CareerOS job store warming failed:",
            error?.response?.data ||
                error?.message
        );
    } finally {
        warmState.isWarming =
            false;
    }
}

// ======================================================
// SEARCH JOBS
// GET /api/jobs
// ======================================================

router.get(
    "/",
    verifyFirebaseToken,
    async (req, res) => {
        const requestStartedAt =
            Date.now();

        try {
            const {
                query = "",
                category = "",
                location = "India",
                page = 1,
                experience = "Any Experience",
                jobType = "Any Type",
                workMode = "Any",
                salary = "Any Salary",
            } = req.query;

            const searchQuery =
                typeof query === "string"
                    ? query.trim()
                    : "";

            const selectedCategory =
                typeof category === "string"
                    ? category.trim()
                    : "";

            const selectedCategoryKey =
                selectedCategory
                    .trim()
                    .toLowerCase();

            // ==================================================
            // CATEGORY BACKGROUND REFRESH
            // ==================================================

            if (
                selectedCategoryKey
            ) {
                refreshCategoryInBackground(
                    selectedCategory,
                    location,
                    experience,
                    jobType,
                    workMode,
                    salary
                );
            }

            // ==================================================
            // PAGE
            // ==================================================

            const pageNumber =
                Math.min(
                    Math.max(
                        Number(page) || 1,
                        1
                    ),
                    100
                );

            // ==================================================
            // NORMALIZED FILTERS
            // ==================================================

            const normalizedSearch =
                searchQuery.toLowerCase();

            const normalizedCategory =
                selectedCategory.toLowerCase();

            const normalizedLocation =
                String(location || "")
                    .trim()
                    .toLowerCase();

            const normalizedExperience =
                String(experience || "")
                    .trim()
                    .toLowerCase();

            const normalizedJobType =
                String(jobType || "")
                    .trim()
                    .toLowerCase();

            const normalizedWorkMode =
                String(workMode || "")
                    .trim()
                    .toLowerCase();

            const normalizedSalary =
                String(salary || "")
                    .trim()
                    .toLowerCase();

            const categoryFilter =
                normalizedCategory === "all" ||
                normalizedCategory ===
                    "all categories"
                    ? ""
                    : normalizedCategory;

            const locationFilter =
                normalizedLocation === "all" ||
                normalizedLocation ===
                    "all locations"
                    ? ""
                    : normalizedLocation;

            const experienceFilter =
                normalizedExperience === "all" ||
                normalizedExperience ===
                    "any experience"
                    ? ""
                    : normalizedExperience;

            const jobTypeFilter =
                normalizedJobType === "all" ||
                normalizedJobType ===
                    "any type"
                    ? ""
                    : normalizedJobType;

            const workModeFilter =
                normalizedWorkMode === "all" ||
                normalizedWorkMode === "any"
                    ? ""
                    : normalizedWorkMode;

            const salaryFilter =
                normalizedSalary === "all" ||
                normalizedSalary ===
                    "any salary"
                    ? ""
                    : normalizedSalary;

            // ==================================================
            // GET CURRENT STORE
            // ==================================================

            const storedJobs =
                getAllStoredJobs();

            // ==================================================
            // TEXT HELPERS
            // ==================================================

            const getText =
                (value) => {
                    if (
                        value === undefined ||
                        value === null
                    ) {
                        return "";
                    }

                    if (
                        typeof value ===
                        "string"
                    ) {
                        return value
                            .trim()
                            .toLowerCase();
                    }

                    if (
                        typeof value ===
                        "object"
                    ) {
                        return String(
                            value.display_name ||
                                value.label ||
                                value.name ||
                                ""
                        )
                            .trim()
                            .toLowerCase();
                    }

                    return String(value)
                        .trim()
                        .toLowerCase();
                };

            const getJobCompany =
                (job) => {
                    if (!job) {
                        return "";
                    }

                    return getText(
                        job.company
                    );
                };

            const getJobLocation =
                (job) => {
                    if (!job) {
                        return "";
                    }

                    return getText(
                        job.location
                    );
                };

            const getJobCategory =
                (job) => {
                    if (!job) {
                        return "";
                    }

                    return getText(
                        job.careeros_category ||
                            job.category
                    );
                };

            const getJobExperience =
                (job) => {
                    if (!job) {
                        return "";
                    }

                    return getText(
                        job.detected_experience ||
                            job.experience
                    );
                };

            const getJobType =
                (job) => {
                    if (!job) {
                        return "";
                    }

                    return getText(
                        job.detected_job_type ||
                            job.job_type ||
                            job.jobType ||
                            job.contract_type ||
                            job.contractType
                    );
                };

            const getJobWorkMode =
                (job) => {
                    if (!job) {
                        return "";
                    }

                    return getText(
                        job.detected_work_mode ||
                            job.work_mode ||
                            job.workMode
                    );
                };

            const getJobSalary =
                (job) => {
                    if (!job) {
                        return "";
                    }

                    return getText(
                        job.detected_salary ||
                            job.salary ||
                            job.salary_bucket
                    );
                };

            const getJobSearchText =
                (job) => {
                    if (!job) {
                        return "";
                    }

                    return String(
                        job.searchText ||
                            [
                                job.title,
                                job.description,
                                getJobCompany(job),
                                getJobLocation(job),
                                getJobCategory(job),
                            ]
                                .filter(Boolean)
                                .join(" ")
                    ).toLowerCase();
                };

            // ==================================================
            // MATCH STORED JOB
            // ==================================================

            const matchesStoredJob =
                (job) => {
                    if (!job) {
                        return false;
                    }

                    if (
                        locationFilter &&
                        locationFilter !== "india"
                    ) {
                        const jobLocation =
                            getJobLocation(job);

                        if (
                            !jobLocation.includes(
                                locationFilter
                            )
                        ) {
                            return false;
                        }
                    }

                    if (
                        categoryFilter
                    ) {
                        const jobCategory =
                            getJobCategory(job);

                        const jobSearch =
                            getJobSearchText(job);

                        if (
                            !jobCategory.includes(
                                categoryFilter
                            ) &&
                            !jobSearch.includes(
                                categoryFilter
                            )
                        ) {
                            return false;
                        }
                    }

                    if (
                        normalizedSearch
                    ) {
                        const searchText =
                            getJobSearchText(job);

                        if (
                            !searchText.includes(
                                normalizedSearch
                            )
                        ) {
                            return false;
                        }
                    }

                    if (
                        experienceFilter
                    ) {
                        const jobExperience =
                            getJobExperience(job);

                        if (
                            jobExperience &&
                            !jobExperience.includes(
                                experienceFilter
                            )
                        ) {
                            return false;
                        }
                    }

                    if (
                        jobTypeFilter
                    ) {
                        const jobTypeValue =
                            getJobType(job);

                        if (
                            jobTypeValue &&
                            !jobTypeValue.includes(
                                jobTypeFilter
                            )
                        ) {
                            return false;
                        }
                    }

                    if (
                        workModeFilter
                    ) {
                        const jobWorkMode =
                            getJobWorkMode(job);

                        if (
                            jobWorkMode &&
                            !jobWorkMode.includes(
                                workModeFilter
                            )
                        ) {
                            return false;
                        }
                    }

                    if (
                        salaryFilter
                    ) {
                        const jobSalary =
                            getJobSalary(job);

                        if (
                            jobSalary &&
                            !jobSalary.includes(
                                salaryFilter
                            )
                        ) {
                            return false;
                        }
                    }

                    return true;
                };

            // ==================================================
            // FILTER STORED JOBS
            // ==================================================

            const matchingStoredJobs =
                storedJobs.filter(
                    matchesStoredJob
                );

            const requestedStartIndex =
                (pageNumber - 1) *
                RESULTS_PER_PAGE;

            const requestedEndIndex =
                requestedStartIndex +
                RESULTS_PER_PAGE;

            const hasFullStoredPage =
                matchingStoredJobs.length >=
                requestedEndIndex;

            // ==================================================
            // STORE PATH
            // ==================================================

            if (
                hasFullStoredPage
            ) {
                const paginatedJobs =
                    matchingStoredJobs.slice(
                        requestedStartIndex,
                        requestedEndIndex
                    );

                let cachedProviderTotal =
                    0;

                if (
                    !normalizedSearch &&
                    !categoryFilter
                ) {
                    cachedProviderTotal =
                        getAllJobsOriginalTotal();
                } else if (
                    categoryFilter
                ) {
                    cachedProviderTotal =
                        getCategoryOriginalTotal(
                            categoryFilter
                        );
                } else if (
                    normalizedSearch
                ) {
                    cachedProviderTotal =
                        getSearchOriginalTotal(
                            normalizedSearch
                        );
                }

                const total =
                    cachedProviderTotal > 0
                        ? cachedProviderTotal
                        : matchingStoredJobs.length;

                const totalPages =
                    total > 0
                        ? Math.ceil(
                              total /
                                  RESULTS_PER_PAGE
                          )
                        : 0;

                const hasMore =
                    requestedEndIndex <
                    total;

                console.log(
                    `\n⚡ /api/jobs → STORE`
                );

                console.log(
                    `📦 Fresh stored jobs: ${storedJobs.length}`
                );

                console.log(
                    `📦 Matching stored jobs currently available: ${matchingStoredJobs.length}`
                );

                console.log(
                    `📊 Provider total: ${total}`
                );

                console.log(
                    `📄 Page: ${pageNumber}`
                );

                console.log(
                    `📦 Jobs returned: ${paginatedJobs.length}`
                );

                console.log(
                    `➡️ Has more: ${hasMore}`
                );

                console.log(
                    `⚡ /api/jobs served from store in ${
                        Date.now() -
                        requestStartedAt
                    } ms`
                );

                // ==================================================
                // BACKGROUND ALERT MATCHING
                // ==================================================

                Promise.resolve().then(
                    async () => {
                        for (
                            const job
                            of paginatedJobs
                        ) {
                            try {
                                if (
                                    !job ||
                                    !job.id
                                ) {
                                    continue;
                                }

                                const matches =
                                    await findMatchingAlerts(
                                        job
                                    );

                                if (
                                    !Array.isArray(
                                        matches
                                    ) ||
                                    matches.length ===
                                        0
                                ) {
                                    continue;
                                }

                                for (
                                    const match
                                    of matches
                                ) {
                                    if (
                                        !match ||
                                        !match.alert ||
                                        !match.alert.id
                                    ) {
                                        continue;
                                    }

                                    const alertId =
                                        match.alert.id;

                                    const userId =
                                        match.alert.userId;

                                    if (!userId) {
                                        continue;
                                    }

                                    const updatedAlert =
                                        await recordAlertMatch(
                                            alertId,
                                            job,
                                            userId
                                        );

                                    if (
                                        updatedAlert &&
                                        !updatedAlert.alreadyMatched
                                    ) {
                                        try {
                                            await createNotification(
                                                {
                                                    type:
                                                        "job_match",

                                                    title:
                                                        "New job match found",

                                                    message:
                                                        `${
                                                            job.title ||
                                                            "New job"
                                                        } matches your saved job alert.`,

                                                    jobId:
                                                        job.id,

                                                    alertId:
                                                        alertId,
                                                },
                                                userId
                                            );

                                            console.log(
                                                `🔔 Job match notification created for user ${userId}, job ${job.id}`
                                            );
                                        } catch (
                                            notificationError
                                        ) {
                                            console.error(
                                                "Job Match Notification Error:",
                                                notificationError.message
                                            );
                                        }
                                    }
                                }
                            } catch (
                                alertError
                            ) {
                                console.error(
                                    "Background Job Alert Matching Error:",
                                    alertError.message
                                );
                            }
                        }
                    }
                );

                // ==================================================
                // BACKGROUND SEARCH HISTORY
                // ==================================================

                Promise.resolve().then(
                    async () => {
                        try {
                            const uid =
                                getUserId(req);

                            await addSearchHistory({
                                uid,

                                query:
                                    searchQuery ||
                                    "all jobs",

                                category:
                                    selectedCategory,

                                location,
                                experience,
                                jobType,
                                workMode,
                                salary,

                                resultCount:
                                    paginatedJobs.length,
                            });
                        } catch (
                            historyError
                        ) {
                            console.error(
                                "Search History Save Error:",
                                historyError.message
                            );
                        }
                    }
                );

                return res.json({
                    success: true,

                    count:
                        paginatedJobs.length,

                    total,

                    filtered_total:
                        total,

                    filtered_count:
                        paginatedJobs.length,

                    page:
                        pageNumber,

                    results_per_page:
                        RESULTS_PER_PAGE,

                    total_pages:
                        totalPages,

                    has_more:
                        hasMore,

                    experience,
                    jobType,
                    workMode,
                    salary,

                    category:
                        selectedCategory ||
                        "All",

                    filtered_pages_scanned:
                        0,

                    jobs_scanned:
                        matchingStoredJobs.length,

                    jobs:
                        paginatedJobs,

                    alertMatchesFound:
                        0,

                    alertMatchesRecorded:
                        0,

                    store: {
                        stored: 0,
                        updated: 0,
                        total:
                            storedJobs.length,
                    },
                });
            }


            console.log(
                `\n⚡ /api/jobs → STORE PARTIAL / BACKGROUND REFRESH`
            );

            console.log(
                `📦 Matching stored jobs: ${matchingStoredJobs.length}`
            );

            if (
                !searchQuery &&
                !categoryFilter
            ) {
                refreshAllJobsInBackground();
            } else if (
                categoryFilter
            ) {
                refreshCategoryInBackground(
                    selectedCategory,
                    location,
                    experience,
                    jobType,
                    workMode,
                    salary
                );

                if (
                    searchQuery
                ) {
                    refreshSearchInBackground(
                        searchQuery,
                        categoryFilter,
                        location,
                        experience,
                        jobType,
                        workMode,
                        salary
                    );
                }
            } else if (
                searchQuery
            ) {
                refreshSearchInBackground(
                    searchQuery,
                    "",
                    location,
                    experience,
                    jobType,
                    workMode,
                    salary
                );
            }

            const paginatedJobs =
                matchingStoredJobs.slice(
                    requestedStartIndex,
                    requestedEndIndex
                );

            let total =
                0;

            if (
                !searchQuery &&
                !categoryFilter
            ) {
                total =
                    getAllJobsOriginalTotal();
            } else if (
                categoryFilter
            ) {
                total =
                    getCategoryOriginalTotal(
                        categoryFilter
                    );
            } else if (
                searchQuery
            ) {
                total =
                    getSearchOriginalTotal(
                        normalizedSearch
                    );
            }

            if (
                !Number.isFinite(total) ||
                total <= 0
            ) {
                total =
                    Math.max(
                        matchingStoredJobs.length,
                        paginatedJobs.length
                    );
            }

            const totalPages =
                total > 0
                    ? Math.ceil(
                          total /
                              RESULTS_PER_PAGE
                      )
                    : 0;

            const hasMore =
                requestedEndIndex <
                total;

            console.log(
                `📦 Jobs returned immediately: ${paginatedJobs.length}`
            );

            console.log(
                `📊 Current cached total: ${total}`
            );

            console.log(
                `⚡ /api/jobs returned without waiting for Adzuna in ${
                    Date.now() -
                    requestStartedAt
                } ms`
            );

            // ==================================================
            // BACKGROUND ALERT MATCHING
            // ==================================================

            Promise.resolve().then(
                async () => {
                    for (
                        const job
                        of paginatedJobs
                    ) {
                        try {
                            if (
                                !job ||
                                !job.id
                            ) {
                                continue;
                            }

                            const matches =
                                await findMatchingAlerts(
                                    job
                                );

                            if (
                                !Array.isArray(
                                    matches
                                ) ||
                                matches.length === 0
                            ) {
                                continue;
                            }

                            for (
                                const match
                                of matches
                            ) {
                                if (
                                    !match ||
                                    !match.alert ||
                                    !match.alert.id
                                ) {
                                    continue;
                                }

                                const alertId =
                                    match.alert.id;

                                const userId =
                                    match.alert.userId;

                                if (!userId) {
                                    continue;
                                }

                                const updatedAlert =
                                    await recordAlertMatch(
                                        alertId,
                                        job,
                                        userId
                                    );

                                if (
                                    updatedAlert &&
                                    !updatedAlert.alreadyMatched
                                ) {
                                    try {
                                        await createNotification(
                                            {
                                                type:
                                                    "job_match",

                                                title:
                                                    "New job match found",

                                                message:
                                                    `${
                                                        job.title ||
                                                        "New job"
                                                    } matches your saved job alert.`,

                                                jobId:
                                                    job.id,

                                                alertId:
                                                    alertId,
                                            },
                                            userId
                                        );
                                    } catch (
                                        notificationError
                                    ) {
                                        console.error(
                                            "Job Match Notification Error:",
                                            notificationError.message
                                        );
                                    }
                                }
                            }
                        } catch (
                            alertError
                        ) {
                            console.error(
                                "Background Job Alert Matching Error:",
                                alertError.message
                            );
                        }
                    }
                }
            );

            // ==================================================
            // BACKGROUND SEARCH HISTORY
            // ==================================================

            Promise.resolve().then(
                async () => {
                    try {
                        const uid =
                            getUserId(req);

                        await addSearchHistory({
                            uid,

                            query:
                                searchQuery ||
                                "all jobs",

                            category:
                                selectedCategory,

                            location,
                            experience,
                            jobType,
                            workMode,
                            salary,

                            resultCount:
                                paginatedJobs.length,
                        });
                    } catch (
                        historyError
                    ) {
                        console.error(
                            "Search History Save Error:",
                            historyError.message
                        );
                    }
                }
            );

            return res.json({
                success: true,

                count:
                    paginatedJobs.length,

                total,

                filtered_total:
                    total,

                filtered_count:
                    paginatedJobs.length,

                page:
                    pageNumber,

                results_per_page:
                    RESULTS_PER_PAGE,

                total_pages:
                    totalPages,

                has_more:
                    hasMore,

                experience,
                jobType,
                workMode,
                salary,

                category:
                    selectedCategory ||
                    "All",

                filtered_pages_scanned:
                    0,

                jobs_scanned:
                    matchingStoredJobs.length,

                jobs:
                    paginatedJobs,

                alertMatchesFound:
                    0,

                alertMatchesRecorded:
                    0,

                notificationsCreated:
                    0,

                store: {
                    stored: 0,
                    updated: 0,
                    total:
                        storedJobs.length,
                },

                backgroundRefresh: true,
            });
        } catch (error) {
            console.error(
                "\n❌ Jobs API Error:",
                error?.response?.data ||
                    error?.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to fetch jobs",

                    error:
                        error?.response?.data ||
                        error?.message,
                });
        }
    }
);

// ======================================================
// WARM JOB STORE
// GET /api/jobs/warm
// ======================================================

router.get(
    "/warm",
    (req, res) => {
        const requestStartedAt =
            Date.now();

        try {
            const storeStatus =
                getJobStoreStatus();

            const storedJobs =
                getAllStoredJobs();

            const storedCount =
                Array.isArray(storedJobs)
                    ? storedJobs.length
                    : 0;

            const freshJobs =
                Number(
                    storeStatus?.freshJobs ||
                        0
                );

            if (
                storedCount > 0 &&
                freshJobs > 0
            ) {
                console.log(
                    `\n🔥 /api/jobs/warm → ALREADY WARM`
                );

                return res.json({
                    success: true,
                    warm: true,
                    warming: false,
                    alreadyWarm: true,

                    message:
                        "CareerOS job store is already warm.",

                    jobs:
                        storedCount,

                    freshJobs,

                    providerTotal:
                        getAllJobsOriginalTotal(),

                    store:
                        storeStatus,

                    warmState: {
                        isWarming:
                            warmState.isWarming,

                        startedAt:
                            warmState.startedAt,

                        completedAt:
                            warmState.completedAt,

                        failedAt:
                            warmState.failedAt,

                        fetchedCount:
                            warmState.fetchedCount,

                        storedCount:
                            warmState.storedCount,

                        updatedCount:
                            warmState.updatedCount,

                        error:
                            warmState.error,
                    },

                    responseTimeMs:
                        Date.now() -
                        requestStartedAt,
                });
            }

            if (
                warmState.isWarming
            ) {
                return res
                    .status(202)
                    .json({
                        success: true,
                        warm: false,
                        warming: true,
                        alreadyWarm: false,

                        message:
                            "CareerOS job store is currently warming in the background.",

                        jobs:
                            storedCount,

                        freshJobs,

                        providerTotal:
                            getAllJobsOriginalTotal(),

                        warmState: {
                            isWarming: true,

                            startedAt:
                                warmState.startedAt,

                            completedAt:
                                warmState.completedAt,

                            failedAt:
                                warmState.failedAt,

                            fetchedCount:
                                warmState.fetchedCount,

                            storedCount:
                                warmState.storedCount,

                            updatedCount:
                                warmState.updatedCount,

                            error:
                                warmState.error,
                        },

                        responseTimeMs:
                            Date.now() -
                            requestStartedAt,
                    });
            }

            console.log(
                `\n🔥 /api/jobs/warm → STARTING BACKGROUND WARM`
            );

            warmJobStore().catch(
                (error) => {
                    console.error(
                        "❌ Background job warm failed:",
                        error?.message ||
                            error
                    );
                }
            );

            return res
                .status(202)
                .json({
                    success: true,
                    warm: false,
                    warming: true,
                    alreadyWarm: false,

                    message:
                        "CareerOS job store warming started in the background.",

                    jobs:
                        storedCount,

                    freshJobs,

                    providerTotal:
                        getAllJobsOriginalTotal(),

                    warmState: {
                        isWarming: true,

                        startedAt:
                            warmState.startedAt,

                        completedAt:
                            null,

                        failedAt:
                            null,

                        fetchedCount:
                            0,

                        storedCount:
                            0,

                        updatedCount:
                            0,

                        error:
                            null,
                    },

                    responseTimeMs:
                        Date.now() -
                        requestStartedAt,
                });
        } catch (error) {
            console.error(
                "❌ Job Warm API Error:",
                error?.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    warm: false,

                    warming: false,

                    message:
                        "Failed to warm CareerOS job store.",

                    error:
                        error?.message ||
                        "Unknown error",
                });
        }
    }
);

// ======================================================
// COMPANIES
// GET /api/jobs/companies
// ======================================================

router.get(
    "/companies",
    (req, res) => {
        const requestStartedAt =
            Date.now();

        try {
            const {
                search = "",
                location = "All Locations",
                category = "All Categories",
                page = 1,
            } = req.query;

            const normalizedSearch =
                typeof search === "string"
                    ? search.trim().toLowerCase()
                    : "";

            const selectedLocation =
                typeof location === "string"
                    ? location.trim()
                    : "All Locations";

            const selectedCategory =
                typeof category === "string"
                    ? category.trim()
                    : "All Categories";

            const pageNumber =
                Math.min(
                    Math.max(
                        Number(page) || 1,
                        1
                    ),
                    100
                );

            // ==================================================
            // USE COMPANY CACHE
            // ==================================================

            const allCompanies =
                getCompanyCache();

            // ==================================================
            // APPLY REQUEST FILTERS
            // ==================================================

            const filteredCompanies =
                allCompanies.filter(
                    (company) => {
                        if (
                            selectedLocation !==
                                "All Locations" &&
                            company.location !==
                                selectedLocation
                        ) {
                            return false;
                        }

                        if (
                            selectedCategory !==
                                "All Categories" &&
                            company.category !==
                                selectedCategory
                        ) {
                            return false;
                        }

                        if (
                            normalizedSearch
                        ) {
                            const searchableText =
                                [
                                    company.name,
                                    company.category,
                                    company.location,
                                ]
                                    .filter(Boolean)
                                    .join(" ")
                                    .toLowerCase();

                            if (
                                !searchableText.includes(
                                    normalizedSearch
                                )
                            ) {
                                return false;
                            }
                        }

                        return true;
                    }
                );

            const totalCompanies =
                filteredCompanies.length;

            const totalPages =
                totalCompanies > 0
                    ? Math.ceil(
                          totalCompanies /
                              RESULTS_PER_PAGE
                      )
                    : 0;

            const startIndex =
                (pageNumber - 1) *
                RESULTS_PER_PAGE;

            const endIndex =
                startIndex +
                RESULTS_PER_PAGE;

            const companies =
                filteredCompanies.slice(
                    startIndex,
                    endIndex
                );

            const hasMore =
                endIndex <
                totalCompanies;

            const storedJobs =
                getAllStoredJobs();

            const jobs =
                Array.isArray(storedJobs)
                    ? storedJobs
                    : [];

            console.log(
                `📊 Companies found: ${totalCompanies}`
            );

            console.log(
                `📦 Companies returned: ${companies.length}`
            );

            console.log(
                `📦 Company cache version: ${companyCacheVersion}`
            );

            console.log(
                `⚡ /api/jobs/companies completed in ${
                    Date.now() -
                    requestStartedAt
                } ms`
            );

            return res.json({
                success: true,

                count:
                    companies.length,

                total:
                    totalCompanies,

                filtered_total:
                    totalCompanies,

                filtered_count:
                    companies.length,

                page:
                    pageNumber,

                results_per_page:
                    RESULTS_PER_PAGE,

                total_pages:
                    totalPages,

                has_more:
                    hasMore,

                jobs_scanned:
                    jobs.length,

                companies,

                filters: {
                    search:
                        search || "",

                    location:
                        selectedLocation,

                    category:
                        selectedCategory,
                },
            });
        } catch (error) {
            console.error(
                "\n❌ Companies API Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to load companies",

                    error:
                        error.message,
                });
        }
    }
);

// ======================================================
// JOB STORE STATUS
// GET /api/jobs/status
// ======================================================

router.get(
    "/status",
    (req, res) => {
        try {
            const status =
                getJobStoreStatus();

            return res.json({
                success: true,

                status,

                providerTotal:
                    getAllJobsOriginalTotal(),
            });
        } catch (error) {
            console.error(
                "Job Store Status Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to get job store status",

                    error:
                        error.message,
                });
        }
    }
);

// ======================================================
// RELATED JOBS
// ======================================================

router.get(
    "/:id/related",
    async (req, res) => {
        try {
            const rawId =
                req.params.id;

            const normalizedId =
                normalizeJobId(rawId);

            if (!normalizedId) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job ID is required",
                    });
            }

            console.log(
                `\n🔗 Related Jobs Request`
            );

            console.log(
                `🔗 Raw ID: ${rawId}`
            );

            console.log(
                `🔗 Normalized ID: ${normalizedId}`
            );

            const currentJob =
                findStoredJobById(
                    normalizedId
                );

            if (!currentJob) {
                console.warn(
                    `⚠️ Related jobs: job not found for ID: ${normalizedId}`
                );

                return res
                    .status(404)
                    .json({
                        success: false,

                        message:
                            "Job not found",
                    });
            }

            let relatedJobs =
                getRelatedJobs(
                    currentJob,
                    4
                );

            // ==================================================
            // BACKGROUND RELATED FALLBACK
            // ==================================================

            if (
                relatedJobs.length < 4
            ) {
                const currentJobId =
                    String(
                        currentJob.id || ""
                    );

                const refreshKey =
                    currentJobId ||
                    normalizedId;

                if (
                    !backgroundRefreshState.related.has(
                        refreshKey
                    )
                ) {
                    backgroundRefreshState.related.add(
                        refreshKey
                    );

                    Promise.resolve()
                        .then(async () => {
                            const title =
                                currentJob.title ||
                                "";

                            const category =
                                typeof currentJob.category ===
                                "string"
                                    ? currentJob.category
                                    : currentJob
                                          .category
                                          ?.label ||
                                      "";

                            const searchQuery = [
                                title,
                                category,
                            ]
                                .filter(Boolean)
                                .join(" ");

                            const location =
                                typeof currentJob.location ===
                                "string"
                                    ? currentJob.location
                                    : currentJob
                                          .location
                                          ?.display_name ||
                                      "India";

                            console.log(
                                `🔄 Background related-job refresh started for ${currentJobId}`
                            );

                            const fallbackData =
                                await searchJobs({
                                    query:
                                        searchQuery ||
                                        "software engineer",

                                    location,

                                    page: 1,

                                    experience:
                                        "Any Experience",

                                    jobType:
                                        "Any Type",

                                    workMode:
                                        "Any",

                                    salary:
                                        "Any Salary",
                                });

                            const fallbackJobs =
                                Array.isArray(
                                    fallbackData?.results
                                )
                                    ? fallbackData.results
                                    : [];

                            if (
                                fallbackJobs.length > 0
                            ) {
                                const result =
                                    storeJobsAndInvalidateCompanyCache(
                                        fallbackJobs
                                    );

                                console.log(
                                    `✅ Background related-job refresh completed: ${fallbackJobs.length} fetched, ${result.stored} new, ${result.updated} updated`
                                );
                            } else {
                                console.log(
                                    `⚠️ Background related-job refresh returned no jobs for ${currentJobId}`
                                );
                            }
                        })
                        .catch((fallbackError) => {
                            console.error(
                                "❌ Background related jobs fallback search failed:",
                                fallbackError?.response
                                    ?.data ||
                                    fallbackError?.message
                            );
                        })
                        .finally(() => {
                            backgroundRefreshState.related.delete(
                                refreshKey
                            );
                        });
                }
            }

            // ==================================================
            // ADDITIONAL STORED RELATED JOBS
            // ==================================================

            if (
                relatedJobs.length < 4
            ) {
                const storedJobs =
                    getAllStoredJobs();

                const currentId =
                    String(
                        currentJob.id
                    );

                const additionalJobs =
                    storedJobs.filter(
                        (job) =>
                            String(
                                job.id
                            ) !==
                                currentId &&
                            !relatedJobs.some(
                                (related) =>
                                    String(
                                        related.id
                                    ) ===
                                    String(
                                        job.id
                                    )
                            )
                    );

                relatedJobs = [
                    ...relatedJobs,
                    ...additionalJobs,
                ].slice(
                    0,
                    4
                );
            }

            console.log(
                `🔗 Related jobs returned immediately: ${relatedJobs.length}`
            );

            return res.json({
                success: true,

                count:
                    relatedJobs.length,

                jobs:
                    relatedJobs,

                backgroundRefresh:
                    relatedJobs.length < 4,
            });
        } catch (error) {
            console.error(
                "Related Jobs Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to load related jobs",

                    error:
                        error.message,
                });
        }
    }
);

// ======================================================
// GET SINGLE JOB
// GET /api/jobs/:id
// ======================================================

router.get(
    "/:id",
    (req, res) => {
        try {
            const rawId =
                req.params.id;

            const normalizedId =
                normalizeJobId(
                    rawId
                );

            if (!normalizedId) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Job ID is required",
                    });
            }

            console.log(
                `\n🔎 Job Details Request`
            );

            console.log(
                `🔎 Raw ID: ${rawId}`
            );

            console.log(
                `🔎 Normalized ID: ${normalizedId}`
            );

            const job =
                findStoredJobById(
                    normalizedId
                );

            if (!job) {
                console.warn(
                    `⚠️ Job not found for ID: ${normalizedId}`
                );

                return res
                    .status(404)
                    .json({
                        success: false,

                        message:
                            "Job not found. Please search for the job again.",
                    });
            }

            return res.json({
                success: true,

                job,
            });
        } catch (error) {
            console.error(
                "Job Details Error:",
                error.message
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Failed to fetch job details",

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