import ContactForm from "../components/ContactForm.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Reveal className="text-center">
        <span className="gold-divider mb-3 text-xs uppercase tracking-[0.3em]">Contact Us</span>
        <h1 className="font-serif text-4xl text-maroon md:text-5xl">We'd Love to Hear From You</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink/60">
          Have a question about a product, an order, or want a custom handmade piece?
          Drop us a message and we'll get back to you.
        </p>
      </Reveal>
      <Reveal delay={120} className="mt-10">
        <ContactForm />
      </Reveal>
    </div>
  );
}
