import { SkeletonBlock } from "@/components/ui/skeleton-block";

export function CarGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden border border-white/8 bg-zinc-950">
          <SkeletonBlock className="aspect-[4/3] w-full" />
          <div className="space-y-5 p-6">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-8 w-2/3" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
            <SkeletonBlock className="h-px w-full" />
            <SkeletonBlock className="h-8 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
