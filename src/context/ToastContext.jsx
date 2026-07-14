import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

let seq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // notify("Added to cart", "cart") — icon is optional
  const notify = useCallback((message, icon = "✓") => {
    const id = ++seq;
    setToasts((t) => [...t, { id, message, icon }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {/* toast stack, bottom-center */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[120] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-pop flex items-center gap-2.5 rounded-full bg-maroon px-5 py-3 text-sm font-medium text-cream shadow-[0_16px_40px_-12px_rgba(91,33,28,0.6)] ring-1 ring-gold/30"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-xs text-ink">
              {t.icon}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
