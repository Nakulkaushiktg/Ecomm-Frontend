import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { api } from "../api.js";
import { useCategories } from "../context/CategoriesContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Shop() {
  const { category } = useParams();
  const { categories, labelOf } = useCategories();
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
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl text-maroon">
        {search
          ? `Search: "${search}"`
          : category
          ? labelOf(category)
          : "All Products"}
      </h1>

      {/* category pills */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to="/shop"
          className={`rounded-full border px-4 py-1.5 text-sm ${
            !category ? "border-maroon bg-maroon text-cream" : "border-sand text-ink/70 hover:border-maroon"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.key}
            to={`/shop/${c.key}`}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              category === c.key ? "border-maroon bg-maroon text-cream" : "border-sand text-ink/70 hover:border-maroon"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 text-ink/50">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-10 text-ink/50">No products in this category yet.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
