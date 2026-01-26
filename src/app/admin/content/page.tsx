"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/sections/Footer";
import { SITE_CONFIG, SERVICES } from "@/constants";

export default function ContentAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [siteConfig, setSiteConfig] = useState(SITE_CONFIG);
  const [services, setServices] = useState(SERVICES);
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
    // Cargar datos guardados desde localStorage
    const savedConfig = localStorage.getItem("siteConfig");
    const savedServices = localStorage.getItem("services");
    
    if (savedConfig) {
      setSiteConfig(JSON.parse(savedConfig));
    }
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleSaveConfig = () => {
    localStorage.setItem("siteConfig", JSON.stringify(siteConfig));
    alert("Configuración guardada exitosamente");
  };

  const handleSaveServices = () => {
    localStorage.setItem("services", JSON.stringify(services));
    alert("Servicios guardados exitosamente");
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
                  Gestión de Contenido
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

          <div className="space-y-8">
            {/* Site Configuration */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#5d866c]/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#e6d8c3]">
                  Información del Sitio
                </h2>
                <button
                  onClick={handleSaveConfig}
                  className="px-4 py-2 bg-[#3a5744] hover:bg-[#5d866c] text-[#e6d8c3] rounded-lg transition-all duration-300"
                >
                  Guardar Cambios
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#e6d8c3] mb-2">
                    Nombre del Sitio
                  </label>
                  <input
                    type="text"
                    value={siteConfig.name}
                    onChange={(e) =>
                      setSiteConfig({ ...siteConfig, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#3a5744]/20 border border-[#5d866c]/40 rounded-lg text-[#e6d8c3] focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#e6d8c3] mb-2">
                    Slogan
                  </label>
                  <input
                    type="text"
                    value={siteConfig.slogan}
                    onChange={(e) =>
                      setSiteConfig({ ...siteConfig, slogan: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#3a5744]/20 border border-[#5d866c]/40 rounded-lg text-[#e6d8c3] focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#e6d8c3] mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={siteConfig.description}
                    onChange={(e) =>
                      setSiteConfig({ ...siteConfig, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 bg-[#3a5744]/20 border border-[#5d866c]/40 rounded-lg text-[#e6d8c3] focus:outline-none focus:border-[#c2a68c] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Services Management */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#5d866c]/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#e6d8c3]">
                  Servicios
                </h2>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-[#3a5744] hover:bg-[#5d866c] text-[#e6d8c3] rounded-lg transition-all duration-300">
                    + Agregar Servicio
                  </button>
                  <button
                    onClick={handleSaveServices}
                    className="px-4 py-2 bg-[#3a5744] hover:bg-[#5d866c] text-[#e6d8c3] rounded-lg transition-all duration-300"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className="bg-[#3a5744]/20 rounded-lg p-4 border border-[#5d866c]/30"
                  >
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-[#e6d8c3] mb-2">
                          Título
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => {
                            const updated = [...services];
                            updated[index].title = e.target.value;
                            setServices(updated);
                          }}
                          className="w-full px-4 py-2 bg-[#3a5744]/20 border border-[#5d866c]/40 rounded-lg text-[#e6d8c3] focus:outline-none focus:border-[#c2a68c]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#e6d8c3] mb-2">
                          Descripción
                        </label>
                        <textarea
                          value={service.description}
                          onChange={(e) => {
                            const updated = [...services];
                            updated[index].description = e.target.value;
                            setServices(updated);
                          }}
                          rows={3}
                          className="w-full px-4 py-2 bg-[#3a5744]/20 border border-[#5d866c]/40 rounded-lg text-[#e6d8c3] focus:outline-none focus:border-[#c2a68c] resize-none"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button className="px-3 py-1.5 bg-red-600/50 hover:bg-red-600 text-white text-sm rounded transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
