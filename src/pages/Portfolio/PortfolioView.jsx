
import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "react-router-dom";

import {
    loadPublicPortfolio,
} from "../../services/firestoreService";

import PortfolioPreview from "./PortfolioPreview";

function PortfolioView() {
    const { uid } = useParams();

    const [portfolio, setPortfolio] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await loadPublicPortfolio(uid);

                if (cancelled) {
                    return;
                }

                if (
                    !data ||
                    data.published !== true
                ) {
                    setError(
                        "This portfolio is no longer publicly available."
                    );

                    return;
                }

                setPortfolio(
                    data.portfolio
                );
            } catch (loadError) {
                console.error(
                    "CareerOS public portfolio error:",
                    loadError
                );

                if (!cancelled) {
                    setError(
                        "Unable to load this portfolio."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        /*
         * Do not call setState synchronously here when
         * uid is missing. Instead, handle the invalid
         * state during rendering.
         */
        if (uid) {
            void fetchPortfolio();
        }

        return () => {
            cancelled = true;
        };
    }, [uid]);

    // ======================================================
    // INVALID PORTFOLIO LINK
    // ======================================================

    if (!uid) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
                <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">

                    <div className="text-5xl mb-5">
                        🔒
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Portfolio Unavailable
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Invalid portfolio link.
                    </p>

                    <a
                        href="/"
                        className="inline-block mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        Go to CareerOS
                    </a>

                </div>
            </div>
        );
    }

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
                <div className="text-center">

                    <div className="text-5xl mb-4 animate-pulse">
                        🌐
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Loading Portfolio
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Please wait...
                    </p>

                </div>
            </div>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

    if (error || !portfolio) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
                <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">

                    <div className="text-5xl mb-5">
                        🔒
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Portfolio Unavailable
                    </h1>

                    <p className="text-gray-500 mt-3">
                        {error ||
                            "This portfolio is not currently available."}
                    </p>

                    <a
                        href="/"
                        className="inline-block mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        Go to CareerOS
                    </a>

                </div>
            </div>
        );
    }

    // ======================================================
    // PUBLIC PORTFOLIO
    // ======================================================

    return (
        <div className="min-h-screen bg-slate-100 py-8 sm:py-10">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-6 text-center">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-semibold text-gray-600">
                        🌐 CareerOS Public Portfolio
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
                        {portfolio?.hero?.name ||
                            "Professional Portfolio"}
                    </h1>

                    {portfolio?.hero?.role && (
                        <p className="text-blue-600 font-semibold mt-2">
                            {portfolio.hero.role}
                        </p>
                    )}

                </div>

                <PortfolioPreview
                    portfolio={portfolio}
                />

                <div className="text-center mt-8">

                    <p className="text-xs text-gray-400">
                        Published with CareerOS
                    </p>

                </div>

            </div>

        </div>
    );
}

export default PortfolioView;

