function RoadmapProgress({
    roadmap = [],
    completedSkills = [],
}) {

    const allSkills = roadmap.flatMap(
        (item) =>
            Array.isArray(item?.skills)
                ? item.skills
                : []
    );

    const totalSkills =
        allSkills.length;

    const completedCount =
        allSkills.filter(
            (skill) =>
                completedSkills.includes(skill)
        ).length;

    const percentage =
        totalSkills === 0
            ? 0
            : Math.round(
                (completedCount /
                    totalSkills) *
                100
            );

    return (

        <div className="bg-white rounded-3xl shadow-lg p-6">

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-gray-500">
                        Roadmap Progress
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        {percentage}%
                    </h2>

                </div>


                <div className="text-right">

                    <p className="text-sm text-gray-500">
                        Skills Completed
                    </p>

                    <p className="text-xl font-bold">
                        {completedCount} / {totalSkills}
                    </p>

                </div>

            </div>


            <div className="bg-gray-200 h-4 rounded-full mt-6 overflow-hidden">

                <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>


            <p className="text-sm text-gray-500 mt-3">
                Click a skill above to mark it as completed.
            </p>

        </div>

    );
}

export default RoadmapProgress;