import { supabase } from "@/lib/supabase";
import { Car } from "@/types/car";
import { CarImageRow, CarRow } from "@/types/database";

const CARS_SELECT = `
  *,
  car_images (
    id,
    url,
    is_feature,
    position,
    alt_text
  )
`;

function sortCarImages(images: CarImageRow[] = []) {
  return [...images].sort((a, b) => (a.position ?? 9999) - (b.position ?? 9999));
}

function normalizeCar(row: CarRow): Car {
  const sortedImages = sortCarImages(row.car_images ?? []);
  const featureImage =
    sortedImages.find((image) => image.is_feature) ?? sortedImages[0];
  const orderedGallery = sortedImages.map((image) => image.url);
  const fallbackGallery = row.gallery ?? [];
  const image = featureImage?.url ?? orderedGallery[0] ?? row.image ?? "";
  const rawGallery = orderedGallery.length > 0 ? orderedGallery : fallbackGallery;
  const gallery = Array.from(
    new Set(rawGallery.filter((galleryImage) => galleryImage && galleryImage !== image))
  );

  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    version: row.version ?? undefined,
    price: row.price,
    year: row.year,
    mileage_km: row.mileage_km,
    fuel: row.fuel,
    transmission: row.transmission,
    power_hp: row.power_hp ?? undefined,
    image,
    category: row.category,
    description: row.description,
    shortDescription:
      row.shortDescription ?? "Viatura disponível para consulta com dossier técnico detalhado.",
    gallery,
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
    .select(CARS_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar carros:", error);
    return [];
  }

  return ((data ?? []) as CarRow[]).map(normalizeCar);
}

export async function getFeaturedCars() {
  const cars = await getCars();
  const featuredCars = cars.filter((car) => car.featured).slice(0, 3);

  if (featuredCars.length > 0) {
    return featuredCars;
  }

  return cars.slice(0, 3);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function getCarBySlug(slugOrId: string) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("cars")
    .select(CARS_SELECT)
    .eq("slug", slugOrId)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar detalhe do carro:", error);
    return null;
  }

  if (data) {
    return normalizeCar(data as CarRow);
  }

  if (!isUuid(slugOrId)) {
    return null;
  }

  const fallback = await supabase.from("cars").select(CARS_SELECT).eq("id", slugOrId).maybeSingle();

  if (fallback.error) {
    console.error("Erro ao carregar detalhe do carro:", fallback.error);
    return null;
  }

  return fallback.data ? normalizeCar(fallback.data as CarRow) : null;
}

export async function getSimilarCars(slugOrId: string) {
  const currentCar = await getCarBySlug(slugOrId);

  if (!currentCar) {
    return [];
  }

  const fallbackCars = await getCars();
  const sameBrand = fallbackCars
    .filter((car) => car.id !== currentCar.id && car.brand === currentCar.brand)
    .slice(0, 3);

  if (sameBrand.length > 0) {
    return sameBrand;
  }

  return fallbackCars.filter((car) => car.id !== currentCar.id).slice(0, 3);
}
