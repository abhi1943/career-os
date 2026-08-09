function ResumeSuggestions({ analysis }) {

    if (!analysis) return null;

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-5">
                💡 AI Suggestions
            </h2>

            <div className="space-y-3">

                {analysis.suggestions.map((item, index) => (

                    <div
                        key={index}
                        className="flex gap-3 items-start border rounded-xl p-4 bg-yellow-50"
                    >
                        <span className="text-xl">💡</span>

                        <span>{item}</span>
                    </div>

                ))}

            </div>

        </div>
    );
}

export default ResumeSuggestions;