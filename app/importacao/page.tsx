import type { Metadata } from "next";
import { Compass, FileSearch, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";
import { HeroSection } from "@/components/ui/hero-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const process = [
  {
    icon: Compass,
    title: "Briefing da viatura",
    description:
      "Definimos contigo a marca, modelo, motorizacao, configuracao, intervalo de ano e orcamento ideal para a pesquisa.",
  },
  {
    icon: FileSearch,
    title: "Pesquisa e validacao",
    description:
      "Filtramos oportunidades no estrangeiro com foco em historico, documentacao, coerencia de mercado e enquadramento tecnico.",
  },
  {
    icon: ShieldCheck,
    title: "Acompanhamento completo",
    description:
      "Explicamos cada etapa de forma clara para que a importacao automovel por encomenda seja mais segura e previsivel.",
  },
];

export const metadata: Metadata = {
  title: "Importacao Automovel por Encomenda em Coimbra | Up Motors",
  description:
    "Procura uma viatura especifica? A Up Motors acompanha importacao automovel por encomenda em Coimbra, com pesquisa personalizada, validacao e apoio proximo.",
  alternates: {
    canonical: "/importacao",
  },
};

export default function ImportacaoPage() {
  return (
    <>
      <HeroSection
        eyebrow="Importacao automovel por encomenda"
        title="Procuramos a viatura certa no estrangeiro"
        description="Se o carro que procura nao estiver no stock, a Up Motors acompanha uma pesquisa personalizada e um processo de importacao automovel por encomenda, com contexto, criterio e proximidade."
        image="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80"
        highlights={["Pedido personalizado", "Pesquisa internacional", "Apoio proximo"]}
        primaryAction={{ href: "/contact", label: "Falar com a equipa" }}
        secondaryAction={{ href: "/stock", label: "Ver stock atual" }}
        align="bottom"
      />

      <SectionWrapper className="pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              Servico dedicado
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Importacao por encomenda com leitura clara do processo
            </h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-400">
              Este servico foi pensado para quem procura uma configuracao especifica e nao quer
              depender apenas do stock disponivel. A Up Motors ajuda a definir o pedido, filtra
              oportunidades no estrangeiro e acompanha a decisao com mais contexto.
            </p>
            <div className="space-y-4">
              {process.map((step) => (
                <article key={step.title} className="border border-white/8 bg-zinc-950 p-6">
                  <step.icon className="h-5 w-5 text-zinc-300" />
                  <h2 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                    {step.title}
                  </h2>
                  <p className="mt-3 leading-7 text-zinc-400">{step.description}</p>
                </article>
              ))}
            </div>
          </div>

          <ContactForm
            title="Pedido de importacao"
            subtitle="Passo 01 • configuracao pretendida"
            cta="Enviar pedido"
            fields="import"
          />
        </div>
      </SectionWrapper>
    </>
  );
}
