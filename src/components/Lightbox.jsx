import { useEffect } from "react";

// Full-screen image viewer. Click anywhere (or the ✕, or press Esc) to close.
// Pass `src` to open; `null`/empty keeps it closed.
export default function Lightbox({ src, onClose }) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    // lock background scroll while open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
      style={{ animation: "fadeIn .2s ease" }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-cream/90 text-xl text-maroon shadow-soft transition hover:scale-110"
      >
        ✕
      </button>
      <img
        src={src}
        alt="Full view"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
        style={{ animation: "pop-in .3s cubic-bezier(0.22,1,0.36,1)" }}
      />
    </div>
  );
}
