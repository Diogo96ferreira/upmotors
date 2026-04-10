import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ToastProvider } from "@/components/ui/toast-provider";
import { company } from "@/lib/site";
import { getHomepageMetaDescription } from "@/lib/seo";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: "Up Motors",
    template: "%s | Up Motors",
  },
  description: getHomepageMetaDescription(),
  applicationName: company.name,
  keywords: [
    "carros usados Coimbra",
    "stand automovel Coimbra",
    "comprar carro Coimbra",
    "carros a venda Coimbra",
    "carros seminovos Coimbra",
    "stand de confianca Coimbra",
  ],
  openGraph: {
    title: company.name,
    description: getHomepageMetaDescription(),
    url: company.siteUrl,
    siteName: company.name,
    locale: "pt_PT",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} font-sans`}>
        <ToastProvider>
          <div className="relative min-h-screen">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
