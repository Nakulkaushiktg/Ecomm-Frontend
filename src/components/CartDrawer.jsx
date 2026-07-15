import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { api, rupee } from "../api.js";

// Slide-in mini cart from the right. Opened via the navbar cart button.
export default function CartDrawer() {
  const { items, setQty, remove, total, drawerOpen, closeCart } = useCart();
  const navigate = useNavigate();
  const [freeAbove, setFreeAbove] = useState(0);

  useEffect(() => {
    api
      .get("/api/orders/config")
      .then((r) => setFreeAbove(r.data.free_shipping_above || 0))
      .catch(() => {});
  }, []);

  const remaining = freeAbove > 0 ? Math.max(0, freeAbove - total) : 0;
  const progress = freeAbove > 0 ? Math.min(100, (total / freeAbove) * 100) : 0;

  // lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [drawerOpen]);

  const go = (path) => {
    closeCart();
    navigate(path);
  };

  return (
    <>
      {/* backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[90] bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* panel */}
      <aside
        className={`fixed right-0 top-0 z-[91] flex h-full w-[88vw] max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sand px-5 py-4">
          <h2 className="font-serif text-xl text-maroon">
            Your Cart {items.length > 0 && <span className="text-ink/40">· {items.length}</span>}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-ink/50 hover:bg-sand hover:text-maroon"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="text-5xl">🛒</div>
            <p className="text-ink/60">Your cart is empty.</p>
            <button onClick={() => go("/shop")} className="btn-primary">Browse Products</button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((i) => (
                <div key={i.key} className="flex gap-3 rounded-xl bg-white p-3 shadow-soft ring-1 ring-sand/60">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-sand">
                    {i.image && <img src={i.image} alt={i.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-serif text-sm text-ink">{i.name}</h3>
                    {i.variant && <p className="text-xs text-ink/50">{i.variant}</p>}
                    <p className="text-sm font-semibold text-maroon">{rupee(i.price)}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-sand text-sm">
                        <button
                          onClick={() => (i.quantity === 1 ? remove(i.key) : setQty(i.key, i.quantity - 1))}
                          className="px-2.5 py-0.5 text-maroon"
                        >
                          –
                        </button>
                        <span className="w-6 text-center text-xs">{i.quantity}</span>
                        <button
                          onClick={() => setQty(i.key, i.quantity + 1)}
                          disabled={i.stock != null && i.quantity >= i.stock}
                          className="px-2.5 py-0.5 text-maroon disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(i.key)}
                        className="text-xs text-ink/40 hover:text-maroon"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="shrink-0 text-right text-sm font-semibold text-ink">
                    {rupee(i.price * i.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-sand px-5 py-4">
              {/* free-shipping progress */}
              {freeAbove > 0 && (
                <div className="mb-3 rounded-xl bg-sand/50 p-3">
                  <p className="text-xs text-ink/70">
                    {remaining > 0 ? (
                      <>Add <b className="text-maroon">{rupee(remaining)}</b> more for <b>FREE</b> delivery 🚚</>
                    ) : (
                      <span className="font-medium text-green-700">🎉 You've unlocked FREE delivery!</span>
                    )}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-maroon transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-ink/60">Subtotal</span>
                <span className="font-semibold text-maroon">{rupee(total)}</span>
              </div>
              <p className="mt-1 text-xs text-ink/40">Shipping & offers calculated at checkout.</p>
              <button onClick={() => go("/checkout")} className="btn-primary mt-4 w-full">
                Checkout
              </button>
              <button onClick={() => go("/cart")} className="btn-ghost mt-2 w-full">
                View full cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
