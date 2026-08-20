// ======================================================
// CareerOS Application Service
// ======================================================
//
// Responsibilities:
// - Create applications
// - Get applications
// - Get one application by job ID
// - Update application status
// - Remove applications
// - Prevent duplicate applications
// - Track application timestamps
// - Persist applications between server restarts
//
// Storage:
// - JSON file
//
// ======================================================

const fs =
    require("fs");

const path =
    require("path");

// ======================================================
// APPLICATION STORAGE FILE
// ======================================================

const DATA_DIRECTORY =
    path.join(
        __dirname,
        "../data"
    );

const APPLICATIONS_FILE =
    path.join(
        DATA_DIRECTORY,
        "applications.json"
    );

// ======================================================
// IN-MEMORY STORAGE
// ======================================================

const applications = new Map();

// ======================================================
// APPLICATION STATUSES
// ======================================================

const APPLICATION_STATUSES = [
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
];

// ======================================================
// ENSURE STORAGE EXISTS
// ======================================================

function ensureStorage() {
    try {
        if (
            !fs.existsSync(
                DATA_DIRECTORY
            )
        ) {
            fs.mkdirSync(
                DATA_DIRECTORY,
                {
                    recursive: true,
                }
            );
        }

        if (
            !fs.existsSync(
                APPLICATIONS_FILE
            )
        ) {
            fs.writeFileSync(
                APPLICATIONS_FILE,
                "[]",
                "utf8"
            );
        }
    } catch (error) {
        console.error(
            "CareerOS: Unable to initialize application storage:",
            error.message
        );

        throw error;
    }
}

// ======================================================
// LOAD APPLICATIONS FROM FILE
// ======================================================

function loadApplications() {
    try {
        ensureStorage();

        const fileData =
            fs.readFileSync(
                APPLICATIONS_FILE,
                "utf8"
            );

        if (!fileData.trim()) {
            return;
        }

        const parsedData =
            JSON.parse(fileData);

        if (
            !Array.isArray(
                parsedData
            )
        ) {
            console.error(
                "CareerOS: applications.json must contain an array."
            );

            return;
        }

        applications.clear();

        parsedData.forEach(
            (application) => {
                if (
                    !application ||
                    typeof application !==
                        "object"
                ) {
                    return;
                }

                const jobId =
                    normalizeJobId(
                        application
                    );

                if (!jobId) {
                    return;
                }

                const normalizedApplication =
                    normalizeApplication(
                        application,
                        jobId
                    );

                applications.set(
                    jobId,
                    normalizedApplication
                );
            }
        );

        console.log(
            `CareerOS: Loaded ${applications.size} applications from storage.`
        );
    } catch (error) {
        console.error(
            "CareerOS: Failed to load applications:",
            error.message
        );
    }
}

// ======================================================
// SAVE APPLICATIONS TO FILE
// ======================================================

function saveApplications() {
    try {
        ensureStorage();

        const data =
            Array.from(
                applications.values()
            );

        fs.writeFileSync(
            APPLICATIONS_FILE,
            JSON.stringify(
                data,
                null,
                2
            ),
            "utf8"
        );

        console.log(
            `CareerOS: Saved ${data.length} applications to storage.`
        );
    } catch (error) {
        console.error(
            "CareerOS: Failed to save applications:",
            error.message
        );

        throw error;
    }
}

// ======================================================
// NORMALIZE JOB ID
// ======================================================

function normalizeJobId(
    jobOrId
) {
    if (
        jobOrId === null ||
        jobOrId === undefined
    ) {
        return "";
    }

    // --------------------------------------------------
    // Direct ID
    // --------------------------------------------------

    if (
        typeof jobOrId !==
        "object"
    ) {
        return String(
            jobOrId
        ).trim();
    }

    const job =
        jobOrId;

    // --------------------------------------------------
    // Direct / nested IDs
    // --------------------------------------------------

    const id =
        job.jobId ||
        job.job_id ||
        job.id ||
        job.job?.id ||
        job.job?.jobId ||
        job.job?.job_id ||
        job.redirect_url ||
        job.redirectUrl ||
        job.job?.redirect_url ||
        job.job?.redirectUrl;

    if (id) {
        return String(
            id
        ).trim();
    }

    // --------------------------------------------------
    // Fallback ID
    // --------------------------------------------------

    const source =
        job.job &&
        typeof job.job ===
            "object"
            ? job.job
            : job;

    const title =
        source.title ||
        "";

    const company =
        typeof source.company ===
        "string"
            ? source.company
            : source.company
                ?.display_name ||
              source.company?.name ||
              "";

    const location =
        typeof source.location ===
        "string"
            ? source.location
            : source.location
                ?.display_name ||
              source.location?.name ||
              "";

    const fallbackId =
        [
            title,
            company,
            location,
        ]
            .filter(Boolean)
            .join("-")
            .trim()
            .toLowerCase()
            .replace(
                /\s+/g,
                "-"
            );

    return fallbackId;
}

// ======================================================
// CLONE DATA
// ======================================================

function cloneData(
    data
) {
    if (!data) {
        return null;
    }

    try {
        return JSON.parse(
            JSON.stringify(
                data
            )
        );
    } catch (error) {
        console.error(
            "Clone Application Data Error:",
            error.message
        );

        return {
            ...data,
        };
    }
}

// ======================================================
// NORMALIZE STATUS
// ======================================================

function normalizeStatus(
    status
) {
    if (!status) {
        return "Applied";
    }

    const normalized =
        String(
            status
        ).trim();

    const matchedStatus =
        APPLICATION_STATUSES.find(
            (item) =>
                item.toLowerCase() ===
                normalized.toLowerCase()
        );

    return (
        matchedStatus ||
        "Applied"
    );
}

// ======================================================
// NORMALIZE APPLICATION
// ======================================================

function normalizeApplication(
    application,
    jobId
) {
    if (
        !application ||
        typeof application !==
            "object"
    ) {
        return null;
    }

    const normalizedJobId =
        jobId ||
        normalizeJobId(
            application
        );

    if (!normalizedJobId) {
        return null;
    }

    const sourceJob =
        application.job &&
        typeof application.job ===
            "object"
            ? cloneData(
                application.job
            )
            : cloneData(
                application
            );

    const job =
        sourceJob || {};

    job.id =
        job.id ||
        job.jobId ||
        job.job_id ||
        normalizedJobId;

    const now =
        new Date().toISOString();

    return {
        ...application,

        id:
            application.id ||
            normalizedJobId,

        jobId:
            normalizedJobId,

        job,

        status:
            normalizeStatus(
                application.status
            ),

        appliedAt:
            application.appliedAt ||
            application.createdAt ||
            now,

        createdAt:
            application.createdAt ||
            now,

        updatedAt:
            application.updatedAt ||
            application.createdAt ||
            now,
    };
}

// ======================================================
// CREATE APPLICATION
// ======================================================

function createApplication(
    data
) {
    if (
        !data ||
        typeof data !==
            "object"
    ) {
        return null;
    }

    const jobId =
        normalizeJobId(
            data
        );

    if (!jobId) {
        return null;
    }

    // --------------------------------------------------
    // Prevent duplicate applications
    // --------------------------------------------------

    const existing =
        applications.get(
            jobId
        );

    if (existing) {
        return cloneData(
            existing
        );
    }

    // --------------------------------------------------
    // Extract job
    // --------------------------------------------------

    const sourceJob =
        data.job &&
        typeof data.job ===
            "object"
            ? data.job
            : data;

    const job =
        cloneData(
            sourceJob
        ) || {};

    job.id =
        job.id ||
        job.jobId ||
        job.job_id ||
        jobId;

    // --------------------------------------------------
    // Timestamps
    // --------------------------------------------------

    const now =
        new Date().toISOString();

    const application = {
        id: jobId,

        jobId,

        job,

        status:
            normalizeStatus(
                data.status
            ),

        appliedAt:
            data.appliedAt ||
            now,

        createdAt:
            now,

        updatedAt:
            now,
    };

    applications.set(
        jobId,
        application
    );

    // --------------------------------------------------
    // PERSIST
    // --------------------------------------------------

    saveApplications();

    return cloneData(
        application
    );
}

// ======================================================
// GET ALL APPLICATIONS
// ======================================================

function getApplications() {
    return Array.from(
        applications.values()
    )
        .sort(
            (a, b) =>
                new Date(
                    b.appliedAt ||
                    b.createdAt ||
                    0
                ) -
                new Date(
                    a.appliedAt ||
                    a.createdAt ||
                    0
                )
        )
        .map(
            (application) =>
                cloneData(
                    application
                )
        );
}

// ======================================================
// GET ONE APPLICATION
// ======================================================

function getApplication(
    jobId
) {
    const normalizedJobId =
        normalizeJobId(
            jobId
        );

    if (!normalizedJobId) {
        return null;
    }

    const application =
        applications.get(
            normalizedJobId
        );

    return (
        cloneData(
            application
        ) || null
    );
}

// ======================================================
// CHECK APPLICATION
// ======================================================

function isApplicationCreated(
    jobId
) {
    const normalizedJobId =
        normalizeJobId(
            jobId
        );

    if (!normalizedJobId) {
        return false;
    }

    return applications.has(
        normalizedJobId
    );
}

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

function updateApplicationStatus(
    jobId,
    status
) {
    const normalizedJobId =
        normalizeJobId(
            jobId
        );

    if (!normalizedJobId) {
        return null;
    }

    const application =
        applications.get(
            normalizedJobId
        );

    if (!application) {
        return null;
    }

    const normalizedStatus =
        normalizeStatus(
            status
        );

    application.status =
        normalizedStatus;

    application.updatedAt =
        new Date().toISOString();

    applications.set(
        normalizedJobId,
        application
    );

    // --------------------------------------------------
    // PERSIST UPDATED STATUS
    // --------------------------------------------------

    saveApplications();

    return cloneData(
        application
    );
}

// ======================================================
// REMOVE APPLICATION
// ======================================================

function removeApplication(
    jobId
) {
    const normalizedJobId =
        normalizeJobId(
            jobId
        );

    if (!normalizedJobId) {
        return false;
    }

    const removed =
        applications.delete(
            normalizedJobId
        );

    if (removed) {
        saveApplications();
    }

    return removed;
}

// ======================================================
// GET APPLICATION COUNT
// ======================================================

function getApplicationCount() {
    return applications.size;
}

// ======================================================
// CLEAR APPLICATIONS
// ======================================================

function clearApplications() {
    const count =
        applications.size;

    applications.clear();

    saveApplications();

    return count;
}

// ======================================================
// INITIALIZE STORAGE
// ======================================================

loadApplications();

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createApplication,

    getApplications,

    getApplication,

    isApplicationCreated,

    updateApplicationStatus,

    removeApplication,

    getApplicationCount,

    clearApplications,

    APPLICATION_STATUSES,
};
