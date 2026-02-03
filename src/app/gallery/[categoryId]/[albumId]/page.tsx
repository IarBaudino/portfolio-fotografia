"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  getAlbumsByCategory,
  getCategories,
  getPhotosByAlbum,
  type Album,
  type Category,
  type GalleryPhoto,
} from "@/lib/firebaseFirestore";

export default function AlbumGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryParam = params?.categoryId as string;
  const albumParam = params?.albumId as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await getCategories();
        const currentCategory =
          categoriesData.find(
            (item) => item.id === categoryParam || item.slug === categoryParam
          ) ?? null;

        if (!currentCategory) {
          setCategory(null);
          setAlbum(null);
          setPhotos([]);
          return;
        }

        const albumsData = await getAlbumsByCategory(currentCategory.id);
        const currentAlbum =
          albumsData.find(
            (item) => item.id === albumParam || item.slug === albumParam
          ) ?? null;

        setCategory(currentCategory);
        setAlbum(currentAlbum);

        if (currentAlbum) {
          const photosData = await getPhotosByAlbum(currentAlbum.id);
          setPhotos(photosData);
        } else {
          setPhotos([]);
        }
      } catch (error) {
        console.error("Error al cargar álbum:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryParam && albumParam) {
      loadData();
    }
  }, [categoryParam, albumParam]);

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!photos.length) {
        return;
      }
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev === null ? 0 : (prev + 1) % photos.length
        );
      }
      if (event.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev === null ? 0 : (prev - 1 + photos.length) % photos.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photos.length, selectedIndex]);

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-[#3a3a3a]/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/")}
              className="text-white hover:text-[#c2a68c] transition-colors duration-300 flex items-center space-x-2"
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
            <div className="text-center">
              <h1 className="text-white font-bold text-lg">
                {album?.name ?? "Álbum"}
              </h1>
              <p className="text-[#C6C6C6] text-xs">{category?.name}</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-8">
        <section className="py-10 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {album?.name ?? "Álbum"}
            </h2>
            <p className="text-[#C6C6C6]">{photos.length} fotografías</p>
          </div>
        </section>

        {isLoading ? (
          <div className="py-12 text-center text-[#C6C6C6]">
            Cargando álbum...
          </div>
        ) : (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4">
              {photos.length === 0 ? (
                <div className="text-center text-[#C6C6C6]">
                  No hay fotos en este álbum.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      className="relative aspect-square overflow-hidden rounded-xl border border-[#3a3a3a]/50 focus:outline-none focus:ring-2 focus:ring-[#c2a68c]"
                    >
                      <Image
                        src={photo.imageUrl}
                        alt={photo.title || album?.name || "Foto"}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {selectedIndex !== null && photos[selectedIndex] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-[#c2a68c] text-2xl"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image
              src={photos[selectedIndex].imageUrl}
              alt="Vista ampliada"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
