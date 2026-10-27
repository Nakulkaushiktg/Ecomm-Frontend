// India Post's free pincode API (no key). Each result is a post office / area:
// { name: "Karol Bagh", pincode: "110005", city: "Central Delhi", state: "Delhi" }
const BASE = "https://api.postalpincode.in";

async function get(path) {
  const r = await fetch(BASE + path);
  const [res] = await r.json();
  return res?.Status === "Success" ? res.PostOffice || [] : [];
}

function toItems(offices) {
  const seen = new Set();
  const out = [];
  for (const po of offices) {
    const key = `${po.Name}|${po.Pincode}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name: po.Name, pincode: po.Pincode, city: po.District, state: po.State });
  }
  return out;
}

// all areas under a full 6-digit pincode
export async function lookupPincode(pin) {
  return toItems(await get(`/pincode/${pin}`));
}

// areas whose name matches the text (partial names work, e.g. "karol")
export async function searchPlaces(text, limit = 8) {
  const q = text.trim().toLowerCase();
  const items = toItems(await get(`/postoffice/${encodeURIComponent(q)}`));
  // names starting with what was typed first
  items.sort((a, b) => b.name.toLowerCase().startsWith(q) - a.name.toLowerCase().startsWith(q));
  return items.slice(0, limit);
}
