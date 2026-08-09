import { ArrowRight, Sparkles } from "lucide-react";

function WelcomeBanner({ student }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">

      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

      <div className="relative flex flex-col lg:flex-row justify-between items-center gap-8">

        <div>

          <div className="flex items-center gap-2 mb-3">

            <Sparkles className="text-yellow-300" size={20} />

            <span className="text-yellow-200">
              Welcome Back
            </span>

          </div>

          <h1 className="text-4xl font-bold">

            👋 Hello {student?.name || "Student"}

          </h1>

          <p className="mt-3 text-blue-100 max-w-xl">

            Continue exploring careers and complete your roadmap to reach your dream job.

          </p>

        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-6 w-full lg:w-72">

          <h3 className="font-semibold">

            Overall Progress

          </h3>

          <div className="mt-4 h-3 rounded-full bg-white/20">

            <div className="h-3 rounded-full bg-yellow-300 w-4/5"></div>

          </div>

          <p className="mt-3">

            80% Completed

          </p>

          <button className="mt-5 flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold hover:bg-blue-100 transition">

            Continue Learning

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </section>
  );
}

export default WelcomeBanner;