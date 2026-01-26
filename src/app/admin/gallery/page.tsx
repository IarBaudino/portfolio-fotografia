"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/sections/Footer";
import { SERVICES } from "@/constants";

interface GalleryPhoto {
  id: string;
  title: string;
  serviceId: string;
  imageUrl: string;
  size: "small" | "medium" | "large";
  description?: string;
}

export default function GalleryAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const auth = localStorage.getItem("adminAuth");
    const token = localStorage.getItem("adminToken");

    if (auth === "true" && token) {
      const tokenTime = parseInt(token);
      const now = Date.now();
      const hoursDiff = (now - tokenTime) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      }
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    // Agregar atributo al html y body para prevenir scroll
    document.documentElement.setAttribute("data-admin-page", "true");
    document.body.setAttribute("data-admin-page", "true");
    
    return () => {
      document.documentElement.removeAttribute("data-admin-page");
      document.body.removeAttribute("data-admin-page");
    };
  }, []);

  useEffect(() => {
    // Cargar fotos desde localStorage o usar datos por defecto
    const savedPhotos = localStorage.getItem("galleryPhotos");
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
    // Si no hay fotos guardadas, inicializar con el primer servicio
    if (selectedService === null && SERVICES.length > 0) {
      setSelectedService(SERVICES[0].id);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const filteredPhotos = selectedService
    ? photos.filter((photo) => photo.serviceId === selectedService)
    : [];

  if (!isAuthenticated) {
    return (
      <div className="admin-page-container flex flex-col bg-gradient-to-b from-black via-[#3a5744]/20 to-black overflow-hidden">
        <div className="flex-1 flex items-center justify-center overflow-y-auto">
          <div className="text-[#e6d8c3] text-lg">Verificando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-page-container flex flex-col bg-gradient-to-b from-black via-[#3a5744]/20 to-black overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin")}
                className="text-[#e6d8c3] hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#e6d8c3] mb-2">
                  Gestión de Galería
                </h1>
                <p className="text-[#e6d8c3]/60 text-sm">YEKA Producciones</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Service Selector */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#e6d8c3] mb-4">
              Seleccionar Servicio
            </h2>
            <div className="flex flex-wrap gap-3">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedService === service.id
                      ? "bg-[#3a5744] text-[#e6d8c3] border-2 border-[#c2a68c]"
                      : "bg-black/60 text-[#e6d8c3]/70 border border-[#5d866c]/30 hover:border-[#c2a68c]/50"
                  }`}
                >
                  {service.title}
                </button>
              ))}
            </div>
          </div>

          {/* Photos Grid */}
          {selectedService && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#e6d8c3]">
                  Fotos de {SERVICES.find((s) => s.id === selectedService)?.title}
                </h2>
                <button className="px-4 py-2 bg-[#3a5744] hover:bg-[#5d866c] text-[#e6d8c3] rounded-lg transition-all duration-300">
                  + Agregar Foto
                </button>
              </div>

              {filteredPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-[#5d866c]/30 hover:border-[#c2a68c]/50 transition-all duration-300 group relative"
                    >
                      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-[#e6d8c3] mb-1 truncate">
                        {photo.title}
                      </h3>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 px-3 py-1.5 bg-[#3a5744]/50 hover:bg-[#3a5744] text-[#e6d8c3] text-xs rounded transition-colors">
                          Editar
                        </button>
                        <button className="flex-1 px-3 py-1.5 bg-red-600/50 hover:bg-red-600 text-white text-xs rounded transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-12 border border-[#5d866c]/30 text-center">
                  <p className="text-[#e6d8c3]/60 mb-4">
                    No hay fotos en este servicio aún
                  </p>
                  <button className="px-6 py-2 bg-[#3a5744] hover:bg-[#5d866c] text-[#e6d8c3] rounded-lg transition-all duration-300">
                    + Agregar Primera Foto
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
