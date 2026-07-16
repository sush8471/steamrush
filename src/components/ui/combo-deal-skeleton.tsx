"use client";

import { Skeleton } from "@/components/ui/skeleton";

function ComboCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[85vw] max-w-[380px] lg:w-full snap-start">
      <Skeleton className="aspect-[16/9] w-full rounded-lg" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-10 rounded" />
            <Skeleton className="h-5 w-14 rounded" />
          </div>
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function ComboDealSkeleton() {
  return (
    <section className="w-full bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-4 lg:mb-6">
          <div>
            <Skeleton className="h-7 lg:h-8 w-40 rounded mb-2" />
            <Skeleton className="h-3 w-56 rounded" />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-4 overflow-hidden flex gap-3 -mx-4 px-4 lg:mx-0 lg:px-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <ComboCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
