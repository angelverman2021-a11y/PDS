export function SkeletonCard({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-100 rounded-2xl ${className}`} />
  );
}

export function SkeletonSummaryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-100 animate-pulse rounded-2xl p-4 h-28" />
      ))}
    </div>
  );
}

export function SkeletonShopGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div className="flex justify-between">
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
            <div className="w-16 h-5 bg-gray-100 rounded-full" />
          </div>
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 bg-gray-100 rounded-lg" />
            <div className="h-12 bg-gray-100 rounded-lg" />
          </div>
          <div className="h-9 bg-gray-100 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonReceiptList() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="h-16 bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="h-8 bg-gray-100 rounded" />
              <div className="h-8 bg-gray-100 rounded" />
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-6 w-20 bg-gray-100 rounded-full" />
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <div className="h-8 w-16 bg-gray-100 rounded" />
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-gray-100 rounded-xl" />
                <div className="h-8 w-20 bg-gray-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
