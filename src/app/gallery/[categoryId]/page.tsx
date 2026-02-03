"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  getAlbumsByCategory,
  getCategories,
  getPhotosByCategory,
  type Album,
  type Category,
  type GalleryPhoto,
} from "@/lib/firebaseFirestore";

export default function GalleryByCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.categoryId as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, albumsData, photosData] = await Promise.all([
          getCategories(),
          getAlbumsByCategory(categoryId),
          getPhotosByCategory(categoryId),
        ]);
        const currentCategory =
          categoriesData.find((item) => item.id === categoryId) ?? null;
        setCategory(currentCategory);
        setAlbums(albumsData);
        setPhotos(photosData);
      } catch (error) {
        console.error("Error al cargar galería:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      loadData();
    }
  }, [categoryId]);

  const photosByAlbum = useMemo(() => {
    const grouped: Record<string, GalleryPhoto[]> = {};
    photos.forEach((photo) => {
      if (!grouped[photo.albumId]) {
        grouped[photo.albumId] = [];
      }
      grouped[photo.albumId].push(photo);
    });
    return grouped;
  }, [photos]);

  if (!category && !isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        No se encontró la categoría.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-[#3a3a3a]/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
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
            </div>
            <div className="text-center">
              <h1 className="text-white font-bold text-lg">
                {category?.name ?? "Galería"}
              </h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-8">
        <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {category?.name ?? "Galería"}
            </h1>
            <p className="text-[#C6C6C6]">
              {photos.length} fotografías en esta categoría
            </p>
          </div>
        </section>

        {isLoading ? (
          <div className="py-12 text-center text-[#C6C6C6]">
            Cargando galería...
          </div>
        ) : (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 space-y-12">
              {albums.length === 0 && (
                <div className="text-center text-[#C6C6C6]">
                  No hay álbumes creados.
                </div>
              )}
              {albums.map((album) => (
                <div key={album.id}>
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    {album.name}
                  </h2>
                  {photosByAlbum[album.id]?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {photosByAlbum[album.id].map((photo) => (
                        <div
                          key={photo.id}
                          className="relative aspect-square overflow-hidden rounded-xl border border-[#3a3a3a]/50"
                        >
                          <Image
                            src={photo.imageUrl}
                            alt={photo.title || album.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#C6C6C6]">Sin fotos en este álbum.</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="py-12 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <button
              onClick={() => router.push("/#services")}
              className="px-8 py-4 bg-[#c2a68c] text-black hover:bg-[#bfa88f] transition-colors duration-300 rounded-lg"
            >
              Ver Todas las Categorías
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
