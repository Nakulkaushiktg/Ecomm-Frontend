import { useEffect, useRef, useState } from "react";
import useCachedGet from "../hooks/useCachedGet.js";

function Counter({ to, suffix = "", duration = 1400 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out
          setVal(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

export default function StatsBand() {
  const { data: cfg } = useCachedGet("/api/orders/config");
  if (cfg && cfg.show_stats === false) return null;

  const orders = parseInt(cfg?.stat_orders ?? "500", 10) || 500;
  const designs = parseInt(cfg?.stat_designs ?? "50", 10) || 50;
  const stats = [
    { to: 100, suffix: "%", label: "Handmade" },
    { to: orders, suffix: "+", label: "Happy Orders" },
    { to: designs, suffix: "+", label: "Unique Designs" },
    { to: 100, suffix: "%", label: "Pan-India Delivery" },
  ];
  return (
    <section className="bg-gradient-to-br from-maroon to-maroon-dark py-14 text-cream">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
        {stats.map((s) => (
          <div key={`${s.label}-${s.to}`}>
            <div className="font-serif text-4xl font-bold text-gold-light md:text-5xl">
              <Counter to={s.to} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-sm text-cream/80">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
