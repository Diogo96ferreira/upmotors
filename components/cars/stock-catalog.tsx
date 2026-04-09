"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Car } from "@/types/car";
import { CarGrid } from "@/components/cars/car-grid";
import { FiltersSidebar } from "@/components/cars/filters-sidebar";

type Category = "Todos" | "Performance" | "Classicos" | "SUV" | "Executive";
type Transmission = "Todos" | "Manual" | "Automático";
type SortValue = "price-asc" | "price-desc" | "newest";

type StockCatalogProps = {
  cars: Car[];
};

export function StockCatalog({ cars }: StockCatalogProps) {
  const [category, setCategory] = useState<Category>("Todos");
  const [transmission, setTransmission] = useState<Transmission>("Todos");
  const [sort, setSort] = useState<SortValue>("price-asc");

  const filteredCars = useMemo(() => {
    const nextCars = cars
      .filter((car) => (category === "Todos" ? true : car.category === category))
      .filter((car) => (transmission === "Todos" ? true : car.transmission === transmission));

    return nextCars.sort((a, b) => {
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return b.year - a.year;
      return a.price - b.price;
    });
  }, [cars, category, transmission, sort]);

  const animationKey = `${category}-${transmission}-${sort}-${filteredCars.map((car) => car.id).join("-")}`;

  return (
    <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
      <FiltersSidebar
        category={category}
        transmission={transmission}
        sort={sort}
        onCategoryChange={setCategory}
        onTransmissionChange={setTransmission}
        onSortChange={setSort}
      />

      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <p className="text-sm text-zinc-400">{filteredCars.length} viaturas disponíveis</p>
          <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Curadoria Up Motors
          </p>
        </div>
        <div className="relative min-h-[22rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={animationKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-full"
            >
              <CarGrid
                cars={filteredCars}
                emptyState={{
                  eyebrow: "Sem resultados",
                  title: "Nenhuma viatura corresponde ao filtro",
                  description:
                    "Ajuste a categoria, a transmissão ou a ordenação para explorar o restante stock disponível.",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
