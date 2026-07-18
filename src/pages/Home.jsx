import { Link } from "react-router-dom";
import { useCategories } from "../context/CategoriesContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ProductGridSkeleton } from "../components/Loader.jsx";
import Reveal from "../components/Reveal.jsx";
import Testimonials from "../components/Testimonials.jsx";
import InstagramStrip from "../components/InstagramStrip.jsx";
import Newsletter from "../components/Newsletter.jsx";
import ProductSection from "../components/ProductSection.jsx";
import StatsBand from "../components/StatsBand.jsx";
import useCachedGet from "../hooks/useCachedGet.js";

export default function Home() {
  const { categories } = useCategories();
  // cached — instant on return visits
  const { data: featuredData, loading: featuredLoading } = useCachedGet("/api/products?featured=true");
  const featured = featuredData || [];
  const { data: cfg } = useCachedGet("/api/orders/config");
  const ownerWa = cfg?.owner_whatsapp || "";
  // all products (cached) → derive flag-based rows
  const { data: allData } = useCachedGet("/api/products");
  const all = allData || [];
  const newArrivals = all.filter((p) => p.is_new);
  const trending = all.filter((p) => p.is_trending);
  const bestsellers = all.filter((p) => p.is_bestseller);

  const customWa = `https://wa.me/${ownerWa}?text=${encodeURIComponent(
    "Hi Kirti Thread Art! 🙏 I'd like to order a custom handmade piece. Here are my details:"
  )}`;

  // Get default display price for a product (first variant if exists, else base price)
  const getDisplayPrice = (p) => {
    if (p.variants?.length) {
      const first = p.variants[0];
      return {
        price: first.price > 0 ? first.price : p.price,
        mrp: first.mrp > 0 ? first.mrp : p.mrp,
      };
    }
    return { price: p.price, mrp: p.mrp };
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-maroon via-maroon to-maroon-dark text-cream">
        {/* floating gold glow */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-float rounded-full bg-gold/20 blur-3xl" />
        <div
          className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 animate-float rounded-full bg-gold-light/10 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,#E8C77E_0,transparent_45%),radial-gradient(circle_at_80%_60%,#C39A4B_0,transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-24 md:grid-cols-2 md:py-32">
          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-gold-light">
              ✦ Handmade with devotion
            </span>
            <h1 className="font-serif text-5xl leading-[1.05] md:text-7xl">
              Woolen warmth &amp; <span className="text-gradient-gold">sacred craft</span>, made by hand.
            </h1>
            <p className="mt-6 max-w-md text-lg text-cream/80">
              Discover handwoven woolens, pure cotton wear, divine idols and
              sacred jewellery — crafted by Indian artisans, delivered to your
              door.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-ink shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
              >
                Shop Collection
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <a
                href={customWa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-8 py-3.5 text-sm font-semibold text-cream transition duration-300 hover:border-cream hover:bg-cream/10"
              >
                Custom Order
              </a>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div
              className="pointer-events-none absolute inset-4 animate-float rounded-[2.2rem] border border-gold/30"
              style={{ animationDelay: "1s" }}
            />
            <img
              src="/home.png"
              alt="Handmade woolens"
              className="relative h-64 w-full rounded-[2rem] object-cover shadow-2xl ring-1 ring-gold/20 sm:h-80 md:h-[26rem]"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <Reveal className="text-center">
          <span className="gold-divider mb-3 text-xs uppercase tracking-[0.3em]">Curated</span>
          <h2 className="font-serif text-4xl text-maroon">Shop by Category</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.key} delay={i * 80}>
            <Link
              to={`/shop/${c.key}`}
              className="card group relative block overflow-hidden hover-lift"
            >
              <div className="relative aspect-square overflow-hidden bg-sand">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.label}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center text-5xl">
                    {c.emoji}
                  </span>
                )}
                {/* hover overlay + label */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 text-center font-serif text-lg text-cream opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  Shop {c.label} →
                </span>
              </div>
              <span className="block p-4 text-center font-serif text-lg text-ink group-hover:text-maroon">
                {c.label}
              </span>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <ProductSection eyebrow="Just In" title="✨ New Arrivals" products={newArrivals} viewAll="/shop" />

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Handpicked</span>
            <h2 className="mt-1 font-serif text-4xl text-maroon">Featured Picks</h2>
          </div>
          <Link to="/shop" className="group inline-flex items-center gap-1 text-sm font-medium text-maroon">
            View all
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
        {featuredLoading && featured.length === 0 ? (
          <ProductGridSkeleton count={4} />
        ) : featured.length === 0 ? (
          <p className="text-ink/50">No products yet. Add some from the admin panel.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {featured.map((p, i) => {
              const { price, mrp } = getDisplayPrice(p);
              return (
                <Reveal key={p.id} delay={i * 70}>
                  <ProductCard product={{ ...p, price, mrp }} />
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* Trending */}
      <ProductSection eyebrow="Popular Now" title="🔥 Trending Now" products={trending} viewAll="/shop" />

      {/* Testimonials */}
      <Testimonials />

      {/* Bestsellers */}
      <ProductSection eyebrow="Customer Favourites" title="⭐ Bestsellers" products={bestsellers} viewAll="/shop" />

      {/* Stats */}
      <StatsBand />

      {/* Loyalty promo */}
      {cfg?.show_loyalty !== false && (
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-sand to-cream px-8 py-12 text-center md:px-14">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Rewards</span>
            <h2 className="mt-2 font-serif text-3xl text-maroon md:text-4xl">Earn points, get free gifts 🎁</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/70">
              Get <b>1 point</b> on every order above ₹1000. Collect <b>5 points</b> and claim a
              <b> free handmade gift</b> with your next order — our little thank you. 💛
            </p>
            <Link to="/shop" className="btn-primary mt-6">Start Earning</Link>
          </div>
        </div>
      </section>
      )}

      {/* Custom orders CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-16">
        <div className="relative overflow-hidden rounded-3xl bg-maroon px-8 py-12 text-cream md:px-14 md:py-16">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_85%_20%,#E8C77E_0,transparent_40%),radial-gradient(circle_at_10%_90%,#C39A4B_0,transparent_40%)]" />
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
      <section className="border-y border-sand bg-sand/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 text-center sm:grid-cols-3">
          {[
            ["🪡", "Truly Handmade", "Crafted by skilled artisans"],
            ["🔒", "Easy UPI Payment", "PhonePe · Paytm · GPay"],
            ["🚚", "Pan-India Delivery", "Order confirmed on WhatsApp"],
          ].map(([icon, t, s], i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="flex flex-col items-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-cream text-3xl shadow-soft ring-1 ring-gold/30">
                  {icon}
                </div>
                <h4 className="mt-4 font-serif text-lg text-maroon">{t}</h4>
                <p className="text-sm text-ink/60">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Instagram gallery */}
      <InstagramStrip />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}