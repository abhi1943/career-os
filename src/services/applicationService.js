import axios from "axios";

import { auth } from "../firebase/firebase";

// ======================================================
// API
// ======================================================

const API_URL =
"http://127.0.0.1:5000/api/applications";

// ======================================================
// GET CURRENT FIREBASE USER ID
// ======================================================

function getCurrentUserId() {
return String(
auth.currentUser?.uid || ""
).trim();
}

// ======================================================
// GET FIREBASE ID TOKEN
// ======================================================

async function getFirebaseIdToken() {
const user =
auth.currentUser;


if (!user) {
    throw new Error(
        "You must be logged in to manage applications."
    );
}

const token =
    await user.getIdToken();

if (!token) {
    throw new Error(
        "Unable to obtain Firebase authentication token."
    );
}

return token;


}

// ======================================================
// AUTH HEADERS
// ======================================================

async function getAuthConfig(
extraConfig = {}
) {
const token =
await getFirebaseIdToken();


return {
    ...extraConfig,

    headers: {
        ...(extraConfig.headers || {}),

        Authorization:
            `Bearer ${token}`,

        "Content-Type":
            "application/json",
    },
};


}

// ======================================================
// REQUIRE CURRENT USER
// ======================================================

function requireCurrentUserId() {
const userId =
getCurrentUserId();


if (!userId) {
    throw new Error(
        "You must be logged in to manage applications."
    );
}

return userId;

}

// ======================================================
// NORMALIZE APPLICATION ID
// ======================================================

export function getApplicationJobId(
job
) {
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

return String(
    id
).trim();


}

// ======================================================
// NORMALIZE APPLICATION
// ======================================================

export function normalizeApplication(
application
) {
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
        getApplicationJobId(
            sourceJob
        ) ||
        ""
    ).trim();

if (!jobId) {
    return null;
}

const normalizedJob = {
    ...sourceJob,

    id:
        sourceJob.id ||
        sourceJob.jobId ||
        sourceJob.job_id ||
        jobId,
};

return {
    ...application,

    job:
        normalizedJob,

    jobId,

    status:
        application.status ||
        "Applied",
};


}

// ======================================================
// GET ALL APPLICATIONS
// GET /api/applications
// ======================================================

export async function getApplications() {



const userId =
    requireCurrentUserId();

try {
    const config =
        await getAuthConfig({
            params: {
                userId,
            },

            timeout: 5000,
        });

    const response =
        await axios.get(
            API_URL,
            config
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

    

    return normalizedApplications;

} catch (error) {
    console.error(
        "CareerOS: Get applications error:",
        error.response?.data ||
            error.message
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
// GET /api/applications/:jobId
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

const userId =
    getCurrentUserId();

if (!userId) {
    return null;
}

try {
    const config =
        await getAuthConfig({
            params: {
                userId,
            },

            timeout: 5000,
        });

    const response =
        await axios.get(
            `${API_URL}/${encodeURIComponent(
                normalizedJobId
            )}`,
            config
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
// POST /api/applications
// ======================================================

export async function createApplication(
job
) {
const jobId =
getApplicationJobId(
job
);


if (!jobId) {
    throw new Error(
        "Invalid job. Unable to create application."
    );
}

const userId =
    requireCurrentUserId();

const application = {
    userId,

    job: {
        ...job,

        id:
            jobId,
    },

    jobId,

    status:
        "Applied",

    appliedAt:
        new Date().toISOString(),
};



try {
    const config =
        await getAuthConfig({
            timeout: 5000,
        });

    const response =
        await axios.post(
            API_URL,
            application,
            config
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
// PATCH /api/applications/:jobId
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

const userId =
    requireCurrentUserId();

try {
    const config =
        await getAuthConfig({
            timeout: 5000,
        });

    const response =
        await axios.patch(
            `${API_URL}/${encodeURIComponent(
                normalizedJobId
            )}`,
            {
                userId,

                status,
            },
            config
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
// DELETE /api/applications/:jobId
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

const userId =
    getCurrentUserId();

if (!userId) {
    return false;
}

try {
    const config =
        await getAuthConfig({
            params: {
                userId,
            },

            timeout: 5000,
        });

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
