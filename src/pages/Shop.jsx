import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useCategories } from "../context/CategoriesContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ProductGridSkeleton } from "../components/Loader.jsx";
import Reveal from "../components/Reveal.jsx";
import useDocTitle from "../hooks/useDocTitle.js";
import useCachedGet from "../hooks/useCachedGet.js";

export default function Shop() {
  const { category } = useParams();
  const { labelOf } = useCategories();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [sort, setSort] = useState("featured");
  const [inStock, setInStock] = useState(false);
  const [priceBand, setPriceBand] = useState("all");
  const [topRated, setTopRated] = useState(false);

  // cached fetch — revisiting a category/search you've seen loads instantly
  const qs = new URLSearchParams();
  if (category) qs.set("category", category);
  if (search) qs.set("search", search);
  const url = `/api/products${qs.toString() ? `?${qs}` : ""}`;
  const { data, loading } = useCachedGet(url);
  const products = data || [];

  // price used for sorting/filtering = first variant's price if any, else base
  const priceOf = (p) =>
    p.variants?.length && p.variants[0].price > 0 ? p.variants[0].price : p.price;

  useDocTitle(search ? `Search: ${search}` : category ? labelOf(category) : "Shop");

  const PRICE_BANDS = {
    all: () => true,
    "0-500": (v) => v <= 500,
    "500-1000": (v) => v > 500 && v <= 1000,
    "1000-2000": (v) => v > 1000 && v <= 2000,
    "2000+": (v) => v > 2000,
  };

  const filtered = products.filter((p) => {
    if (inStock && p.stock <= 0) return false;
    if (topRated && (p.avg_rating || 0) < 4) return false;
    if (!PRICE_BANDS[priceBand](priceOf(p))) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return priceOf(a) - priceOf(b);
    if (sort === "price-desc") return priceOf(b) - priceOf(a);
    if (sort === "rating") return (b.avg_rating || 0) - (a.avg_rating || 0);
    return 0; // featured / default order from the API
  });

  const hasFilters = inStock || topRated || priceBand !== "all";
  const clearFilters = () => {
    setInStock(false);
    setTopRated(false);
    setPriceBand("all");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-gold">
          {search ? "Search Results" : "Collection"}
        </span>
        <h1 className="mt-1 font-serif text-4xl text-maroon">
          {search
            ? `“${search}”`
            : category
            ? labelOf(category)
            : "All Products"}
        </h1>
        <div className="mt-4 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
      </div>

      {!loading && products.length > 0 && (
        <>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-ink/50">
              {sorted.length} product{sorted.length !== 1 ? "s" : ""}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-ink/50">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-sand bg-white px-3 py-1.5 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </label>
          </div>

          {/* filters */}
          <div className="mt-3 flex flex-wrap items-center gap-2 border-b border-sand pb-4 text-sm">
            {[
              ["all", "All prices"],
              ["0-500", "Under ₹500"],
              ["500-1000", "₹500–1000"],
              ["1000-2000", "₹1000–2000"],
              ["2000+", "₹2000+"],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setPriceBand(val)}
                className={`rounded-full border px-3 py-1.5 transition ${
                  priceBand === val ? "border-maroon bg-maroon text-cream" : "border-sand hover:border-maroon/40"
                }`}
              >
                {label}
              </button>
            ))}
            <span className="mx-1 h-5 w-px bg-sand" />
            <button
              onClick={() => setInStock((v) => !v)}
              className={`rounded-full border px-3 py-1.5 transition ${
                inStock ? "border-maroon bg-maroon text-cream" : "border-sand hover:border-maroon/40"
              }`}
            >
              In stock
            </button>
            <button
              onClick={() => setTopRated((v) => !v)}
              className={`rounded-full border px-3 py-1.5 transition ${
                topRated ? "border-maroon bg-maroon text-cream" : "border-sand hover:border-maroon/40"
              }`}
            >
              ★ 4 &amp; up
            </button>
            {hasFilters && (
              <button onClick={clearFilters} className="ml-1 text-maroon hover:underline">
                Clear
              </button>
            )}
          </div>
        </>
      )}

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="text-5xl">🧺</div>
          <p className="mt-3 text-ink/60">No products in this category yet.</p>
          <Link to="/shop" className="btn-ghost mt-6">Browse all products</Link>
        </div>
      ) : sorted.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="text-5xl">🔍</div>
          <p className="mt-3 text-ink/60">No products match these filters.</p>
          <button onClick={clearFilters} className="btn-ghost mt-6">Clear filters</button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {sorted.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
