import { StockCatalog } from "@/components/cars/stock-catalog";
import { CTASection } from "@/components/ui/cta-section";
import { EmptyState } from "@/components/ui/empty-state";
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
        {cars.length > 0 ? (
          <StockCatalog cars={cars} />
        ) : (
          <EmptyState
            eyebrow="Stock vazio"
            title="Ainda não existem carros publicados"
            description="A ligação ao Supabase já está ativa. Assim que a tabela `cars` tiver registos válidos, esta página passa a preencher automaticamente."
            action={{ href: "/contact", label: "Falar com a equipa" }}
          />
        )}
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
