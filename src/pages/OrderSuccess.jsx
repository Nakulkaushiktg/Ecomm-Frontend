import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-4 py-24 text-center">
      {/* soft celebratory glow */}
      <div className="pointer-events-none absolute left-1/2 top-16 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl" />
      <div className="relative mx-auto grid h-24 w-24 animate-pop place-items-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-5xl text-white shadow-soft ring-4 ring-green-100">
        ✓
      </div>
      <h1 className="mt-8 font-serif text-4xl text-maroon">Thank you!</h1>
      <p className="mt-3 text-ink/70">
        Your order <b>#{id}</b> has been placed successfully. We’ve received your
        details and will confirm payment & delivery with you on WhatsApp shortly.
      </p>
      <p className="mt-2 text-sm text-ink/50">
        You can check your order status anytime on the{" "}
        <Link to="/track" className="text-maroon underline">Track Order</Link> page.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        <Link to="/" className="btn-ghost">Home</Link>
      </div>
    </div>
  );
}
