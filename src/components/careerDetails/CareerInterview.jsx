function CareerInterview({ interview }) {
  if (!interview?.technical?.length) {
    return null;
  }

  return (
    <section
      aria-labelledby="technical-interview-heading"
      className="mt-12 sm:mt-20"
    >

      <h2
        id="technical-interview-heading"
        className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-slate-800"
      >
        🎤 Technical Interview Questions
      </h2>

      <ol className="space-y-4">

        {interview.technical.map(
          (question, index) => (
            <li
              key={index}
              className="
                bg-white
                rounded-2xl
                shadow-lg
                border
                border-gray-100
                p-5
                sm:p-6
                hover:shadow-xl
                transition
              "
            >
              <p className="text-slate-800 leading-relaxed">

                <span className="font-bold text-blue-600">
                  Q{index + 1}.
                </span>{" "}

                <span className="break-words">
                  {question}
                </span>

              </p>
            </li>
          )
        )}

      </ol>

    </section>
  );
}

export default CareerInterview;