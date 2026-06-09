import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/account";

  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      if (mode === "forgot") {
        await api.post("/api/auth/forgot", { email: form.email });
        setInfo(
          "Request sent. The store will reset your password and share the new one with you (on your phone/email). Then log in and you can change it from your account."
        );
        return;
      }
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
          {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Forgot Password"}
        </h1>
        <p className="mt-1 text-center text-sm text-ink/50">
          {mode === "login"
            ? "Log in to checkout and track your orders"
            : mode === "signup"
            ? "Sign up to shop, save addresses, and review products"
            : "Enter your email — the store will help you reset it"}
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
          {mode !== "forgot" && (
            <div>
              <label className="label">Password *</label>
              <input
                type="password"
                className="input"
                value={form.password}
                onChange={set("password")}
                required
              />
              {mode === "login" && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setError(""); setInfo(""); }}
                    className="text-sm font-medium text-maroon hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-700">{error}</p>}
          {info && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{info}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Please wait…" : mode === "login" ? "Log In" : mode === "signup" ? "Sign Up" : "Send Reset Request"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink/60">
          {mode === "forgot" ? (
            <button
              onClick={() => { setMode("login"); setError(""); setInfo(""); }}
              className="font-semibold text-maroon hover:underline"
            >
              ← Back to login
            </button>
          ) : (
            <>
              {mode === "login" ? "New here? " : "Already have an account? "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError("");
                  setInfo("");
                }}
                className="font-semibold text-maroon hover:underline"
              >
                {mode === "login" ? "Create an account" : "Log in"}
              </button>
            </>
          )}
        </p>
        <p className="mt-2 text-center text-xs text-ink/40">
          <Link to="/" className="hover:underline">← Back to shop</Link>
        </p>
      </div>
    </div>
  );
}
