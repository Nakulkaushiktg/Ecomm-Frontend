import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Reveal className="text-center">
        <span className="gold-divider mb-3 text-xs uppercase tracking-[0.3em]">Our Story</span>
        <h1 className="font-serif text-4xl text-maroon md:text-5xl">Handmade with Devotion</h1>
      </Reveal>

      <div className="mt-8 space-y-5 text-center leading-relaxed text-ink/75">
        <p>
          Kirti Thread Art began with a simple belief — that things made by hand carry
          a warmth that machines can never replicate. Every shawl we weave, every idol
          we shape, and every bead we string is a small act of devotion.
        </p>
        <p>
          We work directly with skilled artisans across India — weavers, knitters,
          metal-smiths and jewellery makers — preserving traditional crafts and
          supporting their livelihoods. When you buy from us, you're not just buying a
          product; you're carrying home a piece of someone's craft and care.
        </p>
        <p>
          From cozy woolens for winter, to sacred idols for your home temple, to
          handcrafted cotton wear and ethnic jewellery — each piece is made in small
          batches, with love and intention. 🧶🪔
        </p>
        <p className="font-serif text-lg text-maroon">
          Thank you for being part of our journey.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3 text-center">
        {[
          ["🪡", "Truly Handmade", "By skilled Indian artisans"],
          ["🌿", "Made with Care", "Small batches, real quality"],
          ["🤝", "Supporting Crafts", "Fair work for artisans"],
        ].map(([icon, t, s], i) => (
          <Reveal key={t} delay={i * 100}>
            <div className="card hover-lift p-7">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sand text-3xl ring-1 ring-gold/30">
                {icon}
              </div>
              <h3 className="mt-4 font-serif text-lg text-maroon">{t}</h3>
              <p className="text-sm text-ink/60">{s}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link to="/shop" className="btn-primary">Explore Our Collection</Link>
      </div>
    </div>
  );
}
