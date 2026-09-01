import { useContext } from "react";
import { Bookmark } from "lucide-react";

import {
    CollegeFavoritesContext,
} from "../../context/CollegeFavoritesContext";

function CollegeCard({ college }) {

    const {
        toggleCollege,
        isCollegeSaved,
    } = useContext(
        CollegeFavoritesContext
    );

    const saved =
        isCollegeSaved(college?.id);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-start justify-between gap-4">

                <h3 className="text-2xl font-bold text-slate-800">
                    {college.name}
                </h3>

                <button
                    type="button"
                    onClick={() =>
                        toggleCollege(college)
                    }
                    aria-label={
                        saved
                            ? "Remove college from saved"
                            : "Save college"
                    }
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
                        saved
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                    <Bookmark
                        size={20}
                        fill={
                            saved
                                ? "currentColor"
                                : "none"
                        }
                    />
                </button>

            </div>


            {/* ==================================================
                LOCATION
            ================================================== */}

            <p className="mt-3 text-gray-600">
                📍{" "}
                {college.location
                    ? `${college.location}${
                        college.state
                            ? `, ${college.state}`
                            : ""
                    }`
                    : college.state || "India"}
            </p>


            {/* ==================================================
                COURSE
            ================================================== */}

            {college.course && (
                <p className="mt-2 text-blue-600 font-semibold">
                    🎓 {college.course}
                </p>
            )}


            {/* ==================================================
                COLLEGE TYPE
            ================================================== */}

            {college.type && (
                <p className="mt-2 text-purple-600 font-semibold">
                    🏛️ {college.type}
                </p>
            )}


            {/* ==================================================
                FEES
            ================================================== */}

            {college.fees && (
                <p className="mt-2 text-green-600 font-semibold">
                    💰 Fees: {college.fees}
                </p>
            )}


            {/* ==================================================
                RATING
            ================================================== */}

            {college.rating && (
                <p className="mt-2 text-yellow-600">
                    ⭐ Rating: {college.rating}/5
                </p>
            )}


            {/* ==================================================
                SAVE STATUS
            ================================================== */}

            <p className="mt-4 text-sm font-medium">

                {saved ? (

                    <span className="text-blue-600">
                        ✓ Saved to your colleges
                    </span>

                ) : (

                    <span className="text-gray-400">
                        Save this college for later
                    </span>

                )}

            </p>

        </div>
    );
}

export default CollegeCard;