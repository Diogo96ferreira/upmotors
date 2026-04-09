import { getSupabaseServerClient } from "@/lib/supabase-server";
import { CarRow, LeadSubmissionRow } from "@/types/database";

export async function getAdminCars() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("cars")
    .select("id, slug, brand, model, price, year, status, featured, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar carros do backoffice:", error);
    return [];
  }

  return (data ?? []) as Pick<
    CarRow,
    "id" | "slug" | "brand" | "model" | "price" | "year" | "status" | "featured" | "created_at"
  >[];
}

export async function getAdminCarById(id: string) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("cars").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("Erro ao carregar carro no backoffice:", error);
    return null;
  }

  return (data as CarRow | null) ?? null;
}

export async function getLeadSubmissions() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("lead_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar leads:", error);
    return [];
  }

  return (data ?? []) as LeadSubmissionRow[];
}

export async function getBackofficeStats() {
  const [cars, leads] = await Promise.all([getAdminCars(), getLeadSubmissions()]);

  return {
    totalCars: cars.length,
    availableCars: cars.filter((car) => car.status === "available").length,
    featuredCars: cars.filter((car) => car.featured).length,
    totalLeads: leads.length,
    newLeads: leads.filter((lead) => lead.status === "new").length,
  };
}
