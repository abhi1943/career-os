import axios from "axios";

import {
    rankJobs,
    getRecommendedJobs,
    getTopRecommendedJob,
    getHighMatchJobs,
    getExcellentMatchJobs,
    getRecommendationSummary,
} from "./jobRecommendationService";

// ======================================================
// API CONFIGURATION
// ======================================================

const API_URL =
    "http://localhost:5000/api";

// ======================================================
// GET JOBS
// ======================================================

export async function getJobs({
    career = "all jobs",
    category = "",
    location = "India",
    page = 1,
    experience = "Any Experience",
    jobType = "Any Type",
    workMode = "Any",
    salary = "Any Salary",
} = {}) {
    try {
        const response =
            await axios.get(
                `${API_URL}/jobs`,
                {
                    params: {
                        query:
                            career,
                        category,

                        location,

                        page,

                        experience,

                        jobType,

                        workMode,

                        salary,
                    },
                }
            );

        return response.data;

    } catch (error) {
        console.error(
            "CareerOS getJobs Error:",
            error
        );

        const message =
            error.response
                ?.data
                ?.message ||
            error.message ||
            "Failed to fetch jobs.";

        throw new Error(
            message,
            {
                cause: error,
            }
        );
    }
}

// ======================================================
// GET RECOMMENDED JOBS
// ======================================================
//
// Fetches jobs from the backend and then ranks them
// using the student's CareerOS profile.
//
// This keeps API fetching and recommendation logic
// connected without moving recommendation logic
// into the backend.
// ======================================================

export async function getRecommendedJobsFromAPI({
    career = "all jobs",
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
    if (!student) {
        throw new Error(
            "Student profile is required for job recommendations."
        );
    }

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

    // --------------------------------------------------
    // SUPPORT COMMON API RESPONSE STRUCTURES
    // --------------------------------------------------

    let jobs = [];

    if (Array.isArray(response)) {
        jobs = response;
    } else if (
        Array.isArray(response?.jobs)
    ) {
        jobs = response.jobs;
    } else if (
        Array.isArray(response?.data)
    ) {
        jobs = response.data;
    } else if (
        Array.isArray(response?.results)
    ) {
        jobs = response.results;
    }

    // --------------------------------------------------
    // RANK JOBS
    // --------------------------------------------------

    const rankedJobs =
        getRecommendedJobs(
            jobs,
            student,
            {
                limit,
                minimumScore,
            }
        );

    // --------------------------------------------------
    // RETURN ORIGINAL API DATA + RECOMMENDATIONS
    // --------------------------------------------------

    return {
        ...(
            response &&
            typeof response === "object" &&
            !Array.isArray(response)
                ? response
                : {}
        ),

        jobs: rankedJobs.map(
            (item) => item.job
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
//
// Use this when the page already has jobs and we don't
// need another API request.
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
// GET TOP RECOMMENDED JOB FROM FETCHED JOBS
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
// GET HIGH MATCH JOBS FROM FETCHED JOBS
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
// GET EXCELLENT MATCH JOBS FROM FETCHED JOBS
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
    if (!id) {
        throw new Error(
            "Job ID is required."
        );
    }

    try {
        const response =
            await axios.get(
                `${API_URL}/jobs/${encodeURIComponent(
                    id
                )}`
            );

        return response.data;

    } catch (error) {
        console.error(
            "CareerOS getJobById Error:",
            error
        );

        const message =
            error.response
                ?.data
                ?.message ||
            error.message ||
            "Failed to fetch job details.";

        throw new Error(
            message,
            {
                cause: error,
            }
        );
    }
}

// ======================================================
// GET RELATED JOBS
// ======================================================

export async function getRelatedJobs(
    id
) {
    if (!id) {
        throw new Error(
            "Job ID is required."
        );
    }

    try {
        const response =
            await axios.get(
                `${API_URL}/jobs/${encodeURIComponent(
                    id
                )}/related`
            );

        return response.data;

    } catch (error) {
        console.error(
            "CareerOS getRelatedJobs Error:",
            error
        );

        const message =
            error.response
                ?.data
                ?.message ||
            error.message ||
            "Failed to fetch related jobs.";

        throw new Error(
            message,
            {
                cause: error,
            }
        );
    }
}

// ======================================================
// GET JOB STORE STATUS
// ======================================================

export async function getJobStoreStatus() {
    try {
        const response =
            await axios.get(
                `${API_URL}/jobs/status`
            );

        return response.data;

    } catch (error) {
        console.error(
            "CareerOS getJobStoreStatus Error:",
            error
        );

        const message =
            error.response
                ?.data
                ?.message ||
            error.message ||
            "Failed to fetch job store status.";

        throw new Error(
            message,
            {
                cause: error,
            }
        );
    }
}

// ======================================================
// GET REFRESH STATUS
// ======================================================

export async function getJobRefreshStatus() {
    try {
        const response =
            await axios.get(
                `${API_URL}/jobs/refresh-status`
            );

        return response.data;

    } catch (error) {
        console.error(
            "CareerOS getJobRefreshStatus Error:",
            error
        );

        const message =
            error.response
                ?.data
                ?.message ||
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