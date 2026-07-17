import { useEffect, useState } from "react";
import { api } from "../api.js";

function fmt(ms) {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = String(Math.floor((total % 86400) / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return d > 0 ? `${d}d ${h}:${m}:${s}` : `${h}:${m}:${s}`;
}

const ts = (v) => (v ? new Date(v).getTime() : 0);

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    api.get("/api/orders/banners").then((r) => setBanners(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // only banners whose time window is currently live
  const live = banners.filter((b) => {
    if (!b.text) return false;
    const s = b.start_at ? ts(b.start_at) : null;
    const e = b.end_at ? ts(b.end_at) : null;
    if (s && now < s) return false;
    if (e && now >= e) return false;
    return true;
  });
  // show only one — a scheduled banner (later start) wins over an always-on one
  live.sort((a, b) => ts(b.start_at) - ts(a.start_at));
  const b = live[0];
  if (!b) return null;

  const end = b.end_at ? ts(b.end_at) : null;
  const countdown = end ? fmt(end - now) : "";

  return (
    <div className="overflow-hidden bg-gradient-to-r from-gold via-gold-light to-gold py-2 text-ink">
      <div className="flex w-max animate-marquee whitespace-nowrap text-sm font-medium tracking-wide">
        {[0, 1].map((n) => (
          <span key={n} className="flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="mx-8 inline-flex items-center gap-2">
                <span className="text-maroon">✦</span>
                {b.text}
                {countdown && (
                  <span className="ml-2 rounded-full bg-maroon px-2 py-0.5 font-mono text-xs font-bold text-cream">
                    ⏳ {countdown}
                  </span>
                )}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
