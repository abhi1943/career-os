import { Link } from "react-router-dom";

function ProfileCard({ student }) {

    const hasName =
        Boolean(
            student?.name &&
            String(student.name).trim()
        );

    const hasEducation =
        Boolean(
            student?.education &&
            String(student.education).trim()
        );

    const hasSpecialization =
        Boolean(
            student?.specialization &&
            String(student.specialization).trim()
        );

    const hasProfile =
        hasName ||
        hasEducation ||
        hasSpecialization;

    const displayName =
        hasName
            ? String(student.name).trim()
            : "Student";

    const initial =
        hasName
            ? displayName
                .charAt(0)
                .toUpperCase()
            : "S";

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 h-full min-h-full flex flex-col">

            {/* ==================================================
                PROFILE HEADER
            ================================================== */}

            <div className="flex flex-col items-center">

                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {initial}
                </div>

                <h2 className="mt-5 text-2xl font-bold text-center">
                    {displayName}
                </h2>

                <p className="text-gray-500">
                    CareerOS Student
                </p>

            </div>


            {/* ==================================================
                PROFILE EMPTY STATE
            ================================================== */}

            {!hasProfile ? (

                <div className="flex-1 flex items-center justify-center text-center">

                    <div className="w-full">

                        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">

                            <p className="font-semibold text-blue-800">
                                Complete your profile
                            </p>

                            <p className="text-sm text-blue-600 mt-2">
                                Add your education and specialization
                                to personalize your CareerOS experience.
                            </p>

                            <Link
                                to="/profile"
                                className="inline-flex items-center justify-center mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
                            >
                                Complete Profile
                            </Link>

                        </div>

                    </div>

                </div>

            ) : (

                <>
                    {/* ==================================================
                        PROFILE DETAILS
                    ================================================== */}

                    <div className="border-t mt-6 pt-6 space-y-4">

                        {/* EDUCATION */}

                        <div className="flex justify-between gap-4">

                            <span className="text-gray-500 shrink-0">
                                Education
                            </span>

                            <span className="font-semibold text-right truncate">
                                {hasEducation
                                    ? student.education
                                    : "Not Selected"}
                            </span>

                        </div>


                        {/* STREAM */}

                        <div className="flex justify-between gap-4">

                            <span className="text-gray-500 shrink-0">
                                Stream
                            </span>

                            <span className="font-semibold text-right truncate">
                                {hasSpecialization
                                    ? student.specialization
                                    : "Not Selected"}
                            </span>

                        </div>


                        {/* STATUS */}

                        <div className="flex justify-between gap-4">

                            <span className="text-gray-500 shrink-0">
                                Status
                            </span>

                            <span className="text-green-600 font-semibold">
                                Active
                            </span>

                        </div>

                    </div>
                </>
            )}


            {/* ==================================================
                PROFILE ACTION
            ================================================== */}

            <div className="mt-auto pt-8">

                <Link
                    to="/profile"
                    className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
                >
                    {hasProfile
                        ? "Edit Profile"
                        : "Complete Profile"}
                </Link>

            </div>

        </div>
    );
}

export default ProfileCard;