"use client";

export default function Loading() {
  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <div className="animate-pulse space-y-6 mt-4 md:mt-8">
          {/* Heading skeleton */}
          <div className="h-8 w-48 bg-black/5 rounded" />

          {/* Content cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[20px] border border-black/10 p-5 md:p-6 space-y-4"
              >
                <div className="aspect-square bg-black/5 rounded-[20px]" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-black/5 rounded" />
                  <div className="h-4 w-1/2 bg-black/5 rounded" />
                </div>
                <div className="h-5 w-20 bg-black/5 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
