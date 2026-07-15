// Elegant, on-brand loading states.
// <Loader> — spinning thread-spool rings + label, for full-page waits.
// <ProductGridSkeleton> — shimmering product cards, for the shop grid.

export default function Loader({ label = "Loading", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-5 py-24 ${className}`}>
      <div className="loader-ring">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className="flex items-center font-serif text-lg tracking-wide text-maroon/70">
        {label}
        <span className="loader-dots ml-1 text-maroon/50">
          <i></i>
          <i></i>
          <i></i>
        </span>
      </p>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton aspect-square w-full" />
          <div className="space-y-3 p-4">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-6 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
