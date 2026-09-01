
import CareerCourses from "./CareerCourses";
import CareerProjects from "./CareerProjects";
import CareerBooks from "./CareerBooks";
import CareerYoutube from "./CareerYoutube";

function CareerResources({ resources = {} }) {
  const courses = Array.isArray(resources?.courses)
    ? resources.courses
    : [];

  const projects = Array.isArray(resources?.projects)
    ? resources.projects
    : [];

  const books = Array.isArray(resources?.books)
    ? resources.books
    : [];

  const youtube = Array.isArray(resources?.youtube)
    ? resources.youtube
    : [];

  const hasResources =
    courses.length > 0 ||
    projects.length > 0 ||
    books.length > 0 ||
    youtube.length > 0;

  // ======================================================
  // EMPTY RESOURCE FALLBACK
  // ======================================================

  if (!hasResources) {
    return (
      <section className="mt-10">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">
            📚
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Resources Coming Soon
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            We don't have curated learning resources for this
            career yet. Please check back later as we continue
            expanding the CareerOS resource library.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-10">
      {courses.length > 0 && (
        <CareerCourses courses={courses} />
      )}

      {projects.length > 0 && (
        <CareerProjects projects={projects} />
      )}

      {books.length > 0 && (
        <CareerBooks books={books} />
      )}

      {youtube.length > 0 && (
        <CareerYoutube channels={youtube} />
      )}
    </div>
  );
}

export default CareerResources;
