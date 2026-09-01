import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

// ======================================================
// PUBLIC PAGE
// ======================================================

import Home from "../pages/Home/Home";

// ======================================================
// CAREER
// ======================================================

import Careers from "../pages/Careers/Careers";
import CareerDetails from "../pages/Careers/CareerDetails";
import ProfessionalCareers from "../pages/ProfessionalCareers/ProfessionalCareers";
import CareerAssessment from "../pages/CareerAssessment/CareerAssessment";
import CareerRoadmap from "../pages/CareerRoadmap/CareerRoadmap";
import AIRecommendation from "../pages/AIRecommendation/AIRecommendation";

// ======================================================
// EDUCATION
// ======================================================
import Profile from "../pages/Profile";
import Colleges from "../pages/Colleges/Colleges";
import Exams from "../pages/Exams/Exams";
import ExamDetails from "../pages/Exams/ExamDetails";
import CollegePredictor from "../pages/CollegePredictor/CollegePredictor";

// ======================================================
// COMPANIES
// ======================================================

import Companies from "../pages/Companies/Companies";
import CompanyDetails from "../pages/Companies/CompanyDetails";
import JobDetails from "../pages/Companies/JobDetails";

// ======================================================
// JOBS
// ======================================================

import Jobs from "../pages/Jobs/Jobs";
import SavedJobs from "../pages/Jobs/SavedJobs";
import JobAlertsPage from "../pages/Jobs/JobAlertsPage";
import Applications from "../pages/Applications/Applications";
// ======================================================
// OTHER PAGES
// ======================================================
import Search from "../pages/Search/Search";
import Compare from "../pages/Compare/Compare";
import Chatbot from "../pages/Chatbot/Chatbot";
import Chatboard from "../pages/chatboard/chatboard.jsx";

import ResumeBuilder from "../pages/Resume/ResumeBuilder";
import PortfolioBuilder from "../pages/Portfolio/PortfolioBuilder";
import Explore from "../pages/Explore/Explore";
import JobTracker from "../pages/JobTracker/JobTracker";
import PortfolioView from "../pages/Portfolio/PortfolioView";

// ======================================================
// DASHBOARD
// ======================================================

import Dashboard from "../pages/Dashboard/Dashboard";
import Notifications from "../pages/Notifications/Notifications";

// ======================================================
// AUTH
// ======================================================

import Signup from "../pages/Auth/Signup";
import Login from "../pages/Auth/Login";

// ======================================================
// 404
// ======================================================

import NotFound from "../pages/NotFound/NotFound";

// ======================================================
// COMPONENTS
// ======================================================

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// ======================================================
// DIRECT COMPANIES ACCESS WARM-UP
// ======================================================
//
// Purpose:
//
// If the user directly opens:
//
//     /companies
//
// the job store may still be empty.
//
// This wrapper makes sure the store is warm before
// Companies.jsx starts reading from:
//
//     /api/jobs/companies
//
// It does NOT perform the Adzuna search itself.
// The backend /api/jobs/warm endpoint handles that.
//
// ======================================================

function DirectCompaniesAccess() {
    const [ready, setReady] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        let cancelled = false;

        let pollTimer = null;

        // --------------------------------------------------
        // CLEANUP
        // --------------------------------------------------

        const cleanup = () => {
            if (pollTimer) {
                clearTimeout(pollTimer);
                pollTimer = null;
            }
        };

        // --------------------------------------------------
        // CHECK STORE STATUS
        // --------------------------------------------------

        const checkStatus = async () => {
            if (cancelled) {
                return;
            }

            try {
                const response =
                    await fetch(
                        "https://career-os-api-1h85.onrender.com/api/jobs/status"
                    );

                let data;

                try {
                    data =
                        await response.json();
                } catch {
                    throw new Error(
                        "The server returned an invalid status response."
                    );
                }

                if (
                    !response.ok ||
                    !data.success
                ) {
                    throw new Error(
                        data.message ||
                        "Failed to check job store status."
                    );
                }

                const status =
                    data.status || {};

                const totalJobs =
                    Number(
                        status.totalJobs ||
                        status.total ||
                        status.jobCount ||
                        0
                    );

                const freshJobs =
                    Number(
                        status.freshJobs ||
                        0
                    );

                const isWarming =
                    Boolean(
                        status.isWarming
                    );

                // ------------------------------------------------
                // STORE IS READY
                // ------------------------------------------------

                if (
                    freshJobs > 0 ||
                    (
                        totalJobs > 0 &&
                        !isWarming
                    )
                ) {
                    if (!cancelled) {
                        setReady(true);
                    }

                    cleanup();

                    return;
                }

                // ------------------------------------------------
                // STILL WARMING / EMPTY
                // ------------------------------------------------

                pollTimer =
                    setTimeout(
                        checkStatus,
                        1000
                    );
            } catch (statusError) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "CareerOS Direct Companies Status Error:",
                    statusError
                );

                setError(
                    statusError.message ||
                    "Unable to check the CareerOS job store."
                );
            }
        };

        // --------------------------------------------------
        // START / CHECK WARM
        // --------------------------------------------------

        const warmStore = async () => {
            try {
                const response =
                    await fetch(
                        "https://career-os-api-1h85.onrender.com/api/jobs/warm"
                    );

                let data;

                try {
                    data =
                        await response.json();
                } catch {
                    throw new Error(
                        "The server returned an invalid warm-up response."
                    );
                }

                if (
                    !response.ok &&
                    response.status !== 202
                ) {
                    throw new Error(
                        data.message ||
                        "Failed to start job store warm-up."
                    );
                }

                if (cancelled) {
                    return;
                }

                // ------------------------------------------------
                // ALREADY WARM
                // ------------------------------------------------

                if (
                    data.alreadyWarm ||
                    data.warm
                ) {
                    setReady(true);

                    return;
                }

                // ------------------------------------------------
                // WARMING
                // ------------------------------------------------

                await checkStatus();
            } catch (warmError) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "CareerOS Direct Companies Warm Error:",
                    warmError
                );

                setError(
                    warmError.message ||
                    "Unable to prepare jobs for Companies."
                );
            }
        };

        warmStore();

        // --------------------------------------------------
        // CLEANUP ON UNMOUNT
        // --------------------------------------------------

        return () => {
            cancelled = true;

            cleanup();
        };
    }, []);

    // ==================================================
    // ERROR
    // ==================================================

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-6">

                <div className="max-w-lg w-full bg-red-50 border border-red-200 rounded-2xl p-8 text-center">

                    <div className="text-4xl mb-4">
                        ⚠️
                    </div>

                    <h2 className="text-xl font-bold text-red-700">
                        Unable to prepare Companies
                    </h2>

                    <p className="text-red-600 mt-2">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold transition"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    // ==================================================
    // WARMING
    // ==================================================

    if (!ready) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-6">

                <div className="text-center">

                    <div className="text-5xl mb-4 animate-pulse">
                        🔄
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">
                        Preparing Companies
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Loading the latest job opportunities...
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                        This may take a moment the first time.
                    </p>

                </div>

            </div>
        );
    }

    // ==================================================
    // READY
    // ==================================================

    return <Companies />;
}

// ======================================================
// APP ROUTES
// ======================================================

function AppRoutes() {
    return (
        <BrowserRouter>

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <Navbar />

            <Routes>

                {/* ==================================================
                    PUBLIC LANDING PAGE
                ================================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />

                {/* ==================================================
                    AUTHENTICATION
                ================================================== */}

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    }
                />

                {/* ==================================================
                    CAREER
                ================================================== */}

                <Route
                    path="/careers"
                    element={
                        <ProtectedRoute>
                            <Careers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/career/:careerId"
                    element={
                        <ProtectedRoute>
                            <CareerDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/professional-careers"
                    element={
                        <ProtectedRoute>
                            <ProfessionalCareers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/career-assessment"
                    element={
                        <ProtectedRoute>
                            <CareerAssessment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/career-roadmap"
                    element={
                        <ProtectedRoute>
                            <CareerRoadmap />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ai-recommendation"
                    element={
                        <ProtectedRoute>
                            <AIRecommendation />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    EDUCATION
                ================================================== */}

                <Route
                    path="/colleges"
                    element={
                        <ProtectedRoute>
                            <Colleges />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/exams"
                    element={
                        <ProtectedRoute>
                            <Exams />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/exams/:id"
                    element={
                        <ProtectedRoute>
                            <ExamDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/college-predictor"
                    element={
                        <ProtectedRoute>
                            <CollegePredictor />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    COMPANIES
                ================================================== */}

                <Route
                    path="/companies"
                    element={
                        <ProtectedRoute>
                            <DirectCompaniesAccess />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/companies/:companyId"
                    element={
                        <ProtectedRoute>
                            <CompanyDetails />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    JOB DETAILS
                ================================================== */}

                <Route
                    path="/companies/job/:id"
                    element={
                        <ProtectedRoute>
                            <JobDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs/:id"
                    element={
                        <ProtectedRoute>
                            <JobDetails />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    JOBS
                ================================================== */}

                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute>
                            <Jobs />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    SAVED JOBS
                ================================================== */}

                <Route
                    path="/jobs/saved"
                    element={
                        <ProtectedRoute>
                            <SavedJobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute>
                            <Applications />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    JOB ALERTS
                ================================================== */}

                <Route
                    path="/jobs/alerts"
                    element={
                        <ProtectedRoute>
                            <JobAlertsPage />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    SEARCH
                ================================================== */}

                <Route
                    path="/search"
                    element={
                        <ProtectedRoute>
                            <Search />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    TOOLS
                ================================================== */}

                <Route
                    path="/compare"
                    element={
                        <ProtectedRoute>
                            <Compare />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chatbot"
                    element={
                        <ProtectedRoute>
                            <Chatbot />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chatboard"
                    element={
                        <ProtectedRoute>
                            <Chatboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/resume-builder"
                    element={
                        <ProtectedRoute>
                            <ResumeBuilder />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/portfolio/view/:uid"
                    element={<PortfolioView />}
                />

                <Route
                    path="/portfolio"
                    element={
                        <ProtectedRoute>
                            <PortfolioBuilder />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/explore"
                    element={
                        <ProtectedRoute>
                            <Explore />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/job-tracker"
                    element={
                        <ProtectedRoute>
                            <JobTracker />
                        </ProtectedRoute>
                    }
                />
                {/* // ======================================================
// PROFILE
// ====================================================== */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    DASHBOARD
                ================================================== */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    NOTIFICATIONS
                ================================================== */}

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    404
                ================================================== */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <Footer />

        </BrowserRouter>
    );
}

export default AppRoutes;
