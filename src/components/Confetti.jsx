import { useEffect, useState } from "react";

const COLORS = ["#7B2D26", "#C39A4B", "#E8C77E", "#2B231E", "#8FBC8F"];

// Lightweight CSS confetti burst (no library). Auto-removes after a few seconds.
export default function Confetti({ count = 70 }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  const pieces = Array.from({ length: count }).map((_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 2.5 + Math.random() * 2,
    color: COLORS[i % COLORS.length],
    w: 6 + Math.random() * 6,
    rot: Math.random() * 360,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: "-6vh",
            left: `${p.left}%`,
            width: `${p.w}px`,
            height: `${p.w * 0.55}px`,
            background: p.color,
            transform: `rotate(${p.rot}deg)`,
            borderRadius: "1px",
            animation: `confetti-fall ${p.dur}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
