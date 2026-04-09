import { supabase } from "@/lib/supabase";
import { Car } from "@/types/car";
import { CarRow } from "@/types/database";

function normalizeCar(row: CarRow): Car {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    version: row.version ?? undefined,
    price: row.price,
    year: row.year,
    mileage_km: row.mileage_km,
    fuel: row.fuel,
    transmission: row.transmission,
    power_hp: row.power_hp ?? undefined,
    image: row.image,
    category: row.category,
    description: row.description,
    shortDescription:
      row.shortDescription ?? "Viatura disponível para consulta com dossier técnico detalhado.",
    gallery: row.gallery ?? [],
    highlight:
      row.highlight ?? "Curadoria técnica concluída pela equipa Up Motors com foco em transparência.",
    monthlyLabel: row.monthlyLabel ?? undefined,
    featured: row.featured ?? false,
    specs: {
      engine: row.specs?.engine ?? "Por validar",
      drivetrain: row.specs?.drivetrain ?? "Por validar",
      acceleration: row.specs?.acceleration ?? "Por validar",
      exterior: row.specs?.exterior ?? "Por validar",
      interior: row.specs?.interior ?? "Por validar",
      location: row.specs?.location ?? "Coimbra",
    },
  };
}

export async function getCars(): Promise<Car[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar carros:", error);
    return [];
  }

  return ((data ?? []) as CarRow[]).map(normalizeCar);
}

export async function getFeaturedCars() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Erro ao carregar destaques:", error);
    return [];
  }

  return ((data ?? []) as CarRow[]).map(normalizeCar);
}

export async function getCarById(id: string) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("cars").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("Erro ao carregar detalhe do carro:", error);
    return null;
  }

  return data ? normalizeCar(data as CarRow) : null;
}

export async function getSimilarCars(id: string) {
  const currentCar = await getCarById(id);

  if (!currentCar || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("category", currentCar.category)
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Erro ao carregar carros similares:", error);
    return [];
  }

  const sameCategory = ((data ?? []) as CarRow[]).map(normalizeCar);

  if (sameCategory.length > 0) {
    return sameCategory;
  }

  const fallbackCars = await getCars();
  return fallbackCars.filter((car) => car.id !== id).slice(0, 3);
}
