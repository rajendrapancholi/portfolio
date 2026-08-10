export default function LoadingBlog() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-2 animate-fade-in">
        {/* Meta row */}
        <div className="py-0.5 mt-2 mb-3 border-b border-border/50">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-4 w-48 sm:w-72 rounded loading-md" />
            <div className="h-6 w-40 rounded-md loading-md" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 space-y-4">
          <div className="h-10 md:h-14 w-3/4 max-w-2xl rounded-lg loading-md" />
          <div className="h-1.5 w-24 rounded-full loading-md" />
        </div>

        {/* Body */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="h-4 rounded loading-md opacity-0 animate-fade-in-up"
              style={{
                width: i % 3 === 0 ? '60%' : i % 2 === 0 ? '90%' : '100%',
                animationDelay: `${i * 60}ms`,
                animationFillMode: 'both',
              }}
            />
          ))}

          {/* Image placeholder */}
          <div className="h-48 w-full max-w-3xl rounded-xl loading-md mt-8 border border-border" />

          {[8, 9, 10, 11].map((i) => (
            <div
              key={i}
              className="h-4 rounded loading-md opacity-0 animate-fade-in-up"
              style={{
                width: i % 2 === 0 ? '85%' : '70%',
                animationDelay: `${i * 60}ms`,
                animationFillMode: 'both',
              }}
            />
          ))}
        </div>
      </div>

      <div className="hidden xl:block w-12 shrink-0" />
    </div>
  );
}
