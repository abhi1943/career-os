function JobCard({ job }) {

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold">

                {job.role}

            </h2>

            <p className="text-gray-600">

                {job.company}

            </p>

            <p>

                📍 {job.location}

            </p>

            <p>

                💰 {job.salary}

            </p>

            <p>

                🕒 {job.experience}

            </p>

            <div className="flex flex-wrap gap-2 mt-4">

                {job.skills.map(skill => (

                    <span
                        key={skill}
                        className="bg-blue-100 px-3 py-1 rounded-full"
                    >

                        {skill}

                    </span>

                ))}

            </div>

            <a

                href={job.applyLink}

                target="_blank"

                rel="noreferrer"

                className="inline-block mt-6 bg-green-600 text-white px-5 py-2 rounded-xl"

            >

                Apply

            </a>

        </div>

    );

}

export default JobCard;