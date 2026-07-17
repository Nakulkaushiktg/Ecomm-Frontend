import { useState } from "react";
import { api } from "../api.js";

// Email capture band — stores subscriber + notifies owner.
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setBusy(true);
    try {
      await api.post("/api/orders/subscribe", { email });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-maroon to-maroon-dark px-6 py-12 text-center text-cream md:px-14">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-float rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-light">Join the family</span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl">Get updates & special offers ✨</h2>
          <p className="mx-auto mt-2 max-w-md text-cream/80">
            Be first to know about new handmade arrivals and exclusive discounts.
          </p>

          {done ? (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream/15 px-5 py-3 font-medium">
              🎉 Thank you for subscribing! We'll be in touch.
            </p>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-full border border-cream/30 bg-cream/10 px-5 py-3 text-sm text-cream placeholder-cream/50 outline-none focus:border-gold"
              />
              <button
                disabled={busy}
                className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-ink transition hover:bg-gold-light disabled:opacity-60"
              >
                {busy ? "…" : "Subscribe"}
              </button>
            </form>
          )}
          {error && <p className="mt-2 text-sm text-gold-light">{error}</p>}
        </div>
      </div>
    </section>
  );
}
