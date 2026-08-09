import { useState } from "react";
import { predictCollege } from "../../utils/collegePredictorEngine";

function CollegePredictor() {
  const [exam, setExam] = useState("");
  const [branch, setBranch] = useState("");
  const [rank, setRank] = useState("");
  const [result, setResult] = useState([]);

  const handlePredict = () => {
    if (!exam || !branch || !rank) {
      alert("Please select Exam, Branch and enter your Rank.");
      return;
    }

    const colleges = predictCollege(
      exam,
      branch,
      Number(rank)
    );

    setResult(colleges);
  };

  return (
    <section className="min-h-screen bg-slate-100 py-16">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold text-center">
          🎓 College Predictor
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Predict colleges based on your Entrance Exam, Branch and Rank.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mt-10">

          {/* Exam */}

          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            className="border rounded-xl p-4"
          >
            <option value="">Select Exam</option>

            <option value="eapcet">
              EAPCET
            </option>

            <option value="jee">
              JEE Main
            </option>

          </select>

          {/* Branch */}

          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="border rounded-xl p-4"
          >
            <option value="">Select Branch</option>

            <option value="cse">
              Computer Science Engineering
            </option>

            <option value="aiml">
              Artificial Intelligence & Machine Learning
            </option>

            <option value="ece">
              Electronics & Communication Engineering
            </option>

            <option value="eee">
              Electrical & Electronics Engineering
            </option>

            <option value="civil">
              Civil Engineering
            </option>

            <option value="mechanical">
              Mechanical Engineering
            </option>

          </select>

          {/* Rank */}

          <input
            type="number"
            placeholder="Enter Rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="border rounded-xl p-4"
          />

        </div>

        <button
          onClick={handlePredict}
          className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition"
        >
          Predict Colleges
        </button>

        {result.length > 0 && (

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-6">
              Recommended Colleges
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              {result.map((college) => (

                <div
                  key={college}
                  className="bg-slate-100 rounded-2xl p-5 shadow hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold">
                    {college}
                  </h3>
                </div>

              ))}

            </div>

          </div>

        )}

        {result.length === 0 && exam && branch && rank && (
          <div className="mt-10 bg-yellow-50 border border-yellow-300 rounded-xl p-5 text-center">
            <p className="text-gray-700">
              No colleges found for the selected rank and branch.
            </p>
          </div>
        )}

      </div>

    </section>
  );
}

export default CollegePredictor;