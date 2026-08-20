function ApplicationStats({
    applications,
}) {
    const total = applications.length;

    const applied = applications.filter(
        (application) =>
            application.status === "Applied"
    ).length;

    const interview = applications.filter(
        (application) =>
            application.status === "Interview"
    ).length;

    const offer = applications.filter(
        (application) =>
            application.status === "Offer"
    ).length;

    const rejected = applications.filter(
        (application) =>
            application.status === "Rejected"
    ).length;

    const withdrawn = applications.filter(
        (application) =>
            application.status === "Withdrawn"
    ).length;

    const statistics = [
        {
            title: "Total",
            value: total,
            color: "text-gray-900",
        },
        {
            title: "Applied",
            value: applied,
            color: "text-blue-600",
        },
        {
            title: "Interview",
            value: interview,
            color: "text-yellow-600",
        },
        {
            title: "Offers",
            value: offer,
            color: "text-green-600",
        },
        {
            title: "Rejected",
            value: rejected,
            color: "text-red-600",
        },
        {
            title: "Withdrawn",
            value: withdrawn,
            color: "text-gray-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

            {statistics.map((stat) => (
                <div
                    key={stat.title}
                    className="
                        bg-white
                        rounded-3xl
                        shadow-lg
                        p-6
                        transition
                        hover:shadow-xl
                    "
                >
                    <p className="text-sm font-medium text-gray-500">
                        {stat.title}
                    </p>

                    <h2
                        className={`
                            text-4xl
                            font-bold
                            mt-3
                            ${stat.color}
                        `}
                    >
                        {stat.value}
                    </h2>
                </div>
            ))}

        </div>
    );
}

export default ApplicationStats;