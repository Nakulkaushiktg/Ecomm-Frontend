import { useState } from "react";
import { api, rupee } from "../api.js";

const STEPS = ["pending", "paid", "shipped", "delivered"];
const LABEL = {
  pending: "Order Placed",
  paid: "Payment Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);

  const track = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLive(null);
    setLoading(true);
    try {
      const { data } = await api.post("/api/orders/track", {
        order_id: Number(orderId),
        phone,
      });
      setOrder(data);
      // fetch live courier tracking if an AWB/tracking id exists
      if (data.tracking_id) {
        setLiveLoading(true);
        api
          .get(`/api/orders/track-live?awb=${encodeURIComponent(data.tracking_id)}`)
          .then((r) => setLive(r.data))
          .catch(() => {})
          .finally(() => setLiveLoading(false));
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Order not found.");
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = order
    ? order.status === "cancelled"
      ? -1
      : STEPS.indexOf(order.status)
    : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl text-maroon">Track Your Order</h1>
      <p className="mt-2 text-ink/60">
        Enter your Order ID and the phone number used at checkout.
      </p>

      <form onSubmit={track} className="card mt-6 flex flex-wrap items-end gap-3 p-6">
        <div className="flex-1">
          <label className="label">Order ID</label>
          <input
            className="input"
            placeholder="e.g. 12"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="label">Phone Number</label>
          <input
            className="input"
            placeholder="10-digit number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button disabled={loading} className="btn-primary">
          {loading ? "Checking…" : "Track"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {order && (
        <div className="card mt-6 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-maroon">Order #{order.id}</h2>
            <span className="text-sm text-ink/50">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>

          {order.status === "cancelled" ? (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">
              This order was cancelled.
            </p>
          ) : (
            <div className="mt-6 flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    {i > 0 && (
                      <div className={`h-1 flex-1 ${i <= stepIndex ? "bg-maroon" : "bg-sand"}`} />
                    )}
                    <div
                      className={`grid h-9 w-9 place-items-center rounded-full text-sm ${
                        i <= stepIndex ? "bg-maroon text-cream" : "bg-sand text-ink/40"
                      }`}
                    >
                      {i <= stepIndex ? "✓" : i + 1}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-1 flex-1 ${i < stepIndex ? "bg-maroon" : "bg-sand"}`} />
                    )}
                  </div>
                  <span className="mt-2 text-center text-xs text-ink/60">{LABEL[s]}</span>
                </div>
              ))}
            </div>
          )}

          {order.tracking_id && (
            <div className="mt-6 rounded-lg bg-sand/50 p-3 text-sm">
              <p>Courier: <b>{order.courier || "—"}</b></p>
              <p>Tracking ID: <span className="font-mono">{order.tracking_id}</span></p>
              <a
                href={`https://www.shiprocket.in/shipment-tracking/${order.tracking_id}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-maroon hover:underline"
              >
                Track shipment ↗
              </a>
            </div>
          )}

          {/* live courier tracking from Shiprocket */}
          {order.tracking_id && (
            <div className="mt-4">
              {liveLoading && <p className="text-sm text-ink/50">Fetching live courier status…</p>}
              {live?.summary && (
                <div className="rounded-lg bg-maroon px-4 py-3 text-sm font-medium text-cream">
                  📦 Courier status: {live.summary}
                </div>
              )}
              {live?.timeline?.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-3 font-semibold text-ink/70">Live Tracking</h3>
                  <ol className="relative border-l-2 border-sand pl-5">
                    {live.timeline.map((t, i) => (
                      <li key={i} className="mb-4">
                        <span
                          className={`absolute -left-[7px] mt-1 grid h-3 w-3 place-items-center rounded-full ${
                            i === 0 ? "bg-maroon" : "bg-gold"
                          }`}
                        />
                        <p className="text-sm font-medium text-ink">{t.status || "Update"}</p>
                        <p className="text-xs text-ink/50">
                          {[t.location, t.date].filter(Boolean).join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {live && !live.summary && live.timeline?.length === 0 && (
                <p className="text-xs text-ink/50">
                  Live courier updates will appear here once the courier scans your shipment.
                </p>
              )}
            </div>
          )}

          <div className="mt-6 border-t border-sand pt-4 text-sm">
            <h3 className="mb-2 font-semibold text-ink/70">Items</h3>
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between py-1">
                <span>{it.product_name} × {it.quantity}</span>
                <span>{rupee(it.price * it.quantity)}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-sand pt-2 font-semibold">
              <span>Total ({order.payment_method.toUpperCase()})</span>
              <span className="text-maroon">{rupee(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
