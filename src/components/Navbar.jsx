import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useCategories } from "../context/CategoriesContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { count } = useCart();
  const { categories } = useCategories();
  const wishlist = useWishlist();
  const { isAuthed, user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const search = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/80 shadow-[0_4px_24px_-16px_rgba(91,33,28,0.4)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Kirti Thread Art"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-gold/40 transition duration-300 group-hover:ring-gold"
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
          {isAuthed ? (
            <Link
              to="/account"
              title="My Account"
              className="flex items-center gap-2 text-sm font-medium text-maroon hover:text-maroon-dark"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-maroon text-cream">
                {(user?.name?.[0] || "U").toUpperCase()}
              </span>
              <span className="hidden max-w-[90px] truncate sm:block">{user?.name?.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              title="Login"
              className="flex items-center gap-1.5 text-sm font-medium text-ink/70 hover:text-maroon"
            >
              <span className="text-xl">👤</span>
              <span className="hidden sm:block">Login</span>
            </Link>
          )}
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
          <NavLink
            to="/shop"
            end
            className={({ isActive }) =>
              `nav-link whitespace-nowrap hover:text-maroon ${isActive ? "active text-maroon" : "text-ink/70"}`
            }
          >
            All
          </NavLink>
          {categories.map((c) => (
            <NavLink
              key={c.key}
              to={`/shop/${c.key}`}
              className={({ isActive }) =>
                `nav-link whitespace-nowrap hover:text-maroon ${isActive ? "active text-maroon" : "text-ink/70"}`
              }
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
