import { useContext, useEffect, useState } from "react";
import { CareerContext } from "../../context/CareerContext";
import { useAuth } from "../../context/AuthContext";
import CareerJobs from "@/components/careerDetails/CareerJobs";
import WelcomeBanner from "./components/WelcomeBanner";
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
import { getDashboardData } from "../../services/dashboardService";
import { analyzeResume } from "../../utils/resumeAnalyzer";

function Dashboard() {
  const { student } = useContext(CareerContext);
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!user) return;

    async function loadDashboard() {

      setLoading(true);

      const data = await getDashboardData(user.uid);

      setDashboardData(data);

      setLoading(false);

    }

    loadDashboard();

  }, [user]);

  const resumeAnalysis =
    dashboardData?.resume
      ? analyzeResume(dashboardData.resume)
      : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <h2 className="text-2xl font-bold">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12">

      <div className="max-w-7xl mx-auto px-6">

        <WelcomeBanner student={student} />

        {/* CLOUD DASHBOARD */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-gray-500 text-sm uppercase tracking-wide">
              Resume Score
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {resumeAnalysis?.score || 0}%
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-gray-500">
              Portfolio
            </p>

            <h2 className="text-2xl font-bold text-blue-600 mt-2">

              {dashboardData?.portfolio
                ? "Completed"
                : "Not Generated"}

            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-gray-500">
              Cloud Sync
            </p>

            <h2 className="text-2xl font-bold text-green-600 mt-2">
              Active ✅
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-gray-500">
              Welcome
            </p>

            <h2 className="text-2xl font-bold mt-2">

              {dashboardData?.resume?.name ||
                student?.name ||
                user?.displayName ||
                "User"}

            </h2>

          </div>

        </div>

        {/* Existing Quick Stats */}

        <div className="mt-8">

          <QuickStats />

        </div>

        {/* First Row */}

        <div className="grid lg:grid-cols-3 gap-8 mt-10">

          <ProfileCard student={student} />

          <ProgressCard />

          <RecommendedCareers />

        </div>

        {/* Goals */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          <CareerGoal />

          <SavedCareers />

        </div>

        {/* Saved Jobs */}

        <div className="mt-10">

          <SavedJobs />

        </div>

        {/* Second Row */}

        <div className="grid lg:grid-cols-3 gap-8 mt-10">

          <SavedColleges />

          <UpcomingExams />

          <RecentSearches />

        </div>

        {/* Third Row */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          <RecentCareers />

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <h2 className="text-xl font-bold mb-4">
              Portfolio Status
            </h2>

            <p className="text-lg font-semibold">

              {dashboardData?.portfolio
                ? "✅ Portfolio Generated"
                : "⚠️ Generate your portfolio from Resume Builder"}

            </p>

          </div>

        </div>

        {/* Live Job Openings */}

        <CareerJobs
          careerId={student?.dreamCareer}
          careerName={student?.dreamCareer}
          student={student}
        />

      </div>

    </div>
  );
}

export default Dashboard;