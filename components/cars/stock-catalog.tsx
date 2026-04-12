"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CarGrid } from "@/components/cars/car-grid";
import { FiltersSidebar } from "@/components/cars/filters-sidebar";
import { Car } from "@/types/car";
import { CarStatus } from "@/types/database";

type Category = "Todos" | "Performance" | "Classicos" | "SUV" | "Executive";
type SortValue = "price-asc" | "price-desc" | "newest";
type StatusValue = "Todos" | CarStatus;

type StockCatalogProps = {
  cars: Car[];
};

function getInitialMaxPrice(cars: Car[]) {
  return cars.length > 0 ? Math.max(...cars.map((car) => car.price)) : 0;
}

function getInitialMinYear(cars: Car[]) {
  return cars.length > 0 ? Math.min(...cars.map((car) => car.year)) : new Date().getFullYear();
}

export function StockCatalog({ cars }: StockCatalogProps) {
  const [category, setCategory] = useState<Category>("Todos");
  const [brand, setBrand] = useState("Todos");
  const [fuel, setFuel] = useState("Todos");
  const [status, setStatus] = useState<StatusValue>("Todos");
  const [transmission, setTransmission] = useState("Todos");
  const [sort, setSort] = useState<SortValue>("price-asc");
  const [maxPrice, setMaxPrice] = useState(() => getInitialMaxPrice(cars));
  const [minYear, setMinYear] = useState(() => getInitialMinYear(cars));

  const filteredCars = useMemo(() => {
    const nextCars = cars
      .filter((car) => (category === "Todos" ? true : car.category === category))
      .filter((car) => (brand === "Todos" ? true : car.brand === brand))
      .filter((car) => (fuel === "Todos" ? true : car.fuel === fuel))
      .filter((car) => (status === "Todos" ? true : car.status === status))
      .filter((car) => (transmission === "Todos" ? true : car.transmission === transmission))
      .filter((car) => car.price <= maxPrice)
      .filter((car) => car.year >= minYear);

    return nextCars.sort((a, b) => {
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return b.year - a.year;
      return a.price - b.price;
    });
  }, [cars, category, brand, fuel, status, transmission, sort, maxPrice, minYear]);

  const animationKey = `${category}-${brand}-${fuel}-${status}-${transmission}-${sort}-${maxPrice}-${minYear}-${filteredCars.map((car) => car.id).join("-")}`;

  function resetFilters() {
    setCategory("Todos");
    setBrand("Todos");
    setFuel("Todos");
    setStatus("Todos");
    setTransmission("Todos");
    setSort("price-asc");
    setMaxPrice(getInitialMaxPrice(cars));
    setMinYear(getInitialMinYear(cars));
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
      <FiltersSidebar
        cars={cars}
        category={category}
        brand={brand}
        fuel={fuel}
        status={status}
        transmission={transmission}
        sort={sort}
        maxPrice={maxPrice}
        minYear={minYear}
        onCategoryChange={setCategory}
        onBrandChange={setBrand}
        onFuelChange={setFuel}
        onStatusChange={setStatus}
        onTransmissionChange={setTransmission}
        onSortChange={setSort}
        onMaxPriceChange={setMaxPrice}
        onMinYearChange={setMinYear}
        onResetFilters={resetFilters}
      />

      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <p className="text-sm text-zinc-400">{filteredCars.length} viaturas disponiveis</p>
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
                  description: "Ajuste os criterios para explorar o restante stock disponivel.",
                  action: {
                    label: "Limpar filtros",
                    onClick: resetFilters,
                  },
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
