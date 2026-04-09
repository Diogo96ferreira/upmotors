import { StockCatalog } from "@/components/cars/stock-catalog";
import { CTASection } from "@/components/ui/cta-section";
import { HeroSection } from "@/components/ui/hero-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { getCars } from "@/lib/data";

export default async function StockPage() {
  const cars = await getCars();

  return (
    <>
      <HeroSection
        eyebrow="Curated stock"
        title="Coleção de viaturas em stock"
        description="Explore modelos selecionados com foco em performance, história, proveniência e potencial de integração futura com backoffice e reservas."
        image="https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=1600&q=80"
        compact
      />

      <SectionWrapper className="pt-16">
        <StockCatalog cars={cars} />
      </SectionWrapper>

      <CTASection
        eyebrow="Não encontrou a configuração certa?"
        title="Podemos procurar por si"
        description="A estrutura já está preparada para sourcing, reservas e sincronização com inventário externo."
        primaryAction={{ href: "/contact", label: "Fazer pedido" }}
      />
    </>
  );
}
