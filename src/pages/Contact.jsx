import ContactForm from "../components/ContactForm.jsx";

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">Contact Us</span>
        <h1 className="mt-2 font-serif text-4xl text-maroon">We'd Love to Hear From You</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink/60">
          Have a question about a product, an order, or want a custom handmade piece?
          Drop us a message and we'll get back to you.
        </p>
      </div>
      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
