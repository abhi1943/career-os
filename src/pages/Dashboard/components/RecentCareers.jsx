
import {
    History,
    ArrowRight,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getRecentCareers,
} from "../../../utils/recentCareers";

function RecentCareers() {

    // ======================================================
    // STATE
    // ======================================================

    const [
        careers,
        setCareers,
    ] = useState(() => {

        const recent =
            getRecentCareers();

        return Array.isArray(recent)
            ? recent
            : [];
    });

    // ======================================================
    // LOAD RECENT CAREERS
    // ======================================================

    const loadRecentCareers = useCallback(() => {

        const recent =
            getRecentCareers();

        setCareers(
            Array.isArray(recent)
                ? recent
                : []
        );

    }, []);

    // ======================================================
    // LISTEN FOR SAME-TAB UPDATES
    // ======================================================

    useEffect(() => {

        const handleRecentCareersUpdate =
            () => {
                loadRecentCareers();
            };

        window.addEventListener(
            "careerOS:recentCareersUpdated",
            handleRecentCareersUpdate
        );

        return () => {
            window.removeEventListener(
                "careerOS:recentCareersUpdated",
                handleRecentCareersUpdate
            );
        };

    }, [loadRecentCareers]);

    // ======================================================
    // LISTEN FOR OTHER-TAB STORAGE UPDATES
    // ======================================================

    useEffect(() => {

        const handleStorage = (event) => {

            if (
                !event.key ||
                !event.key.startsWith(
                    "careerOS_recent_careers_"
                )
            ) {
                return;
            }

            loadRecentCareers();
        };

        window.addEventListener(
            "storage",
            handleStorage
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorage
            );
        };

    }, [loadRecentCareers]);

    // ======================================================
    // OPEN CAREER
    // ======================================================

    const getCareerPath = (career) => {

        const careerId =
            career?.id ||
            career?.careerId;

        if (!careerId) {
            return "/careers";
        }

        return `/career/${encodeURIComponent(
            String(careerId)
        )}`;
    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 h-[650px] flex flex-col">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-center justify-between gap-4 mb-6">

                <div className="flex items-center gap-3">

                    <History
                        className="text-indigo-600"
                    />

                    <div>

                        <h2 className="text-2xl font-bold">
                            Recently Viewed
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Careers you explored recently
                        </p>

                    </div>

                </div>

                <Link
                    to="/careers"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition shrink-0"
                >
                    View All

                    <ArrowRight size={16} />

                </Link>

            </div>

            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {careers.length === 0 ? (

                <div className="flex-1 flex items-center justify-center text-center">

                    <div>

                        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center">

                            <History
                                className="text-indigo-500"
                                size={26}
                            />

                        </div>

                        <h3 className="mt-4 text-lg font-bold text-gray-800">
                            No Recently Viewed Careers
                        </h3>

                        <p className="text-gray-500 mt-2 max-w-xs">
                            Explore careers and they will
                            appear here for quick access.
                        </p>

                        <Link
                            to="/careers"
                            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                        >
                            Explore Careers

                            <ArrowRight size={16} />

                        </Link>

                    </div>

                </div>

            ) : (

                /* ==================================================
                   RECENT CAREERS
                ================================================== */

                <div className="space-y-4 flex-1 overflow-y-auto pr-2">

                    {careers.map((career) => {

                        const careerId =
                            career?.id ||
                            career?.careerId;

                        if (!careerId) {
                            return null;
                        }

                        return (
                            <Link
                                key={String(careerId)}
                                to={getCareerPath(career)}
                                className="block border border-gray-200 rounded-xl p-4 hover:border-indigo-500 hover:shadow-sm transition"
                            >

                                <div className="flex items-center justify-between gap-4">

                                    <div className="min-w-0">

                                        <h3 className="font-semibold text-gray-900">
                                            {career.name ||
                                                "Career"}
                                        </h3>

                                        {career.duration && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {career.duration}
                                            </p>
                                        )}

                                    </div>

                                    <ArrowRight
                                        size={18}
                                        className="text-gray-400 shrink-0"
                                    />

                                </div>

                            </Link>
                        );
                    })}

                </div>

            )}

        </div>
    );
}

export default RecentCareers;
  
