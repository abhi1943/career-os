
import axios from "axios";

import {
    getAuth,
} from "firebase/auth";



// ======================================================
// API
// ======================================================

const API_URL =
    "https://career-os-api-1h85.onrender.com/api/saved-jobs";


// ======================================================
// FIREBASE TOKEN
// ======================================================

async function getFirebaseIdToken() {

    const firebaseAuth =
        getAuth();

    const currentUser =
        firebaseAuth.currentUser;

    if (!currentUser) {
        throw new Error(
            "User must be authenticated."
        );
    }

    return currentUser.getIdToken();
}


// ======================================================
// REQUEST CONFIG
// ======================================================

async function getRequestConfig() {

    const token =
        await getFirebaseIdToken();

    return {
        headers: {
            Authorization:
                `Bearer ${token}`,
            "Content-Type":
                "application/json",
        },
    };
}


// ======================================================
// GET STABLE JOB ID
// ======================================================

function getSavedJobId(job) {

    if (!job) {
        return "";
    }

    const id =
        job.id ??
        job.job_id ??
        job.jobId ??
        job.redirect_url ??
        job.redirectUrl ??
        "";

    return String(id).trim();
}


// ======================================================
// ALLOWED SAVED-JOB FIELDS
// ======================================================


const SAVED_JOB_FIELDS = [
    // --------------------------------------------------
    // Core identity
    // --------------------------------------------------

    "id",
    "job_id",
    "jobId",

    // --------------------------------------------------
    // Basic job information
    // --------------------------------------------------

    "title",
    "description",

    "url",
    "redirect_url",
    "redirectUrl",

    // --------------------------------------------------
    // Company
    // --------------------------------------------------

    "company",

    "company_id",

    // --------------------------------------------------
    // Location
    // --------------------------------------------------

    "location",

    "location_area",
    "location_display_name",
    "location_country",
    "location_region",
    "location_city",
    "location_area_name",

    // --------------------------------------------------
    // Salary
    // --------------------------------------------------

    "salary",
    "salary_min",
    "salary_max",
    "salary_is_predicted",

    // --------------------------------------------------
    // Job type
    // --------------------------------------------------

    "job_type",
    "jobType",
    "detected_job_type",

    "contract_type",
    "contract_time",

    "type",

    // --------------------------------------------------
    // Work mode
    // --------------------------------------------------

    "workMode",
    "work_mode",
    "detected_work_mode",

    // --------------------------------------------------
    // Experience
    // --------------------------------------------------

    "experience",
    "detected_experience",

    "experienceLevel",
    "experience_level",

    // --------------------------------------------------
    // Category
    // --------------------------------------------------

    "category",
    "job_category",
    "jobCategory",

    "careerOSCategory",
    "careerosCategory",

    // --------------------------------------------------
    // Skills
    // --------------------------------------------------

    "skills",

    "tags",

    "technologies",

    "requirements",

    "responsibilities",

    "benefits",

    // --------------------------------------------------
    // Adzuna information
    // --------------------------------------------------

    "created",
    "created_at",

    "category_id",
    "category_label",

    "latitude",
    "longitude",

    "adref",

    "source",
    "publisher",

    "snippet",

    // --------------------------------------------------
    // Provider information
    // --------------------------------------------------

    "provider",
    "provider_id",

    "source_id",

    // --------------------------------------------------
    // Search information
    // --------------------------------------------------

    "search_query",
    "searchQuery",

    "search_location",
    "searchLocation",

    // --------------------------------------------------
    // Job metadata
    // --------------------------------------------------

    "education",
    "department",
    "industry",
    "seniority",
];


// ======================================================
// SANITIZE SAVED JOB
// ======================================================
//
// This is the important fix.
//
// CareerOS job objects can contain internal job-store
// fields. We remove those fields before sending the
// object to:
//
//     POST /api/saved-jobs
//
// This keeps the backend validation strict while allowing
// Jobs / Companies / Job Details to use enriched objects.
//
// ======================================================

export function sanitizeSavedJob(job) {

    if (
        !job ||
        typeof job !== "object" ||
        Array.isArray(job)
    ) {
        return null;
    }

    const sanitizedJob = {};

    for (
        const field of SAVED_JOB_FIELDS
    ) {

        if (
            Object.prototype.hasOwnProperty.call(
                job,
                field
            )
        ) {

            const value =
                job[field];

            if (
                value !== undefined &&
                value !== null
            ) {

                sanitizedJob[field] =
                    value;
            }
        }
    }

    // --------------------------------------------------
    // ALWAYS USE STABLE ID
    // --------------------------------------------------

    const jobId =
        getSavedJobId(job);

    if (!jobId) {
        return null;
    }

    sanitizedJob.id =
        jobId;

    // --------------------------------------------------
    // REMOVE INTERNAL / STORE FIELDS
    // --------------------------------------------------
    //
    // Explicitly delete them as an extra safety layer.
    //
    // --------------------------------------------------

    delete sanitizedJob.__CLASS__;

    delete sanitizedJob.searchText;

    delete sanitizedJob.firstSeenAt;

    delete sanitizedJob.lastUpdatedAt;

    delete sanitizedJob.storedAt;

    delete sanitizedJob.expiresAt;

    delete sanitizedJob.careeros_category;

    delete sanitizedJob.careeros_search_query;

    delete sanitizedJob.careeros_search_page;

    delete sanitizedJob.match;

    return sanitizedJob;
}


// ======================================================
// NORMALIZE JOB
// ======================================================
//
// Keeps the saved job object consistent across:
//
// Jobs
//   ↓
// Save
//   ↓
// Saved Jobs
//   ↓
// Job Details
//
// ======================================================

export function normalizeSavedJob(job) {

    const sanitizedJob =
        sanitizeSavedJob(job);

    if (!sanitizedJob) {
        return null;
    }

    return sanitizedJob;
}


// ======================================================
// CHECK SAVED
// ======================================================

export async function isJobSaved(
    jobId
) {

    const normalizedJobId =
        String(
            jobId || ""
        ).trim();

    if (!normalizedJobId) {
        return false;
    }

    try {

        const config =
            await getRequestConfig();

        const response =
            await axios.get(
                `${API_URL}/${encodeURIComponent(
                    normalizedJobId
                )}`,
                config
            );

        return Boolean(
            response?.data?.saved
        );

    } catch (error) {

        console.error(
            "CareerOS: Check saved job error:",
            error.response?.data ||
                error.message
        );

        return false;
    }
}


// ======================================================
// SAVE JOB
// ======================================================

export async function saveJob(
    job
) {

    const normalizedJob =
        normalizeSavedJob(job);

    if (!normalizedJob) {

        throw new Error(
            "Invalid job. Unable to save job."
        );
    }

    try {

        const config =
            await getRequestConfig();

        

        const response =
            await axios.post(
                API_URL,
                normalizedJob,
                config
            );

        const savedJob =
            response?.data?.job ||
            response?.data?.data ||
            null;

        if (!savedJob) {

            throw new Error(
                "Server did not return the saved job."
            );
        }

        return normalizeSavedJob(
            savedJob
        );

    } catch (error) {

        console.error(
            "CareerOS: Save job error:",
            error.response?.data ||
                error.message
        );

        throw error;
    }
}


// ======================================================
// REMOVE SAVED JOB
// ======================================================

export async function removeSavedJob(
    jobId
) {

    const normalizedJobId =
        String(
            jobId || ""
        ).trim();

    if (!normalizedJobId) {
        return false;
    }

    try {

        const config =
            await getRequestConfig();

        const response =
            await axios.delete(
                `${API_URL}/${encodeURIComponent(
                    normalizedJobId
                )}`,
                config
            );

        if (
            response?.data &&
            response.data.success === false
        ) {
            return false;
        }

        return true;

    } catch (error) {

        console.error(
            "CareerOS: Remove saved job error:",
            error.response?.data ||
                error.message
        );

        return false;
    }
}


// ======================================================
// TOGGLE SAVED JOB
// ======================================================

export async function toggleSavedJob(
    job
) {

    const normalizedJob =
        normalizeSavedJob(job);

    if (!normalizedJob) {

        throw new Error(
            "Invalid job. Unable to toggle saved state."
        );
    }

    // --------------------------------------------------
    // MAKE SURE AUTHENTICATION EXISTS
    // --------------------------------------------------

    await getFirebaseIdToken();

    const jobId =
        normalizedJob.id;

    const currentlySaved =
        await isJobSaved(
            jobId
        );

    // --------------------------------------------------
    // REMOVE
    // --------------------------------------------------

    if (currentlySaved) {

        const removed =
            await removeSavedJob(
                jobId
            );

        if (!removed) {

            throw new Error(
                "Failed to remove saved job."
            );
        }

        return false;
    }

    // --------------------------------------------------
    // SAVE
    // --------------------------------------------------

    const saved =
        await saveJob(
            normalizedJob
        );

    if (!saved) {

        throw new Error(
            "Failed to save job."
        );
    }

    return true;
}


// ======================================================
// GET ALL SAVED JOBS
// ======================================================

export async function getSavedJobs() {

    try {

        const config =
            await getRequestConfig();

        const response =
            await axios.get(
                API_URL,
                config
            );

        const jobs =
            Array.isArray(
                response?.data?.jobs
            )
                ? response.data.jobs
                : Array.isArray(
                      response?.data?.data
                  )
                ? response.data.data
                : [];

        // ------------------------------------------------
        // NORMALIZE
        // ------------------------------------------------

        const normalizedJobs =
            jobs
                .map(
                    (job) =>
                        normalizeSavedJob(
                            job
                        )
                )
                .filter(Boolean);

        // ------------------------------------------------
        // REMOVE DUPLICATES
        // ------------------------------------------------

        const seen =
            new Set();

        return normalizedJobs.filter(
            (job) => {

                const jobId =
                    getSavedJobId(
                        job
                    );

                if (!jobId) {
                    return false;
                }

                if (
                    seen.has(jobId)
                ) {
                    return false;
                }

                seen.add(
                    jobId
                );

                return true;
            }
        );

    } catch (error) {

        console.error(
            "CareerOS: Get saved jobs error:",
            error.response?.data ||
                error.message
        );

        return [];
    }
}

// ======================================================
// GET SAVED JOB COUNT
// ======================================================

export async function getSavedJobCount() {
    try {
        const jobs = await getSavedJobs();

        return Array.isArray(jobs)
            ? jobs.length
            : 0;

    } catch (error) {
        console.error(
            "CareerOS: Get saved job count error:",
            error.response?.data ||
                error.message
        );

        return 0;
    }
}

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default {
    saveJob,
    removeSavedJob,
    toggleSavedJob,
    isJobSaved,
    getSavedJobs,
    getSavedJobCount,
    normalizeSavedJob,
    sanitizeSavedJob,
};