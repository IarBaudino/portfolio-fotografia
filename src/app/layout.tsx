import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YEKA Producciones - Fotógrafo de Casamientos y Eventos en Buenos Aires",
  description:
    "Fotografía profesional de casamientos, cumpleaños y eventos corporativos en Buenos Aires. Capturamos los momentos más importantes de tu vida con estilo y profesionalismo. Cobertura completa de eventos sociales y empresariales.",
  keywords: [
    "fotógrafo de casamientos",
    "fotografía de eventos",
    "fotógrafo de cumpleaños",
    "fotografía corporativa",
    "fotógrafo Buenos Aires",
    "cobertura de eventos",
    "fotografía de bodas",
    "eventos empresariales",
    "YEKA Producciones",
  ],
  openGraph: {
    title: "YEKA Producciones - Fotógrafo de Casamientos y Eventos",
    description:
      "Fotografía profesional de casamientos, cumpleaños y eventos corporativos en Buenos Aires. Capturamos los momentos más importantes.",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "YEKA Producciones - Fotógrafo de Casamientos y Eventos",
    description:
      "Fotografía profesional de casamientos, cumpleaños y eventos corporativos en Buenos Aires.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "YEKA Producciones",
    description:
      "Fotografía profesional de casamientos, cumpleaños y eventos corporativos en Buenos Aires",
    url: "https://yekaproducciones.com",
    telephone: "+549290115502553",
    email: "produccionesyeka@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
    },
    areaServed: {
      "@type": "City",
      name: "Buenos Aires",
    },
    serviceType: [
      "Fotografía de Casamientos",
      "Fotografía de Eventos",
      "Fotografía Corporativa",
      "Fotografía de Cumpleaños",
    ],
    priceRange: "$$",
  };

  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
