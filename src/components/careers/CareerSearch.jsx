import { Search, X } from "lucide-react";

function CareerSearch({ value, onChange }) {
  const clearSearch = () => {
    onChange({
      target: {
        value: "",
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">

      <div className="relative">

        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          size={22}
        />

        <input
          type="text"
          placeholder="Search careers..."
          value={value}
          onChange={onChange}
          className="w-full rounded-2xl border border-gray-300 bg-white py-4 pl-14 pr-14 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
          >
            <X size={20} />
          </button>
        )}

      </div>

    </div>
  );
}

export default CareerSearch;