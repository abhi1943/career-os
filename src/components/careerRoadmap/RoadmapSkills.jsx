function RoadmapSkills({
    roadmap,
    completedSkills,
}) {

    const allSkills = roadmap.flatMap(
        item => item.skills || []
    );

    const uniqueSkills = [
        ...new Set(allSkills)
    ];

    const completed =
        uniqueSkills.filter(skill =>
            completedSkills.includes(skill)
        );

    const remaining =
        uniqueSkills.filter(skill =>
            !completedSkills.includes(skill)
        );

    return (
        <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white rounded-3xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-4">
                    ✅ Completed Skills
                </h2>

                {completed.length === 0 ? (

                    <p className="text-gray-500">
                        No skills completed yet.
                    </p>

                ) : (

                    <div className="flex flex-wrap gap-2">

                        {completed.map(skill => (

                            <span
                                key={skill}
                                className="bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm"
                            >
                                {skill}
                            </span>

                        ))}

                    </div>

                )}

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-4">
                    🎯 Remaining Skills
                </h2>

                {remaining.length === 0 ? (

                    <p className="text-green-600 font-semibold">
                        🎉 Roadmap completed!
                    </p>

                ) : (

                    <div className="flex flex-wrap gap-2">

                        {remaining.map(skill => (

                            <span
                                key={skill}
                                className="bg-slate-100 text-gray-700 px-3 py-2 rounded-full text-sm"
                            >
                                {skill}
                            </span>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default RoadmapSkills;
