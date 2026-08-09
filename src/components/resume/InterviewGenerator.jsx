function InterviewGenerator({ questions }) {

    if (!questions) return null;

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6">
                🎤 AI Interview Questions
            </h2>

            {/* HR */}

            <section className="mb-8">

                <h3 className="font-bold text-blue-700 mb-3">
                    HR Questions
                </h3>

                <ul className="list-disc pl-6 space-y-2">

                    {questions.hrQuestions.map((q, i) => (

                        <li key={i}>{q}</li>

                    ))}

                </ul>

            </section>

            {/* Technical */}

            <section className="mb-8">

                <h3 className="font-bold text-green-700 mb-3">
                    Technical Questions
                </h3>

                <ul className="list-disc pl-6 space-y-2">

                    {questions.technicalQuestions.map((q, i) => (

                        <li key={i}>{q}</li>

                    ))}

                </ul>

            </section>

            {/* Project */}

            <section className="mb-8">

                <h3 className="font-bold text-purple-700 mb-3">
                    Project Questions
                </h3>

                <ul className="list-disc pl-6 space-y-2">

                    {questions.projectQuestions.map((q, i) => (

                        <li key={i}>{q}</li>

                    ))}

                </ul>

            </section>

            {/* Coding */}

            <section>

                <h3 className="font-bold text-red-700 mb-3">
                    Coding Questions
                </h3>

                <ul className="list-disc pl-6 space-y-2">

                    {questions.codingQuestions.map((q, i) => (

                        <li key={i}>{q}</li>

                    ))}

                </ul>

            </section>

        </div>
    );
}

export default InterviewGenerator;