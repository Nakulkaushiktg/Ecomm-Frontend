import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api, rupee } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { useCategories } from "../context/CategoriesContext.jsx";
import Stars from "../components/Stars.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="100%" height="100%" fill="#F3E9D7"/><text x="50%" y="50%" font-size="28" fill="#7B2D26" text-anchor="middle" dominant-baseline="middle" font-family="serif">Kirti Thread Art</text></svg>'
  );

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { labelOf } = useCategories();
  const [p, setP] = useState(null);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [variantErr, setVariantErr] = useState("");

  const loadReviews = () =>
    api.get(`/api/products/${slug}/reviews`).then((r) => setReviews(r.data)).catch(() => {});

  useEffect(() => {
    setSize("");
    setColor("");
    api
      .get(`/api/products/${slug}`)
      .then((r) => {
        setP(r.data);
        if (r.data.sizes?.length) setSize(r.data.sizes[0]);
        if (r.data.colors?.length) setColor(r.data.colors[0]);
      })
      .catch(() => setNotFound(true));
    loadReviews();
    api.get(`/api/products/${slug}/related`).then((r) => setRelated(r.data)).catch(() => {});
  }, [slug]);

  // build the variant string and validate selection
  const variantString = () => {
    const parts = [];
    if (p?.sizes?.length) parts.push(`Size: ${size}`);
    if (p?.colors?.length) parts.push(`Color: ${color}`);
    return parts.join(", ");
  };
  const variantReady = () =>
    (!p?.sizes?.length || size) && (!p?.colors?.length || color);

  // find the matching variant row + its live stock
  const selectedVariant = () =>
    (p?.variants || []).find((v) => v.size === size && v.color === color) || null;
  const variantStockOf = (s, c) =>
    (p?.variants || []).find((v) => v.size === s && v.color === c)?.stock ?? 0;
  const hasVariants = (p?.variants || []).length > 0;
  // available stock for the current selection
  const availStock = hasVariants
    ? (variantReady() ? (selectedVariant()?.stock ?? 0) : null)
    : p?.stock;

  // price/mrp for the chosen variant (falls back to product base price)
  // For size-only or color-only products: match variant by whichever dimension is selected
  const _sel = hasVariants
    ? (p?.variants || []).find((v) =>
        (!p?.sizes?.length || v.size === size) &&
        (!p?.colors?.length || v.color === color)
      ) || null
    : null;
  // Price is only shown when no variant selection is needed, OR when enough is selected
  const curPrice = _sel && _sel.price > 0 ? _sel.price : (p?.price ?? 0);
  const curMrp = _sel && _sel.mrp > 0 ? _sel.mrp : (p?.mrp ?? 0);
  const curOff = curMrp > curPrice ? Math.round(((curMrp - curPrice) / curMrp) * 100) : 0;

  const addToCart = () => {
    setVariantErr("");
    if (!variantReady()) {
      setVariantErr("Please select " + [p.sizes?.length && "size", p.colors?.length && "color"].filter(Boolean).join(" & ") + ".");
      return;
    }
    if (hasVariants && (selectedVariant()?.stock ?? 0) < qty) {
      setVariantErr("This option is out of stock.");
      return;
    }
    add({ ...p, price: curPrice }, qty, variantString(), size, color);
  };

  if (notFound)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-ink/60">Product not found.</p>
        <Link to="/shop" className="btn-ghost mt-4">Back to shop</Link>
      </div>
    );
  if (!p) return <Loader label="Loading product" />;

  // combined gallery: images first, then videos
  const media = [
    ...(p.images?.length ? p.images : [PLACEHOLDER]).map((url) => ({ type: "image", url })),
    ...((p.videos || []).map((url) => ({ type: "video", url }))),
  ];

  const buyNow = () => {
    setVariantErr("");
    if (!variantReady()) {
      setVariantErr("Please select " + [p.sizes?.length && "size", p.colors?.length && "color"].filter(Boolean).join(" & ") + ".");
      return;
    }
    if (hasVariants && (selectedVariant()?.stock ?? 0) < qty) {
      setVariantErr("This option is out of stock.");
      return;
    }
    add({ ...p, price: curPrice }, qty, variantString(), size, color);
    navigate("/checkout");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        {/* gallery */}
        <div className="md:sticky md:top-28 md:self-start">
          <div className="aspect-square overflow-hidden rounded-2xl bg-sand">
            {media[active]?.type === "video" ? (
              <video
                src={media[active].url}
                controls
                autoPlay
                muted
                loop
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={media[active]?.url}
                alt={p.name}
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {media.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {media.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${
                    active === i ? "border-maroon" : "border-transparent"
                  }`}
                >
                  {m.type === "video" ? (
                    <>
                      <video src={m.url} className="h-full w-full object-cover" muted />
                      <span className="absolute inset-0 grid place-items-center bg-ink/30 text-cream">▶</span>
                    </>
                  ) : (
                    <img src={m.url} alt="" className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div>
          <Link to={`/shop/${p.category}`} className="text-xs uppercase tracking-widest text-gold">
            {labelOf(p.category)}
          </Link>
          <h1 className="mt-2 font-serif text-4xl text-maroon">{p.name}</h1>
          <p className="mt-1 text-sm text-ink/50">{p.material}</p>
          {p.review_count > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <Stars value={p.avg_rating} size="text-base" />
              <span className="text-sm text-ink/60">
                {p.avg_rating} · {p.review_count} review{p.review_count > 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <span className="text-3xl font-semibold text-maroon">{rupee(curPrice)}</span>
            {curOff > 0 && (
              <>
                <span className="text-lg text-ink/40 line-through">{rupee(curMrp)}</span>
                <span className="rounded-full bg-gold/20 px-2 py-0.5 text-sm font-semibold text-maroon">
                  {curOff}% off
                </span>
              </>
            )}
          </div>

          <p className="mt-2 text-sm">
            {hasVariants && !variantReady() ? (
              <span className="text-ink/50">Select options to see availability</span>
            ) : availStock <= 0 ? (
              <span className="font-medium text-red-700">Out of Stock</span>
            ) : availStock <= 5 ? (
              <span className="font-medium text-orange-600">
                ⚠ Hurry! Only {availStock} left{hasVariants ? " in this option" : ""}
              </span>
            ) : (
              <span className="text-green-700">In stock · {availStock} available</span>
            )}
          </p>

          <p className="mt-6 leading-relaxed text-ink/70">{p.description}</p>

          {/* size selector */}
          {p.sizes?.length > 0 && (
            <div className="mt-6">
              <span className="label">Size</span>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => {
                  // stock of this size (with chosen color if any, else across colors)
                  const sStock = color
                    ? variantStockOf(s, color)
                    : (p.variants || []).filter((v) => v.size === s).reduce((a, v) => a + v.stock, 0);
                  const soldOut = sStock <= 0;
                  return (
                    <button
                      key={s}
                      onClick={() => !soldOut && setSize(s)}
                      disabled={soldOut}
                      className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm ${
                        size === s ? "border-maroon bg-maroon text-cream"
                        : soldOut ? "border-sand text-ink/30 line-through cursor-not-allowed"
                        : "border-sand hover:border-maroon"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* color selector */}
          {p.colors?.length > 0 && (
            <div className="mt-4">
              <span className="label">Color</span>
              <div className="flex flex-wrap gap-2">
                {p.colors.map((c) => {
                  const cStock = size
                    ? variantStockOf(size, c)
                    : (p.variants || []).filter((v) => v.color === c).reduce((a, v) => a + v.stock, 0);
                  const soldOut = cStock <= 0;
                  return (
                    <button
                      key={c}
                      onClick={() => !soldOut && setColor(c)}
                      disabled={soldOut}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        color === c ? "border-maroon bg-maroon text-cream"
                        : soldOut ? "border-sand text-ink/30 line-through cursor-not-allowed"
                        : "border-sand hover:border-maroon"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-sand">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg">–</button>
              <span className="w-8 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => (availStock ? Math.min(availStock, q + 1) : q + 1))}
                disabled={availStock != null && qty >= availStock}
                className="px-4 py-2 text-lg disabled:opacity-40"
              >+</button>
            </div>
          </div>

          {variantErr && <p className="mt-3 text-sm text-red-700">{variantErr}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={addToCart} disabled={p.stock <= 0} className="btn-ghost">
              Add to Cart
            </button>
            <button onClick={buyNow} disabled={p.stock <= 0} className="btn-primary">
              Buy Now
            </button>
          </div>

          {/* trust row */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-sand pt-5 text-xs text-ink/60">
            <span className="inline-flex items-center gap-1.5">🪡 Truly handmade</span>
            <span className="inline-flex items-center gap-1.5">🔒 Secure payment</span>
            <span className="inline-flex items-center gap-1.5">🚚 Pan-India delivery</span>
          </div>
        </div>
      </div>

      {/* Reviews — Amazon style */}
      <div className="mt-14 border-t border-sand pt-10">
        <h2 className="font-serif text-2xl text-maroon">Ratings &amp; Reviews</h2>

        <div className="mt-6 grid gap-10 md:grid-cols-3">
          {/* summary + write button */}
          <div className="md:col-span-1">
            <div className="card p-6">
              <div className="flex items-end gap-3">
                <span className="font-serif text-5xl text-maroon">
                  {p.review_count > 0 ? p.avg_rating : "—"}
                </span>
                <div className="pb-1">
                  <Stars value={p.avg_rating} size="text-lg" />
                  <p className="text-xs text-ink/50">
                    {p.review_count} {p.review_count === 1 ? "rating" : "ratings"}
                  </p>
                </div>
              </div>

              {/* star breakdown bars */}
              <div className="mt-4 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const cnt = reviews.filter((r) => r.rating === star).length;
                  const pct = reviews.length ? (cnt / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-8 text-ink/60">{star}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                        <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-right text-ink/50">{cnt}</span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-5 rounded-lg bg-sand/50 p-3 text-center text-xs text-ink/60">
                Reviews can be written after your order is delivered, from{" "}
                <Link to="/orders" className="font-medium text-maroon hover:underline">
                  My Orders
                </Link>.
              </p>
            </div>
          </div>

          {/* review list */}
          <div className="space-y-4 md:col-span-2">
            {reviews.length === 0 ? (
              <div className="card p-8 text-center text-ink/50">
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="card p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-maroon text-sm font-semibold text-cream">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-ink">{r.name}</span>
                      <div className="flex items-center gap-2">
                        <Stars value={r.rating} />
                        <span className="text-xs text-ink/40">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {r.comment && <p className="mt-3 text-sm leading-relaxed text-ink/75">{r.comment}</p>}
                  {r.image_url && (
                    <img
                      src={r.image_url}
                      alt="review"
                      className="mt-3 h-28 w-28 rounded-lg border border-sand object-cover"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-14 border-t border-sand pt-10">
          <h2 className="font-serif text-2xl text-maroon">You May Also Like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}