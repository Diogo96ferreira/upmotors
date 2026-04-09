import { supabase } from "@/lib/supabase";
import { Car } from "@/types/car";

export async function getCars(): Promise<Car[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as Car[];
}

export async function getFeaturedCars() {
  const cars = await getCars();
  return cars.filter((car) => car.featured);
}

export async function getCarById(id: string) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("cars").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data as Car | null;
}

export async function getSimilarCars(id: string) {
  const currentCar = await getCarById(id);

  if (!currentCar) {
    return [];
  }

  const cars = await getCars();
  const sameCategory = cars
    .filter((car) => car.id !== id && car.category === currentCar.category)
    .slice(0, 3);

  if (sameCategory.length > 0) {
    return sameCategory;
  }

  return cars.filter((car) => car.id !== id).slice(0, 3);
}
