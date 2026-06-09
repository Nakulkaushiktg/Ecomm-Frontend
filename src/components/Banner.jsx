import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Banner() {
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    api.get("/api/orders/config").then((r) => setCfg(r.data)).catch(() => {});
  }, []);

  if (!cfg?.banner_active || !cfg?.banner_text) return null;

  return (
    <div className="overflow-hidden bg-gold text-ink">
      <div className="whitespace-nowrap py-2 text-center text-sm font-medium tracking-wide">
        {cfg.banner_text}
      </div>
    </div>
  );
}
