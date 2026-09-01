import {
    useContext,
} from "react";

import {
    BookOpen,
    Star,
    MapPin,
    Bookmark,
    ArrowRight,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    CollegeFavoritesContext,
} from "../../../context/CollegeFavoritesContext";


function SavedColleges() {

    const {
        savedColleges,
        toggleCollege,
    } = useContext(
        CollegeFavoritesContext
    );


    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 h-full flex flex-col">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-center justify-between gap-4 mb-6">

                <div className="flex items-center gap-3">

                    <BookOpen
                        className="text-blue-600"
                    />

                    <div>

                        <h2 className="text-2xl font-bold">
                            Saved Colleges
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Colleges you saved for later
                        </p>

                    </div>

                </div>

                <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold shrink-0">
                    {savedColleges.length}
                </span>

            </div>


            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {savedColleges.length === 0 ? (

                <div className="flex-1 flex items-center justify-center text-center">

                    <div>

                        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center">

                            <Bookmark
                                className="text-blue-500"
                                size={26}
                            />

                        </div>

                        <h3 className="mt-4 text-lg font-bold text-gray-800">
                            No Saved Colleges
                        </h3>

                        <p className="text-gray-500 mt-2 max-w-xs">
                            Save colleges from the Colleges page and they will appear here.
                        </p>

                        <Link
                            to="/colleges"
                            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                        >
                            Explore Colleges

                            <ArrowRight
                                size={16}
                            />

                        </Link>

                    </div>

                </div>

            ) : (

                /* ==================================================
                   SAVED COLLEGES
                ================================================== */

                <div className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-2">

                    {savedColleges.map(
                        (college) => (

                            <div
                                key={college.id}
                                className="border border-gray-200 rounded-2xl p-4 hover:border-blue-400 transition"
                            >

                                <div className="flex items-start justify-between gap-3">

                                    <h3 className="font-bold text-gray-900">
                                        {college.name}
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleCollege(
                                                college
                                            )
                                        }
                                        className="text-blue-600 hover:text-red-500 transition shrink-0"
                                        title="Remove saved college"
                                    >
                                        <Bookmark
                                            size={20}
                                            fill="currentColor"
                                        />
                                    </button>

                                </div>


                                <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">

                                    <MapPin
                                        size={15}
                                    />

                                    {college.state ||
                                        college.location ||
                                        "Location not specified"}

                                </div>


                                <div className="flex items-center justify-between mt-3">

                                    <span className="text-sm text-blue-600 font-semibold">
                                        💰 {college.fees}
                                    </span>

                                    <span className="flex items-center gap-1 text-yellow-500 font-semibold text-sm">

                                        <Star
                                            size={15}
                                            fill="currentColor"
                                        />

                                        {college.rating ||
                                            "N/A"}

                                    </span>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default SavedColleges;