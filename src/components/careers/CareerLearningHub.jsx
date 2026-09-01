import { learningResources } from "../../utils/learningResources";

function CareerLearningHub({ careerId }) {
  const resources = learningResources[careerId];

  /* ==================================================
     CAREER NOT FOUND
  ================================================== */

  if (!resources) {
    return (
      <section className="bg-white rounded-3xl shadow-lg p-8 mt-10">
        <h2 className="text-3xl font-bold mb-4">
          📚 Career Learning Hub
        </h2>

        <p className="text-gray-500">
          Learning resources are coming soon for this career.
        </p>
      </section>
    );
  }

  /* ==================================================
     SAFE RESOURCE ARRAYS
  ================================================== */

  const youtube = Array.isArray(resources.youtube)
    ? resources.youtube
    : [];

  const websites = Array.isArray(resources.websites)
    ? resources.websites
    : [];

  const projects = Array.isArray(resources.projects)
    ? resources.projects
    : [];

  const books = Array.isArray(resources.books)
    ? resources.books
    : [];

  const courses = Array.isArray(resources.courses)
    ? resources.courses
    : [];

  /* ==================================================
     EMPTY RESOURCE CHECK
  ================================================== */

  const hasResources =
    youtube.length > 0 ||
    websites.length > 0 ||
    projects.length > 0 ||
    books.length > 0 ||
    courses.length > 0;

  if (!hasResources) {
    return (
      <section className="bg-white rounded-3xl shadow-lg p-8 mt-10">
        <h2 className="text-3xl font-bold mb-4">
          📚 Career Learning Hub
        </h2>

        <p className="text-gray-500">
          Learning resources are being prepared for this career.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl shadow-lg p-8 mt-10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800">
          📚 Career Learning Hub
        </h2>

        <p className="text-gray-500 mt-2">
          Recommended resources to build the skills required
          for this career.
        </p>
      </div>

      {/* ==================================================
          COURSES
      ================================================== */}

      {courses.length > 0 && (
        <div className="mb-12">

          <h3 className="text-2xl font-semibold mb-5">
            🎓 Recommended Courses
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, index) => (
              <a
                key={`${course.id || course.title}-${index}`}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                  bg-white
                  hover:shadow-lg
                  hover:border-blue-400
                  transition
                "
              >
                <div className="text-3xl mb-4">
                  🎓
                </div>

                <h4 className="font-bold text-slate-800">
                  {course.title}
                </h4>

                {course.platform && (
                  <p className="text-gray-500 mt-2">
                    {course.platform}
                  </p>
                )}

                {course.level && (
                  <p className="text-sm text-gray-500 mt-1">
                    {course.level}
                  </p>
                )}

                <p className="text-blue-600 mt-3 font-semibold">
                  Start Learning →
                </p>
              </a>
            ))}
          </div>

        </div>
      )}

      {/* ==================================================
          BOOKS
      ================================================== */}

      {books.length > 0 && (
        <div className="mb-12">

          <h3 className="text-2xl font-semibold mb-5">
            📖 Recommended Books
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {books.map((book, index) => (
              <div
                key={`${book.title}-${index}`}
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                  bg-white
                  hover:shadow-lg
                  transition
                "
              >
                <div className="text-3xl mb-4">
                  📚
                </div>

                <h4 className="font-bold text-slate-800">
                  {book.title}
                </h4>

                {book.author && (
                  <p className="text-gray-500 mt-2">
                    By {book.author}
                  </p>
                )}

                {book.category && (
                  <span className="
                    inline-block
                    mt-3
                    bg-blue-100
                    text-blue-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                  ">
                    {book.category}
                  </span>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================================================
          YOUTUBE
      ================================================== */}

      {youtube.length > 0 && (
        <div className="mb-12">

          <h3 className="text-2xl font-semibold mb-5">
            🎥 Recommended YouTube Courses
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {youtube.map((video, index) => (
              <a
                key={`${video.title}-${index}`}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                  bg-white
                  hover:shadow-lg
                  hover:border-red-400
                  transition
                "
              >
                <div className="text-3xl mb-4">
                  ▶️
                </div>

                <h4 className="font-bold text-slate-800">
                  {video.title}
                </h4>

                <p className="text-red-600 mt-3 font-semibold">
                  Watch Course →
                </p>
              </a>
            ))}

          </div>
        </div>
      )}

      {/* ==================================================
          WEBSITES
      ================================================== */}

      {websites.length > 0 && (
        <div className="mb-12">

          <h3 className="text-2xl font-semibold mb-5">
            🌐 Best Learning Websites
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            {websites.map((site, index) => (
              <a
                key={`${site.name}-${index}`}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                  bg-white
                  hover:shadow-lg
                  hover:border-blue-400
                  transition
                "
              >
                <div className="text-3xl mb-4">
                  🌐
                </div>

                <h4 className="font-bold text-slate-800">
                  {site.name}
                </h4>

                <p className="text-blue-600 mt-3 font-semibold">
                  Visit Website →
                </p>
              </a>
            ))}

          </div>
        </div>
      )}

      {/* ==================================================
          PROJECTS
      ================================================== */}

      {projects.length > 0 && (
        <div>

          <h3 className="text-2xl font-semibold mb-5">
            💻 Practice Projects
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {projects.map((project, index) => (
              <div
                key={`${project}-${index}`}
                className="
                  bg-slate-100
                  rounded-2xl
                  p-5
                  hover:bg-blue-50
                  hover:shadow-md
                  transition
                "
              >
                <div className="text-3xl mb-3">
                  🚀
                </div>

                <h4 className="font-bold text-slate-800">
                  {project}
                </h4>
              </div>
            ))}

          </div>
        </div>
      )}

    </section>
  );
}

export default CareerLearningHub;