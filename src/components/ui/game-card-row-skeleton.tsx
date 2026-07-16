"use client";

import { Skeleton } from "@/components/ui/skeleton";

function GameCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[60vw] max-w-[240px]">
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function GameCardRowSkeleton({
  title,
  subtitle,
  count = 6,
}: {
  title: string;
  subtitle: string;
  count?: number;
}) {
  return (
    <section className="w-full bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-4 lg:mb-6">
          <div>
            <Skeleton className="h-7 lg:h-8 w-48 rounded mb-2" />
            <Skeleton className="h-3 w-64 rounded" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex gap-3 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
            {Array.from({ length: count }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
