import {
    Sparkles,

} from "lucide-react";

import JobCard from "../../pages/Jobs/JobCard";

import {
    getEnrichedRecommendedJobs,
} from "../../services/jobRecommendationService";


function RecommendedJobs({
    jobs = [],
    student,
    onView,
}) {
    if (
        !student ||
        !Array.isArray(jobs) ||
        jobs.length === 0
    ) {
        return null;
    }

    const recommendations =
        getEnrichedRecommendedJobs(
            jobs,
            student,
            {
                limit: 3,
                minimumScore: 30,
            }
        );

    if (
        recommendations.length === 0
    ) {
        return null;
    }

    return (
        <section className="mb-10">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 mb-6 text-white shadow-lg">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-start gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">

                            <Sparkles
                                size={25}
                            />

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold">
                                Recommended for You
                            </h2>

                            <p className="text-blue-100 mt-1 text-sm">
                                Jobs selected using your CareerOS profile,
                                skills, education, career goals, and experience.
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold bg-white/15 px-4 py-2 rounded-xl">

                        <Sparkles
                            size={16}
                        />

                        Personalized

                    </div>

                </div>

            </div>

            {/* ==================================================
                RECOMMENDED JOBS
            ================================================== */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {recommendations.map(
                    (job, index) => (
                        <JobCard
                            key={
                                job?.id ||
                                `${job?.title}-${index}`
                            }
                            job={job}
                            match={
                                job?.recommendationMatch
                            }
                            onView={() =>
                                onView?.(job)
                            }
                        />
                    )
                )}

            </div>

        </section>
    );
}

export default RecommendedJobs;