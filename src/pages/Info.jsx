import { useParams } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";

const PAGES = {
  faq: {
    title: "Frequently Asked Questions",
    sections: [
      ["How do I place an order?", "Browse our collection, add items to your cart, and proceed to checkout. Fill in your delivery details and pay securely online via Razorpay (UPI, cards, netbanking, wallets) — or choose Cash on Delivery where available."],
      ["What payment methods do you accept?", "We accept secure online payments through Razorpay — UPI, debit & credit cards, netbanking and wallets. Cash on Delivery (COD) is available on select orders (a small COD fee may apply)."],
      ["How long does delivery take?", "Orders are usually dispatched within 2–4 working days and delivered across India within 4–8 working days, depending on your location. You'll receive a tracking ID once your order ships."],
      ["Can I track my order?", "Yes! Visit the Track Order page and enter your Order ID and the phone number used at checkout to see live status. Registered customers can also see all orders under My Orders."],
      ["Do you make custom / personalised pieces?", "Absolutely — we love custom orders! Message us on WhatsApp or via Contact Us with your idea (colour, size, name, design) and our artisans will bring it to life."],
      ["Are the products really handmade?", "Yes. Every item is lovingly handcrafted by skilled Indian artisans. Slight variations in colour, size or texture are natural and make each piece truly one-of-a-kind."],
      ["How do I earn rewards?", "Earn 1 reward point on every order above ₹1000. Collect 5 points and claim a free handmade gift at checkout on your next order — our little thank you. 💛"],
      ["How do I care for my products?", "Most woolen and handmade items are best hand-washed gently in cold water and air-dried in shade. Care details, where applicable, are mentioned on the product page."],
    ],
  },
  shipping: {
    title: "Shipping Policy",
    sections: [
      ["Shipping Charges", "Delivery charges are calculated by weight and shown at checkout before you pay. Enjoy FREE delivery on orders above the threshold displayed in your cart."],
      ["Dispatch & Delivery Time", "Orders are dispatched within 2–4 working days. Delivery typically takes 4–8 working days across India, depending on your pincode. Custom/made-to-order pieces may take longer — we'll keep you posted."],
      ["Order Tracking", "Once shipped, you'll receive a tracking ID (via WhatsApp/email). Use the Track Order page anytime to check your order's live status."],
      ["Delivery Areas", "We deliver Pan-India. In rare cases of non-serviceable pincodes, our team will reach out to arrange an alternative or a full refund."],
      ["Delays", "Occasionally, deliveries may be delayed due to weather, courier issues or festive rush. We appreciate your patience and are always a WhatsApp message away."],
    ],
  },
  refund: {
    title: "Refund, Return & Cancellation Policy",
    sections: [
      ["Cancellations", "Orders can be cancelled any time before they are shipped — just reach out via Contact Us or WhatsApp as soon as possible. Once shipped, an order cannot be cancelled."],
      ["Returns & Exchanges", "If your item arrives damaged, defective, or incorrect, please contact us within 48 hours of delivery with photos/video. We'll arrange a replacement or refund at no extra cost."],
      ["Non-Returnable Items", "As our products are handmade and often personalised, we do not accept returns for reasons of change of mind, minor natural variations, or custom-made pieces (unless they arrive damaged or defective)."],
      ["Refund Process", "Once your return/cancellation is approved, refunds are processed to your original payment method within 5–7 working days. COD orders are refunded via UPI/bank transfer."],
      ["How to Request", "To request a return, refund or cancellation, message us on WhatsApp or use the Contact Us page with your Order ID and details. We're here to help. 💛"],
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      ["Information We Collect", "We collect only what's needed to serve you — your name, phone, email, and delivery address at checkout, and account details if you sign up. Payment details are handled securely by Razorpay; we never see or store your card/UPI credentials."],
      ["How We Use It", "Your information is used to process and deliver orders, provide support, send order updates, and (if you subscribe) share offers. We do not sell or rent your personal data to anyone."],
      ["Payments & Security", "All online payments are processed through Razorpay over secure, encrypted connections. Passwords are stored encrypted and can never be viewed by us or anyone else."],
      ["Cookies & Analytics", "We may use basic cookies and privacy-friendly analytics to understand how our store is used and improve your experience. This data is aggregated and never identifies you personally."],
      ["Your Choices", "You can update your details from My Account, unsubscribe from emails anytime, or request deletion of your account by contacting us."],
      ["Contact", "Questions about your privacy? Reach us via the Contact Us page or WhatsApp — we're happy to help."],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    sections: [
      ["Welcome", "By using the Kirti Thread Art website and placing an order, you agree to these terms. Please read them along with our Privacy, Shipping and Refund policies."],
      ["Products & Pricing", "As our items are handmade, slight variations in colour, size and texture are natural. We strive for accurate images and descriptions, but actual products may vary slightly. Prices are in INR and may change without notice; the price shown at checkout applies to your order."],
      ["Orders & Payment", "An order is confirmed once payment is successful (or placed for COD where available). We reserve the right to cancel any order due to stock issues, pricing errors, or suspected fraud, with a full refund where applicable."],
      ["Rewards & Gifts", "Loyalty points and gifts are offered at our discretion and may change or be withdrawn at any time. Points and gifts have no cash value and cannot be transferred."],
      ["Intellectual Property", "All content, images, and designs on this site belong to Kirti Thread Art and may not be copied or reused without permission."],
      ["Contact", "For any questions about these terms, please reach out via the Contact Us page or WhatsApp."],
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
