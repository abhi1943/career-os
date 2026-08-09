import { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    question: "Which subject do you enjoy the most?",
    options: [
      "Mathematics",
      "Biology",
      "Commerce",
      "Arts",
      "Computers",
    ],
  },
  {
    question: "What kind of work do you like?",
    options: [
      "Problem Solving",
      "Helping People",
      "Managing Business",
      "Designing",
      "Programming",
    ],
  },
  {
    question: "How do you prefer learning?",
    options: [
      "Theory",
      "Practical",
      "Projects",
      "Research",
    ],
  },
  {
    question: "Which environment do you prefer?",
    options: [
      "Office",
      "Hospital",
      "Field Work",
      "Remote",
      "Startup",
    ],
  },
  {
    question: "What motivates you most?",
    options: [
      "High Salary",
      "Creativity",
      "Helping Society",
      "Technology",
      "Leadership",
    ],
  },
];

function CareerAssessment() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});

  const handleSelect = (qIndex, answer) => {
    setAnswers({
      ...answers,
      [qIndex]: answer,
    });
  };

  const handleSubmit = () => {
    const values = Object.values(answers);

    if (values.length !== questions.length) {
      alert("Please answer all questions.");
      return;
    }

    let recommendation = "Software Engineer";

    if (
      values.includes("Biology") ||
      values.includes("Helping People")
    ) {
      recommendation = "Doctor";
    }

    if (
      values.includes("Commerce") ||
      values.includes("Leadership")
    ) {
      recommendation = "Business Analyst";
    }

    if (
      values.includes("Arts") ||
      values.includes("Creativity")
    ) {
      recommendation = "UI UX Designer";
    }

    localStorage.setItem(
      "careerAssessment",
      JSON.stringify({
        answers,
        recommendation,
      })
    );

    alert(`Recommended Career: ${recommendation}`);

    navigate("/dashboard");
  };

  return (
    <section className="min-h-screen bg-slate-100 py-14">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold mb-10 text-center">
          Career Assessment
        </h1>

        <div className="space-y-10">

          {questions.map((q, index) => (
            <div key={index}>

              <h2 className="font-semibold text-xl mb-5">
                {index + 1}. {q.question}
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                {q.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(index, option)}
                    className={`border rounded-xl py-3 transition
                      ${
                        answers[index] === option
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-50"
                      }`}
                  >
                    {option}
                  </button>
                ))}

              </div>

            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700"
          >
            Get My Recommendation
          </button>

        </div>

      </div>
    </section>
  );
}

export default CareerAssessment;