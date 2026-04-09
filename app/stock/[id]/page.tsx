import { notFound } from "next/navigation";
import { CarGallery } from "@/components/cars/car-gallery";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { CarGrid } from "@/components/cars/car-grid";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCarBySlug, getSimilarCars } from "@/lib/data";
import { formatMileage, formatPrice } from "@/lib/utils";

type DetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CarDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const car = await getCarBySlug(id);

  if (!car) {
    notFound();
  }

  const similarCars = await getSimilarCars(id);

  return (
    <>
      <section className="relative min-h-[85svh] overflow-hidden pt-24">
        <img src={car.image} alt={`${car.brand} ${car.model}`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />

        <div className="container-shell relative z-10 flex min-h-[85svh] flex-col justify-end pb-16">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-zinc-300">
            <span className="border border-white/20 px-3 py-1">{car.category}</span>
            <StatusBadge status={car.status} />
            <span>Ref. {car.id}</span>
          </div>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div className="max-w-4xl">
              <h1 className="font-[family-name:var(--font-heading)] text-5xl font-bold uppercase leading-none tracking-tight md:text-7xl">
                {car.brand} {car.model}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">{car.description}</p>
            </div>
            <div className="lg:text-right">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-400">Preço</p>
              <p className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight">
                {formatPrice(car.price)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionWrapper className="pt-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-12">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Quilometragem", `${formatMileage(car.mileage_km)} km`],
                ["Transmissão", car.transmission],
                ["Potência", `${car.power_hp ?? "N/D"} cv`],
                ["Ano", String(car.year)],
              ].map(([label, value]) => (
                <div key={label} className="border border-white/8 bg-zinc-950 p-6">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">{label}</p>
                  <p className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase tracking-tight">
                  Especificações técnicas
                </h2>
                <div className="mt-8 space-y-4">
                  {[
                    ["Motorização", car.specs.engine],
                    ["Tração", car.specs.drivetrain],
                    ["Combustível", car.fuel],
                    ["0-100 km/h", car.specs.acceleration],
                    ["Cor exterior", car.specs.exterior],
                    ["Interior", car.specs.interior],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
                      <span className="text-sm uppercase tracking-[0.18em] text-zinc-500">{label}</span>
                      <span className="text-sm font-medium text-zinc-100">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-white/8 bg-zinc-950 p-8">
                <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Curadoria de especialista</p>
                <p className="mt-5 text-lg leading-8 text-zinc-300">{car.highlight}</p>
              </div>
            </div>

            <CarGallery images={[car.image, ...car.gallery]} altBase={`${car.brand} ${car.model}`} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
            <div className="border border-white/10 bg-zinc-950 p-8">
              <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Atendimento dedicado</p>
              <h3 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                Garantia certificada
              </h3>
              <p className="mt-4 leading-7 text-zinc-400">
                Preparação de atelier, validação técnica e apoio comercial pronto para integração com CRM.
              </p>
              <div className="mt-8 space-y-3">
                <Button className="w-full">Contactar especialista</Button>
                <Button variant="outline" className="w-full">
                  Agendar visita
                </Button>
              </div>
            </div>

            <div className="border-l-2 border-white/25 bg-black px-6 py-5 text-sm leading-7 text-zinc-400">
              Localização: {car.specs.location}. Entrega com dossier digital e histórico consolidado.
            </div>
          </aside>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-t border-white/5">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Sugestão</p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Viaturas similares
            </h2>
          </div>
        </div>
        <CarGrid
          cars={similarCars}
          emptyState={{
            eyebrow: "Sem sugestões",
            title: "Ainda não existem viaturas relacionadas",
            description:
              "Quando houver mais unidades na mesma categoria no Supabase, esta secção será preenchida automaticamente.",
            action: {
              href: "/stock",
              label: "Voltar ao stock",
            },
          }}
        />
      </SectionWrapper>
    </>
  );
}
