"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/sections/Footer";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/constants";
import {
  getSiteConfig,
  saveSiteConfig,
  getSocialLinks,
  saveSocialLinks,
  type SiteConfig,
  type SocialLink,
} from "@/lib/firebaseFirestore";

const defaultSocialLinks: SocialLink[] = SOCIAL_LINKS.map((link, index) => ({
  id: `default-${index}`,
  ...link,
}));

export default function SettingsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(SITE_CONFIG);
  const [socialLinks, setSocialLinks] =
    useState<SocialLink[]>(defaultSocialLinks);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    if (!isAuthenticated) {
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [configData, socialData] = await Promise.all([
          getSiteConfig(),
          getSocialLinks(),
        ]);

        if (configData) {
          setSiteConfig(configData);
        }

        setSocialLinks(socialData.length ? socialData : defaultSocialLinks);
      } catch (loadError) {
        console.error(loadError);
        setError("No se pudo cargar la configuración.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleAddSocialLink = () => {
    setSocialLinks((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, name: "", url: "" },
    ]);
  };

  const handleRemoveSocialLink = (linkId: string) => {
    setSocialLinks((prev) => prev.filter((link) => link.id !== linkId));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await saveSiteConfig(siteConfig);
      await saveSocialLinks(socialLinks);
      alert("Configuración guardada exitosamente");
    } catch (saveError) {
      console.error(saveError);
      setError("No se pudo guardar la configuración.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page-container flex flex-col bg-gradient-to-b from-black via-[#1f1f1f]/40 to-black overflow-hidden">
        <div className="flex-1 flex items-center justify-center overflow-y-auto">
          <div className="text-white text-lg">Verificando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-page-container flex flex-col bg-gradient-to-b from-black via-[#1f1f1f]/40 to-black overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin")}
                className="text-white hover:text-[#c2a68c] transition-colors"
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
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Configuración
                </h1>
                <p className="text-[#C6C6C6] text-sm">YEKA Producciones</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2.5 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
              >
                Ver Sitio
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            {/* Información del Sitio */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#3a3a3a]/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Información del Sitio
                </h2>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 disabled:opacity-60"
                >
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Nombre del Sitio
                  </label>
                  <input
                    type="text"
                    value={siteConfig.name}
                    onChange={(e) =>
                      setSiteConfig({ ...siteConfig, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Slogan
                  </label>
                  <input
                    type="text"
                    value={siteConfig.slogan}
                    onChange={(e) =>
                      setSiteConfig({ ...siteConfig, slogan: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={siteConfig.description}
                    onChange={(e) =>
                      setSiteConfig({
                        ...siteConfig,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c] resize-none"
                  />
                </div>
              </div>
            </div>
            {/* Contact Information */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#3a3a3a]/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Información de Contacto
                </h2>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 disabled:opacity-60"
                >
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={siteConfig.contact.email}
                    onChange={(e) =>
                      setSiteConfig({
                        ...siteConfig,
                        contact: {
                          ...siteConfig.contact,
                          email: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={siteConfig.contact.phone}
                    onChange={(e) =>
                      setSiteConfig({
                        ...siteConfig,
                        contact: {
                          ...siteConfig.contact,
                          phone: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={siteConfig.contact.address}
                    onChange={(e) =>
                      setSiteConfig({
                        ...siteConfig,
                        contact: {
                          ...siteConfig.contact,
                          address: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#3a3a3a]/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Redes Sociales
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddSocialLink}
                    className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300"
                  >
                    + Agregar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 disabled:opacity-60"
                  >
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {isLoading && (
                  <div className="text-[#C6C6C6] text-sm">
                    Cargando redes sociales...
                  </div>
                )}
                {socialLinks.map((link, index) => (
                  <div key={link.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-sm font-medium text-white">
                        Red social {index + 1}
                      </label>
                      <button
                        onClick={() => handleRemoveSocialLink(link.id)}
                        className="px-2 py-1 text-xs bg-red-600/50 hover:bg-red-600 text-white rounded transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => {
                        const updated = [...socialLinks];
                        updated[index].name = e.target.value;
                        setSocialLinks(updated);
                      }}
                      className="w-full px-4 py-2 bg-[#EDEDED] border border-[#C6C6C6] rounded-lg text-black focus:outline-none focus:border-[#c2a68c]"
                      placeholder="Nombre"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...socialLinks];
                        updated[index].url = e.target.value;
                        setSocialLinks(updated);
                      }}
                      className="w-full px-4 py-2 bg-[#EDEDED] border border-[#C6C6C6] rounded-lg text-black focus:outline-none focus:border-[#c2a68c]"
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
