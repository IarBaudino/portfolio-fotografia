"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/sections/Footer";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/constants";

export default function SettingsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contact, setContact] = useState(SITE_CONFIG.contact);
  const [socialLinks, setSocialLinks] = useState(SOCIAL_LINKS);
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
    const savedContact = localStorage.getItem("contact");
    const savedSocialLinks = localStorage.getItem("socialLinks");
    
    if (savedContact) {
      setContact(JSON.parse(savedContact));
    }
    if (savedSocialLinks) {
      setSocialLinks(JSON.parse(savedSocialLinks));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleSave = () => {
    localStorage.setItem("contact", JSON.stringify(contact));
    localStorage.setItem("socialLinks", JSON.stringify(socialLinks));
    alert("Configuración guardada exitosamente");
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
                  Configuración
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
            {/* Contact Information */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#5d866c]/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#e6d8c3]">
                  Información de Contacto
                </h2>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#3a5744] hover:bg-[#5d866c] text-[#e6d8c3] rounded-lg transition-all duration-300"
                >
                  Guardar Cambios
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#e6d8c3] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact({ ...contact, email: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#3a5744]/20 border border-[#5d866c]/40 rounded-lg text-[#e6d8c3] focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#e6d8c3] mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact({ ...contact, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#3a5744]/20 border border-[#5d866c]/40 rounded-lg text-[#e6d8c3] focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#e6d8c3] mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={(e) =>
                      setContact({ ...contact, address: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#3a5744]/20 border border-[#5d866c]/40 rounded-lg text-[#e6d8c3] focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#5d866c]/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#e6d8c3]">
                  Redes Sociales
                </h2>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#3a5744] hover:bg-[#5d866c] text-[#e6d8c3] rounded-lg transition-all duration-300"
                >
                  Guardar Cambios
                </button>
              </div>
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-medium text-[#e6d8c3]">
                      {link.name}
                    </label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...socialLinks];
                        updated[index].url = e.target.value;
                        setSocialLinks(updated);
                      }}
                      className="w-full px-4 py-2 bg-[#3a5744]/20 border border-[#5d866c]/40 rounded-lg text-[#e6d8c3] focus:outline-none focus:border-[#c2a68c]"
                      placeholder="https://..."
                    />
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
