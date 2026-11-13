import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mb-3 text-3xl font-black text-brand">emilo.</div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm muted">{subtitle}</p>
        </div>
        <div className="card p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
export function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { acceptAuth } = useAuth();
  const nav = useNavigate();
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 3)
      return setError("Name must be at least 3 characters");
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return setError("Enter a valid email");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");
    try {
      setBusy(true);
      const { data } = await api.post("/auth/register", form);
      acceptAuth(data);
      nav("/");
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the conversation and meet your community"
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-semibold">
          Name
          <input
            className="field mt-1.5"
            name="name"
            value={form.name}
            onChange={change}
            placeholder="Your name"
            required
            minLength="3"
          />
        </label>
        <label className="block text-sm font-semibold">
          Email
          <input
            className="field mt-1.5"
            type="email"
            name="email"
            value={form.email}
            onChange={change}
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            className="field mt-1.5"
            type="password"
            name="password"
            value={form.password}
            onChange={change}
            placeholder="At least 6 characters"
            required
            minLength="6"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="btn btn-primary w-full">
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm muted">
        Already a member?{" "}
        <Link className="font-bold text-brand" to="/login">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
export function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { acceptAuth } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setBusy(true);
      const { data } = await api.post("/auth/login", form);
      acceptAuth(data);
      nav("/");
    } catch (e) {
      setError(e.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthLayout title="Welcome back" subtitle="Log in to see what's happening">
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-semibold">
          Email
          <input
            className="field mt-1.5"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            className="field mt-1.5"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength="6"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="btn btn-primary w-full">
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm muted">
        New here?{" "}
        <Link className="font-bold text-brand" to="/register">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
