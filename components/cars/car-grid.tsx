import { Car } from "@/types/car";
import { CarCard } from "@/components/cars/car-card";

type CarGridProps = {
  cars: Car[];
};

export function CarGrid({ cars }: CarGridProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
