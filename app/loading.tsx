import { CarGridSkeleton } from "@/components/cars/car-grid-skeleton";
import { SkeletonBlock } from "@/components/ui/skeleton-block";

export default function HomeLoading() {
  return (
    <div className="pt-24">
      <section className="container-shell py-20">
        <div className="space-y-6">
          <SkeletonBlock className="h-3 w-40" />
          <SkeletonBlock className="h-16 w-full max-w-3xl" />
          <SkeletonBlock className="h-6 w-full max-w-2xl" />
          <div className="flex gap-4 pt-4">
            <SkeletonBlock className="h-12 w-40" />
            <SkeletonBlock className="h-12 w-44" />
          </div>
        </div>
      </section>

      <section className="container-shell py-12">
        <CarGridSkeleton />
      </section>
    </div>
  );
}
