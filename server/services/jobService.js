// ======================================================
// CareerOS Job Service
// ======================================================
//
// Responsibilities:
// - Store jobs in memory
// - Normalize jobs
// - Prevent duplicates
// - Track first/last seen times
// - Track job freshness
// - Track job expiration
// - Remove expired jobs
// - Find jobs by ID
// - Generate related jobs
// - Provide store status
//
// ======================================================

// ======================================================
// JOB STORE
// ======================================================

const jobStore = new Map();

// Jobs older than this are considered expired.
const DEFAULT_STALE_JOB_MAX_AGE =
    24 * 60 * 60 * 1000;

// ======================================================
// JOB FRESHNESS HELPERS
// ======================================================

function getJobTimestamp(job) {
    if (!job) {
        return 0;
    }

    return new Date(
        job.lastUpdatedAt ||
        job.storedAt ||
        job.firstSeenAt ||
        0
    ).getTime();
}

// ======================================================
// GET JOB AGE
// ======================================================

function getJobAge(job) {
    const timestamp =
        getJobTimestamp(job);

    if (!timestamp) {
        return null;
    }

    return Math.max(
        0,
        Date.now() - timestamp
    );
}

// ======================================================
// GET JOB EXPIRATION TIME
// ======================================================

function getJobExpiresAt(
    job,
    maxAge = DEFAULT_STALE_JOB_MAX_AGE
) {
    const timestamp =
        getJobTimestamp(job);

    if (!timestamp) {
        return null;
    }

    return new Date(
        timestamp + maxAge
    ).toISOString();
}

// ======================================================
// CHECK JOB FRESHNESS
// ======================================================

function isJobFresh(
    job,
    maxAge = DEFAULT_STALE_JOB_MAX_AGE
) {
    const timestamp =
        getJobTimestamp(job);

    if (!timestamp) {
        return false;
    }

    return (
        Date.now() - timestamp <=
        maxAge
    );
}

// ======================================================
// GET JOB FRESHNESS STATUS
// ======================================================

function getJobFreshnessStatus(
    job,
    maxAge = DEFAULT_STALE_JOB_MAX_AGE
) {
    const timestamp =
        getJobTimestamp(job);

    if (!timestamp) {
        return {
            status: "expired",
            isFresh: false,
            ageMs: null,
            ageHours: null,
            expiresAt: null,
        };
    }

    const ageMs =
        Math.max(
            0,
            Date.now() - timestamp
        );

    const expiresAt =
        new Date(
            timestamp + maxAge
        );

    const fresh =
        ageMs <= maxAge;

    return {
        status:
            fresh
                ? "fresh"
                : "expired",

        isFresh:
            fresh,

        ageMs,

        ageHours:
            Number(
                (
                    ageMs /
                    (60 * 60 * 1000)
                ).toFixed(2)
            ),

        expiresAt:
            expiresAt.toISOString(),
    };
}

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
// NORMALIZE COMPANY
// ======================================================

function normalizeCompany(company) {
    if (!company) {
        return "";
    }

    if (typeof company === "string") {
        return normalizeText(company);
    }

    return normalizeText(
        company.display_name ||
        company.name ||
        ""
    );
}

// ======================================================
// NORMALIZE LOCATION
// ======================================================

function normalizeLocation(location) {
    if (!location) {
        return "";
    }

    if (typeof location === "string") {
        return normalizeText(location);
    }

    return normalizeText(
        location.display_name ||
        location.name ||
        ""
    );
}

// ======================================================
// NORMALIZE CATEGORY
// ======================================================

function normalizeCategory(category) {
    if (!category) {
        return "";
    }

    if (typeof category === "string") {
        return normalizeText(category);
    }

    return normalizeText(
        category.label ||
        category.name ||
        ""
    );
}

// ======================================================
// NORMALIZE EXPERIENCE
// ======================================================

function normalizeExperience(job) {
    return normalizeText(
        job.detected_experience ||
        job.experience ||
        ""
    );
}

// ======================================================
// NORMALIZE WORK MODE
// ======================================================

function normalizeWorkMode(job) {
    return normalizeText(
        job.detected_work_mode ||
        job.work_mode ||
        job.workMode ||
        ""
    );
}

// ======================================================
// NORMALIZE JOB TYPE
// ======================================================

function normalizeJobType(job) {
    return normalizeText(
        job.detected_job_type ||
        job.job_type ||
        job.jobType ||
        job.contract_type ||
        job.contractType ||
        ""
    );
}

// ======================================================
// NORMALIZE SKILLS
// ======================================================

function normalizeSkills(skills) {
    if (!skills) {
        return [];
    }

    if (Array.isArray(skills)) {
        return skills
            .map((skill) =>
                normalizeText(skill)
            )
            .filter(Boolean);
    }

    return String(skills)
        .split(/[,|]/)
        .map((skill) =>
            normalizeText(skill)
        )
        .filter(Boolean);
}

// ======================================================
// GET JOB SEARCH TEXT
// ======================================================

function getSearchText(job) {
    return normalizeText(
        [
            job.title,
            job.description,
            normalizeCompany(job.company),
            normalizeLocation(job.location),
            normalizeCategory(job.category),
            normalizeExperience(job),
            normalizeWorkMode(job),
            normalizeJobType(job),
            normalizeSkills(job.skills).join(" "),
        ]
            .filter(Boolean)
            .join(" ")
    );
}

// ======================================================
// CREATE JOB ID
// ======================================================

function getJobId(job) {
    if (!job) {
        return "";
    }

    if (job.id) {
        return String(job.id);
    }

    if (job.redirect_url) {
        return String(job.redirect_url);
    }

    if (job.url) {
        return String(job.url);
    }

    const fallback = [
        job.title || "",

        normalizeCompany(
            job.company
        ),

        normalizeLocation(
            job.location
        ),
    ]
        .join("|")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

    return fallback;
}

// ======================================================
// NORMALIZE JOB
// ======================================================

function normalizeJob(job) {
    if (!job) {
        return null;
    }

    const id =
        getJobId(job);

    if (!id) {
        return null;
    }

    const existing =
        jobStore.get(id);

    const now =
        new Date().toISOString();

    // --------------------------------------------------
    // MERGE EXISTING + NEW DATA
    // --------------------------------------------------

    const mergedJob = {
        ...existing,
        ...job,

        id,

        company:
            job.company ??
            existing?.company ??
            "",

        location:
            job.location ??
            existing?.location ??
            "",

        category:
            job.category ??
            existing?.category ??
            "",

        skills:
            normalizeSkills(
                job.skills ??
                existing?.skills
            ),
    };

    // --------------------------------------------------
    // FIRST SEEN
    // --------------------------------------------------

    const firstSeenAt =
        existing?.firstSeenAt ||
        now;

    // --------------------------------------------------
    // LAST UPDATED
    // --------------------------------------------------
    //
    // Every time the job is returned by the external
    // job API, it is considered seen again.
    //
    // This means an active job remains fresh.
    //
    // --------------------------------------------------

    const lastUpdatedAt =
        now;

    // --------------------------------------------------
    // EXPIRATION
    // --------------------------------------------------

    const expiresAt =
        new Date(
            new Date(
                lastUpdatedAt
            ).getTime() +
                DEFAULT_STALE_JOB_MAX_AGE
        ).toISOString();

    return {
        ...mergedJob,

        id,

        searchText:
            getSearchText(
                mergedJob
            ),

        firstSeenAt,

        lastUpdatedAt,

        storedAt:
            existing?.storedAt ||
            now,

        expiresAt,
    };
}

// ======================================================
// STORE JOBS
// ======================================================

function storeJobs(jobs) {
    if (!Array.isArray(jobs)) {
        return {
            stored: 0,
            updated: 0,
            skipped: 0,
            total:
                jobStore.size,
        };
    }

    let stored = 0;
    let updated = 0;
    let skipped = 0;

    for (const job of jobs) {
        const id =
            getJobId(job);

        if (!id) {
            skipped++;
            continue;
        }

        const existed =
            jobStore.has(id);

        const normalized =
            normalizeJob(job);

        if (!normalized) {
            skipped++;
            continue;
        }

        jobStore.set(
            id,
            normalized
        );

        if (existed) {
            updated++;
        } else {
            stored++;
        }
    }

    return {
        stored,

        updated,

        skipped,

        total:
            jobStore.size,
    };
}

// ======================================================
// GET JOB BY ID
// ======================================================
//
// Only fresh jobs are returned.
//
// If a job has expired, it is immediately deleted.
//
// ======================================================

function getJobById(id) {
    if (!id) {
        return null;
    }

    const normalizedId =
        String(id);

    const job =
        jobStore.get(
            normalizedId
        );

    if (!job) {
        return null;
    }

    // --------------------------------------------------
    // EXPIRED JOB
    // --------------------------------------------------

    if (
        !isJobFresh(job)
    ) {
        jobStore.delete(
            normalizedId
        );

        return null;
    }

    return job;
}

// ======================================================
// GET ALL FRESH STORED JOBS
// ======================================================
//
// Expired jobs are removed while reading the store.
//
// ======================================================

function getAllStoredJobs() {
    const freshJobs = [];

    for (
        const [id, job]
        of jobStore.entries()
    ) {
        if (
            isJobFresh(job)
        ) {
            freshJobs.push(job);
        } else {
            jobStore.delete(id);
        }
    }

    return freshJobs;
}

// ======================================================
// REMOVE STALE / EXPIRED JOBS
// ======================================================

function removeStaleJobs(
    maxAge =
        DEFAULT_STALE_JOB_MAX_AGE
) {
    const now =
        Date.now();

    let removed = 0;

    for (
        const [id, job]
        of jobStore.entries()
    ) {
        const timestamp =
            getJobTimestamp(job);

        if (
            !timestamp ||
            now - timestamp >
                maxAge
        ) {
            jobStore.delete(id);

            removed++;
        }
    }

    return removed;
}

// ======================================================
// SIMILARITY HELPERS
// ======================================================

function similarity(
    valueA,
    valueB
) {
    const a =
        normalizeText(valueA);

    const b =
        normalizeText(valueB);

    if (!a || !b) {
        return 0;
    }

    if (a === b) {
        return 1;
    }

    if (
        a.includes(b) ||
        b.includes(a)
    ) {
        return 0.8;
    }

    const wordsA =
        new Set(
            a.split(/\s+/)
        );

    const wordsB =
        new Set(
            b.split(/\s+/)
        );

    const intersection =
        [...wordsA].filter(
            (word) =>
                wordsB.has(word)
        );

    const union =
        new Set([
            ...wordsA,
            ...wordsB,
        ]);

    if (!union.size) {
        return 0;
    }

    return (
        intersection.length /
        union.size
    );
}

// ======================================================
// SKILL SIMILARITY
// ======================================================

function skillSimilarity(
    skillsA,
    skillsB
) {
    const a =
        new Set(
            normalizeSkills(
                skillsA
            )
        );

    const b =
        new Set(
            normalizeSkills(
                skillsB
            )
        );

    if (
        !a.size ||
        !b.size
    ) {
        return 0;
    }

    const common =
        [...a].filter(
            (skill) =>
                b.has(skill)
        );

    return (
        common.length /
        Math.max(
            a.size,
            b.size
        )
    );
}

// ======================================================
// RELATED JOB SCORE
// ======================================================

function calculateRelatedJobScore(
    currentJob,
    relatedJob
) {
    if (
        !currentJob ||
        !relatedJob
    ) {
        return 0;
    }

    if (
        String(
            currentJob.id
        ) ===
        String(
            relatedJob.id
        )
    ) {
        return 0;
    }

    let score = 0;

    // --------------------------------------------------
    // TITLE
    // --------------------------------------------------

    const titleScore =
        similarity(
            currentJob.title,
            relatedJob.title
        );

    score +=
        titleScore * 35;

    // --------------------------------------------------
    // CATEGORY
    // --------------------------------------------------

    const categoryScore =
        similarity(
            normalizeCategory(
                currentJob.category
            ),
            normalizeCategory(
                relatedJob.category
            )
        );

    score +=
        categoryScore * 15;

    // --------------------------------------------------
    // EXPERIENCE
    // --------------------------------------------------

    const experienceScore =
        similarity(
            normalizeExperience(
                currentJob
            ),
            normalizeExperience(
                relatedJob
            )
        );

    score +=
        experienceScore * 10;

    // --------------------------------------------------
    // LOCATION
    // --------------------------------------------------

    const locationScore =
        similarity(
            normalizeLocation(
                currentJob.location
            ),
            normalizeLocation(
                relatedJob.location
            )
        );

    score +=
        locationScore * 5;

    // --------------------------------------------------
    // WORK MODE
    // --------------------------------------------------

    const workModeScore =
        similarity(
            normalizeWorkMode(
                currentJob
            ),
            normalizeWorkMode(
                relatedJob
            )
        );

    score +=
        workModeScore * 5;

    // --------------------------------------------------
    // JOB TYPE
    // --------------------------------------------------

    const jobTypeScore =
        similarity(
            normalizeJobType(
                currentJob
            ),
            normalizeJobType(
                relatedJob
            )
        );

    score +=
        jobTypeScore * 5;

    // --------------------------------------------------
    // SKILLS
    // --------------------------------------------------

    const skillsScore =
        skillSimilarity(
            currentJob.skills,
            relatedJob.skills
        );

    if (
        skillsScore > 0
    ) {
        score +=
            skillsScore * 25;
    } else {
        // ------------------------------------------------
        // DESCRIPTION
        // ------------------------------------------------

        const descriptionScore =
            similarity(
                currentJob.description,
                relatedJob.description
            );

        score +=
            descriptionScore * 15;

        // ------------------------------------------------
        // SEARCH TEXT
        // ------------------------------------------------

        const searchTextScore =
            similarity(
                getSearchText(
                    currentJob
                ),
                getSearchText(
                    relatedJob
                )
            );

        score +=
            searchTextScore * 10;
    }

    return score;
}

// ======================================================
// GET RELATED JOBS
// ======================================================
//
// Only fresh jobs are considered.
//
// ======================================================

function getRelatedJobs(
    currentJob,
    limit = 4
) {
    if (!currentJob) {
        return [];
    }

    const jobs =
        getAllStoredJobs();

    const scored =
        jobs
            .filter(
                (job) =>
                    String(
                        job.id
                    ) !==
                    String(
                        currentJob.id
                    )
            )
            .map(
                (job) => ({
                    job,

                    score:
                        calculateRelatedJobScore(
                            currentJob,
                            job
                        ),
                })
            )
            .filter(
                (item) =>
                    item.score >= 15
            )
            .sort(
                (a, b) =>
                    b.score -
                    a.score
            );

    return scored
        .slice(0, limit)
        .map(
            (item) =>
                item.job
        );
}

// ======================================================
// JOB STORE STATUS
// ======================================================
//
// Gives a complete freshness overview.
//
// ======================================================

function getJobStoreStatus() {
    const jobs =
        Array.from(
            jobStore.values()
        );

    const now =
        Date.now();

    let freshJobs = 0;

    let staleJobs = 0;

    let expiredJobs = 0;

    let oldestJob = null;

    let oldestTimestamp =
        Infinity;

    let newestJob = null;

    let newestTimestamp = 0;

    for (const job of jobs) {
        const timestamp =
            getJobTimestamp(job);

        const age =
            timestamp
                ? now - timestamp
                : null;

        const isFresh =
            timestamp &&
            age <=
                DEFAULT_STALE_JOB_MAX_AGE;

        if (isFresh) {
            freshJobs++;
        } else {
            staleJobs++;

            expiredJobs++;
        }

        // --------------------------------------------------
        // OLDEST JOB
        // --------------------------------------------------

        if (
            timestamp &&
            timestamp <
                oldestTimestamp
        ) {
            oldestTimestamp =
                timestamp;

            oldestJob =
                job;
        }

        // --------------------------------------------------
        // NEWEST JOB
        // --------------------------------------------------

        if (
            timestamp &&
            timestamp >
                newestTimestamp
        ) {
            newestTimestamp =
                timestamp;

            newestJob =
                job;
        }
    }

    return {
        totalJobs:
            jobs.length,

        freshJobs,

        staleJobs,

        expiredJobs,

        oldestJob,

        newestJob,

        staleJobMaxAgeMs:
            DEFAULT_STALE_JOB_MAX_AGE,

        staleJobMaxAgeHours:
            DEFAULT_STALE_JOB_MAX_AGE /
            (60 * 60 * 1000),

        checkedAt:
            new Date().toISOString(),
    };
}

// ======================================================
// GET STORED JOB COUNT
// ======================================================
//
// This returns only fresh jobs.
//
// ======================================================

function getStoredJobCount() {
    return getAllStoredJobs().length;
}

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    storeJobs,

    getJobById,

    getRelatedJobs,

    getAllStoredJobs,

    removeStaleJobs,

    getStoredJobCount,

    getJobStoreStatus,

    getJobSearchText:
        getSearchText,

    calculateRelatedJobScore,

    isJobFresh,

    getJobAge,

    getJobExpiresAt,

    getJobFreshnessStatus,
};