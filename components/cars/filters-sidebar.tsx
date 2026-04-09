"use client";

import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Category = "Todos" | "Performance" | "Classicos" | "SUV" | "Executive";
type Transmission = "Todos" | "Manual" | "Automático";
type SortValue = "price-asc" | "price-desc" | "newest";

type FiltersSidebarProps = {
  category: Category;
  transmission: Transmission;
  sort: SortValue;
  onCategoryChange: (value: Category) => void;
  onTransmissionChange: (value: Transmission) => void;
  onSortChange: (value: SortValue) => void;
};

const categories: Category[] = ["Todos", "Performance", "Classicos", "SUV", "Executive"];
const transmissions: Transmission[] = ["Todos", "Manual", "Automático"];

export function FiltersSidebar({
  category,
  transmission,
  sort,
  onCategoryChange,
  onTransmissionChange,
  onSortChange,
}: FiltersSidebarProps) {
  return (
    <aside className="w-full max-w-xs space-y-10 lg:sticky lg:top-28">
      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
          Filtrar coleção
        </p>
        <div className="space-y-3">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              className={cn(
                "block text-left text-sm uppercase tracking-[0.2em] transition-colors",
                category === item ? "text-white" : "text-zinc-500 hover:text-white"
              )}
            >
              {item === "Classicos" ? "Clássicos & Heritage" : item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
          Transmissão
        </p>
        <div className="flex flex-wrap gap-2">
          {transmissions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onTransmissionChange(item)}
              className={cn(
                "border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors",
                transmission === item
                  ? "border-white bg-white text-black"
                  : "border-white/15 text-zinc-400 hover:border-white/30 hover:text-white"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
          Ordenação
        </p>
        <Select value={sort} onChange={(event) => onSortChange(event.target.value as SortValue)}>
          <option value="price-asc">Preço ascendente</option>
          <option value="price-desc">Preço descendente</option>
          <option value="newest">Mais recentes</option>
        </Select>
      </div>
    </aside>
  );
}
