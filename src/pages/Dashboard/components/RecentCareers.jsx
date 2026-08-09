import { History } from "lucide-react";
import { Link } from "react-router-dom";
import { getRecentCareers } from "../../../utils/recentCareers";

function RecentCareers() {
  const careers = getRecentCareers();

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 h-[650px]">

      <div className="flex items-center gap-3 mb-6">

        <History className="text-indigo-600" />

        <h2 className="text-2xl font-bold">
          Recently Viewed
        </h2>

      </div>

      {careers.length === 0 ? (

        <p className="text-gray-500">
          No recently viewed careers.
        </p>

      ) : (

        <div className="space-y-4">

          {careers.map((career) => (

            <Link
              key={career.id}
              to={`/career/${career.id}`}
              className="block border rounded-xl p-4 hover:border-blue-500 transition"
            >

              <h3 className="font-semibold">
                {career.name}
              </h3>

              <p className="text-sm text-gray-500">
                {career.duration}
              </p>

            </Link>

          ))}

        </div>

      )}

    </div>
  );
}

export default RecentCareers;