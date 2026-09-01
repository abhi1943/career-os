import {
    BriefcaseBusiness,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function PortfolioStatus({ portfolio }) {
    const navigate = useNavigate();

    const hasPortfolio = Boolean(portfolio);

    // ======================================================
    // OPEN PORTFOLIO
    // ======================================================

    const handlePortfolio = () => {
        navigate("/portfolio");
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-center gap-3 mb-6">

                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">

                    <BriefcaseBusiness
                        className="text-blue-600"
                        size={24}
                    />

                </div>

                <div>

                    <h2 className="text-2xl font-bold text-gray-900">
                        Portfolio
                    </h2>

                    <p className="text-sm text-gray-500">
                        Your professional presence
                    </p>

                </div>

            </div>

            {/* ==================================================
                PORTFOLIO EXISTS
            ================================================== */}

            {hasPortfolio ? (

                <>

                    <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">

                        <CheckCircle2
                            className="text-green-600"
                            size={24}
                        />

                        <div>

                            <p className="font-semibold text-green-700">
                                Portfolio Ready
                            </p>

                            <p className="text-sm text-green-600">
                                Your professional portfolio has been created.
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handlePortfolio}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                        View Portfolio

                        <ArrowRight size={18} />
                    </button>

                </>

            ) : (

                /* ==================================================
                   NO PORTFOLIO
                ================================================== */

                <>

                    <div className="text-center py-5">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">

                            <BriefcaseBusiness
                                className="text-gray-400"
                                size={30}
                            />

                        </div>

                        <h3 className="mt-5 text-xl font-bold text-gray-800">
                            Not Created Yet
                        </h3>

                        <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                            Create a professional portfolio to
                            showcase your skills, projects, and experience.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handlePortfolio}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Create Portfolio

                        <ArrowRight size={18} />
                    </button>

                </>

            )}

        </div>
    );
}

export default PortfolioStatus;