function CollegeCard({ college }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

      <h3 className="text-2xl font-bold text-slate-800">
        {college.name}
      </h3>

      <p className="mt-3 text-gray-600">
        📍 {college.state}
      </p>

      <p className="mt-2 text-blue-600 font-semibold">
        💰 Fees: {college.fees}
      </p>

      <p className="mt-2 text-yellow-600">
        ⭐ Rating: {college.rating}/5
      </p>

    </div>
  );
}

export default CollegeCard;