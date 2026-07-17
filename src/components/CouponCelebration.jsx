import { useEffect } from "react";
import { rupee } from "../api.js";
import Confetti from "./Confetti.jsx";

// Zoom-in celebration overlay shown when a coupon is successfully applied.
export default function CouponCelebration({ amount, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
      style={{ animation: "fadeIn .2s ease" }}
    >
      <Confetti count={55} />
      <div className="animate-pop mx-auto max-w-xs rounded-3xl bg-cream p-8 text-center shadow-2xl ring-1 ring-gold/40">
        <div className="text-6xl">🎉</div>
        <h3 className="mt-3 font-serif text-2xl text-maroon">Congratulations!</h3>
        <p className="mt-1 text-sm text-ink/60">You saved</p>
        <p className="font-serif text-5xl font-bold text-green-700">{rupee(amount)}</p>
        <p className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          Coupon applied ✓
        </p>
      </div>
    </div>
  );
}
