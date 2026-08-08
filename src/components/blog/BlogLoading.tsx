export default function BlogLoading() {
  return (
    <div className="flex flex-col gap-3 p-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-8 w-full rounded-lg bg-muted animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}
