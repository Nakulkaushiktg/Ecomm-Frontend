import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/account";

  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
      }
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <h1 className="text-center font-serif text-3xl text-maroon">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="mt-1 text-center text-sm text-ink/50">
          {mode === "login"
            ? "Log in to checkout and track your orders"
            : "Sign up to shop, save addresses, and review products"}
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          {mode === "signup" && (
            <div>
              <label className="label">Full Name *</label>
              <input className="input" value={form.name} onChange={set("name")} required />
            </div>
          )}
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={set("email")}
              required
            />
          </div>
          {mode === "signup" && (
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={set("phone")} />
            </div>
          )}
          <div>
            <label className="label">Password *</label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={set("password")}
              required
            />
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Please wait…" : mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink/60">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            className="font-semibold text-maroon hover:underline"
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
        <p className="mt-2 text-center text-xs text-ink/40">
          <Link to="/" className="hover:underline">← Back to shop</Link>
        </p>
      </div>
    </div>
  );
}
