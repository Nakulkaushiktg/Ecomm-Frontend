import { useEffect, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import Reveal from "./Reveal.jsx";

const KEY = "recentlyViewed";

// Call from a product page to record the product (keeps the last 8, newest first).
export function recordRecentlyViewed(product) {
  if (!product?.id) return;
  try {
    const prev = JSON.parse(localStorage.getItem(KEY) || "[]");
    const slim = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      material: product.material,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      images: product.images || [],
      sizes: product.sizes || [],
      colors: product.colors || [],
      variants: product.variants || [],
      avg_rating: product.avg_rating,
      review_count: product.review_count,
      is_bestseller: product.is_bestseller,
      is_new: product.is_new,
      is_trending: product.is_trending,
    };
    const next = [slim, ...prev.filter((p) => p.id !== product.id)].slice(0, 8);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore storage errors */
  }
}

// Strip of recently viewed products, excluding `excludeId` (the current product).
export default function RecentlyViewed({ excludeId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || "[]");
      setItems(list.filter((p) => p.id !== excludeId));
    } catch {
      setItems([]);
    }
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <div className="mt-14 border-t border-sand pt-10">
      <h2 className="font-serif text-2xl text-maroon">Recently Viewed</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {items.slice(0, 4).map((p, i) => (
          <Reveal key={p.id} delay={i * 70}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
