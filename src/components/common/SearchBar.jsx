import { useEffect, useRef, useState } from "react";
import { Search, X, History } from "lucide-react";
import { saveRecentSearch } from "../../utils/recentSearches";

function SearchBar({
  value,
  onChange,
  suggestions = [],
  onSuggestionClick,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [recentSearches, setRecentSearches] = useState([]);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const searches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    setRecentSearches(searches);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleChange = (e) => {
    const searchValue = e.target.value;

    onChange(e);

    setShowSuggestions(true);

    if (searchValue.trim().length >= 3) {
      saveRecentSearch(searchValue.trim());

      const searches =
        JSON.parse(localStorage.getItem("recentSearches")) || [];

      setRecentSearches(searches);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative max-w-2xl mx-auto"
    >
      <Search
        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
        size={22}
      />

      <input
        type="text"
        placeholder="Search careers, colleges, companies..."
        value={value}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleChange}
        className="w-full pl-14 pr-14 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />

      {value && (
        <button
          onClick={() =>
            onChange({
              target: {
                value: "",
              },
            })
          }
          className="absolute right-5 top-1/2 -translate-y-1/2"
        >
          <X size={20} />
        </button>
      )}

      {showSuggestions && (
        <div className="absolute w-full bg-white rounded-2xl shadow-xl mt-3 overflow-hidden z-50">

          {value.length > 0 ? (
            suggestions.length > 0 ? (
              suggestions.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSuggestionClick(item);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-5 py-4 hover:bg-slate-100 flex justify-between items-center text-left"
                >
                  <div>
                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.type}
                    </p>
                  </div>

                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {item.type}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-5 text-gray-500">
                No Results Found
              </div>
            )
          ) : (
            <>
              <div className="px-5 py-3 font-semibold flex items-center gap-2 border-b">
                <History size={18} />
                Recent Searches
              </div>

              {recentSearches.length === 0 ? (
                <div className="p-5 text-gray-500">
                  No recent searches
                </div>
              ) : (
                recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() =>
                      onSuggestionClick({
                        name: search,
                      })
                    }
                    className="w-full px-5 py-3 text-left hover:bg-slate-100"
                  >
                    {search}
                  </button>
                ))
              )}
            </>
          )}

        </div>
      )}
    </div>
  );
}

export default SearchBar;