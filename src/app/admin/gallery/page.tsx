"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/sections/Footer";
import {
  addAlbum,
  addCategory,
  addPhoto,
  deleteAlbum,
  deleteCategory,
  deletePhoto,
  getAlbumsByCategory,
  getAllPhotos,
  getCategories,
  updateAlbum,
  updateCategory,
  updatePhoto,
  type Album,
  type Category,
  type GalleryPhoto,
} from "@/lib/firebaseFirestore";

type PhotoFormState = {
  categoryId: string;
  albumId: string;
  imageUrl: string;
};

type UploadedImage = {
  url: string;
  name: string;
};

const buildEmptyForm = (
  categoryId: string,
  albumId: string
): PhotoFormState => ({
  categoryId,
  albumId,
  imageUrl: "",
});

const buildTitleFromFilename = (filename: string) => {
  const clean = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim();
  return clean || "Sin título";
};

const buildSlugFromName = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function GalleryAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [editingAlbumName, setEditingAlbumName] = useState("");
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [form, setForm] = useState<PhotoFormState>(buildEmptyForm("", ""));
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
        const [categoriesData, photosData] = await Promise.all([
          getCategories(),
          getAllPhotos(),
        ]);
        setCategories(categoriesData);
        setPhotos(photosData);
        setSelectedCategory((prev) => prev ?? categoriesData[0]?.id ?? null);
      } catch (loadError) {
        console.error(loadError);
        setError("No se pudieron cargar los datos de la galería.");
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
      } catch (loadError) {
        console.error(loadError);
        setAlbums([]);
        setSelectedAlbum(null);
      }
    };

    loadAlbums();
  }, [selectedCategory]);

  useEffect(() => {
    if (!albums.length) {
      setSelectedAlbum(null);
      setForm((prev) => ({ ...prev, albumId: "" }));
      return;
    }
    if (!form.albumId || !albums.some((album) => album.id === form.albumId)) {
      setSelectedAlbum(albums[0].id);
      setForm((prev) => ({ ...prev, albumId: albums[0].id }));
    }
  }, [albums, form.albumId]);

  const filteredPhotos = useMemo(() => {
    if (!selectedAlbum) {
      return [];
    }
    return photos.filter((photo) => photo.albumId === selectedAlbum);
  }, [photos, selectedAlbum]);

  const handleOpenCreate = () => {
    const defaultCategoryId = selectedCategory ?? categories[0]?.id ?? "";
    const defaultAlbumId = selectedAlbum ?? albums[0]?.id ?? "";
    setEditingPhoto(null);
    setForm(buildEmptyForm(defaultCategoryId, defaultAlbumId));
    setUploadedImages([]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setForm({
      categoryId: photo.categoryId,
      albumId: photo.albumId,
      imageUrl: photo.imageUrl,
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPhoto(null);
    setUploadedImages([]);
    setError(null);
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      setError("Ingresa un nombre para la categoría.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await addCategory({
        name,
        slug: buildSlugFromName(name),
        order: categories.length + 1,
      });
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      setNewCategoryName("");
      setSelectedCategory((prev) => prev ?? categoriesData[0]?.id ?? null);
    } catch (saveError) {
      console.error(saveError);
      setError("No se pudo crear la categoría.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const shouldDelete = window.confirm(
      "¿Seguro que quieres eliminar esta categoría y sus álbumes/fotos?"
    );
    if (!shouldDelete) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await deleteCategory(categoryId);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      setSelectedCategory(categoriesData[0]?.id ?? null);
    } catch (deleteError) {
      console.error(deleteError);
      setError("No se pudo eliminar la categoría.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleSaveCategoryName = async () => {
    if (!editingCategoryId) {
      return;
    }
    const name = editingCategoryName.trim();
    if (!name) {
      setError("Ingresa un nombre para la categoría.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateCategory(editingCategoryId, {
        name,
        slug: buildSlugFromName(name),
      });
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      setEditingCategoryId(null);
      setEditingCategoryName("");
    } catch (saveError) {
      console.error(saveError);
      setError("No se pudo actualizar la categoría.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAlbum = async () => {
    const name = newAlbumName.trim();
    if (!selectedCategory) {
      setError("Selecciona una categoría antes de agregar un álbum.");
      return;
    }
    if (!name) {
      setError("Ingresa un nombre para el álbum.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await addAlbum({
        name,
        slug: buildSlugFromName(name),
        categoryId: selectedCategory,
        order: albums.length + 1,
      });
      const albumsData = await getAlbumsByCategory(selectedCategory);
      setAlbums(albumsData);
      setNewAlbumName("");
      setSelectedAlbum((prev) => prev ?? albumsData[0]?.id ?? null);
    } catch (saveError) {
      console.error(saveError);
      setError("No se pudo crear el álbum.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    const shouldDelete = window.confirm(
      "¿Seguro que quieres eliminar este álbum y sus fotos?"
    );
    if (!shouldDelete) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await deleteAlbum(albumId);
      if (selectedCategory) {
        const albumsData = await getAlbumsByCategory(selectedCategory);
        setAlbums(albumsData);
        setSelectedAlbum(albumsData[0]?.id ?? null);
      }
    } catch (deleteError) {
      console.error(deleteError);
      setError("No se pudo eliminar el álbum.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEditAlbum = (album: Album) => {
    setEditingAlbumId(album.id);
    setEditingAlbumName(album.name);
  };

  const handleCancelEditAlbum = () => {
    setEditingAlbumId(null);
    setEditingAlbumName("");
  };

  const handleSaveAlbumName = async () => {
    if (!editingAlbumId) {
      return;
    }
    const name = editingAlbumName.trim();
    if (!name) {
      setError("Ingresa un nombre para el álbum.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateAlbum(editingAlbumId, {
        name,
        slug: buildSlugFromName(name),
      });
      if (selectedCategory) {
        const albumsData = await getAlbumsByCategory(selectedCategory);
        setAlbums(albumsData);
      }
      setEditingAlbumId(null);
      setEditingAlbumName("");
    } catch (saveError) {
      console.error(saveError);
      setError("No se pudo actualizar el álbum.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadFiles = async (files: FileList) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError(
        "Faltan las variables de Cloudinary. Revisa NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
      );
      return;
    }

    setIsUploading(true);
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

          return {
            url,
            name: data.original_filename
              ? buildTitleFromFilename(data.original_filename)
              : buildTitleFromFilename(file.name),
          };
        })
      );

      if (editingPhoto && uploads[0]) {
        setForm((prev) => ({ ...prev, imageUrl: uploads[0].url }));
        return;
      }

      setUploadedImages((prev) => [...prev, ...uploads]);
    } catch (uploadError) {
      console.error(uploadError);
      setError("No se pudo subir la imagen a Cloudinary.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSavePhoto = async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (editingPhoto) {
        if (!form.imageUrl) {
          setError("Selecciona una imagen antes de guardar.");
          return;
        }
        await updatePhoto(editingPhoto.id, {
          title: editingPhoto.title ?? "Sin título",
          categoryId: form.categoryId,
          albumId: form.albumId,
          imageUrl: form.imageUrl,
        });
        setPhotos((prev) =>
          prev.map((photo) =>
            photo.id === editingPhoto.id
              ? {
                  ...photo,
                  categoryId: form.categoryId,
                  albumId: form.albumId,
                  imageUrl: form.imageUrl,
                }
              : photo
          )
        );
      } else {
        const sources =
          uploadedImages.length > 0
            ? uploadedImages
            : form.imageUrl
            ? [
                {
                  url: form.imageUrl,
                  name: "Sin título",
                },
              ]
            : [];

        if (!sources.length || !form.categoryId || !form.albumId) {
          setError("Selecciona categoría, álbum y sube al menos una imagen.");
          return;
        }

        const newPhotos = await Promise.all(
          sources.map(async (source) => {
            const newId = await addPhoto({
              title: source.name,
              categoryId: form.categoryId,
              albumId: form.albumId,
              imageUrl: source.url,
            });
            return {
              id: newId,
              title: source.name,
              categoryId: form.categoryId,
              albumId: form.albumId,
              imageUrl: source.url,
            };
          })
        );

        setPhotos((prev) => [...newPhotos, ...prev]);
      }
      setIsFormOpen(false);
      setEditingPhoto(null);
      setUploadedImages([]);
      setForm((prev) => ({ ...prev, imageUrl: "" }));
    } catch (saveError) {
      console.error(saveError);
      const message =
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar la foto.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const shouldDelete = window.confirm(
      "¿Seguro que quieres eliminar esta foto?"
    );
    if (!shouldDelete) {
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await deletePhoto(photoId);
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    } catch (deleteError) {
      console.error(deleteError);
      setError("No se pudo eliminar la foto.");
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
                  Gestión de Galería
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

          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Category & Album Management */}
          <div className="mb-8 bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#3a3a3a]/50">
            <h2 className="text-xl font-semibold text-white mb-4">
              Categorías y Álbumes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                  Nueva categoría
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                    placeholder="Ej: Deportes"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300"
                  >
                    Agregar
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => {
                    const isEditing = editingCategoryId === category.id;
                    return (
                      <div
                        key={category.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                          selectedCategory === category.id
                            ? "bg-[#c2a68c] text-black border-[#bfa88f]"
                            : "bg-black/60 text-white border-[#C6C6C6]/40"
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editingCategoryName}
                              onChange={(e) =>
                                setEditingCategoryName(e.target.value)
                              }
                              className="px-2 py-1 rounded bg-[#1f1f1f] text-white text-sm border border-[#3a3a3a]"
                            />
                            <button
                              onClick={handleSaveCategoryName}
                              className="text-xs text-black/80 hover:text-black"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEditCategory}
                              className="text-xs text-black/70 hover:text-black"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setSelectedCategory(category.id)}
                            >
                              {category.name}
                            </button>
                            <button
                              onClick={() => handleStartEditCategory(category)}
                              className="text-xs text-black/70 hover:text-black"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-xs text-black/70 hover:text-black"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                  Nuevo álbum
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                    placeholder="Ej: Torneo de fútbol"
                  />
                  <button
                    onClick={handleAddAlbum}
                    className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300"
                  >
                    Agregar
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {albums.map((album) => {
                    const isEditing = editingAlbumId === album.id;
                    return (
                      <div
                        key={album.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                          selectedAlbum === album.id
                            ? "bg-[#c2a68c] text-black border-[#bfa88f]"
                            : "bg-black/60 text-white border-[#C6C6C6]/40"
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editingAlbumName}
                              onChange={(e) =>
                                setEditingAlbumName(e.target.value)
                              }
                              className="px-2 py-1 rounded bg-[#1f1f1f] text-white text-sm border border-[#3a3a3a]"
                            />
                            <button
                              onClick={handleSaveAlbumName}
                              className="text-xs text-black/80 hover:text-black"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEditAlbum}
                              className="text-xs text-black/70 hover:text-black"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => setSelectedAlbum(album.id)}>
                              {album.name}
                            </button>
                            <button
                              onClick={() => handleStartEditAlbum(album)}
                              className="text-xs text-black/70 hover:text-black"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteAlbum(album.id)}
                              className="text-xs text-black/70 hover:text-black"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {isFormOpen && (
            <div className="mb-8 bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-[#3a3a3a]/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingPhoto ? "Editar Foto" : "Agregar Fotos"}
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleSavePhoto}
                    disabled={isSaving || isUploading}
                    className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300 disabled:opacity-60"
                  >
                    {isSaving ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    onClick={handleCloseForm}
                    className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-all duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Categoría
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => {
                        const nextCategory = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          categoryId: nextCategory,
                        }));
                        setSelectedCategory(nextCategory);
                      }}
                      className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Álbum
                    </label>
                    <select
                      value={form.albumId}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          albumId: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#c2a68c]"
                    >
                      {albums.map((album) => (
                        <option key={album.id} value={album.id}>
                          {album.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!editingPhoto && (
                    <p className="text-xs text-[#C6C6C6]">
                      Puedes seleccionar varias imágenes y se crearán todas
                      dentro del álbum seleccionado.
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Subir Imágenes a Cloudinary
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple={!editingPhoto}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleUploadFiles(files);
                        }
                      }}
                      className="w-full text-white text-sm"
                    />
                    {isUploading && (
                      <p className="text-[#C6C6C6] text-xs mt-2">
                        Subiendo imagen...
                      </p>
                    )}
                  </div>
                  {!editingPhoto && uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={`${image.url}-${index}`}
                          className="relative aspect-video rounded-lg overflow-hidden border border-[#C6C6C6]/60"
                        >
                          <Image
                            src={image.url}
                            alt={image.name}
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={() =>
                              setUploadedImages((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {editingPhoto && form.imageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-[#3a3a3a]/60">
                      <Image
                        src={form.imageUrl}
                        alt={editingPhoto?.title || "Preview"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Photos Grid */}
          {selectedAlbum && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Fotos de{" "}
                  {albums.find((album) => album.id === selectedAlbum)?.name}
                </h2>
                <button
                  onClick={handleOpenCreate}
                  className="px-4 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300"
                >
                  + Agregar Foto
                </button>
              </div>

              {isLoading ? (
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-12 border border-[#3a3a3a]/50 text-center">
                  <p className="text-[#C6C6C6]">Cargando fotos...</p>
                </div>
              ) : filteredPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-[#3a3a3a]/50 hover:border-[#c2a68c] transition-all duration-300 group relative"
                    >
                      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.title || "Foto"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1 truncate">
                        {photo.title || "Sin título"}
                      </h3>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleOpenEdit(photo)}
                          className="flex-1 px-3 py-1.5 bg-[#c2a68c]/70 hover:bg-[#c2a68c] text-black text-xs rounded transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="flex-1 px-3 py-1.5 bg-red-600/50 hover:bg-red-600 text-white text-xs rounded transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-12 border border-[#3a3a3a]/50 text-center">
                  <p className="text-[#C6C6C6] mb-4">
                    No hay fotos en este servicio aún
                  </p>
                  <button
                    onClick={handleOpenCreate}
                    className="px-6 py-2 bg-[#c2a68c] hover:bg-[#bfa88f] text-black rounded-lg transition-all duration-300"
                  >
                    + Agregar Primera Foto
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
