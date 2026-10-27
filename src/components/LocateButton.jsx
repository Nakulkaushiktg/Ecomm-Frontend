// "Use my current location" button + hint line, used with useAddressAutofill.
export default function LocateButton({ onClick, locating, message }) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={locating}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-maroon/30 bg-maroon/5 px-4 py-2.5 text-sm font-semibold text-maroon transition hover:bg-maroon/10 disabled:opacity-60"
      >
        {locating ? "Detecting your location…" : "📍 Use my current location"}
      </button>
      {message && <p className="mt-2 text-xs text-ink/60">{message}</p>}
    </div>
  );
}
