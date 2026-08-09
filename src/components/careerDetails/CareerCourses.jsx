function CareerCourses({ courses }) {

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        📚 Recommended Courses
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {courses.map(course => (

          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-lg p-6"
          >

            <h3 className="font-bold text-xl">
              {course.title}
            </h3>

            <p className="mt-3">
              {course.platform}
            </p>

            <p>{course.level}</p>

            <p>{course.duration}</p>

            <a
              href={course.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 mt-4 inline-block"
            >
              Start Learning →
            </a>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CareerCourses;