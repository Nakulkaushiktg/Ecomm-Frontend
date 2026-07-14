import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Account() {
  const { user, isAuthed, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
  });
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-ink/60">Please log in to view your account.</p>
        <Link to="/login?redirect=/account" className="btn-primary mt-4 inline-block">
          Log In
        </Link>
      </div>
    );
  }

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    setSaved(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await updateProfile(form);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not save. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* profile banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-maroon to-maroon-dark p-6 text-cream shadow-soft">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float rounded-full bg-gold/20 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gold text-2xl font-semibold text-ink shadow-soft">
              {(user?.name?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <h1 className="font-serif text-3xl">{user?.name?.split(" ")[0] || "My Account"}</h1>
              <p className="text-sm text-cream/70">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 text-sm">
            <Link to="/orders" className="font-medium text-gold-light hover:text-gold">
              My Orders →
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-cream/60 hover:text-cream"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="card mt-6 grid gap-4 p-6">
        <h2 className="font-serif text-xl text-maroon">Profile & Saved Address</h2>
        <div>
          <label className="label">Full Name</label>
          <input className="input" value={form.name} onChange={set("name")} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={set("phone")} />
        </div>
        <div>
          <label className="label">Address</label>
          <textarea className="input" rows={2} value={form.address} onChange={set("address")} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">City</label>
            <input className="input" value={form.city} onChange={set("city")} />
          </div>
          <div>
            <label className="label">State</label>
            <input className="input" value={form.state} onChange={set("state")} />
          </div>
          <div>
            <label className="label">Pincode</label>
            <input className="input" value={form.pincode} onChange={set("pincode")} />
          </div>
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {saved && <p className="text-sm text-green-700">Saved ✓</p>}

        <button type="submit" disabled={busy} className="btn-primary w-fit">
          {busy ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
