"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getAllPhotos,
  getAlbumsByCategory,
  getCategories,
  type Album,
  type Category,
  type GalleryPhoto,
} from "@/lib/firebaseFirestore";

const ServicesSection = () => {
  const router = useRouter();
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoadError(null);
      try {
        const [categories, photosData] = await Promise.all([
          getCategories(),
          getAllPhotos(),
        ]);
        setCategoriesData(categories);
        setPhotos(photosData);
        if (categories.length) {
          setSelectedCategory((prev) => prev ?? categories[0].id);
        }
      } catch (error) {
        console.error("Error al cargar portfolio:", error);
        setLoadError("No se pudo cargar el portfolio.");
      }
    };

    loadData();
  }, []);

  const categories = useMemo<Category[]>(
    () => categoriesData,
    [categoriesData],
  );

  const categoryAlbums = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }
    return albums.filter((album) => album.categoryId === selectedCategory);
  }, [albums, selectedCategory]);

  const selectedAlbumImages = useMemo(() => {
    if (!selectedAlbum) {
      return [];
    }
    return photos
      .filter((photo) => photo.albumId === selectedAlbum)
      .map((photo) => photo.imageUrl);
  }, [photos, selectedAlbum]);

  const selectedAlbumName = useMemo(() => {
    return albums.find((album) => album.id === selectedAlbum)?.name ?? "";
  }, [albums, selectedAlbum]);

  useEffect(() => {
    if (!selectedCategory) {
      setAlbums([]);
      setSelectedAlbum(null);
      return;
    }
    const loadAlbums = async () => {
      try {
        const albumsData = await getAlbumsByCategory(selectedCategory);
        setAlbums(albumsData);
        setSelectedAlbum((prev) => prev ?? albumsData[0]?.id ?? null);
      } catch (error) {
        console.error("Error al cargar álbumes:", error);
        setAlbums([]);
        setSelectedAlbum(null);
      }
    };
    loadAlbums();
  }, [selectedCategory]);

  useEffect(() => {
    if (
      selectedCategory &&
      !categories.some((cat) => cat.id === selectedCategory)
    ) {
      setSelectedCategory(null);
      setSelectedAlbum(null);
    }
  }, [categories, selectedCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section className="relative py-20">
      {/* Fade superior desde AboutUsSection */}
      <div className="absolute top-0 inset-x-0 h-24 md:h-96 bg-gradient-to-b from-[#111111] via-[#1f1f1f]/80 via-60% via-[#1f1f1f]/40 via-40% to-transparent z-0"></div>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[#111111] z-0 pt-24 md:pt-96 pb-24 md:pb-96"></div>

      <div className="relative z-10">
        {/* Título centrado de la sección */}
        <div className="text-center mb-12 md:mb-20 px-4">
          <h2 className="text-3xl md:text-5xl font-thin text-[#EDEDED] tracking-wider mb-4">
            PORTFOLIO
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#3a3a3a]/60 to-transparent mx-auto"></div>
        </div>
        {loadError && (
          <div className="text-center text-[#C6C6C6] mb-6">{loadError}</div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Sidebar de categorías - horizontal arriba en mobile, vertical izquierda en desktop */}
          <div className="w-full md:w-80 pl-2 md:pl-16 pr-2 md:pr-8 mb-4 md:mb-0 flex-shrink-0">
            <div className="flex md:flex-col flex-row space-x-2 md:space-x-0 space-y-0 md:space-y-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {categories.length === 0 && (
                <div className="text-[#C6C6C6] text-sm">
                  No hay categorías creadas.
                </div>
              )}
              {categories.map((category) => (
                <div key={category.id} className="relative group flex-shrink-0">
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`text-left py-2 md:py-5 px-3 md:px-6 transition-all duration-500 group-hover:bg-[#1f1f1f]/40 rounded-lg whitespace-nowrap ${
                      selectedCategory === category.id
                        ? "text-[#EDEDED] bg-[#1f1f1f]/70 border-b-2 md:border-b-0 md:border-l-4 border-[#c2a68c] shadow-lg"
                        : "text-[#C6C6C6] hover:text-white hover:bg-[#1f1f1f]/40 hover:border-b-2 md:hover:border-b-0 md:hover:border-l-4 hover:border-[#c2a68c]"
                    }`}
                  >
                    <span className="text-[10px] md:text-lg font-light tracking-wide leading-tight">
                      {category.name}
                    </span>
                  </button>

                  {/* Preview de imágenes al hacer hover - solo en desktop */}
                  {hoveredCategory === category.id &&
                    selectedCategory !== category.id && (
                      <div className="hidden md:block absolute left-full top-0 ml-6 w-56 h-36 bg-black/95 backdrop-blur-md rounded-xl p-3 z-20 shadow-2xl border border-[#3a3a3a]/30">
                        {photos.some(
                          (photo) => photo.categoryId === category.id,
                        ) ? (
                          <div className="grid grid-cols-3 gap-2 h-full">
                            {photos
                              .filter(
                                (photo) => photo.categoryId === category.id,
                              )
                              .slice(0, 3)
                              .map((photo, index) => (
                                <div
                                  key={index}
                                  className="relative overflow-hidden rounded-lg group/preview"
                                >
                                  <Image
                                    src={photo.imageUrl}
                                    alt={`Preview ${category.name} ${index + 1}`}
                                    fill
                                    className="object-cover group-hover/preview:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-[#C6C6C6]">
                            Sin fotos
                          </div>
                        )}
                        <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/95"></div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* Área principal de galería */}
          <div className="flex-1 w-full md:pr-6 px-2 md:px-0">
            {selectedCategory ? (
              <div>
                <div className="flex items-center space-x-1 md:space-x-3 mb-3 md:mb-10">
                  <h3 className="text-xs md:text-3xl font-thin text-[#EDEDED] tracking-wide">
                    {
                      categories.find((cat) => cat.id === selectedCategory)
                        ?.name
                    }
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#3a3a3a]/60 to-transparent ml-1 md:ml-4"></div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  {categoryAlbums.map((album) => (
                    <button
                      key={album.id}
                      onClick={() => setSelectedAlbum(album.id)}
                      className={`px-3 py-2 rounded-lg border transition-all duration-300 ${
                        selectedAlbum === album.id
                          ? "bg-[#c2a68c] text-black border-[#bfa88f]"
                          : "bg-[#1f1f1f] text-[#EDEDED] border-[#3a3a3a] hover:border-[#c2a68c]"
                      }`}
                    >
                      {album.name}
                    </button>
                  ))}
                  {categoryAlbums.length === 0 && (
                    <span className="text-[#C6C6C6]">
                      No hay álbumes creados.
                    </span>
                  )}
                </div>

                {selectedAlbumImages.length ? (
                  <div
                    className={`columns-3 md:columns-2 lg:columns-3 xl:columns-4 gap-1 md:gap-6 space-y-1 md:space-y-6 ${
                      selectedCategory &&
                      hoveredCategory &&
                      hoveredCategory !== selectedCategory
                        ? "blur-sm opacity-60"
                        : ""
                    } transition-all duration-500`}
                  >
                    {selectedAlbumImages.slice(0, 10).map((image, index) => {
                      // Generar alturas más pequeñas para mobile, más horizontales
                      const heights = [
                        "h-20 md:h-48",
                        "h-24 md:h-56",
                        "h-28 md:h-64",
                        "h-32 md:h-72",
                        "h-36 md:h-80",
                        "h-40 md:h-96",
                        "h-44 md:h-[14rem]",
                        "h-48 md:h-[16rem]",
                        "h-52 md:h-[18rem]",
                        "h-56 md:h-[20rem]",
                        "h-60 md:h-[22rem]",
                        "h-64 md:h-[24rem]",
                        "h-68 md:h-[26rem]",
                        "h-72 md:h-[28rem]",
                      ];
                      const randomHeight =
                        heights[Math.floor(Math.random() * heights.length)];

                      return (
                        <div
                          key={index}
                          onClick={() => handleImageClick(image)}
                          className={`${randomHeight} relative overflow-hidden rounded-lg md:rounded-xl cursor-pointer group hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-2xl border border-[#3a3a3a]/40 break-inside-avoid mb-1 md:mb-6`}
                        >
                          <Image
                            src={image}
                            alt={`${
                              categories.find(
                                (cat) => cat.id === selectedCategory,
                              )?.name
                            } ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-[#C6C6C6]">
                    No hay fotos para este álbum.
                  </div>
                )}
                {selectedAlbumImages.length > 10 &&
                  selectedCategory &&
                  selectedAlbum && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() =>
                          router.push(
                            `/gallery/${selectedCategory}/${selectedAlbum}`,
                          )
                        }
                        className="px-6 py-3 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 font-medium"
                      >
                        Ver más de {selectedAlbumName || "este álbum"}
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-[#1f1f1f]/80 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#EDEDED]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-[#C6C6C6] text-lg font-light tracking-wide">
                    Selecciona una categoría para ver el portfolio
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para imagen ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-16 right-0 text-white/80 hover:text-white transition-all duration-300 hover:scale-110 bg-black/50 rounded-full p-3 backdrop-blur-sm"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="max-w-[80vw] max-h-[80vh] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Imagen ampliada"
                width={1200}
                height={800}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
