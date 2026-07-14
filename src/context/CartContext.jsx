import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// a cart line is identified by product id + chosen variant
const lineKey = (id, variant) => `${id}__${variant || ""}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // available stock for the chosen variant (falls back to product stock)
  const stockFor = (product, size, color) => {
    if (product.variants?.length) {
      return product.variants.find((v) => v.size === size && v.color === color)?.stock ?? 0;
    }
    return product.stock ?? Infinity;
  };

  const add = (product, qty = 1, variant = "", size = "", color = "") => {
    const key = lineKey(product.id, variant);
    const stock = stockFor(product, size, color);
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) {
        // never let the combined quantity exceed available stock
        return prev.map((i) =>
          i.key === key
            ? { ...i, stock, quantity: Math.min(i.quantity + qty, stock) }
            : i
        );
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          variant,
          size,
          color,
          stock,
          quantity: Math.min(qty, stock),
        },
      ];
    });
  };

  const setQty = (key, qty) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.key === key
            ? { ...i, quantity: Math.min(Math.max(1, qty), i.stock ?? Infinity) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );

  const remove = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const clear = () => setItems([]);

  // total quantity of a given product (across variants) — for stock checks on cards
  const qtyOf = (id) =>
    items.filter((i) => i.id === id).reduce((s, i) => s + i.quantity, 0);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, add, setQty, remove, clear, count, total, qtyOf }}
    >
      {children}
    </CartContext.Provider>
  );
}
