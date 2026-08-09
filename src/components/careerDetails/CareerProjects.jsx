function CareerProjects({ projects }) {
  if (!projects?.length) return null;

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold mb-8">
        💻 Projects
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project}
            className="bg-white rounded-xl shadow p-5"
          >
            🚀 {project}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CareerProjects;