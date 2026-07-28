import { Menu } from "lucide-react";
import Logo from "../common/Logo";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto h-20 flex justify-between items-center px-6">

        <Logo />

        <ul className="hidden lg:flex gap-8 font-medium">

          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "hover:text-blue-600 transition"
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/careers"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "hover:text-blue-600 transition"
              }
            >
              Careers
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/colleges"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "hover:text-blue-600 transition"
              }
            >
              Colleges
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/companies"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "hover:text-blue-600 transition"
              }
            >
              Companies
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/mentor"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "hover:text-blue-600 transition"
              }
            >
              AI Mentor
            </NavLink>
          </li>

        </ul>

        <button className="hidden lg:block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          Get Started
        </button>

        <Link
          to="/"
          className="hidden lg:block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Get Started
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;