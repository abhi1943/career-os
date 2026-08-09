function CareerInterview({ interview }) {
  if (!interview?.technical?.length) return null;

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        🎤 Technical Interview Questions
      </h2>

      <div className="space-y-4">

        {interview.technical.map((question, index) => (

          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <strong>Q{index + 1}.</strong> {question}
          </div>

        ))}

      </div>

    </div>
  );
}

export default CareerInterview;