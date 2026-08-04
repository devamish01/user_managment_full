const CardSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-border bg-card">
    <div className="h-1.5 w-full animate-pulse bg-muted" />
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 rounded bg-muted animate-pulse" />
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
        </div>
      </div>

      <div className="h-3 w-full rounded bg-muted animate-pulse" />

      <div className="grid grid-cols-2 gap-2">
        <div className="h-10 rounded bg-muted animate-pulse" />
        <div className="h-10 rounded bg-muted animate-pulse" />
      </div>
    </div>
  </div>
);

const PermissionSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="flex items-center justify-between mb-5">
      <div className="h-5 w-40 rounded bg-muted animate-pulse" />
      <div className="h-8 w-24 rounded bg-muted animate-pulse" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="space-y-2 flex-1">
            <div className="h-3 w-32 rounded bg-muted animate-pulse" />
            <div className="h-2 w-24 rounded bg-muted animate-pulse" />
          </div>

          <div className="h-6 w-10 rounded-full bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

export const RolesSkeleton = () => (
  <div className="space-y-6">

    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-7 w-56 rounded bg-muted animate-pulse" />
        <div className="h-3 w-72 rounded bg-muted animate-pulse" />
      </div>

      <div className="flex gap-2">
        <div className="h-9 w-10 rounded bg-muted animate-pulse" />
        <div className="h-9 w-32 rounded bg-muted animate-pulse" />
      </div>
    </div>

    {/* Role Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>

    {/* Selected Role */}
    <PermissionSkeleton />

  </div>
);