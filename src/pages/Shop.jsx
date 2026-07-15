import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import { useCategories } from "../context/CategoriesContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ProductGridSkeleton } from "../components/Loader.jsx";
import Reveal from "../components/Reveal.jsx";
import useDocTitle from "../hooks/useDocTitle.js";

export default function Shop() {
  const { category } = useParams();
  const { labelOf } = useCategories();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("featured");

  // price used for sorting = first variant's price if any, else base price
  const priceOf = (p) =>
    p.variants?.length && p.variants[0].price > 0 ? p.variants[0].price : p.price;

  useDocTitle(search ? `Search: ${search}` : category ? labelOf(category) : "Shop");

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc") return priceOf(a) - priceOf(b);
    if (sort === "price-desc") return priceOf(b) - priceOf(a);
    if (sort === "rating") return (b.avg_rating || 0) - (a.avg_rating || 0);
    return 0; // featured / default order from the API
  });

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    api
      .get("/api/products", { params })
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

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
        <div className="mt-6 flex items-center justify-between border-b border-sand pb-3">
          <p className="text-sm text-ink/50">
            {products.length} product{products.length !== 1 ? "s" : ""}
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
      )}

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="text-5xl">🧺</div>
          <p className="mt-3 text-ink/60">No products in this category yet.</p>
          <Link to="/shop" className="btn-ghost mt-6">Browse all products</Link>
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
