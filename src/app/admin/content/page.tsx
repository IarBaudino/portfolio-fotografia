"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/sections/Footer";
import {
  getAboutContent,
  getTestimonials,
  getTestimonialsContent,
  getWhyChooseContent,
  migrateLegacyGalleryData,
  saveAboutContent,
  saveTestimonials,
  saveTestimonialsContent,
  saveWhyChooseContent,
  type AboutContent,
  type Testimonial,
  type TestimonialsContent,
  type WhyChooseContent,
} from "@/lib/firebaseFirestore";

export default function ContentAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [isSavingWhyChoose, setIsSavingWhyChoose] = useState(false);
  const [isSavingTestimonials, setIsSavingTestimonials] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: "",
    paragraphs: ["", "", ""],
  });
  const [whyChooseContent, setWhyChooseContent] = useState<WhyChooseContent>({
    title: "",
    subtitle: "",
    features: [],
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsContent, setTestimonialsContent] =
    useState<TestimonialsContent>({
      title: "",
      subtitle: "",
    });
  const [migrationResult, setMigrationResult] = useState<string | null>(null);
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
        const [aboutData, whyData, testimonialsData, testimonialsText] =
          await Promise.all([
            getAboutContent(),
            getWhyChooseContent(),
            getTestimonials(),
            getTestimonialsContent(),
          ]);

        if (aboutData) {
          setAboutContent({
            title: aboutData.title ?? "",
            paragraphs: aboutData.paragraphs?.length
              ? aboutData.paragraphs
              : ["", "", ""],
          });
        }

        if (whyData) {
          setWhyChooseContent({
            title: whyData.title ?? "",
            subtitle: whyData.subtitle ?? "",
            features: whyData.features ?? [],
          });
        }

        setTestimonials(testimonialsData);
        if (testimonialsText) {
          setTestimonialsContent({
            title: testimonialsText.title ?? "",
            subtitle: testimonialsText.subtitle ?? "",
          });
        }
      } catch (loadError) {
        console.error(loadError);
        setError("No se pudieron cargar los datos del contenido.");
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

  const handleSaveAbout = async () => {
    setIsSavingAbout(true);
    setError(null);
    try {
      await saveAboutContent(aboutContent);
      alert("Sobre Nosotros guardado exitosamente");
    } catch (saveError) {
      console.error(saveError);
      setError("No se pudo guardar el contenido de Sobre Nosotros.");
    } finally {
      setIsSavingAbout(false);
    }
  };

  const handleSaveWhyChoose = async () => {
    setIsSavingWhyChoose(true);
    setError(null);
    try {
      await saveWhyChooseContent(whyChooseContent);
      alert("Sección Por qué elegirnos guardada exitosamente");
    } catch (saveError) {
      console.error(saveError);
      setError("No se pudo guardar Por qué elegirnos.");
    } finally {
      setIsSavingWhyChoose(false);
    }
  };

  const handleAddFeature = () => {
    setWhyChooseContent((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", description: "" }],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setWhyChooseContent((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSaveTestimonials = async () => {
    setIsSavingTestimonials(true);
    setError(null);
    try {
      await saveTestimonials(testimonials);
      await saveTestimonialsContent(testimonialsContent);
      alert("Testimonios guardados exitosamente");
    } catch (saveError) {
      console.error(saveError);
      setError("No se pudieron guardar los testimonios.");
    } finally {
      setIsSavingTestimonials(false);
    }
  };

  const handleAddTestimonial = () => {
    setTestimonials((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        name: "",
        event: "",
        text: "",
        rating: 5,
      },
    ]);
  };

  const handleRemoveTestimonial = (id: string) => {
    setTestimonials((prev) =>
      prev.filter((testimonial) => testimonial.id !== id),
    );
  };

  const handleMigrateLegacy = async () => {
    setIsSavingTestimonials(true);
    setError(null);
    setMigrationResult(null);
    try {
      const result = await migrateLegacyGalleryData();
      setMigrationResult(
        `Migración completa. Categorías: ${result.categoriesCreated}, Álbumes: ${result.albumsCreated}, Fotos actualizadas: ${result.photosUpdated}, Fotos omitidas: ${result.photosSkipped}, Servicios legacy eliminados: ${result.servicesDeleted}.`,
      );
    } catch (migrationError) {
      console.error(migrationError);
      setError("No se pudo completar la migración.");
    } finally {
      setIsSavingTestimonials(false);
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
                  Gestión de Contenido
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
            {/* Sobre Nosotros */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#3a3a3a]/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Sobre Nosotros
                </h2>
                <button
                  onClick={handleSaveAbout}
                  disabled={isSavingAbout}
                  className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 disabled:opacity-60"
                >
                  {isSavingAbout ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Título (opcional)
                  </label>
                  <input
                    type="text"
                    value={aboutContent.title ?? ""}
                    onChange={(e) =>
                      setAboutContent({
                        ...aboutContent,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
                {aboutContent.paragraphs.map((paragraph, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-white mb-2">
                      Párrafo {index + 1}
                    </label>
                    <textarea
                      value={paragraph}
                      onChange={(e) => {
                        const updated = [...aboutContent.paragraphs];
                        updated[index] = e.target.value;
                        setAboutContent({
                          ...aboutContent,
                          paragraphs: updated,
                        });
                      }}
                      rows={3}
                      className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c] resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Por qué elegirnos */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#3a3a3a]/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Por qué elegirnos
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300"
                  >
                    + Agregar Ítem
                  </button>
                  <button
                    onClick={handleSaveWhyChoose}
                    disabled={isSavingWhyChoose}
                    className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 disabled:opacity-60"
                  >
                    {isSavingWhyChoose ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={whyChooseContent.title}
                    onChange={(e) =>
                      setWhyChooseContent({
                        ...whyChooseContent,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={whyChooseContent.subtitle}
                    onChange={(e) =>
                      setWhyChooseContent({
                        ...whyChooseContent,
                        subtitle: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                  />
                </div>
                {whyChooseContent.features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-[#1f1f1f] rounded-lg p-4 border border-[#3a3a3a]"
                  >
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-[#EDEDED] mb-2">
                          Título
                        </label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const updated = [...whyChooseContent.features];
                            updated[index] = {
                              ...updated[index],
                              title: e.target.value,
                            };
                            setWhyChooseContent({
                              ...whyChooseContent,
                              features: updated,
                            });
                          }}
                          className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#EDEDED] mb-2">
                          Descripción
                        </label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => {
                            const updated = [...whyChooseContent.features];
                            updated[index] = {
                              ...updated[index],
                              description: e.target.value,
                            };
                            setWhyChooseContent({
                              ...whyChooseContent,
                              features: updated,
                            });
                          }}
                          rows={3}
                          className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c] resize-none"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="px-3 py-1.5 bg-red-600/60 hover:bg-red-600 text-white text-sm rounded transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonios */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#3a3a3a]/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Testimonios
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddTestimonial}
                    className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300"
                  >
                    + Agregar Testimonio
                  </button>
                  <button
                    onClick={handleSaveTestimonials}
                    disabled={isSavingTestimonials}
                    className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 disabled:opacity-60"
                  >
                    {isSavingTestimonials ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Título de la sección
                    </label>
                    <input
                      type="text"
                      value={testimonialsContent.title}
                      onChange={(e) =>
                        setTestimonialsContent({
                          ...testimonialsContent,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={testimonialsContent.subtitle}
                      onChange={(e) =>
                        setTestimonialsContent({
                          ...testimonialsContent,
                          subtitle: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                    />
                  </div>
                </div>
                {isLoading && (
                  <div className="text-[#C6C6C6] text-sm">
                    Cargando testimonios...
                  </div>
                )}
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="bg-[#1f1f1f] rounded-lg p-4 border border-[#3a3a3a]"
                  >
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-[#EDEDED] mb-2">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={testimonial.name}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[index] = {
                                ...updated[index],
                                name: e.target.value,
                              };
                              setTestimonials(updated);
                            }}
                            className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#EDEDED] mb-2">
                            Evento
                          </label>
                          <input
                            type="text"
                            value={testimonial.event}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[index] = {
                                ...updated[index],
                                event: e.target.value,
                              };
                              setTestimonials(updated);
                            }}
                            className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#EDEDED] mb-2">
                          Testimonio
                        </label>
                        <textarea
                          value={testimonial.text}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index] = {
                              ...updated[index],
                              text: e.target.value,
                            };
                            setTestimonials(updated);
                          }}
                          rows={3}
                          className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c] resize-none"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="block text-sm font-medium text-[#EDEDED]">
                          Rating
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={testimonial.rating}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index] = {
                              ...updated[index],
                              rating: Number(e.target.value) || 5,
                            };
                            setTestimonials(updated);
                          }}
                          className="w-20 px-3 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            handleRemoveTestimonial(testimonial.id)
                          }
                          className="px-3 py-1.5 bg-red-600/60 hover:bg-red-600 text-white text-sm rounded transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Migración Legacy */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#3a3a3a]/50">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Migración de datos antiguos (incluye limpieza)
                  </h2>
                  <p className="text-[#C6C6C6] text-sm">
                    Convierte servicios antiguos en categorías/álbumes y
                    actualiza fotos con el nuevo esquema.
                  </p>
                </div>
                <button
                  onClick={handleMigrateLegacy}
                  disabled={isSavingTestimonials}
                  className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 disabled:opacity-60"
                >
                  Ejecutar Migración y limpiar legacy
                </button>
              </div>
              {migrationResult && (
                <div className="mt-4 text-[#EDEDED] text-sm">
                  {migrationResult}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
