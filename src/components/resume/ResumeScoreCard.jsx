function ResumeScoreCard({ analysis }) {

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

      <h2 className="text-3xl font-bold mb-8">
        🤖 AI Resume Analysis
      </h2>

      {/* Score */}

      <div className="flex items-center justify-between">

        <h3 className="text-2xl font-semibold">
          Resume Score
        </h3>

        <span className="text-5xl font-bold text-blue-600">
          {analysis.score}/100
        </span>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mt-5">

        <div
          className="bg-green-600 h-4 rounded-full transition-all duration-700"
          style={{
            width: `${analysis.score}%`,
          }}
        />

      </div>

      {/* Strengths */}

      <div className="mt-10">

        <h3 className="text-2xl font-bold text-green-600">
          ✅ Strengths
        </h3>

        {analysis.strengths.length ? (

          <ul className="mt-4 space-y-2">

            {analysis.strengths.map((item) => (

              <li key={item}>
                • {item}
              </li>

            ))}

          </ul>

        ) : (

          <p className="mt-4 text-gray-500">
            No strengths detected yet.
          </p>

        )}

      </div>

      {/* Missing */}

      <div className="mt-10">

        <h3 className="text-2xl font-bold text-red-600">
          ❌ Missing
        </h3>

        {analysis.missing.length ? (

          <ul className="mt-4 space-y-2">

            {analysis.missing.map((item) => (

              <li key={item}>
                • {item}
              </li>

            ))}

          </ul>

        ) : (

          <p className="mt-4 text-gray-500">
            Nothing missing.
          </p>

        )}

      </div>

      {/* Suggestions */}

      <div className="mt-10">

        <h3 className="text-2xl font-bold text-orange-600">
          💡 AI Suggestions
        </h3>

        {analysis.suggestions.length ? (

          <ul className="mt-4 space-y-3">

            {analysis.suggestions.map((item) => (

              <li key={item}>
                • {item}
              </li>

            ))}

          </ul>

        ) : (

          <p className="mt-4 text-green-600 font-semibold">
            Excellent Resume 🎉
          </p>

        )}

      </div>

    </div>
  );
}

export default ResumeScoreCard;