import { useParams } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";

const PAGES = {
  faq: {
    title: "Frequently Asked Questions",
    sections: [
      ["How do I place an order?", "Browse products, add to cart, and checkout. Fill your delivery details and pay online via Razorpay (UPI/cards/netbanking) or choose Cash on Delivery where available."],
      ["What payment methods do you accept?", "We accept secure online payments through Razorpay — UPI, debit/credit cards, netbanking and wallets. Cash on Delivery is available on select orders."],
      ["How long does delivery take?", "Orders are usually dispatched within 2–4 working days and delivered across India within 4–8 days, depending on your location."],
      ["Can I track my order?", "Yes! Visit the Track Order page and enter your Order ID and phone number to see live status."],
      ["Do you make custom pieces?", "Absolutely. We love custom orders — message us on WhatsApp or via the Contact Us page with your idea."],
      ["Are the products really handmade?", "Yes, every item is handcrafted by skilled artisans. Slight variations are natural and make each piece unique."],
    ],
  },
  shipping: {
    title: "Shipping & Returns",
    sections: [
      ["Shipping Charges", "Delivery is calculated by weight at checkout. Enjoy FREE delivery on orders above the threshold shown in your cart."],
      ["Delivery Time", "Dispatch in 2–4 working days; delivery in 4–8 days across India. You'll get a tracking ID once shipped."],
      ["Returns & Exchanges", "If your item arrives damaged or defective, contact us within 48 hours of delivery with photos and we'll arrange a replacement or refund."],
      ["Cancellations", "Orders can be cancelled before they are shipped. Reach out via Contact Us or WhatsApp as soon as possible."],
      ["Refunds", "Approved refunds are processed to your original payment method within 5–7 working days."],
    ],
  },
};

export default function Info() {
  const { page } = useParams();
  const data = PAGES[page] || PAGES.faq;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <span className="text-xs uppercase tracking-[0.3em] text-gold">Help &amp; Info</span>
      <h1 className="mt-1 font-serif text-4xl text-maroon md:text-5xl">{data.title}</h1>
      <div className="mt-4 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
      <div className="mt-8 space-y-4">
        {data.sections.map(([q, a], i) => (
          <Reveal key={q} delay={i * 60}>
            <div className="card hover-lift border-l-4 border-l-gold p-5">
              <h3 className="font-serif text-lg text-ink">{q}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">{a}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
