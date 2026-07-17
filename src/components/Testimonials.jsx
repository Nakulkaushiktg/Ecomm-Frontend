import { useEffect, useState } from "react";
import { api } from "../api.js";
import Stars from "./Stars.jsx";
import Reveal from "./Reveal.jsx";

// Continuous horizontal marquee of real customer reviews (multiple cards visible).
export default function Testimonials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/api/orders/testimonials").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  if (items.length === 0) return null;

  // make sure there are enough cards to fill the row, then duplicate for a seamless loop
  let base = items;
  while (base.length < 6) base = [...base, ...items];
  const row = [...base, ...base];

  return (
    <section className="overflow-hidden bg-sand/40 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <Reveal>
          <span className="gold-divider mb-3 text-xs uppercase tracking-[0.3em]">Loved by customers</span>
          <h2 className="font-serif text-4xl text-maroon">What They're Saying</h2>
        </Reveal>
      </div>

      <div className="mt-10 flex w-max animate-marquee gap-5 hover:[animation-play-state:paused]">
        {row.map((r, i) => (
          <div
            key={i}
            className="w-72 shrink-0 rounded-2xl bg-white p-6 text-left shadow-soft ring-1 ring-sand/60"
          >
            <Stars value={r.rating} size="text-base" />
            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink/75">{r.comment}</p>
            <p className="mt-4 font-serif text-maroon">{r.name}</p>
            {r.product_name && <p className="text-xs text-ink/50">on {r.product_name}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
