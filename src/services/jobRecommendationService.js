import {
    calculateJobMatch,
} from "../utils/jobMatcher";

// ======================================================
// CareerOS Advanced Job Recommendation Service
// ======================================================
// Purpose:
// - Rank jobs using CareerOS job matcher
// - Calculate match information for every job
// - Sort jobs from strongest to weakest match
// - Provide recommended jobs
// - Provide recommendation reasons
// - Enrich jobs with recommendation data
// - Keep recommendation logic separate from API logic
// ======================================================


// ======================================================
// SAFE ARRAY
// ======================================================

function toArray(value) {
    return Array.isArray(value)
        ? value
        : [];
}


// ======================================================
// SAFE NUMBER
// ======================================================

function toNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


// ======================================================
// GET JOB ID
// ======================================================

export function getRecommendationJobId(job) {
    if (!job) {
        return "";
    }

    return String(
        job.id ||
            job.redirect_url ||
            job.redirectUrl ||
            job.url ||
            `${job.title || ""}-${
                typeof job.company === "string"
                    ? job.company
                    : job.company?.display_name ||
                      job.company?.name ||
                      ""
            }`
    );
}


// ======================================================
// CALCULATE JOB RECOMMENDATION
// ======================================================

export function calculateJobRecommendation(
    job,
    student
) {
    if (!job || !student) {
        return {
            job,
            score: 0,
            match: null,
        };
    }

    const match = calculateJobMatch(
        job,
        student
    );

    return {
        job,

        score: toNumber(
            match?.score,
            0
        ),

        match,
    };
}


// ======================================================
// RANK JOBS
// ======================================================
//
// Ranking priority:
//
// 1. Match score
// 2. Career match
// 3. Skill match
// 4. Education match
// 5. Experience match
//
// This makes jobs with the same overall score
// more intelligently ordered.
// ======================================================

export function rankJobs(
    jobs = [],
    student
) {
    const safeJobs = toArray(jobs);

    if (
        safeJobs.length === 0 ||
        !student
    ) {
        return [];
    }

    return safeJobs
        .filter(Boolean)
        .map((job, index) => ({
            ...calculateJobRecommendation(
                job,
                student
            ),

            originalIndex: index,
        }))
        .sort((a, b) => {
            // ------------------------------------------
            // Overall score
            // ------------------------------------------

            if (
                b.score !== a.score
            ) {
                return b.score - a.score;
            }

            // ------------------------------------------
            // Career match
            // ------------------------------------------

            const careerDifference =
                toNumber(
                    b.match?.careerMatch
                ) -
                toNumber(
                    a.match?.careerMatch
                );

            if (
                careerDifference !== 0
            ) {
                return careerDifference;
            }

            // ------------------------------------------
            // Skill match
            // ------------------------------------------

            const skillDifference =
                toNumber(
                    b.match?.skillMatch
                ) -
                toNumber(
                    a.match?.skillMatch
                );

            if (
                skillDifference !== 0
            ) {
                return skillDifference;
            }

            // ------------------------------------------
            // Education match
            // ------------------------------------------

            const educationDifference =
                toNumber(
                    b.match?.educationMatch
                ) -
                toNumber(
                    a.match?.educationMatch
                );

            if (
                educationDifference !== 0
            ) {
                return educationDifference;
            }

            // ------------------------------------------
            // Experience match
            // ------------------------------------------

            const experienceDifference =
                toNumber(
                    b.match?.experienceMatch
                ) -
                toNumber(
                    a.match?.experienceMatch
                );

            if (
                experienceDifference !== 0
            ) {
                return experienceDifference;
            }

            // ------------------------------------------
            // Preserve original API order
            // ------------------------------------------

            return (
                a.originalIndex -
                b.originalIndex
            );
        });
}


// ======================================================
// GET RECOMMENDED JOBS
// ======================================================
//
// Default:
// - Top 10 jobs
//
// Options:
// - limit
// - minimumScore
// ======================================================

export function getRecommendedJobs(
    jobs = [],
    student,
    {
        limit = 10,
        minimumScore = 0,
    } = {}
) {
    const rankedJobs = rankJobs(
        jobs,
        student
    );

    const safeLimit = Math.max(
        0,
        toNumber(limit, 10)
    );

    const safeMinimumScore = Math.max(
        0,
        toNumber(minimumScore, 0)
    );

    return rankedJobs
        .filter(
            (item) =>
                item.score >=
                safeMinimumScore
        )
        .slice(
            0,
            safeLimit
        );
}


// ======================================================
// GET TOP RECOMMENDATION
// ======================================================

export function getTopRecommendedJob(
    jobs = [],
    student
) {
    const recommendations =
        getRecommendedJobs(
            jobs,
            student,
            {
                limit: 1,
                minimumScore: 0,
            }
        );

    return (
        recommendations[0] ||
        null
    );
}


// ======================================================
// GET HIGH MATCH JOBS
// ======================================================
//
// Strong recommendation:
// score >= 70
//
// ======================================================

export function getHighMatchJobs(
    jobs = [],
    student
) {
    const safeJobs =
        toArray(jobs);

    return getRecommendedJobs(
        safeJobs,
        student,
        {
            limit:
                safeJobs.length || 100,
            minimumScore: 70,
        }
    );
}


// ======================================================
// GET EXCELLENT MATCH JOBS
// ======================================================
//
// Excellent recommendation:
// score >= 85
//
// ======================================================

export function getExcellentMatchJobs(
    jobs = [],
    student
) {
    const safeJobs =
        toArray(jobs);

    return getRecommendedJobs(
        safeJobs,
        student,
        {
            limit:
                safeJobs.length || 100,
            minimumScore: 85,
        }
    );
}


// ======================================================
// GET RECOMMENDATION SUMMARY
// ======================================================

export function getRecommendationSummary(
    jobs = [],
    student
) {
    const rankedJobs =
        rankJobs(
            jobs,
            student
        );

    if (
        rankedJobs.length === 0
    ) {
        return {
            totalJobs: 0,
            recommendedJobs: 0,
            excellentMatches: 0,
            strongMatches: 0,
            goodMatches: 0,
            partialMatches: 0,
            lowMatches: 0,
            averageScore: 0,
            topScore: 0,
        };
    }

    const totalScore =
        rankedJobs.reduce(
            (total, item) =>
                total +
                toNumber(
                    item.score
                ),
            0
        );

    const averageScore =
        Math.round(
            totalScore /
                rankedJobs.length
        );

    const excellentMatches =
        rankedJobs.filter(
            (item) =>
                item.score >= 85
        ).length;

    const strongMatches =
        rankedJobs.filter(
            (item) =>
                item.score >= 70
        ).length;

    const goodMatches =
        rankedJobs.filter(
            (item) =>
                item.score >= 50 &&
                item.score < 70
        ).length;

    const partialMatches =
        rankedJobs.filter(
            (item) =>
                item.score >= 30 &&
                item.score < 50
        ).length;

    const lowMatches =
        rankedJobs.filter(
            (item) =>
                item.score < 30
        ).length;

    return {
        totalJobs:
            rankedJobs.length,

        recommendedJobs:
            strongMatches,

        excellentMatches,

        strongMatches,

        goodMatches,

        partialMatches,

        lowMatches,

        averageScore,

        topScore:
            rankedJobs[0]?.score || 0,
    };
}


// ======================================================
// GET RECOMMENDATION REASONS
// ======================================================

export function getRecommendationReasons(
    match
) {
    if (!match) {
        return [];
    }

    const reasons = [];

    // ==================================================
    // CAREER
    // ==================================================

    if (
        match.careerMatch >= 85
    ) {
        reasons.push(
            "Strong career goal match"
        );
    } else if (
        match.careerMatch >= 60
    ) {
        reasons.push(
            "Related to your career goal"
        );
    }

    // ==================================================
    // SKILLS
    // ==================================================

    if (
        match.skillMatch >= 80
    ) {
        reasons.push(
            "Strong skills match"
        );
    } else if (
        match.skillMatch >= 50
    ) {
        reasons.push(
            "Several relevant skills"
        );
    }

    // ==================================================
    // EDUCATION
    // ==================================================

    if (
        match.educationMatch >= 90
    ) {
        reasons.push(
            "Education requirements match"
        );
    }

    // ==================================================
    // EXPERIENCE
    // ==================================================

    if (
        match.experienceMatch >= 90
    ) {
        reasons.push(
            "Experience level matches"
        );
    }

    // ==================================================
    // MATCHED SKILLS
    // ==================================================

    if (
        Array.isArray(
            match.matchedSkills
        ) &&
        match.matchedSkills.length > 0
    ) {
        reasons.push(
            `${match.matchedSkills.length} matching skill${
                match.matchedSkills.length === 1
                    ? ""
                    : "s"
            }`
        );
    }

    // ==================================================
    // MISSING SKILLS
    // ==================================================

    if (
        Array.isArray(
            match.missingSkills
        ) &&
        match.missingSkills.length > 0
    ) {
        reasons.push(
            `Learn ${match.missingSkills
                .slice(0, 3)
                .join(", ")}`
        );
    }

    return reasons;
}


// ======================================================
// ENRICH JOB WITH RECOMMENDATION DATA
// ======================================================

export function enrichJobWithRecommendation(
    job,
    student
) {
    const result =
        calculateJobRecommendation(
            job,
            student
        );

    if (!result.match) {
        return {
            ...job,

            recommendationScore: 0,

            recommendationMatch:
                null,

            recommendationReasons:
                [],
        };
    }

    return {
        ...job,

        recommendationScore:
            result.score,

        recommendationMatch:
            result.match,

        recommendationReasons:
            getRecommendationReasons(
                result.match
            ),
    };
}


// ======================================================
// GET ENRICHED RECOMMENDATIONS
// ======================================================

export function getEnrichedRecommendedJobs(
    jobs = [],
    student,
    {
        limit = 10,
        minimumScore = 0,
    } = {}
) {
    const recommendations =
        getRecommendedJobs(
            jobs,
            student,
            {
                limit,
                minimumScore,
            }
        );

    return recommendations.map(
        (item) =>
            enrichJobWithRecommendation(
                item.job,
                student
            )
    );
}


// ======================================================
// GET RECOMMENDATION STATS
// ======================================================

export function getRecommendationStats(
    jobs = [],
    student
) {
    const rankedJobs =
        rankJobs(
            jobs,
            student
        );

    if (
        rankedJobs.length === 0
    ) {
        return {
            total: 0,
            excellent: 0,
            strong: 0,
            good: 0,
            partial: 0,
            low: 0,
            average: 0,
            highest: 0,
        };
    }

    const scores =
        rankedJobs.map(
            (item) =>
                toNumber(
                    item.score
                )
        );

    const total =
        scores.length;

    const average =
        Math.round(
            scores.reduce(
                (sum, score) =>
                    sum + score,
                0
            ) / total
        );

    return {
        total,

        excellent:
            scores.filter(
                (score) =>
                    score >= 85
            ).length,

        strong:
            scores.filter(
                (score) =>
                    score >= 70 &&
                    score < 85
            ).length,

        good:
            scores.filter(
                (score) =>
                    score >= 50 &&
                    score < 70
            ).length,

        partial:
            scores.filter(
                (score) =>
                    score >= 30 &&
                    score < 50
            ).length,

        low:
            scores.filter(
                (score) =>
                    score < 30
            ).length,

        average,

        highest:
            Math.max(
                ...scores
            ),
    };
}