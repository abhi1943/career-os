// ======================================================
// CareerOS Job Alert Matcher
// ======================================================
// ======================================================

const {
    getActiveJobAlerts,
    matchJobToAlert,
    recordAlertMatch,
} = require("./jobAlertsService");


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
// GET JOB ID
// ======================================================

function getJobId(job) {
    if (!job) {
        return "";
    }

    if (job.id) {
        return String(job.id).trim();
    }

    if (job.redirect_url) {
        return String(
            job.redirect_url
        ).trim();
    }

    if (job.redirectUrl) {
        return String(
            job.redirectUrl
        ).trim();
    }

    if (job.url) {
        return String(
            job.url
        ).trim();
    }

    return [
        job.title || "",
        job.company || "",
        job.location || "",
    ]
        .map(normalizeText)
        .filter(Boolean)
        .join("|");
}


// ======================================================
// GET ENABLED ALERTS
// ======================================================
//
// MySQL version.
//
// When userId is supplied:
//     returns only that user's active alerts.
//
// When userId is omitted:
//     returns all active alerts.
//
// This is useful for:
// - User-specific matching
// - Background job matching
//
// ======================================================

async function getEnabledAlerts(
    userId
) {
    try {
        const alerts =
            await getActiveJobAlerts(
                userId
            );

        if (!Array.isArray(alerts)) {
            return [];
        }

        return alerts.filter(
            (alert) => {
                if (!alert) {
                    return false;
                }

                return (
                    alert.enabled !== false &&
                    alert.active !== false
                );
            }
        );
    } catch (error) {
        console.error(
            "CareerOS: Failed to load enabled job alerts:",
            error.message
        );

        return [];
    }
}


// ======================================================
// MATCH ONE JOB
// ======================================================


async function matchJobAgainstAlerts(
    job,
    userId
) {
    if (!job) {
        return [];
    }

    const jobId =
        getJobId(job);

    if (!jobId) {
        return [];
    }

    const alerts =
        await getEnabledAlerts(
            userId
        );

    const matches = [];

    for (const alert of alerts) {
        try {
            const result =
                matchJobToAlert(
                    job,
                    alert
                );

            if (!result) {
                continue;
            }

            let matched = false;

            let score = null;

            let details = null;

            // --------------------------------------------------
            // SUPPORT BOOLEAN RESULT
            // --------------------------------------------------

            if (
                typeof result ===
                "boolean"
            ) {
                matched = result;
            }

            // --------------------------------------------------
            // SUPPORT OBJECT RESULT
            // --------------------------------------------------

            else if (
                typeof result ===
                "object"
            ) {
                matched =
                    Boolean(
                        result.matched ??
                        result.isMatch ??
                        result.match
                    );

                if (
                    result.score != null
                ) {
                    score =
                        Number(
                            result.score
                        );
                }

                details =
                    result;
            }

            // --------------------------------------------------
            // ADD MATCH
            // --------------------------------------------------

            if (matched) {
                matches.push({
                    alert,

                    alertId:
                        alert.id,

                    userId:
                        alert.userId,

                    jobId,

                    matched: true,

                    score,

                    details,
                });
            }
        } catch (error) {
            console.error(
                `CareerOS: Failed to match job "${jobId}" against alert "${alert?.id}":`,
                error.message
            );
        }
    }

    return matches;
}


// ======================================================
// MATCH ONE JOB AND RECORD MATCHES
// ======================================================
//
// This function:
// 1. Finds matching alerts.
// 2. Records each match in MySQL.
// 3. Prevents duplicate job matches through
//    recordAlertMatch().
//
// ======================================================

async function matchAndRecordJob(
    job,
    userId
) {
    if (!job) {
        return [];
    }

    const matches =
        await matchJobAgainstAlerts(
            job,
            userId
        );

    if (!matches.length) {
        return [];
    }

    const recordedMatches = [];

    for (const match of matches) {
        try {
            const recorded =
                await recordAlertMatch(
                    match.alertId,
                    job,
                    match.userId
                );

            recordedMatches.push({
                ...match,

                recorded:
                    Boolean(recorded),

                alreadyMatched:
                    recorded?.alreadyMatched === true,
            });
        } catch (error) {
            console.error(
                `CareerOS: Failed to record alert match "${match.alertId}" for job "${match.jobId}":`,
                error.message
            );

            recordedMatches.push({
                ...match,

                recorded: false,

                alreadyMatched: false,

                recordError:
                    error.message,
            });
        }
    }

    return recordedMatches;
}


// ======================================================
// MATCH MANY JOBS
// ======================================================


async function matchJobsAgainstAlerts(
    jobs,
    userId
) {
    if (!Array.isArray(jobs)) {
        return [];
    }

    const results = [];

    // --------------------------------------------------
    // PREVENT DUPLICATE JOB PROCESSING
    // --------------------------------------------------

    const processedJobs =
        new Set();

    for (const job of jobs) {
        const jobId =
            getJobId(job);

        if (!jobId) {
            continue;
        }

        if (
            processedJobs.has(
                jobId
            )
        ) {
            continue;
        }

        processedJobs.add(
            jobId
        );

        const matches =
            await matchAndRecordJob(
                job,
                userId
            );

        if (!matches.length) {
            continue;
        }

        results.push({
            job,

            jobId,

            matchCount:
                matches.length,

            matches,
        });
    }

    return results;
}


// ======================================================
// GET MATCH COUNT
// ======================================================

async function getJobAlertMatchCount(
    jobs,
    userId
) {
    const results =
        await matchJobsAgainstAlerts(
            jobs,
            userId
        );

    return results.reduce(
        (
            total,
            result
        ) =>
            total +
            result.matchCount,
        0
    );
}


// ======================================================
// GET UNIQUE MATCHED ALERTS
// ======================================================

async function getUniqueMatchedAlerts(
    jobs,
    userId
) {
    const results =
        await matchJobsAgainstAlerts(
            jobs,
            userId
        );

    const alertMap =
        new Map();

    for (const result of results) {
        for (
            const match
            of result.matches
        ) {
            if (
                !match.alertId
            ) {
                continue;
            }

            const alertId =
                String(
                    match.alertId
                );

            if (
                !alertMap.has(
                    alertId
                )
            ) {
                alertMap.set(
                    alertId,
                    match.alert
                );
            }
        }
    }

    return Array.from(
        alertMap.values()
    );
}


// ======================================================
// GET MATCH SUMMARY
// ======================================================

async function getMatchSummary(
    jobs,
    userId
) {
    const results =
        await matchJobsAgainstAlerts(
            jobs,
            userId
        );

    let matchedJobs = 0;

    let totalMatches = 0;

    const matchedJobIds =
        new Set();

    const matchedAlertIds =
        new Set();

    for (const result of results) {
        matchedJobs++;

        matchedJobIds.add(
            result.jobId
        );

        totalMatches +=
            result.matchCount;

        for (
            const match
            of result.matches
        ) {
            if (
                match.alertId
            ) {
                matchedAlertIds.add(
                    String(
                        match.alertId
                    )
                );
            }
        }
    }

    return {
        jobsChecked:
            Array.isArray(jobs)
                ? jobs.length
                : 0,

        matchedJobs,

        totalMatches,

        uniqueMatchedJobs:
            matchedJobIds.size,

        uniqueMatchedAlerts:
            matchedAlertIds.size,

        results,
    };
}


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    getEnabledAlerts,

    matchJobAgainstAlerts,

    matchAndRecordJob,

    matchJobsAgainstAlerts,

    getJobAlertMatchCount,

    getUniqueMatchedAlerts,

    getMatchSummary,
};