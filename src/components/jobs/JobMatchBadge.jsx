import {
    CheckCircle2,
    AlertCircle,
    Target,
    GraduationCap,
    Briefcase,
    Code2,
} from "lucide-react";

import {
    getMatchColor,
    getMatchLabel,
} from "../../utils/jobMatcher";

function JobMatchBadge({
    match,
    compact = false,
}) {
    if (!match) {
        return null;
    }

    const {
        score = 0,
        matchedSkills = [],
        missingSkills = [],
        careerMatch = 0,
        skillMatch = 0,
        educationMatch = 0,
        experienceMatch = 0,
    } = match;

    // ======================================================
    // SAFE SCORE
    // ======================================================

    const safeScore = Math.min(
        100,
        Math.max(
            0,
            Number(score) || 0
        )
    );

    // ======================================================
    // MATCH COLOR
    // ======================================================

    const color =
        getMatchColor(safeScore);

    const label =
        getMatchLabel(safeScore);

    // ======================================================
    // COLOR CLASSES
    // ======================================================

    const colorClasses = {
        green: {
            wrapper:
                "bg-green-50 border-green-200 text-green-700",

            progress:
                "bg-green-500",

            icon:
                "text-green-600",
        },

        blue: {
            wrapper:
                "bg-blue-50 border-blue-200 text-blue-700",

            progress:
                "bg-blue-500",

            icon:
                "text-blue-600",
        },

        yellow: {
            wrapper:
                "bg-yellow-50 border-yellow-200 text-yellow-700",

            progress:
                "bg-yellow-500",

            icon:
                "text-yellow-600",
        },

        red: {
            wrapper:
                "bg-red-50 border-red-200 text-red-700",

            progress:
                "bg-red-500",

            icon:
                "text-red-600",
        },
    };

    const classes =
        colorClasses[color] ||
        colorClasses.blue;

    // ======================================================
    // COMPACT VERSION
    // ======================================================

    if (compact) {
        return (
            <div
                className={`
                    inline-flex
                    items-center
                    gap-2
                    border
                    rounded-full
                    px-3
                    py-1.5
                    text-sm
                    font-semibold
                    ${classes.wrapper}
                `}
                title={`${label} - ${safeScore}%`}
            >
                <Target
                    size={16}
                    className={classes.icon}
                />

                <span>
                    {safeScore}% Match
                </span>
            </div>
        );
    }

    // ======================================================
    // FULL VERSION
    // ======================================================

    return (
        <div
            className={`
                border
                rounded-2xl
                p-4
                ${classes.wrapper}
            `}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                    <div
                        className={`
                            w-10
                            h-10
                            rounded-xl
                            bg-white
                            flex
                            items-center
                            justify-center
                            ${classes.icon}
                        `}
                    >
                        <Target size={21} />
                    </div>

                    <div>

                        <p className="text-xs uppercase tracking-wide font-semibold opacity-70">
                            CareerOS Match
                        </p>

                        <p className="font-bold text-lg">
                            {label}
                        </p>

                    </div>

                </div>

                <div className="text-3xl font-extrabold">
                    {safeScore}%
                </div>

            </div>

            {/* ==================================================
                PROGRESS BAR
            ================================================== */}

            <div className="mt-4">

                <div className="h-2 bg-white/80 rounded-full overflow-hidden">

                    <div
                        className={`
                            h-full
                            rounded-full
                            ${classes.progress}
                        `}
                        style={{
                            width: `${safeScore}%`,
                        }}
                    />

                </div>

            </div>

            {/* ==================================================
                MATCH BREAKDOWN
            ================================================== */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">

                {/* CAREER */}

                <div className="bg-white/70 rounded-xl p-2.5">

                    <div className="flex items-center gap-1.5 text-xs font-semibold">

                        <Target size={14} />

                        <span>
                            Career
                        </span>

                    </div>

                    <p className="font-bold mt-1">
                        {Math.min(
                            100,
                            Math.max(
                                0,
                                Number(
                                    careerMatch
                                ) || 0
                            )
                        )}%
                    </p>

                </div>

                {/* SKILLS */}

                <div className="bg-white/70 rounded-xl p-2.5">

                    <div className="flex items-center gap-1.5 text-xs font-semibold">

                        <Code2 size={14} />

                        <span>
                            Skills
                        </span>

                    </div>

                    <p className="font-bold mt-1">
                        {Math.min(
                            100,
                            Math.max(
                                0,
                                Number(
                                    skillMatch
                                ) || 0
                            )
                        )}%
                    </p>

                </div>

                {/* EDUCATION */}

                <div className="bg-white/70 rounded-xl p-2.5">

                    <div className="flex items-center gap-1.5 text-xs font-semibold">

                        <GraduationCap
                            size={14}
                        />

                        <span>
                            Education
                        </span>

                    </div>

                    <p className="font-bold mt-1">
                        {Math.min(
                            100,
                            Math.max(
                                0,
                                Number(
                                    educationMatch
                                ) || 0
                            )
                        )}%
                    </p>

                </div>

                {/* EXPERIENCE */}

                <div className="bg-white/70 rounded-xl p-2.5">

                    <div className="flex items-center gap-1.5 text-xs font-semibold">

                        <Briefcase
                            size={14}
                        />

                        <span>
                            Experience
                        </span>

                    </div>

                    <p className="font-bold mt-1">
                        {Math.min(
                            100,
                            Math.max(
                                0,
                                Number(
                                    experienceMatch
                                ) || 0
                            )
                        )}%
                    </p>

                </div>

            </div>

            {/* ==================================================
                SKILL DETAILS
            ================================================== */}

            {(matchedSkills.length > 0 ||
                missingSkills.length > 0) && (

                <div className="mt-4 grid sm:grid-cols-2 gap-3">

                    {/* MATCHING SKILLS */}

                    {matchedSkills.length > 0 && (

                        <div className="bg-white/70 rounded-xl p-3">

                            <div className="flex items-center gap-2 font-semibold text-green-700">

                                <CheckCircle2
                                    size={16}
                                />

                                <span>
                                    Matching Skills
                                </span>

                            </div>

                            <div className="flex flex-wrap gap-1.5 mt-2">

                                {matchedSkills
                                    .slice(0, 5)
                                    .map(
                                        (
                                            skill,
                                            index
                                        ) => (
                                            <span
                                                key={`${skill}-${index}`}
                                                className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}

                            </div>

                        </div>
                    )}

                    {/* MISSING SKILLS */}

                    {missingSkills.length > 0 && (

                        <div className="bg-white/70 rounded-xl p-3">

                            <div className="flex items-center gap-2 font-semibold text-orange-700">

                                <AlertCircle
                                    size={16}
                                />

                                <span>
                                    Skills to Improve
                                </span>

                            </div>

                            <div className="flex flex-wrap gap-1.5 mt-2">

                                {missingSkills
                                    .slice(0, 5)
                                    .map(
                                        (
                                            skill,
                                            index
                                        ) => (
                                            <span
                                                key={`${skill}-${index}`}
                                                className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}

                            </div>

                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

export default JobMatchBadge;