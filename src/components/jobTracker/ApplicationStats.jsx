function ApplicationStats({ applications }) {

    const applied =
        applications.filter(
            a => a.status === "Applied"
        ).length;

    const interview =
        applications.filter(
            a => a.status === "Interview"
        ).length;

    const offer =
        applications.filter(
            a => a.status === "Offer"
        ).length;

    const rejected =
        applications.filter(
            a => a.status === "Rejected"
        ).length;

    const card = (title, value, color) => (

        <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-gray-500">

                {title}

            </p>

            <h2 className={`text-4xl font-bold mt-3 ${color}`}>

                {value}

            </h2>

        </div>

    );

    return (

        <div className="grid md:grid-cols-4 gap-6">

            {card("Applied", applied, "text-blue-600")}

            {card("Interview", interview, "text-yellow-600")}

            {card("Offers", offer, "text-green-600")}

            {card("Rejected", rejected, "text-red-600")}

        </div>

    );

}

export default ApplicationStats;

