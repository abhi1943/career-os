import {
  Menu,
  X,
  ChevronDown,
  Search,
  Scale,
} from "lucide-react";

import { useContext, useState } from "react";
import { CompareContext } from "../../context/CompareContext";
import Logo from "../common/Logo";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { logoutUser } from "../../firebase/auth";

function Navbar() {
  const { compareList } = useContext(CompareContext);
  const { user } = useContext(AuthContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600 transition";

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-6">

        {/* MAIN NAVBAR */}

        <div className="h-20 flex items-center justify-between gap-6">

          {/* LOGO */}

          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* DESKTOP NAVIGATION */}

          <div className="hidden lg:flex items-center flex-1 justify-center">

            <ul className="flex items-center gap-7 font-medium">

              {/* HOME */}

              <li>
                <NavLink
                  to="/"
                  className={navLinkClass}
                >
                  Home
                </NavLink>
              </li>

              {/* CAREER */}

              <li className="relative group">

                <button
                  className="
                    flex items-center gap-1
                    py-7
                    text-gray-700
                    hover:text-blue-600
                    transition
                  "
                >
                  Career

                  <ChevronDown
                    size={16}
                    className="
                      group-hover:rotate-180
                      transition-transform
                    "
                  />
                </button>

                <div
                  className="
                    absolute left-1/2 -translate-x-1/2 top-full
                    w-64
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    border
                    border-gray-100
                    p-2
                    opacity-0
                    invisible
                    group-hover:opacity-100
                    group-hover:visible
                    transition-all
                    duration-200
                    z-50
                  "
                >

                  <NavLink
                    to="/careers"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    🎓 Career Explorer
                  </NavLink>

                  <NavLink
                    to="/professional-careers"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    💼 Professional Careers
                  </NavLink>

                  <NavLink
                    to="/career-assessment"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    🧠 Career Assessment
                  </NavLink>

                  <NavLink
                    to="/ai-recommendation"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    🤖 AI Recommendations
                  </NavLink>

                </div>

              </li>

              {/* EDUCATION */}

              <li className="relative group">

                <button
                  className="
                    flex items-center gap-1
                    py-7
                    text-gray-700
                    hover:text-blue-600
                    transition
                  "
                >
                  Education

                  <ChevronDown
                    size={16}
                    className="
                      group-hover:rotate-180
                      transition-transform
                    "
                  />
                </button>

                <div
                  className="
                    absolute left-1/2 -translate-x-1/2 top-full
                    w-60
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    border
                    border-gray-100
                    p-2
                    opacity-0
                    invisible
                    group-hover:opacity-100
                    group-hover:visible
                    transition-all
                    duration-200
                    z-50
                  "
                >

                  <NavLink
                    to="/colleges"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    🏫 Colleges
                  </NavLink>

                  <NavLink
                    to="/exams"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    📝 Entrance Exams
                  </NavLink>

                  <NavLink
                    to="/college-predictor"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    🎯 College Predictor
                  </NavLink>

                </div>

              </li>

              {/* OPPORTUNITIES */}

              <li className="relative group">

                <button
                  className="
                    flex items-center gap-1
                    py-7
                    text-gray-700
                    hover:text-blue-600
                    transition
                  "
                >
                  Opportunities

                  <ChevronDown
                    size={16}
                    className="
                      group-hover:rotate-180
                      transition-transform
                    "
                  />
                </button>

                <div
                  className="
                    absolute left-1/2 -translate-x-1/2 top-full
                    w-60
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    border
                    border-gray-100
                    p-2
                    opacity-0
                    invisible
                    group-hover:opacity-100
                    group-hover:visible
                    transition-all
                    duration-200
                    z-50
                  "
                >

                  <NavLink
                    to="/companies"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    🏢 Companies
                  </NavLink>

                  <NavLink
                    to="/search"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    🔎 Find Opportunities
                  </NavLink>

                </div>

              </li>

              {/* TOOLS */}

              <li className="relative group">

                <button
                  className="
                    flex items-center gap-1
                    py-7
                    text-gray-700
                    hover:text-blue-600
                    transition
                  "
                >
                  Tools

                  <ChevronDown
                    size={16}
                    className="
                      group-hover:rotate-180
                      transition-transform
                    "
                  />
                </button>

                <div
                  className="
                    absolute left-1/2 -translate-x-1/2 top-full
                    w-64
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    border
                    border-gray-100
                    p-2
                    opacity-0
                    invisible
                    group-hover:opacity-100
                    group-hover:visible
                    transition-all
                    duration-200
                    z-50
                  "
                >

                  <NavLink
                    to="/resume-builder"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    📄 Resume Builder
                  </NavLink>

                  <NavLink
                    to="/compare"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    ⚖️ Compare
                  </NavLink>

                  <NavLink
                    to="/chatbot"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  >
                    🤖 AI Mentor
                  </NavLink>

                </div>

              </li>

              {/* DASHBOARD */}

              {user && (
                <li>
                  <NavLink
                    to="/dashboard"
                    className={navLinkClass}
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}

            </ul>

          </div>

          {/* RIGHT SIDE */}

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">

            {/* SEARCH */}

            <Link
              to="/search"
              className="
                h-11
                px-4
                border
                border-gray-200
                rounded-xl
                flex
                items-center
                gap-2
                text-gray-700
                hover:bg-gray-50
                hover:border-blue-300
                transition
              "
            >
              <Search size={18} />
            </Link>

            {/* COMPARE */}

            {compareList.length > 0 && (
              <Link
                to="/compare"
                className="
                  relative
                  h-11
                  px-4
                  border
                  border-gray-200
                  rounded-xl
                  flex
                  items-center
                  gap-2
                  hover:bg-gray-50
                  transition
                "
              >

                <Scale size={18} />

                <span
                  className="
                    absolute
                    -top-2
                    -right-2
                    bg-red-500
                    text-white
                    text-xs
                    font-bold
                    rounded-full
                    h-5
                    w-5
                    flex
                    items-center
                    justify-center
                  "
                >
                  {compareList.length}
                </span>

              </Link>
            )}

            {/* AUTH */}

            {user ? (

              <div className="flex items-center gap-3">

                <div className="hidden xl:block text-right">

                  <p className="text-sm font-semibold text-gray-800">
                    {user.email?.split("@")[0]}
                  </p>

                  <p className="text-xs text-gray-500">
                    Logged in
                  </p>

                </div>

                <button
                  onClick={async () => {
                    await logoutUser();
                  }}
                  className="
                    h-11
                    px-5
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    rounded-xl
                    transition
                  "
                >
                  Logout
                </button>

              </div>

            ) : (

              <Link
                to="/login"
                className="
                  h-11
                  px-6
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  transition
                "
              >
                Login
              </Link>

            )}

          </div>

          {/* MOBILE BUTTON */}

          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
          >
            {mobileMenuOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>

        </div>

      </div>

      {/* MOBILE MENU */}

      {mobileMenuOpen && (

        <div className="lg:hidden border-t bg-white shadow-lg">

          <div className="max-w-7xl mx-auto px-6 py-6">

            <div className="grid gap-2">

              <NavLink
                to="/"
                className="px-4 py-3 rounded-xl hover:bg-blue-50"
                onClick={closeMobileMenu}
              >
                🏠 Home
              </NavLink>

              {/* CAREER */}

              <div className="border rounded-2xl p-2">

                <p className="px-3 py-2 font-semibold text-gray-500 text-sm">
                  CAREER
                </p>

                <NavLink
                  to="/careers"
                  className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  🎓 Career Explorer
                </NavLink>

                <NavLink
                  to="/professional-careers"
                  className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  💼 Professional Careers
                </NavLink>

                <NavLink
                  to="/career-assessment"
                  className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  🧠 Career Assessment
                </NavLink>

                <NavLink
                  to="/ai-recommendation"
                  className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  🤖 AI Recommendations
                </NavLink>

              </div>

              {/* EDUCATION */}

              <div className="border rounded-2xl p-2">

                <p className="px-3 py-2 font-semibold text-gray-500 text-sm">
                  EDUCATION
                </p>

                <NavLink
                  to="/colleges"
                  className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  🏫 Colleges
                </NavLink>

                <NavLink
                  to="/exams"
                  className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  📝 Entrance Exams
                </NavLink>

                <NavLink
                  to="/college-predictor"
                  className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  🎯 College Predictor
                </NavLink>

              </div>

              {/* OPPORTUNITIES */}

              <div className="border rounded-2xl p-2">

                <p className="px-3 py-2 font-semibold text-gray-500 text-sm">
                  OPPORTUNITIES
                </p>

                <NavLink
                  to="/companies"
                  className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  🏢 Companies
                </NavLink>

                <NavLink
                  to="/search"
                  className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  🔎 Find Opportunities
                </NavLink>

              </div>

              {/* TOOLS */}

              <div className="border rounded-2xl p-2">

                <p className="px-3 py-2 font-semibold text-gray-500 text-sm">
                  TOOLS
                </p>

                <NavLink
                  to="/resume-builder"
                  className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  📄 Resume Builder
                </NavLink>

                <NavLink
                  to="/chatbot"
                  className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  🤖 AI Mentor
                </NavLink>

                {compareList.length > 0 && (
                  <NavLink
                    to="/compare"
                    className="block px-4 py-3 rounded-xl hover:bg-blue-50"
                    onClick={closeMobileMenu}
                  >
                    ⚖️ Compare ({compareList.length})
                  </NavLink>
                )}

              </div>

              {/* DASHBOARD */}

              {user && (
                <NavLink
                  to="/dashboard"
                  className="px-4 py-3 rounded-xl hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  📊 Dashboard
                </NavLink>
              )}

              {/* AUTH */}

              {user ? (

                <button
                  onClick={async () => {
                    await logoutUser();
                    closeMobileMenu();
                  }}
                  className="
                    mt-2
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    py-3
                    rounded-xl
                  "
                >
                  Logout
                </button>

              ) : (

                <NavLink
                  to="/login"
                  className="
                    mt-2
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    text-center
                    py-3
                    rounded-xl
                  "
                  onClick={closeMobileMenu}
                >
                  Login
                </NavLink>

              )}

            </div>

          </div>

        </div>

      )}

    </nav>
  );
}

export default Navbar;
