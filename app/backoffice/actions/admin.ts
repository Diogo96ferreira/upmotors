"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { CarCategory, CarStatus, LeadStatus } from "@/types/database";

export type CarFormState = {
  error: string;
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNullableText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value || null;
}

function getNumber(formData: FormData, key: string) {
  const raw = getText(formData, key);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function omitColumn<T extends Record<string, unknown>>(payload: T, column: string) {
  const nextPayload = { ...payload };
  delete nextPayload[column as keyof T];
  return nextPayload;
}

function getMissingColumn(error: { code?: string; message?: string } | null) {
  if (!error || error.code !== "PGRST204" || !error.message) {
    return null;
  }

  const match = error.message.match(/Could not find the '([^']+)' column/);
  return match?.[1] ?? null;
}

async function persistCar(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  id: string,
  payload: Record<string, unknown>
) {
  let currentPayload = payload;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const response = id
      ? await supabase.from("cars").update(currentPayload).eq("id", id)
      : await supabase.from("cars").insert(currentPayload);

    if (!response.error) {
      return { error: null };
    }

    const missingColumn = getMissingColumn(response.error);

    if (!missingColumn || !(missingColumn in currentPayload)) {
      return { error: response.error };
    }

    console.warn(`Coluna "${missingColumn}" nao existe em cars. A remover do payload e a tentar novamente.`);
    currentPayload = omitColumn(currentPayload, missingColumn);
  }

  return {
    error: {
      message: "Nao foi possivel adaptar o payload ao schema de cars.",
    },
  };
}

export async function saveCar(
  _prevState: CarFormState,
  formData: FormData
): Promise<CarFormState> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase nao configurado no servidor." };
  }

  const id = getText(formData, "id");
  const brand = getText(formData, "brand");
  const model = getText(formData, "model");
  const year = getNumber(formData, "year");
  const price = getNumber(formData, "price");
  const mileage_km = getNumber(formData, "mileage_km");
  const fuel = getText(formData, "fuel");
  const transmission = getText(formData, "transmission");
  const description = getText(formData, "description");
  const category = getText(formData, "category") as CarCategory;
  const status = getText(formData, "status") as CarStatus;

  if (!brand || !model || !year || price === null || mileage_km === null || !fuel || !transmission || !description) {
    return { error: "Preenche os campos principais da viatura." };
  }

  const slugBase = getText(formData, "slug") || `${brand}-${model}-${year}`;
  const payload: Record<string, unknown> = {
    slug: slugify(slugBase),
    brand,
    model,
    version: getNullableText(formData, "version"),
    price,
    year,
    mileage_km,
    fuel,
    transmission,
    power_hp: getNumber(formData, "power_hp"),
    image: getNullableText(formData, "image"),
    category,
    description,
    shortDescription: getNullableText(formData, "shortDescription"),
    gallery: getText(formData, "gallery")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean),
    highlight: getNullableText(formData, "highlight"),
    monthlyLabel: getNullableText(formData, "monthlyLabel"),
    featured: formData.get("featured") === "on",
    status,
    specs: {
      engine: getNullableText(formData, "spec_engine"),
      drivetrain: getNullableText(formData, "spec_drivetrain"),
      acceleration: getNullableText(formData, "spec_acceleration"),
      exterior: getNullableText(formData, "spec_exterior"),
      interior: getNullableText(formData, "spec_interior"),
      location: getNullableText(formData, "spec_location"),
    },
  };

  const response = await persistCar(supabase, id, payload);

  if (response.error) {
    console.error("Erro ao guardar carro:", response.error);
    return { error: "Nao foi possivel guardar a viatura com o schema atual da tabela cars." };
  }

  revalidatePath("/stock");
  revalidatePath("/backoffice");
  revalidatePath("/backoffice/cars");
  redirect("/backoffice/cars");
}

export async function updateLeadStatus(formData: FormData) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return;
  }

  const id = getText(formData, "id");
  const status = getText(formData, "status") as LeadStatus;

  if (!id || !status) {
    return;
  }

  const { error } = await supabase.from("lead_submissions").update({ status }).eq("id", id);

  if (error) {
    console.error("Erro ao atualizar lead:", error);
    return;
  }

  revalidatePath("/backoffice");
  revalidatePath("/backoffice/leads");
}
