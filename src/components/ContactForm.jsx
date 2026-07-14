import { useState } from "react";
import { api } from "../api.js";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.message.trim()) {
      setError("Please enter your name and message.");
      return;
    }
    setSending(true);
    try {
      await api.post("/api/orders/contact", form); // emails the owner automatically
      setDone(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Could not send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-sand/60">
      <div className="grid md:grid-cols-5">
        {/* left accent panel */}
        <div className="relative overflow-hidden bg-gradient-to-br from-maroon to-maroon-dark p-7 text-cream md:col-span-2">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float rounded-full bg-gold/20 blur-2xl" />
          <span className="relative text-xs uppercase tracking-[0.25em] text-gold-light">
            We're here for you
          </span>
          <h3 className="mt-2 font-serif text-2xl">Get in Touch</h3>
          <p className="mt-3 text-sm text-cream/80">
            Questions about a product, your order, or a custom handmade piece?
            Send us a message — we usually reply within a day. 💛
          </p>
          <div className="mt-6 space-y-2 text-sm text-cream/90">
            <p>🪔 Kirti Thread Art</p>
            <p>🧶 Woolen · Sacred · Crafted</p>
          </div>
        </div>

        {/* form */}
        <form onSubmit={submit} className="p-7 md:col-span-3">
          {done ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-green-100 text-2xl">✓</div>
              <h4 className="mt-3 font-serif text-xl text-maroon">Message Sent!</h4>
              <p className="mt-1 text-sm text-ink/60">
                Thank you for reaching out. We've received your message and will get
                back to you soon. 💛
              </p>
              <button onClick={() => setDone(false)} className="btn-ghost mt-5">Send another</button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Name *</label>
                  <input className="input" value={form.name} onChange={set("name")} />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={set("phone")} />
                </div>
              </div>
              <div className="mt-4">
                <label className="label">Email</label>
                <input className="input" value={form.email} onChange={set("email")} />
              </div>
              <div className="mt-4">
                <label className="label">Message *</label>
                <textarea className="input" rows={4} value={form.message} onChange={set("message")} />
              </div>
              {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
              <button disabled={sending} className="btn-primary mt-5 w-full sm:w-auto">
                {sending ? "Sending…" : "Send Message"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
