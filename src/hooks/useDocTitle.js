import { useEffect } from "react";

const BASE = "Kirti Thread Art";

// Sets the browser tab / document title for a page, restoring the base on unmount.
export default function useDocTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} · Woolen & Sacred Crafts`;
    return () => {
      document.title = `${BASE} · Woolen & Sacred Crafts`;
    };
  }, [title]);
}
