function ApplicationCard({

    application,

    onEdit,

    onDelete,

}) {

    return (

        <div className="bg-white rounded-2xl shadow-lg p-5">

            <h2 className="text-xl font-bold">

                {application.company}

            </h2>

            <p className="text-gray-600 mt-1">

                {application.role}

            </p>

            <p className="mt-3">

                📍 {application.location || "-"}

            </p>

            <p>

                💰 {application.salary || "-"}

            </p>

            <p>

                📅 {application.appliedDate || "-"}

            </p>

            <p className="mt-2">

                <strong>Status:</strong>

                {" "}

                {application.status}

            </p>

            <div className="flex gap-3 mt-5">

                <button

                    onClick={() => onEdit(application)}

                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"

                >

                    Edit

                </button>

                <button

                    onClick={() => onDelete(application.id)}

                    className="bg-red-600 text-white px-4 py-2 rounded-lg"

                >

                    Delete

                </button>

            </div>

        </div>

    );

}

export default ApplicationCard;
