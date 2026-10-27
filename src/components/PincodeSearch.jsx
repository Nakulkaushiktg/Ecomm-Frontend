import { useEffect, useRef, useState } from "react";
import { lookupPincode, searchPlaces } from "../lib/indiaPost.js";

// Pincode box with live suggestions, like Flipkart/Amazon:
//  - type an area name -> matching areas with pincodes, updating as you type
//  - type a 6-digit pincode -> city & state fill in, list shows its areas
// Picking an area fills pincode, city, state and adds the area to the address.
// setForm: React state setter of a form with address/city/state/pincode keys.

const cache = new Map(); // query -> results, shared across the page
const MIN_LETTERS = 3;

// best instant guess while the API answers: filter the results of the longest
// already-fetched prefix (e.g. "karo" -> "karol")
function fromCache(q) {
  for (let n = q.length; n >= MIN_LETTERS; n--) {
    const hit = cache.get(q.slice(0, n));
    if (hit) return n === q.length ? hit : hit.filter((it) => it.name.toLowerCase().includes(q));
  }
  return null;
}

// put the picked area into the address: replace the area we added last time,
// otherwise add it after whatever the customer typed (house no., street...)
function withArea(address, area, prevArea) {
  const a = (address || "").trim();
  if (prevArea) {
    if (a === prevArea) return area;
    if (a.endsWith(", " + prevArea)) return a.slice(0, -prevArea.length) + area;
  }
  if (!a) return area;
  if (a.toLowerCase().includes(area.toLowerCase())) return a;
  return `${a}, ${area}`;
}

export default function PincodeSearch({ pincode, setForm }) {
  const [query, setQuery] = useState(pincode || "");
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [status, setStatus] = useState(""); // "" | "loading" | "none" | "hint"
  const timer = useRef(null);
  const reqId = useRef(0); // ignore responses that arrive after newer typing
  const lastArea = useRef("");

  // follow outside changes (saved address loaded, "use my location", a pick)
  useEffect(() => {
    setQuery((q) => (/[a-z]/i.test(q) && !pincode ? q : pincode || ""));
  }, [pincode]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = (list, st) => {
    setItems(list);
    setActive(-1);
    setStatus(st);
    setOpen(true);
  };

  const fetchInto = (key, fetchList) => {
    const id = ++reqId.current;
    fetchList()
      .then((list) => {
        cache.set(key, list);
        if (id === reqId.current) show(list, list.length ? "" : "none");
      })
      .catch(() => {
        // offline / service down: customer just types city & state
        if (id === reqId.current) show([], "none");
      });
  };

  const onChange = (e) => {
    const text = e.target.value;
    clearTimeout(timer.current);
    reqId.current++; // drop any answer for older text

    if (/^[\d\s]*$/.test(text)) {
      const pin = text.replace(/\D/g, "").slice(0, 6);
      setQuery(pin);
      setForm((f) => ({ ...f, pincode: pin }));
      if (!pin) return setOpen(false);
      if (pin.length < 6) return show([], "hint");
      const fill = (list) => {
        if (list.length) {
          const { city, state } = list[0];
          setForm((f) => (f.pincode === pin ? { ...f, city, state } : f));
        }
        return list;
      };
      if (cache.has(pin)) return show(fill(cache.get(pin)), cache.get(pin).length ? "" : "none");
      show([], "loading");
      fetchInto(pin, async () => fill(await lookupPincode(pin)));
      return;
    }

    // typing a place name — the pincode isn't known until they pick one
    setQuery(text);
    setForm((f) => (f.pincode ? { ...f, pincode: "" } : f));
    const q = text.trim().toLowerCase();
    if (q.length < MIN_LETTERS) return show([], "hint");
    const guess = fromCache(q);
    if (cache.has(q)) return show(guess, guess.length ? "" : "none");
    show(guess || [], "loading"); // instant: filtered earlier results + "Searching…"
    timer.current = setTimeout(() => fetchInto(q, () => searchPlaces(q)), 250);
  };

  const pick = (it) => {
    setForm((f) => ({
      ...f,
      pincode: it.pincode,
      city: it.city,
      state: it.state,
      address: withArea(f.address, it.name, lastArea.current),
    }));
    lastArea.current = it.name;
    setQuery(it.pincode);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") return setOpen(false);
    if (!open) return;
    if (e.key === "Enter") {
      // never submit the whole form from here; pick the highlighted (or first) area
      e.preventDefault();
      if (items.length) pick(items[active >= 0 ? active : 0]);
      return;
    }
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? items.length - 1 : i - 1));
    }
  };

  const hint = /^\d+$/.test(query)
    ? "Keep typing — enter the full 6-digit pincode"
    : `Type at least ${MIN_LETTERS} letters of your area`;

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
      {open && (
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
          {status === "loading" && <li className="px-3 py-2 text-sm text-ink/50">Searching…</li>}
          {status === "hint" && <li className="px-3 py-2 text-sm text-ink/50">{hint}</li>}
          {status === "none" && (
            <li className="px-3 py-2 text-sm text-ink/50">No matching area or pincode found</li>
          )}
        </ul>
      )}
    </div>
  );
}
