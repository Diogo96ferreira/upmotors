import Link from "next/link";
import { CTASection } from "@/components/ui/cta-section";
import { HeroSection } from "@/components/ui/hero-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { CarGrid } from "@/components/cars/car-grid";
import { getFeaturedCars } from "@/lib/data";

const pillars = [
  {
    title: "Seleção cuidada",
    description: "Apenas viaturas que superam a nossa inspeção técnica entram no atelier.",
  },
  {
    title: "Transparência total",
    description: "Histórico, quilometragem certificada e contexto de mercado com leitura clara.",
  },
  {
    title: "Acompanhamento próximo",
    description: "Do primeiro contacto ao pós-venda, mantemos uma experiência sem fricção.",
  },
];

export default async function HomePage() {
  const featuredCars = await getFeaturedCars();

  return (
    <>
      <HeroSection
        eyebrow="The Precision Atelier"
        title="Encontre o seu próximo carro"
        description="Seleção criteriosa. Confiança garantida. Descubra uma coleção curada de performance, heritage e engenharia com identidade."
        image="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80"
        primaryAction={{ href: "/stock", label: "Ver viaturas" }}
        secondaryAction={{ href: "/sell", label: "Vender o meu carro" }}
        align="bottom"
      />

      <SectionWrapper>
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
              A nossa abordagem
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight md:text-5xl">
              Curadoria premium, sem ruído
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-zinc-400">
            Inspirados pela sobriedade do design contemporâneo e pela cultura automóvel clássica,
            construímos uma experiência editorial e tecnicamente rigorosa.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="border border-white/8 bg-zinc-950 p-8">
              <div className="mb-8 h-px w-12 bg-white/30" />
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                {pillar.title}
              </h3>
              <p className="mt-4 leading-8 text-zinc-400">{pillar.description}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-y border-white/5 bg-black/30">
        <div className="mb-12 flex items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
              Destaques da coleção
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Seleção em foco
            </h2>
          </div>
          <Link href="/stock" className="text-sm uppercase tracking-[0.24em] text-zinc-400 hover:text-white">
            Ver stock completo
          </Link>
        </div>

        <CarGrid cars={featuredCars} />
      </SectionWrapper>

      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-5xl text-white/60">“</p>
          <p className="text-balance text-xl leading-9 text-zinc-300 md:text-2xl">
            A experiência com a Up Motors foi irrepreensível. A seleção é distinta, o processo é
            claro e toda a equipa transmite segurança em cada detalhe.
          </p>
          <p className="mt-8 text-[11px] uppercase tracking-[0.34em] text-zinc-500">
            Testemunho de cliente • Coimbra
          </p>
        </div>
      </SectionWrapper>

      <CTASection
        eyebrow="Pronto para elevar a sua condução?"
        title="Marque uma visita privada ao atelier"
        description="Organizamos um acompanhamento discreto, técnico e personalizado para apresentar a viatura certa."
        primaryAction={{ href: "/contact", label: "Falar com especialista" }}
        secondaryAction={{ href: "/sell", label: "Pedir avaliação" }}
      />
    </>
  );
}
