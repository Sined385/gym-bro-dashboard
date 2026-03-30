export default function Loading() {
  return (
    <div className="space-y-6">
      {/* KPI skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-900" />
        ))}
      </div>
      {/* Charts skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-72 animate-pulse rounded-xl bg-gray-900" />
        <div className="h-72 animate-pulse rounded-xl bg-gray-900" />
      </div>
      <div className="h-72 animate-pulse rounded-xl bg-gray-900" />
      <div className="h-96 animate-pulse rounded-xl bg-gray-900" />
    </div>
  );
}
