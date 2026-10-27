import { useRef, useState } from "react";

// Address auto-fill like Amazon/Flipkart — both services are free, no API key:
//  - pincode -> city + state via India Post (api.postalpincode.in)
//  - "Use my current location" -> browser GPS, turned into an address with
//    OpenStreetMap Nominatim (free; fine for a small store's traffic)
// Location is only requested when the customer taps the button.

export async function lookupPincode(pin) {
  const r = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
  const [res] = await r.json();
  const po = res?.Status === "Success" ? res.PostOffice?.[0] : null;
  return po ? { city: po.District, state: po.State } : null;
}

export async function reverseGeocode(lat, lon) {
  const url =
    "https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=en" +
    `&lat=${lat}&lon=${lon}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("lookup failed");
  const a = (await r.json()).address || {};
  const area = [a.house_number, a.road, a.neighbourhood || a.suburb || a.village]
    .filter(Boolean)
    .join(", ");
  return {
    area,
    // e.g. "Mumbai City District" -> "Mumbai"
    city: (a.city || a.town || a.state_district || a.county || a.village || "")
      .replace(/\s+(city\s+)?district$/i, ""),
    state: a.state || "",
    pincode: (a.postcode || "").replace(/\D/g, "").slice(0, 6),
  };
}

function currentPosition() {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    })
  );
}

// setForm must accept a function (React state setter). The form needs
// address / city / state / pincode keys.
export default function useAddressAutofill(setForm) {
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState(""); // hint or error under the fields
  const lastPin = useRef("");

  // call from the pincode input's onChange
  const onPincodeChange = (e) => {
    const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
    setForm((f) => ({ ...f, pincode: pin }));
    if (pin.length !== 6 || pin === lastPin.current) return;
    lastPin.current = pin;
    lookupPincode(pin)
      .then((hit) => {
        if (hit) {
          setForm((f) => (f.pincode === pin ? { ...f, ...hit } : f));
          setMessage("");
        } else {
          setMessage("Pincode not found — please check it.");
        }
      })
      .catch(() => {}); // offline / service down: customer just types city & state
  };

  const detectLocation = async () => {
    setMessage("");
    if (!("geolocation" in navigator)) {
      setMessage("Location isn't supported on this browser. Please type your address.");
      return;
    }
    setLocating(true);
    try {
      const pos = await currentPosition();
      const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      lastPin.current = loc.pincode;
      setForm((f) => ({
        ...f,
        // keep anything already typed in the address box
        address: f.address?.trim() ? f.address : loc.area,
        city: loc.city || f.city,
        state: loc.state || f.state,
        pincode: loc.pincode || f.pincode,
      }));
      setMessage("📍 Location filled (map data © OpenStreetMap) — please add your house / flat no. and landmark.");
    } catch (err) {
      setMessage(
        err?.code === 1
          ? "Location permission was blocked. Allow it from the 🔒 icon in the address bar, or type your address."
          : "Couldn't get your location. Please type your address."
      );
    } finally {
      setLocating(false);
    }
  };

  return { onPincodeChange, detectLocation, locating, message };
}
