function ExamCard({ exam }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

      <h3 className="text-2xl font-bold text-slate-800">
        {exam.name}
      </h3>

      <p className="mt-3 text-gray-600">
        🎓 Eligibility: {exam.eligibility}
      </p>

      <p className="mt-2 text-blue-600">
        🏛 Conducted By: {exam.conductedBy}
      </p>

    </div>
  );
}

export default ExamCard;