import type { Metadata } from "next";
import { StockCatalog } from "@/components/cars/stock-catalog";
import { CTASection } from "@/components/ui/cta-section";
import { EmptyState } from "@/components/ui/empty-state";
import { HeroSection } from "@/components/ui/hero-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { JsonLd } from "@/components/seo/json-ld";
import { getCars } from "@/lib/data";
import { getStockJsonLd, getStockMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Carros Usados em Coimbra | Viaturas Disponiveis",
  description: getStockMetaDescription(),
  alternates: {
    canonical: "/stock",
  },
};

export default async function StockPage() {
  const cars = await getCars();

  return (
    <>
      {cars.length > 0 ? <JsonLd data={getStockJsonLd(cars)} /> : null}

      <HeroSection
        eyebrow="Carros usados Coimbra"
        title="Carros usados em Coimbra prontos a descobrir"
        description="Explore carros a venda em Coimbra com filtros por marca, transmissao, combustivel e preco. Na Up Motors encontra carros usados baratos em Coimbra, carros importados, carros automaticos e oportunidades com preco reduzido."
        image="https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=1600&q=80"
        compact
      />

      <SectionWrapper className="pt-16">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">
              Stand de confianca Coimbra
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              Stock local com selecao pensada para compra informada
            </h2>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-zinc-400">
            Este catalogo reune carros usados em Coimbra, carros seminovos em Coimbra e viaturas
            com perfil premium, sempre com paginas de detalhe, informacao tecnica e contacto direto
            com a equipa. Se procura comprar BMW usado em Coimbra, carros automaticos em Coimbra,
            carros importados ou carros ate 15000EUR em Coimbra, o objetivo e ajudar a filtrar
            rapidamente o que faz sentido para si.
          </p>
        </div>

        {cars.length > 0 ? (
          <StockCatalog cars={cars} />
        ) : (
          <EmptyState
            eyebrow="Stock vazio"
            title="Ainda nao existem carros publicados"
            description="Assim que a tabela de viaturas tiver registos validos, esta pagina passa a mostrar o catalogo completo da Up Motors em Coimbra."
            action={{ href: "/contact", label: "Falar com a equipa" }}
          />
        )}
      </SectionWrapper>

      <CTASection
        eyebrow="Nao encontrou a configuracao certa?"
        title="Peca ajuda para encontrar o carro ideal em Coimbra"
        description="Se o carro certo ainda nao esta publicado, fale connosco. Podemos orientar a pesquisa, sugerir alternativas, procurar carros importados e identificar oportunidades com preco reduzido."
        primaryAction={{ href: "/contact", label: "Pedir contacto" }}
      />
    </>
  );
}
