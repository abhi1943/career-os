import { useEffect, useState } from "react";
import PortfolioPreview from "./PortfolioPreview";

import { generatePortfolio } from "../../utils/portfolioGenerator";
import { useAuth } from "../../context/AuthContext";

import {
    savePortfolio,
    loadPortfolio,
} from "../../services/firestoreService";

function PortfolioBuilder({ resume }) {

    const { user } = useAuth();

    const [portfolio, setPortfolio] = useState(null);

    // Generate portfolio whenever resume changes
    useEffect(() => {

        if (!resume) return;

        const generated = generatePortfolio(resume);

        setPortfolio(generated);

    }, [resume]);

    // Load from Firestore on login
    useEffect(() => {

        if (!user) return;

        async function fetchPortfolio() {

            const data = await loadPortfolio(user.uid);

            if (data) {
                setPortfolio(data);
            }

        }

        fetchPortfolio();

    }, [user]);

    // Auto Save (2-second debounce)
    useEffect(() => {

        if (!user || !portfolio) return;

        const timer = setTimeout(() => {

            savePortfolio(user.uid, portfolio);

        }, 2000);

        return () => clearTimeout(timer);

    }, [portfolio, user]);

    return (

        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-5">
                🌐 Portfolio Website Generator
            </h2>

            <button
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
                onClick={() => {

                    const generated = generatePortfolio(resume);

                    setPortfolio(generated);

                }}
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