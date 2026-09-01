function CareerCourses({ courses = [] }) {
  if (!Array.isArray(courses) || courses.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          📚 Recommended Courses
        </h2>

        <p className="text-gray-500 mt-2">
          Curated courses to help you develop the skills needed for this career.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div
            key={course.id || `${course.title}-${index}`}
            className="
              bg-white
              rounded-2xl
              shadow-lg
              border
              border-gray-100
              p-6
              hover:shadow-xl
              transition
              flex
              flex-col
            "
          >
            <div className="text-3xl mb-4">
              🎓
            </div>

            <h3 className="font-bold text-xl text-slate-800">
              {course.title}
            </h3>

            {course.platform && (
              <p className="mt-3 text-gray-700 font-medium">
                {course.platform}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {course.category && (
                <span className="
                  bg-blue-100
                  text-blue-700
                  px-3
                  py-1
                  rounded-full
                  text-sm
                ">
                  {course.category}
                </span>
              )}

              {course.level && (
                <span className="
                  bg-gray-100
                  text-gray-700
                  px-3
                  py-1
                  rounded-full
                  text-sm
                ">
                  {course.level}
                </span>
              )}
            </div>

            <div className="mt-4 space-y-1 text-sm text-gray-500">
              {course.duration && (
                <p>⏱️ Duration: {course.duration}</p>
              )}

              {course.type && (
                <p>💰 Type: {course.type}</p>
              )}
            </div>

            {Array.isArray(course.skills) &&
              course.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill, skillIndex) => (
                      <span
                        key={`${skill}-${skillIndex}`}
                        className="
                          text-xs
                          bg-green-100
                          text-green-700
                          px-2
                          py-1
                          rounded-full
                        "
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {course.url && (
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-6
                  inline-flex
                  items-center
                  justify-center
                  px-4
                  py-3
                  rounded-xl
                  bg-blue-600
                  text-white
                  font-semibold
                  hover:bg-blue-700
                  transition
                "
              >
                Start Learning →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default CareerCourses;