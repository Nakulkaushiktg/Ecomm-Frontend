import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, rupee } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Checkout() {
  const { items, clear } = useCart();
  const { isAuthed, user } = useAuth();
  const navigate = useNavigate();
  const [cfg, setCfg] = useState({
    upi_id: "", upi_payee_name: "", cod_fee: 0, free_shipping_above: 0, enable_cod: true,
  });
  const [method, setMethod] = useState("cod"); // razorpay | cod
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [quote, setQuote] = useState(null);
  const [form, setForm] = useState({
    customer_name: "", phone: "", email: "",
    address: "", city: "", state: "", pincode: "", note: "",
    upi_txn_ref: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    api.get("/api/orders/config").then((r) => setCfg(r.data)).catch(() => {});
    api.get("/api/orders/coupons").then((r) => setAvailableCoupons(r.data)).catch(() => {});
  }, []);

  // prefill delivery details from the logged-in customer's saved profile
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      customer_name: f.customer_name || user.name || "",
      phone: f.phone || user.phone || "",
      email: f.email || user.email || "",
      address: f.address || user.address || "",
      city: f.city || user.city || "",
      state: f.state || user.state || "",
      pincode: f.pincode || user.pincode || "",
    }));
  }, [user]);

  // default to Razorpay (recommended) when it's available
  const [methodInit, setMethodInit] = useState(false);
  useEffect(() => {
    if (!methodInit && cfg.enable_razorpay) {
      setMethod("razorpay");
      setMethodInit(true);
    }
  }, [cfg.enable_razorpay]);

  // recompute shipping/COD/discount whenever cart, method or coupon changes
  useEffect(() => {
    if (items.length === 0) return;
    api
      .post("/api/orders/quote", {
        payment_method: method,
        coupon_code: appliedCoupon,
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      })
      .then((r) => setQuote(r.data))
      .catch(() => setQuote(null));
  }, [items, method, appliedCoupon]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-ink/60">Your cart is empty.</p>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-maroon">Please log in to checkout</h1>
        <p className="mt-2 text-sm text-ink/60">
          Log in or create an account to place your order and track it later.
        </p>
        <Link to="/login?redirect=/checkout" className="btn-primary mt-5 inline-block">
          Log In / Sign Up
        </Link>
      </div>
    );
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const grandTotal = quote?.total ?? 0;

  const cartItems = () =>
    items.map((i) => ({
      product_id: i.id,
      quantity: i.quantity,
      variant: i.variant || "",
      size: i.size || "",
      color: i.color || "",
    }));

  // place the order on the backend (used by COD/UPI directly, and by Razorpay after payment)
  const placeOrder = async (extra = {}) => {
    const payload = {
      ...form,
      payment_method: method,
      coupon_code: appliedCoupon,
      items: cartItems(),
      ...extra,
    };
    const { data } = await api.post("/api/orders", payload);
    clear();
    navigate(`/order/${data.order.id}`);
  };

  const payWithRazorpay = async () => {
    // 1. create a razorpay order on the backend
    const { data: rzp } = await api.post("/api/orders/razorpay/create", {
      payment_method: "razorpay",
      coupon_code: appliedCoupon,
      items: cartItems(),
    });
    // 2. open Razorpay checkout
    if (!window.Razorpay) {
      setError("Payment library failed to load. Please refresh and try again.");
      setSubmitting(false);
      return;
    }
    const rz = new window.Razorpay({
      key: rzp.razorpay_key_id,
      amount: rzp.amount,
      currency: rzp.currency,
      name: "Kirti Thread Art",
      description: "Order Payment",
      order_id: rzp.razorpay_order_id,
      prefill: { name: form.customer_name, contact: form.phone, email: form.email },
      theme: { color: "#7B2D26" },
      handler: async (resp) => {
        // 3. payment done -> create our order with verified payment details
        try {
          await placeOrder({
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          });
        } catch (err) {
          setError(err.response?.data?.detail || "Payment succeeded but order failed. Contact us.");
          setSubmitting(false);
        }
      },
      modal: { ondismiss: () => setSubmitting(false) },
    });
    rz.on("payment.failed", () => {
      setError("Payment failed or was cancelled. Please try again.");
      setSubmitting(false);
    });
    rz.open();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.customer_name || !form.phone || !form.address) {
      setError("Please fill name, phone and address.");
      return;
    }
    setSubmitting(true);
    try {
      if (method === "razorpay") {
        await payWithRazorpay(); // submitting cleared in handler/dismiss
        return;
      }
      await placeOrder();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not place order. Try again.");
    } finally {
      if (method !== "razorpay") setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl text-maroon">Checkout</h1>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* delivery details */}
        <div className="card p-6">
          <h2 className="font-serif text-xl text-maroon">Delivery Details</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input className="input" value={form.customer_name} onChange={set("customer_name")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Phone *</label>
                <input className="input" value={form.phone} onChange={set("phone")} />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" value={form.email} onChange={set("email")} />
              </div>
            </div>
            <div>
              <label className="label">Address *</label>
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
            <div>
              <label className="label">Note (optional)</label>
              <input className="input" value={form.note} onChange={set("note")} />
            </div>
          </div>
        </div>

        {/* payment + summary */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-serif text-xl text-maroon">Order Summary</h2>
            <div className="mt-4 space-y-2">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-ink/70">{i.name} × {i.quantity}</span>
                  <span>{rupee(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            {/* available coupons list */}
            {availableCoupons.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/50">
                  Available Offers — tap to apply
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableCoupons.map((c) => {
                    const active = appliedCoupon === c.code;
                    const toggle = () => {
                      if (active) {
                        setAppliedCoupon("");
                        setCoupon("");
                      } else {
                        setCoupon(c.code);
                        setAppliedCoupon(c.code);
                      }
                    };
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={toggle}
                        className={`relative rounded-lg border border-dashed px-3 py-2 pr-7 text-left text-xs transition ${
                          active
                            ? "border-maroon bg-maroon/5"
                            : "border-gold/60 hover:border-maroon"
                        }`}
                      >
                        <span className="block font-mono font-bold text-maroon">{c.code}</span>
                        <span className="text-ink/60">
                          {c.discount_percent}% off
                          {c.min_order > 0 ? ` · min ${rupee(c.min_order)}` : ""}
                        </span>
                        {active && (
                          <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-maroon text-[10px] text-cream">
                            ✕
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* coupon code input */}
            <div className="mt-4 flex gap-2">
              <input
                className="input"
                placeholder="Have a coupon code?"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              />
              <button
                type="button"
                onClick={() => setAppliedCoupon(coupon.trim())}
                className="btn-ghost whitespace-nowrap"
              >
                Apply
              </button>
            </div>
            {quote?.coupon_error && (
              <p className="mt-1 text-xs text-red-700">{quote.coupon_error}</p>
            )}
            {quote?.coupon_code && (
              <p className="mt-1 text-xs text-green-700">
                Coupon {quote.coupon_code} applied 🎉
              </p>
            )}

            <div className="mt-4 space-y-1.5 border-t border-sand pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/60">Subtotal</span>
                <span>{rupee(quote?.subtotal ?? 0)}</span>
              </div>
              {quote?.discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount ({quote.coupon_code})</span>
                  <span>− {rupee(quote.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ink/60">Delivery (Shiprocket)</span>
                <span>
                  {quote?.shipping_fee === 0 ? (
                    <span className="text-green-700">FREE</span>
                  ) : (
                    rupee(quote?.shipping_fee ?? 0)
                  )}
                </span>
              </div>
              {method === "cod" && (
                <div className="flex justify-between">
                  <span className="text-ink/60">COD Fee</span>
                  <span>{rupee(quote?.cod_fee ?? 0)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-sand pt-2 text-lg font-semibold">
                <span>Total</span>
                <span className="text-maroon">{rupee(grandTotal)}</span>
              </div>
              {cfg.free_shipping_above > 0 && quote?.shipping_fee > 0 && (
                <p className="pt-1 text-xs text-green-700">
                  Add {rupee(cfg.free_shipping_above - (quote?.subtotal ?? 0))} more for FREE delivery!
                </p>
              )}
            </div>
          </div>

          {/* payment method */}
          <div className="card p-6">
            <h2 className="font-serif text-xl text-maroon">Payment Method</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {cfg.enable_razorpay && (
                <button
                  type="button"
                  onClick={() => setMethod("razorpay")}
                  className={`col-span-2 rounded-xl border p-4 text-left ${
                    method === "razorpay" ? "border-maroon bg-maroon/5" : "border-sand"
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium">
                    Pay Online (Secure) <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">RECOMMENDED</span>
                  </div>
                  <div className="text-xs text-ink/50">UPI · Cards · Netbanking · Wallets — instant verified payment via Razorpay</div>
                </button>
              )}

              {cfg.enable_cod ? (
                <button
                  type="button"
                  onClick={() => setMethod("cod")}
                  className={`col-span-2 rounded-xl border p-4 text-left ${
                    method === "cod" ? "border-maroon bg-maroon/5" : "border-sand"
                  }`}
                >
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-xs text-ink/50">Pay when delivered (+{rupee(cfg.cod_fee)})</div>
                </button>
              ) : (
                <div
                  className="col-span-2 cursor-not-allowed rounded-xl border border-dashed border-sand bg-sand/30 p-4 text-left opacity-70"
                  title="Cash on Delivery is currently unavailable"
                >
                  <div className="font-medium text-ink/50 line-through">Cash on Delivery</div>
                  <div className="text-xs font-medium text-red-600">Currently Unavailable — please Pay Online</div>
                </div>
              )}
            </div>

            {method === "cod" ? (
              <p className="mt-4 rounded-lg bg-sand/50 p-3 text-sm text-ink/70">
                You'll pay <b>{rupee(grandTotal)}</b> in cash/UPI to the delivery agent
                when your order arrives. (Includes {rupee(cfg.cod_fee)} COD handling fee.)
              </p>
            ) : (
              <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-ink/70">
                🔒 You'll pay <b>{rupee(grandTotal)}</b> securely via Razorpay
                (UPI, cards, netbanking, wallets). Your order is confirmed
                <b> only after payment succeeds</b> — no manual reference needed.
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting
              ? "Processing…"
              : method === "razorpay"
              ? `Pay ${rupee(grandTotal)} Securely`
              : method === "cod"
              ? `Place Order · ${rupee(grandTotal)}`
              : `Place Order · ${rupee(grandTotal)}`}
          </button>
          <p className="text-center text-xs text-ink/50">
            We'll receive your order instantly and confirm on WhatsApp.
          </p>
        </div>
      </form>
    </div>
  );
}
