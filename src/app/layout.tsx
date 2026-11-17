import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

// Self-hosted: evita el flake de next/font/google en Vercel
// (TypeError: Cannot read properties of null (reading '1'))
const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
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
