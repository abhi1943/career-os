import { learningResources } from "../../utils/learningResources";

function CareerLearningHub({ careerId }) {
  const resources = learningResources[careerId];

  if (!resources) {
    return (
      <section className="bg-white rounded-3xl shadow-lg p-8 mt-10">
        <h2 className="text-3xl font-bold mb-4">
          📚 Learning Hub
        </h2>

        <p className="text-gray-500">
          Learning resources are coming soon for this career.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl shadow-lg p-8 mt-10">

      <h2 className="text-3xl font-bold mb-8">
        📚 Career Learning Hub
      </h2>

      {/* YouTube */}

      <div className="mb-10">

        <h3 className="text-2xl font-semibold mb-5">
          🎥 Recommended YouTube Courses
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {resources.youtube.map((video) => (

            <a
              key={video.title}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-2xl p-5 hover:shadow-lg hover:border-red-500 transition"
            >

              <h4 className="font-bold">
                {video.title}
              </h4>

              <p className="text-red-600 mt-2">
                Watch Course →
              </p>

            </a>

          ))}

        </div>

      </div>

      {/* Websites */}

      <div className="mb-10">

        <h3 className="text-2xl font-semibold mb-5">
          🌐 Best Learning Websites
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

          {resources.websites.map((site) => (

            <a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-2xl p-5 hover:shadow-lg hover:border-blue-500 transition"
            >

              <h4 className="font-bold">
                {site.name}
              </h4>

              <p className="text-blue-600 mt-2">
                Visit Website →
              </p>

            </a>

          ))}

        </div>

      </div>

      {/* Projects */}

      <div>

        <h3 className="text-2xl font-semibold mb-5">
          💻 Practice Projects
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {resources.projects.map((project) => (

            <div
              key={project}
              className="bg-slate-100 rounded-2xl p-5"
            >

              <h4 className="font-bold">
                {project}
              </h4>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default CareerLearningHub;