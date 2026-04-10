export const navItems = [
  { href: "/", label: "Home" },
  { href: "/stock", label: "Stock" },
  { href: "/sell", label: "Vender" },
  { href: "/contact", label: "Contacto" },
];

export const company = {
  name: "Up Motors",
  tagline: "Stand automovel de confianca em Coimbra",
  city: "Coimbra, Portugal",
  addressLine: "Coimbra, Portugal",
  region: "Coimbra",
  postalCode: "3000-000",
  country: "PT",
  email: "atelier@upmotors.pt",
  phone: "+351 239 000 000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Coimbra%2C%20Portugal&z=13&output=embed",
};
