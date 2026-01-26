"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/sections/Footer";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Agregar atributo al html y body para prevenir scroll
    document.documentElement.setAttribute("data-admin-page", "true");
    document.body.setAttribute("data-admin-page", "true");
    
    return () => {
      // Limpiar al desmontar
      document.documentElement.removeAttribute("data-admin-page");
      document.body.removeAttribute("data-admin-page");
    };
  }, []);

  useEffect(() => {
    // Verificar autenticación
    const auth = localStorage.getItem("adminAuth");
    const token = localStorage.getItem("adminToken");

    if (auth === "true" && token) {
      // Verificar que el token no sea muy viejo (24 horas)
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

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#e6d8c3] mb-2">
                Panel de Administración
              </h1>
              <p className="text-[#e6d8c3]/60 text-sm">YEKA Producciones</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
            >
              Cerrar Sesión
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gestión de Galería */}
            <button
              onClick={() => router.push("/admin/gallery")}
              className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#5d866c]/30 hover:border-[#c2a68c]/50 transition-all duration-300 hover:transform hover:scale-105 text-left cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-[#e6d8c3] group-hover:text-white transition-colors">
                  Galería
                </h2>
                <svg
                  className="w-5 h-5 text-[#5d866c] group-hover:text-[#c2a68c] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="text-[#e6d8c3]/70 text-sm leading-relaxed">
                Gestiona las imágenes de la galería por servicio
              </p>
            </button>

            {/* Gestión de Contenido */}
            <button
              onClick={() => router.push("/admin/content")}
              className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#5d866c]/30 hover:border-[#c2a68c]/50 transition-all duration-300 hover:transform hover:scale-105 text-left cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-[#e6d8c3] group-hover:text-white transition-colors">
                  Gestión de Contenido
                </h2>
                <svg
                  className="w-5 h-5 text-[#5d866c] group-hover:text-[#c2a68c] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="text-[#e6d8c3]/70 text-sm leading-relaxed">
                Administra el contenido del sitio web
              </p>
            </button>

            {/* Configuración */}
            <button
              onClick={() => router.push("/admin/settings")}
              className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#5d866c]/30 hover:border-[#c2a68c]/50 transition-all duration-300 hover:transform hover:scale-105 text-left cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-[#e6d8c3] group-hover:text-white transition-colors">
                  Configuración
                </h2>
                <svg
                  className="w-5 h-5 text-[#5d866c] group-hover:text-[#c2a68c] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="text-[#e6d8c3]/70 text-sm leading-relaxed">
                Ajustes generales del sitio
              </p>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
