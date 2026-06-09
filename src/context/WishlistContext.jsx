import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "./AuthContext.jsx";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const { isAuthed } = useAuth();
  const [ids, setIds] = useState([]);

  // load the logged-in customer's wishlist; clear it on logout
  useEffect(() => {
    if (!isAuthed) {
      setIds([]);
      return;
    }
    api
      .get("/api/auth/wishlist")
      .then((r) => setIds(r.data))
      .catch(() => setIds([]));
  }, [isAuthed]);

  const has = (id) => ids.includes(id);

  // returns false if the user isn't logged in (caller should prompt login)
  const toggle = (id) => {
    if (!isAuthed) return false;
    if (ids.includes(id)) {
      setIds((prev) => prev.filter((x) => x !== id));
      api.delete(`/api/auth/wishlist/${id}`).catch(() => {});
    } else {
      setIds((prev) => [...prev, id]);
      api.post(`/api/auth/wishlist/${id}`).catch(() => {});
    }
    return true;
  };

  return (
    <WishlistContext.Provider value={{ ids, has, toggle, count: ids.length, isAuthed }}>
      {children}
    </WishlistContext.Provider>
  );
}
