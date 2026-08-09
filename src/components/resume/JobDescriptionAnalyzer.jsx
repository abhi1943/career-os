function JobDescriptionAnalyzer({
    jobDescription,
    setJobDescription,
    jdAnalysis,
}) {
    return (
        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6">
                📋 Job Description Analyzer
            </h2>

            <textarea
                rows={8}
                className="w-full border rounded-xl p-4"
                placeholder="Paste the Job Description here..."
                value={jobDescription}
                onChange={(e) =>
                    setJobDescription(e.target.value)
                }
            />

            {jdAnalysis && (
                <div className="mt-8">

                    <h3 className="text-xl font-bold">
                        Resume Match
                    </h3>

                    <div className="bg-gray-200 h-4 rounded-full mt-3">

                        <div
                            className="bg-blue-600 h-4 rounded-full"
                            style={{
                                width: `${jdAnalysis.score}%`,
                            }}
                        />

                    </div>

                    <p className="mt-3 font-bold">
                        {jdAnalysis.score}% Match
                    </p>

                    <div className="mt-6">

                        <h4 className="font-semibold text-green-700">
                            Matched Skills
                        </h4>

                        <div className="flex flex-wrap gap-2 mt-2">

                            {jdAnalysis.matched.map((item) => (

                                <span
                                    key={item}
                                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
                                >
                                    {item}
                                </span>

                            ))}

                        </div>

                    </div>

                    <div className="mt-6">

                        <h4 className="font-semibold text-red-700">
                            Missing Skills
                        </h4>

                        <div className="flex flex-wrap gap-2 mt-2">

                            {jdAnalysis.missing.map((item) => (

                                <span
                                    key={item}
                                    className="bg-red-100 text-red-700 px-3 py-1 rounded-full"
                                >
                                    {item}
                                </span>

                            ))}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default JobDescriptionAnalyzer;