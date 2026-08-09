import HeroSection from "../../components/sections/HeroSection";
import StudentForm from "../../components/forms/StudentForm";
import CareerExplorer from "../../components/careers/CareerExplorer";
import StatsSection from "../../components/sections/StatsSection";
import CompaniesSection from "../../components/sections/CompaniesSection";
import CategoriesSection from "../../components/sections/CategoriesSection";
import ExamsSection from "../../components/sections/ExamsSection";

function Home() {
return ( <main>

  {/* Main introduction */}
  <HeroSection />

  {/* CareerOS platform statistics */}
  <StatsSection />

  {/* Personalized career profile */}
  <StudentForm />

  {/* Recommended career paths */}
  <CareerExplorer />

  {/* Career categories */}
  <CategoriesSection />

  {/* Companies & opportunities */}
  <CompaniesSection />

  {/* Education & entrance exams */}
  <ExamsSection />

</main>

);
}

export default Home;
