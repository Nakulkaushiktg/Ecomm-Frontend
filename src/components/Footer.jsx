import { Link } from "react-router-dom";
import { useCategories } from "../context/CategoriesContext.jsx";

export default function Footer() {
  const { categories } = useCategories();
  return (
    <footer className="mt-20 bg-sand/40">
      <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Kirti Thread Art"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-maroon/20"
            />
            <h3 className="font-serif text-xl text-maroon">Kirti Thread Art</h3>
          </div>
          <p className="mt-2 max-w-xs text-sm text-ink/60">
            Lovingly handcrafted woolen and cotton wear, sacred idols and
            jewellery — made by Indian artisans.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink/70">
            Shop
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            {categories.map((c) => (
              <li key={c.key}>
                <Link to={`/shop/${c.key}`} className="hover:text-maroon">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink/70">
            Help & Info
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li><Link to="/about" className="hover:text-maroon">About Us</Link></li>
            <li><Link to="/info/faq" className="hover:text-maroon">FAQ</Link></li>
            <li><Link to="/info/shipping" className="hover:text-maroon">Shipping & Returns</Link></li>
            <li><Link to="/track" className="hover:text-maroon">Track Order</Link></li>
            <li><Link to="/contact" className="hover:text-maroon">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand py-4 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} Kirti Thread Art. All rights reserved.
      </div>
    </footer>
  );
}
