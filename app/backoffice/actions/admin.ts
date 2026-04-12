"use server";

import { revalidatePath } from "next/cache";
import { company } from "@/lib/site";
import { requireBackofficeUser } from "@/lib/backoffice-session";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { CarCategory, CarStatus, LeadStatus } from "@/types/database";

export type CarFormState = {
  error: string;
  success?: string;
  redirectTo?: string;
};

export type ActionResult = {
  error?: string;
  success?: string;
};

export type GenerateCarCopyResult = ActionResult & {
  shortDescription?: string;
  description?: string;
  highlight?: string;
};

export type GenerateCarAutofillResult = GenerateCarCopyResult & {
  fuel?: string;
  transmission?: string;
  power_hp?: number | null;
  category?: CarCategory;
  spec_engine?: string;
  spec_drivetrain?: string;
  spec_acceleration?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function getFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function sanitizeFilename(filename: string) {
  const extension = filename.includes(".") ? filename.split(".").pop() : "";
  const basename = filename.replace(/\.[^/.]+$/, "");
  const safeBasename = slugify(basename) || "imagem";
  return extension ? `${safeBasename}.${extension.toLowerCase()}` : safeBasename;
}

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
}

function getGeminiModel() {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

function buildCarCopyPrompt(data: {
  brand: string;
  model: string;
  version?: string;
  year?: number | null;
  price?: number | null;
  mileage_km?: number | null;
  fuel?: string;
  transmission?: string;
  power_hp?: number | null;
  category?: string;
  engine?: string;
  drivetrain?: string;
  exterior?: string;
  interior?: string;
  equipment?: string;
  history?: string;
  commercialNotes?: string;
}) {
  return `
És um copywriter automóvel premium da Up Motors, stand automóvel em Coimbra, Portugal.

Objetivo:
- escrever copy em PT-PT
- tom premium, claro, elegante e credível
- nada de exageros baratos ou linguagem brasileira
- sem inventar factos não fornecidos

Preciso de devolver JSON válido com este formato:
{
  "shortDescription": "1 frase curta",
  "description": "1 parágrafo com 110 a 170 palavras",
  "highlight": "1 parágrafo curto com 35 a 70 palavras"
}

Contexto da viatura:
- Marca: ${data.brand}
- Modelo: ${data.model}
- Versão: ${data.version || "n/d"}
- Ano: ${data.year ?? "n/d"}
- Preço: ${data.price ?? "n/d"} EUR
- Quilometragem: ${data.mileage_km ?? "n/d"} km
- Combustível: ${data.fuel || "n/d"}
- Transmissão: ${data.transmission || "n/d"}
- Potência: ${data.power_hp ?? "n/d"} cv
- Categoria: ${data.category || "n/d"}
- Motor: ${data.engine || "n/d"}
- Tração: ${data.drivetrain || "n/d"}
- Cor exterior: ${data.exterior || "n/d"}
- Interior: ${data.interior || "n/d"}

Regras:
- mencionar Coimbra apenas de forma subtil quando fizer sentido
- não usar bullet points
- não repetir sempre os mesmos adjetivos
- não referir importação, garantia ou histórico se não tiver sido fornecido
- devolver apenas JSON, sem markdown e sem texto extra
  `.trim();
}

function buildCarAutofillPrompt(data: {
  brand: string;
  model: string;
  version?: string;
  year?: number | null;
}) {
  return `
És um especialista automóvel e copywriter premium da Up Motors, stand automóvel em Coimbra.

O admin vai preencher marca, modelo e ano. A tua tarefa é sugerir specs técnicas prováveis e copy de venda.

Importante:
- Se uma especificação for incerta, deixa string vazia ou null.
- Não inventes cor exterior, interior, preço ou quilometragem.
- Usa PT-PT.
- Mantém o tom premium, claro e comercial.
- A copy deve ser orientada para venda, mas credível.

Devolve apenas JSON válido neste formato:
{
  "fuel": "Gasolina | Diesel | Hibrido | Eletrico | Plug-in Hybrid | ...",
  "transmission": "Manual | Automatico | ...",
  "power_hp": 150,
  "category": "Performance | Classicos | SUV | Executive",
  "spec_engine": "ex: 2.0L Diesel",
  "spec_drivetrain": "ex: Tracao dianteira",
  "spec_acceleration": "ex: 7.8 s 0-100 km/h",
  "shortDescription": "1 frase curta",
  "description": "1 paragrafo com 110 a 170 palavras",
  "highlight": "1 paragrafo curto com 35 a 70 palavras"
}

Dados fornecidos:
- Marca: ${data.brand}
- Modelo: ${data.model}
- Versão: ${data.version || "n/d"}
- Ano: ${data.year ?? "n/d"}
  `.trim();
}

function buildEnhancedCarCopyPrompt(data: {
  brand: string;
  model: string;
  version?: string;
  year?: number | null;
  price?: number | null;
  mileage_km?: number | null;
  fuel?: string;
  transmission?: string;
  power_hp?: number | null;
  category?: string;
  engine?: string;
  drivetrain?: string;
  exterior?: string;
  interior?: string;
  equipment?: string;
  history?: string;
  commercialNotes?: string;
}) {
  return `
Es um copywriter automovel premium da Up Motors, stand automovel em Coimbra, Portugal.

Objetivo:
- escrever em PT-PT europeu
- criar uma descricao entusiasmante para comprador final
- usar os dados reais fornecidos para dar substancia, confianca e desejo
- manter tom premium, claro, elegante e credibil
- nunca inventar equipamento, historico, garantia, estado ou manutencao

Devolve apenas JSON valido neste formato:
{
  "shortDescription": "1 frase curta, concreta e apelativa",
  "description": "2 a 3 paragrafos com 170 a 260 palavras",
  "highlight": "1 paragrafo curto com 45 a 80 palavras"
}

Dados da viatura:
- Marca: ${data.brand}
- Modelo: ${data.model}
- Versao: ${data.version || "n/d"}
- Ano: ${data.year ?? "n/d"}
- Preco: ${data.price ?? "n/d"} EUR
- Quilometragem: ${data.mileage_km ?? "n/d"} km
- Combustivel: ${data.fuel || "n/d"}
- Transmissao: ${data.transmission || "n/d"}
- Potencia: ${data.power_hp ?? "n/d"} cv
- Categoria: ${data.category || "n/d"}
- Motor: ${data.engine || "n/d"}
- Tracao: ${data.drivetrain || "n/d"}
- Cor exterior: ${data.exterior || "n/d"}
- Interior: ${data.interior || "n/d"}
- Equipamento / extras: ${data.equipment || "n/d"}
- Historico / manutencao: ${data.history || "n/d"}
- Observacoes comerciais: ${data.commercialNotes || "n/d"}

Regras de escrita:
- a descricao principal nao pode ser uma linha, nem uma frase generica
- escreve como quem esta a apresentar a viatura a um comprador interessado
- integra specs, extras, estado, historico e detalhes comerciais quando forem fornecidos
- se um campo estiver "n/d", ignora-o
- menciona Coimbra apenas de forma subtil quando fizer sentido
- nao uses bullet points, markdown, emojis ou claims absolutos
- nao digas "garantia", "revisoes em dia", "nacional" ou "sem acidentes" se isso nao estiver nos dados
  `.trim();
}

function buildEnhancedCarAutofillPrompt(data: {
  brand: string;
  model: string;
  version?: string;
  year?: number | null;
  price?: number | null;
  mileage_km?: number | null;
  equipment?: string;
  history?: string;
  commercialNotes?: string;
}) {
  return `
Es um especialista automovel e copywriter premium da Up Motors, stand automovel em Coimbra.

O admin preenche marca, modelo e ano. A tua tarefa e sugerir specs tecnicas provaveis e uma copy de venda forte.

Importante:
- se uma especificacao for incerta, deixa string vazia ou null
- nao inventes cor exterior, interior, preco, quilometragem, extras, manutencao ou historico
- usa PT-PT europeu
- a copy deve entusiasmar, mas continuar credibil

Devolve apenas JSON valido neste formato:
{
  "fuel": "Gasolina | Diesel | Hibrido | Eletrico | Plug-in Hybrid | ...",
  "transmission": "Manual | Automatico | ...",
  "power_hp": 150,
  "category": "Performance | Classicos | SUV | Executive",
  "spec_engine": "ex: 2.0L Diesel",
  "spec_drivetrain": "ex: Tracao dianteira",
  "spec_acceleration": "ex: 7.8 s 0-100 km/h",
  "shortDescription": "1 frase curta, concreta e apelativa",
  "description": "2 a 3 paragrafos com 170 a 260 palavras",
  "highlight": "1 paragrafo curto com 45 a 80 palavras"
}

Dados fornecidos:
- Marca: ${data.brand}
- Modelo: ${data.model}
- Versao: ${data.version || "n/d"}
- Ano: ${data.year ?? "n/d"}
- Preco: ${data.price ?? "n/d"} EUR
- Quilometragem: ${data.mileage_km ?? "n/d"} km
- Equipamento / extras ja indicados: ${data.equipment || "n/d"}
- Historico / manutencao ja indicado: ${data.history || "n/d"}
- Observacoes comerciais ja indicadas: ${data.commercialNotes || "n/d"}

Regras para a copy:
- nunca devolvas uma descricao curta de uma linha
- usa os extras e detalhes indicados para tornar a viatura especifica
- nao inventes equipamento ou historico
- evita texto frio de ficha tecnica; escreve para conversao
  `.trim();
}

function normalizeGeneratedCategory(value?: string): CarCategory | undefined {
  if (value === "Performance" || value === "Classicos" || value === "SUV" || value === "Executive") {
    return value;
  }

  return undefined;
}

function extractJsonObject(value: string) {
  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return value.slice(start, end + 1);
}

const carCopyResponseSchema = {
  type: "object",
  properties: {
    shortDescription: {
      type: "string",
      description: "Descricao curta de uma frase, concreta e orientada para venda.",
    },
    description: {
      type: "string",
      description: "Descricao principal em PT-PT com 170 a 260 palavras e 2 a 3 paragrafos.",
    },
    highlight: {
      type: "string",
      description: "Resumo editorial curto com 45 a 80 palavras.",
    },
  },
  required: ["shortDescription", "description", "highlight"],
  propertyOrdering: ["shortDescription", "description", "highlight"],
};

const carAutofillResponseSchema = {
  type: "object",
  properties: {
    fuel: {
      type: "string",
      description: "Combustivel provavel. Ex: Gasolina, Diesel, Hibrido, Eletrico.",
    },
    transmission: {
      type: "string",
      description: "Transmissao provavel. Ex: Manual, Automatico.",
    },
    power_hp: {
      type: "integer",
      description: "Potencia aproximada em cavalos. Usar null se for incerto.",
      nullable: true,
    },
    category: {
      type: "string",
      enum: ["Performance", "Classicos", "SUV", "Executive"],
      description: "Categoria interna mais adequada.",
    },
    spec_engine: {
      type: "string",
      description: "Motor provavel. Ex: 2.0L Diesel.",
    },
    spec_drivetrain: {
      type: "string",
      description: "Tracao provavel. Ex: Tracao dianteira.",
    },
    spec_acceleration: {
      type: "string",
      description: "0-100 km/h aproximado. Usar string vazia se for incerto.",
    },
    shortDescription: {
      type: "string",
      description: "Descricao curta de uma frase, concreta e orientada para venda.",
    },
    description: {
      type: "string",
      description: "Descricao principal em PT-PT com 170 a 260 palavras e 2 a 3 paragrafos.",
    },
    highlight: {
      type: "string",
      description: "Resumo editorial curto com 45 a 80 palavras.",
    },
  },
  required: [
    "fuel",
    "transmission",
    "power_hp",
    "category",
    "spec_engine",
    "spec_drivetrain",
    "spec_acceleration",
    "shortDescription",
    "description",
    "highlight",
  ],
  propertyOrdering: [
    "fuel",
    "transmission",
    "power_hp",
    "category",
    "spec_engine",
    "spec_drivetrain",
    "spec_acceleration",
    "shortDescription",
    "description",
    "highlight",
  ],
};

async function generateGeminiJson<T>(prompt: string, responseSchema: Record<string, unknown>) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {
      error:
        "Define GEMINI_API_KEY ou GOOGLE_GENERATIVE_AI_API_KEY no .env.local para usar o assistente IA.",
      data: null,
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${getGeminiModel()}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.45,
          responseMimeType: "application/json",
          responseSchema,
        },
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro Gemini:", response.status, errorText);
    return {
      error:
        "Nao foi possivel gerar texto com o Gemini. Confirma a API key, o modelo configurado e a quota da conta Google AI.",
      data: null,
    };
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };
  const rawContent =
    payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  const jsonPayload = extractJsonObject(rawContent);

  if (!jsonPayload) {
    console.error("Resposta do Gemini sem JSON reconhecivel:", rawContent);
    return { error: "O modelo respondeu num formato inesperado.", data: null };
  }

  return { error: "", data: JSON.parse(jsonPayload) as T };
}

async function persistCar(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  id: string,
  payload: Record<string, unknown>
) {
  let currentPayload = payload;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const response = id
      ? await supabase.from("cars").update(currentPayload).eq("id", id).select("id").maybeSingle()
      : await supabase.from("cars").insert(currentPayload).select("id").single();

    if (!response.error) {
      return { error: null, id: response.data?.id ?? id };
    }

    const missingColumn = getMissingColumn(response.error);

    if (!missingColumn || !(missingColumn in currentPayload)) {
      return { error: response.error, id: null };
    }

    console.warn(`Coluna "${missingColumn}" nao existe em cars. A remover do payload e a tentar novamente.`);
    currentPayload = omitColumn(currentPayload, missingColumn);
  }

  return {
    error: {
      message: "Nao foi possivel adaptar o payload ao schema de cars.",
    },
    id: null,
  };
}

async function getAvailableCarSlug(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  desiredSlug: string,
  currentCarId?: string
) {
  const safeSlug = desiredSlug || "viatura";
  const { data, error } = await supabase
    .from("cars")
    .select("id, slug")
    .ilike("slug", `${safeSlug}%`);

  if (error) {
    console.error("Erro ao validar slug da viatura:", error);
    return safeSlug;
  }

  const existingRows = (data ?? []) as Array<{ id: string; slug: string }>;
  const occupiedSlugs = new Set(
    existingRows
      .filter((row) => row.id !== currentCarId)
      .map((row) => row.slug)
  );

  if (!occupiedSlugs.has(safeSlug)) {
    return safeSlug;
  }

  for (let suffix = 2; suffix < 100; suffix += 1) {
    const candidate = `${safeSlug}-${suffix}`;

    if (!occupiedSlugs.has(candidate)) {
      return candidate;
    }
  }

  return `${safeSlug}-${Date.now()}`;
}

async function uploadCarImage(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  carId: string,
  file: File,
  options: {
    isFeature: boolean;
    position: number;
    altText: string;
  }
) {
  const arrayBuffer = await file.arrayBuffer();
  const filePath = `${carId}/${Date.now()}-${sanitizeFilename(file.name)}`;
  const upload = await supabase.storage.from("cars").upload(filePath, arrayBuffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (upload.error) {
    return { error: upload.error };
  }

  const { data: publicUrlData } = supabase.storage.from("cars").getPublicUrl(filePath);
  const imagePayload = {
    car_id: carId,
    url: publicUrlData.publicUrl,
    storage_path: filePath,
    alt_text: options.altText,
    position: options.position,
    is_feature: options.isFeature,
  };

  const insert = await supabase.from("car_images").insert(imagePayload);

  if (insert.error) {
    return { error: insert.error };
  }

  return { error: null };
}

async function syncCarImages(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  carId: string,
  carLabel: string,
  featuredImage: File | null,
  galleryImages: File[]
) {
  if (!featuredImage && galleryImages.length === 0) {
    return { error: null };
  }

  const existingImages = await supabase
    .from("car_images")
    .select("id, position, is_feature")
    .eq("car_id", carId)
    .order("position", { ascending: true });

  if (existingImages.error) {
    return { error: existingImages.error };
  }

  const rows = existingImages.data ?? [];

  if (featuredImage) {
    const clearFeatured = await supabase
      .from("car_images")
      .update({ is_feature: false })
      .eq("car_id", carId)
      .eq("is_feature", true);

    if (clearFeatured.error) {
      return { error: clearFeatured.error };
    }

    const featureUpload = await uploadCarImage(supabase, carId, featuredImage, {
      isFeature: true,
      position: 0,
      altText: `${carLabel} vista principal`,
    });

    if (featureUpload.error) {
      return { error: featureUpload.error };
    }
  }

  let nextPosition =
    rows
      .filter((row) => !row.is_feature)
      .reduce((maxPosition, row) => Math.max(maxPosition, row.position ?? 0), 0) + 1;

  for (const file of galleryImages) {
    const galleryUpload = await uploadCarImage(supabase, carId, file, {
      isFeature: false,
      position: nextPosition,
      altText: `${carLabel} galeria ${nextPosition}`,
    });

    if (galleryUpload.error) {
      return { error: galleryUpload.error };
    }

    nextPosition += 1;
  }

  return { error: null };
}

export async function saveCar(
  _prevState: CarFormState,
  formData: FormData
): Promise<CarFormState> {
  await requireBackofficeUser();
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
  const featuredImage = getFile(formData, "featuredImage");
  const galleryImages = getFiles(formData, "galleryImages");

  if (
    !brand ||
    !model ||
    !year ||
    price === null ||
    mileage_km === null ||
    !fuel ||
    !transmission ||
    !description
  ) {
    return { error: "Preenche os campos principais da viatura." };
  }

  if (!id && !featuredImage) {
    return { error: "A imagem principal e obrigatoria ao criar uma viatura." };
  }

  if (description.length < 180) {
    return {
      error:
        "A descricao da viatura esta demasiado curta. Escreve pelo menos 2 paragrafos com detalhes, extras e contexto comercial.",
    };
  }

  const slugBase = getText(formData, "slug") || `${brand}-${model}-${year}`;
  const slug = await getAvailableCarSlug(supabase, slugify(slugBase), id || undefined);
  const payload: Record<string, unknown> = {
    slug,
    brand,
    model,
    version: getNullableText(formData, "version"),
    price,
    year,
    mileage_km,
    fuel,
    transmission,
    power_hp: getNumber(formData, "power_hp"),
    category,
    description,
    shortDescription: getNullableText(formData, "shortDescription"),
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
      equipment: getNullableText(formData, "spec_equipment"),
      history: getNullableText(formData, "spec_history"),
      commercialNotes: getNullableText(formData, "spec_commercial_notes"),
    },
  };

  const response = await persistCar(supabase, id, payload);

  if (response.error || !response.id) {
    console.error("Erro ao guardar carro:", response.error);
    return { error: "Nao foi possivel guardar a viatura com o schema atual da tabela cars." };
  }

  const imageSync = await syncCarImages(
    supabase,
    response.id,
    `${brand} ${model}`,
    featuredImage,
    galleryImages
  );

  if (imageSync.error) {
    console.error("Erro ao sincronizar imagens da viatura:", imageSync.error);
    return { error: "A viatura foi guardada, mas nao foi possivel tratar as imagens." };
  }

  revalidatePath("/");
  revalidatePath("/stock");
  revalidatePath(`/stock/${payload.slug}`);
  revalidatePath("/backoffice");
  revalidatePath("/backoffice/cars");
  revalidatePath(`/backoffice/cars/${response.id}`);

  return {
    error: "",
    success: carIdMessage(id),
    redirectTo: "/backoffice/cars",
  };
}

export async function generateCarCopy(formData: FormData): Promise<GenerateCarCopyResult> {
  await requireBackofficeUser();

  const brand = getText(formData, "brand");
  const model = getText(formData, "model");

  if (!brand || !model) {
    return { error: "Preenche pelo menos a marca e o modelo antes de gerar a descricao." };
  }

  const prompt = buildEnhancedCarCopyPrompt({
    brand,
    model,
    version: getText(formData, "version") || undefined,
    year: getNumber(formData, "year"),
    price: getNumber(formData, "price"),
    mileage_km: getNumber(formData, "mileage_km"),
    fuel: getText(formData, "fuel") || undefined,
    transmission: getText(formData, "transmission") || undefined,
    power_hp: getNumber(formData, "power_hp"),
    category: getText(formData, "category") || undefined,
    engine: getText(formData, "spec_engine") || undefined,
    drivetrain: getText(formData, "spec_drivetrain") || undefined,
    exterior: getText(formData, "spec_exterior") || undefined,
    interior: getText(formData, "spec_interior") || undefined,
    equipment: getText(formData, "spec_equipment") || undefined,
    history: getText(formData, "spec_history") || undefined,
    commercialNotes: getText(formData, "spec_commercial_notes") || undefined,
  });

  try {
    const result = await generateGeminiJson<{
      shortDescription?: string;
      description?: string;
      highlight?: string;
    }>(prompt, carCopyResponseSchema);

    if (result.error || !result.data) {
      return { error: result.error };
    }

    const parsed = result.data;

    if (!parsed.description) {
      return { error: "O modelo nao devolveu uma descricao valida." };
    }

    return {
      success: "Descricao gerada com IA.",
      shortDescription: parsed.shortDescription?.trim() || "",
      description: parsed.description.trim(),
      highlight: parsed.highlight?.trim() || "",
    };
  } catch (error) {
    console.error("Erro ao comunicar com o Gemini:", error);
    return {
      error: "Nao foi possivel comunicar com o Gemini. Confirma a API key e tenta novamente.",
    };
  }
}

export async function generateCarAutofill(
  formData: FormData
): Promise<GenerateCarAutofillResult> {
  await requireBackofficeUser();

  const brand = getText(formData, "brand");
  const model = getText(formData, "model");
  const year = getNumber(formData, "year");

  if (!brand || !model || !year) {
    return {
      error: "Preenche marca, modelo e ano antes de usar o auto preenchimento com IA.",
    };
  }

  const prompt = buildEnhancedCarAutofillPrompt({
    brand,
    model,
    year,
    version: getText(formData, "version") || undefined,
    price: getNumber(formData, "price"),
    mileage_km: getNumber(formData, "mileage_km"),
    equipment: getText(formData, "spec_equipment") || undefined,
    history: getText(formData, "spec_history") || undefined,
    commercialNotes: getText(formData, "spec_commercial_notes") || undefined,
  });

  try {
    const result = await generateGeminiJson<{
      fuel?: string;
      transmission?: string;
      power_hp?: number | string | null;
      category?: string;
      spec_engine?: string;
      spec_drivetrain?: string;
      spec_acceleration?: string;
      shortDescription?: string;
      description?: string;
      highlight?: string;
    }>(prompt, carAutofillResponseSchema);

    if (result.error || !result.data) {
      return { error: result.error };
    }

    const parsed = result.data;

    const parsedPower =
      typeof parsed.power_hp === "number"
        ? parsed.power_hp
        : typeof parsed.power_hp === "string"
          ? Number(parsed.power_hp.replace(/[^\d]/g, ""))
          : null;

    return {
      success: "Campos preenchidos com sugestoes da IA. Confirma as specs antes de guardar.",
      fuel: parsed.fuel?.trim() || "",
      transmission: parsed.transmission?.trim() || "",
      power_hp: Number.isFinite(parsedPower) ? parsedPower : null,
      category: normalizeGeneratedCategory(parsed.category),
      spec_engine: parsed.spec_engine?.trim() || "",
      spec_drivetrain: parsed.spec_drivetrain?.trim() || "",
      spec_acceleration: parsed.spec_acceleration?.trim() || "",
      shortDescription: parsed.shortDescription?.trim() || "",
      description: parsed.description?.trim() || "",
      highlight: parsed.highlight?.trim() || "",
    };
  } catch (error) {
    console.error("Erro ao comunicar com o Gemini para autofill:", error);
    return {
      error: "Nao foi possivel comunicar com o Gemini. Confirma a API key e tenta novamente.",
    };
  }
}

export async function updateLeadStatus(formData: FormData) {
  await requireBackofficeUser();
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase nao configurado no servidor." } satisfies ActionResult;
  }

  const id = getText(formData, "id");
  const status = getText(formData, "status") as LeadStatus;

  if (!id || !status) {
    return { error: "Dados insuficientes para atualizar o lead." } satisfies ActionResult;
  }

  const { error } = await supabase.from("lead_submissions").update({ status }).eq("id", id);

  if (error) {
    console.error("Erro ao atualizar lead:", error);
    return { error: "Nao foi possivel atualizar o estado do lead." } satisfies ActionResult;
  }

  revalidatePath("/backoffice");
  revalidatePath("/backoffice/leads");
  return { success: "Estado do lead atualizado." } satisfies ActionResult;
}

function carIdMessage(id: string) {
  return id ? "Viatura atualizada com sucesso." : "Viatura criada com sucesso.";
}

function getHiddenId(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value || "";
}

async function revalidateCarPaths(carId: string, carSlug: string) {
  revalidatePath("/");
  revalidatePath("/stock");
  revalidatePath(`/stock/${carSlug}`);
  revalidatePath("/backoffice");
  revalidatePath("/backoffice/cars");
  revalidatePath(`/backoffice/cars/${carId}`);
}

export async function setFeaturedCarImage(formData: FormData): Promise<ActionResult> {
  await requireBackofficeUser();
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase nao configurado no servidor." };
  }

  const carId = getHiddenId(formData, "carId");
  const carSlug = getHiddenId(formData, "carSlug");
  const imageId = getHiddenId(formData, "imageId");

  if (!carId || !carSlug || !imageId) {
    return { error: "Dados insuficientes para atualizar a imagem principal." };
  }

  const clearFeatured = await supabase
    .from("car_images")
    .update({ is_feature: false })
    .eq("car_id", carId)
    .eq("is_feature", true);

  if (clearFeatured.error) {
    console.error("Erro ao limpar featured image:", clearFeatured.error);
    return { error: "Nao foi possivel atualizar a imagem principal." };
  }

  const setFeatured = await supabase
    .from("car_images")
    .update({ is_feature: true, position: 0 })
    .eq("id", imageId)
    .eq("car_id", carId);

  if (setFeatured.error) {
    console.error("Erro ao definir featured image:", setFeatured.error);
    return { error: "Nao foi possivel atualizar a imagem principal." };
  }

  await revalidateCarPaths(carId, carSlug);
  return { success: "Imagem principal atualizada." };
}

export async function updateCarImageAltText(formData: FormData): Promise<ActionResult> {
  await requireBackofficeUser();
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase nao configurado no servidor." };
  }

  const carId = getHiddenId(formData, "carId");
  const carSlug = getHiddenId(formData, "carSlug");
  const imageId = getHiddenId(formData, "imageId");
  const altText = getNullableText(formData, "altText");

  if (!carId || !carSlug || !imageId) {
    return { error: "Dados insuficientes para atualizar o alt text." };
  }

  const { error } = await supabase
    .from("car_images")
    .update({ alt_text: altText })
    .eq("id", imageId)
    .eq("car_id", carId);

  if (error) {
    console.error("Erro ao atualizar alt text da imagem:", error);
    return { error: "Nao foi possivel guardar o alt text." };
  }

  await revalidateCarPaths(carId, carSlug);
  return { success: "Alt text atualizado." };
}

export async function deleteCarImage(formData: FormData): Promise<ActionResult> {
  await requireBackofficeUser();
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase nao configurado no servidor." };
  }

  const carId = getHiddenId(formData, "carId");
  const carSlug = getHiddenId(formData, "carSlug");
  const imageId = getHiddenId(formData, "imageId");
  const storagePath = getText(formData, "storagePath");

  if (!carId || !carSlug || !imageId) {
    return { error: "Dados insuficientes para apagar a imagem." };
  }

  const { error: deleteError } = await supabase
    .from("car_images")
    .delete()
    .eq("id", imageId)
    .eq("car_id", carId);

  if (deleteError) {
    console.error("Erro ao apagar imagem da viatura:", deleteError);
    return { error: "Nao foi possivel apagar a imagem." };
  }

  if (storagePath) {
    const { error: storageError } = await supabase.storage.from("cars").remove([storagePath]);

    if (storageError) {
      console.error("Erro ao apagar ficheiro do bucket cars:", storageError);
    }
  }

  await revalidateCarPaths(carId, carSlug);
  return { success: "Imagem apagada." };
}

export async function moveCarImage(formData: FormData): Promise<ActionResult> {
  await requireBackofficeUser();
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase nao configurado no servidor." };
  }

  const carId = getHiddenId(formData, "carId");
  const carSlug = getHiddenId(formData, "carSlug");
  const imageId = getHiddenId(formData, "imageId");
  const direction = getText(formData, "direction");

  if (!carId || !carSlug || !imageId || !direction) {
    return { error: "Dados insuficientes para reordenar a imagem." };
  }

  const { data: images, error } = await supabase
    .from("car_images")
    .select("id, position, is_feature")
    .eq("car_id", carId)
    .eq("is_feature", false)
    .order("position", { ascending: true });

  if (error) {
    console.error("Erro ao carregar galeria para reordenacao:", error);
    return { error: "Nao foi possivel reordenar a galeria." };
  }

  const ordered = images ?? [];
  const currentIndex = ordered.findIndex((image) => image.id === imageId);

  if (currentIndex === -1) {
    return { error: "A imagem ja nao existe na galeria." };
  }

  const targetIndex =
    direction === "up" ? currentIndex - 1 : direction === "down" ? currentIndex + 1 : currentIndex;

  if (targetIndex < 0 || targetIndex >= ordered.length || targetIndex === currentIndex) {
    return { success: "" };
  }

  const current = ordered[currentIndex];
  const target = ordered[targetIndex];

  const updateCurrent = await supabase
    .from("car_images")
    .update({ position: target.position ?? 0 })
    .eq("id", current.id);

  if (updateCurrent.error) {
    console.error("Erro ao atualizar imagem atual na reordenacao:", updateCurrent.error);
    return { error: "Nao foi possivel reordenar a galeria." };
  }

  const updateTarget = await supabase
    .from("car_images")
    .update({ position: current.position ?? 0 })
    .eq("id", target.id);

  if (updateTarget.error) {
    console.error("Erro ao atualizar imagem alvo na reordenacao:", updateTarget.error);
    return { error: "Nao foi possivel reordenar a galeria." };
  }

  await revalidateCarPaths(carId, carSlug);
  return { success: "Ordem da galeria atualizada." };
}

export async function reorderCarImages(formData: FormData): Promise<ActionResult> {
  await requireBackofficeUser();
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase nao configurado no servidor." };
  }

  const carId = getHiddenId(formData, "carId");
  const carSlug = getHiddenId(formData, "carSlug");
  const orderedImageIds = formData
    .getAll("imageOrder")
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  if (!carId || !carSlug || orderedImageIds.length === 0) {
    return { error: "Dados insuficientes para guardar a ordem da galeria." };
  }

  for (let index = 0; index < orderedImageIds.length; index += 1) {
    const imageId = orderedImageIds[index];
    const { error } = await supabase
      .from("car_images")
      .update({ position: index + 1 })
      .eq("id", imageId)
      .eq("car_id", carId);

    if (error) {
      console.error("Erro ao reordenar galeria:", error);
      return { error: "Nao foi possivel guardar a nova ordem da galeria." };
    }
  }

  await revalidateCarPaths(carId, carSlug);
  return { success: "Nova ordem da galeria guardada." };
}

async function persistLeadReplyMetadata(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  leadId: string,
  subject: string,
  message: string
) {
  let payload: Record<string, unknown> = {
    status: "contacted",
    reply_subject: subject,
    reply_message: message,
    replied_at: new Date().toISOString(),
  };

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await supabase.from("lead_submissions").update(payload).eq("id", leadId);

    if (!response.error) {
      return;
    }

    const missingColumn = getMissingColumn(response.error);

    if (!missingColumn || !(missingColumn in payload)) {
      console.error("Erro ao guardar metadados da resposta do lead:", response.error);
      return;
    }

    payload = omitColumn(payload, missingColumn);
  }
}

export async function sendLeadReply(formData: FormData): Promise<ActionResult> {
  await requireBackofficeUser();
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase nao configurado no servidor." };
  }

  const leadId = getText(formData, "leadId");
  const to = getText(formData, "to").toLowerCase();
  const subject = getText(formData, "subject");
  const message = getText(formData, "message");

  if (!leadId || !to || !subject || !message) {
    return { error: "Preenche destinatario, assunto e mensagem para enviar a resposta." };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !resendFromEmail) {
    return {
      error:
        "Para enviar emails do backoffice, define RESEND_API_KEY e RESEND_FROM_EMAIL no .env.local.",
    };
  }

  const plainText = `${message}\n\nCumprimentos,\n${company.name}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111827">
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      <p style="margin-top:24px;">Cumprimentos,<br />${escapeHtml(company.name)}</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `lead-reply-${leadId}-${Date.now()}`,
      "User-Agent": "upmotors-backoffice/1.0",
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [to],
      subject,
      html,
      text: plainText,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const responseText = await response.text();
    console.error("Erro ao enviar email com Resend:", response.status, responseText);
    return { error: "Nao foi possivel enviar o email. Confirma a configuracao do Resend." };
  }

  await persistLeadReplyMetadata(supabase, leadId, subject, message);
  revalidatePath("/backoffice");
  revalidatePath("/backoffice/leads");

  return { success: "Resposta enviada por email com sucesso." };
}
