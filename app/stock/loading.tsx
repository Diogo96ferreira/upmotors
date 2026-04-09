import { CarGridSkeleton } from "@/components/cars/car-grid-skeleton";
import { SkeletonBlock } from "@/components/ui/skeleton-block";

export default function StockLoading() {
  return (
    <div className="container-shell pt-32 pb-24">
      <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-6">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-3 w-28" />
          </div>
          <CarGridSkeleton />
        </div>
      </div>
    </div>
  );
}
