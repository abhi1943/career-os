
function ApplicationTable({

    applications,

    onEdit,

    onDelete,

}) {

    if (applications.length === 0) {

        return (

            <div className="bg-white rounded-3xl shadow-lg p-8 mt-8 text-center">

                <h2 className="text-xl font-semibold text-gray-600">

                    No Job Applications Found

                </h2>

                <p className="text-gray-500 mt-2">

                    Start by adding your first application.

                </p>

            </div>

        );

    }

    function statusColor(status) {

        switch (status) {

            case "Applied":
                return "bg-blue-100 text-blue-700";

            case "Interview":
                return "bg-yellow-100 text-yellow-700";

            case "Offer":
                return "bg-green-100 text-green-700";

            case "Rejected":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";

        }

    }

    return (

        <div className="bg-white rounded-3xl shadow-lg mt-8 overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="p-4 text-left">
                                Company
                            </th>

                            <th className="p-4 text-left">
                                Role
                            </th>

                            <th className="p-4 text-left">
                                Location
                            </th>

                            <th className="p-4 text-left">
                                Salary
                            </th>

                            <th className="p-4 text-left">
                                Applied
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                            <th className="p-4 text-center">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {applications.map((app) => (

                            <tr
                                key={app.id}
                                className="border-t hover:bg-slate-50"
                            >

                                <td className="p-4 font-semibold">

                                    {app.company}

                                </td>

                                <td className="p-4">

                                    {app.role}

                                </td>

                                <td className="p-4">

                                    {app.location || "-"}

                                </td>

                                <td className="p-4">

                                    {app.salary || "-"}

                                </td>

                                <td className="p-4">

                                    {app.appliedDate || "-"}

                                </td>

                                <td className="p-4">

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(app.status)}`}
                                    >

                                        {app.status}

                                    </span>

                                </td>

                                <td className="p-4">

                                    <div className="flex justify-center gap-2">

                                        <button
                                            onClick={() => onEdit(app)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
                                        >

                                            ✏️ Edit

                                        </button>

                                        <button
                                            onClick={() => onDelete(app.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                                        >

                                            🗑 Delete

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default ApplicationTable;

