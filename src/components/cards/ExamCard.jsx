function ExamCard({ exam }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6">

      <h3 className="text-2xl font-bold text-slate-800">
        {exam.name}
      </h3>

      <p className="mt-4 text-gray-600">
        🎓 <strong>Eligibility:</strong> {exam.eligibility}
      </p>

      <p className="mt-2 text-blue-600">
        🏛 <strong>Conducted By:</strong> {exam.conductedBy}
      </p>

      <p className="mt-2 text-gray-600">
        💻 <strong>Mode:</strong> {exam.mode}
      </p>

      <p className="mt-2 text-gray-600">
        ⏳ <strong>Duration:</strong> {exam.duration}
      </p>

      <p className="mt-2 text-gray-600">
        📅 <strong>Frequency:</strong> {exam.frequency}
      </p>

      <p className="mt-4 text-gray-500">
        {exam.description}
      </p>

      <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
        View Exam →
      </button>

    </div>
  );
}

export default ExamCard;