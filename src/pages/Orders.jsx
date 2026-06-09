import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, rupee } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Stars from "../components/Stars.jsx";

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function ReviewForm({ item }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!item.product_slug) {
    return <span className="text-xs text-ink/40">Product no longer available</span>;
  }

  if (done) {
    return <span className="text-xs font-medium text-green-700">Thanks for your review ✓</span>;
  }

  const submit = async () => {
    setError("");
    setBusy(true);
    try {
      await api.post(`/api/products/${item.product_slug}/reviews`, {
        name: "",
        rating,
        comment,
        image_url: "",
      });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not submit review.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-maroon/30 px-3 py-1 text-xs font-medium text-maroon hover:bg-maroon hover:text-cream"
      >
        ★ Rate & Review
      </button>
    );
  }

  return (
    <div className="mt-2 w-full rounded-lg border border-sand bg-sand/20 p-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-ink/60">Your rating:</span>
        <Stars value={rating} size="text-lg" onChange={setRating} />
      </div>
      <textarea
        className="input mt-2"
        rows={2}
        placeholder="Share your experience with this product…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button onClick={submit} disabled={busy} className="btn-primary px-4 py-1.5 text-sm">
          {busy ? "Submitting…" : "Submit Review"}
        </button>
        <button onClick={() => setOpen(false)} className="btn-ghost px-4 py-1.5 text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Orders() {
  const { isAuthed } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthed) return;
    api
      .get("/api/auth/orders")
      .then((r) => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthed]);

  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-ink/60">Please log in to see your orders.</p>
        <Link to="/login?redirect=/orders" className="btn-primary mt-4 inline-block">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-maroon">My Orders</h1>
        <Link to="/account" className="text-sm font-medium text-maroon hover:underline">
          ← Account
        </Link>
      </div>

      {loading ? (
        <p className="mt-10 text-ink/50">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-ink/60">You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn-primary mt-4 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sand pb-3">
                <div>
                  <span className="font-semibold text-maroon">Order #{o.id}</span>
                  <span className="ml-3 text-sm text-ink/50">
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    STATUS_STYLE[o.status] || "bg-sand text-ink/60"
                  }`}
                >
                  {o.status}
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {o.items.map((it) => (
                  <div key={it.id} className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm">
                      {it.product_slug ? (
                        <Link to={`/product/${it.product_slug}`} className="font-medium text-ink hover:text-maroon">
                          {it.product_name}
                        </Link>
                      ) : (
                        <span className="font-medium text-ink">{it.product_name}</span>
                      )}
                      <span className="text-ink/50">
                        {" "}× {it.quantity}
                        {it.variant ? ` · ${it.variant}` : ""}
                      </span>
                    </div>
                    {o.status === "delivered" ? (
                      <ReviewForm item={it} />
                    ) : (
                      <span className="text-xs text-ink/40">
                        Review after delivery
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-sand pt-3 text-sm">
                <span className="text-ink/50">
                  {o.payment_method === "cod" ? "Cash on Delivery" : "Paid Online"}
                  {o.tracking_id ? ` · ${o.courier} ${o.tracking_id}` : ""}
                </span>
                <span className="font-semibold text-maroon">{rupee(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
