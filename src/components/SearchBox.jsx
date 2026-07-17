import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCachedGet from "../hooks/useCachedGet.js";
import { useCategories } from "../context/CategoriesContext.jsx";
import { rupee } from "../api.js";
import { optimizeImg } from "../lib/img.js";

const RECENT_KEY = "recentSearches";

// tiny edit-distance for typo tolerance
function lev(a, b) {
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

function score(name, q) {
  name = name.toLowerCase();
  q = q.toLowerCase();
  if (name.includes(q)) return 100 - name.indexOf(q);
  let best = 0;
  for (const w of name.split(/\s+/)) {
    const tol = q.length > 4 ? 2 : 1;
    if (w.startsWith(q)) best = Math.max(best, 50);
    else if (lev(w, q) <= tol) best = Math.max(best, 30); // typo-tolerant
  }
  return best;
}

const priceOf = (p) => (p.variants?.[0]?.price > 0 ? p.variants[0].price : p.price);

export default function SearchBox({ onNavigate, autoFocus }) {
  const { data } = useCachedGet("/api/products");
  const products = data || [];
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState([]);
  const boxRef = useRef(null);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onDoc = (e) => boxRef.current && !boxRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const saveRecent = (term) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 5);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const done = () => {
    setOpen(false);
    onNavigate?.();
  };
  const go = (term) => {
    saveRecent(term);
    done();
    navigate(`/shop?search=${encodeURIComponent(term.trim())}`);
  };
  const openProduct = (p) => {
    saveRecent(p.name);
    done();
    navigate(`/product/${p.slug}`);
  };

  const query = q.trim();
  const matches = query
    ? products
        .map((p) => ({ p, s: score(p.name, query) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 6)
        .map((x) => x.p)
    : [];
  const catMatches = query
    ? categories.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];
  const trending = products.filter((p) => p.is_trending).slice(0, 4);
  const trendingShow = trending.length ? trending : products.slice(0, 4);

  const submit = (e) => {
    e.preventDefault();
    if (query) go(query);
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={submit} className="flex">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoFocus={autoFocus}
          placeholder="Search handmade products…"
          className="w-full rounded-l-full border border-sand bg-white px-4 py-2 text-sm outline-none focus:border-gold"
        />
        <button className="rounded-r-full bg-maroon px-4 text-cream">🔍</button>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-sand bg-white p-2 shadow-soft">
          {query ? (
            <>
              {matches.length === 0 && catMatches.length === 0 && (
                <p className="p-3 text-sm text-ink/50">No matches — try a different spelling.</p>
              )}
              {catMatches.map((c) => (
                <button
                  key={c.key}
                  onMouseDown={() => {
                    done();
                    navigate(`/shop/${c.key}`);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-sand"
                >
                  🗂️ {c.label} <span className="text-ink/40">· category</span>
                </button>
              ))}
              {matches.map((p) => (
                <button
                  key={p.id}
                  onMouseDown={() => openProduct(p)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-sand"
                >
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded bg-sand">
                    {p.images?.[0] && <img src={optimizeImg(p.images[0], 80)} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <span className="flex-1 truncate text-sm">{p.name}</span>
                  <span className="text-sm font-semibold text-maroon">{rupee(priceOf(p))}</span>
                </button>
              ))}
            </>
          ) : (
            <>
              {recent.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-[11px] uppercase tracking-wide text-ink/40">Recent</p>
                  {recent.map((r, i) => (
                    <button
                      key={i}
                      onMouseDown={() => go(r)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm hover:bg-sand"
                    >
                      <span className="text-ink/40">🕘</span> {r}
                    </button>
                  ))}
                </div>
              )}
              {trendingShow.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-[11px] uppercase tracking-wide text-ink/40">Trending</p>
                  {trendingShow.map((p) => (
                    <button
                      key={p.id}
                      onMouseDown={() => openProduct(p)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-sand"
                    >
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-sand">
                        {p.images?.[0] && <img src={optimizeImg(p.images[0], 80)} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <span className="flex-1 truncate text-sm">{p.name}</span>
                      <span className="text-xs">🔥</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
