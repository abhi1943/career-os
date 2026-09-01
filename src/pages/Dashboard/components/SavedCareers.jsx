import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";

import { FavoritesContext } from "../../../context/FavoritesContext";

function SavedCareers() {
    const { favorites } =
        useContext(FavoritesContext);

    // ======================================================
    // NORMALIZE FAVORITES
    // ======================================================

    const savedCareers = useMemo(() => {
        if (!Array.isArray(favorites)) {
            return [];
        }

        const seen = new Set();

        return favorites.filter((career) => {
            const careerId =
                career?.id ||
                career?.careerId;

            if (!careerId) {
                return false;
            }

            const normalizedId =
                String(careerId).trim();

            if (!normalizedId) {
                return false;
            }

            if (seen.has(normalizedId)) {
                return false;
            }

            seen.add(normalizedId);

            return true;
        });
    }, [favorites]);

    // ======================================================
    // EMPTY STATE
    // ======================================================

    if (savedCareers.length === 0) {
        return (
            <div className="bg-white rounded-3xl shadow-lg p-8 h-full flex flex-col">

                {/* HEADER */}

                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
                        Favorites
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        ❤️ Saved Careers
                    </h2>
                </div>

                {/* EMPTY */}

                <div className="flex-1 flex items-center justify-center">

                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center w-full">

                        <div className="text-4xl mb-3">
                            ❤️
                        </div>

                        <p className="font-semibold text-gray-700">
                            No saved careers yet.
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Explore careers and save the ones
                            you're interested in.
                        </p>

                        <Link
                            to="/careers"
                            className="inline-flex items-center justify-center mt-4 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition"
                        >
                            Explore Careers →
                        </Link>

                    </div>

                </div>

            </div>
        );
    }

    // ======================================================
    // SAVED CAREERS
    // ======================================================

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 h-full flex flex-col">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-center justify-between mb-6 shrink-0">

                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
                        Favorites
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        ❤️ Saved Careers
                    </h2>
                </div>

                <span className="text-sm font-semibold text-gray-500">
                    {savedCareers.length}{" "}
                    {savedCareers.length === 1
                        ? "saved"
                        : "saved"}
                </span>

            </div>

            {/* ==================================================
                SCROLLABLE CAREER LIST
            ================================================== */}

            <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                {savedCareers.map((career) => {

                    const careerId =
                        career?.id ||
                        career?.careerId;

                    const careerName =
                        career?.name ||
                        career?.title ||
                        "Career";

                    return (
                        <div
                            key={careerId}
                            className="border border-gray-100 rounded-2xl p-5 hover:border-purple-200 hover:shadow-md transition"
                        >

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                {/* CAREER INFO */}

                                <div className="min-w-0">

                                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
                                        {careerName}
                                    </h3>

                                    {career?.averageSalary && (
                                        <p className="text-gray-500 text-sm mt-1">
                                            {career.averageSalary}
                                        </p>
                                    )}

                                </div>

                                {/* VIEW CAREER */}

                                <Link
                                    to={`/career/${encodeURIComponent(
                                        String(careerId)
                                    )}`}
                                    className="inline-flex items-center justify-center shrink-0 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition"
                                >
                                    View Career →
                                </Link>

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default SavedCareers;