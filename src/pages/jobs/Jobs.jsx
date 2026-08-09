import { useContext, useMemo, useState } from "react";
import { CareerContext } from "../../context/CareerContext";
import {
  getJobsForStudent,
  searchJobs,
  filterJobs,
} from "../../utils/jobEngine";

function Jobs() {
  const { student } = useContext(CareerContext);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    location: "All",
    workMode: "All",
    experience: "All",
    category: "All",
  });

  const jobs = useMemo(() => {
    if (!student) {
      return [];
    }

    return getJobsForStudent(student);
  }, [student]);

  const filteredJobs = useMemo(() => {
    const searched =
      searchJobs(jobs, search);

    return filterJobs(
      searched,
      filters
    );
  }, [jobs, search, filters]);

  function updateFilter(name, value) {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function clearFilters() {
    setSearch("");

    setFilters({
      location: "All",
      workMode: "All",
      experience: "All",
      category: "All",
    });
  }

  if (!student) {
    return (
      <section className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg">
          <h2 className="text-3xl font-bold text-slate-800">
            Complete Your Career Profile
          </h2>

          <p className="text-gray-500 mt-4">
            Fill out your student profile first
            to see jobs relevant to your education
            and specialization.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 py-12">

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="mb-10">

          <p className="text-blue-600 font-semibold">
            CAREEROS JOBS
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Job Opportunities
          </h1>

          <p className="text-gray-500 mt-3 max-w-2xl">
            Find job opportunities matched to your
            education and specialization.
          </p>

        </div>

        {/* Student Match */}

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-sm text-gray-500">
                Jobs matched for
              </p>

              <h2 className="text-xl font-bold mt-1">
                {student.specialization
                  ? `${student.specialization} • ${student.education}`
                  : student.education}
              </h2>

            </div>

            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
              {jobs.length} Matching Jobs
            </div>

          </div>

        </div>

        {/* Search */}

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search jobs, companies or skills..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Filters */}

          <div className="grid md:grid-cols-4 gap-4 mt-5">

            <select
              value={filters.location}
              onChange={(e) =>
                updateFilter(
                  "location",
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-3"
            >
              <option value="All">
                All Locations
              </option>

              <option value="Bengaluru, Karnataka">
                Bengaluru
              </option>

              <option value="Hyderabad, Telangana">
                Hyderabad
              </option>

              <option value="Chennai, Tamil Nadu">
                Chennai
              </option>

              <option value="Pune, Maharashtra">
                Pune
              </option>
            </select>

            <select
              value={filters.workMode}
              onChange={(e) =>
                updateFilter(
                  "workMode",
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-3"
            >
              <option value="All">
                All Work Modes
              </option>

              <option value="Remote">
                Remote
              </option>

              <option value="Hybrid">
                Hybrid
              </option>
            </select>

            <select
              value={filters.experience}
              onChange={(e) =>
                updateFilter(
                  "experience",
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-3"
            >
              <option value="All">
                All Experience
              </option>

              <option value="Fresher">
                Fresher
              </option>
            </select>

            <select
              value={filters.category}
              onChange={(e) =>
                updateFilter(
                  "category",
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-3"
            >
              <option value="All">
                All Categories
              </option>

              <option value="Software Development">
                Software Development
              </option>

              <option value="Frontend Development">
                Frontend Development
              </option>

              <option value="Backend Development">
                Backend Development
              </option>

              <option value="Full Stack Development">
                Full Stack Development
              </option>

              <option value="Data & Analytics">
                Data & Analytics
              </option>

              <option value="Data Science">
                Data Science
              </option>

              <option value="Artificial Intelligence">
                Artificial Intelligence
              </option>

              <option value="Testing">
                Testing
              </option>

              <option value="Cloud & DevOps">
                Cloud & DevOps
              </option>
            </select>

          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 text-blue-600 font-semibold hover:underline"
          >
            Clear Filters
          </button>

        </div>

        {/* Results */}

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Available Jobs
          </h2>

          <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            {filteredJobs.length} Jobs
          </span>

        </div>

        {/* Job Cards */}

        {filteredJobs.length > 0 ? (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredJobs.map((job) => (

              <div
                key={job.id}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition"
              >

                <div className="flex justify-between gap-4">

                  <div>

                    <h3 className="text-xl font-bold">
                      {job.title}
                    </h3>

                    <p className="text-blue-600 font-semibold mt-1">
                      {job.company}
                    </p>

                  </div>

                  <span className="text-3xl">
                    💼
                  </span>

                </div>

                <div className="mt-5 space-y-2 text-sm text-gray-600">

                  <p>
                    📍 {job.location}
                  </p>

                  <p>
                    🏢 {job.workMode}
                  </p>

                  <p>
                    👨‍💻 {job.experience}
                  </p>

                  <p>
                    💰 {job.salary}
                  </p>

                </div>

                <p className="text-gray-600 mt-5 line-clamp-3">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">

                  {job.skills
                    .slice(0, 4)
                    .map((skill) => (

                      <span
                        key={skill}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>

                    ))}

                </div>

                <button
                  type="button"
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  View Job →
                </button>

              </div>

            ))}

          </div>

        ) : (

          <div className="bg-white rounded-3xl shadow-lg py-20 text-center">

            <h3 className="text-2xl font-bold text-gray-700">
              No Matching Jobs
            </h3>

            <p className="text-gray-500 mt-3">
              Try changing your search or filters.
            </p>

          </div>

        )}

      </div>

    </section>
  );
}

export default Jobs;
