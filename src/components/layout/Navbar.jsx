import {
Menu,
X,
ChevronDown,
Search,
Scale,
Bell,
} from "lucide-react";

import {
useContext,
useEffect,
useState,
} from "react";

import { CompareContext } from "../../context/CompareContext";

import Logo from "../common/Logo";

import {
NavLink,
useNavigate,
} from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import { logoutUser } from "../../firebase/auth";

function Navbar() {
const navigate = useNavigate();


const { compareList } = useContext(
    CompareContext
);

const { user } = useContext(
    AuthContext
);

const [
    mobileMenuOpen,
    setMobileMenuOpen,
] = useState(false);

const [
    notificationCount,
    setNotificationCount,
] = useState(0);

const [
    notificationOpen,
    setNotificationOpen,
] = useState(false);

const [
    notificationLoading,
    setNotificationLoading,
] = useState(false);

// ======================================================
// ACCESSIBLE NAV LINK CLASS
// ======================================================

const navLinkClass = ({
    isActive,
}) =>
    isActive
        ? "text-blue-600 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md"
        : "text-gray-700 hover:text-blue-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md";

// ======================================================
// ACCESSIBLE DROPDOWN LINK CLASS
// ======================================================

const dropdownLinkClass =
    "block px-4 py-3 rounded-xl hover:bg-blue-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset";

// ======================================================
// CLOSE MOBILE MENU
// ======================================================

const closeMobileMenu = () => {
    setMobileMenuOpen(false);
};

// ======================================================
// LOAD NOTIFICATION COUNT
// ======================================================

useEffect(() => {
    let cancelled = false;

    const loadNotificationCount = async () => {
        if (!user) {
            if (!cancelled) {
                setNotificationCount(0);
                setNotificationLoading(false);
                setNotificationOpen(false);
            }

            return;
        }

        try {
            if (!cancelled) {
                setNotificationLoading(true);
            }

            const userId =
                String(
                    user?.uid || ""
                ).trim();

            if (!userId) {
                if (!cancelled) {
                    setNotificationCount(0);
                    setNotificationLoading(false);
                }

                return;
            }

            // ==================================================
            // GET FIREBASE ID TOKEN
            // ==================================================

            const idToken =
                await user.getIdToken();

            if (!idToken) {
                if (!cancelled) {
                    setNotificationCount(0);
                }

                console.warn(
                    "CareerOS: Firebase ID token is missing."
                );

                return;
            }

            if (cancelled) {
                return;
            }

            // ==================================================
            // FETCH JOB ALERT STATS
            // ==================================================

            const response =
                await fetch(
                    "https://career-os-api-1h85.onrender.com/api/job-alerts/stats",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${idToken}`,

                            "Content-Type":
                                "application/json",
                        },
                    }
                );

            if (
                response.status === 401
            ) {
                if (!cancelled) {
                    setNotificationCount(0);
                }

                console.warn(
                    "CareerOS: Job alert authentication failed."
                );

                return;
            }

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch notification count (${response.status})`
                );
            }

            const data =
                await response.json();

            if (
                data?.success &&
                data?.stats
            ) {
                const count =
                    Number(
                        data.stats.enabled || 0
                    );

                if (!cancelled) {
                    setNotificationCount(
                        Number.isFinite(count)
                            ? count
                            : 0
                    );
                }
            } else {
                if (!cancelled) {
                    setNotificationCount(0);
                }
            }
        } catch (error) {
            if (
                error?.name ===
                "AbortError"
            ) {
                return;
            }

            console.error(
                "Notification Count Error:",
                error.message
            );

            if (!cancelled) {
                setNotificationCount(0);
            }
        } finally {
            if (!cancelled) {
                setNotificationLoading(false);
            }
        }
    };

    loadNotificationCount();

    const interval =
        setInterval(
            loadNotificationCount,
            60000
        );

    return () => {
        cancelled = true;
        clearInterval(interval);
    };
}, [user]);

// ======================================================
// LOGOUT
// ======================================================

const handleLogout = async () => {
    try {
        await logoutUser();

        setNotificationCount(0);
        setNotificationOpen(false);
        closeMobileMenu();

        navigate("/login", {
            replace: true,
        });
    } catch (error) {
        console.error(
            "Logout Error:",
            error
        );
    }
};

// ======================================================
// PUBLIC NAVBAR
// ======================================================

if (!user) {
    return (
        <nav
            className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
            aria-label="Public navigation"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="h-20 flex items-center justify-between">

                    {/* LOGO */}

                    <Logo />

                    {/* DESKTOP */}

                    <div className="hidden md:flex items-center gap-4">

                        <NavLink
                            to="/"
                            className={navLinkClass}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/login"
                            className="
                                px-5
                                py-2.5
                                rounded-xl
                                border
                                border-gray-200
                                text-gray-700
                                font-semibold
                                hover:bg-gray-50
                                transition
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-blue-500
                                focus-visible:ring-offset-2
                            "
                        >
                            Login
                        </NavLink>

                        <NavLink
                            to="/signup"
                            className="
                                px-5
                                py-2.5
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                font-semibold
                                transition
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-blue-500
                                focus-visible:ring-offset-2
                            "
                        >
                            Get Started
                        </NavLink>

                    </div>

                    {/* MOBILE */}

                    <button
                        type="button"
                        className="
                            md:hidden
                            p-2
                            rounded-xl
                            hover:bg-gray-100
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-blue-500
                            focus-visible:ring-offset-2
                        "
                        onClick={() =>
                            setMobileMenuOpen(
                                !mobileMenuOpen
                            )
                        }
                        aria-label={
                            mobileMenuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        aria-expanded={
                            mobileMenuOpen
                        }
                        aria-controls="public-mobile-navigation"
                    >
                        {mobileMenuOpen ? (
                            <X size={28} />
                        ) : (
                            <Menu size={28} />
                        )}
                    </button>

                </div>
            </div>

            {/* MOBILE PUBLIC MENU */}

            {mobileMenuOpen && (
                <div
                    id="public-mobile-navigation"
                    className="md:hidden border-t bg-white shadow-lg"
                    aria-label="Mobile navigation"
                >
                    <div className="max-w-7xl mx-auto px-6 py-5">

                        <div className="grid gap-2">

                            <NavLink
                                to="/"
                                className="
                                    px-4
                                    py-3
                                    rounded-xl
                                    hover:bg-blue-50
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-blue-500
                                    focus-visible:ring-inset
                                "
                                onClick={closeMobileMenu}
                            >
                                🏠 Home
                            </NavLink>

                            <NavLink
                                to="/login"
                                className="
                                    px-4
                                    py-3
                                    rounded-xl
                                    hover:bg-blue-50
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-blue-500
                                    focus-visible:ring-inset
                                "
                                onClick={closeMobileMenu}
                            >
                                🔐 Login
                            </NavLink>

                            <NavLink
                                to="/signup"
                                className="
                                    px-4
                                    py-3
                                    rounded-xl
                                    hover:bg-blue-50
                                    text-center
                                    bg-blue-600
                                    text-white
                                    font-semibold
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-blue-500
                                    focus-visible:ring-offset-2
                                "
                                onClick={closeMobileMenu}
                            >
                                🚀 Get Started
                            </NavLink>

                        </div>

                    </div>
                </div>
            )}

        </nav>
    );
}

// ======================================================
// AUTHENTICATED NAVBAR
// ======================================================

return (
    <nav
        className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
        aria-label="Main navigation"
    >
        <div className="max-w-7xl mx-auto px-6">

            <div className="h-20 flex items-center justify-between gap-6">

                {/* ==================================================
                    LOGO
                ================================================== */}

                <div className="flex-shrink-0">
                    <Logo />
                </div>

                {/* ==================================================
                    DESKTOP NAVIGATION
                ================================================== */}

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
                                type="button"
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    py-7
                                    text-gray-700
                                    hover:text-blue-600
                                    transition
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-blue-500
                                    focus-visible:ring-offset-2
                                    rounded-md
                                "
                                aria-haspopup="true"
                            >
                                Career

                                <ChevronDown
                                    size={16}
                                    aria-hidden="true"
                                    className="
                                        group-hover:rotate-180
                                        group-focus-within:rotate-180
                                        transition-transform
                                    "
                                />
                            </button>

                            <div
                                className="
                                    absolute
                                    left-1/2
                                    -translate-x-1/2
                                    top-full
                                    w-64
                                    bg-white
                                    rounded-2xl
                                    shadow-2xl
                                    border
                                    border-gray-100
                                    p-2
                                    opacity-0
                                    invisible
                                    pointer-events-none
                                    group-hover:opacity-100
                                    group-hover:visible
                                    group-hover:pointer-events-auto
                                    group-focus-within:opacity-100
                                    group-focus-within:visible
                                    group-focus-within:pointer-events-auto
                                    transition-all
                                    duration-200
                                    z-50
                                "
                            >

                                <NavLink
                                    to="/careers"
                                    className={dropdownLinkClass}
                                >
                                    🎓 Career Explorer
                                </NavLink>

                                <NavLink
                                    to="/professional-careers"
                                    className={dropdownLinkClass}
                                >
                                    💼 Professional Careers
                                </NavLink>

                                <NavLink
                                    to="/career-assessment"
                                    className={dropdownLinkClass}
                                >
                                    🎯 Career Finder
                                </NavLink>

                                <NavLink
                                    to="/ai-recommendation"
                                    className={dropdownLinkClass}
                                >
                                    🤖 AI Recommendations
                                </NavLink>

                            </div>

                        </li>

                        {/* EDUCATION */}

                        <li className="relative group">

                            <button
                                type="button"
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    py-7
                                    text-gray-700
                                    hover:text-blue-600
                                    transition
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-blue-500
                                    focus-visible:ring-offset-2
                                    rounded-md
                                "
                                aria-haspopup="true"
                            >
                                Education

                                <ChevronDown
                                    size={16}
                                    aria-hidden="true"
                                    className="
                                        group-hover:rotate-180
                                        group-focus-within:rotate-180
                                        transition-transform
                                    "
                                />
                            </button>

                            <div
                                className="
                                    absolute
                                    left-1/2
                                    -translate-x-1/2
                                    top-full
                                    w-60
                                    bg-white
                                    rounded-2xl
                                    shadow-2xl
                                    border
                                    border-gray-100
                                    p-2
                                    opacity-0
                                    invisible
                                    pointer-events-none
                                    group-hover:opacity-100
                                    group-hover:visible
                                    group-hover:pointer-events-auto
                                    group-focus-within:opacity-100
                                    group-focus-within:visible
                                    group-focus-within:pointer-events-auto
                                    transition-all
                                    duration-200
                                    z-50
                                "
                            >

                                <NavLink
                                    to="/colleges"
                                    className={dropdownLinkClass}
                                >
                                    🏫 Colleges
                                </NavLink>

                                <NavLink
                                    to="/exams"
                                    className={dropdownLinkClass}
                                >
                                    📝 Entrance Exams
                                </NavLink>

                                <NavLink
                                    to="/college-predictor"
                                    className={dropdownLinkClass}
                                >
                                    🎯 College Predictor
                                </NavLink>

                            </div>

                        </li>

                        {/* OPPORTUNITIES */}

                        <li className="relative group">

                            <button
                                type="button"
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    py-7
                                    text-gray-700
                                    hover:text-blue-600
                                    transition
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-blue-500
                                    focus-visible:ring-offset-2
                                    rounded-md
                                "
                                aria-haspopup="true"
                            >
                                Opportunities

                                <ChevronDown
                                    size={16}
                                    aria-hidden="true"
                                    className="
                                        group-hover:rotate-180
                                        group-focus-within:rotate-180
                                        transition-transform
                                    "
                                />
                            </button>

                            <div
                                className="
                                    absolute
                                    left-1/2
                                    -translate-x-1/2
                                    top-full
                                    w-64
                                    bg-white
                                    rounded-2xl
                                    shadow-2xl
                                    border
                                    border-gray-100
                                    p-2
                                    opacity-0
                                    invisible
                                    pointer-events-none
                                    group-hover:opacity-100
                                    group-hover:visible
                                    group-hover:pointer-events-auto
                                    group-focus-within:opacity-100
                                    group-focus-within:visible
                                    group-focus-within:pointer-events-auto
                                    transition-all
                                    duration-200
                                    z-50
                                "
                            >

                                <NavLink
                                    to="/jobs"
                                    className={dropdownLinkClass}
                                >
                                    💼 Jobs
                                </NavLink>

                                <NavLink
                                    to="/jobs/alerts"
                                    className={dropdownLinkClass}
                                >
                                    🔔 Job Alerts
                                </NavLink>

                                <NavLink
                                    to="/job-tracker"
                                    className={dropdownLinkClass}
                                >
                                    📋 Applications
                                </NavLink>

                                <NavLink
                                    to="/companies"
                                    className={dropdownLinkClass}
                                >
                                    🏢 Companies
                                </NavLink>

                                <NavLink
                                    to="/search"
                                    className={dropdownLinkClass}
                                >
                                    🔎 Find Opportunities
                                </NavLink>

                            </div>

                        </li>

                        {/* TOOLS */}

                        <li className="relative group">

                            <button
                                type="button"
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    py-7
                                    text-gray-700
                                    hover:text-blue-600
                                    transition
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-blue-500
                                    focus-visible:ring-offset-2
                                    rounded-md
                                "
                                aria-haspopup="true"
                            >
                                Tools

                                <ChevronDown
                                    size={16}
                                    aria-hidden="true"
                                    className="
                                        group-hover:rotate-180
                                        group-focus-within:rotate-180
                                        transition-transform
                                    "
                                />
                            </button>

                            <div
                                className="
                                    absolute
                                    left-1/2
                                    -translate-x-1/2
                                    top-full
                                    w-64
                                    bg-white
                                    rounded-2xl
                                    shadow-2xl
                                    border
                                    border-gray-100
                                    p-2
                                    opacity-0
                                    invisible
                                    pointer-events-none
                                    group-hover:opacity-100
                                    group-hover:visible
                                    group-hover:pointer-events-auto
                                    group-focus-within:opacity-100
                                    group-focus-within:visible
                                    group-focus-within:pointer-events-auto
                                    transition-all
                                    duration-200
                                    z-50
                                "
                            >

                                <NavLink
                                    to="/resume-builder"
                                    className={dropdownLinkClass}
                                >
                                    📄 Resume Builder
                                </NavLink>

                                <NavLink
                                    to="/portfolio"
                                    className={dropdownLinkClass}
                                >
                                    🌐 Portfolio Builder
                                </NavLink>

                                <NavLink
                                    to="/compare"
                                    className={dropdownLinkClass}
                                >
                                    ⚖️ Compare
                                </NavLink>

                                <NavLink
                                    to="/chatbot"
                                    className={dropdownLinkClass}
                                >
                                    🤖 AI Mentor
                                </NavLink>

                                <NavLink
                                    to="/chatboard"
                                    className={dropdownLinkClass}
                                >
                                    💬 Chatboard
                                </NavLink>

                            </div>

                        </li>

                        {/* DASHBOARD */}

                        <li>
                            <NavLink
                                to="/dashboard"
                                className={navLinkClass}
                            >
                                Dashboard
                            </NavLink>
                        </li>

                    </ul>

                </div>

                {/* ==================================================
                    RIGHT SIDE
                ================================================== */}

                <div className="hidden lg:flex items-center gap-3 flex-shrink-0">

                    {/* SEARCH */}

                    <NavLink
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
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-blue-500
                            focus-visible:ring-offset-2
                        "
                        aria-label="Search opportunities"
                    >
                        <Search
                            size={18}
                            aria-hidden="true"
                        />
                    </NavLink>

                    {/* COMPARE */}

                    {compareList.length > 0 && (
                        <NavLink
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
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-blue-500
                                focus-visible:ring-offset-2
                            "
                            aria-label={`Compare ${compareList.length} selected items`}
                        >
                            <Scale
                                size={18}
                                aria-hidden="true"
                            />

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
                                aria-hidden="true"
                            >
                                {compareList.length}
                            </span>
                        </NavLink>
                    )}

                    {/* NOTIFICATIONS */}

                    <div className="relative">

                        <button
                            type="button"
                            onClick={() =>
                                setNotificationOpen(
                                    !notificationOpen
                                )
                            }
                            className="
                                relative
                                h-11
                                w-11
                                border
                                border-gray-200
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                text-gray-700
                                hover:bg-gray-50
                                hover:border-blue-300
                                transition
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-blue-500
                                focus-visible:ring-offset-2
                            "
                            aria-label={
                                notificationOpen
                                    ? "Close notifications"
                                    : `Open notifications${notificationCount > 0
                                        ? `, ${notificationCount} active job alerts`
                                        : ""
                                    }`
                            }
                            aria-expanded={
                                notificationOpen
                            }
                            aria-haspopup="true"
                            aria-controls="notification-panel"
                        >
                            <Bell
                                size={19}
                                aria-hidden="true"
                                className={
                                    notificationCount > 0
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                }
                            />

                            {notificationCount > 0 && (
                                <span
                                    className="
                                        absolute
                                        -top-2
                                        -right-2
                                        min-w-5
                                        h-5
                                        px-1
                                        bg-red-500
                                        text-white
                                        text-xs
                                        font-bold
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        border-2
                                        border-white
                                    "
                                    aria-hidden="true"
                                >
                                    {notificationCount > 99
                                        ? "99+"
                                        : notificationCount}
                                </span>
                            )}
                        </button>

                        {/* NOTIFICATION POPUP */}

                        {notificationOpen && (
                            <div
                                id="notification-panel"
                                className="
                                    absolute
                                    right-0
                                    top-14
                                    w-80
                                    bg-white
                                    rounded-2xl
                                    shadow-2xl
                                    border
                                    border-gray-100
                                    overflow-hidden
                                    z-[100]
                                "
                                role="region"
                                aria-label="Notifications"
                            >

                                <div className="px-5 py-4 border-b bg-gray-50">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <h3 className="font-bold text-gray-900">
                                                Notifications
                                            </h3>

                                            <p className="text-xs text-gray-500 mt-1">
                                                {notificationCount > 0
                                                    ? `${notificationCount} notification${notificationCount === 1
                                                        ? ""
                                                        : "s"
                                                    }`
                                                    : "No new notifications"}
                                            </p>

                                        </div>

                                        <Bell
                                            size={20}
                                            aria-hidden="true"
                                            className="text-blue-600"
                                        />

                                    </div>

                                </div>

                                <div className="p-4">

                                    {notificationLoading ? (
                                        <div
                                            className="py-6 text-center text-sm text-gray-500"
                                            role="status"
                                            aria-live="polite"
                                        >
                                            Loading notifications...
                                        </div>
                                    ) : notificationCount > 0 ? (
                                        <div className="space-y-3">

                                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">

                                                <div className="flex items-start gap-3">

                                                    <div
                                                        className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
                                                        aria-hidden="true"
                                                    >
                                                        <Bell
                                                            size={17}
                                                            className="text-blue-600"
                                                        />
                                                    </div>

                                                    <div>

                                                        <p className="text-sm font-semibold text-blue-900">
                                                            New job notifications
                                                        </p>

                                                        <p className="text-xs text-blue-700 mt-1">
                                                            CareerOS is monitoring opportunities matching your job alerts.
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                            <NavLink
                                                to="/notifications"
                                                onClick={() =>
                                                    setNotificationOpen(false)
                                                }
                                                className="
                                                    block
                                                    w-full
                                                    text-center
                                                    px-4
                                                    py-3
                                                    bg-blue-600
                                                    hover:bg-blue-700
                                                    text-white
                                                    rounded-xl
                                                    font-semibold
                                                    transition
                                                    focus-visible:outline-none
                                                    focus-visible:ring-2
                                                    focus-visible:ring-blue-500
                                                    focus-visible:ring-offset-2
                                                "
                                            >
                                                View Notifications
                                            </NavLink>

                                        </div>
                                    ) : (
                                        <div className="py-5 text-center">

                                            <div
                                                className="
                                                    mx-auto
                                                    mb-3
                                                    h-12
                                                    w-12
                                                    rounded-full
                                                    bg-gray-100
                                                    flex
                                                    items-center
                                                    justify-center
                                                "
                                                aria-hidden="true"
                                            >
                                                <Bell
                                                    size={22}
                                                    className="text-gray-400"
                                                />
                                            </div>

                                            <p className="text-sm font-semibold text-gray-800">
                                                No new notifications
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                You are all caught up.
                                            </p>

                                            <NavLink
                                                to="/notifications"
                                                onClick={() =>
                                                    setNotificationOpen(false)
                                                }
                                                className="
                                                    inline-block
                                                    mt-4
                                                    px-4
                                                    py-2.5
                                                    border
                                                    border-gray-200
                                                    hover:bg-gray-50
                                                    text-gray-700
                                                    rounded-xl
                                                    text-sm
                                                    font-semibold
                                                    transition
                                                    focus-visible:outline-none
                                                    focus-visible:ring-2
                                                    focus-visible:ring-blue-500
                                                    focus-visible:ring-offset-2
                                                "
                                            >
                                                View Notifications
                                            </NavLink>

                                        </div>
                                    )}

                                </div>

                            </div>
                        )}

                    </div>

                    {/* USER */}

                    <div className="hidden xl:block text-right">

                        <p className="text-sm font-semibold text-gray-800">
                            {user.email?.split("@")[0]}
                        </p>

                        <p className="text-xs text-gray-500">
                            Logged in
                        </p>

                    </div>

                    {/* LOGOUT */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            h-11
                            px-5
                            bg-red-500
                            hover:bg-red-600
                            text-white
                            rounded-xl
                            transition
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-red-500
                            focus-visible:ring-offset-2
                        "
                    >
                        Logout
                    </button>

                </div>

                {/* MOBILE BUTTON */}

                <button
                    type="button"
                    className="
                        lg:hidden
                        p-2
                        rounded-xl
                        hover:bg-gray-100
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-blue-500
                        focus-visible:ring-offset-2
                    "
                    onClick={() =>
                        setMobileMenuOpen(
                            !mobileMenuOpen
                        )
                    }
                    aria-label={
                        mobileMenuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={
                        mobileMenuOpen
                    }
                    aria-controls="authenticated-mobile-navigation"
                >
                    {mobileMenuOpen ? (
                        <X
                            size={28}
                            aria-hidden="true"
                        />
                    ) : (
                        <Menu
                            size={28}
                            aria-hidden="true"
                        />
                    )}
                </button>

            </div>
        </div>

        {/* ======================================================
            MOBILE AUTHENTICATED MENU
        ====================================================== */}

        {mobileMenuOpen && (
            <div
                id="authenticated-mobile-navigation"
                className="lg:hidden border-t bg-white shadow-lg"
                aria-label="Mobile navigation"
            >
                <div className="max-w-7xl mx-auto px-6 py-6">

                    <div className="grid gap-2">

                        <NavLink
                            to="/"
                            className="
                                px-4
                                py-3
                                rounded-xl
                                hover:bg-blue-50
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-blue-500
                                focus-visible:ring-inset
                            "
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
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                🎓 Career Explorer
                            </NavLink>

                            <NavLink
                                to="/professional-careers"
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                💼 Professional Careers
                            </NavLink>

                            <NavLink
                                to="/career-assessment"
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                🎯 Career Finder
                            </NavLink>

                            <NavLink
                                to="/ai-recommendation"
                                className={dropdownLinkClass}
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
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                🏫 Colleges
                            </NavLink>

                            <NavLink
                                to="/exams"
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                📝 Entrance Exams
                            </NavLink>

                            <NavLink
                                to="/college-predictor"
                                className={dropdownLinkClass}
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
                                to="/jobs"
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                💼 Jobs
                            </NavLink>

                            <NavLink
                                to="/jobs/alerts"
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                🔔 Job Alerts
                            </NavLink>

                            <NavLink
                                to="/job-tracker"
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                📋 Applications
                            </NavLink>

                            <NavLink
                                to="/companies"
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                🏢 Companies
                            </NavLink>

                            <NavLink
                                to="/search"
                                className={dropdownLinkClass}
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
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                📄 Resume Builder
                            </NavLink>

                            <NavLink
                                to="/portfolio"
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                🌐 Portfolio Builder
                            </NavLink>

                            <NavLink
                                to="/compare"
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                ⚖️ Compare ({compareList.length})
                            </NavLink>

                            <NavLink
                                to="/chatbot"
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                🤖 AI Mentor
                            </NavLink>

                            <NavLink
                                to="/chatboard"
                                className={dropdownLinkClass}
                                onClick={closeMobileMenu}
                            >
                                💬 Chatboard
                            </NavLink>

                        </div>

                        {/* NOTIFICATIONS */}

                        <NavLink
                            to="/notifications"
                            className="
                                flex
                                items-center
                                justify-between
                                px-4
                                py-3
                                rounded-xl
                                hover:bg-blue-50
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-blue-500
                                focus-visible:ring-inset
                            "
                            onClick={closeMobileMenu}
                        >
                            <span className="flex items-center gap-3">
                                <Bell
                                    size={18}
                                    aria-hidden="true"
                                />
                                Notifications
                            </span>

                            {notificationCount > 0 && (
                                <span
                                    className="
                                        min-w-6
                                        h-6
                                        px-1.5
                                        bg-red-500
                                        text-white
                                        text-xs
                                        font-bold
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                    "
                                    aria-label={`${notificationCount} notifications`}
                                >
                                    {notificationCount > 99
                                        ? "99+"
                                        : notificationCount}
                                </span>
                            )}
                        </NavLink>

                        {/* DASHBOARD */}

                        <NavLink
                            to="/dashboard"
                            className="
                                px-4
                                py-3
                                rounded-xl
                                hover:bg-blue-50
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-blue-500
                                focus-visible:ring-inset
                            "
                            onClick={closeMobileMenu}
                        >
                            📊 Dashboard
                        </NavLink>

                        {/* LOGOUT */}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="
                                mt-2
                                bg-red-500
                                hover:bg-red-600
                                text-white
                                py-3
                                rounded-xl
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-red-500
                                focus-visible:ring-offset-2
                            "
                        >
                            Logout
                        </button>

                    </div>

                </div>
            </div>
        )}

    </nav>
);
}

export default Navbar;
