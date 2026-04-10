import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/ui/cta-section";
import { HeroSection } from "@/components/ui/hero-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { CarGrid } from "@/components/cars/car-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { getFeaturedCars } from "@/lib/data";
import { company } from "@/lib/site";
import {
  getHomepageMetaDescription,
  getLocalBusinessJsonLd,
  getOrganizationJsonLd,
} from "@/lib/seo";

const pillars = [
  {
    title: "Selecao cuidada",
    description:
      "Selecionamos carros usados em Coimbra com foco em historico, apresentacao, configuracao e coerencia de mercado.",
  },
  {
    title: "Transparencia real",
    description:
      "Falamos de quilometragem, estado, origem da viatura e enquadramento de preco com linguagem clara e objetiva.",
  },
  {
    title: "Acompanhamento proximo",
    description:
      "Da primeira visita ao pos-venda, mantemos um processo humano, discreto e orientado para confianca.",
  },
];

const reasons = [
  "Stand automovel com selecao orientada para carros usados, seminovos, carros importados e viaturas premium.",
  "Apoio especializado para quem procura comprar carro em Coimbra com menor risco e maior clareza.",
  "Atendimento local, proximo e preparado para explicar cada carro com linguagem simples, rigor tecnico e foco no valor real.",
];

const advice = [
  {
    title: "Verifique historico e contexto",
    description:
      "Um bom carro usado nao se avalia so por fotografia ou preco. Historico, quilometragem, manutencao, origem e coerencia geral contam muito.",
  },
  {
    title: "Compare uso e perfil",
    description:
      "Nem todos os carros usados baratos em Coimbra ou carros a preco reduzido servem o mesmo condutor. Pense em cidade, autoestrada, familia e orcamento anual.",
  },
  {
    title: "Peca apoio especializado",
    description:
      "Num stand de confianca em Coimbra, o objetivo nao e pressionar. E ajudar a escolher a viatura certa para o seu contexto real, incluindo carros importados bem documentados.",
  },
];

export const metadata: Metadata = {
  title: "Stand Automovel em Coimbra | Carros Usados de Qualidade | Up Motors",
  description: getHomepageMetaDescription(),
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const featuredCars = await getFeaturedCars();

  return (
    <>
      <JsonLd data={getOrganizationJsonLd()} />
      <JsonLd data={getLocalBusinessJsonLd()} />

      <HeroSection
        eyebrow="Stand automovel em Coimbra"
        title="Stand Automovel em Coimbra"
        description="Na Up Motors encontra carros usados em Coimbra, viaturas seminovas, carros importados e oportunidades a preco reduzido, com selecao cuidada, acompanhamento transparente e apoio real para comprar carro em Coimbra com confianca."
        image="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80"
        primaryAction={{ href: "/stock", label: "Ver carros a venda Coimbra" }}
        secondaryAction={{ href: "/contact", label: "Falar com a equipa" }}
        align="bottom"
      />

      <SectionWrapper>
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
              O seu stand de confianca em Coimbra
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight md:text-5xl">
              Carros usados em Coimbra com criterio, confianca e contexto
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-zinc-400">
            Trabalhamos para quem procura um stand automovel em Coimbra com atendimento proximo,
            selecao seria e informacao clara. Se quer comprar BMW usado em Coimbra, procurar carros
            automaticos em Coimbra, avaliar carros importados ou encontrar uma oportunidade com
            preco reduzido, a Up Motors ajuda a filtrar melhor a escolha.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="border border-white/8 bg-zinc-950 p-8">
              <div className="mb-8 h-px w-12 bg-white/30" />
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                {pillar.title}
              </h3>
              <p className="mt-4 leading-8 text-zinc-400">{pillar.description}</p>
            </article>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-y border-white/5 bg-black/30">
        <div className="mb-12 flex items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
              Carros a venda Coimbra
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Destaques do stock disponivel
            </h2>
          </div>
          <Link href="/stock" className="text-sm uppercase tracking-[0.24em] text-zinc-400 hover:text-white">
            Ver stock completo
          </Link>
        </div>

        <CarGrid
          cars={featuredCars}
          emptyState={{
            eyebrow: "Sem destaques",
            title: "Ainda nao existem viaturas em evidencia",
            description:
              "Assim que houver carros marcados como destaque, esta seccao passa a mostrar a selecao principal da Up Motors em Coimbra.",
            action: {
              href: "/stock",
              label: "Explorar stock",
            },
          }}
        />
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">
              Porque escolher a Up Motors?
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Um stand automovel com garantia de proximidade em Coimbra
            </h2>
          </div>
          <div className="grid gap-4">
            {reasons.map((reason) => (
              <div key={reason} className="border border-white/8 bg-zinc-950 px-6 py-5 text-zinc-300">
                {reason}
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-y border-white/5 bg-zinc-950/40">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">
              Como escolher um carro usado?
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Conteudo util para comprar carro em Coimbra com mais criterio
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              Um bom processo de compra comeca antes da visita ao stand. Ajudamos a interpretar
              manutencao, quilometragem, motorizacao, origem e uso esperado para evitar decisoes
              apressadas e aproximar a escolha certa do seu orcamento.
            </p>
          </div>
          <div className="space-y-4">
            {advice.map((item) => (
              <article key={item.title} className="border border-white/8 bg-black/30 p-6">
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-zinc-400">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">
              Financiamento automovel em Coimbra
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Solucoes pensadas para cada perfil de compra
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              Se procura carros ate 15000EUR em Coimbra, carros usados baratos em Coimbra, carros
              importados ou uma viatura premium com apoio financeiro ajustado, podemos orientar o
              processo e ajudar a perceber o enquadramento mais adequado para a sua compra.
            </p>
          </div>

          <div className="border border-white/8 bg-zinc-950 p-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Contacto local</p>
            <h3 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold uppercase tracking-tight">
              Visite a Up Motors em Coimbra
            </h3>
            <div className="mt-6 space-y-4 text-zinc-300">
              <p>
                <span className="text-zinc-500">Morada:</span> {company.addressLine}
              </p>
              <p>
                <span className="text-zinc-500">Telefone:</span> {company.phone}
              </p>
              <p>
                <span className="text-zinc-500">Email:</span> {company.email}
              </p>
            </div>
            <div className="mt-6 overflow-hidden border border-white/10">
              <iframe
                title="Mapa Up Motors Coimbra"
                src={company.mapEmbedUrl}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </SectionWrapper>

      <CTASection
        eyebrow="Pronto para comprar carro em Coimbra?"
        title="Fale com um especialista da Up Motors"
        description="Se procura um stand automovel com garantia em Coimbra, carros importados bem selecionados ou oportunidades a preco reduzido, contacte-nos para marcar visita e pedir detalhes tecnicos."
        primaryAction={{ href: "/stock", label: "Explorar o stock" }}
        secondaryAction={{ href: "/contact", label: "Pedir contacto" }}
      />
    </>
  );
}
