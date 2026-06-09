import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useCategories } from "../context/CategoriesContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

const CAT_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#D4ECE6"/><text x="50%" y="50%" font-size="22" fill="#3E7CA5" text-anchor="middle" dominant-baseline="middle" font-family="serif">Kirti Thread Art</text></svg>'
  );

export default function Home() {
  const { categories } = useCategories();
  const [featured, setFeatured] = useState([]);
  const [ownerWa, setOwnerWa] = useState("");

  useEffect(() => {
    api
      .get("/api/products", { params: { featured: true } })
      .then((r) => setFeatured(r.data))
      .catch(() => {});
    api.get("/api/orders/config").then((r) => setOwnerWa(r.data.owner_whatsapp)).catch(() => {});
  }, []);

  const customWa = `https://wa.me/${ownerWa}?text=${encodeURIComponent(
    "Hi Kirti Thread Art! 🙏 I'd like to order a custom handmade piece. Here are my details:"
  )}`;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-maroon text-cream">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,#FBC4A6_0,transparent_45%),radial-gradient(circle_at_80%_60%,#9FD8CF_0,transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-3 text-xs uppercase tracking-[0.3em] text-gold-light">
              Handmade with devotion
            </span>
            <h1 className="font-serif text-4xl leading-tight md:text-6xl">
              Woolen warmth &amp; sacred craft, made by hand.
            </h1>
            <p className="mt-5 max-w-md text-cream/80">
              Discover handwoven woolens, pure cotton wear, divine idols and
              sacred jewellery — crafted by Indian artisans, delivered to your
              door.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/shop" className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-ink hover:bg-gold-light">
                Shop Collection
              </Link>
              <Link to="/shop/god" className="rounded-full border border-cream/40 px-7 py-3 text-sm font-semibold hover:bg-cream/10">
                Sacred Idols
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1520903074185-8eca362b3dce?w=900"
              alt="Handmade woolens"
              className="h-full w-full rounded-3xl object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center font-serif text-3xl text-maroon">
          Shop by Category
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.key}
              to={`/shop/${c.key}`}
              className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="aspect-square overflow-hidden bg-sand">
                <img
                  src={c.image || CAT_PLACEHOLDER}
                  alt={c.label}
                  onError={(e) => (e.currentTarget.src = CAT_PLACEHOLDER)}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <span className="block p-4 text-center font-serif text-lg text-ink">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif text-3xl text-maroon">Featured Picks</h2>
          <Link to="/shop" className="text-sm font-medium text-maroon hover:underline">
            View all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-ink/50">No products yet. Add some from the admin panel.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Custom orders CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-maroon px-8 py-12 text-cream md:px-14 md:py-16">
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_85%_20%,#FBC4A6_0,transparent_40%),radial-gradient(circle_at_10%_90%,#9FD8CF_0,transparent_40%)]" />
          <div className="relative grid items-center gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <span className="text-xs uppercase tracking-[0.3em] text-gold-light">
                Made just for you
              </span>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                We craft custom handmade pieces ✨
              </h2>
              <p className="mt-3 max-w-xl text-cream/80">
                Want a special colour, size, name, or a one-of-a-kind design — woolen
                wear, idols, or jewellery made to order? Tell us your idea on WhatsApp
                and our artisans will bring it to life.
              </p>
            </div>
            <div className="md:text-right">
              <a
                href={customWa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-7 py-3.5 text-sm font-semibold text-white shadow-soft hover:bg-green-600"
              >
                💬 Message us on WhatsApp
              </a>
              <p className="mt-2 text-xs text-cream/60">Reach out for custom orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="bg-sand/50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 text-center sm:grid-cols-3">
          {[
            ["🪡", "Truly Handmade", "Crafted by skilled artisans"],
            ["🔒", "Easy UPI Payment", "PhonePe · Paytm · GPay"],
            ["🚚", "Pan-India Delivery", "Order confirmed on WhatsApp"],
          ].map(([icon, t, s]) => (
            <div key={t}>
              <div className="text-3xl">{icon}</div>
              <h4 className="mt-2 font-serif text-lg text-maroon">{t}</h4>
              <p className="text-sm text-ink/60">{s}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
