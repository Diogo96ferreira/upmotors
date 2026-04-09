"use client";

import { useActionState } from "react";
import { saveCar, type CarFormState } from "@/app/backoffice/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CarRow } from "@/types/database";

const categories = ["Performance", "Classicos", "SUV", "Executive"] as const;
const statuses = ["draft", "available", "reserved", "sold"] as const;
const initialCarFormState: CarFormState = { error: "" };

export function CarForm({ car }: { car?: CarRow | null }) {
  const [state, formAction] = useActionState(saveCar, initialCarFormState);

  return (
    <form action={formAction} className="space-y-10">
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
        <label className="space-y-2 lg:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Imagem principal</span>
          <Input name="image" defaultValue={car?.image ?? ""} />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Descricao curta</span>
          <Textarea name="shortDescription" defaultValue={car?.shortDescription ?? ""} />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Descricao</span>
          <Textarea name="description" defaultValue={car?.description ?? ""} required />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Highlight</span>
          <Textarea name="highlight" defaultValue={car?.highlight ?? ""} />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Galeria</span>
          <Textarea
            name="gallery"
            defaultValue={car?.gallery?.join("\n") ?? ""}
            placeholder="Uma URL por linha"
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Label mensalidade</span>
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
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Cor exterior</span>
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
        <Button type="submit">{car ? "Guardar viatura" : "Criar viatura"}</Button>
      </div>
    </form>
  );
}
