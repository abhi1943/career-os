
import {
    useEffect,
    useState,
} from "react";

import {
    Eye,
    EyeOff,
    BriefcaseBusiness,
    GraduationCap,
    Target,
} from "lucide-react";

import {
    loginUser,
    resetPassword,
} from "../../firebase/auth";

import {
    useNavigate,
    Link,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();

    const {
        isAuthenticated,
        authLoading,
    } = useAuth();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [loginError, setLoginError] =
        useState("");

    const [showForgotPassword, setShowForgotPassword] =
        useState(false);

    const [resetEmail, setResetEmail] =
        useState("");

    const [resetLoading, setResetLoading] =
        useState(false);

    const [resetMessage, setResetMessage] =
        useState("");

    const [resetError, setResetError] =
        useState("");

    // ======================================================
    // AUTHENTICATED REDIRECT
    // ======================================================

    useEffect(() => {
        if (
            !authLoading &&
            isAuthenticated
        ) {
            navigate("/dashboard", {
                replace: true,
            });
        }
    }, [
        authLoading,
        isAuthenticated,
        navigate,
    ]);

    // ======================================================
    // LOGIN
    // ======================================================

    async function handleLogin(e) {
        e.preventDefault();

        setLoginError("");

        if (!email.trim()) {
            setLoginError(
                "Please enter your email address."
            );

            return;
        }

        if (!password) {
            setLoginError(
                "Please enter your password."
            );

            return;
        }

        try {
            setLoading(true);

            await loginUser(
                email.trim(),
                password
            );

            navigate("/dashboard");
        } catch (err) {
            console.error(
                "CareerOS login error:",
                err
            );

            let message;

            switch (err?.code) {
                case "auth/invalid-credential":
                    message =
                        "Incorrect email or password. Please try again.";
                    break;

                case "auth/wrong-password":
                    message =
                        "Incorrect password. Please try again.";
                    break;

                case "auth/user-not-found":
                    message =
                        "No account was found with this email address.";
                    break;

                case "auth/invalid-email":
                    message =
                        "Please enter a valid email address.";
                    break;

                case "auth/user-disabled":
                    message =
                        "This account has been disabled. Please contact support.";
                    break;

                case "auth/too-many-requests":
                    message =
                        "Too many login attempts. Please try again later.";
                    break;

                case "auth/network-request-failed":
                    message =
                        "Network error. Please check your internet connection and try again.";
                    break;

                default:
                    message =
                        "Unable to login. Please check your details and try again.";
            }

            setLoginError(message);
        } finally {
            setLoading(false);
        }
    }

    // ======================================================
    // FORGOT PASSWORD
    // ======================================================

    async function handleForgotPassword(e) {
        e.preventDefault();

        setResetError("");
        setResetMessage("");

        if (!resetEmail.trim()) {
            setResetError(
                "Please enter your email address."
            );

            return;
        }

        try {
            setResetLoading(true);

            await resetPassword(
                resetEmail.trim()
            );

            setResetMessage(
                "Password reset email sent. Please check your inbox."
            );

            setResetEmail("");
        } catch (err) {
            console.error(
                "CareerOS password reset error:",
                err
            );

            let message;

            switch (err?.code) {
                case "auth/user-not-found":
                    message =
                        "No account was found with this email address.";
                    break;

                case "auth/invalid-email":
                    message =
                        "Please enter a valid email address.";
                    break;

                case "auth/too-many-requests":
                    message =
                        "Too many requests. Please try again later.";
                    break;

                case "auth/network-request-failed":
                    message =
                        "Network error. Please check your internet connection and try again.";
                    break;

                default:
                    message =
                        "Unable to send password reset email. Please try again.";
            }

            setResetError(message);
        } finally {
            setResetLoading(false);
        }
    }

    // ======================================================
    // AUTH LOADING
    // ======================================================

    if (authLoading) {
        return (
            <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center px-4">
                <div className="text-center">

                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 mb-4">
                        <GraduationCap
                            size={32}
                        />
                    </div>

                    <h1 className="text-2xl font-bold text-blue-700">
                        CareerOS
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Checking your session...
                    </p>

                </div>
            </section>
        );
    }

    // ======================================================
    // FORGOT PASSWORD PAGE
    // ======================================================

    if (showForgotPassword) {
        return (
            <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center px-4 py-10">

                <div className="w-full max-w-md">

                    {/* BRAND */}

                    <div className="text-center mb-8">

                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 mb-4">
                            <GraduationCap
                                size={32}
                            />
                        </div>

                        <h1 className="text-3xl font-bold text-blue-700">
                            CareerOS
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Your Career Journey Starts Here
                        </p>

                    </div>

                    {/* RESET CARD */}

                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 p-8 sm:p-10">

                        <h2 className="text-2xl font-bold text-slate-900">
                            Forgot Password?
                        </h2>

                        <p className="text-slate-500 mt-3 leading-6">
                            Enter the email address
                            associated with your
                            CareerOS account and
                            we'll send you a
                            password reset link.
                        </p>

                        <form
                            onSubmit={
                                handleForgotPassword
                            }
                            className="mt-7"
                        >

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={resetEmail}
                                onChange={(e) =>
                                    setResetEmail(
                                        e.target.value
                                    )
                                }
                                disabled={
                                    resetLoading
                                }
                                autoComplete="email"
                                className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 transition"
                            />

                            {resetMessage && (
                                <div className="mt-4 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                                    {
                                        resetMessage
                                    }
                                </div>
                            )}

                            {resetError && (
                                <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {
                                        resetError
                                    }
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={
                                    resetLoading
                                }
                                className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl py-3.5 font-semibold shadow-lg shadow-blue-200 transition"
                            >
                                {resetLoading
                                    ? "Sending..."
                                    : "Send Reset Link"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForgotPassword(
                                        false
                                    );

                                    setResetEmail(
                                        ""
                                    );

                                    setResetMessage(
                                        ""
                                    );

                                    setResetError(
                                        ""
                                    );
                                }}
                                className="w-full mt-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl py-3.5 font-semibold transition"
                            >
                                Back to Login
                            </button>

                        </form>

                    </div>

                </div>

            </section>
        );
    }

    // ======================================================
    // LOGIN PAGE
    // ======================================================

    return (
        <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-6xl">

                <div className="grid lg:grid-cols-2 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/70 overflow-hidden border border-slate-100">

                    {/* ==================================================
                        LEFT BRANDING SECTION
                    ================================================== */}

                    <div className="hidden lg:flex relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white p-12 xl:p-16 flex-col justify-between overflow-hidden">

                        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10" />

                        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/10" />

                        <div className="relative z-10">

                            <div className="flex items-center gap-3">

                                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                    <GraduationCap
                                        size={28}
                                    />
                                </div>

                                <div>

                                    <h1 className="text-3xl font-bold">
                                        CareerOS
                                    </h1>

                                    <p className="text-blue-100 text-sm">
                                        Your Career Journey Starts Here
                                    </p>

                                </div>

                            </div>

                            <div className="mt-16">

                                <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
                                    Build the career
                                    <br />
                                    you deserve.
                                </h2>

                                <p className="text-blue-100 mt-6 text-lg leading-7 max-w-md">
                                    Discover opportunities,
                                    explore careers and
                                    take control of your
                                    professional journey
                                    with CareerOS.
                                </p>

                            </div>

                            <div className="mt-10 space-y-5">

                                <div className="flex items-center gap-4">

                                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                                        <Target
                                            size={22}
                                        />
                                    </div>

                                    <div>

                                        <p className="font-semibold">
                                            Personalized Career Guidance
                                        </p>

                                        <p className="text-blue-100 text-sm">
                                            Find paths that match your goals
                                        </p>

                                    </div>

                                </div>

                                <div className="flex items-center gap-4">

                                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                                        <BriefcaseBusiness
                                            size={22}
                                        />
                                    </div>

                                    <div>

                                        <p className="font-semibold">
                                            Jobs & Internships
                                        </p>

                                        <p className="text-blue-100 text-sm">
                                            Discover opportunities in one place
                                        </p>

                                    </div>

                                </div>

                                <div className="flex items-center gap-4">

                                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                                        <GraduationCap
                                            size={22}
                                        />
                                    </div>

                                    <div>

                                        <p className="font-semibold">
                                            Grow Your Future
                                        </p>

                                        <p className="text-blue-100 text-sm">
                                            Plan and track your career journey
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <p className="relative z-10 text-blue-100 text-sm mt-10">
                            Start today. Build tomorrow.
                        </p>

                    </div>

                    {/* ==================================================
                        RIGHT LOGIN SECTION
                    ================================================== */}

                    <div className="p-8 sm:p-10 lg:p-12 xl:p-16">

                        {/* MOBILE BRAND */}

                        <div className="lg:hidden text-center mb-8">

                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 mb-3">
                                <GraduationCap
                                    size={28}
                                />
                            </div>

                            <h1 className="text-3xl font-bold text-blue-700">
                                CareerOS
                            </h1>

                            <p className="text-slate-500 text-sm mt-1">
                                Your Career Journey Starts Here
                            </p>

                        </div>

                        <div className="mb-8">

                            <p className="text-blue-600 font-semibold text-sm mb-2">
                                WELCOME BACK
                            </p>

                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                                Welcome back! 👋
                            </h2>

                            <p className="text-slate-500 mt-3">
                                Login to continue your
                                CareerOS journey.
                            </p>

                        </div>

                        <form
                            onSubmit={
                                handleLogin
                            }
                            className="space-y-5"
                        >

                            {/* EMAIL */}

                            <div>

                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(
                                            e.target.value
                                        );

                                        if (
                                            loginError
                                        ) {
                                            setLoginError(
                                                ""
                                            );
                                        }
                                    }}
                                    disabled={
                                        loading
                                    }
                                    autoComplete="email"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 transition"
                                />

                            </div>

                            {/* PASSWORD */}

                            <div>

                                <div className="flex justify-between items-center mb-2">

                                    <label className="block text-sm font-semibold text-slate-700">
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setResetEmail(
                                                email
                                            );

                                            setShowForgotPassword(
                                                true
                                            );
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                                    >
                                        Forgot Password?
                                    </button>

                                </div>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={
                                            password
                                        }
                                        onChange={(e) => {
                                            setPassword(
                                                e.target.value
                                            );

                                            if (
                                                loginError
                                            ) {
                                                setLoginError(
                                                    ""
                                                );
                                            }
                                        }}
                                        disabled={
                                            loading
                                        }
                                        autoComplete="current-password"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3.5 pr-12 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 transition"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 disabled:opacity-50 transition"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                size={
                                                    20
                                                }
                                            />
                                        ) : (
                                            <Eye
                                                size={
                                                    20
                                                }
                                            />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* LOGIN ERROR */}

                            {loginError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-sm">
                                    {
                                        loginError
                                    }
                                </div>
                            )}

                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl py-3.5 font-semibold shadow-lg shadow-blue-200 transition"
                            >
                                {loading
                                    ? "Signing In..."
                                    : "Login"}
                            </button>

                        </form>

                        {/* SIGNUP */}

                        <p className="text-center mt-7 text-slate-600">

                            Don't have an account?

                            <Link
                                to="/signup"
                                className="text-blue-600 hover:text-blue-700 font-semibold ml-2"
                            >
                                Create an account
                            </Link>

                        </p>

                        {/* BOTTOM MESSAGE */}

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">

                            <p className="text-xs text-slate-400">
                                Your next opportunity could
                                be one login away.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Login;
  
