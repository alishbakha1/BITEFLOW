import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaUtensils } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF8F4] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl md:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0C3B2E] text-[#FFBA00]">
            <FaUtensils size={20} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-[#0C3B2E]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Log in to keep ordering from your favorite spots.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#FAF8F4] px-4 py-3 focus-within:border-[#0C3B2E]">
            <FaEnvelope className="text-[#0C3B2E]/50" />
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full bg-transparent text-sm text-[#0C3B2E] outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#FAF8F4] px-4 py-3 focus-within:border-[#0C3B2E]">
            <FaLock className="text-[#0C3B2E]/50" />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-transparent text-sm text-[#0C3B2E] outline-none placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#0C3B2E] py-3.5 text-sm font-bold text-white transition hover:bg-[#0a2f24] disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-[#0C3B2E] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;