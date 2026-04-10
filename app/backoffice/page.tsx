import Link from "next/link";
import { BackofficeShell } from "@/components/backoffice/backoffice-shell";
import { StatCard } from "@/components/backoffice/stat-card";
import { getAdminCars, getBackofficeStats, getLeadSubmissions } from "@/lib/backoffice-data";
import { requireBackofficeUser } from "@/lib/backoffice-session";

export default async function BackofficeDashboardPage() {
  await requireBackofficeUser();

  const [stats, cars, leads] = await Promise.all([
    getBackofficeStats(),
    getAdminCars(),
    getLeadSubmissions(),
  ]);

  const recentCars = cars.slice(0, 5);
  const recentLeads = leads.slice(0, 5);

  return (
    <BackofficeShell
      title="Dashboard"
      description="Visao rapida do stock publicado e dos pedidos recebidos pela equipa."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total viaturas" value={stats.totalCars} hint="Inventario total registado no catalogo." />
        <StatCard label="Disponiveis" value={stats.availableCars} hint="Viaturas prontas para venda." />
        <StatCard label="Destaques" value={stats.featuredCars} hint="Carros em evidencia na home." />
        <StatCard label="Total leads" value={stats.totalLeads} hint="Pedidos recebidos por formulario." />
        <StatCard label="Leads novas" value={stats.newLeads} hint="Pedidos ainda sem tratamento." />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-2">
        <section className="border border-white/10 bg-zinc-950 p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Stock</p>
              <h2 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                Ultimas viaturas
              </h2>
            </div>
            <Link
              href="/backoffice/cars/new"
              className="inline-flex h-10 items-center justify-center border border-transparent bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-zinc-200"
            >
              Nova viatura
            </Link>
          </div>

          <div className="space-y-4">
            {recentCars.map((car) => (
              <Link
                key={car.id}
                href={`/backoffice/cars/${car.id}`}
                className="flex items-center justify-between gap-4 border border-white/10 p-4 transition hover:border-white/30"
              >
                <div>
                  <p className="font-medium text-white">
                    {car.brand} {car.model}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {car.year} | {car.status} | {car.slug}
                  </p>
                </div>
                <p className="text-sm text-zinc-300">{car.price.toLocaleString("pt-PT")} EUR</p>
              </Link>
            ))}
            {recentCars.length === 0 ? <p className="text-sm text-zinc-400">Ainda nao existem viaturas.</p> : null}
          </div>
        </section>

        <section className="border border-white/10 bg-zinc-950 p-8">
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Leads</p>
            <h2 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
              Pedidos recentes
            </h2>
          </div>

          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="border border-white/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-white">{lead.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{lead.status}</p>
                </div>
                <p className="mt-2 text-sm text-zinc-400">
                  {lead.form_type} | {lead.email}
                </p>
                <p className="mt-3 text-sm text-zinc-300">{lead.message}</p>
              </div>
            ))}
            {recentLeads.length === 0 ? <p className="text-sm text-zinc-400">Ainda nao existem leads.</p> : null}
          </div>
        </section>
      </div>
    </BackofficeShell>
  );
}
