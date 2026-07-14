import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Banner() {
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    api.get("/api/orders/config").then((r) => setCfg(r.data)).catch(() => {});
  }, []);

  if (!cfg?.banner_active || !cfg?.banner_text) return null;

  return (
    <div className="overflow-hidden bg-gradient-to-r from-gold via-gold-light to-gold py-2 text-ink">
      <div className="flex w-max animate-marquee whitespace-nowrap text-sm font-medium tracking-wide">
        {/* rendered twice for a seamless infinite loop */}
        {[0, 1].map((n) => (
          <span key={n} className="flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="mx-8 inline-flex items-center gap-2">
                <span className="text-maroon">✦</span>
                {cfg.banner_text}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
