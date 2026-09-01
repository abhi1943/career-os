
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link
      to="/"
      aria-label="CareerOS home"
      className="
        flex
        items-center
        gap-3
        group
        rounded-xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-500
        focus-visible:ring-offset-2
      "
    >
      <div
        className="
          w-12
          h-12
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          flex
          items-center
          justify-center
          shadow-lg
          transition-transform
          duration-300
          group-hover:scale-110
        "
        aria-hidden="true"
      >
        <GraduationCap className="text-white w-7 h-7" />
      </div>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
          Career<span className="text-blue-600">OS</span>
        </h1>

        <p className="text-xs text-slate-500">
          Your Career Journey Starts Here
        </p>
      </div>
    </Link>
  );
}

export default Logo;

