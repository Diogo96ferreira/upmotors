import Link from "next/link";
import { mockCars } from "@/app/backoffice/mock-data";
import { BackofficeShell } from "@/components/backoffice/backoffice-shell";

export default function BackofficeCarsPage() {
  return (
    <BackofficeShell
      title="Viaturas"
      description="Lista visual de stock em modo demo."
    >
      <div className="mb-6 flex justify-end">
        <Link
          href="/backoffice/cars/new"
          className="inline-flex h-12 items-center justify-center border border-transparent bg-white px-6 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-zinc-200"
        >
          Nova viatura
        </Link>
      </div>

      <div className="overflow-hidden border border-white/10 bg-zinc-950">
        <div className="grid grid-cols-[1.4fr_1fr_120px_140px_120px] gap-4 border-b border-white/10 px-6 py-4 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
          <span>Viatura</span>
          <span>Slug</span>
          <span>Ano</span>
          <span>Estado</span>
          <span className="text-right">Preco</span>
        </div>

        {mockCars.map((car) => (
          <Link
            key={car.id}
            href={`/backoffice/cars/${car.id}`}
            className="grid grid-cols-[1.4fr_1fr_120px_140px_120px] gap-4 border-b border-white/5 px-6 py-5 text-sm transition hover:bg-white/5"
          >
            <span className="font-medium text-white">
              {car.brand} {car.model}
            </span>
            <span className="truncate text-zinc-400">{car.slug}</span>
            <span className="text-zinc-300">{car.year}</span>
            <span className="text-zinc-300">{car.status}</span>
            <span className="text-right text-zinc-300">{car.price.toLocaleString("pt-PT")} EUR</span>
          </Link>
        ))}
      </div>
    </BackofficeShell>
  );
}
