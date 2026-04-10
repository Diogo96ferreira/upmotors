"use server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export type LeadSubmissionState = {
  status: "idle" | "success" | "error";
  message: string;
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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export async function submitLeadSubmission(
  _prevState: LeadSubmissionState,
  formData: FormData
): Promise<LeadSubmissionState> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return {
      status: "error",
      message: "A ligacao ao Supabase nao esta configurada neste ambiente.",
    };
  }

  const formType = sanitizeText(formData.get("formType"));
  const name = sanitizeText(formData.get("name"));
  const email = sanitizeText(formData.get("email")).toLowerCase();
  const phone = sanitizePhone(sanitizeText(formData.get("phone")));
  const brand = sanitizeText(formData.get("brand"));
  const model = sanitizeText(formData.get("model"));
  const year = sanitizeOptionalNumber(sanitizeText(formData.get("year")));
  const mileageKm = sanitizeOptionalNumber(sanitizeText(formData.get("mileage_km")));
  const message = sanitizeText(formData.get("message"));
  const website = sanitizeText(formData.get("website"));

  if (website) {
    return {
      status: "success",
      message: "Pedido enviado com sucesso.",
    };
  }

  if (formType !== "contact" && formType !== "sell") {
    return {
      status: "error",
      message: "Tipo de pedido invalido.",
    };
  }

  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Preenche nome, email e mensagem para continuar.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      status: "error",
      message: "Introduz um email valido para podermos responder-te.",
    };
  }

  if (phone && phone.replace(/[^\d]/g, "").length < 9) {
    return {
      status: "error",
      message: "O numero de telefone parece incompleto.",
    };
  }

  if (message.length < 12) {
    return {
      status: "error",
      message: "Dá-nos um pouco mais de contexto na mensagem para ajudarmos melhor.",
    };
  }

  if (formType === "sell" && (!brand || !model || !year || !mileageKm)) {
    return {
      status: "error",
      message: "Preenche tambem os dados principais da viatura para pedires avaliacao.",
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
    console.error("Erro ao guardar submissao:", error);

    return {
      status: "error",
      message: "Nao foi possivel registar o pedido. Tenta novamente dentro de instantes.",
    };
  }

  return {
    status: "success",
    message:
      formType === "sell"
        ? "Pedido de avaliacao registado com sucesso. A equipa vai analisar os dados e entrar em contacto."
        : "Pedido enviado com sucesso. Vamos responder-te com a maior brevidade.",
  };
}
