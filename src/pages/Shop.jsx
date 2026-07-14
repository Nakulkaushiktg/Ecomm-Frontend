import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import { useCategories } from "../context/CategoriesContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ProductGridSkeleton } from "../components/Loader.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Shop() {
  const { category } = useParams();
  const { labelOf } = useCategories();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="text-5xl">🧺</div>
          <p className="mt-3 text-ink/60">No products in this category yet.</p>
          <Link to="/shop" className="btn-ghost mt-6">Browse all products</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
