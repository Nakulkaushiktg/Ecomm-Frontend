import { useEffect, useState } from "react";
import { api } from "../api.js";

// simple in-memory cache shared across the app (cleared on full reload)
const cache = new Map();

// Stale-while-revalidate GET: if we've fetched this url before, show the cached
// data instantly (no spinner) and refresh it silently in the background.
// So going back to a page you've already seen is instant — no reload flash.
export default function useCachedGet(url, { enabled = true } = {}) {
  const [data, setData] = useState(() => (url && cache.has(url) ? cache.get(url) : null));
  const [loading, setLoading] = useState(() => !(url && cache.has(url)));

  useEffect(() => {
    if (!enabled || !url) return;
    let alive = true;

    if (cache.has(url)) {
      setData(cache.get(url)); // instant from cache
      setLoading(false);
    } else {
      setLoading(true);
    }

    api
      .get(url)
      .then((r) => {
        cache.set(url, r.data);
        if (alive) setData(r.data);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [url, enabled]);

  return { data, loading };
}

// let mutations (add/edit/delete) clear cached lists so they refetch fresh
export function clearCache(prefix) {
  if (!prefix) return cache.clear();
  for (const k of cache.keys()) if (k.startsWith(prefix)) cache.delete(k);
}
