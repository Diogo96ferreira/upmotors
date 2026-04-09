import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";
import { HeroSection } from "@/components/ui/hero-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { company } from "@/lib/site";

export default function ContactPage() {
  return (
    <>
      <HeroSection
        eyebrow="Contacto"
        title="Conversa direta, orientação especializada"
        description="Uma página preparada para integrar chatbot, qualificação de leads e agendamento, mantendo uma apresentação sóbria e premium."
        image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
        compact
      />

      <SectionWrapper className="pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Atelier</p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Estamos em Coimbra
            </h2>
            <p className="max-w-xl text-lg leading-8 text-zinc-400">
              Ideal para receção de leads qualificadas, pedidos de sourcing, reservas e integração
              com automação comercial.
            </p>

            <div className="grid gap-4">
              {[
                { icon: MapPin, label: "Localização", value: company.city },
                { icon: Mail, label: "Email", value: company.email },
                { icon: Phone, label: "Telefone", value: company.phone },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 border border-white/8 bg-zinc-950 p-5">
                  <item.icon className="h-5 w-5 text-zinc-300" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">{item.label}</p>
                    <p className="mt-1 text-sm text-zinc-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ContactForm title="Marcar reunião" subtitle="Passo 01 • contacto inicial" cta="Enviar pedido" />
        </div>
      </SectionWrapper>
    </>
  );
}
