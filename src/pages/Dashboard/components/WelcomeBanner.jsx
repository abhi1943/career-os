import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function WelcomeBanner({
  student,
  progress = 0,
}) {
  // ======================================================
  // SAFE PROGRESS
  // ======================================================

  const safeProgress = Math.min(
    Math.max(Number(progress) || 0, 0),
    100
  );

  // ======================================================
  // PROFILE STATUS
  // ======================================================

  const hasName = Boolean(
    student?.name &&
      String(student.name).trim()
  );

  const displayName = hasName
    ? String(student.name).trim()
    : "Student";

  const hasProfile = Boolean(
    student &&
      (
        student?.name ||
        student?.education ||
        student?.specialization
      )
  );

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">

      {/* ==================================================
          BACKGROUND DECORATION
      ================================================== */}

      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col lg:flex-row justify-between items-center gap-8">

        {/* ==================================================
            WELCOME MESSAGE
        ================================================== */}

        <div className="min-w-0">

          <div className="flex items-center gap-2 mb-3">

            <Sparkles
              className="text-yellow-300"
              size={20}
            />

            <span className="text-yellow-200">
              Welcome Back
            </span>

          </div>

          <h1 className="text-4xl font-bold">
            👋 Hello {displayName}
          </h1>

          {!hasProfile ? (
            <>
              <p className="mt-3 text-blue-100 max-w-xl">
                Welcome to CareerOS. Complete your profile
                to get personalized career recommendations,
                learning progress, and job matches.
              </p>

              <Link
                to="/profile"
                className="mt-5 inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold hover:bg-blue-100 transition"
              >
                Complete Profile

                <ArrowRight size={18} />
              </Link>
            </>
          ) : (
            <p className="mt-3 text-blue-100 max-w-xl">
              Continue exploring careers and complete your
              roadmap to reach your dream job.
            </p>
          )}

        </div>

        {/* ==================================================
            OVERALL PROGRESS
        ================================================== */}

        <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-6 w-full lg:w-72 shrink-0">

          <h3 className="font-semibold">
            Overall Progress
          </h3>

          <div className="mt-4 h-3 rounded-full bg-white/20 overflow-hidden">

            <div
              className="h-3 rounded-full bg-yellow-300 transition-all duration-500"
              style={{
                width: `${safeProgress}%`,
              }}
            />

          </div>

          <p className="mt-3">
            {safeProgress}% Completed
          </p>

          {/* ==================================================
              PROGRESS EMPTY STATE
          ================================================== */}

          {safeProgress === 0 ? (

            <div className="mt-4">

              <p className="text-sm text-blue-100">
                Your learning progress will appear here
                once you start your roadmap.
              </p>

              <Link
                to="/roadmap"
                className="mt-4 inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold hover:bg-blue-100 transition"
              >
                Start Learning

                <ArrowRight size={18} />
              </Link>

            </div>

          ) : (

            <Link
              to="/roadmap"
              className="mt-5 inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold hover:bg-blue-100 transition"
            >
              Continue Learning

              <ArrowRight size={18} />
            </Link>

          )}

        </div>

      </div>

    </section>
  );
}

export default WelcomeBanner;