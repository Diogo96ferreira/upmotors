import type { Metadata } from "next";
import { Gauge, ShieldCheck, Wallet } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";
import { CTASection } from "@/components/ui/cta-section";
import { HeroSection } from "@/components/ui/hero-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { getSellMetaDescription } from "@/lib/seo";

const steps = [
  {
    icon: ShieldCheck,
    title: "Avaliação especializada",
    description:
      "Fazemos leitura técnica da viatura, enquadramento de mercado e validação do estado geral para uma proposta mais justa.",
  },
  {
    icon: Wallet,
    title: "Valor real de mercado",
    description:
      "Recebe uma proposta transparente e sustentada por procura, estado, configuração e liquidez do modelo.",
  },
  {
    icon: Gauge,
    title: "Processo ágil",
    description:
      "Tratamos o contacto com rapidez para que vender o seu carro em Coimbra seja simples, claro e bem acompanhado.",
  },
];

export const metadata: Metadata = {
  title: "Vender Carro em Coimbra | Avaliação Up Motors",
  description: getSellMetaDescription(),
  alternates: {
    canonical: "/sell",
  },
};

export default function SellPage() {
  return (
    <>
      <HeroSection
        eyebrow="Vender carro em Coimbra"
        title="Venda o seu carro com confiança em Coimbra"
        description="Se quer vender o seu carro em Coimbra, a Up Motors faz avaliação técnica, proposta transparente e acompanhamento próximo. Ideal para viaturas usadas, seminovas e propostas com perfil premium."
        image="https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=80"
        compact
      />

      <SectionWrapper className="pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Como funciona</p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Rigor técnico e proposta clara
            </h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-400">
              Para além de vender carros usados em Coimbra, a Up Motors também ajuda proprietários
              que procuram uma avaliação séria, rápida e bem explicada. O objetivo é reduzir
              fricção e criar uma experiência de confiança, desde o primeiro contacto até à
              conclusão do processo.
            </p>
            <div className="space-y-4">
              {steps.map((step) => (
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
            title="Formulário de avaliação"
            subtitle="Passo 01 • detalhes da viatura"
            cta="Pedir avaliação"
            fields="sell"
          />
        </div>
      </SectionWrapper>

      <CTASection
        eyebrow="Pronto para começar?"
        title="Receba uma avaliação inicial sem compromisso"
        description="Envie os dados da sua viatura e fale com a equipa da Up Motors em Coimbra para perceber o melhor enquadramento de venda."
        primaryAction={{ href: "/contact", label: "Falar com a equipa" }}
      />
    </>
  );
}
