import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useWishlist } from "../context/WishlistContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Wishlist() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/api/products").then((r) => setProducts(r.data)).catch(() => {});
  }, []);

  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl text-maroon">My Wishlist</h1>
      {ids.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-ink/60">Your wishlist is empty. Tap the ♡ on any product to save it.</p>
          <Link to="/shop" className="btn-primary mt-5">Browse Products</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
