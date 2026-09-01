import {
  Clock3,
  IndianRupee,
  TrendingUp,
  Star,
  Heart,
  Scale,
  Share2,
} from "lucide-react";

import { Link } from "react-router-dom";

function CareerHero({
  career,
  favorite,
  compared,
  toggleFavorite,
  addToCompare,
  setGoal,
}) {
  if (!career) return null;

  const salary =
    career.averageSalary ||
    career.salary ||
    "Salary information unavailable";

  const rating =
    typeof career.rating === "number"
      ? career.rating
      : 4.5;

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Career link copied!");
      }
    } catch {
      // Clipboard access may be unavailable.
    }
  };

  return (
    <section
      aria-labelledby="career-title"
      className="
        bg-gradient-to-r
        from-blue-700
        via-cyan-600
        to-indigo-700
        rounded-2xl
        sm:rounded-3xl
        text-white
        p-5
        sm:p-7
        lg:p-10
        shadow-xl
      "
    >
      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-10">

        {/* Career Information */}
        <div className="flex-1 min-w-0">

          <h1
            id="career-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold break-words"
          >
            {career.icon} {career.name}
          </h1>

          {career.description && (
            <p className="text-base sm:text-lg lg:text-xl mt-4 sm:mt-5 text-blue-100 leading-relaxed">
              {career.description}
            </p>
          )}

          <div
            className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8"
            aria-label="Career information"
          >

            {career.duration && (
              <span className="bg-white/20 px-4 sm:px-5 py-2 rounded-full flex items-center gap-2 text-sm sm:text-base">
                <Clock3
                  size={18}
                  aria-hidden="true"
                />
                <span>{career.duration}</span>
              </span>
            )}

            {career.eligibility && (
              <span className="bg-white/20 px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base">
                🎯 {career.eligibility}
              </span>
            )}

            <span className="bg-white/20 px-4 sm:px-5 py-2 rounded-full flex items-center gap-2 text-sm sm:text-base">
              <IndianRupee
                size={18}
                aria-hidden="true"
              />
              <span>{salary}</span>
            </span>

            {career.growth && (
              <span className="bg-white/20 px-4 sm:px-5 py-2 rounded-full flex items-center gap-2 text-sm sm:text-base">
                <TrendingUp
                  size={18}
                  aria-hidden="true"
                />
                <span>{career.growth}</span>
              </span>
            )}

          </div>

        </div>

        {/* Actions */}
        <div className="w-full lg:w-72 lg:flex-shrink-0">

          <div className="bg-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur">

            <div
              className="flex items-center gap-2"
              aria-label={`Career rating: ${rating} out of 5`}
            >
              <Star
                fill="currentColor"
                className="text-yellow-400"
                aria-hidden="true"
              />

              <span className="text-xl font-bold">
                {rating}
              </span>

              <span className="sr-only">
                out of 5
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">

              {/* Favorite */}
              <button
                type="button"
                onClick={() => toggleFavorite(career)}
                aria-pressed={favorite}
                aria-label={
                  favorite
                    ? `Remove ${career.name} from saved careers`
                    : `Save ${career.name} to your careers`
                }
                className={`
                  w-full
                  rounded-xl
                  py-3
                  px-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-blue-700
                  ${
                    favorite
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-white text-blue-700 hover:bg-blue-50"
                  }
                `}
              >
                <Heart
                  fill={
                    favorite
                      ? "currentColor"
                      : "none"
                  }
                  aria-hidden="true"
                />

                <span>
                  {favorite
                    ? "Saved"
                    : "Save Career"}
                </span>
              </button>

              {/* Compare */}
              <button
                type="button"
                onClick={() => addToCompare(career)}
                disabled={compared}
                aria-pressed={compared}
                aria-label={
                  compared
                    ? `${career.name} is already added to compare`
                    : `Add ${career.name} to compare`
                }
                className={`
                  w-full
                  rounded-xl
                  py-3
                  px-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-blue-700
                  ${
                    compared
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                  }
                `}
              >
                <Scale aria-hidden="true" />

                <span>
                  {compared
                    ? "Added"
                    : "Compare"}
                </span>
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                aria-label={`Copy link to ${career.name}`}
                className="
                  w-full
                  rounded-xl
                  py-3
                  px-4
                  bg-white/20
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:bg-white/30
                  transition
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-blue-700
                "
              >
                <Share2
                  aria-hidden="true"
                />

                <span>Share</span>
              </button>

              {/* Goal */}
              <button
                type="button"
                onClick={() => setGoal(career)}
                aria-label={`Set ${career.name} as your career goal`}
                className="
                  w-full
                  rounded-xl
                  py-3
                  px-4
                  bg-green-600
                  hover:bg-green-700
                  transition
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-blue-700
                "
              >
                🎯 Set as Career Goal
              </button>

              {/* AI Mentor */}
              <Link
                to={`/chatbot?career=${career.id}`}
                aria-label={`Ask AI Mentor about ${career.name}`}
                className="
                  flex
                  w-full
                  rounded-xl
                  py-3
                  px-4
                  bg-purple-600
                  hover:bg-purple-700
                  transition
                  text-white
                  items-center
                  justify-center
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-blue-700
                "
              >
                🤖 Ask AI Mentor
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default CareerHero;