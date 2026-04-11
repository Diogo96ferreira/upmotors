"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  generateCarCopy,
  saveCar,
  type CarFormState,
} from "@/app/backoffice/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import { CarImageRow, CarRow } from "@/types/database";
import { Sparkles } from "lucide-react";
import { useFormStatus } from "react-dom";

const categories = ["Performance", "Classicos", "SUV", "Executive"] as const;
const statuses = ["draft", "available", "reserved", "sold"] as const;
const initialCarFormState: CarFormState = { error: "" };

function sortImages(images: CarImageRow[] = []) {
  return [...images].sort((a, b) => (a.position ?? 9999) - (b.position ?? 9999));
}

export function CarForm({ car }: { car?: CarRow | null }) {
  const [state, formAction] = useActionState(saveCar, initialCarFormState);
  const [isGenerating, startGenerating] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const [featuredFileName, setFeaturedFileName] = useState("");
  const [galleryFileNames, setGalleryFileNames] = useState<string[]>([]);
  const handledStateRef = useRef<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const [shortDescription, setShortDescription] = useState(car?.shortDescription ?? "");
  const [description, setDescription] = useState(car?.description ?? "");
  const [highlight, setHighlight] = useState(car?.highlight ?? "");

  const sortedImages = useMemo(() => sortImages(car?.car_images ?? []), [car?.car_images]);
  const featuredImage = sortedImages.find((image) => image.is_feature) ?? sortedImages[0] ?? null;
  const galleryImages = sortedImages.filter((image) => image.id !== featuredImage?.id);

  useEffect(() => {
    setShortDescription(car?.shortDescription ?? "");
    setDescription(car?.description ?? "");
    setHighlight(car?.highlight ?? "");
  }, [car?.description, car?.highlight, car?.shortDescription]);

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

  return (
    <form ref={formRef} action={formAction} className="space-y-10">
      <input type="hidden" name="id" defaultValue={car?.id ?? ""} />

      <section className="grid gap-8 border border-white/10 bg-zinc-950 p-8 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Marca</span>
          <Input name="brand" defaultValue={car?.brand ?? ""} required />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Modelo</span>
          <Input name="model" defaultValue={car?.model ?? ""} required />
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
          <Input name="power_hp" type="number" defaultValue={car?.power_hp ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Combustivel</span>
          <Input name="fuel" defaultValue={car?.fuel ?? ""} required />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Transmissao</span>
          <Input name="transmission" defaultValue={car?.transmission ?? ""} required />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Categoria</span>
          <Select name="category" defaultValue={car?.category ?? "Performance"}>
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
                {item}
              </option>
            ))}
          </Select>
        </label>
        <div className="space-y-3 lg:col-span-2">
          <div className="flex flex-col gap-4 border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Assistente IA</p>
              <p className="text-sm leading-6 text-zinc-400">
                Gera descricao curta, descricao principal e highlight com o Ollama local em PT-PT.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateCopy}
              disabled={isGenerating}
              className="shrink-0"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? "A gerar..." : "Gerar descricao com IA"}
            </Button>
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
            required
          />
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
          <Input name="spec_engine" defaultValue={car?.specs?.engine ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Tracao</span>
          <Input name="spec_drivetrain" defaultValue={car?.specs?.drivetrain ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">0-100 km/h</span>
          <Input name="spec_acceleration" defaultValue={car?.specs?.acceleration ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Cor exterior
          </span>
          <Input name="spec_exterior" defaultValue={car?.specs?.exterior ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Interior</span>
          <Input name="spec_interior" defaultValue={car?.specs?.interior ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Localizacao</span>
          <Input name="spec_location" defaultValue={car?.specs?.location ?? ""} />
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
