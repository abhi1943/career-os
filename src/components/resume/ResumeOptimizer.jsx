function ResumeOptimizer({
    optimizedResume,
    loading,
    onOptimize,
}) {
    return (
        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-5">
                🚀 AI Resume Optimizer
            </h2>

            <button
                onClick={onOptimize}
                className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700"
            >
                {loading ? "Optimizing..." : "Optimize Resume"}
            </button>

            {optimizedResume && (
                <div className="mt-6 space-y-5">

                    <div>
                        <h3 className="font-bold text-lg">
                            Optimized Summary
                        </h3>

                        <textarea
                            readOnly
                            rows={6}
                            value={optimizedResume.summary || ""}
                            className="w-full border rounded-xl p-4"
                        />
                    </div>

                    <div>
                        <h3 className="font-bold text-lg">
                            ATS Keywords
                        </h3>

                        <textarea
                            readOnly
                            rows={4}
                            value={optimizedResume.atsKeywords || ""}
                            className="w-full border rounded-xl p-4"
                        />
                    </div>

                </div>
            )}

        </div>
    );
}

export default ResumeOptimizer;