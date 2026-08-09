import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";

function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        setError("");

        if (!form.name.trim()) {
            return setError("Please enter your name.");
        }

        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match.");
        }

        if (form.password.length < 6) {
            return setError("Password must be at least 6 characters.");
        }

        try {
            setLoading(true);

            await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <section className="min-h-screen bg-slate-100 flex justify-center items-center p-6">

            <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-10">

                <h1 className="text-4xl font-bold text-center text-blue-700">
                    CareerOS
                </h1>

                <p className="text-center text-gray-500 mt-3">
                    Create your account
                </p>

                <form
                    onSubmit={handleSignup}
                    className="space-y-5 mt-8"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    {error && (
                        <div className="bg-red-100 text-red-600 rounded-xl p-3">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700 transition"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <p className="text-center mt-8">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-blue-600 font-semibold ml-2"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </section>
    );
}

export default Signup;