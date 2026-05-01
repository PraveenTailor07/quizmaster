import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthFrame, Field } from "./Login.jsx";

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Create account" subtitle="Start tracking every quiz attempt.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorBanner message={error} />
        <Field label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
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
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-bold text-brand" to="/login">
            Login
          </Link>
        </p>
      </form>
    </AuthFrame>
  );
};
