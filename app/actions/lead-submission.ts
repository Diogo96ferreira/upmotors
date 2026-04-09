"use server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export type LeadSubmissionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialLeadSubmissionState: LeadSubmissionState = {
  status: "idle",
  message: "",
};

function sanitizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeOptionalNumber(value: string) {
  if (!value) {
    return null;
  }

  const normalized = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(normalized) ? normalized : null;
}

export async function submitLeadSubmission(
  _prevState: LeadSubmissionState,
  formData: FormData
): Promise<LeadSubmissionState> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return {
      status: "error",
      message: "A ligação ao Supabase não está configurada neste ambiente.",
    };
  }

  const formType = sanitizeText(formData.get("formType"));
  const name = sanitizeText(formData.get("name"));
  const email = sanitizeText(formData.get("email"));
  const phone = sanitizeText(formData.get("phone"));
  const brand = sanitizeText(formData.get("brand"));
  const model = sanitizeText(formData.get("model"));
  const year = sanitizeOptionalNumber(sanitizeText(formData.get("year")));
  const mileageKm = sanitizeOptionalNumber(sanitizeText(formData.get("mileage_km")));
  const message = sanitizeText(formData.get("message"));

  if (formType !== "contact" && formType !== "sell") {
    return {
      status: "error",
      message: "Tipo de pedido inválido.",
    };
  }

  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Preenche nome, email e mensagem para continuar.",
    };
  }

  if (formType === "sell" && (!brand || !model || !year || !mileageKm)) {
    return {
      status: "error",
      message: "Preenche também os dados principais da viatura para pedires avaliação.",
    };
  }

  const { error } = await supabase.from("lead_submissions").insert({
    form_type: formType,
    name,
    email,
    phone: phone || null,
    brand: brand || null,
    model: model || null,
    year,
    mileage_km: mileageKm,
    message,
  });

  if (error) {
    console.error("Erro ao guardar submissão:", error);

    return {
      status: "error",
      message: "Não foi possível registar o pedido. Verifica a tabela e as policies do Supabase.",
    };
  }

  return {
    status: "success",
    message:
      formType === "sell"
        ? "Pedido de avaliação registado com sucesso. A equipa pode agora tratá-lo no backoffice."
        : "Pedido enviado com sucesso. O contacto ficou registado para seguimento.",
  };
}
