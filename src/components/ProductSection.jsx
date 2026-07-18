import { Link } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import Reveal from "./Reveal.jsx";

// A titled row of up to 4 products. Renders nothing if there aren't enough.
export default function ProductSection({ eyebrow, title, products, viewAll }) {
  if (!products || products.length < 2) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</span>
          <h2 className="mt-1 font-serif text-4xl text-maroon">{title}</h2>
        </div>
        {viewAll && (
          <Link to={viewAll} className="group inline-flex items-center gap-1 text-sm font-medium text-maroon">
            View all
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {products.slice(0, 4).map((p, i) => (
          <Reveal key={p.id} delay={i * 70}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
