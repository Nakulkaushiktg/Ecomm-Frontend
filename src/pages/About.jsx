import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <span className="text-xs uppercase tracking-[0.3em] text-gold">Our Story</span>
      <h1 className="mt-2 font-serif text-4xl text-maroon">Handmade with Devotion</h1>

      <div className="mt-6 space-y-5 leading-relaxed text-ink/75">
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

      <div className="mt-10 grid gap-4 sm:grid-cols-3 text-center">
        {[
          ["🪡", "Truly Handmade", "By skilled Indian artisans"],
          ["🌿", "Made with Care", "Small batches, real quality"],
          ["🤝", "Supporting Crafts", "Fair work for artisans"],
        ].map(([icon, t, s]) => (
          <div key={t} className="card p-6">
            <div className="text-3xl">{icon}</div>
            <h3 className="mt-2 font-serif text-lg text-maroon">{t}</h3>
            <p className="text-sm text-ink/60">{s}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/shop" className="btn-primary">Explore Our Collection</Link>
      </div>
    </div>
  );
}
