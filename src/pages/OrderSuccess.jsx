import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-4xl">
        ✓
      </div>
      <h1 className="mt-6 font-serif text-4xl text-maroon">Thank you!</h1>
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
