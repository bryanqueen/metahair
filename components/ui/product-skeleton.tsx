export function ProductSkeleton() {
  return (
    <div className="group cursor-pointer animate-pulse">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 mb-3 md:mb-4 rounded">
        {/* Empty for image placeholder */}
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="w-full h-10 bg-gray-200 rounded mt-2"></div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </>
  )
}

