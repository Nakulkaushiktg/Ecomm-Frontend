import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { rupee } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import Stars from "./Stars.jsx";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#F3E9D7"/><text x="50%" y="50%" font-size="20" fill="#7B2D26" text-anchor="middle" dominant-baseline="middle" font-family="serif">Kirti Thread Art</text></svg>'
  );

export default function ProductCard({ product }) {
  const { add, items, setQty } = useCart();
  const wishlist = useWishlist();
  const images = product.images?.length ? product.images : [PLACEHOLDER];
  const [idx, setIdx] = useState(0);

  // auto-rotate through images if there is more than one
  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 2500);
    return () => clearInterval(t);
  }, [images.length]);

  const img = images[idx] || PLACEHOLDER;
  // when the product has variants, show the first variant's price (per-size pricing)
  const fv = product.variants?.length ? product.variants[0] : null;
  const dPrice = fv && fv.price > 0 ? fv.price : product.price;
  const dMrp = fv && fv.mrp > 0 ? fv.mrp : product.mrp;
  const off =
    dMrp > dPrice ? Math.round(((dMrp - dPrice) / dMrp) * 100) : 0;

  const hasOptions = (product.sizes?.length || 0) + (product.colors?.length || 0) > 0;
  const cartKey = `${product.id}__`;
  const inCart = items.find((i) => i.key === cartKey);
  const qty = inCart?.quantity || 0;
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const canAddMore = qty < product.stock;

  return (
    <div className="card group relative overflow-hidden">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-sand">
          <img
            key={idx}
            src={img}
            alt={product.name}
            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
            className="h-full w-full object-cover transition-opacity duration-700 group-hover:scale-105"
            style={{ animation: "fadeIn .7s ease" }}
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition ${
                    i === idx ? "bg-cream" : "bg-cream/40"
                  }`}
                />
              ))}
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.is_bestseller && !outOfStock && (
              <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-ink">
                ★ Bestseller
              </span>
            )}
            {off > 0 && !outOfStock && (
              <span className="rounded-full bg-maroon px-2.5 py-1 text-xs font-semibold text-cream">
                {off}% OFF
              </span>
            )}
          </div>
          {outOfStock && (
            <span className="absolute inset-0 grid place-items-center bg-ink/50 text-lg font-semibold text-cream">
              Out of Stock
            </span>
          )}
        </div>
      </Link>
      <button
        onClick={() => wishlist.toggle(product.id)}
        title="Save to wishlist"
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-cream/90 text-lg shadow-soft transition hover:scale-110"
      >
        <span className={wishlist.has(product.id) ? "text-maroon" : "text-ink/40"}>
          {wishlist.has(product.id) ? "♥" : "♡"}
        </span>
      </button>
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-1 font-serif text-lg text-ink group-hover:text-maroon">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-ink/50">{product.material}</p>
        {product.review_count > 0 && (
          <div className="mt-1 flex items-center gap-1">
            <Stars value={product.avg_rating} />
            <span className="text-xs text-ink/50">({product.review_count})</span>
          </div>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-semibold text-maroon">
            {rupee(dPrice)}
          </span>
          {off > 0 && (
            <span className="text-sm text-ink/40 line-through">
              {rupee(dMrp)}
            </span>
          )}
        </div>

        {/* stock warning */}
        {lowStock && (
          <p className="mt-1 text-xs font-medium text-orange-600">
            ⚠ Only {product.stock} left — order soon!
          </p>
        )}

        {/* add button OR qty stepper if already in cart */}
        {outOfStock ? (
          <button disabled className="btn-primary mt-3 w-full">
            Out of Stock
          </button>
        ) : hasOptions ? (
          <Link to={`/product/${product.slug}`} className="btn-primary mt-3 block w-full text-center">
            Select Options
          </Link>
        ) : qty === 0 ? (
          <button onClick={() => add(product)} className="btn-primary mt-3 w-full">
            Add to Cart
          </button>
        ) : (
          <div className="mt-3 flex items-center justify-between rounded-full bg-maroon px-2 py-1 text-cream">
            <button
              onClick={() => setQty(cartKey, qty - 1)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-maroon-dark text-lg"
            >
              –
            </button>
            <span className="text-sm font-medium">{qty} in cart</span>
            <button
              onClick={() => canAddMore && setQty(cartKey, qty + 1)}
              disabled={!canAddMore}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-maroon-dark text-lg disabled:opacity-40"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
