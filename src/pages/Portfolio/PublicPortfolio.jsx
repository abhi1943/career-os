import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "react-router-dom";

import PortfolioPreview from "./PortfolioPreview";

import {
    loadPublicPortfolio,
} from "../../services/firestoreService";

function PublicPortfolio() {
    const { portfolioId } =
        useParams();

    const [portfolio, setPortfolio] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchPortfolio =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const data =
                        await loadPublicPortfolio(
                            portfolioId
                        );

                    if (cancelled) {
                        return;
                    }

                    if (
                        !data ||
                        data.published !== true ||
                        !data.portfolio
                    ) {
                        setError(
                            "This portfolio is not available."
                        );

                        return;
                    }

                    setPortfolio(
                        data.portfolio
                    );
                } catch (fetchError) {
                    console.error(
                        "CareerOS public portfolio error:",
                        fetchError
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

        void fetchPortfolio();

        return () => {
            cancelled = true;
        };
    }, [portfolioId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl animate-pulse">
                        🌐
                    </div>

                    <p className="text-gray-600 mt-4">
                        Loading portfolio...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
                    <div className="text-5xl">
                        🔒
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mt-5">
                        Portfolio unavailable
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-6 text-center">
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest">
                        CareerOS
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900 mt-2">
                        Professional Portfolio
                    </h1>
                </div>

                <PortfolioPreview
                    portfolio={portfolio}
                />

                <div className="text-center mt-8">
                    <p className="text-xs text-gray-400">
                        Created with CareerOS
                    </p>
                </div>

            </div>
        </div>
    );
}

export default PublicPortfolio;