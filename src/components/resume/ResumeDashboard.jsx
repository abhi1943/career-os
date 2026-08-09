function ResumeDashboard({
    analysis,
    completion,
    versions,
    atsKeywords
}) {

    return (

        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-3xl font-bold mb-8">

                Resume Dashboard

            </h2>

            <div className="grid grid-cols-2 gap-5">

                <div className="bg-blue-50 rounded-xl p-5">

                    <h3 className="font-semibold">

                        Resume Score

                    </h3>

                    <p className="text-4xl font-bold text-blue-700">

                        {analysis.score}%

                    </p>

                </div>

                <div className="bg-green-50 rounded-xl p-5">

                    <h3 className="font-semibold">

                        Completion

                    </h3>

                    <p className="text-4xl font-bold text-green-700">

                        {completion.percentage}%

                    </p>

                </div>

                <div className="bg-purple-50 rounded-xl p-5">

                    <h3 className="font-semibold">

                        ATS Keywords

                    </h3>

                    <p className="text-4xl font-bold text-purple-700">

                        {atsKeywords.found.length}

                    </p>

                </div>

                <div className="bg-orange-50 rounded-xl p-5">

                    <h3 className="font-semibold">

                        Resume Versions

                    </h3>

                    <p className="text-4xl font-bold text-orange-700">

                        {versions.length}

                    </p>

                </div>

            </div>

        </div>

    );

}

export default ResumeDashboard;