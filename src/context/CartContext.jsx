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

  const add = (product, qty = 1, variant = "", size = "", color = "") => {
    const key = lineKey(product.id, variant);
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + qty } : i
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
          quantity: qty,
        },
      ];
    });
  };

  const setQty = (key, qty) =>
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity: Math.max(1, qty) } : i))
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
