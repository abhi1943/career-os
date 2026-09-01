import {
    useContext,
    useEffect,
    useState,
} from "react";

import { CareerContext } from "../../context/CareerContext";
import { useAuth } from "../../context/AuthContext";


import WelcomeBanner from "./components/WelcomeBanner";
import DashboardSkeleton from "./components/DashboardSkeleton";
import QuickStats from "./components/QuickStats";
import ProfileCard from "./components/ProfileCard";
import ProgressCard from "./components/ProgressCard";
import RecommendedCareers from "./components/RecommendedCareers";
import SavedColleges from "./components/SavedColleges";
import UpcomingExams from "./components/UpcomingExams";
import RecentSearches from "./components/RecentSearches";
import SavedCareers from "./components/SavedCareers";
import RecentCareers from "./components/RecentCareers";
import CareerGoal from "./components/CareerGoal";
import SavedJobs from "./components/SavedJobs";
import PortfolioStatus from "./components/PortfolioStatus";

import {
    getDashboardData,
} from "../../services/dashboardService";

import {
    analyzeResume,
} from "../../utils/resumeAnalyzer";

function Dashboard() {
    const { student } =
        useContext(CareerContext);

    const { user } = useAuth();

    const [
        dashboardData,
        setDashboardData,
    ] = useState(null);

    const [
    loading,
    setLoading,
] = useState(!user?.uid);

    // ======================================================
    // LOAD DASHBOARD DATA
    // ======================================================

    useEffect(() => {
    if (!user?.uid) {
        return;
    }

    let mounted = true;

    async function loadDashboard() {
        try {
            setLoading(true);

            const data =
                await getDashboardData(
                    user.uid
                );

            if (!mounted) {
                return;
            }

            setDashboardData(data);

        } catch (error) {
            console.error(
                "Failed to load dashboard:",
                error
            );

            if (!mounted) {
                return;
            }

            setDashboardData({
                resume: null,
                portfolio: null,

                stats: {
                    searchHistoryCount: 0,
                    savedJobCount: 0,
                    upcomingExamCount: 0,
                    roadmapsCompleted: 0,
                },
            });

        } finally {
            if (mounted) {
                setLoading(false);
            }
        }
    }

    loadDashboard();

    return () => {
        mounted = false;
    };
}, [user?.uid]);

    // ======================================================
    // RESUME ANALYSIS
    // ======================================================

    const resumeAnalysis =
        dashboardData?.resume
            ? analyzeResume(
                dashboardData.resume
            )
            : null;

    const resumeScore =
        resumeAnalysis?.score ?? 0;

    // ======================================================
    // DASHBOARD STATS
    // ======================================================

    const dashboardStats =
        dashboardData?.stats || {};

    const savedJobsCount =
        Number(
            dashboardStats.savedJobCount
        ) || 0;

    const upcomingExamCount =
        Number(
            dashboardStats.upcomingExamCount
        ) || 0;

    const careersExplored =
        Number(
            dashboardStats.careersExplored
        ) || 0;

    const roadmapsCompleted =
        Number(
            dashboardStats.roadmapsCompleted
        ) || 0;

    // ======================================================
    // STUDENT NAME
    // ======================================================

    const studentName =
        dashboardData?.resume?.name ||
        student?.name ||
        user?.displayName ||
        "Student";

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return <DashboardSkeleton />;
    }

    // ======================================================
    // DASHBOARD
    // ======================================================

    return (
        <div className="min-h-screen bg-slate-100 py-6 sm:py-8 lg:py-10 xl:py-12">

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ==================================================
                    WELCOME
                ================================================== */}

                <WelcomeBanner
                    student={student}
                />


                {/* ==================================================
                    ACCOUNT OVERVIEW
                ================================================== */}

                <section className="mt-8">

                    <div className="mb-5">

                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                            Your Overview
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-1">
                            CareerOS at a glance
                        </h2>

                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">

                        {/* Resume */}

                        <div className="h-[180px] bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition flex flex-col min-w-0">

                            <p className="text-sm text-gray-500">
                                Resume Score
                            </p>

                            <div className="flex items-end justify-between gap-4 mt-3">

                                <h3 className="text-4xl font-bold text-green-600">
                                    {resumeScore}%
                                </h3>

                                <span className="text-2xl shrink-0">
                                    📄
                                </span>

                            </div>

                            <div className="mt-auto pt-4">

                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min(
                                                Math.max(
                                                    resumeScore,
                                                    0
                                                ),
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Cloud Sync */}

                        <div className="h-[180px] bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition flex flex-col min-w-0">

                            <p className="text-sm text-gray-500">
                                Cloud Sync
                            </p>

                            <div className="flex items-center justify-between gap-4 mt-3">

                                <h3 className="text-xl font-bold text-green-600">
                                    Active
                                </h3>

                                <span className="text-2xl shrink-0">
                                    ☁️
                                </span>

                            </div>

                            <p className="text-sm text-gray-400 mt-auto pt-3">
                                Your CareerOS data is synced.
                            </p>

                        </div>


                        {/* Account */}

                        <div className="h-[180px] bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition flex flex-col min-w-0 sm:col-span-2 xl:col-span-1">

                            <p className="text-sm text-gray-500">
                                Account
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 mt-3 truncate">
                                {studentName}
                            </h3>

                            <p className="text-sm text-gray-400 mt-auto pt-3">
                                CareerOS Student
                            </p>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    QUICK STATS
                ================================================== */}

                <section className="mt-10">

                    <div className="mb-5">

                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                            Activity
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-1">
                            Your career activity
                        </h2>

                    </div>

                    <QuickStats
                        careersExplored={
                            careersExplored
                        }
                        savedJobs={
                            savedJobsCount
                        }
                        upcomingExams={
                            upcomingExamCount
                        }
                        roadmapsCompleted={
                            roadmapsCompleted
                        }
                    />

                </section>


                {/* ==================================================
                    CAREER JOURNEY
                ================================================== */}

                <section className="mt-10">

                    <div className="mb-5">

                        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
                            Personalization
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-1">
                            Your career journey
                        </h2>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">

                        {/* Profile */}

                        <div className="min-w-0 h-[520px] min-h-0 overflow-hidden rounded-3xl">

                            <ProfileCard
                                student={student}
                            />

                        </div>


                        {/* Learning Progress */}

                        <div className="min-w-0 h-[520px] min-h-0 overflow-y-auto overflow-x-hidden rounded-3xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                            <ProgressCard />

                        </div>


                        {/* Recommended Careers */}

                        <div className="min-w-0 h-[520px] min-h-0 overflow-y-auto overflow-x-hidden rounded-3xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                            <RecommendedCareers />

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    GOAL + SAVED CAREERS
                ================================================== */}

                <section className="mt-10">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                        {/* Career Goal */}

                        <div className="min-w-0 h-[420px] min-h-0 overflow-hidden rounded-3xl">

                            <CareerGoal />

                        </div>


                        {/* Saved Careers */}

                        <div className="min-w-0 h-[420px] min-h-0 overflow-y-auto overflow-x-hidden rounded-3xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                            <SavedCareers />

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    SAVED JOBS
                ================================================== */}

                <section className="mt-10 min-w-0 overflow-hidden">

                    <SavedJobs />

                </section>


                {/* ==================================================
                    CONTINUE EXPLORING
                ================================================== */}

                <section className="mt-10">

                    <div className="mb-5">

                        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                            Explore
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-1">
                            Continue exploring
                        </h2>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">

                        {/* Saved Colleges */}

                        <div className="min-w-0 h-[400px] min-h-0 overflow-y-auto overflow-x-hidden rounded-3xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                            <SavedColleges />

                        </div>


                        {/* Upcoming Exams */}

                        <div className="min-w-0 h-[400px] min-h-0 overflow-y-auto overflow-x-hidden rounded-3xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                            <UpcomingExams />

                        </div>


                        {/* Recent Searches */}

                        <div className="min-w-0 h-[400px] min-h-0 overflow-y-auto overflow-x-hidden rounded-3xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent md:col-span-2 xl:col-span-1">

                            <RecentSearches />

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    RECENT ACTIVITY
                ================================================== */}

                <section className="mt-10">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                        {/* Recently Viewed */}

                        <div className="min-w-0 h-[400px] min-h-0 overflow-y-auto overflow-x-hidden rounded-3xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                            <RecentCareers />

                        </div>


                        {/* Portfolio */}

                        <div className="min-w-0 h-[400px] min-h-0 overflow-hidden rounded-3xl">

                            <PortfolioStatus
                                portfolio={
                                    dashboardData?.portfolio
                                }
                                user={user}
                            />

                        </div>

                    </div>

                </section>

                <div className="h-8" />

            </div>

        </div>
    );
}

export default Dashboard;