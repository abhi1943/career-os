import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Users,
  Briefcase,
  GraduationCap,
  Compass,
  Building2,
  BookOpen,
} from "lucide-react";

function HeroSection() {
  return (<section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-cyan-600 to-indigo-700 text-white">
    {/* Background decoration */}

    <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

    <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl" />

    <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">

      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}

        <div>

          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-semibold border border-white/10">

            🚀 AI Powered Career Guidance Platform

          </span>

          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mt-8">

            Find Your

            <span className="block text-yellow-300">
              Perfect Career Path
            </span>

          </h1>

          <p className="mt-7 text-lg lg:text-xl text-blue-100 leading-8 max-w-xl">

            Explore careers, education paths, entrance exams,
            colleges, companies and personalized roadmaps —
            all in one intelligent platform.

          </p>

          {/* Main Buttons */}

          <div className="flex flex-wrap gap-4 mt-9">

            <Link
              to="/careers"
              className="bg-white text-blue-700 px-7 py-3.5 rounded-2xl font-semibold flex items-center gap-2 hover:scale-105 transition shadow-xl"
            >

              Explore Careers

              <ArrowRight size={20} />

            </Link>

            <Link
              to="/chatbot"
              className="border border-white/70 px-7 py-3.5 rounded-2xl font-semibold flex items-center gap-2 hover:bg-white hover:text-blue-700 transition"
            >

              <Bot size={20} />

              AI Mentor

            </Link>

          </div>

          {/* Career / Education / Opportunities */}

          <div className="grid sm:grid-cols-3 gap-3 mt-10 max-w-xl">

            <Link
              to="/careers"
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/20 transition group"
            >

              <Compass
                size={23}
                className="text-yellow-300 mb-2"
              />

              <p className="font-bold">
                Career
              </p>

              <p className="text-xs text-blue-100 mt-1">
                Discover paths
              </p>

            </Link>

            <Link
              to="/colleges"
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/20 transition group"
            >

              <GraduationCap
                size={23}
                className="text-pink-300 mb-2"
              />

              <p className="font-bold">
                Education
              </p>

              <p className="text-xs text-blue-100 mt-1">
                Find your path
              </p>

            </Link>

            <Link
              to="/companies"
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/20 transition group"
            >

              <Briefcase
                size={23}
                className="text-green-300 mb-2"
              />

              <p className="font-bold">
                Opportunities
              </p>

              <p className="text-xs text-blue-100 mt-1">
                Explore companies
              </p>

            </Link>

          </div>

        </div>

        {/* RIGHT CONTENT */}

        <div className="relative">

          {/* Main dashboard card */}

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <div>

                <p className="text-blue-100 text-sm">
                  CareerOS
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Your Career Journey
                </h2>

              </div>

              <div className="bg-white/15 p-3 rounded-2xl">
                <Bot size={25} />
              </div>

            </div>

            {/* Journey cards */}

            <div className="space-y-4">

              <Link
                to="/careers"
                className="flex items-center gap-4 bg-white text-slate-800 rounded-2xl p-5 hover:scale-[1.02] transition"
              >

                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                  <Compass size={24} />
                </div>

                <div className="flex-1">

                  <p className="text-xs text-slate-500">
                    STEP 01
                  </p>

                  <h3 className="font-bold">
                    Discover Careers
                  </h3>

                  <p className="text-sm text-slate-500">
                    Find careers matching your interests
                  </p>

                </div>

                <ArrowRight
                  size={19}
                  className="text-blue-600"
                />

              </Link>

              <Link
                to="/colleges"
                className="flex items-center gap-4 bg-white text-slate-800 rounded-2xl p-5 hover:scale-[1.02] transition"
              >

                <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                  <BookOpen size={24} />
                </div>

                <div className="flex-1">

                  <p className="text-xs text-slate-500">
                    STEP 02
                  </p>

                  <h3 className="font-bold">
                    Plan Education
                  </h3>

                  <p className="text-sm text-slate-500">
                    Explore colleges and entrance exams
                  </p>

                </div>

                <ArrowRight
                  size={19}
                  className="text-purple-600"
                />

              </Link>

              <Link
                to="/companies"
                className="flex items-center gap-4 bg-white text-slate-800 rounded-2xl p-5 hover:scale-[1.02] transition"
              >

                <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                  <Building2 size={24} />
                </div>

                <div className="flex-1">

                  <p className="text-xs text-slate-500">
                    STEP 03
                  </p>

                  <h3 className="font-bold">
                    Find Opportunities
                  </h3>

                  <p className="text-sm text-slate-500">
                    Discover companies and career opportunities
                  </p>

                </div>

                <ArrowRight
                  size={19}
                  className="text-green-600"
                />

              </Link>

            </div>

          </div>

          {/* Floating stats */}

          <div className="grid grid-cols-2 gap-4 mt-5">

            <div className="bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-5">

              <GraduationCap
                className="text-yellow-300 mb-3"
                size={30}
              />

              <h2 className="text-3xl font-bold">
                100+
              </h2>

              <p className="text-sm text-blue-100">
                Career Paths
              </p>

            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-5">

              <Briefcase
                className="text-green-300 mb-3"
                size={30}
              />

              <h2 className="text-3xl font-bold">
                500+
              </h2>

              <p className="text-sm text-blue-100">
                Companies
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">

            <div className="bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-5">

              <Users
                className="text-pink-300 mb-3"
                size={30}
              />

              <h2 className="text-3xl font-bold">
                1000+
              </h2>

              <p className="text-sm text-blue-100">
                Students
              </p>

            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-5">

              <Bot
                className="text-cyan-300 mb-3"
                size={30}
              />

              <h2 className="text-3xl font-bold">
                AI
              </h2>

              <p className="text-sm text-blue-100">
                Career Mentor
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  </section>

  );
}

export default HeroSection;
