import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Careers from "../pages/Careers/Careers";
import CareerDetails from "../pages/Careers/CareerDetails";
import Colleges from "../pages/Colleges/Colleges";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Companies from "../pages/Companies/Companies";
import CareerAssessment from "../pages/CareerAssessment/CareerAssessment";
import Exams from "../pages/Exams/Exams";
import Chatbot from "../pages/Chatbot/Chatbot";
import NotFound from "../pages/NotFound/NotFound";
import Search from "../pages/Search/Search";
import CompanyDetails from "../pages/Companies/CompanyDetails";
import Dashboard from "../pages/Dashboard/Dashboard";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Compare from "../pages/Compare/Compare";
import ProfessionalCareers from "../pages/ProfessionalCareers/ProfessionalCareers";
import Signup from "../pages/Auth/Signup";
import Login from "../pages/Auth/Login";
import ResumeBuilder from "../pages/Resume/ResumeBuilder";
import CollegePredictor from "../pages/CollegePredictor/CollegePredictor";
import AIRecommendation from "../pages/AIRecommendation/AIRecommendation";
import CareerRoadmap from "../pages/CareerRoadmap/CareerRoadmap";
import Explore from "../pages/Explore/Explore";
import Jobs from "../pages/Jobs/Jobs";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/career/:careerId" element={<CareerDetails />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:companyId" element={<CompanyDetails />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/professional-careers" element={<ProfessionalCareers />} />
        {/* <Route path="/assessment" element={<CareerAssessment />} /> */}
        <Route path="/career-assessment" element={<ProtectedRoute> <CareerAssessment /> </ProtectedRoute>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resume-builder" element={<ProtectedRoute> <ResumeBuilder /> </ProtectedRoute>} />
        <Route path="/college-predictor"  element={ <ProtectedRoute> <CollegePredictor/> </ProtectedRoute>}/>
        <Route path="/ai-recommendation" element={<ProtectedRoute> <AIRecommendation /> </ProtectedRoute>}/>
        <Route path="/career-roadmap" element={ <ProtectedRoute> <CareerRoadmap /> </ProtectedRoute>}/>
        <Route path="/jobs" element={<Jobs />}/>

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default AppRoutes;