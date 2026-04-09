import { SkeletonBlock } from "@/components/ui/skeleton-block";

export default function StockDetailLoading() {
  return (
    <div className="pt-24">
      <section className="container-shell py-16">
        <div className="space-y-6">
          <SkeletonBlock className="h-3 w-32" />
          <SkeletonBlock className="h-16 w-full max-w-3xl" />
          <SkeletonBlock className="h-6 w-full max-w-2xl" />
        </div>
      </section>

      <section className="container-shell grid gap-12 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-28 w-full" />
            ))}
          </div>
          <SkeletonBlock className="h-[28rem] w-full" />
        </div>
        <SkeletonBlock className="h-80 w-full" />
      </section>
    </div>
  );
}
