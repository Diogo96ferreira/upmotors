"use client";

import { Car } from "@/types/car";
import { CarStatus } from "@/types/database";
import { Select } from "@/components/ui/select";
import { getCarCategoryLabel, getCarStatusLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

type Category = "Todos" | "Performance" | "Classicos" | "SUV" | "Executive";
type Transmission = "Todos" | "Manual" | "Automático";
type SortValue = "price-asc" | "price-desc" | "newest";
type StatusValue = "Todos" | CarStatus;

type FiltersSidebarProps = {
  cars: Car[];
  category: Category;
  brand: string;
  fuel: string;
  status: StatusValue;
  transmission: Transmission;
  sort: SortValue;
  maxPrice: number;
  minYear: number;
  onCategoryChange: (value: Category) => void;
  onBrandChange: (value: string) => void;
  onFuelChange: (value: string) => void;
  onStatusChange: (value: StatusValue) => void;
  onTransmissionChange: (value: Transmission) => void;
  onSortChange: (value: SortValue) => void;
  onMaxPriceChange: (value: number) => void;
  onMinYearChange: (value: number) => void;
};

const categories: Category[] = ["Todos", "Performance", "Classicos", "SUV", "Executive"];
const transmissions: Transmission[] = ["Todos", "Manual", "Automático"];
const statuses: StatusValue[] = ["Todos", "available", "reserved", "sold", "draft"];
const statusLabels: Record<StatusValue, string> = {
  Todos: "Todos os estados",
  available: getCarStatusLabel("available"),
  reserved: getCarStatusLabel("reserved"),
  sold: getCarStatusLabel("sold"),
  draft: getCarStatusLabel("draft"),
};

export function FiltersSidebar({
  cars,
  category,
  brand,
  fuel,
  status,
  transmission,
  sort,
  maxPrice,
  minYear,
  onCategoryChange,
  onBrandChange,
  onFuelChange,
  onStatusChange,
  onTransmissionChange,
  onSortChange,
  onMaxPriceChange,
  onMinYearChange,
}: FiltersSidebarProps) {
  const brands = Array.from(new Set(cars.map((car) => car.brand))).sort();
  const fuels = Array.from(new Set(cars.map((car) => car.fuel))).sort();
  const highestPrice = cars.length > 0 ? Math.max(...cars.map((car) => car.price)) : 0;
  const lowestYear =
    cars.length > 0 ? Math.min(...cars.map((car) => car.year)) : new Date().getFullYear();

  return (
    <aside className="w-full max-w-xs space-y-10 lg:sticky lg:top-28">
      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
          Filtrar colecao
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
              {item === "Todos" ? "Todos" : getCarCategoryLabel(item)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
          Marca
        </p>
        <Select value={brand} onChange={(event) => onBrandChange(event.target.value)}>
          <option value="Todos">Todas as marcas</option>
          {brands.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
          Estado
        </p>
        <Select value={status} onChange={(event) => onStatusChange(event.target.value as StatusValue)}>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {statusLabels[item]}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
          Combustivel
        </p>
        <Select value={fuel} onChange={(event) => onFuelChange(event.target.value)}>
          <option value="Todos">Todos os combustiveis</option>
          {fuels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
          Transmissao
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
          Ordenacao
        </p>
        <Select value={sort} onChange={(event) => onSortChange(event.target.value as SortValue)}>
          <option value="price-asc">Preco ascendente</option>
          <option value="price-desc">Preco descendente</option>
          <option value="newest">Mais recentes</option>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
            Preco maximo
          </p>
          <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            {new Intl.NumberFormat("pt-PT", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(highestPrice, 1)}
          step={1000}
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(Number(event.target.value))}
          className="w-full accent-white"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
            Ano minimo
          </p>
          <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">{minYear}</span>
        </div>
        <input
          type="range"
          min={lowestYear}
          max={new Date().getFullYear()}
          step={1}
          value={minYear}
          onChange={(event) => onMinYearChange(Number(event.target.value))}
          className="w-full accent-white"
        />
      </div>
    </aside>
  );
}
