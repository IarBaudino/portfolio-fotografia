"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/sections/Footer";
import {
  getAboutContent,
  getHeroContent,
  getTestimonials,
  getTestimonialsContent,
  getWhyChooseContent,
  migrateLegacyGalleryData,
  saveAboutContent,
  saveHeroContent,
  saveTestimonials,
  saveTestimonialsContent,
  saveWhyChooseContent,
  type AboutContent,
  type HeroContent,
  type Testimonial,
  type TestimonialsContent,
  type WhyChooseContent,
} from "@/lib/firebaseFirestore";

export default function ContentAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [isSavingWhyChoose, setIsSavingWhyChoose] = useState(false);
  const [isSavingTestimonials, setIsSavingTestimonials] = useState(false);
  const [isUploadingAboutImage, setIsUploadingAboutImage] = useState(false);
  const [isUploadingHeroImages, setIsUploadingHeroImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: "",
    paragraphs: ["", "", ""],
    imageUrl: "",
  });
  const [heroContent, setHeroContent] = useState<HeroContent>({
    images: [],
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
        const [
          aboutData,
          heroData,
          whyData,
          testimonialsData,
          testimonialsText,
        ] = await Promise.all([
          getAboutContent(),
          getHeroContent(),
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
            imageUrl: aboutData.imageUrl ?? "",
          });
        }

        if (heroData) {
          setHeroContent({
            images: heroData.images ?? [],
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

  const handleSaveHero = async () => {
    setIsSavingHero(true);
    setError(null);
    try {
      await saveHeroContent(heroContent);
      alert("Hero guardado exitosamente");
    } catch (saveError) {
      console.error(saveError);
      setError("No se pudo guardar el hero.");
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleUploadAboutImage = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError(
        "Faltan las variables de Cloudinary. Revisa NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
      );
      return;
    }

    setIsUploadingAboutImage(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const data = await response.json();
      const url = data.secure_url || data.url;

      if (!url) {
        throw new Error("No se recibió la URL de la imagen.");
      }

      setAboutContent((prev) => ({ ...prev, imageUrl: url }));
    } catch (uploadError) {
      console.error(uploadError);
      setError("No se pudo subir la imagen.");
    } finally {
      setIsUploadingAboutImage(false);
    }
  };

  const handleUploadHeroImages = async (files: FileList) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError(
        "Faltan las variables de Cloudinary. Revisa NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
      );
      return;
    }

    setIsUploadingHeroImages(true);
    setError(null);
    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Error al subir la imagen");
          }

          const data = await response.json();
          const url = data.secure_url || data.url;

          if (!url) {
            throw new Error("No se recibió la URL de la imagen.");
          }

          return url as string;
        })
      );

      setHeroContent((prev) => ({
        ...prev,
        images: [...prev.images, ...uploads],
      }));
    } catch (uploadError) {
      console.error(uploadError);
      setError("No se pudieron subir las imágenes del hero.");
    } finally {
      setIsUploadingHeroImages(false);
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
      prev.filter((testimonial) => testimonial.id !== id)
    );
  };

  const handleMigrateLegacy = async () => {
    setIsSavingTestimonials(true);
    setError(null);
    setMigrationResult(null);
    try {
      const result = await migrateLegacyGalleryData();
      setMigrationResult(
        `Migración completa. Categorías: ${result.categoriesCreated}, Álbumes: ${result.albumsCreated}, Fotos actualizadas: ${result.photosUpdated}, Fotos omitidas: ${result.photosSkipped}, Servicios legacy eliminados: ${result.servicesDeleted}.`
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
            {/* Hero */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#3a3a3a]/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Hero</h2>
                <button
                  onClick={handleSaveHero}
                  disabled={isSavingHero}
                  className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 disabled:opacity-60"
                >
                  {isSavingHero ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Imágenes del carrusel
                  </label>
                  <input
                    id="hero-images-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        handleUploadHeroImages(files);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="hero-images-upload"
                      className="inline-flex items-center justify-center px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 cursor-pointer"
                    >
                      Agregar imágenes
                    </label>
                    {isUploadingHeroImages && (
                      <span className="text-xs text-[#C6C6C6]">
                        Subiendo imágenes...
                      </span>
                    )}
                  </div>
                </div>
                {heroContent.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {heroContent.images.map((imageUrl, index) => (
                      <div
                        key={`${imageUrl}-${index}`}
                        className="relative aspect-video rounded-lg overflow-hidden border border-[#3a3a3a]"
                      >
                        <Image
                          src={imageUrl}
                          alt={`Hero ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() =>
                            setHeroContent((prev) => ({
                              ...prev,
                              images: prev.images.filter(
                                (_, itemIndex) => itemIndex !== index
                              ),
                            }))
                          }
                          className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
                        >
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#C6C6C6]">
                    No hay imágenes cargadas.
                  </p>
                )}
              </div>
            </div>
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
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Imagen de Sobre Nosotros
                  </label>
                  <input
                    id="about-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadAboutImage(file);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="about-image-upload"
                      className="inline-flex items-center justify-center px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 cursor-pointer"
                    >
                      {aboutContent.imageUrl
                        ? "Cambiar imagen"
                        : "Agregar imagen"}
                    </label>
                    {isUploadingAboutImage && (
                      <span className="text-xs text-[#C6C6C6]">
                        Subiendo imagen...
                      </span>
                    )}
                  </div>
                  {aboutContent.imageUrl && (
                    <div className="mt-3 relative w-full max-w-sm aspect-[3/4] rounded-lg overflow-hidden border border-[#3a3a3a]">
                      <Image
                        src={aboutContent.imageUrl}
                        alt="Preview Sobre Nosotros"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
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
