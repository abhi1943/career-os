function RoadmapCard({
    roadmap,
    completedSkills,
    onToggleSkill,
}) {
    return (
        <div className="bg-white rounded-3xl shadow-lg p-6">

            <div className="flex items-center justify-between mb-5">

                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        MONTH {roadmap.month}
                    </p>

                    <h2 className="text-2xl font-bold mt-1">
                        {roadmap.title}
                    </h2>
                </div>

                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                    {roadmap.month}
                </div>

            </div>

            <div className="space-y-3">

                {roadmap.skills.map((skill) => {

                    const completed =
                        completedSkills.includes(skill);

                    return (
                        <button
                            key={skill}
                            type="button"
                            onClick={() =>
                                onToggleSkill(skill)
                            }
                            className={`w-full flex items-center gap-3 text-left p-3 rounded-xl transition ${
                                completed
                                    ? "bg-green-50 text-green-700"
                                    : "bg-slate-50 hover:bg-slate-100"
                            }`}
                        >

                            <span
                                className={`w-6 h-6 rounded-full border flex items-center justify-center text-sm ${
                                    completed
                                        ? "bg-green-500 text-white border-green-500"
                                        : "border-gray-300"
                                }`}
                            >
                                {completed ? "✓" : ""}
                            </span>

                            <span
                                className={
                                    completed
                                        ? "line-through"
                                        : ""
                                }
                            >
                                {skill}
                            </span>

                        </button>
                    );

                })}

            </div>

        </div>
    );
}

export default RoadmapCard;
