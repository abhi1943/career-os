import { User } from "lucide-react";

function ProfileCard({ student }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">

      <div className="flex flex-col items-center">

        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
          {student?.name ? student.name.charAt(0).toUpperCase() : "G"}
        </div>

        <h2 className="mt-5 text-2xl font-bold">
          {student?.name || "Guest"}
        </h2>

        <p className="text-gray-500">CareerOS Student</p>

      </div>

      <div className="border-t mt-6 pt-6 space-y-4">

        <div className="flex justify-between">
          <span className="text-gray-500">Education</span>
          <span className="font-semibold">
            {student?.education || "Not Selected"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Stream</span>
          <span className="font-semibold">
            {student?.stream || "Not Selected"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="text-green-600 font-semibold">
            Active
          </span>
        </div>

      </div>

      <button className="mt-8 w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition">
        Edit Profile
      </button>

    </div>
  );
}

export default ProfileCard;