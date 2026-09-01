
import {
  Search,
  Clock,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getSearchHistory,
  deleteSearchHistory,
  clearSearchHistory,
} from "../../../services/searchHistoryApi";

function RecentSearches() {
  // ==================================================
  // SEARCH HISTORY STATE
  // ==================================================

  const [searches, setSearches] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [clearing, setClearing] = useState(false);

  const [actionMessage, setActionMessage] = useState("");

  // ==================================================
  // LOAD SEARCH HISTORY
  // ==================================================

  const loadSearchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const history = await getSearchHistory();

      setSearches(
        Array.isArray(history)
          ? history
          : []
      );
    } catch (error) {
      console.error(
        "CareerOS Recent Searches Error:",
        error
      );

      setError(
        "Unable to load recent searches."
      );

      setSearches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================================================
  // INITIAL LOAD
  // ==================================================
  //
  // Defer the call until after the effect has completed.
  // This avoids the React set-state-in-effect lint rule
  // while preserving the existing loading behaviour.
  //

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadSearchHistory();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadSearchHistory]);

  // ==================================================
  // GET SEARCH TEXT
  // ==================================================

  const getSearchText = (item) => {
    return (
      item?.text ||
      item?.query ||
      item?.search ||
      item?.career ||
      "Search"
    );
  };

  // ==================================================
  // GET LOCATION
  // ==================================================

  const getSearchLocation = (item) => {
    return (
      item?.location ||
      item?.locationName ||
      item?.city ||
      ""
    );
  };

  // ==================================================
  // GET FILTER SUMMARY
  // ==================================================

  const getFilterSummary = (item) => {
    const filters = [];

    if (
      item?.experience &&
      item.experience !== "Any Experience"
    ) {
      filters.push(item.experience);
    }

    if (
      item?.jobType &&
      item.jobType !== "Any Type"
    ) {
      filters.push(item.jobType);
    }

    if (
      item?.workMode &&
      item.workMode !== "Any"
    ) {
      filters.push(item.workMode);
    }

    if (
      item?.salary &&
      item.salary !== "Any Salary"
    ) {
      filters.push(item.salary);
    }

    return filters.join(" • ");
  };

  // ==================================================
  // FORMAT SEARCH TIME
  // ==================================================

  const getSearchTime = (item) => {
    if (item?.time) {
      return item.time;
    }

    const timestamp =
      item?.createdAt ||
      item?.created_at ||
      item?.searchedAt ||
      item?.searched_at ||
      item?.timestamp;

    if (!timestamp) {
      return "Recently";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // ==================================================
  // GET HISTORY ID
  // ==================================================

  const getHistoryId = (item) => {
    return (
      item?.id ||
      item?._id ||
      item?.searchId ||
      ""
    );
  };

  // ==================================================
  // DELETE SINGLE SEARCH
  // ==================================================

  const handleDeleteSearch = async (item) => {
    const id = getHistoryId(item);

    if (!id) {
      return;
    }

    try {
      setDeletingId(id);
      setActionMessage("");
      setError("");

      await deleteSearchHistory(id);

      setSearches((previousSearches) =>
        previousSearches.filter(
          (searchItem) =>
            getHistoryId(searchItem) !== id
        )
      );

      setActionMessage(
        "Search removed successfully."
      );
    } catch (error) {
      console.error(
        "CareerOS Delete Search Error:",
        error
      );

      setError(
        "Unable to delete this search."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==================================================
  // CLEAR ALL SEARCH HISTORY
  // ==================================================

  const handleClearAll = async () => {
    if (!searches.length || clearing) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear all recent searches?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setClearing(true);
      setError("");
      setActionMessage("");

      await clearSearchHistory();

      setSearches([]);

      setActionMessage(
        "Search history cleared successfully."
      );
    } catch (error) {
      console.error(
        "CareerOS Clear Search History Error:",
        error
      );

      setError(
        "Unable to clear search history."
      );
    } finally {
      setClearing(false);
    }
  };

  // ==================================================
  // LOADING STATE
  // ==================================================

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 h-full min-h-0 flex flex-col">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">

            <Search
              className="text-cyan-600"
              size={22}
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Recent Searches
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your recent job searches
            </p>

          </div>

        </div>

        <div className="flex-1 flex items-center justify-center">

          <div className="text-center">

            <div className="w-10 h-10 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin mx-auto" />

            <p className="text-gray-500 mt-4">
              Loading search history...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ==================================================
  // ERROR STATE
  // ==================================================

  if (error && !searches.length) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 h-full min-h-0 flex flex-col">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">

            <Search
              className="text-cyan-600"
              size={22}
            />

          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Recent Searches
          </h2>

        </div>

        <div className="flex-1 flex items-center justify-center">

          <div className="text-center">

            <Search
              className="mx-auto text-gray-300"
              size={52}
            />

            <p className="mt-4 text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={loadSearchHistory}
              className="mt-5 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 h-full min-h-0 flex flex-col">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center justify-between gap-4 mb-5 shrink-0">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">

            <Search
              className="text-cyan-600"
              size={22}
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Recent Searches
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your recent job searches
            </p>

          </div>

        </div>

        {/* CLEAR ALL */}

        {searches.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            disabled={clearing}
            className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 disabled:opacity-50 transition"
          >

            <Trash2 size={16} />

            {clearing
              ? "Clearing..."
              : "Clear All"}

          </button>
        )}

      </div>

      {/* ==================================================
          ACTION MESSAGE
      ================================================== */}

      {actionMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center justify-between gap-3">

          <span>
            {actionMessage}
          </span>

          <button
            type="button"
            onClick={() =>
              setActionMessage("")
            }
            className="text-green-600 hover:text-green-800"
          >

            <X size={16} />

          </button>

        </div>
      )}

      {/* ==================================================
          ERROR MESSAGE
      ================================================== */}

      {error && searches.length > 0 && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {searches.length === 0 ? (

        <div className="flex-1 flex items-center justify-center">

          <div className="text-center">

            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto">

              <Search
                className="text-gray-300"
                size={38}
              />

            </div>

            <h3 className="text-lg font-semibold text-slate-700 mt-5">
              No recent searches
            </h3>

            <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
              Your job searches will appear
              here when you search for
              opportunities.
            </p>

          </div>

        </div>

      ) : (

        /* ==================================================
           SEARCH HISTORY LIST
        ================================================== */

        <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-2">

          {searches.map((item, index) => {

            const id =
              getHistoryId(item);

            const location =
              getSearchLocation(item);

            const filterSummary =
              getFilterSummary(item);

            return (
              <div
                key={id || index}
                className="group border border-gray-100 rounded-2xl p-4 hover:border-cyan-300 hover:bg-cyan-50/30 transition-all duration-200"
              >

                <div className="flex items-start justify-between gap-4">

                  {/* SEARCH DETAILS */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start gap-3">

                      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">

                        <Search
                          size={17}
                          className="text-cyan-600"
                        />

                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold text-slate-800 truncate">
                          {getSearchText(item)}
                        </p>

                        {/* LOCATION */}

                        {location && (
                          <p className="text-sm text-gray-500 mt-1">
                            📍 {location}
                          </p>
                        )}

                        {/* FILTERS */}

                        {filterSummary && (
                          <p className="text-xs text-gray-400 mt-1">
                            {filterSummary}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* SEARCH TIME */}

                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">

                      <Clock size={14} />

                      <span>
                        {getSearchTime(item)}
                      </span>

                    </div>

                  </div>

                  {/* DELETE BUTTON */}

                  {id && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteSearch(item)
                      }
                      disabled={
                        deletingId === id
                      }
                      title="Delete search"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 transition shrink-0"
                    >

                      {deletingId === id ? (

                        <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />

                      ) : (

                        <Trash2 size={17} />

                      )}

                    </button>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default RecentSearches;
  
