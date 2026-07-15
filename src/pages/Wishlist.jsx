import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useWishlist } from "../context/WishlistContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Wishlist() {
  const { ids, isAuthed } = useWishlist();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/api/products").then((r) => setProducts(r.data)).catch(() => {});
  }, []);

  const saved = products.filter((p) => ids.includes(p.id));

  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="animate-pop text-5xl text-maroon">♥</div>
        <h1 className="mt-4 font-serif text-3xl text-maroon">My Wishlist</h1>
        <p className="mt-2 text-sm text-ink/60">
          Log in to save products and see your wishlist on any device.
        </p>
        <Link to="/login?redirect=/wishlist" className="btn-primary mt-6 inline-block">
          Log In / Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <span className="text-xs uppercase tracking-[0.3em] text-gold">Saved for later</span>
      <h1 className="mt-1 font-serif text-4xl text-maroon">My Wishlist</h1>
      <div className="mt-4 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
      {ids.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="text-5xl">🤍</div>
          <p className="mt-3 text-ink/60">Your wishlist is empty. Tap the ♡ on any product to save it.</p>
          <Link to="/shop" className="btn-primary mt-6">Browse Products</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {saved.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
