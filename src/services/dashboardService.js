import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

import {
    getSearchHistoryCount,
} from "./searchHistoryApi";

import {
    getSavedJobCount,
} from "./savedJobsService";

import {
    getUpcomingExamCount,
} from "../data/exams";
// ======================================================
// DASHBOARD CACHE
// ======================================================

const dashboardCache = new Map();

const DASHBOARD_CACHE_TTL =
    5 * 60 * 1000; // 5 minutes
// ======================================================
// DASHBOARD DATA SERVICE
// ======================================================
//
// Centralized Dashboard summary loader.
//
// Firebase:
// - Resume
// - Portfolio
//
// Backend:
// - Search history count
// - Saved jobs count
//
// Local:
// - Upcoming exam count
//
// IMPORTANT:
// Saved jobs are fetched ONLY here.
// Dashboard.jsx should NOT call getSavedJobCount()
// separately.
//

export async function getDashboardData(uid) {
    if (!uid) {
        throw new Error(
            "Dashboard user ID is required."
        );
    }

    // ==================================================
// CHECK DASHBOARD CACHE
// ==================================================

const cached = dashboardCache.get(uid);

if (
    cached &&
    Date.now() - cached.timestamp <
        DASHBOARD_CACHE_TTL
) {
    return cached.data;
}

    // ==================================================
    // FIREBASE REFERENCES
    // ==================================================

    const resumeRef = doc(
        db,
        "resumes",
        uid
    );

    const portfolioRef = doc(
        db,
        "portfolios",
        uid
    );

    // ==================================================
    // UPCOMING EXAMS
    // ==================================================

    const upcomingExamCount = getUpcomingExamCount();

    // ==================================================
    // LOAD ALL IN PARALLEL
    // ==================================================

    const [
        resumeSnap,
        portfolioSnap,
        searchHistoryCount,
        savedJobCount,
    ] = await Promise.all([
        getDoc(resumeRef),

        getDoc(portfolioRef),

        getSearchHistoryCount().catch(
            (error) => {
                console.error(
                    "CareerOS Dashboard search history count error:",
                    error
                );

                return 0;
            }
        ),

        getSavedJobCount().catch(
            (error) => {
                console.error(
                    "CareerOS Dashboard saved job count error:",
                    error
                );

                return 0;
            }
        ),
    ]);



        // ==================================================
    // NORMALIZED DASHBOARD DATA
    // ==================================================

    const dashboardData = {
        resume: resumeSnap.exists()
            ? resumeSnap.data()
            : null,

        portfolio: portfolioSnap.exists()
            ? portfolioSnap.data()
            : null,

        stats: {
            // Keep this as search history.
            // Do NOT automatically call it careers explored.
            searchHistoryCount:
                Number(searchHistoryCount) || 0,

            savedJobCount:
                Number(savedJobCount) || 0,

            upcomingExamCount:
                upcomingExamCount,

            // Until roadmap persistence is connected,
            // don't invent a value.
            roadmapsCompleted: 0,
        },
    };

    // ==================================================
    // SAVE TO DASHBOARD CACHE
    // ==================================================

    dashboardCache.set(uid, {
        data: dashboardData,
        timestamp: Date.now(),
    });

    return dashboardData;
}


