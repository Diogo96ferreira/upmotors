import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";
import { HeroSection } from "@/components/ui/hero-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { company } from "@/lib/site";
import { getContactMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contacto Up Motors Coimbra | Stand Automovel em Coimbra",
  description: getContactMetaDescription(),
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <HeroSection
        eyebrow="Contacto Up Motors Coimbra"
        title="Fale com o seu stand de confianca em Coimbra"
        description="Quer comprar carro em Coimbra, pedir detalhes tecnicos, marcar visita ou iniciar uma importacao automovel por encomenda? A equipa da Up Motors acompanha todo o processo com linguagem clara e proximidade."
        image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
        compact
      />

      <SectionWrapper className="pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              O seu stand de confianca em Coimbra
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Estamos em Coimbra e prontos para ajudar
            </h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-400">
              Se procura carros usados em Coimbra, carros a venda em Coimbra ou apoio para uma
              procura personalizada, use este formulario. Respondemos de forma proxima, sem pressao
              comercial e com foco no que faz sentido para o seu caso.
            </p>

            <div className="grid gap-4">
              {[
                { icon: MapPin, label: "Morada", value: company.addressLine },
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

            <div className="border border-white/8 bg-zinc-950 p-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Importacao por encomenda
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                Procura uma viatura especifica no estrangeiro?
              </h2>
              <p className="mt-3 leading-7 text-zinc-400">
                Se o carro certo nao estiver no stock, diga-nos a configuracao pretendida. A Up
                Motors acompanha pedidos de sourcing e importacao automovel por encomenda para
                clientes que procuram uma unidade especifica.
              </p>
            </div>

            <div className="overflow-hidden border border-white/10">
              <iframe
                title="Mapa Up Motors Coimbra"
                src={company.mapEmbedUrl}
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <ContactForm title="Marcar reuniao" subtitle="Passo 01 • contacto inicial" cta="Enviar pedido" />
        </div>
      </SectionWrapper>
    </>
  );
}
