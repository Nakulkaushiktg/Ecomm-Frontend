// Optimizes Cloudinary image URLs on the fly: auto format (webp/avif), auto
// quality, and a capped width — so images download much smaller & faster.
// Non-Cloudinary URLs are returned unchanged.
export function optimizeImg(url, width = 500) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  // don't double-transform
  if (url.includes("/upload/f_auto")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
