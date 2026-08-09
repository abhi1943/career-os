import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg w-full">

        <div className="text-7xl font-bold text-blue-600">
          404
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mt-4">
          Page Not Found
        </h1>

        <p className="text-gray-500 mt-4">
          Sorry, the page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Go to Home
        </Link>

      </div>
    </section>
  );
}

export default NotFound;