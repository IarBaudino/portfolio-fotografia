"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Category {
  id: string;
  title: string;
  previewImages: string[];
  allImages: string[];
}

const categories: Category[] = [
  {
    id: "retratos",
    title: "Retratos",
    previewImages: ["/retratos-1.jpg", "/retratos-2.jpg", "/retratos-3.jpg"],
    allImages: ["/retratos-1.jpg", "/retratos-2.jpg", "/retratos-3.jpg"],
  },
  {
    id: "fotoperiodismo",
    title: "Fotoperiodismo",
    previewImages: [
      "/fotoperiodismo-1.jpg",
      "/fotoperiodismo-2.jpg",
      "/fotoperiodismo-3.jpg",
    ],
    allImages: [
      "/fotoperiodismo-1.jpg",
      "/fotoperiodismo-2.jpg",
      "/fotoperiodismo-3.jpg",
      "/fotoperiodismo-4.jpg",
    ],
  },
  {
    id: "paisajes",
    title: "Paisajes",
    previewImages: ["/paisajes-1.JPG", "/paisajes-2.JPG", "/paisajes-3.JPG"],
    allImages: [
      "/paisajes-1.JPG",
      "/paisajes-2.JPG",
      "/paisajes-3.JPG",
      "/paisajes-4.JPG",
      "/paisajes-5.JPG",
    ],
  },
  {
    id: "fauna",
    title: "Fauna",
    previewImages: ["/fauna-1.jpg", "/fauna-2.JPG", "/fauna-3.jpg"],
    allImages: ["/fauna-1.jpg", "/fauna-2.JPG", "/fauna-3.jpg", "/fauna-4.JPG"],
  },
];

const ServicesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900 z-0"></div>

      <div className="relative z-10">
        {/* Título centrado de la sección */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-thin text-white tracking-wider mb-4">
            PORTFOLIO
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#e6d8c3]/30 to-transparent mx-auto"></div>
        </div>

        <div className="flex">
          {/* Sidebar de categorías */}
          <div className="w-80 pl-16 pr-8">
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category.id} className="relative group">
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`w-full text-left py-5 px-6 transition-all duration-500 group-hover:bg-[#c2a68c]/5 rounded-lg ${
                      selectedCategory === category.id
                        ? "text-white bg-[#c2a68c]/10 border-l-4 border-[#c2a68c] shadow-lg"
                        : "text-[#e6d8c3] hover:text-white hover:bg-[#c2a68c]/5 hover:border-l-4 hover:border-[#5d866c]"
                    }`}
                  >
                    <span className="text-lg font-light tracking-wide">
                      {category.title}
                    </span>
                  </button>

                  {/* Preview de imágenes al hacer hover */}
                  {hoveredCategory === category.id &&
                    selectedCategory !== category.id && (
                      <div className="absolute left-full top-0 ml-6 w-56 h-36 bg-black/95 backdrop-blur-md rounded-xl p-3 z-20 shadow-2xl border border-[#5d866c]/20">
                        <div className="grid grid-cols-3 gap-2 h-full">
                          {category.previewImages.map((image, index) => (
                            <div
                              key={index}
                              className="relative overflow-hidden rounded-lg group/preview"
                            >
                              <Image
                                src={image}
                                alt={`Preview ${category.title} ${index + 1}`}
                                fill
                                className="object-cover group-hover/preview:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/95"></div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* Área principal de galería */}
          <div className="flex-1 pr-6">
            {selectedCategory ? (
              <div>
                <div className="flex items-center space-x-3 mb-10">
                  <h3 className="text-3xl font-thin text-white tracking-wide">
                    {
                      categories.find((cat) => cat.id === selectedCategory)
                        ?.title
                    }
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#e6d8c3]/20 to-transparent ml-4"></div>
                </div>

                <div
                  className={`columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 ${
                    selectedCategory &&
                    hoveredCategory &&
                    hoveredCategory !== selectedCategory
                      ? "blur-sm opacity-60"
                      : ""
                  } transition-all duration-500`}
                >
                  {categories
                    .find((cat) => cat.id === selectedCategory)
                    ?.allImages.map((image, index) => {
                      // Generar alturas verdaderamente aleatorias para efecto Pinterest
                      const heights = [
                        "h-48",
                        "h-56",
                        "h-64",
                        "h-72",
                        "h-80",
                        "h-96",
                        "h-[14rem]",
                        "h-[16rem]",
                        "h-[18rem]",
                        "h-[20rem]",
                        "h-[22rem]",
                        "h-[24rem]",
                        "h-[26rem]",
                        "h-[28rem]",
                      ];
                      const randomHeight =
                        heights[Math.floor(Math.random() * heights.length)];

                      return (
                        <div
                          key={index}
                          onClick={() => handleImageClick(image)}
                          className={`${randomHeight} relative overflow-hidden rounded-xl cursor-pointer group hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-2xl border border-[#5d866c]/5 break-inside-avoid mb-6`}
                        >
                          <Image
                            src={image}
                            alt={`${
                              categories.find(
                                (cat) => cat.id === selectedCategory
                              )?.title
                            } ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-[#c2a68c]/5 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#e6d8c3]"
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
                  <p className="text-[#e6d8c3] text-lg font-light tracking-wide">
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
