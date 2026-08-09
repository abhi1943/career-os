import jobs from "../../data/jobs";

function CareerJobs({ careerId }) {
  const jobList = jobs[careerId];

  if (!jobList) return null;

  return (
    <div className="mt-16">

      <h2 className="text-3xl font-bold mb-6">
        💼 Latest Job Openings
      </h2>

      <div className="space-y-5">

        {jobList.map((job) => (

          <div
            key={job.id}
            className="bg-white shadow rounded-2xl p-6 border"
          >

            <div className="flex justify-between">

              <div>

                <h3 className="text-xl font-bold">
                  {job.title}
                </h3>

                <p className="text-gray-600 mt-2">
                  🏢 {job.company}
                </p>

                <p>
                  📍 {job.location}
                </p>

                <p>
                  💰 {job.salary}
                </p>

                <p>
                  👨‍💻 {job.experience}
                </p>

                <p>
                  📌 {job.type}
                </p>

              </div>

              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 h-12 rounded-xl"
              >
                Apply
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CareerJobs;