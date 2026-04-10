import Link from "next/link";
import { BackofficeShell } from "@/components/backoffice/backoffice-shell";
import { getAdminCars } from "@/lib/backoffice-data";
import { getCarStatusLabel } from "@/lib/labels";
import { requireBackofficeUser } from "@/lib/backoffice-session";

export default async function BackofficeCarsPage() {
  await requireBackofficeUser();
  const cars = await getAdminCars();

  return (
    <BackofficeShell
      title="Viaturas"
      description="Cria, edita e acompanha o stock publicado na frente publica."
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

        {cars.map((car) => (
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
            <span className="text-zinc-300">{getCarStatusLabel(car.status)}</span>
            <span className="text-right text-zinc-300">{car.price.toLocaleString("pt-PT")} EUR</span>
          </Link>
        ))}

        {cars.length === 0 ? (
          <div className="px-6 py-10 text-sm text-zinc-400">Ainda nao tens viaturas registadas.</div>
        ) : null}
      </div>
    </BackofficeShell>
  );
}
