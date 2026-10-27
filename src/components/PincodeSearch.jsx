import { useEffect, useRef, useState } from "react";
import { lookupPincode, searchPlaces } from "../lib/indiaPost.js";

// Pincode box with suggestions, like Flipkart/Amazon:
//  - type a 6-digit pincode -> city & state fill in, list shows its areas
//  - type an area name (3+ letters) -> list of matching areas with pincodes
// Picking an area fills pincode, city, state (and the address if it's empty).
// setForm: React state setter of a form with address/city/state/pincode keys.
export default function PincodeSearch({ pincode, setForm }) {
  const [query, setQuery] = useState(pincode || "");
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [status, setStatus] = useState(""); // "" | "loading" | "none"
  const timer = useRef(null);
  const reqId = useRef(0); // ignore responses that arrive after newer typing

  // follow outside changes (saved address loaded, "use my location", a pick)
  useEffect(() => {
    setQuery((q) => (/[a-z]/i.test(q) && !pincode ? q : pincode || ""));
  }, [pincode]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const reset = () => {
    reqId.current++;
    setItems([]);
    setOpen(false);
    setStatus("");
  };

  const run = (fetchList) => {
    const id = ++reqId.current;
    setStatus("loading");
    fetchList()
      .then((list) => {
        if (id !== reqId.current) return;
        setItems(list);
        setActive(-1);
        setStatus(list.length ? "" : "none");
        setOpen(true);
      })
      .catch(() => {
        // offline / service down: customer just types city & state
        if (id === reqId.current) reset();
      });
  };

  const onChange = (e) => {
    const text = e.target.value;
    clearTimeout(timer.current);

    if (/^[\d\s]*$/.test(text)) {
      const pin = text.replace(/\D/g, "").slice(0, 6);
      setQuery(pin);
      setForm((f) => ({ ...f, pincode: pin }));
      if (pin.length !== 6) return reset();
      run(async () => {
        const list = await lookupPincode(pin);
        if (list.length) {
          const { city, state } = list[0];
          setForm((f) => (f.pincode === pin ? { ...f, city, state } : f));
        }
        return list;
      });
      return;
    }

    // typing a place name — the pincode isn't known until they pick one
    setQuery(text);
    setForm((f) => (f.pincode ? { ...f, pincode: "" } : f));
    if (text.trim().length < 3) return reset();
    timer.current = setTimeout(() => run(() => searchPlaces(text)), 350);
  };

  const pick = (it) => {
    setForm((f) => ({
      ...f,
      pincode: it.pincode,
      city: it.city,
      state: it.state,
      address: f.address?.trim() ? f.address : it.name,
    }));
    setQuery(it.pincode);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open || !items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? items.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      pick(items[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        className="input pr-8"
        value={query}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => (items.length || status === "none") && setOpen(true)}
        onBlur={() => setOpen(false)}
        placeholder="Pincode or area name, e.g. 110005 or Karol Bagh"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {status === "loading" && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-ink/40">◌</span>
      )}
      {open && (items.length > 0 || status === "none") && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-auto rounded-xl border border-sand bg-white py-1 shadow-soft"
        >
          {items.map((it, i) => (
            <li
              key={`${it.name}-${it.pincode}`}
              role="option"
              aria-selected={i === active}
              // mousedown (not click) so the input's blur doesn't close the list first
              onMouseDown={(e) => {
                e.preventDefault();
                pick(it);
              }}
              className={`cursor-pointer px-3 py-2 text-sm hover:bg-maroon/5 ${i === active ? "bg-maroon/5" : ""}`}
            >
              <div className="font-medium text-ink">{it.name}</div>
              <div className="text-xs text-ink/50">
                {it.pincode} · {it.city}, {it.state}
              </div>
            </li>
          ))}
          {status === "none" && (
            <li className="px-3 py-2 text-sm text-ink/50">No matching area or pincode found</li>
          )}
        </ul>
      )}
    </div>
  );
}
