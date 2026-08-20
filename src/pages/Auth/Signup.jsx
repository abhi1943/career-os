import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    Eye,
    EyeOff,
} from "lucide-react";

import {
    signupUser,
} from "../../firebase/auth";

function Signup() {
    const navigate =
        useNavigate();

    const [form, setForm] =
        useState({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    // ======================================================
    // HANDLE INPUT CHANGE
    // ======================================================

    const handleChange = (e) => {
        setForm({
            ...form,

            [e.target.name]:
                e.target.value,
        });

        if (error) {
            setError("");
        }
    };

    // ======================================================
    // FIREBASE ERROR MESSAGE
    // ======================================================

    const getFirebaseErrorMessage = (
        err
    ) => {
        switch (err?.code) {
            case "auth/email-already-in-use":
                return (
                    "An account with this email already exists. Please login instead."
                );

            case "auth/invalid-email":
                return (
                    "Please enter a valid email address."
                );

            case "auth/weak-password":
                return (
                    "Password is too weak. Please use at least 6 characters."
                );

            case "auth/operation-not-allowed":
                return (
                    "Email/password signup is currently disabled. Please contact support."
                );

            case "auth/network-request-failed":
                return (
                    "Network error. Please check your internet connection and try again."
                );

            case "auth/too-many-requests":
                return (
                    "Too many requests. Please try again later."
                );

            default:
                return (
                    "Unable to create your account. Please try again."
                );
        }
    };

    // ======================================================
    // HANDLE SIGNUP
    // ======================================================

    const handleSignup = async (e) => {
        e.preventDefault();

        setError("");

        // --------------------------------------------------
        // NAME VALIDATION
        // --------------------------------------------------

        if (!form.name.trim()) {
            setError(
                "Please enter your name."
            );

            return;
        }

        // --------------------------------------------------
        // EMAIL VALIDATION
        // --------------------------------------------------

        if (!form.email.trim()) {
            setError(
                "Please enter your email address."
            );

            return;
        }

        // --------------------------------------------------
        // PASSWORD VALIDATION
        // --------------------------------------------------

        if (!form.password) {
            setError(
                "Please enter a password."
            );

            return;
        }

        if (form.password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );

            return;
        }

        // --------------------------------------------------
        // CONFIRM PASSWORD
        // --------------------------------------------------

        if (!form.confirmPassword) {
            setError(
                "Please confirm your password."
            );

            return;
        }

        if (
            form.password !==
            form.confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );

            return;
        }

        // --------------------------------------------------
        // CREATE FIREBASE ACCOUNT
        // --------------------------------------------------

        try {
            setLoading(true);

            await signupUser(
                form.name.trim(),
                form.email.trim(),
                form.password
            );

            // --------------------------------------------------
            // SUCCESS
            // --------------------------------------------------

            navigate("/dashboard");
        } catch (err) {
            console.error(
                "CareerOS signup error:",
                err
            );

            setError(
                getFirebaseErrorMessage(
                    err
                )
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // UI
    // ======================================================

    return (
        <section className="min-h-screen bg-slate-100 flex justify-center items-center p-6">

            <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-10">

                {/* Logo / Title */}
                <h1 className="text-4xl font-bold text-center text-blue-700">
                    CareerOS
                </h1>

                <p className="text-center text-gray-500 mt-3">
                    Create your account
                </p>

                {/* Signup Form */}
                <form
                    onSubmit={
                        handleSignup
                    }
                    className="space-y-5 mt-8"
                >

                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={
                            form.name
                        }
                        onChange={
                            handleChange
                        }
                        disabled={loading}
                        autoComplete="name"
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={
                            form.email
                        }
                        onChange={
                            handleChange
                        }
                        disabled={loading}
                        autoComplete="email"
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                    />

                    {/* Password */}
                    <div className="relative">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            placeholder="Password"
                            value={
                                form.password
                            }
                            onChange={
                                handleChange
                            }
                            disabled={loading}
                            autoComplete="new-password"
                            className="w-full border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (
                                        previous
                                    ) =>
                                        !previous
                                )
                            }
                            disabled={
                                loading
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
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

                    {/* Confirm Password */}
                    <div className="relative">

                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={
                                form.confirmPassword
                            }
                            onChange={
                                handleChange
                            }
                            disabled={loading}
                            autoComplete="new-password"
                            className="w-full border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(
                                    (
                                        previous
                                    ) =>
                                        !previous
                                )
                            }
                            disabled={
                                loading
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            aria-label={
                                showConfirmPassword
                                    ? "Hide confirm password"
                                    : "Show confirm password"
                            }
                        >
                            {showConfirmPassword ? (
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

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Create Account */}
                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="w-full bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition font-semibold"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* Login Link */}
                <p className="text-center mt-8 text-gray-600">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-blue-600 font-semibold ml-2 hover:text-blue-700"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </section>
    );
}

export default Signup;
