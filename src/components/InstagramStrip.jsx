import useCachedGet from "../hooks/useCachedGet.js";

// "Follow us on Instagram" band — only shows if the admin has set an Instagram URL.
export default function InstagramStrip() {
  const { data: cfg } = useCachedGet("/api/orders/config");
  const url = cfg?.instagram_url;
  if (!url) return null;

  // pull a clean @handle from the url for display
  const handle = url.replace(/\/+$/, "").split("/").pop();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-sand bg-sand/40 px-6 py-10 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-2xl text-white shadow-soft">
          {/* instagram glyph */}
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" className="fill-current" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl text-maroon">Follow us on Instagram</h2>
        <p className="max-w-md text-ink/60">
          New arrivals, handmade moments & behind-the-scenes{handle ? ` — @${handle}` : ""}.
        </p>
        <a href={url} target="_blank" rel="noreferrer" className="btn-primary mt-2">
          {handle ? `Follow @${handle}` : "Follow us"}
        </a>
      </div>
    </section>
  );
}
