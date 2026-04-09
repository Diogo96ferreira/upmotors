import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const categories = ["Performance", "Classicos", "SUV", "Executive"] as const;
const statuses = ["draft", "available", "reserved", "sold"] as const;

export function CarForm({ car }: { car?: any }) {
  return (
    <form className="space-y-10">
      <section className="grid gap-8 border border-white/10 bg-zinc-950 p-8 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Marca</span>
          <Input defaultValue={car?.brand ?? ""} readOnly />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Modelo</span>
          <Input defaultValue={car?.model ?? ""} readOnly />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Versao</span>
          <Input defaultValue={car?.version ?? ""} readOnly />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Slug</span>
          <Input defaultValue={car?.slug ?? ""} readOnly />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Preco</span>
          <Input defaultValue={car?.price ?? ""} readOnly />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Ano</span>
          <Input defaultValue={car?.year ?? ""} readOnly />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Quilometragem</span>
          <Input defaultValue={car?.mileage_km ?? ""} readOnly />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Potencia</span>
          <Input defaultValue={car?.power_hp ?? ""} readOnly />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Combustivel</span>
          <Input defaultValue={car?.fuel ?? ""} readOnly />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Transmissao</span>
          <Input defaultValue={car?.transmission ?? ""} readOnly />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Categoria</span>
          <Select defaultValue={car?.category ?? "Performance"} disabled>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Estado</span>
          <Select defaultValue={car?.status ?? "draft"} disabled>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Descricao curta</span>
          <Textarea defaultValue={car?.shortDescription ?? ""} readOnly />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Descricao</span>
          <Textarea defaultValue={car?.description ?? ""} readOnly />
        </label>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="button">Guardar visual</Button>
      </div>
    </form>
  );
}
