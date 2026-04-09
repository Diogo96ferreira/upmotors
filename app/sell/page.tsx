import { Gauge, ShieldCheck, Wallet } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";
import { CTASection } from "@/components/ui/cta-section";
import { HeroSection } from "@/components/ui/hero-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const steps = [
  {
    icon: ShieldCheck,
    title: "Avaliação especializada",
    description: "Inspeção técnica detalhada e leitura de mercado com foco em viaturas premium.",
  },
  {
    icon: Wallet,
    title: "Valor real",
    description: "Proposta transparente, sustentada por histórico, estado e liquidez do modelo.",
  },
  {
    icon: Gauge,
    title: "Processo ágil",
    description: "Estrutura pronta para integrar aprovação, documentos e backoffice operacional.",
  },
];

export default function SellPage() {
  return (
    <>
      <HeroSection
        eyebrow="Processo de excelência"
        title="Venda o seu carro com confiança"
        description="Transformámos a página de avaliação numa experiência modular, pronta para ligação a formulários persistentes, scoring e automação."
        image="https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=80"
        compact
      />

      <SectionWrapper className="pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Como funciona</p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Rigor técnico, proposta clara
            </h2>
            <p className="max-w-xl text-lg leading-8 text-zinc-400">
              Cada viatura é tratada como um ativo com contexto próprio. O fluxo já está separado da
              interface, o que facilita integração posterior com Supabase ou backoffice.
            </p>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.title} className="border border-white/8 bg-zinc-950 p-6">
                  <step.icon className="h-5 w-5 text-zinc-300" />
                  <h3 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-7 text-zinc-400">{step.description}</p>
                </div>
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
        description="A base está pronta para adicionar upload de fotos, scoring e estado do processo por etapa."
        primaryAction={{ href: "/contact", label: "Falar com a equipa" }}
      />
    </>
  );
}
