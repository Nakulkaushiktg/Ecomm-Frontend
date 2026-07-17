// Clones a product image and animates it flying into the cart icon.
// The cart icon in the navbar must have id="cart-fly-target".
export default function flyToCart(sourceImg) {
  const target = document.getElementById("cart-fly-target");
  if (!sourceImg || !target) return;

  const s = sourceImg.getBoundingClientRect();
  const t = target.getBoundingClientRect();

  const clone = sourceImg.cloneNode(true);
  Object.assign(clone.style, {
    position: "fixed",
    left: `${s.left}px`,
    top: `${s.top}px`,
    width: `${s.width}px`,
    height: `${s.height}px`,
    objectFit: "cover",
    borderRadius: "14px",
    zIndex: 9999,
    pointerEvents: "none",
    boxShadow: "0 12px 30px -8px rgba(91,33,28,0.5)",
  });
  document.body.appendChild(clone);

  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);

  clone.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1, offset: 0 },
      // pop outward first
      { transform: "translate(0,-14px) scale(1.18)", opacity: 1, offset: 0.18 },
      // then shrink and fly to the cart
      { transform: `translate(${dx}px, ${dy}px) scale(0.12)`, opacity: 0.35, offset: 1 },
    ],
    { duration: 850, easing: "cubic-bezier(0.5,-0.2,0.5,1)" }
  );
  setTimeout(() => clone.remove(), 870);

  // little bump on the cart icon when it "lands"
  setTimeout(() => {
    target.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" }],
      { duration: 400, easing: "ease-out" }
    );
  }, 700);
}
