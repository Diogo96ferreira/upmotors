import { Car } from "@/types/car";
import { CarCard } from "@/components/cars/car-card";
import { EmptyState } from "@/components/ui/empty-state";

type CarGridProps = {
  cars: Car[];
  emptyState?: {
    eyebrow: string;
    title: string;
    description: string;
    action?: {
      href: string;
      label: string;
    };
  };
};

export function CarGrid({ cars, emptyState }: CarGridProps) {
  if (cars.length === 0) {
    return emptyState ? <EmptyState {...emptyState} /> : null;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
