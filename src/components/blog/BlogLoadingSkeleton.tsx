import LoadingAbsoluteDots from './LoadingAbsoluteDots';

export default function Loading() {
  const skeletons = Array.from({ length: 6 });

  return (
    <section className="max-w-8xl relative mx-auto px-4 sm:px-6 py-8">
      <div className="sticky top-2/5">
        <LoadingAbsoluteDots />
      </div>

      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div className="space-y-4">
          <div className="h-12 w-64 rounded-lg loading-md" />
          <div className="h-6 w-full max-w-md rounded-md loading-md" />
        </div>
        <div className="h-1 w-24 bg-muted rounded-full hidden md:block mb-2" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden"
          >
            <div className="h-52 sm:h-60 w-full loading-md" />

            <div className="p-5 sm:p-6 flex flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-20 rounded loading-md" />
                <div className="h-1 w-1 bg-border rounded-full" />
                <div className="h-3 w-24 rounded loading-md" />
              </div>

              <div className="space-y-2">
                <div className="h-6 w-full rounded-md loading-md" />
                <div className="h-6 w-2/3 rounded-md loading-md" />
              </div>

              <div className="space-y-2">
                <div className="h-4 w-full rounded loading-md" />
                <div className="h-4 w-full rounded loading-md" />
                <div className="h-4 w-4/5 rounded loading-md" />
              </div>

              <div className="pt-3 border-t border-border">
                <div className="h-4 w-28 rounded bg-primary/10 loading-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
