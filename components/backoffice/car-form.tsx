"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  generateCarAutofill,
  generateCarCopy,
  saveCar,
  type CarFormState,
} from "@/app/backoffice/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import {
  getBrandOptions,
  getModelOptions,
} from "@/lib/car-taxonomy";
import { CarImageRow, CarRow } from "@/types/database";
import { Sparkles } from "lucide-react";
import { useFormStatus } from "react-dom";

const categories = ["Performance", "Classicos", "SUV", "Executive"] as const;
const statuses = ["draft", "available", "reserved", "sold"] as const;
const statusLabels: Record<typeof statuses[number], string> = {
  draft: "Rascunho",
  available: "Disponivel",
  reserved: "Reservado",
  sold: "Vendido",
};
const fuelOptions = ["Gasolina", "Diesel", "Hibrido", "Plug-in Hybrid", "Eletrico", "GPL"] as const;
const transmissionOptions = ["Manual", "Automatico", "Semi-automatico"] as const;
const exteriorColorOptions = [
  "Branco",
  "Preto",
  "Cinzento",
  "Prateado",
  "Azul",
  "Vermelho",
  "Verde",
  "Amarelo",
  "Bege",
  "Castanho",
  "Laranja",
  "Dourado",
] as const;
const interiorOptions = [
  "Tecido preto",
  "Tecido cinzento",
  "Pele preta",
  "Pele castanha",
  "Pele bege",
  "Alcantara",
  "Pele e Alcantara",
  "Interior desportivo",
] as const;
const locationOptions = ["Coimbra", "Taveiro", "Condeixa", "Figueira da Foz", "Aveiro", "Leiria"] as const;
const initialCarFormState: CarFormState = { error: "" };

function sortImages(images: CarImageRow[] = []) {
  return [...images].sort((a, b) => (a.position ?? 9999) - (b.position ?? 9999));
}

function withCurrentOption(options: readonly string[], current?: string | null) {
  return current && !options.includes(current) ? [current, ...options] : [...options];
}

export function CarForm({ car }: { car?: CarRow | null }) {
  const [state, formAction] = useActionState(saveCar, initialCarFormState);
  const [isGenerating, startGenerating] = useTransition();
  const [isAutofilling, startAutofilling] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const [featuredFileName, setFeaturedFileName] = useState("");
  const [galleryFileNames, setGalleryFileNames] = useState<string[]>([]);
  const handledStateRef = useRef<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const [shortDescription, setShortDescription] = useState(car?.shortDescription ?? "");
  const [description, setDescription] = useState(car?.description ?? "");
  const [highlight, setHighlight] = useState(car?.highlight ?? "");
  const [brand, setBrand] = useState(car?.brand ?? "");
  const [model, setModel] = useState(car?.model ?? "");
  const [fuel, setFuel] = useState(car?.fuel ?? "");
  const [transmission, setTransmission] = useState(car?.transmission ?? "");
  const [powerHp, setPowerHp] = useState(car?.power_hp ? String(car.power_hp) : "");
  const [category, setCategory] = useState(car?.category ?? "Performance");
  const [specEngine, setSpecEngine] = useState(car?.specs?.engine ?? "");
  const [specDrivetrain, setSpecDrivetrain] = useState(car?.specs?.drivetrain ?? "");
  const [specAcceleration, setSpecAcceleration] = useState(car?.specs?.acceleration ?? "");

  const sortedImages = useMemo(() => sortImages(car?.car_images ?? []), [car?.car_images]);
  const featuredImage = sortedImages.find((image) => image.is_feature) ?? sortedImages[0] ?? null;
  const galleryImages = sortedImages.filter((image) => image.id !== featuredImage?.id);
  const brandOptions = useMemo(() => getBrandOptions(car?.brand), [car?.brand]);
  const modelOptions = useMemo(() => getModelOptions(brand, car?.model), [brand, car?.model]);

  useEffect(() => {
    setBrand(car?.brand ?? "");
    setModel(car?.model ?? "");
    setShortDescription(car?.shortDescription ?? "");
    setDescription(car?.description ?? "");
    setHighlight(car?.highlight ?? "");
    setFuel(car?.fuel ?? "");
    setTransmission(car?.transmission ?? "");
    setPowerHp(car?.power_hp ? String(car.power_hp) : "");
    setCategory(car?.category ?? "Performance");
    setSpecEngine(car?.specs?.engine ?? "");
    setSpecDrivetrain(car?.specs?.drivetrain ?? "");
    setSpecAcceleration(car?.specs?.acceleration ?? "");
  }, [
    car?.brand,
    car?.category,
    car?.description,
    car?.fuel,
    car?.highlight,
    car?.model,
    car?.power_hp,
    car?.shortDescription,
    car?.specs?.acceleration,
    car?.specs?.drivetrain,
    car?.specs?.engine,
    car?.transmission,
  ]);

  function handleBrandChange(nextBrand: string) {
    setBrand(nextBrand);
    const nextModels = getModelOptions(nextBrand);
    const nextModel = nextModels[0] ?? "";
    setModel(nextModel);
  }

  function handleModelChange(nextModel: string) {
    setModel(nextModel);
  }

  useEffect(() => {
    const stateKey = `${state.success ?? ""}|${state.error}|${state.redirectTo ?? ""}`;

    if (!stateKey || stateKey === "||" || handledStateRef.current === stateKey) {
      return;
    }

    handledStateRef.current = stateKey;

    if (state.error) {
      toast({
        title: "Nao foi possivel guardar",
        description: state.error,
        variant: "error",
      });
      return;
    }

    if (state.success) {
      toast({
        title: "Operacao concluida",
        description: state.success,
        variant: "success",
      });
    }

    if (state.redirectTo) {
      window.setTimeout(() => {
        router.push(state.redirectTo!);
      }, 450);
    }
  }, [router, state.error, state.redirectTo, state.success, toast]);

  function handleGenerateCopy() {
    if (!formRef.current) {
      return;
    }

    startGenerating(async () => {
      const formData = new FormData(formRef.current ?? undefined);
      const result = await generateCarCopy(formData);

      if (result.error) {
        toast({
          title: "Nao foi possivel gerar texto",
          description: result.error,
          variant: "error",
        });
        return;
      }

      setShortDescription(result.shortDescription ?? "");
      setDescription(result.description ?? "");
      setHighlight(result.highlight ?? "");

      toast({
        title: "Texto gerado com IA",
        description: result.success ?? "Os campos de descricao foram preenchidos.",
        variant: "success",
      });
    });
  }

  function handleAutofill() {
    if (!formRef.current) {
      return;
    }

    startAutofilling(async () => {
      const formData = new FormData(formRef.current ?? undefined);
      const result = await generateCarAutofill(formData);

      if (result.error) {
        toast({
          title: "Auto preenchimento falhou",
          description: result.error,
          variant: "error",
        });
        return;
      }

      if (result.fuel) setFuel(result.fuel);
      if (result.transmission) setTransmission(result.transmission);
      if (result.power_hp) setPowerHp(String(result.power_hp));
      if (result.category) setCategory(result.category);
      if (result.spec_engine) setSpecEngine(result.spec_engine);
      if (result.spec_drivetrain) setSpecDrivetrain(result.spec_drivetrain);
      if (result.spec_acceleration) setSpecAcceleration(result.spec_acceleration);
      if (result.shortDescription) setShortDescription(result.shortDescription);
      if (result.description) setDescription(result.description);
      if (result.highlight) setHighlight(result.highlight);

      toast({
        title: "Campos preenchidos com IA",
        description: result.success ?? "Revê as specs antes de guardar a viatura.",
        variant: "success",
      });
    });
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-10">
      <input type="hidden" name="id" defaultValue={car?.id ?? ""} />

      <section className="grid gap-8 border border-white/10 bg-zinc-950 p-8 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Marca</span>
          <Select
            name="brand"
            value={brand}
            onChange={(event) => handleBrandChange(event.target.value)}
            required
          >
            <option value="" disabled>
              Escolher marca
            </option>
            {brandOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Modelo</span>
          <Select
            name="model"
            value={model}
            onChange={(event) => handleModelChange(event.target.value)}
            disabled={!brand}
            required
          >
            <option value="" disabled>
              {brand ? "Escolher modelo" : "Escolhe uma marca primeiro"}
            </option>
            {modelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Versao</span>
          <Input name="version" defaultValue={car?.version ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Slug</span>
          <Input name="slug" defaultValue={car?.slug ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Preco</span>
          <Input name="price" type="number" defaultValue={car?.price ?? ""} required />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Ano</span>
          <Input name="year" type="number" defaultValue={car?.year ?? ""} required />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Quilometragem</span>
          <Input name="mileage_km" type="number" defaultValue={car?.mileage_km ?? ""} required />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Potencia</span>
          <Input
            name="power_hp"
            type="number"
            value={powerHp}
            onChange={(event) => setPowerHp(event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Combustivel</span>
          <Select
            name="fuel"
            value={fuel}
            onChange={(event) => setFuel(event.target.value)}
            required
          >
            <option value="" disabled>
              Escolher combustivel
            </option>
            {withCurrentOption(fuelOptions, fuel).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Transmissao</span>
          <Select
            name="transmission"
            value={transmission}
            onChange={(event) => setTransmission(event.target.value)}
            required
          >
            <option value="" disabled>
              Escolher transmissao
            </option>
            {withCurrentOption(transmissionOptions, transmission).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Categoria</span>
          <Select
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value as typeof categories[number])}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Estado</span>
          <Select name="status" defaultValue={car?.status ?? "draft"}>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {statusLabels[item]}
              </option>
            ))}
          </Select>
        </label>
        <div className="space-y-3 lg:col-span-2">
          <div className="flex flex-col gap-4 border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Assistente IA</p>
              <p className="text-sm leading-6 text-zinc-400">
                Usa o Gemini para sugerir specs provaveis e gerar copy em PT-PT. Revê sempre os
                dados técnicos antes de guardar.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={handleAutofill}
                disabled={isAutofilling || isGenerating}
                className="shrink-0"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isAutofilling ? "A preencher..." : "Auto preencher com IA"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateCopy}
                disabled={isGenerating || isAutofilling}
                className="shrink-0"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? "A gerar..." : "Gerar so descricao"}
              </Button>
            </div>
          </div>
        </div>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Descricao curta
          </span>
          <Textarea
            name="shortDescription"
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
          />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Descricao</span>
          <Textarea
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            minLength={180}
            rows={8}
            required
          />
          <p className="text-sm leading-6 text-zinc-500">
            Minimo recomendado: 2 paragrafos com contexto real da viatura, extras relevantes,
            estado, uso e motivo de compra. Atual: {description.length} caracteres.
          </p>
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Highlight</span>
          <Textarea
            name="highlight"
            value={highlight}
            onChange={(event) => setHighlight(event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Label mensalidade
          </span>
          <Input name="monthlyLabel" defaultValue={car?.monthlyLabel ?? ""} />
        </label>
        <label className="flex items-center gap-3 pt-8 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={Boolean(car?.featured)}
            className="h-4 w-4 accent-white"
          />
          Marcar como destaque
        </label>
      </section>

      <section className="grid gap-8 border border-white/10 bg-zinc-950 p-8 lg:grid-cols-2">
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Imagem principal
            </span>
            <Input
              name="featuredImage"
              type="file"
              accept="image/*"
              required={!car}
              onChange={(event) => setFeaturedFileName(event.target.files?.[0]?.name ?? "")}
            />
            <p className="text-sm leading-6 text-zinc-400">
              Faz upload de uma unica imagem principal. Ao editar, um novo upload substitui a
              principal atual.
            </p>
            {featuredFileName ? <p className="text-sm text-zinc-200">{featuredFileName}</p> : null}
          </div>

          {featuredImage ? (
            <div className="space-y-3 border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Imagem principal atual
              </p>
              <img
                src={featuredImage.url}
                alt={featuredImage.alt_text ?? `${car?.brand} ${car?.model}`}
                className="h-56 w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Galeria</span>
            <Input
              name="galleryImages"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) =>
                setGalleryFileNames(Array.from(event.target.files ?? []).map((file) => file.name))
              }
            />
            <p className="text-sm leading-6 text-zinc-400">
              Faz upload de multiplas imagens adicionais. Novos uploads sao acrescentados a galeria
              existente.
            </p>
            {galleryFileNames.length > 0 ? (
              <ul className="space-y-1 text-sm text-zinc-200">
                {galleryFileNames.map((fileName) => (
                  <li key={fileName}>{fileName}</li>
                ))}
              </ul>
            ) : null}
          </div>

          {galleryImages.length > 0 ? (
            <div className="space-y-3 border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Galeria atual
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {galleryImages.map((image) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={image.alt_text ?? `${car?.brand} ${car?.model}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-8 border border-white/10 bg-zinc-950 p-8 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Motor</span>
          <Input
            name="spec_engine"
            value={specEngine}
            onChange={(event) => setSpecEngine(event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Tracao</span>
          <Input
            name="spec_drivetrain"
            value={specDrivetrain}
            onChange={(event) => setSpecDrivetrain(event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">0-100 km/h</span>
          <Input
            name="spec_acceleration"
            value={specAcceleration}
            onChange={(event) => setSpecAcceleration(event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Cor exterior
          </span>
          <Select name="spec_exterior" defaultValue={car?.specs?.exterior ?? ""}>
            <option value="">Por validar</option>
            {withCurrentOption(exteriorColorOptions, car?.specs?.exterior).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Interior</span>
          <Select name="spec_interior" defaultValue={car?.specs?.interior ?? ""}>
            <option value="">Por validar</option>
            {withCurrentOption(interiorOptions, car?.specs?.interior).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Localizacao</span>
          <Select name="spec_location" defaultValue={car?.specs?.location ?? "Coimbra"}>
            {withCurrentOption(locationOptions, car?.specs?.location).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Equipamento e extras
          </span>
          <Textarea
            name="spec_equipment"
            defaultValue={car?.specs?.equipment ?? ""}
            rows={5}
            placeholder="Ex: jantes especiais, bancos em pele, sensores, camara, CarPlay, teto panoramico..."
          />
          <p className="text-sm leading-6 text-zinc-500">
            Estes detalhes sao usados pela IA para escrever uma descricao mais concreta e apelativa.
          </p>
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Historico e manutencao
          </span>
          <Textarea
            name="spec_history"
            defaultValue={car?.specs?.history ?? ""}
            rows={5}
            placeholder="Ex: livro de revisoes, manutencao recente, pneus novos, historico conhecido..."
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Observacoes comerciais
          </span>
          <Textarea
            name="spec_commercial_notes"
            defaultValue={car?.specs?.commercialNotes ?? ""}
            rows={5}
            placeholder="Ex: ideal para primeiro carro, unidade rara, baixo custo de utilizacao, perfil familiar..."
          />
        </label>
      </section>

      {state.error ? <p className="text-sm text-rose-300">{state.error}</p> : null}

      <div className="flex justify-end">
        <SubmitButton hasExistingCar={Boolean(car)} />
      </div>
    </form>
  );
}

function SubmitButton({ hasExistingCar }: { hasExistingCar: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? hasExistingCar
          ? "A guardar..."
          : "A criar..."
        : hasExistingCar
          ? "Guardar viatura"
          : "Criar viatura"}
    </Button>
  );
}
