import axios from "axios";

// ======================================================
// API
// ======================================================

const API_URL =
    "http://127.0.0.1:5000/api/applications";

// ======================================================
// NORMALIZE APPLICATION ID
// ======================================================

export function getApplicationJobId(job) {
    if (!job) {
        return "";
    }

    const id =
        job.jobId ||
        job.job_id ||
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
// NORMALIZE APPLICATION
// ======================================================

export function normalizeApplication(application) {
    if (!application) {
        return null;
    }

    const sourceJob =
        application.job ||
        application;

    const jobId =
        String(
            application.jobId ||
            application.job_id ||
            getApplicationJobId(sourceJob) ||
            ""
        ).trim();

    if (!jobId) {
        return null;
    }

    const normalizedJob = {
        ...sourceJob,
        id:
            sourceJob.id ||
            sourceJob.job_id ||
            jobId,
    };

    return {
        ...application,
        job: normalizedJob,
        jobId,
        status:
            application.status ||
            "Applied",
    };
}

// ======================================================
// GET ALL APPLICATIONS
// ======================================================

export async function getApplications() {
    console.log(
        "CareerOS: Fetching applications..."
    );

    try {
        const response =
            await axios.get(
                API_URL,
                {
                    timeout: 5000,
                }
            );

        console.log(
            "CareerOS: Applications API response:",
            response.data
        );

        if (
            !response ||
            !response.data
        ) {
            throw new Error(
                "Empty response from applications API."
            );
        }

        const applications =
            Array.isArray(
                response.data.applications
            )
                ? response.data.applications
                : Array.isArray(
                    response.data.data
                )
                    ? response.data.data
                    : [];

        const normalizedApplications =
            applications
                .map(
                    normalizeApplication
                )
                .filter(Boolean);

        console.log(
            "CareerOS: Applications loaded:",
            normalizedApplications.length
        );

        return normalizedApplications;

    } catch (error) {
        console.error(
            "CareerOS: Get applications error:",
            error
        );

        if (
            error.code ===
            "ECONNABORTED"
        ) {
            throw new Error(
    "Applications request timed out.",
    {
        cause: error,
    }
);
        }

        if (
            error.response
        ) {
            throw new Error(
    error.response.data?.message ||
    `Applications API returned ${error.response.status}.`,
    {
        cause: error,
    }
);
        }

        if (
            error.request
        ) {
            throw new Error(
    "Unable to connect to the CareerOS server.",
    {
        cause: error,
    }
);
        }

        throw error;
    }
}

// ======================================================
// GET ONE APPLICATION
// ======================================================

export async function getApplication(
    jobId
) {
    const normalizedJobId =
        String(
            jobId || ""
        ).trim();

    if (!normalizedJobId) {
        return null;
    }

    try {
        const response =
            await axios.get(
                `${API_URL}/${encodeURIComponent(
                    normalizedJobId
                )}`,
                {
                    timeout: 5000,
                }
            );

        const application =
            response?.data?.application ||
            response?.data?.data ||
            null;

        return normalizeApplication(
            application
        );

    } catch (error) {
        console.error(
            "CareerOS: Get application error:",
            error.response?.data ||
                error.message
        );

        return null;
    }
}

// ======================================================
// CREATE APPLICATION
// ======================================================

export async function createApplication(
    job
) {
    const jobId =
        getApplicationJobId(job);

    if (!jobId) {
        throw new Error(
            "Invalid job. Unable to create application."
        );
    }

    const application = {
        job: {
            ...job,
            id: jobId,
        },

        jobId,

        status: "Applied",

        appliedAt:
            new Date().toISOString(),
    };

    console.log(
        "CareerOS: Creating application:",
        application
    );

    try {
        const response =
            await axios.post(
                API_URL,
                application,
                {
                    timeout: 5000,
                }
            );

        const savedApplication =
            response?.data?.application ||
            response?.data?.data ||
            null;

        if (!savedApplication) {
            throw new Error(
                "Server did not return the application."
            );
        }

        return normalizeApplication(
            savedApplication
        );

    } catch (error) {
        console.error(
            "CareerOS: Create application error:",
            error.response?.data ||
                error.message
        );

        throw error;
    }
}

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

export async function updateApplicationStatus(
    jobId,
    status
) {
    const normalizedJobId =
        String(
            jobId || ""
        ).trim();

    if (!normalizedJobId) {
        throw new Error(
            "Job ID is required."
        );
    }

    if (!status) {
        throw new Error(
            "Application status is required."
        );
    }

    try {
        const response =
            await axios.patch(
                `${API_URL}/${encodeURIComponent(
                    normalizedJobId
                )}`,
                {
                    status,
                },
                {
                    timeout: 5000,
                }
            );

        const application =
            response?.data?.application ||
            response?.data?.data ||
            null;

        if (!application) {
            throw new Error(
                "Server did not return the updated application."
            );
        }

        return normalizeApplication(
            application
        );

    } catch (error) {
        console.error(
            "CareerOS: Update application status error:",
            error.response?.data ||
                error.message
        );

        throw error;
    }
}

// ======================================================
// REMOVE APPLICATION
// ======================================================

export async function removeApplication(
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
        const response =
            await axios.delete(
                `${API_URL}/${encodeURIComponent(
                    normalizedJobId
                )}`,
                {
                    timeout: 5000,
                }
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
            "CareerOS: Remove application error:",
            error.response?.data ||
                error.message
        );

        return false;
    }
}

// ======================================================
// APPLICATION STATUS OPTIONS
// ======================================================

export const APPLICATION_STATUSES = [
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
];
