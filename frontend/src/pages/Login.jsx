import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-center text-red-400">{error}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          No account?{" "}
          <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
            Register
          </a>
          
        </p>

      </div>
    </div>
  );
}