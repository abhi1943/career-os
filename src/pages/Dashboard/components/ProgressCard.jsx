import { TrendingUp } from "lucide-react";

function ProgressCard({
    overallProgress = 0,
    skills = [],
}) {
    const safeProgress = Math.min(
        Math.max(Number(overallProgress) || 0, 0),
        100
    );

    const safeSkills = Array.isArray(skills)
        ? skills
        : [];

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 h-full min-h-full flex flex-col">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-center justify-between mb-6 shrink-0">

                <div className="flex items-center gap-3 min-w-0">

                    <TrendingUp
                        className="text-green-600 shrink-0"
                        size={24}
                    />

                    <h2 className="text-2xl font-bold truncate">
                        Learning Progress
                    </h2>

                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold shrink-0">
                    {safeProgress}%
                </span>

            </div>

            {/* ==================================================
                OVERALL PROGRESS
            ================================================== */}

            <div className="mb-6 shrink-0">

                <div className="flex justify-between mb-2">

                    <span className="text-gray-700">
                        Overall Progress
                    </span>

                    <span className="font-semibold text-gray-700">
                        {safeProgress}%
                    </span>

                </div>

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

                    <div
                        className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                        style={{
                            width: `${safeProgress}%`,
                        }}
                    />

                </div>

            </div>

            {/* ==================================================
                SKILLS
            ================================================== */}

            <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                {safeSkills.length === 0 ? (

                    <div className="flex items-center justify-center h-full text-center">

                        <div>

                            <p className="text-gray-500">
                                No learning skills available yet.
                            </p>

                            <p className="text-sm text-gray-400 mt-1">
                                Your roadmap progress will appear here.
                            </p>

                        </div>

                    </div>

                ) : (

                    safeSkills.map((item, index) => {

                        const skillName =
                            typeof item === "string"
                                ? item
                                : item?.skill ||
                                  item?.name ||
                                  `Skill ${index + 1}`;

                        const progress =
                            typeof item === "string"
                                ? 0
                                : Math.min(
                                      Math.max(
                                          Number(
                                              item?.progress
                                          ) || 0,
                                          0
                                      ),
                                      100
                                  );

                        return (

                            <div
                                key={`${skillName}-${index}`}
                                className="mb-5 last:mb-0"
                            >

                                <div className="flex justify-between text-sm mb-2">

                                    <span className="text-gray-700 font-medium">
                                        {skillName}
                                    </span>

                                    <span className="text-gray-500">
                                        {progress}%
                                    </span>

                                </div>

                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

                                    <div
                                        className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />

                                </div>

                            </div>

                        );
                    })

                )}

            </div>

        </div>
    );
}

export default ProgressCard;