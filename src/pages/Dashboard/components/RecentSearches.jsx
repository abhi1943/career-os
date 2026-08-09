import { Search, Clock } from "lucide-react";
import { getRecentSearches } from "../../../utils/recentSearches";

function RecentSearches() {
  const searches = getRecentSearches();

  return (
   <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 h-[650px] flex flex-col">
      <div className="flex items-center gap-3 mb-6">

        <Search className="text-cyan-600" />

        <h2 className="text-2xl font-bold">
          Recent Searches
        </h2>

      </div>

      {searches.length === 0 ? (

        <div className="text-center py-10">

          <Search
            className="mx-auto text-gray-300"
            size={50}
          />

          <p className="mt-4 text-gray-500">

            No recent searches

          </p>

        </div>

      ) : (

        <div className="space-y-4 flex-1 overflow-y-auto pr-2">

          {searches.map((item, index) => (

            <div
              key={index}
              className="border rounded-2xl p-4 hover:border-cyan-500 transition"
            >

              <div className="font-semibold">

                {item.text}

              </div>

              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">

                <Clock size={15} />

                {item.time}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default RecentSearches;