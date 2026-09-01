import axios from "axios";

import {
    rankJobs,
    getRecommendedJobs,
    getTopRecommendedJob,
    getHighMatchJobs,
    getExcellentMatchJobs,
    getRecommendationSummary,
} from "./jobRecommendationService";

import {
    getAuth,
} from "firebase/auth";

// ======================================================
// API CONFIGURATION
// ======================================================

const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://career-os-api-1h85.onrender.com/api";

// ======================================================
// FRONTEND REQUEST CACHE
// ======================================================

const JOBS_CACHE_TTL =
    30 * 1000;

const JOB_DETAILS_CACHE_TTL =
    60 * 1000;

const RELATED_JOBS_CACHE_TTL =
    30 * 1000;

const JOB_STORE_STATUS_CACHE_TTL =
    10 * 1000;

const jobsCache = new Map();

const jobDetailsCache = new Map();

const relatedJobsCache = new Map();

const jobStoreStatusCache = {
    data: null,
    timestamp: 0,
};

const jobsInFlight = new Map();

const jobDetailsInFlight = new Map();

const relatedJobsInFlight = new Map();

const jobStoreStatusInFlight = {
    promise: null,
};

// ======================================================
// FIREBASE AUTH TOKEN
// ======================================================

async function getFirebaseIdToken() {
    const auth = getAuth();

    const user =
        auth.currentUser;

    if (!user) {
        throw new Error(
            "Authentication required. Please log in again."
        );
    }

    const token =
        await user.getIdToken();

    if (!token) {
        throw new Error(
            "Authentication required. Firebase ID token is missing."
        );
    }

    return token;
}

// ======================================================
// AUTHENTICATED REQUEST CONFIG
// ======================================================

async function getAuthenticatedRequestConfig(
    config = {}
) {
    const token =
        await getFirebaseIdToken();

    return {
        ...config,

        headers: {
            ...(config.headers || {}),

            Authorization:
                `Bearer ${token}`,
        },
    };
}

// ======================================================
// CACHE HELPERS
// ======================================================

function getCachedValue(
    cache,
    key,
    ttl
) {
    const cached =
        cache.get(key);

    if (!cached) {
        return null;
    }

    const age =
        Date.now() -
        cached.timestamp;

    if (age >= ttl) {
        cache.delete(key);

        return null;
    }

    return cached.data;
}

function setCachedValue(
    cache,
    key,
    data
) {
    cache.set(
        key,
        {
            data,
            timestamp: Date.now(),
        }
    );
}

// ======================================================
// REQUEST KEY HELPER
// ======================================================

function createRequestKey(
    params = {}
) {
    return Object.keys(params)
        .sort()
        .map(
            (key) =>
                `${encodeURIComponent(
                    key
                )}=${encodeURIComponent(
                    params[key] ?? ""
                )}`
        )
        .join("&");
}

// ======================================================
// CLEAR JOB CACHE
// ======================================================

export function clearJobsCache() {
    jobsCache.clear();
    relatedJobsCache.clear();
}

export function clearJobDetailsCache() {
    jobDetailsCache.clear();
}

export function clearAllJobApiCaches() {
    jobsCache.clear();
    jobDetailsCache.clear();
    relatedJobsCache.clear();

    jobStoreStatusCache.data =
        null;

    jobStoreStatusCache.timestamp =
        0;
}

// ======================================================
// JOB ID HELPERS
// ======================================================

function normalizeJobId(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    const rawValue =
        String(value).trim();

    if (!rawValue) {
        return "";
    }

    // ==================================================
    // ALREADY A SIMPLE ID
    // ==================================================

    if (
        !rawValue.includes("/") &&
        !rawValue.includes("?") &&
        !rawValue.includes("&")
    ) {
        return rawValue;
    }

    // ==================================================
    // TRY URL PARSING
    // ==================================================

    try {
        const parsedUrl =
            new URL(rawValue);

        const pathname =
            parsedUrl.pathname || "";

        // ==================================================
        // ADZUNA /land/ad/:id
        // ==================================================

        const landAdMatch =
            pathname.match(
                /\/land\/ad\/([^/]+)/i
            );

        if (
            landAdMatch?.[1]
        ) {
            return decodeURIComponent(
                landAdMatch[1]
            );
        }

        // ==================================================
        // ADZUNA /details/:id
        // ==================================================

        const detailsMatch =
            pathname.match(
                /\/details\/([^/]+)/i
            );

        if (
            detailsMatch?.[1]
        ) {
            return decodeURIComponent(
                detailsMatch[1]
            );
        }

        // ==================================================
        // GENERIC FINAL PATHNAME SEGMENT
        // ==================================================

        const segments =
            pathname
                .split("/")
                .filter(Boolean);

        if (
            segments.length > 0
        ) {
            const lastSegment =
                segments[
                    segments.length - 1
                ];

            if (
                lastSegment &&
                !lastSegment.includes(".")
            ) {
                return decodeURIComponent(
                    lastSegment
                );
            }
        }
    } catch {
        // ==================================================
        // NOT A VALID URL
        //
        // Continue with regex fallback.
        // ==================================================
    }

    // ==================================================
    // FALLBACK REGEX
    // ==================================================

    const landAdRegex =
        /\/land\/ad\/([^/?&#]+)/i;

    const landMatch =
        rawValue.match(
            landAdRegex
        );

    if (
        landMatch?.[1]
    ) {
        return decodeURIComponent(
            landMatch[1]
        );
    }

    const detailsRegex =
        /\/details\/([^/?&#]+)/i;

    const detailsMatch =
        rawValue.match(
            detailsRegex
        );

    if (
        detailsMatch?.[1]
    ) {
        return decodeURIComponent(
            detailsMatch[1]
        );
    }

    // ==================================================
    // FALLBACK
    // ==================================================

    return rawValue;
}

// ======================================================
// GET JOBS
// ======================================================

export async function getJobs({
    career = "",
    category = "",
    location = "India",
    page = 1,
    experience = "Any Experience",
    jobType = "Any Type",
    workMode = "Any",
    salary = "Any Salary",
} = {}) {
    // ==================================================
    // NORMALIZE CATEGORY
    // ==================================================

    const normalizedCategory =
        typeof category === "string"
            ? category.trim()
            : "";

    // ==================================================
    // CATEGORY IS REQUIRED
    // ==================================================

    const effectiveCategory =
        normalizedCategory;

    // ==================================================
    // NORMALIZE SEARCH QUERY
    // ==================================================

    const normalizedCareer =
        typeof career === "string"
            ? career.trim()
            : "";

    // ==================================================
    // NORMALIZE LOCATION
    // ==================================================

    const normalizedLocation =
        typeof location === "string" &&
        location.trim()
            ? location.trim()
            : "India";

    // ==================================================
    // NORMALIZE PAGE
    // ==================================================

    const normalizedPage =
        Number.isFinite(Number(page)) &&
        Number(page) >= 1
            ? Number(page)
            : 1;

    // ==================================================
    // NORMALIZE EXPERIENCE
    // ==================================================

    const normalizedExperience =
        typeof experience === "string" &&
        experience.trim()
            ? experience.trim()
            : "Any Experience";

    // ==================================================
    // NORMALIZE JOB TYPE
    // ==================================================

    const normalizedJobType =
        typeof jobType === "string" &&
        jobType.trim()
            ? jobType.trim()
            : "Any Type";

    // ==================================================
    // NORMALIZE WORK MODE
    // ==================================================

    const normalizedWorkMode =
        typeof workMode === "string" &&
        workMode.trim()
            ? workMode.trim()
            : "Any";

    // ==================================================
    // NORMALIZE SALARY
    // ==================================================

    const normalizedSalary =
        typeof salary === "string" &&
        salary.trim()
            ? salary.trim()
            : "Any Salary";

    // ==================================================
    // BUILD REQUEST PARAMS
    // ==================================================

    const params = {
        category:
            effectiveCategory,

        location:
            normalizedLocation,

        page:
            normalizedPage,

        experience:
            normalizedExperience,

        jobType:
            normalizedJobType,

        workMode:
            normalizedWorkMode,

        salary:
            normalizedSalary,
    };

    // ==================================================
    // ONLY SEND QUERY WHEN USER ENTERED ONE
    // ==================================================

    if (normalizedCareer) {
        params.query =
            normalizedCareer;
    }

    // ==================================================
    // CREATE REQUEST KEY
    // ==================================================

    const requestKey =
        createRequestKey(params);

    // ==================================================
    // RETURN VALID CACHED RESPONSE
    // ==================================================

    const cachedResponse =
        getCachedValue(
            jobsCache,
            requestKey,
            JOBS_CACHE_TTL
        );

    if (cachedResponse) {
        return cachedResponse;
    }

    // ==================================================
    // DEDUPLICATE IDENTICAL IN-FLIGHT REQUESTS
    // ==================================================

    const existingRequest =
        jobsInFlight.get(
            requestKey
        );

    if (existingRequest) {
        return existingRequest;
    }

    // ==================================================
    // CREATE AUTHENTICATED REQUEST
    // ==================================================

    const requestPromise =
        getAuthenticatedRequestConfig({
            params,

            timeout: 60000,
        })
            .then(
                (config) =>
                    axios.get(
                        `${API_URL}/jobs`,
                        config
                    )
            )
            .then(
                (response) => {
                    const data =
                        response.data;

                    setCachedValue(
                        jobsCache,
                        requestKey,
                        data
                    );

                    return data;
                }
            )
            .catch(
                (error) => {
                    console.error(
                        "CareerOS getJobs Error:",
                        error
                    );

                    if (
                        error.code ===
                        "ECONNABORTED"
                    ) {
                        throw new Error(
                            "The jobs request took too long. Please try again."
                        );
                    }

                    const message =
                        error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        "Failed to fetch jobs.";

                    throw new Error(
                        message,
                        {
                            cause: error,
                        }
                    );
                }
            )
            .finally(
                () => {
                    jobsInFlight.delete(
                        requestKey
                    );
                }
            );

    jobsInFlight.set(
        requestKey,
        requestPromise
    );

    return requestPromise;
}

// ======================================================
// GET RECOMMENDED JOBS
// ======================================================

export async function getRecommendedJobsFromAPI({
    career = "",
    category = "",
    location = "India",
    page = 1,
    experience = "Any Experience",
    jobType = "Any Type",
    workMode = "Any",
    salary = "Any Salary",

    student,

    limit = 10,

    minimumScore = 0,
} = {}) {
    // ==================================================
    // STUDENT PROFILE REQUIRED
    // ==================================================

    if (!student) {
        throw new Error(
            "Student profile is required for job recommendations."
        );
    }

    // ==================================================
    // CATEGORY-FIRST
    // ==================================================

    if (
        typeof category !== "string" ||
        !category.trim()
    ) {
        return {
            success: true,

            jobs: [],

            recommendations: [],

            totalJobs: 0,

            recommendedCount: 0,
        };
    }

    // ==================================================
    // FETCH CATEGORY JOBS
    // ==================================================

    const response =
        await getJobs({
            career,

            category,

            location,

            page,

            experience,

            jobType,

            workMode,

            salary,
        });

    // ==================================================
    // SUPPORT COMMON API RESPONSE STRUCTURES
    // ==================================================

    let jobs = [];

    if (Array.isArray(response)) {
        jobs = response;
    } else if (
        Array.isArray(
            response?.jobs
        )
    ) {
        jobs =
            response.jobs;
    } else if (
        Array.isArray(
            response?.data
        )
    ) {
        jobs =
            response.data;
    } else if (
        Array.isArray(
            response?.results
        )
    ) {
        jobs =
            response.results;
    }

    // ==================================================
    // RANK JOBS
    // ==================================================

    const rankedJobs =
        getRecommendedJobs(
            jobs,
            student,
            {
                limit,

                minimumScore,
            }
        );

    // ==================================================
    // RETURN ORIGINAL API DATA
    // + RECOMMENDATIONS
    // ==================================================

    return {
        ...(
            response &&
            typeof response ===
                "object" &&
            !Array.isArray(response)
                ? response
                : {}
        ),

        jobs:
            rankedJobs.map(
                (item) =>
                    item.job
            ),

        recommendations:
            rankedJobs,

        totalJobs:
            jobs.length,

        recommendedCount:
            rankedJobs.length,
    };
}

// ======================================================
// RANK ALREADY FETCHED JOBS
// ======================================================

export function rankFetchedJobs(
    jobs,
    student
) {
    return rankJobs(
        jobs,
        student
    );
}

// ======================================================
// GET RECOMMENDATIONS FROM ALREADY FETCHED JOBS
// ======================================================

export function getRecommendedJobsFromFetchedJobs(
    jobs,
    student,
    {
        limit = 10,
        minimumScore = 0,
    } = {}
) {
    return getRecommendedJobs(
        jobs,
        student,
        {
            limit,

            minimumScore,
        }
    );
}

// ======================================================
// GET TOP RECOMMENDED JOB
// ======================================================

export function getTopRecommendedJobFromFetchedJobs(
    jobs,
    student
) {
    return getTopRecommendedJob(
        jobs,
        student
    );
}

// ======================================================
// GET HIGH MATCH JOBS
// ======================================================

export function getHighMatchJobsFromFetchedJobs(
    jobs,
    student
) {
    return getHighMatchJobs(
        jobs,
        student
    );
}

// ======================================================
// GET EXCELLENT MATCH JOBS
// ======================================================

export function getExcellentMatchJobsFromFetchedJobs(
    jobs,
    student
) {
    return getExcellentMatchJobs(
        jobs,
        student
    );
}

// ======================================================
// GET RECOMMENDATION SUMMARY
// ======================================================

export function getJobRecommendationSummary(
    jobs,
    student
) {
    return getRecommendationSummary(
        jobs,
        student
    );
}

// ======================================================
// GET SINGLE JOB
// ======================================================

export async function getJobById(
    id
) {
    const normalizedId =
        normalizeJobId(id);

    if (!normalizedId) {
        throw new Error(
            "Job ID is required."
        );
    }

    const requestKey =
        normalizedId;

    // ==================================================
    // CACHE
    // ==================================================

    const cachedJob =
        getCachedValue(
            jobDetailsCache,
            requestKey,
            JOB_DETAILS_CACHE_TTL
        );

    if (cachedJob) {
        return cachedJob;
    }

    // ==================================================
    // DEDUPLICATE IN-FLIGHT REQUEST
    // ==================================================

    const existingRequest =
        jobDetailsInFlight.get(
            requestKey
        );

    if (existingRequest) {
        return existingRequest;
    }

    // ==================================================
    // AUTHENTICATED REQUEST
    // ==================================================

    const requestPromise =
        getAuthenticatedRequestConfig({
            timeout: 30000,
        })
            .then(
                (config) =>
                    axios.get(
                        `${API_URL}/jobs/${encodeURIComponent(
                            normalizedId
                        )}`,
                        config
                    )
            )
            .then(
                (response) => {
                    const data =
                        response.data;

                    setCachedValue(
                        jobDetailsCache,
                        requestKey,
                        data
                    );

                    return data;
                }
            )
            .catch(
                (error) => {
                    console.error(
                        "CareerOS getJobById Error:",
                        error
                    );

                    const message =
                        error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        "Failed to fetch job details.";

                    throw new Error(
                        message,
                        {
                            cause: error,
                        }
                    );
                }
            )
            .finally(
                () => {
                    jobDetailsInFlight.delete(
                        requestKey
                    );
                }
            );

    jobDetailsInFlight.set(
        requestKey,
        requestPromise
    );

    return requestPromise;
}

// ======================================================
// GET RELATED JOBS
// ======================================================

export async function getRelatedJobs(
    id
) {
    const normalizedId =
        normalizeJobId(id);

    if (!normalizedId) {
        throw new Error(
            "Job ID is required."
        );
    }

    const requestKey =
        normalizedId;

    // ==================================================
    // CACHE
    // ==================================================

    const cachedRelatedJobs =
        getCachedValue(
            relatedJobsCache,
            requestKey,
            RELATED_JOBS_CACHE_TTL
        );

    if (cachedRelatedJobs) {
        return cachedRelatedJobs;
    }

    // ==================================================
    // DEDUPLICATE IN-FLIGHT REQUEST
    // ==================================================

    const existingRequest =
        relatedJobsInFlight.get(
            requestKey
        );

    if (existingRequest) {
        return existingRequest;
    }

    // ==================================================
    // AUTHENTICATED REQUEST
    // ==================================================

    const requestPromise =
        getAuthenticatedRequestConfig({
            timeout: 30000,
        })
            .then(
                (config) =>
                    axios.get(
                        `${API_URL}/jobs/${encodeURIComponent(
                            normalizedId
                        )}/related`,
                        config
                    )
            )
            .then(
                (response) => {
                    const data =
                        response.data;

                    setCachedValue(
                        relatedJobsCache,
                        requestKey,
                        data
                    );

                    return data;
                }
            )
            .catch(
                (error) => {
                    console.error(
                        "CareerOS getRelatedJobs Error:",
                        error
                    );

                    const message =
                        error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        "Failed to fetch related jobs.";

                    throw new Error(
                        message,
                        {
                            cause: error,
                        }
                    );
                }
            )
            .finally(
                () => {
                    relatedJobsInFlight.delete(
                        requestKey
                    );
                }
            );

    relatedJobsInFlight.set(
        requestKey,
        requestPromise
    );

    return requestPromise;
}

// ======================================================
// GET JOB STORE STATUS
// ======================================================

export async function getJobStoreStatus() {
    // ==================================================
    // RETURN SHORT-LIVED CACHE
    // ==================================================

    if (
        jobStoreStatusCache.data &&
        Date.now() -
            jobStoreStatusCache.timestamp <
            JOB_STORE_STATUS_CACHE_TTL
    ) {
        return jobStoreStatusCache.data;
    }

    // ==================================================
    // DEDUPLICATE IN-FLIGHT REQUEST
    // ==================================================

    if (
        jobStoreStatusInFlight.promise
    ) {
        return (
            jobStoreStatusInFlight
                .promise
        );
    }

    // ==================================================
    // REQUEST
    // ==================================================

    const requestPromise =
        axios
            .get(
                `${API_URL}/jobs/status`,
                {
                    timeout: 15000,
                }
            )
            .then(
                (response) => {
                    jobStoreStatusCache.data =
                        response.data;

                    jobStoreStatusCache.timestamp =
                        Date.now();

                    return response.data;
                }
            )
            .catch(
                (error) => {
                    console.error(
                        "CareerOS getJobStoreStatus Error:",
                        error
                    );

                    const message =
                        error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        "Failed to fetch job store status.";

                    throw new Error(
                        message,
                        {
                            cause: error,
                        }
                    );
                }
            )
            .finally(
                () => {
                    jobStoreStatusInFlight.promise =
                        null;
                }
            );

    jobStoreStatusInFlight.promise =
        requestPromise;

    return requestPromise;
}

// ======================================================
// GET REFRESH STATUS
// ======================================================

export async function getJobRefreshStatus() {
    try {
        const response =
            await axios.get(
                `${API_URL}/jobs/refresh-status`,
                {
                    timeout: 15000,
                }
            );

        return response.data;
    } catch (error) {
        console.error(
            "CareerOS getJobRefreshStatus Error:",
            error
        );

        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to fetch refresh status.";

        throw new Error(
            message,
            {
                cause: error,
            }
        );
    }
}