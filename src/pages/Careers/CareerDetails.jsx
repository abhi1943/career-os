import { useParams } from "react-router-dom";
import { getColleges } from "../../utils/collegeEngine";
import CollegeCard from "../../components/cards/CollegeCard";
import { getExams } from "../../utils/examEngine";
import ExamCard from "../../components/cards/ExamCard";
import { GoalContext } from "../../context/GoalContext";
import { useContext } from "react";
import { FavoritesContext } from "../../context/FavoritesContext";
import { CompareContext } from "../../context/CompareContext";
import { useEffect } from "react";
import { saveRecentCareer } from "../../utils/recentCareers";
import useCareerData from "../../hooks/useCareerData";
import CareerHero from "../../components/careerDetails/CareerHero";
import CareerSkills from "../../components/careerDetails/CareerSkills";
import CareerSalary from "../../components/careerDetails/CareerSalary";
import CareerCourses from "../../components/careerDetails/CareerCourses";
import CareerProjects from "../../components/careerDetails/CareerProjects";
import CareerInterview from "../../components/careerDetails/CareerInterview";
import CareerRoadmap from "../../components/careerDetails/CareerRoadmap";
import CareerBooks from "../../components/careerDetails/CareerBooks";
import CareerYoutube from "../../components/careerDetails/CareerYoutube";
import CareerTabs from "../../components/careerDetails/tabs/CareerTabs";
import CareerCompanies from "../../components/careerDetails/CareerCompanies";
import CareerFuture from "../../components/careerDetails/CareerFuture";
import CareerProsCons from "../../components/careerDetails/CareerProsCons";
import CareerCertifications from "../../components/careerDetails/CareerCertifications";
import CareerPath from "../../components/careerDetails/CareerPath";
import CareerMatchScore from "../../components/careerDetails/CareerMatchScore";
import { CareerContext } from "../../context/CareerContext";
import AIRecommendations from "../../components/careerDetails/AIRecommendations";
import CareerAnalytics from "../../components/dashboard/CareerAnalytics";
import CareerSkillGap from "../../components/careerDetails/CareerSkillGap";
import CareerLearningPath from "../../components/careerDetails/CareerLearningPath";
import CareerRoadmapAI from "../../components/roadmap/CareerRoadmapAI";
import CareerLearningHub from "../../components/careers/CareerLearningHub";
import CareerHiringCompanies from "../../components/careerDetails/CareerHiringCompanies";
import CareerJobs from "../../components/careerDetails/CareerJobs";
function CareerDetails() {
  const { careerId } = useParams();

  const career = useCareerData(careerId);
  console.log("Career ID:", careerId);
  console.log("Career Data:", career);
  useEffect(() => {
    if (career) {
      saveRecentCareer(career);
    }
  }, [career]);
  const { toggleFavorite, isFavorite } =
    useContext(FavoritesContext);

  const { addToCompare, compareList, } =
    useContext(CompareContext);
  const { setGoal } = useContext(GoalContext);
  const { student } = useContext(CareerContext);
  console.log("Student Data:", student);

  if (!career) {
    return (
      <h1 className="text-center text-4xl mt-20 font-bold">
        Career Not Found
      </h1>
    );
  }

  const favorite = isFavorite(career.id);

  const compared = compareList.some(
    (item) => item.id === career.id
  );

  const colleges = getColleges(career.id);
  const exams = getExams(career.id);

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">

      {/* Hero Section */}

      <CareerHero
        career={career}
        favorite={favorite}
        compared={compared}
        toggleFavorite={toggleFavorite}
        addToCompare={addToCompare}
        setGoal={setGoal}
      />

      <CareerMatchScore
        student={student}
        career={career}
      />
      <CareerSkillGap
        student={student}
        career={career}
      />
      <CareerLearningPath
        student={student}
        career={career}
      />
      <CareerAnalytics
        student={student}
        career={career}
      />

      <AIRecommendations
        student={student}
      />

      <CareerTabs>

        {(active) => (

          <>

            {active === "Overview" && (
              <>
                {/* Streams */}
                {career.streams?.length > 0 && (
                  <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-6">Streams</h2>

                    <div className="grid md:grid-cols-3 gap-5">
                      {career.streams.map((stream) => (
                        <div
                          key={stream}
                          className="bg-white shadow rounded-2xl p-5"
                        >
                          {stream}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Entrance Exams */}
                {career.entranceExams?.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-3xl font-bold mb-6">
                      Entrance Exams
                    </h2>

                    <div className="flex flex-wrap gap-4">
                      {career.entranceExams.map((exam) => (
                        <span
                          key={exam}
                          className="bg-green-100 text-green-700 px-5 py-2 rounded-full"
                        >
                          {exam}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Higher Studies */}
                {career.higherStudies?.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-3xl font-bold mb-6">
                      Higher Studies
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">
                      {career.higherStudies.map((study) => (
                        <div
                          key={study}
                          className="bg-white shadow rounded-2xl p-5"
                        >
                          🎓 {study}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <CareerJobs careerId={career.id} />
                {/* Career Opportunities */}
                {career.careerOpportunities?.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-3xl font-bold mb-6">
                      Career Opportunities
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">
                      {career.careerOpportunities.map((job) => (
                        <div
                          key={job}
                          className="bg-white shadow rounded-2xl p-5"
                        >
                          🚀 {job}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <CareerFuture career={career} />

                <CareerProsCons career={career} />

                <CareerCertifications career={career} />

                <CareerPath career={career} />
                <CareerCompanies topCompanies={career.topCompanies} />
                <CareerHiringCompanies careerId={career.id} />
              </>
            )}

            {active === "Roadmap" && (
              <>
                {/* <CareerRoadmap roadmap={career.roadmap} /> */}

                <CareerRoadmapAI careerId={career.id} />

                <CareerLearningHub careerId={career.id} />
              </>
            )}

            {active === "Skills" && (
              <CareerSkills
                career={career}
                skillLibrary={career.skillLibrary}
              />
            )}

            {active === "Resources" && (
              <>
                <CareerCourses
                  courses={career.resources.courses}
                />

                <CareerProjects
                  projects={career.resources.projects}
                />

                <CareerBooks
                  books={career.resources.books}
                />

                <CareerYoutube
                  channels={career.resources.youtube}
                />
              </>
            )}

            {active === "Salary" && (
              <CareerSalary salary={career.salary} />
            )}

            {active === "Interview" && (
              <CareerInterview
                interview={career.interview}
              />
            )}

          </>

        )}

      </CareerTabs>

      {/* Top Colleges */}

      {career.topColleges?.length > 0 && (
        <div className="mt-14">

          <h2 className="text-3xl font-bold mb-6">
            Top Colleges
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {career.topColleges.map((college) => (
              <div
                key={college}
                className="bg-white shadow rounded-2xl p-5"
              >
                🏫 {college}
              </div>
            ))}

          </div>

        </div>
      )}

      {/* Recommended Colleges */}

      {colleges?.length > 0 && (
        <div className="mt-20">

          <h2 className="text-3xl font-bold mb-8">
            Recommended Colleges
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
              />
            ))}

          </div>

        </div>
      )}

      {/* Recommended Exams */}

      {exams?.length > 0 && (
        <div className="mt-20">

          <h2 className="text-3xl font-bold mb-8">
            Entrance Exams
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {exams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
              />
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default CareerDetails;