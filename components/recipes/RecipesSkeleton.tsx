export function RecipesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(9)].map((_, index) => (
        <div key={index} className="glass rounded-2xl overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="h-64 bg-gray-200"></div>

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>

            {/* Ingredients */}
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>

            {/* Recipe Info */}
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}