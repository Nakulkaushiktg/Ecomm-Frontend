import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// A thin loading line at the very top that fills on every page navigation —
// gives an instant "something's happening / it's fast" feel.
export default function TopProgressBar() {
  const { pathname } = useLocation();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setWidth(12);
    const t1 = setTimeout(() => setWidth(70), 120);
    const t2 = setTimeout(() => setWidth(90), 380);
    const t3 = setTimeout(() => setWidth(100), 650);
    const t4 = setTimeout(() => setVisible(false), 850);
    const t5 = setTimeout(() => setWidth(0), 1000);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [pathname]);

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[100] h-[3px] w-full transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="h-full bg-gradient-to-r from-gold via-maroon to-gold shadow-[0_0_8px_rgba(123,45,38,0.5)] transition-all duration-300 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
