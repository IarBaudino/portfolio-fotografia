"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

interface GalleryPhoto {
  id: string;
  title: string;
  serviceId: string;
  imageUrl: string;
  size: "small" | "medium" | "large";
  description?: string;
}

// Extended photos for full gallery
const galleryPhotos: GalleryPhoto[] = [
  // Foto Producto - Extended
  {
    id: "p1",
    title: "Producto de Lujo",
    serviceId: "producto",
    imageUrl: "/producto-1.jpg",
    size: "large",
    description: "Fotografía profesional para productos de alta gama",
  },
  {
    id: "p2",
    title: "Catálogo E-commerce",
    serviceId: "producto",
    imageUrl: "/producto-2.jpg",
    size: "medium",
    description: "Imágenes optimizadas para venta online",
  },
  {
    id: "p3",
    title: "Fotografía Publicitaria",
    serviceId: "producto",
    imageUrl: "/producto-3.jpg",
    size: "small",
    description: "Campañas publicitarias impactantes",
  },
  {
    id: "p4",
    title: "Producto Industrial",
    serviceId: "producto",
    imageUrl: "/producto-4.jpg",
    size: "medium",
    description: "Fotografía técnica y profesional",
  },
  {
    id: "p5",
    title: "Packaging",
    serviceId: "producto",
    imageUrl: "/producto-5.jpg",
    size: "large",
    description: "Enfoque en detalles y presentación",
  },
  {
    id: "p6",
    title: "Detalle de Producto",
    serviceId: "producto",
    imageUrl: "/producto-6.jpg",
    size: "small",
    description: "Macrofotografía de alta calidad",
  },
  {
    id: "p7",
    title: "Producto Lifestyle",
    serviceId: "producto",
    imageUrl: "/producto-7.jpg",
    size: "medium",
    description: "Productos en contexto real",
  },
  {
    id: "p8",
    title: "Fotografía Corporativa",
    serviceId: "producto",
    imageUrl: "/producto-8.jpg",
    size: "large",
    description: "Imagen profesional para empresas",
  },
  {
    id: "p9",
    title: "Producto Minimalista",
    serviceId: "producto",
    imageUrl: "/producto-9.jpg",
    size: "small",
    description: "Enfoque en simplicidad y elegancia",
  },
  {
    id: "p10",
    title: "Catálogo Editorial",
    serviceId: "producto",
    imageUrl: "/producto-10.jpg",
    size: "medium",
    description: "Fotografía para revistas y publicaciones",
  },

  // Books - Extended
  {
    id: "b1",
    title: "Retrato Profesional",
    serviceId: "books",
    imageUrl: "/books-1.jpg",
    size: "large",
    description: "Sesiones para modelos profesionales",
  },
  {
    id: "b2",
    title: "Sesión Editorial",
    serviceId: "books",
    imageUrl: "/books-2.jpg",
    size: "medium",
    description: "Fotografía para revistas de moda",
  },
  {
    id: "b3",
    title: "Book de Modelo",
    serviceId: "books",
    imageUrl: "/books-3.jpg",
    size: "small",
    description: "Portfolio completo de modelo",
  },
  {
    id: "b4",
    title: "Retrato Artístico",
    serviceId: "books",
    imageUrl: "/books-4.jpg",
    size: "medium",
    description: "Enfoque creativo y artístico",
  },
  {
    id: "b5",
    title: "Sesión de Estudio",
    serviceId: "books",
    imageUrl: "/books-5.jpg",
    size: "large",
    description: "Fotografía de estudio profesional",
  },
  {
    id: "b6",
    title: "Book Comercial",
    serviceId: "books",
    imageUrl: "/books-6.jpg",
    size: "medium",
    description: "Para publicidad y comerciales",
  },
  {
    id: "b7",
    title: "Retrato Dramático",
    serviceId: "books",
    imageUrl: "/books-7.jpg",
    size: "small",
    description: "Iluminación dramática y expresiva",
  },
  {
    id: "b8",
    title: "Sesión Exterior",
    serviceId: "books",
    imageUrl: "/books-8.jpg",
    size: "large",
    description: "Fotografía en locaciones naturales",
  },

  // Polas - Extended
  {
    id: "pol1",
    title: "Pola Instagram",
    serviceId: "polas",
    imageUrl: "/polas-1.jpg",
    size: "medium",
    description: "Optimizada para redes sociales",
  },
  {
    id: "pol2",
    title: "Selfie Profesional",
    serviceId: "polas",
    imageUrl: "/polas-2.jpg",
    size: "small",
    description: "Autoretrato de alta calidad",
  },
  {
    id: "pol3",
    title: "Pola de Estudio",
    serviceId: "polas",
    imageUrl: "/polas-3.jpg",
    size: "large",
    description: "Fotografía de estudio para polas",
  },
  {
    id: "pol4",
    title: "Pola Casual",
    serviceId: "polas",
    imageUrl: "/polas-4.jpg",
    size: "medium",
    description: "Estilo natural y espontáneo",
  },
  {
    id: "pol5",
    title: "Pola Editorial",
    serviceId: "polas",
    imageUrl: "/polas-5.jpg",
    size: "small",
    description: "Enfoque editorial y profesional",
  },
  {
    id: "pol6",
    title: "Pola Lifestyle",
    serviceId: "polas",
    imageUrl: "/polas-6.jpg",
    size: "medium",
    description: "Estilo de vida y cotidiano",
  },
  {
    id: "pol7",
    title: "Pola Glamour",
    serviceId: "polas",
    imageUrl: "/polas-7.jpg",
    size: "large",
    description: "Fotografía glamorosa y elegante",
  },
  {
    id: "pol8",
    title: "Pola Urbana",
    serviceId: "polas",
    imageUrl: "/polas-8.jpg",
    size: "medium",
    description: "En entorno urbano y moderno",
  },
  {
    id: "pol9",
    title: "Pola Minimalista",
    serviceId: "polas",
    imageUrl: "/polas-9.jpg",
    size: "small",
    description: "Enfoque en simplicidad",
  },
  {
    id: "pol10",
    title: "Pola Artística",
    serviceId: "polas",
    imageUrl: "/polas-10.jpg",
    size: "large",
    description: "Enfoque creativo y artístico",
  },

  // Gastronomía - Extended
  {
    id: "g1",
    title: "Plato Gourmet",
    serviceId: "gastronomia",
    imageUrl: "/gastro-1.jpg",
    size: "large",
    description: "Fotografía culinaria de alta cocina",
  },
  {
    id: "g2",
    title: "Detalle Culinario",
    serviceId: "gastronomia",
    imageUrl: "/gastro-2.jpg",
    size: "medium",
    description: "Enfoque en detalles y texturas",
  },
  {
    id: "g3",
    title: "Ambiente de Restaurante",
    serviceId: "gastronomia",
    imageUrl: "/gastro-3.jpg",
    size: "small",
    description: "Atmósfera y ambiente gastronómico",
  },
  {
    id: "g4",
    title: "Chef en Acción",
    serviceId: "gastronomia",
    imageUrl: "/gastro-4.jpg",
    size: "medium",
    description: "Fotografía de chefs trabajando",
  },
  {
    id: "g5",
    title: "Fotografía Gastronómica",
    serviceId: "gastronomia",
    imageUrl: "/gastro-5.jpg",
    size: "large",
    description: "Arte culinario en imágenes",
  },
  {
    id: "g6",
    title: "Plato Tradicional",
    serviceId: "gastronomia",
    imageUrl: "/gastro-6.jpg",
    size: "medium",
    description: "Cocina tradicional y casera",
  },
  {
    id: "g7",
    title: "Ingredientes Frescos",
    serviceId: "gastronomia",
    imageUrl: "/gastro-7.jpg",
    size: "small",
    description: "Materias primas y ingredientes",
  },
  {
    id: "g8",
    title: "Cocina Internacional",
    serviceId: "gastronomia",
    imageUrl: "/gastro-8.jpg",
    size: "large",
    description: "Platos de diferentes culturas",
  },

  // Eventos - Extended
  {
    id: "e1",
    title: "Boda Elegante",
    serviceId: "eventos",
    imageUrl: "/eventos-1.jpg",
    size: "large",
    description: "Fotografía de bodas sofisticadas",
  },
  {
    id: "e2",
    title: "Evento Corporativo",
    serviceId: "eventos",
    imageUrl: "/eventos-2.jpg",
    size: "medium",
    description: "Eventos empresariales y conferencias",
  },
  {
    id: "e3",
    title: "Cumpleaños",
    serviceId: "eventos",
    imageUrl: "/eventos-3.jpg",
    size: "small",
    description: "Celebraciones personales",
  },
  {
    id: "e4",
    title: "Conferencia",
    serviceId: "eventos",
    imageUrl: "/eventos-4.jpg",
    size: "medium",
    description: "Eventos académicos y profesionales",
  },
  {
    id: "e5",
    title: "Fiesta de Gala",
    serviceId: "eventos",
    imageUrl: "/eventos-5.jpg",
    size: "large",
    description: "Eventos de alta sociedad",
  },
  {
    id: "e6",
    title: "Evento Social",
    serviceId: "eventos",
    imageUrl: "/eventos-6.jpg",
    size: "small",
    description: "Gatherings sociales y familiares",
  },
  {
    id: "e7",
    title: "Inauguración",
    serviceId: "eventos",
    imageUrl: "/eventos-7.jpg",
    size: "medium",
    description: "Eventos de inauguración y apertura",
  },
  {
    id: "e8",
    title: "Celebración Empresarial",
    serviceId: "eventos",
    imageUrl: "/eventos-8.jpg",
    size: "large",
    description: "Eventos corporativos y empresariales",
  },
  {
    id: "e9",
    title: "Aniversario",
    serviceId: "eventos",
    imageUrl: "/eventos-9.jpg",
    size: "medium",
    description: "Celebraciones de aniversario",
  },
  {
    id: "e10",
    title: "Evento Cultural",
    serviceId: "eventos",
    imageUrl: "/eventos-10.jpg",
    size: "small",
    description: "Eventos culturales y artísticos",
  },
];

const serviceNames = {
  producto: "Foto Producto",
  books: "Books",
  polas: "Polas",
  gastronomia: "Gastronomía",
  eventos: "Eventos",
};

const serviceDescriptions = {
  producto: "Fotografía profesional para catálogos, e-commerce y publicidad.",
  books: "Sesiones fotográficas profesionales para modelos y artistas.",
  polas: "Fotografía de estudio para redes sociales y contenido digital.",
  gastronomia: "Fotografía culinaria para restaurantes, chefs y publicaciones.",
  eventos: "Cobertura fotográfica de eventos sociales y corporativos.",
};

export default function GalleryPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const router = useRouter();
  const { serviceId } = React.use(params);

  // Validate serviceId
  if (!serviceNames[serviceId as keyof typeof serviceNames]) {
    notFound();
  }

  const filteredPhotos = galleryPhotos.filter(
    (photo) => photo.serviceId === serviceId
  );

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "small":
        return "md:col-span-1 row-span-1";
      case "medium":
        return "md:col-span-1 row-span-2";
      case "large":
        return "md:col-span-2 row-span-2";
      default:
        return "md:col-span-1 row-span-1";
    }
  };

  const getAspectRatio = (size: string) => {
    switch (size) {
      case "small":
        return "aspect-[3/4]";
      case "medium":
        return "aspect-[4/5]";
      case "large":
        return "aspect-[4/3]";
      default:
        return "aspect-square";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-[#5d866c]/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="text-[#e6d8c3] hover:text-white transition-colors duration-300 flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Volver al Inicio</span>
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-white font-bold text-lg">
                {serviceNames[serviceId as keyof typeof serviceNames]}
              </h1>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {serviceNames[serviceId as keyof typeof serviceNames]}
            </h1>
            <p className="text-xl text-[#e6d8c3] max-w-2xl mx-auto">
              {
                serviceDescriptions[
                  serviceId as keyof typeof serviceDescriptions
                ]
              }
            </p>
            <p className="text-[#e6d8c3] mt-4">
              {filteredPhotos.length} fotografías en esta galería
            </p>
          </div>
        </section>

        {/* Photo Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`group relative overflow-hidden rounded-xl bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] ${getSizeClasses(
                    photo.size
                  )}`}
                >
                  <div
                    className={`w-full h-full bg-gray-700 flex items-center justify-center ${getAspectRatio(
                      photo.size
                    )}`}
                  >
                    <span className="text-[#e6d8c3] text-sm text-center px-4">
                      {photo.title}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-500 flex items-end">
                    <div className="p-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <h3 className="text-lg font-bold mb-2">{photo.title}</h3>
                      {photo.description && (
                        <p className="text-[#e6d8c3] text-sm mb-3">
                          {photo.description}
                        </p>
                      )}
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 bg-[#c2a68c]/20 rounded-full text-xs">
                          Ver detalle
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Back to Services Button */}
        <section className="py-12 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <button
              onClick={() => router.push("/#services")}
              className="px-8 py-4 bg-[#c2a68c] text-black hover:bg-[#e6d8c3] transition-colors duration-300 rounded-lg"
            >
              Ver Todos los Servicios
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
