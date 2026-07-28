import Navbar from "../../components/layout/Navbar";
import HeroSection from "../../components/sections/HeroSection";
import StudentForm from "../../components/forms/StudentForm";
import CareerExplorer from "../../components/careers/CareerExplorer";
import StatsSection from "../../components/sections/StatsSection";
import CompaniesSection from "../../components/sections/CompaniesSection";
import CategoriesSection from "../../components/sections/CategoriesSection";
import ExamsSection from "../../components/sections/ExamsSection";

function Home() {
  return (
    <>
      <Navbar />

      <HeroSection />

      <StatsSection />

      <StudentForm />

      <CareerExplorer />
      
      <CategoriesSection />

      <CompaniesSection />

      <ExamsSection />
    </>
  );
}

export default Home;