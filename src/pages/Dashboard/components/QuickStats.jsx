import {
    GraduationCap,
    Bookmark,
    Calendar,
    Trophy,
} from "lucide-react";

function QuickStats({
    careersExplored = 0,
    savedJobs = 0,
    upcomingExams = 0,
    roadmapsCompleted = 0,
}) {
    const stats = [
        {
            title: "Careers Explored",
            value: careersExplored,
            icon: GraduationCap,
            iconClass:
                "bg-blue-50 text-blue-600",
        },
        {
            title: "Saved Jobs",
            value: savedJobs,
            icon: Bookmark,
            iconClass:
                "bg-purple-50 text-purple-600",
        },
        {
            title: "Upcoming Exams",
            value: upcomingExams,
            icon: Calendar,
            iconClass:
                "bg-red-50 text-red-600",
        },
        {
            title: "Roadmaps Completed",
            value: roadmapsCompleted,
            icon: Trophy,
            iconClass:
                "bg-green-50 text-green-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">

            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.title}
                        className="
                            h-[140px]
                            bg-white
                            rounded-3xl
                            shadow-sm
                            border border-gray-100
                            p-6
                            hover:shadow-lg
                            transition-all
                            duration-300
                            flex
                            items-center
                        "
                    >

                        <div className="flex items-center justify-between gap-4 w-full">

                            <div className="min-w-0">

                                <p className="text-sm text-gray-500 truncate">
                                    {stat.title}
                                </p>

                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stat.value}
                                </p>

                            </div>

                            <div
                                className={`
                                    w-12
                                    h-12
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0
                                    ${stat.iconClass}
                                `}
                            >
                                <Icon size={23} />
                            </div>

                        </div>

                    </div>
                );
            })}

        </div>
    );
}

export default QuickStats;