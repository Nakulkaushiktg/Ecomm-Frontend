import { useEffect, useState } from "react";

// Floating button that appears after scrolling down; smooth-scrolls to top.
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-maroon text-lg text-cream shadow-[0_12px_28px_-8px_rgba(91,33,28,0.6)] ring-1 ring-gold/30 transition-all duration-300 hover:-translate-y-1 hover:bg-maroon-dark ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      ↑
    </button>
  );
}
