import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);
    setError("");
    try {
      register(form);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-[#0C3B2E] mb-2">Create account</h1>
      <p className="text-gray-500 mb-8">Sign up to start ordering.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-[#0C3B2E] mb-1">Full name</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B2E]/20" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0C3B2E] mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B2E]/20" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0C3B2E] mb-1">Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B2E]/20" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0C3B2E] mb-1">Confirm password</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B2E]/20" />
        </div>

        <button type="submit" className="w-full rounded-full bg-[#FFBA00] py-3.5 text-sm font-bold text-[#0C3B2E] hover:bg-[#FFBA00]/90 transition">
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#0C3B2E] hover:underline">Log in</Link>
      </p>
    </div>
  );
}

export default Register;