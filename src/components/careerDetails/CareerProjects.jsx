function CareerProjects({ projects = [] }) {
  if (!Array.isArray(projects) || projects.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold mb-8">
        💻 Projects
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          const projectName =
            typeof project === "string"
              ? project
              : project?.name ||
                project?.title ||
                `Project ${index + 1}`;

          const description =
            typeof project === "object"
              ? project?.description || ""
              : "";

          const technologies =
            typeof project === "object" &&
            Array.isArray(project?.technologies)
              ? project.technologies
              : [];

          const url =
            typeof project === "object"
              ? project?.url ||
                project?.link ||
                project?.projectUrl ||
                project?.github ||
                project?.githubUrl ||
                ""
              : "";

          const content = (
            <>
              <h3 className="font-bold text-lg text-slate-800">
                🚀 {projectName}
              </h3>

              {description && (
                <p className="text-gray-500 mt-3">
                  {description}
                </p>
              )}

              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {technologies.map((technology) => (
                    <span
                      key={technology}
                      className="
                        bg-blue-100
                        text-blue-700
                        px-3
                        py-1
                        rounded-full
                        text-sm
                      "
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              )}
            </>
          );

          return url ? (
            <a
              key={
                typeof project === "object"
                  ? project?.id || projectName
                  : `${projectName}-${index}`
              }
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                bg-white
                rounded-xl
                shadow
                p-5
                hover:shadow-lg
                hover:-translate-y-1
                transition
                block
              "
            >
              {content}

              <div className="mt-6">
                <span className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  View Project →
                </span>
              </div>
            </a>
          ) : (
            <div
              key={
                typeof project === "object"
                  ? project?.id || projectName
                  : `${projectName}-${index}`
              }
              className="
                bg-white
                rounded-xl
                shadow
                p-5
                hover:shadow-lg
                transition
              "
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CareerProjects;