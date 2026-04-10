"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car } from "@/types/car";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCarCategoryLabel } from "@/lib/labels";
import { formatMileage, formatPrice } from "@/lib/utils";

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  return (
    <motion.article
      whileHover={{ scale: 1.015, y: -6 }}
      transition={{ duration: 0.25 }}
      className="group"
    >
      <Link
        href={`/stock/${car.slug}`}
        aria-label={`${car.brand} ${car.model} à venda em Coimbra por ${formatPrice(car.price)}`}
        className="block overflow-hidden border border-white/8 bg-zinc-950"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="absolute left-4 top-4 z-10">
            <StatusBadge status={car.status} />
          </div>
          <Image
            src={car.image}
            alt={`${car.brand} ${car.model} a venda em Coimbra`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                {getCarCategoryLabel(car.category)}
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                {car.brand} {car.model}
              </h3>
            </div>
            <span className="text-sm text-zinc-400">{car.year}</span>
          </div>

          <p className="text-sm leading-7 text-zinc-400">{car.shortDescription}</p>

          <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            <span>{formatMileage(car.mileage_km)} km</span>
            <span>{car.fuel}</span>
            <span>{car.transmission}</span>
            {car.power_hp ? <span>{car.power_hp} cv</span> : null}
          </div>

          <div className="flex items-end justify-between gap-4 border-t border-white/8 pt-5">
            <div>
              <p className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
                {formatPrice(car.price)}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                {car.monthlyLabel ?? "Detalhes tecnicos disponiveis"}
              </p>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
              Ver detalhe
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
