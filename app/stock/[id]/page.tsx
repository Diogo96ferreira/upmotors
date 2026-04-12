import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CarGallery } from "@/components/cars/car-gallery";
import { CarGrid } from "@/components/cars/car-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonVariants } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCarBySlug, getSimilarCars } from "@/lib/data";
import { getCarCategoryLabel } from "@/lib/labels";
import {
  getCarJsonLd,
  getCarMetaDescription,
  getCarMetaTitle,
  getCarSeoBodyCopy,
} from "@/lib/seo";
import { cn, formatMileage, formatPrice } from "@/lib/utils";

type DetailPageProps = {
  params: Promise<{ id: string }>;
};

function splitDetailList(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const car = await getCarBySlug(id);

  if (!car) {
    return {
      title: "Viatura nao encontrada",
      description:
        "Esta viatura pode ja nao estar disponivel. Explore o stock da Up Motors em Coimbra para ver outras oportunidades.",
    };
  }

  return {
    title: getCarMetaTitle(car),
    description: getCarMetaDescription(car),
    alternates: {
      canonical: `/stock/${car.slug}`,
    },
    openGraph: {
      title: getCarMetaTitle(car),
      description: getCarMetaDescription(car),
      images: [{ url: car.image }],
    },
  };
}

export default async function CarDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const car = await getCarBySlug(id);

  if (!car) {
    notFound();
  }

  const similarCars = await getSimilarCars(id);
  const displayName = [car.brand, car.model, car.version].filter(Boolean).join(" ");
  const equipmentItems = splitDetailList(car.specs.equipment);
  const detailBlocks = [
    ["Historico e manutencao", car.specs.history],
    ["Notas da equipa", car.specs.commercialNotes],
  ].filter(([, value]) => Boolean(value));

  return (
    <>
      <JsonLd data={getCarJsonLd(car)} />

      <section className="relative min-h-[85svh] overflow-hidden pt-24">
        <Image
          src={car.image}
          alt={`${displayName} a venda em Coimbra`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />

        <div className="container-shell relative z-10 flex min-h-[85svh] flex-col justify-end pb-16">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-zinc-300">
            <span className="border border-white/20 px-3 py-1">
              {getCarCategoryLabel(car.category)}
            </span>
            <StatusBadge status={car.status} />
            <span>Coimbra</span>
          </div>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div className="max-w-4xl">
              <h1 className="font-[family-name:var(--font-heading)] text-5xl font-bold uppercase leading-none tracking-tight md:text-7xl">
                {displayName}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
                {getCarSeoBodyCopy(car)}
              </p>
            </div>
            <div className="lg:text-right">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-400">Preco</p>
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
                ["Transmissao", car.transmission],
                ["Potencia", `${car.power_hp ?? "N/D"} cv`],
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
                  Especificacoes tecnicas
                </h2>
                <div className="mt-8 space-y-4">
                  {[
                    ["Motorizacao", car.specs.engine],
                    ["Tracao", car.specs.drivetrain],
                    ["Combustivel", car.fuel],
                    ["0-100 km/h", car.specs.acceleration],
                    ["Cor exterior", car.specs.exterior],
                    ["Interior", car.specs.interior],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 border-b border-white/10 py-4"
                    >
                      <span className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                        {label}
                      </span>
                      <span className="text-sm font-medium text-zinc-100">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-white/8 bg-zinc-950 p-8">
                <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                  Comprar carro em Coimbra com mais contexto
                </p>
                <p className="mt-5 text-lg leading-8 text-zinc-300">{car.highlight}</p>
                <p className="mt-5 leading-8 text-zinc-400">
                  Na Up Motors, cada viatura e apresentada com informacao clara, leitura tecnica e
                  enquadramento comercial ajustado. Se procura um stand automovel com garantia em
                  Coimbra, esta abordagem ajuda a decidir com mais seguranca e com melhor leitura
                  da oportunidade.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase tracking-tight">
                Galeria da viatura
              </h2>
              <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
                Veja a apresentacao visual desta viatura disponivel em Coimbra, com acesso a galeria
                completa e imagens pensadas para ajudar na decisao.
              </p>
              <div className="mt-8">
                <CarGallery images={[car.image, ...car.gallery]} altBase={`${displayName} em Coimbra`} />
              </div>
            </div>

            {equipmentItems.length > 0 || detailBlocks.length > 0 ? (
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                {equipmentItems.length > 0 ? (
                  <div className="border border-white/8 bg-zinc-950 p-8">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                      Equipamento
                    </p>
                    <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold uppercase tracking-tight">
                      Extras e detalhes
                    </h2>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {equipmentItems.map((item) => (
                        <div key={item} className="border border-white/10 px-4 py-3 text-sm text-zinc-200">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {detailBlocks.length > 0 ? (
                  <div className="space-y-4">
                    {detailBlocks.map(([label, value]) => (
                      <div key={label} className="border border-white/8 bg-black p-6">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                          {label}
                        </p>
                        <p className="mt-4 leading-7 text-zinc-300">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
            <div className="border border-white/10 bg-zinc-950 p-8">
              <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                Atendimento dedicado
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                Fale com a equipa Up Motors
              </h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Receba detalhes sobre garantia, disponibilidade, financiamento e marque uma visita
                ao nosso stand em Coimbra.
              </p>
              <div className="mt-8 space-y-3">
                <Link href="/contact" className={cn(buttonVariants(), "flex w-full justify-center")}>
                  Pedir informacoes
                </Link>
                <Link
                  href="/contact"
                  className={cn(buttonVariants({ variant: "outline" }), "flex w-full justify-center")}
                >
                  Agendar visita
                </Link>
              </div>
            </div>

            <div className="border-l-2 border-white/25 bg-black px-6 py-5 text-sm leading-7 text-zinc-400">
              Localizacao: Coimbra. Entrega com dossier tecnico, apoio comercial e acompanhamento
              proximo durante o processo de compra.
            </div>
          </aside>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-t border-white/5">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Sugestao</p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Viaturas similares
            </h2>
          </div>
          <Link href="/stock" className={cn(buttonVariants({ variant: "outline" }), "hidden md:flex")}>
            Ver mais carros
          </Link>
        </div>
        <CarGrid
          cars={similarCars}
          emptyState={{
            eyebrow: "Sem sugestoes",
            title: "Ainda nao existem viaturas relacionadas",
            description:
              "Quando houver mais unidades semelhantes no catalogo da Up Motors, esta seccao passa a mostrar novas oportunidades em Coimbra.",
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
