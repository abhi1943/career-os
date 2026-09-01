import axios from "axios";

import { auth } from "../firebase/firebase";

// ======================================================
// CareerOS Job Alerts Service
// STEP 21 — USER-SPECIFIC ALERT REQUESTS
// ======================================================

const API_URL =
    "https://career-os-api-1h85.onrender.com/api/job-alerts";

// ======================================================
// GET CAREEROS USER ID
// ======================================================

function getCareerOSUserId() {
    const STORAGE_KEY =
        "careeros_user_id";

    let userId =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!userId) {
        userId =
            `user_${crypto.randomUUID()}`;

        localStorage.setItem(
            STORAGE_KEY,
            userId
        );
    }

    return userId;
}

// ======================================================
// API CONFIG
// ======================================================

async function getApiConfig() {
    const currentUser =
        auth.currentUser;

    if (!currentUser) {
        throw new Error(
            "User is not authenticated."
        );
    }

    const idToken =
        await currentUser.getIdToken();

    if (!idToken) {
        throw new Error(
            "Firebase ID token is missing."
        );
    }

    const userId =
        String(
            currentUser.uid || ""
        ).trim();

    return {
        headers: {
            Authorization:
                `Bearer ${idToken}`,

            "Content-Type":
                "application/json",

            "X-CareerOS-User-Id":
                userId,
        },
    };
}

// ======================================================
// DEFAULT VALUES
// ======================================================

const DEFAULT_ALERT = {
    keyword: "",
    location: "India",
    experience: "Any Experience",
    jobType: "Any Type",
    workMode: "Any",
    salary: "Any Salary",
    frequency: "Daily",
    enabled: true,
    active: true,
    matchCount: 0,
    lastMatchedAt: null,
};

// ======================================================
// NORMALIZE TEXT
// ======================================================

function normalizeText(value = "") {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}

// ======================================================
// NORMALIZE FREQUENCY
// ======================================================

function normalizeFrequency(value) {
    const frequency =
        normalizeText(value);

    if (frequency === "instant") {
        return "Instant";
    }

    if (frequency === "weekly") {
        return "Weekly";
    }

    return "Daily";
}

// ======================================================
// NORMALIZE ALERT
// ======================================================

export function normalizeJobAlert(alert) {
    if (!alert) {
        return null;
    }

    return {
        ...DEFAULT_ALERT,
        ...alert,

        id: alert.id
            ? String(alert.id)
            : undefined,

        keyword:
            typeof alert.keyword === "string"
                ? alert.keyword.trim()
                : "",

        location:
            typeof alert.location === "string"
                ? alert.location.trim()
                : "India",

        experience:
            alert.experience ||
            "Any Experience",

        jobType:
            alert.jobType ||
            "Any Type",

        workMode:
            alert.workMode ||
            "Any",

        salary:
            alert.salary ||
            "Any Salary",

        frequency:
            normalizeFrequency(
                alert.frequency
            ),

        enabled:
            alert.enabled !== false,

        active:
            alert.active !== false,

        matchCount:
            Number(
                alert.matchCount || 0
            ),

        lastMatchedAt:
            alert.lastMatchedAt ||
            null,

        createdAt:
            alert.createdAt ||
            alert.created_at ||
            null,

        updatedAt:
            alert.updatedAt ||
            alert.updated_at ||
            null,
    };
}

// ======================================================
// VALIDATE ALERT
// ======================================================

export function validateJobAlert(alert) {
    const normalized =
        normalizeJobAlert(alert);

    if (!normalized) {
        return {
            valid: false,
            message:
                "Invalid job alert.",
        };
    }

    if (!normalized.keyword) {
        return {
            valid: false,
            message:
                "Please enter a job title or keyword.",
        };
    }

    if (
        normalized.keyword.length > 100
    ) {
        return {
            valid: false,
            message:
                "Job keyword must be 100 characters or less.",
        };
    }

    return {
        valid: true,
        message: "",
    };
}

// ======================================================
// CREATE JOB ALERT
// ======================================================

export async function createJobAlert(
    alert
) {
    const normalized =
        normalizeJobAlert(alert);

    const validation =
        validateJobAlert(
            normalized
        );

    if (!validation.valid) {
        throw new Error(
            validation.message
        );
    }

    try {
        const config =
            await getApiConfig();

        const response =
            await axios.post(
                API_URL,
                {
                    ...normalized,
                    userId:
                        getCareerOSUserId(),
                },
                config
            );

        const createdAlert =
            response?.data?.alert ||
            response?.data?.data ||
            null;

        if (!createdAlert) {
            throw new Error(
                "Server did not return the created job alert."
            );
        }

        return normalizeJobAlert(
            createdAlert
        );
    } catch (error) {
        console.error(
            "CareerOS: Create job alert error:",
            error.response?.data ||
                error.message
        );

        throw new Error(
            error.response?.data?.message ||
                error.message ||
                "Unable to create job alert.",
            {
                cause: error,
            }
        );
    }
}

// ======================================================
// GET ALL JOB ALERTS
// ======================================================

export async function getJobAlerts() {
    try {
        const config =
            await getApiConfig();

        const response =
            await axios.get(
                API_URL,
                config
            );

        const alerts =
            Array.isArray(
                response?.data?.alerts
            )
                ? response.data.alerts
                : Array.isArray(
                      response?.data?.data
                  )
                ? response.data.data
                : [];

        return alerts
            .map(normalizeJobAlert)
            .filter(Boolean);
    } catch (error) {
        console.error(
            "CareerOS: Get job alerts error:",
            error.response?.data ||
                error.message
        );

        throw new Error(
            error.response?.data?.message ||
                error.message ||
                "Unable to load job alerts.",
            {
                cause: error,
            }
        );
    }
}

// ======================================================
// GET SINGLE JOB ALERT
// ======================================================

export async function getJobAlert(
    alertId
) {
    const normalizedId =
        String(
            alertId || ""
        ).trim();

    if (!normalizedId) {
        return null;
    }

    try {
        const config =
            await getApiConfig();

        const response =
            await axios.get(
                `${API_URL}/${encodeURIComponent(
                    normalizedId
                )}`,
                config
            );

        const alert =
            response?.data?.alert ||
            response?.data?.data ||
            null;

        return normalizeJobAlert(
            alert
        );
    } catch (error) {
        console.error(
            "CareerOS: Get job alert error:",
            error.response?.data ||
                error.message
        );

        throw new Error(
            error.response?.data?.message ||
                error.message ||
                "Unable to load job alert.",
            {
                cause: error,
            }
        );
    }
}

// ======================================================
// UPDATE JOB ALERT
// ======================================================

export async function updateJobAlert(
    alertId,
    updates
) {
    const normalizedId =
        String(
            alertId || ""
        ).trim();

    if (!normalizedId) {
        throw new Error(
            "Invalid job alert ID."
        );
    }

    const normalizedUpdates =
        normalizeJobAlert(updates);

    const validation =
        validateJobAlert(
            normalizedUpdates
        );

    if (!validation.valid) {
        throw new Error(
            validation.message
        );
    }

    try {
        const config =
            await getApiConfig();

        const response =
            await axios.put(
                `${API_URL}/${encodeURIComponent(
                    normalizedId
                )}`,
                normalizedUpdates,
                config
            );

        const updatedAlert =
            response?.data?.alert ||
            response?.data?.data ||
            null;

        if (!updatedAlert) {
            throw new Error(
                "Server did not return the updated job alert."
            );
        }

        return normalizeJobAlert(
            updatedAlert
        );
    } catch (error) {
        console.error(
            "CareerOS: Update job alert error:",
            error.response?.data ||
                error.message
        );

        throw new Error(
            error.response?.data?.message ||
                error.message ||
                "Unable to update job alert.",
            {
                cause: error,
            }
        );
    }
}

// ======================================================
// DELETE JOB ALERT
// ======================================================

export async function deleteJobAlert(
    alertId
) {
    const normalizedId =
        String(
            alertId || ""
        ).trim();

    if (!normalizedId) {
        return false;
    }

    try {
        const config =
            await getApiConfig();

        const response =
            await axios.delete(
                `${API_URL}/${encodeURIComponent(
                    normalizedId
                )}`,
                config
            );

        return (
            response?.data?.success !==
            false
        );
    } catch (error) {
        console.error(
            "CareerOS: Delete job alert error:",
            error.response?.data ||
                error.message
        );

        throw new Error(
            error.response?.data?.message ||
                error.message ||
                "Unable to delete job alert.",
            {
                cause: error,
            }
        );
    }
}

// ======================================================
// ENABLE JOB ALERT
// ======================================================

export async function enableJobAlert(
    alertId
) {
    const normalizedId =
        String(
            alertId || ""
        ).trim();

    if (!normalizedId) {
        return null;
    }

    try {
        const config =
            await getApiConfig();

        const response =
            await axios.patch(
                `${API_URL}/${encodeURIComponent(
                    normalizedId
                )}/enable`,
                {},
                config
            );

        const alert =
            response?.data?.alert ||
            response?.data?.data ||
            null;

        return normalizeJobAlert(
            alert
        );
    } catch (error) {
        console.error(
            "CareerOS: Enable job alert error:",
            error.response?.data ||
                error.message
        );

        throw new Error(
            error.response?.data?.message ||
                error.message ||
                "Unable to enable job alert.",
            {
                cause: error,
            }
        );
    }
}

// ======================================================
// DISABLE JOB ALERT
// ======================================================

export async function disableJobAlert(
    alertId
) {
    const normalizedId =
        String(
            alertId || ""
        ).trim();

    if (!normalizedId) {
        return null;
    }

    try {
        const config =
            await getApiConfig();

        const response =
            await axios.patch(
                `${API_URL}/${encodeURIComponent(
                    normalizedId
                )}/disable`,
                {},
                config
            );

        const alert =
            response?.data?.alert ||
            response?.data?.data ||
            null;

        return normalizeJobAlert(
            alert
        );
    } catch (error) {
        console.error(
            "CareerOS: Disable job alert error:",
            error.response?.data ||
                error.message
        );

        throw new Error(
            error.response?.data?.message ||
                error.message ||
                "Unable to disable job alert.",
            {
                cause: error,
            }
        );
    }
}

// ======================================================
// TOGGLE JOB ALERT
// ======================================================

export async function toggleJobAlert(
    alert
) {
    const normalized =
        normalizeJobAlert(alert);

    if (!normalized?.id) {
        throw new Error(
            "Invalid job alert."
        );
    }

    if (
        normalized.enabled &&
        normalized.active
    ) {
        return disableJobAlert(
            normalized.id
        );
    }

    return enableJobAlert(
        normalized.id
    );
}

// ======================================================
// GET ENABLED ALERTS
// ======================================================

export async function getEnabledJobAlerts() {
    const alerts =
        await getJobAlerts();

    return alerts.filter(
        (alert) =>
            alert.enabled &&
            alert.active
    );
}

// ======================================================
// GET DISABLED ALERTS
// ======================================================

export async function getDisabledJobAlerts() {
    const alerts =
        await getJobAlerts();

    return alerts.filter(
        (alert) =>
            !alert.enabled ||
            !alert.active
    );
}

// ======================================================
// JOB FIELD HELPERS
// ======================================================

function getJobCompany(job) {
    if (
        typeof job?.company ===
        "string"
    ) {
        return job.company;
    }

    return (
        job?.company?.display_name ||
        job?.company?.name ||
        ""
    );
}

function getJobLocation(job) {
    if (
        typeof job?.location ===
        "string"
    ) {
        return job.location;
    }

    return (
        job?.location?.display_name ||
        job?.location?.name ||
        job?.location?.area?.join(
            ", "
        ) ||
        ""
    );
}

function getJobExperience(job) {
    return (
        job?.detected_experience ||
        job?.experience ||
        "Any Experience"
    );
}

function getJobType(job) {
    return (
        job?.detected_job_type ||
        job?.job_type ||
        job?.jobType ||
        job?.contract_type ||
        job?.contract_time ||
        job?.type ||
        "Any Type"
    );
}

function getJobWorkMode(job) {
    return (
        job?.detected_work_mode ||
        job?.workMode ||
        job?.work_mode ||
        "Not Specified"
    );
}

function getJobSalary(job) {
    return (
        job?.detected_salary ||
        job?.salary ||
        ""
    );
}

// ======================================================
// CHECK KEYWORD MATCH
// ======================================================

function matchesKeyword(
    job,
    keyword
) {
    const normalizedKeyword =
        normalizeText(keyword);

    if (!normalizedKeyword) {
        return true;
    }

    const searchableText =
        normalizeText(
            [
                job?.title,
                job?.description,
                getJobCompany(job),
                getJobLocation(job),
                job?.category,
                Array.isArray(job?.skills)
                    ? job.skills.join(" ")
                    : job?.skills,
            ]
                .filter(Boolean)
                .join(" ")
        );

    return searchableText.includes(
        normalizedKeyword
    );
}

// ======================================================
// CHECK LOCATION MATCH
// ======================================================

function matchesLocation(
    job,
    location
) {
    if (
        !location ||
        normalizeText(location) ===
            "any location"
    ) {
        return true;
    }

    const jobLocation =
        normalizeText(
            getJobLocation(job)
        );

    const alertLocation =
        normalizeText(location);

    if (
        alertLocation ===
        "india"
    ) {
        return true;
    }

    if (!jobLocation) {
        return false;
    }

    return (
        jobLocation.includes(
            alertLocation
        ) ||
        alertLocation.includes(
            jobLocation
        )
    );
}

// ======================================================
// CHECK EXPERIENCE MATCH
// ======================================================

function matchesExperience(
    job,
    experience
) {
    if (
        !experience ||
        experience ===
            "Any Experience"
    ) {
        return true;
    }

    const jobExperience =
        normalizeText(
            getJobExperience(job)
        );

    const alertExperience =
        normalizeText(experience);

    return (
        jobExperience ===
            alertExperience ||
        jobExperience.includes(
            alertExperience
        ) ||
        alertExperience.includes(
            jobExperience
        )
    );
}

// ======================================================
// CHECK JOB TYPE MATCH
// ======================================================

function matchesJobType(
    job,
    jobType
) {
    if (
        !jobType ||
        jobType === "Any Type"
    ) {
        return true;
    }

    const jobTypeValue =
        normalizeText(
            getJobType(job)
        );

    const alertType =
        normalizeText(jobType);

    return (
        jobTypeValue ===
            alertType ||
        jobTypeValue.includes(
            alertType
        ) ||
        alertType.includes(
            jobTypeValue
        )
    );
}

// ======================================================
// CHECK WORK MODE MATCH
// ======================================================

function matchesWorkMode(
    job,
    workMode
) {
    if (
        !workMode ||
        workMode === "Any"
    ) {
        return true;
    }

    const jobMode =
        normalizeText(
            getJobWorkMode(job)
        );

    const alertMode =
        normalizeText(workMode);

    return (
        jobMode === alertMode ||
        jobMode.includes(
            alertMode
        ) ||
        alertMode.includes(
            jobMode
        )
    );
}

// ======================================================
// CHECK SALARY MATCH
// ======================================================

function matchesSalary(
    job,
    salary
) {
    if (
        !salary ||
        salary === "Any Salary"
    ) {
        return true;
    }

    const jobSalary =
        normalizeText(
            getJobSalary(job)
        );

    if (!jobSalary) {
        return false;
    }

    const normalizedSalary =
        normalizeText(salary);

    return (
        jobSalary.includes(
            normalizedSalary
        ) ||
        normalizedSalary.includes(
            jobSalary
        )
    );
}

// ======================================================
// CHECK JOB AGAINST ALERT
// ======================================================

export function jobMatchesAlert(
    job,
    alert
) {
    if (!job || !alert) {
        return false;
    }

    const normalizedAlert =
        normalizeJobAlert(alert);

    if (
        !normalizedAlert ||
        !normalizedAlert.enabled ||
        !normalizedAlert.active
    ) {
        return false;
    }

    return (
        matchesKeyword(
            job,
            normalizedAlert.keyword
        ) &&
        matchesLocation(
            job,
            normalizedAlert.location
        ) &&
        matchesExperience(
            job,
            normalizedAlert.experience
        ) &&
        matchesJobType(
            job,
            normalizedAlert.jobType
        ) &&
        matchesWorkMode(
            job,
            normalizedAlert.workMode
        ) &&
        matchesSalary(
            job,
            normalizedAlert.salary
        )
    );
}

// ======================================================
// FIND MATCHING ALERTS
// ======================================================

export async function getMatchingAlerts(
    job
) {
    if (!job) {
        return [];
    }

    const alerts =
        await getEnabledJobAlerts();

    return alerts.filter(
        (alert) =>
            jobMatchesAlert(
                job,
                alert
            )
    );
}

// ======================================================
// FILTER JOBS BY ALERT
// ======================================================

export function filterJobsByAlert(
    jobs,
    alert
) {
    if (!Array.isArray(jobs)) {
        return [];
    }

    return jobs.filter(
        (job) =>
            jobMatchesAlert(
                job,
                alert
            )
    );
}

// ======================================================
// GET ALERT SUMMARY
// ======================================================

export function getJobAlertSummary(
    alert
) {
    const normalized =
        normalizeJobAlert(alert);

    if (!normalized) {
        return "";
    }

    const parts = [];

    if (normalized.keyword) {
        parts.push(
            normalized.keyword
        );
    }

    if (
        normalized.location &&
        normalized.location !== "India"
    ) {
        parts.push(
            normalized.location
        );
    }

    if (
        normalized.experience !==
        "Any Experience"
    ) {
        parts.push(
            normalized.experience
        );
    }

    if (
        normalized.jobType !==
        "Any Type"
    ) {
        parts.push(
            normalized.jobType
        );
    }

    if (
        normalized.workMode !==
        "Any"
    ) {
        parts.push(
            normalized.workMode
        );
    }

    if (
        normalized.salary !==
        "Any Salary"
    ) {
        parts.push(
            normalized.salary
        );
    }

    return (
        parts.join(" • ") ||
        "All jobs"
    );
}

// ======================================================
// DEFAULT EXPORT
// ======================================================

const jobAlertsService = {
    normalizeJobAlert,
    validateJobAlert,

    createJobAlert,
    getJobAlerts,
    getJobAlert,
    updateJobAlert,
    deleteJobAlert,

    enableJobAlert,
    disableJobAlert,
    toggleJobAlert,

    getEnabledJobAlerts,
    getDisabledJobAlerts,

    jobMatchesAlert,
    getMatchingAlerts,
    filterJobsByAlert,

    getJobAlertSummary,
};

export default jobAlertsService;