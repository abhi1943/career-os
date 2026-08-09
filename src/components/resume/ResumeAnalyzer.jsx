function ResumeAnalyzer({ analysis, atsKeywords }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

      <h2 className="text-3xl font-bold mb-8">
        🤖 ATS Resume Analysis
      </h2>

      {/* ATS Score */}

      <div className="mb-8">

        <div className="flex justify-between">

          <h3 className="text-xl font-bold">
            ATS Compatibility Score
          </h3>

          <span className="text-3xl font-bold text-blue-600">
            {analysis.score}/100
          </span>

        </div>

        <div className="bg-gray-200 h-4 rounded-full mt-4">

          <div
            className={`h-4 rounded-full transition-all duration-700 ${analysis.score >= 90
        ? "🟢 Excellent ATS Resume"
        : analysis.score >= 80
        ? "🟡 Good Resume"
        : analysis.score >= 70
        ? "🟠 Needs Improvement"
        : "🔴 ATS Optimization Required"
              }`}
            style={{
              width: `${analysis.score}%`,
            }}
          />

        </div>

      </div>

      {/* Quick Checks */}

      <div className="grid md:grid-cols-4 gap-4 mb-10">

        <div className="bg-green-50 rounded-xl p-4">
          <h4 className="font-semibold">
            Keywords
          </h4>

          <p className="text-xl font-bold text-green-600">
            {atsKeywords?.score || 0}%
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-semibold">
            Formatting
          </h4>

          <p className="text-xl font-bold text-blue-600">
            {analysis.formattingScore}%
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4">
          <h4 className="font-semibold">
            Projects
          </h4>

          <p className="text-xl font-bold text-purple-600">
            {analysis.projectScore}%
          </p>
        </div>

        <div className="bg-orange-50 rounded-xl p-4">
          <h4 className="font-semibold">
            Experience
          </h4>

          <p className="text-xl font-bold text-orange-600">
            {analysis.experienceScore}%
          </p>
        </div>

      </div>
      {/* ATS Keywords */}

      {atsKeywords && (

        <div className="mb-10">

          <h3 className="text-xl font-bold text-green-700 mb-4">
            ✅ Found ATS Keywords
          </h3>

          <div className="flex flex-wrap gap-2">

            {atsKeywords.found.map((item) => (

              <span
                key={item}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
              >
                {item}
              </span>

            ))}

          </div>

        </div>

      )}

      <div className="grid md:grid-cols-3 gap-8">

        {/* Strengths */}

        <div>

          <h3 className="font-bold text-green-600 mb-4">
            ✅ Strengths
          </h3>

          <ul className="space-y-2 list-disc ml-5">

            {analysis.strengths.map((item, index) => (

              <li key={index}>
                {item}
              </li>

            ))}

          </ul>

        </div>

        {/* Suggestions */}

        <div>

          <h3 className="font-bold text-orange-600 mb-4">
            💡 Suggestions
          </h3>

          <ul className="space-y-2 list-disc ml-5">

            {analysis.suggestions.map((item, index) => (

              <li key={index}>
                {item}
              </li>

            ))}

          </ul>

        </div>

        {/* Missing */}

        <div>

          <h3 className="font-bold text-red-600 mb-4">
            ❌ Missing Keywords
          </h3>

          <div className="flex flex-wrap gap-2">

            {(atsKeywords?.missing || analysis.missing).map((item) => (

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

    </div>


  );
}

export default ResumeAnalyzer;