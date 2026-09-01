import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getColleges } from "../../utils/collegeEngine";
import { getExams } from "../../utils/examEngine";
import { saveRecentCareer } from "../../utils/recentCareers";

import { GoalContext } from "../../context/GoalContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import { CompareContext } from "../../context/CompareContext";
import { CareerContext } from "../../context/CareerContext";

import useCareerData from "../../hooks/useCareerData";

/* Career Details Components */

import CareerHero from "../../components/careerDetails/CareerHero";
import CareerSkills from "../../components/careerDetails/CareerSkills";
import CareerSalary from "../../components/careerDetails/CareerSalary";
import CareerInterview from "../../components/careerDetails/CareerInterview";
import CareerTabs from "../../components/careerDetails/tabs/CareerTabs";
import CareerResources from "../../components/careerDetails/CareerResources";
import CareerCompanies from "../../components/careerDetails/CareerCompanies";
import CareerFuture from "../../components/careerDetails/CareerFuture";
import CareerProsCons from "../../components/careerDetails/CareerProsCons";
import CareerCertifications from "../../components/careerDetails/CareerCertifications";
import CareerPath from "../../components/careerDetails/CareerPath";

import CareerMatchScore from "../../components/careerDetails/CareerMatchScore";
import CareerSkillGap from "../../components/careerDetails/CareerSkillGap";
import CareerLearningPath from "../../components/careerDetails/CareerLearningPath";

import AIRecommendations from "../../components/careerDetails/AIRecommendations";
import CareerHiringCompanies from "../../components/careerDetails/CareerHiringCompanies";
// import CareerJobs from "../../components/careerDetails/CareerJobs";

import CareerAnalytics from "../../components/dashboard/CareerAnalytics";

import CareerRoadmapAI from "../../components/roadmap/CareerRoadmapAI";
import CareerLearningHub from "../../components/careers/CareerLearningHub";

import CollegeCard from "../../components/cards/CollegeCard";
import ExamCard from "../../components/cards/ExamCard";


function CareerDetails() {
  const { careerId } = useParams();


  /* --------------------------------------------------
     CAREER DATA
  -------------------------------------------------- */

  const career = useCareerData(careerId);

  /* --------------------------------------------------
     CONTEXTS
  -------------------------------------------------- */

  const { student } = useContext(CareerContext);

  const { toggleFavorite, isFavorite } =
    useContext(FavoritesContext);

  const {
    addToCompare,
    compareList,
  } = useContext(CompareContext);

  const { setGoal } = useContext(GoalContext);
  const [learningProgress, setLearningProgress] =
    useState(0);

  /* --------------------------------------------------
     SAVE RECENT CAREER
  -------------------------------------------------- */

  useEffect(() => {
    if (career) {
      saveRecentCareer(career);
    }
  }, [career]);


  /* --------------------------------------------------
     CAREER NOT FOUND
  -------------------------------------------------- */

  if (!career) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">

          <div className="text-6xl mb-6">
            🔍
          </div>

          <h1 className="text-4xl font-bold text-slate-800">
            Career Not Found
          </h1>

          <p className="text-gray-500 mt-3">
            We couldn't find the career you are looking for.
          </p>

        </div>
      </div>
    );
  }

  /* --------------------------------------------------
     FAVORITE / COMPARE
  -------------------------------------------------- */

  const favorite = isFavorite(career.id);

  const compared = compareList.some(
    (item) => item.id === career.id
  );

  /* --------------------------------------------------
     COLLEGES / EXAMS
  -------------------------------------------------- */

  const colleges = getColleges(
    career.education,
    career.specialization
  );
  const exams = getExams(career.id);

  /* --------------------------------------------------
     SAFE RESOURCE DATA
  -------------------------------------------------- */

  const resources = career.resources || {};

  // const courses = resources.courses || [];

  // const projects = resources.projects || [];

  // const books = resources.books || [];

  // const youtube = resources.youtube || [];

  /* --------------------------------------------------
     SAFE CAREER DATA
  -------------------------------------------------- */

  const streams = career.streams || [];

  const entranceExams = career.entranceExams || [];

  const higherStudies = career.higherStudies || [];

  const careerOpportunities =
    career.careerOpportunities || [];

  const topColleges =
    career.topColleges || [];

  const skillLibrary =
    career.skillLibrary || career.skills || [];

  const topCompanies =
    career.topCompanies ||
    career.companies ||
    [];

  /* --------------------------------------------------
     PAGE
  -------------------------------------------------- */

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

      {/* ==================================================
          HERO
      ================================================== */}

      <CareerHero
        career={career}
        favorite={favorite}
        compared={compared}
        toggleFavorite={toggleFavorite}
        addToCompare={addToCompare}
        setGoal={setGoal}
      />


      {/* ==================================================
          AI CAREER INTELLIGENCE
      ================================================== */}

      <section className="mt-10 space-y-8">

        {/* -----------------------------------------------
            AI CAREER MATCH
        ----------------------------------------------- */}

        <CareerMatchScore
          student={student}
          career={career}
        />


        {/* -----------------------------------------------
            AI SKILL GAP ANALYSIS
        ----------------------------------------------- */}

        <CareerSkillGap
          student={student}
          career={career}
        />


        {/* -----------------------------------------------
            PERSONALIZED AI LEARNING PATH
        ----------------------------------------------- */}

        <CareerLearningPath
          student={student}
          career={career}
          onProgressChange={setLearningProgress}
        />


        {/* -----------------------------------------------
            CAREER ANALYTICS
        ----------------------------------------------- */}

        <CareerAnalytics
          student={student}
          career={career}
          learningProgress={learningProgress}

        />


        {/* -----------------------------------------------
            AI RECOMMENDED CAREERS
        ----------------------------------------------- */}

        <AIRecommendations
          student={student}
        />

      </section>


      {/* ==================================================
          CAREER TABS
      ================================================== */}

      <div className="mt-12">

        <CareerTabs>

          {(active) => (

            <>

              {/* ==================================================
                  OVERVIEW
              ================================================== */}

              {active === "Overview" && (
                <div className="space-y-12">
                  {/* -----------------------------------------------
                      STREAMS
                  ----------------------------------------------- */}

                  {streams.length > 0 && (
                    <section>

                      <h2 className="text-3xl font-bold text-slate-800 mb-6">
                        Streams
                      </h2>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        {streams.map((stream, index) => (
                          <div
                            key={`${stream}-${index}`}
                            className="
                              bg-white
                              shadow-sm
                              hover:shadow-md
                              border
                              rounded-2xl
                              p-5
                              transition
                            "
                          >
                            <div className="text-2xl mb-3">
                              🎯
                            </div>

                            <p className="font-semibold text-slate-700">
                              {stream}
                            </p>

                          </div>
                        ))}

                      </div>

                    </section>
                  )}


                  {/* -----------------------------------------------
                      ENTRANCE EXAMS
                  ----------------------------------------------- */}

                  {entranceExams.length > 0 && (
                    <section>

                      <h2 className="text-3xl font-bold text-slate-800 mb-6">
                        Entrance Exams
                      </h2>

                      <div className="flex flex-wrap gap-3">

                        {entranceExams.map((exam, index) => (
                          <span
                            key={`${exam}-${index}`}
                            className="
                              bg-green-100
                              text-green-700
                              px-5
                              py-2
                              rounded-full
                              font-medium
                            "
                          >
                            {exam}
                          </span>
                        ))}

                      </div>

                    </section>
                  )}


                  {/* -----------------------------------------------
                      HIGHER STUDIES
                  ----------------------------------------------- */}

                  {higherStudies.length > 0 && (
                    <section>

                      <h2 className="text-3xl font-bold text-slate-800 mb-6">
                        Higher Studies
                      </h2>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        {higherStudies.map((study, index) => (
                          <div
                            key={`${study}-${index}`}
                            className="
                              bg-white
                              shadow-sm
                              border
                              rounded-2xl
                              p-5
                              hover:shadow-md
                              transition
                            "
                          >

                            <div className="text-2xl mb-3">
                              🎓
                            </div>

                            <p className="font-semibold text-slate-700">
                              {study}
                            </p>

                          </div>
                        ))}

                      </div>

                    </section>
                  )}


                  


                  {/* -----------------------------------------------
                      CAREER OPPORTUNITIES
                  ----------------------------------------------- */}

                  {careerOpportunities.length > 0 && (
                    <section>

                      <h2 className="text-3xl font-bold text-slate-800 mb-6">
                        Career Opportunities
                      </h2>

                      <div className="grid sm:grid-cols-2 gap-5">

                        {careerOpportunities.map(
                          (job, index) => (
                            <div
                              key={`${job}-${index}`}
                              className="
                                bg-white
                                shadow-sm
                                border
                                rounded-2xl
                                p-5
                                hover:shadow-md
                                transition
                              "
                            >

                              <div className="flex items-center gap-3">

                                <span className="text-2xl">
                                  🚀
                                </span>

                                <span className="font-semibold text-slate-700">
                                  {job}
                                </span>

                              </div>

                            </div>
                          )
                        )}

                      </div>

                    </section>
                  )}


                  {/* ==================================================
                      FUTURE SCOPE
                  ================================================== */}

                  <CareerFuture
                    career={career}
                  />


                  {/* ==================================================
                      PROS & CONS
                  ================================================== */}

                  <CareerProsCons
                    career={career}
                  />


                  {/* ==================================================
                      RECOMMENDED CERTIFICATIONS
                  ================================================== */}

                  <CareerCertifications
                    career={career}
                  />


                  {/* ==================================================
                      CAREER PATH
                  ================================================== */}

                  <CareerPath
                    career={career}
                  />


                  {/* ==================================================
                      COMPANIES
                  ================================================== */}

                  <CareerCompanies
                    topCompanies={topCompanies}
                  />


                  {/* ==================================================
                      COMPANIES HIRING
                  ================================================== */}

                  <CareerHiringCompanies
                    careerId={career.id}
                  />

                </div>
              )}


              {/* ==================================================
                  ROADMAP
              ================================================== */}

              {active === "Roadmap" && (
                <div className="space-y-10">

                  <CareerRoadmapAI
                    careerId={career.id}
                    career={career}
                  />

                  <CareerLearningHub
                    careerId={career.id}
                  />

                </div>
              )}


              {/* ==================================================
                  SKILLS
              ================================================== */}

              {active === "Skills" && (
                <CareerSkills
                  career={career}
                  skillLibrary={skillLibrary}
                />
              )}


              {/* ==================================================
                  RESOURCES
              ================================================== */}

              {active === "Resources" && (
                <CareerResources
                  resources={resources}
                />
              )}

              {/* ==================================================
                  SALARY
              ================================================== */}

              {active === "Salary" && (
                <CareerSalary
                  salary={career.salaryData}
                />
              )}


              {/* ==================================================
                  INTERVIEW
              ================================================== */}

              {active === "Interview" && (
                <CareerInterview
                  interview={career.interview}
                />
              )}

            </>

          )}

        </CareerTabs>

      </div>


      {/* ==================================================
          TOP COLLEGES
      ================================================== */}

      {topColleges.length > 0 && (
        <section className="mt-16">

          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            Top Colleges
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {topColleges.map((college, index) => (
              <div
                key={`${college}-${index}`}
                className="
                  bg-white
                  shadow-sm
                  border
                  rounded-2xl
                  p-5
                  hover:shadow-md
                  transition
                "
              >

                <div className="text-2xl mb-3">
                  🏫
                </div>

                <p className="font-semibold text-slate-700">
                  {college}
                </p>

              </div>
            ))}

          </div>

        </section>
      )}


      {/* ==================================================
          RECOMMENDED COLLEGES
      ================================================== */}

      {colleges?.length > 0 && (
        <section className="mt-20">

          <h2 className="text-3xl font-bold text-slate-800 mb-8">
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

        </section>
      )}


      {/* ==================================================
          RECOMMENDED EXAMS
      ================================================== */}

      {exams?.length > 0 && (
        <section className="mt-20">

          <h2 className="text-3xl font-bold text-slate-800 mb-8">
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

        </section>
      )}

    </div>
  );
}

export default CareerDetails;