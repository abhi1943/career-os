import jobsDatabase from "../../data/jobsDatabase";

import JobCard from "../../components/jobs/JobCard";

function JobsPage() {

    const [search, setSearch] = useState("");

    const filteredJobs = jobsDatabase.filter(job =>
        job.role.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div className="max-w-6xl mx-auto py-10">

            <h1 className="text-4xl font-bold mb-8">

                Latest Jobs

            </h1>
            <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-xl p-3 mb-6"
            />

            <div className="grid md:grid-cols-2 gap-6">

                {filteredJobs.map(job => (

                    <JobCard

                        key={job.id}

                        job={job}

                    />

                ))}

            </div>

        </div>

    );

}

export default JobsPage;