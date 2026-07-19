import { next } from "@vercel/edge";

// Vercel Edge Middleware: gives social crawlers (WhatsApp, Facebook, etc.) a
// product-specific link preview (image, name, price). Real users are untouched —
// they always get the normal SPA.

export const config = { matcher: ["/product/:slug*", "/sitemap.xml"] };

const BOT_RE =
  /facebookexternalhit|Facebot|Twitterbot|WhatsApp|Slackbot|LinkedInBot|Pinterest|TelegramBot|Discordbot|Googlebot|bingbot|redditbot|Applebot|vkShare|Embedly|W3C_Validator|Iframely/i;

const BACKEND = "https://ecomm-backend-rxxp.onrender.com";
const SITE = "https://kirti-thread-art.vercel.app";

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

async function buildSitemap() {
  const staticPages = [
    "", "/shop", "/about", "/contact", "/track",
    "/info/faq", "/info/shipping", "/info/refund", "/info/privacy", "/info/terms",
  ];
  let urls = staticPages.map((p) => `${SITE}${p}`);
  try {
    const [pr, cr] = await Promise.all([
      fetch(`${BACKEND}/api/products`),
      fetch(`${BACKEND}/api/categories`),
    ]);
    if (pr.ok) urls = urls.concat((await pr.json()).map((p) => `${SITE}/product/${p.slug}`));
    if (cr.ok) urls = urls.concat((await cr.json()).map((c) => `${SITE}/shop/${c.key}`));
  } catch {
    /* static pages only */
  }
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${esc(u)}</loc><changefreq>weekly</changefreq></url>`).join("\n") +
    "\n</urlset>";
  return new Response(xml, {
    headers: { "content-type": "application/xml", "cache-control": "public, max-age=3600" },
  });
}

export default async function middleware(req) {
  const url = new URL(req.url);

  // dynamic sitemap for search engines
  if (url.pathname === "/sitemap.xml") {
    return buildSitemap();
  }

  const ua = req.headers.get("user-agent") || "";
  // only intercept known social/crawler bots — everyone else gets the SPA
  if (!BOT_RE.test(ua)) return next();

  const slug = url.pathname.split("/").filter(Boolean).pop();
  try {
    const r = await fetch(`${BACKEND}/api/products/${slug}`);
    if (!r.ok) return next();
    const p = await r.json();

    let img = (p.images && p.images[0]) || `${SITE}/home.png`;
    if (!/^https?:\/\//.test(img)) img = BACKEND + img; // make relative uploads absolute

    const fv = p.variants && p.variants.length ? p.variants[0] : null;
    const price = fv && fv.price > 0 ? fv.price : p.price;
    const title = `${p.name} · ₹${Math.round(price)} — Kirti Thread Art`;
    const desc = (p.description || "Handmade with love by Indian artisans.").slice(0, 160);
    const pageUrl = `${SITE}/product/${slug}`;

    const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="Kirti Thread Art">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(img)}">
<meta property="og:url" content="${esc(pageUrl)}">
<meta property="product:price:amount" content="${Math.round(price)}">
<meta property="product:price:currency" content="INR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(img)}">
</head><body>
<h1>${esc(p.name)}</h1>
<p>${esc(desc)}</p>
<img src="${esc(img)}" alt="${esc(p.name)}" width="600">
<p><a href="${esc(pageUrl)}">View on Kirti Thread Art</a></p>
</body></html>`;

    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=600" },
    });
  } catch {
    return next();
  }
}
