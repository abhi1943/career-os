import { useState } from "react";
import { loginUser } from "../../firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await loginUser(email, password);

      alert("Login Successful!");

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">

      <form
        onSubmit={handleLogin}
        className="bg-white rounded-3xl shadow-xl p-10 w-[420px]"
      >

        <h1 className="text-3xl font-bold mb-8">
          Login
        </h1>

        <input
          className="border w-full p-3 rounded-xl mb-5"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full p-3 rounded-xl mb-6"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white rounded-xl py-3"
        >
          Login
        </button>

        <p className="mt-5 text-center">

          Don't have an account?

          <Link
            to="/signup"
            className="text-blue-600 ml-2"
          >
            Signup
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;