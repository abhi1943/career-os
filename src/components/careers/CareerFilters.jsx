const filters = [
  "All",
  "Information Technology",
  "Artificial Intelligence",
  "Cyber Security",
  "Cloud Computing",
  "Web Development",
  "Design",
];

function CareerFilters({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8">

      {filters.map((filter) => (

        <button
          key={filter}
          onClick={() => onSelect(filter)}
          className={`px-5 py-2 rounded-full transition font-medium ${
            selected === filter
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 hover:bg-blue-50"
          }`}
        >
          {filter}
        </button>

      ))}

    </div>
  );
}

export default CareerFilters;