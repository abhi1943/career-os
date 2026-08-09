import { useState } from "react";
import { analyzeJobDescription } from "../../utils/jobDescriptionAnalyzer";

function JobDescriptionMatcher({ resumeData }) {
    const [jobDescription, setJobDescription] = useState("");
    const [result, setResult] = useState(null);

    const handleAnalyze = () => {
        const analysis = analyzeJobDescription(
            jobDescription,
            resumeData
        );

        setResult(analysis);
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-5">
                Job Description Matcher
            </h2>

            <textarea
                rows={8}
                className="w-full border rounded-xl p-4"
                placeholder="Paste Job Description Here..."
                value={jobDescription}
                onChange={(e) =>
                    setJobDescription(e.target.value)
                }
            />

            <button
                onClick={handleAnalyze}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl"
            >
                Analyze Resume
            </button>

            {result && (

                <div className="mt-6">

                    <h3 className="text-xl font-bold">
                        ATS Match Score
                    </h3>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {result.score}%
                    </p>

                    <div className="mt-6">

                        <h4 className="font-semibold text-green-700">
                            Matching Keywords
                        </h4>

                        <div className="flex flex-wrap gap-2 mt-2">

                            {result.matched.map((word) => (

                                <span
                                    key={word}
                                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
                                >
                                    {word}
                                </span>

                            ))}

                        </div>

                    </div>

                    <div className="mt-6">

                        <h4 className="font-semibold text-red-700">
                            Missing Keywords
                        </h4>

                        <div className="flex flex-wrap gap-2 mt-2">

                            {result.missing.map((word) => (

                                <span
                                    key={word}
                                    className="bg-red-100 text-red-700 px-3 py-1 rounded-full"
                                >
                                    {word}
                                </span>

                            ))}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default JobDescriptionMatcher;