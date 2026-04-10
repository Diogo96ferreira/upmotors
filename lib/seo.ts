import type { Car } from "@/types/car";
import { company } from "@/lib/site";
import { formatMileage, formatPrice } from "@/lib/utils";

function getBaseUrl() {
  return company.siteUrl.replace(/\/$/, "");
}

export function absoluteUrl(path = "") {
  if (!path) {
    return getBaseUrl();
  }

  return `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getCarDisplayName(car: Car) {
  return [car.brand, car.model, car.version].filter(Boolean).join(" ");
}

export function getCarMetaTitle(car: Car) {
  return `${car.brand} ${car.model} à venda em Coimbra | ${car.price}€`;
}

export function getCarMetaDescription(car: Car) {
  const displayName = getCarDisplayName(car);

  return `${displayName} a venda na Up Motors, stand automovel em Coimbra. Descubra esta viatura com ${formatMileage(car.mileage_km)} km, ${car.fuel.toLowerCase()}, caixa ${car.transmission.toLowerCase()} e apoio especializado para comprar carro em Coimbra, incluindo oportunidades em carros importados e unidades com preco reduzido.`;
}

export function getCarSeoBodyCopy(car: Car) {
  const displayName = getCarDisplayName(car);

  return `${displayName} esta disponivel na Up Motors, stand automovel em Coimbra focado em carros usados, seminovos e viaturas de perfil premium. Esta unidade combina ${car.fuel.toLowerCase()}, transmissao ${car.transmission.toLowerCase()} e ${formatMileage(car.mileage_km)} km, o que a torna uma opcao interessante para quem procura comprar carro em Coimbra com contexto tecnico e acompanhamento serio. Fazemos uma leitura cuidada do historico, da configuracao e da apresentacao geral da viatura para entregar uma experiencia mais transparente, com informacao clara, apoio comercial proximo e orientacao ajustada ao seu perfil de utilizacao. Se procura carros a venda em Coimbra com garantia, carros importados bem apresentados ou uma oportunidade com preco reduzido, esta pode ser a ocasiao certa para agendar uma visita, pedir mais detalhes ou reservar contacto direto com a nossa equipa.`;
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: absoluteUrl(),
    email: company.email,
    telephone: company.phone,
    areaServed: "Coimbra, Portugal",
  };
}

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: company.name,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
    url: absoluteUrl(),
    telephone: company.phone,
    email: company.email,
    description:
      "Stand automovel em Coimbra com foco em carros usados, carros seminovos e viaturas premium com acompanhamento tecnico e comercial.",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.addressLine,
      addressLocality: "Coimbra",
      addressRegion: company.region,
      postalCode: company.postalCode,
      addressCountry: company.country,
    },
    areaServed: "Coimbra, Portugal",
  };
}

function getAvailability(status: Car["status"]) {
  switch (status) {
    case "sold":
      return "https://schema.org/SoldOut";
    case "reserved":
      return "https://schema.org/LimitedAvailability";
    case "draft":
      return "https://schema.org/Discontinued";
    default:
      return "https://schema.org/InStock";
  }
}

export function getCarJsonLd(car: Car) {
  const displayName = getCarDisplayName(car);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${displayName} a venda em Coimbra`,
    brand: {
      "@type": "Brand",
      name: car.brand,
    },
    image: [car.image, ...car.gallery],
    description: getCarMetaDescription(car),
    sku: car.id,
    url: absoluteUrl(`/stock/${car.slug}`),
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: car.price,
      availability: getAvailability(car.status),
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "AutoDealer",
        name: company.name,
      },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Quilometragem", value: `${car.mileage_km} km` },
      { "@type": "PropertyValue", name: "Combustivel", value: car.fuel },
      { "@type": "PropertyValue", name: "Transmissao", value: car.transmission },
      { "@type": "PropertyValue", name: "Ano", value: String(car.year) },
      ...(car.power_hp
        ? [{ "@type": "PropertyValue", name: "Potencia", value: `${car.power_hp} cv` }]
        : []),
    ],
  };
}

export function getStockJsonLd(cars: Car[]) {
  return {
    "@context": "https://schema.org",
    "@graph": cars.map((car, index) => ({
      ...getCarJsonLd(car),
      "@id": absoluteUrl(`/stock/${car.slug}`),
      position: index + 1,
    })),
  };
}

export function getHomepageMetaDescription() {
  return "Stand automovel em Coimbra com carros usados de qualidade, viaturas seminovas, carros importados e oportunidades a preco reduzido. Acompanhamento transparente para quem procura comprar carro em Coimbra com confianca.";
}

export function getStockMetaDescription() {
  return "Descubra carros usados em Coimbra, carros a venda em Coimbra, carros importados e viaturas a preco reduzido na Up Motors. Filtre por marca, combustivel, transmissao e encontre o carro certo com apoio especializado.";
}

export function getContactMetaDescription() {
  return "Fale com a Up Motors, o seu stand de confianca em Coimbra. Marque visita, peca informacoes sobre carros usados em Coimbra ou solicite apoio para comprar carro com acompanhamento especializado.";
}

export function getSellMetaDescription() {
  return "Quer vender o seu carro em Coimbra? A Up Motors faz avaliacao tecnica, proposta transparente e acompanhamento profissional para viaturas usadas e seminovas.";
}

export function getFormattedPriceForCopy(price: number) {
  return formatPrice(price).replace(/\s/g, "");
}
