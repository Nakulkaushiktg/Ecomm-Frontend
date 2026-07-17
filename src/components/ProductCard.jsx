import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import flyToCart from "../lib/flyToCart.js";
import { optimizeImg } from "../lib/img.js";
import { rupee } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import Stars from "./Stars.jsx";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#F3E9D7"/><text x="50%" y="50%" font-size="20" fill="#7B2D26" text-anchor="middle" dominant-baseline="middle" font-family="serif">Kirti Thread Art</text></svg>'
  );

export default function ProductCard({ product }) {
  const { add, items, setQty, remove } = useCart();
  const wishlist = useWishlist();
  const { notify } = useToast();
  const navigate = useNavigate();
  const images = product.images?.length ? product.images : [PLACEHOLDER];
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef(null);

  // wishlist needs an account; send guests to login
  const onWishlist = () => {
    if (!wishlist.isAuthed) {
      navigate("/login?redirect=/wishlist");
      return;
    }
    const wasSaved = wishlist.has(product.id);
    wishlist.toggle(product.id);
    notify(wasSaved ? "Removed from wishlist" : "Saved to wishlist", wasSaved ? "♡" : "♥");
  };

  // auto-rotate through images if there is more than one — paused while hovering
  useEffect(() => {
    if (images.length <= 1 || hovered) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 2500);
    return () => clearInterval(t);
  }, [images.length, hovered]);

  const img = images[idx] || PLACEHOLDER;
  // the "next angle" shown on hover
  const nextImg = images.length > 1 ? images[(idx + 1) % images.length] : null;
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
    <div className="card group relative overflow-hidden hover-lift">
      <Link to={`/product/${product.slug}`} className="block">
        <div
          className="relative aspect-square overflow-hidden bg-sand"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            ref={imgRef}
            key={idx}
            src={optimizeImg(img, 450)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
            className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110 ${
              nextImg ? "group-hover:opacity-0" : ""
            }`}
            style={{ animation: "fadeIn .7s ease" }}
          />
          {/* next angle fades in on hover, giving an "angle change" reveal */}
          {nextImg && (
            <img
              src={optimizeImg(nextImg, 450)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-700 ease-out group-hover:scale-110 group-hover:opacity-100"
            />
          )}
          {/* soft gradient veil deepens on hover for a premium feel */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {/* dots showing which image is active */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 z-[2] flex -translate-x-1/2 gap-1.5">
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
          {/* Quick View pill slides up on hover */}
          {!outOfStock && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
              <span className="block rounded-full bg-cream/95 py-2 text-center text-sm font-semibold text-maroon shadow-soft backdrop-blur">
                Quick View
              </span>
            </div>
          )}
          <div className="absolute left-3 top-3 z-[2] flex flex-col items-start gap-1">
            {product.is_bestseller && !outOfStock && (
              <span className="rounded-full bg-gradient-to-br from-gold-light to-gold px-2.5 py-1 text-xs font-semibold text-ink shadow-soft">
                ★ Bestseller
              </span>
            )}
            {product.is_new && !outOfStock && (
              <span className="rounded-full bg-gradient-to-br from-emerald-500 to-green-600 px-2.5 py-1 text-xs font-semibold text-white shadow-soft">
                ✦ New
              </span>
            )}
            {product.is_trending && !outOfStock && (
              <span className="rounded-full bg-gradient-to-br from-orange-500 to-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-soft">
                🔥 Trending
              </span>
            )}
            {off > 0 && !outOfStock && (
              <span className="rounded-full bg-gradient-to-br from-maroon to-maroon-dark px-2.5 py-1 text-xs font-semibold text-cream shadow-soft">
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
        onClick={onWishlist}
        title="Save to wishlist"
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-cream/80 text-lg shadow-soft ring-1 ring-white/50 backdrop-blur transition hover:scale-110 hover:bg-cream active:scale-95"
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
          <button
            onClick={() => {
              flyToCart(imgRef.current);
              add(product);
              notify("Added to cart");
            }}
            className="btn-primary mt-3 w-full"
          >
            Add to Cart
          </button>
        ) : (
          <div className="mt-3 flex items-center justify-between rounded-full bg-maroon px-2 py-1 text-cream">
            <button
              onClick={() => (qty === 1 ? remove(cartKey) : setQty(cartKey, qty - 1))}
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
