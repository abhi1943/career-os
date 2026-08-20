import axios from "axios";

import { auth } from "../firebase/firebase";

// ======================================================
// API
// ======================================================

const API_URL =
    "http://localhost:5000/api/saved-jobs";

// ======================================================
// GET CURRENT FIREBASE USER ID
// ======================================================
//
// Firebase Auth is the source of the current user.
// The backend receives this UID through x-user-id.
//
// ======================================================

function getCurrentUserId() {
    return String(
        auth.currentUser?.uid || ""
    ).trim();
}

// ======================================================
// CREATE AUTHENTICATED REQUEST CONFIG
// ======================================================
//
// Every Saved Jobs API request must contain the
// currently logged-in Firebase user's UID.
//
// ======================================================

function getRequestConfig() {
    const userId =
        getCurrentUserId();

    if (!userId) {
        throw new Error(
            "Authentication required."
        );
    }

    return {
        headers: {
            "x-user-id": userId,
        },
    };
}

// ======================================================
// NORMALIZE JOB ID
// ======================================================
//
// CareerOS jobs can come from different sources.
// Always use the same ID format everywhere.
//
// ======================================================

export function getSavedJobId(job) {
    if (!job) {
        return "";
    }

    const id =
        job.id ||
        job.redirect_url ||
        job.redirectUrl ||
        `${job.title || ""}-${
            typeof job.company === "string"
                ? job.company
                : job.company?.display_name ||
                  job.company?.name ||
                  ""
        }`;

    return String(id).trim();
}

// ======================================================
// NORMALIZE JOB
// ======================================================
//
// Keeps the saved job object consistent across:
// Jobs → Save → Saved Jobs → Job Details
//
// ======================================================

export function normalizeSavedJob(job) {
    if (!job) {
        return null;
    }

    const jobId =
        getSavedJobId(job);

    if (!jobId) {
        return null;
    }

    return {
        ...job,
        id: jobId,
    };
}

// ======================================================
// CHECK SAVED
// ======================================================

export async function isJobSaved(jobId) {
    const normalizedJobId =
        String(jobId || "").trim();

    if (!normalizedJobId) {
        return false;
    }

    try {
        const response =
            await axios.get(
                `${API_URL}/${encodeURIComponent(
                    normalizedJobId
                )}`,
                getRequestConfig()
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

export async function saveJob(job) {
    const normalizedJob =
        normalizeSavedJob(job);

    if (!normalizedJob) {
        throw new Error(
            "Invalid job. Unable to save job."
        );
    }

    try {
        const response =
            await axios.post(
                API_URL,
                normalizedJob,
                getRequestConfig()
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
        String(jobId || "").trim();

    if (!normalizedJobId) {
        return false;
    }

    try {
        const response =
            await axios.delete(
                `${API_URL}/${encodeURIComponent(
                    normalizedJobId
                )}`,
                getRequestConfig()
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

    const jobId =
        normalizedJob.id;

    const currentlySaved =
        await isJobSaved(jobId);

    // ==================================================
    // REMOVE
    // ==================================================

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

    // ==================================================
    // SAVE
    // ==================================================

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
        const response =
            await axios.get(
                API_URL,
                getRequestConfig()
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

        // ==================================================
        // NORMALIZE + REMOVE INVALID JOBS
        // ==================================================

        const normalizedJobs =
            jobs
                .map(
                    (job) =>
                        normalizeSavedJob(
                            job
                        )
                )
                .filter(Boolean);

        // ==================================================
        // REMOVE DUPLICATES
        // ==================================================

        const seen =
            new Set();

        return normalizedJobs.filter(
            (job) => {
                const jobId =
                    getSavedJobId(
                        job
                    );

                if (
                    !jobId ||
                    seen.has(jobId)
                ) {
                    return false;
                }

                seen.add(jobId);

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
        const response =
            await axios.get(
                `${API_URL}/count`,
                getRequestConfig()
            );

        return Number(
            response?.data?.count || 0
        );
    } catch (error) {
        console.error(
            "CareerOS: Get saved job count error:",
            error.response?.data ||
                error.message
        );

        return 0;
    }
}