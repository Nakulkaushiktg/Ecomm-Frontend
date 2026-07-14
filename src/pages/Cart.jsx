import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { rupee } from "../api.js";

export default function Cart() {
  const { items, setQty, remove, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-maroon">Your cart is empty</h1>
        <p className="mt-2 text-ink/60">Add some handmade treasures to begin.</p>
        <Link to="/shop" className="btn-primary mt-6">Browse Products</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <span className="text-xs uppercase tracking-[0.3em] text-gold">Review &amp; Checkout</span>
      <h1 className="mt-1 font-serif text-4xl text-maroon">Your Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((i) => (
            <div key={i.key} className="card flex items-center gap-4 p-4 transition hover:ring-gold/40">
              <div className="h-20 w-20 overflow-hidden rounded-lg bg-sand">
                {i.image && <img src={i.image} alt={i.name} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-ink">{i.name}</h3>
                {i.variant && <p className="text-xs text-ink/50">{i.variant}</p>}
                <p className="text-sm text-maroon">{rupee(i.price)}</p>
                {i.stock != null && i.quantity >= i.stock && (
                  <p className="text-xs text-orange-600">Only {i.stock} in stock</p>
                )}
              </div>
              <div className="flex items-center rounded-full border border-sand">
                <button onClick={() => setQty(i.key, i.quantity - 1)} className="px-3 py-1.5">–</button>
                <span className="w-7 text-center text-sm">{i.quantity}</span>
                <button
                  onClick={() => setQty(i.key, i.quantity + 1)}
                  disabled={i.stock != null && i.quantity >= i.stock}
                  className="px-3 py-1.5 disabled:opacity-40"
                >+</button>
              </div>
              <div className="w-20 text-right font-semibold text-ink">
                {rupee(i.price * i.quantity)}
              </div>
              <button onClick={() => remove(i.key)} className="text-ink/40 hover:text-maroon" title="Remove">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6 lg:sticky lg:top-28">
          <h3 className="font-serif text-xl text-maroon">Order Summary</h3>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-ink/60">Subtotal</span>
            <span>{rupee(total)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-ink/60">Delivery</span>
            <span className="text-green-700">Calculated on confirm</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-sand pt-4 text-lg font-semibold">
            <span>Total</span>
            <span className="text-maroon">{rupee(total)}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink/50">
            🔒 Secure UPI & card payment
          </p>
        </div>
      </div>
    </div>
  );
}
