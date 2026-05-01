import React from "react";
import { Brain } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Welcome back" subtitle="Sign in to continue your quiz streak.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorBanner message={error} />
        <Field label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
        />
        <button
          type="submit"
          disabled={loading}
          className="focus-ring w-full rounded bg-brand px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="text-center text-sm text-slate-500">
          New to QuizMaster?{" "}
          <Link className="font-bold text-brand" to="/register">
            Create account
          </Link>
        </p>
      </form>
    </AuthFrame>
  );
};

export const AuthFrame = ({ title, subtitle, children }) => (
  <div className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
    <div className="w-full max-w-md rounded border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded bg-brand text-white">
          <Brain size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-950">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  </div>
);

export const Field = ({ label, value, onChange, type = "text" }) => (
  <label className="block">
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="focus-ring mt-2 w-full rounded border border-slate-300 px-3 py-3 text-slate-900"
      required
    />
  </label>
);
