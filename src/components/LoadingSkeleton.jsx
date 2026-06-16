export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-24 bg-surface-2 rounded-xl mb-4" />
      <div className="h-5 bg-surface-2 rounded w-3/4 mb-2" />
      <div className="h-4 bg-surface-2 rounded w-1/2 mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-surface-2 rounded w-full" />
        <div className="h-3 bg-surface-2 rounded w-2/3" />
      </div>
      <div className="h-10 bg-surface-2 rounded-xl mt-4" />
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-surface-2 rounded w-24" />
          <div className="h-8 bg-surface-2 rounded w-16" />
        </div>
        <div className="w-12 h-12 bg-surface-2 rounded-2xl" />
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-8 h-8 bg-surface-2 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-surface-2 rounded w-32" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-24 bg-surface-2 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-8 animate-pulse">
      <div className="h-8 bg-surface-2 rounded w-1/3" />
      <div className="h-4 bg-surface-2 rounded w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <StatsSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
