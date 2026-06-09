import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useCategories } from "../context/CategoriesContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function Navbar() {
  const { count } = useCart();
  const { categories } = useCategories();
  const wishlist = useWishlist();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const search = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Kirti Thread Art"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-maroon/20"
          />
          <span className="leading-tight">
            <span className="block font-serif text-xl font-semibold text-maroon">
              Kirti Thread Art
            </span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-ink/50">
              Woolen · Sacred · Crafted
            </span>
          </span>
        </Link>

        {/* search */}
        <form onSubmit={search} className="hidden flex-1 max-w-sm md:flex">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search handmade products…"
            className="w-full rounded-l-full border border-sand bg-white px-4 py-2 text-sm outline-none focus:border-gold"
          />
          <button className="rounded-r-full bg-maroon px-4 text-cream">🔍</button>
        </form>

        <div className="flex items-center gap-3">
          <Link to="/track" className="hidden text-sm font-medium text-ink/70 hover:text-maroon sm:block">
            Track Order
          </Link>
          <Link to="/contact" className="hidden text-sm font-medium text-ink/70 hover:text-maroon sm:block">
            Contact Us
          </Link>
          <Link to="/wishlist" className="relative text-xl text-maroon" title="Wishlist">
            ♥
            {wishlist.count > 0 && (
              <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-maroon px-1 text-[10px] font-bold text-cream">
                {wishlist.count}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative rounded-full border border-maroon/20 px-4 py-2 text-sm font-medium text-maroon hover:bg-maroon hover:text-cream">
            Cart
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-bold text-ink">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* category row */}
      <div className="border-t border-sand/50">
        <nav className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2 text-sm font-medium">
          <NavLink to="/shop" className="whitespace-nowrap hover:text-maroon">All</NavLink>
          {categories.map((c) => (
            <NavLink
              key={c.key}
              to={`/shop/${c.key}`}
              className="whitespace-nowrap text-ink/70 hover:text-maroon"
            >
              {c.label}
            </NavLink>
          ))}
          <Link to="/track" className="whitespace-nowrap text-ink/70 hover:text-maroon sm:hidden">
            Track Order
          </Link>
          <Link to="/contact" className="whitespace-nowrap text-ink/70 hover:text-maroon sm:hidden">
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
}
