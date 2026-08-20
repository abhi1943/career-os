
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import PortfolioPreview from "./PortfolioPreview";

import {
    generatePortfolio,
} from "../../utils/portfolioGenerator";

import {
    useAuth,
} from "../../context/AuthContext";

import {
    savePortfolio,
    loadPortfolio,
} from "../../services/firestoreService";

function PortfolioBuilder({ resume }) {
    const { user } = useAuth();

    const [savedPortfolio, setSavedPortfolio] =
        useState(null);

    // ======================================================
    // GENERATE PORTFOLIO FROM RESUME
    // ======================================================

    const generatedPortfolio = useMemo(() => {
        if (!resume) {
            return null;
        }

        return generatePortfolio(resume);
    }, [resume]);

    // ======================================================
    // EFFECTIVE PORTFOLIO
    // ======================================================

    const portfolio =
        savedPortfolio || generatedPortfolio;

    // ======================================================
    // LOAD FROM FIRESTORE ON LOGIN
    // ======================================================

    useEffect(() => {
        if (!user) {
            return;
        }

        let cancelled = false;

        const fetchPortfolio = async () => {
            try {
                const data =
                    await loadPortfolio(
                        user.uid
                    );

                if (
                    cancelled ||
                    !data
                ) {
                    return;
                }

                setSavedPortfolio(data);
            } catch (error) {
                console.error(
                    "CareerOS load portfolio error:",
                    error
                );
            }
        };

        void fetchPortfolio();

        return () => {
            cancelled = true;
        };
    }, [user]);

    // ======================================================
    // AUTO SAVE
    // ======================================================

    useEffect(() => {
        if (
            !user ||
            !portfolio
        ) {
            return undefined;
        }

        const timer = setTimeout(() => {
            void savePortfolio(
                user.uid,
                portfolio
            );
        }, 2000);

        return () => {
            clearTimeout(timer);
        };
    }, [portfolio, user]);

    // ======================================================
    // MANUAL GENERATE
    // ======================================================

    const handleGeneratePortfolio = () => {
        if (!resume) {
            return;
        }

        const generated =
            generatePortfolio(resume);

        setSavedPortfolio(generated);
    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-5">
                🌐 Portfolio Website Generator
            </h2>

            <button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition"
                onClick={
                    handleGeneratePortfolio
                }
                disabled={!resume}
            >
                Generate Portfolio Website
            </button>

            <div className="mt-8">

                <PortfolioPreview
                    portfolio={portfolio}
                />

            </div>

        </div>
    );
}

export default PortfolioBuilder;
