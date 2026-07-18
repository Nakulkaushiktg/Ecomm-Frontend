import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useCategories } from "../context/CategoriesContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import SearchBox from "./SearchBox.jsx";

export default function Navbar() {
  const { count, openCart } = useCart();
  const { categories } = useCategories();
  const wishlist = useWishlist();
  const { isAuthed, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  // close the mobile menu when clicking anywhere outside the header
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="border-b border-sand/70 bg-cream/95 shadow-[0_4px_24px_-16px_rgba(91,33,28,0.4)] backdrop-blur-md supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4">
        <Link to="/" className="group flex min-w-0 items-center gap-2">
          <img
            src="/logo.png"
            alt="Kirti Thread Art"
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-gold/40 transition duration-300 group-hover:ring-gold sm:h-11 sm:w-11"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-serif text-base font-semibold text-maroon sm:text-xl">
              Kirti Thread Art
            </span>
            <span className="block truncate text-[9px] uppercase tracking-[0.2em] text-ink/50 sm:text-[10px]">
              Woolen · Sacred · Crafted
            </span>
          </span>
        </Link>

        {/* search */}
        <div className="hidden flex-1 max-w-sm md:block">
          <SearchBox />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            className="text-2xl leading-none text-maroon md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
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
          <button
            id="cart-fly-target"
            onClick={openCart}
            className="relative shrink-0 rounded-full border border-maroon/20 px-3 py-1.5 text-sm font-medium text-maroon transition hover:bg-maroon hover:text-cream sm:px-4 sm:py-2"
          >
            Cart
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-bold text-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* mobile menu panel */}
      {menuOpen && (
        <div className="border-t border-sand/60 px-4 py-3 md:hidden">
          <SearchBox onNavigate={() => setMenuOpen(false)} />
          <div className="mt-3 flex flex-col gap-2 text-sm font-medium">
            <Link to="/track" onClick={() => setMenuOpen(false)} className="text-ink/70 hover:text-maroon">
              Track Order
            </Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-ink/70 hover:text-maroon">
              Contact Us
            </Link>
            <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="text-ink/70 hover:text-maroon">
              My Wishlist
            </Link>
          </div>
        </div>
      )}

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
