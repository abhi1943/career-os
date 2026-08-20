import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

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

import Colleges from "../pages/Colleges/Colleges";
import Exams from "../pages/Exams/Exams";
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
import SavedJobs from "../pages/jobs/SavedJobs";
import JobAlertsPage from "../pages/Jobs/JobAlertsPage";

// ======================================================
// OTHER PAGES
// ======================================================

import Search from "../pages/Search/Search";
import Compare from "../pages/Compare/Compare";
import Chatbot from "../pages/Chatbot/Chatbot";
import ResumeBuilder from "../pages/Resume/ResumeBuilder";
import Explore from "../pages/Explore/Explore";
import JobTracker from "../pages/JobTracker/JobTracker";

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
                ==================================================

                    This is the ONLY main application page that
                    visitors can access without logging in.

                    It introduces CareerOS and encourages users
                    to create an account / login.
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
                            <Companies />
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
                    path="/resume-builder"
                    element={
                        <ProtectedRoute>
                            <ResumeBuilder />
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