import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  deleteField,
} from "firebase/firestore";
import { db } from "./firebase";

// Tipos de datos
export interface GalleryPhoto {
  id: string;
  title?: string;
  categoryId: string;
  albumId: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  order?: number;
}

export interface Album {
  id: string;
  name: string;
  categoryId: string;
  order?: number;
}

export interface SiteConfig {
  name: string;
  slogan: string;
  description: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
}

export interface Testimonial {
  id: string;
  name: string;
  event: string;
  text: string;
  rating: number;
  order?: number;
}

export interface AboutContent {
  title?: string;
  paragraphs: string[];
}

export interface WhyChooseContent {
  title: string;
  subtitle: string;
  features: Array<{
    title: string;
    description: string;
  }>;
}

export interface TestimonialsContent {
  title: string;
  subtitle: string;
}

// ==================== GALERÍA ====================

/**
 * Obtiene todas las fotos de una categoría específica
 */
export async function getPhotosByCategory(
  categoryId: string,
): Promise<GalleryPhoto[]> {
  try {
    const photosRef = collection(db, "gallery");
    const q = query(
      photosRef,
      where("categoryId", "==", categoryId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as GalleryPhoto[];
  } catch (error) {
    console.error("Error al obtener fotos:", error);
    throw new Error("Error al obtener las fotos");
  }
}

/**
 * Obtiene todas las fotos de la galería
 */
export async function getAllPhotos(): Promise<GalleryPhoto[]> {
  try {
    const photosRef = collection(db, "gallery");
    const querySnapshot = await getDocs(photosRef);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as GalleryPhoto[];
  } catch (error) {
    console.error("Error al obtener todas las fotos:", error);
    throw new Error("Error al obtener las fotos");
  }
}

/**
 * Agrega una nueva foto a la galería
 */
export async function addPhoto(
  photo: Omit<GalleryPhoto, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  try {
    const photosRef = collection(db, "gallery");
    const newPhotoRef = doc(photosRef);

    await setDoc(newPhotoRef, {
      ...photo,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return newPhotoRef.id;
  } catch (error) {
    console.error("Error al agregar foto:", error);
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    throw new Error(`Error al agregar la foto: ${message}`);
  }
}

/**
 * Actualiza una foto existente
 */
export async function updatePhoto(
  photoId: string,
  updates: Partial<GalleryPhoto>,
): Promise<void> {
  try {
    const photoRef = doc(db, "gallery", photoId);
    await updateDoc(photoRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error al actualizar foto:", error);
    throw new Error("Error al actualizar la foto");
  }
}

/**
 * Elimina una foto de la galería
 */
export async function deletePhoto(photoId: string): Promise<void> {
  try {
    const photoRef = doc(db, "gallery", photoId);
    await deleteDoc(photoRef);
  } catch (error) {
    console.error("Error al eliminar foto:", error);
    throw new Error("Error al eliminar la foto");
  }
}

// ==================== CATEGORÍAS ====================

/**
 * Obtiene todas las categorías
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const categoriesRef = collection(db, "categories");
    const q = query(categoriesRef, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw new Error("Error al obtener las categorías");
  }
}

/**
 * Agrega una nueva categoría
 */
export async function addCategory(
  category: Omit<Category, "id">,
): Promise<string> {
  try {
    const categoriesRef = collection(db, "categories");
    const newCategoryRef = doc(categoriesRef);

    await setDoc(newCategoryRef, category);
    return newCategoryRef.id;
  } catch (error) {
    console.error("Error al agregar categoría:", error);
    throw new Error("Error al agregar la categoría");
  }
}

/**
 * Actualiza una categoría existente
 */
export async function updateCategory(
  categoryId: string,
  updates: Partial<Category>,
): Promise<void> {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    await updateDoc(categoryRef, updates);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    throw new Error("Error al actualizar la categoría");
  }
}

/**
 * Elimina una categoría y sus álbumes/fotos
 */
export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    const albumsRef = collection(db, "albums");
    const photosRef = collection(db, "gallery");
    const albumsSnap = await getDocs(
      query(albumsRef, where("categoryId", "==", categoryId)),
    );
    const photosSnap = await getDocs(
      query(photosRef, where("categoryId", "==", categoryId)),
    );

    const deleteAlbumPromises = albumsSnap.docs.map((docItem) =>
      deleteDoc(docItem.ref),
    );
    const deletePhotoPromises = photosSnap.docs.map((docItem) =>
      deleteDoc(docItem.ref),
    );
    await Promise.all([...deleteAlbumPromises, ...deletePhotoPromises]);

    const categoryRef = doc(db, "categories", categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    throw new Error("Error al eliminar la categoría");
  }
}

// ==================== ÁLBUMES ====================

/**
 * Obtiene los álbumes de una categoría
 */
export async function getAlbumsByCategory(
  categoryId: string,
): Promise<Album[]> {
  try {
    const albumsRef = collection(db, "albums");
    const q = query(
      albumsRef,
      where("categoryId", "==", categoryId),
      orderBy("order", "asc"),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    })) as Album[];
  } catch (error) {
    console.error("Error al obtener álbumes:", error);
    throw new Error("Error al obtener los álbumes");
  }
}

/**
 * Obtiene las fotos de un álbum
 */
export async function getPhotosByAlbum(
  albumId: string,
): Promise<GalleryPhoto[]> {
  try {
    const photosRef = collection(db, "gallery");
    const q = query(
      photosRef,
      where("albumId", "==", albumId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
      createdAt: docItem.data().createdAt?.toDate(),
      updatedAt: docItem.data().updatedAt?.toDate(),
    })) as GalleryPhoto[];
  } catch (error) {
    console.error("Error al obtener fotos del álbum:", error);
    throw new Error("Error al obtener las fotos del álbum");
  }
}

/**
 * Agrega un álbum
 */
export async function addAlbum(album: Omit<Album, "id">): Promise<string> {
  try {
    const albumsRef = collection(db, "albums");
    const newAlbumRef = doc(albumsRef);
    await setDoc(newAlbumRef, album);
    return newAlbumRef.id;
  } catch (error) {
    console.error("Error al agregar álbum:", error);
    throw new Error("Error al agregar el álbum");
  }
}

/**
 * Actualiza un álbum
 */
export async function updateAlbum(
  albumId: string,
  updates: Partial<Album>,
): Promise<void> {
  try {
    const albumRef = doc(db, "albums", albumId);
    await updateDoc(albumRef, updates);
  } catch (error) {
    console.error("Error al actualizar álbum:", error);
    throw new Error("Error al actualizar el álbum");
  }
}

/**
 * Elimina un álbum y sus fotos
 */
export async function deleteAlbum(albumId: string): Promise<void> {
  try {
    const photosRef = collection(db, "gallery");
    const photosSnap = await getDocs(
      query(photosRef, where("albumId", "==", albumId)),
    );
    const deletePhotoPromises = photosSnap.docs.map((docItem) =>
      deleteDoc(docItem.ref),
    );
    await Promise.all(deletePhotoPromises);

    const albumRef = doc(db, "albums", albumId);
    await deleteDoc(albumRef);
  } catch (error) {
    console.error("Error al eliminar álbum:", error);
    throw new Error("Error al eliminar el álbum");
  }
}

// ==================== CONFIGURACIÓN DEL SITIO ====================

/**
 * Obtiene la configuración del sitio
 */
export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const configRef = doc(db, "config", "site");
    const configSnap = await getDoc(configRef);

    if (configSnap.exists()) {
      return configSnap.data() as SiteConfig;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    throw new Error("Error al obtener la configuración");
  }
}

/**
 * Guarda la configuración del sitio
 */
export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  try {
    const configRef = doc(db, "config", "site");
    await setDoc(configRef, config);
  } catch (error) {
    console.error("Error al guardar configuración:", error);
    throw new Error("Error al guardar la configuración");
  }
}

// ==================== REDES SOCIALES ====================

/**
 * Obtiene los enlaces de redes sociales
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const linksRef = collection(db, "socialLinks");
    const querySnapshot = await getDocs(linksRef);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SocialLink[];
  } catch (error) {
    console.error("Error al obtener enlaces sociales:", error);
    throw new Error("Error al obtener los enlaces sociales");
  }
}

/**
 * Guarda los enlaces de redes sociales
 */
export async function saveSocialLinks(links: SocialLink[]): Promise<void> {
  try {
    // Eliminar todos los enlaces existentes
    const linksRef = collection(db, "socialLinks");
    const querySnapshot = await getDocs(linksRef);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Agregar los nuevos enlaces
    const addPromises = links.map((link) => {
      const { id, ...linkData } = link;
      const newLinkRef = doc(linksRef);
      return setDoc(newLinkRef, linkData);
    });
    await Promise.all(addPromises);
  } catch (error) {
    console.error("Error al guardar enlaces sociales:", error);
    throw new Error("Error al guardar los enlaces sociales");
  }
}

// ==================== TESTIMONIOS ====================

/**
 * Obtiene testimonios
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonialsRef = collection(db, "testimonials");
    const q = query(testimonialsRef, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    })) as Testimonial[];
  } catch (error) {
    console.error("Error al obtener testimonios:", error);
    throw new Error("Error al obtener los testimonios");
  }
}

/**
 * Guarda testimonios (reemplaza todo)
 */
export async function saveTestimonials(
  testimonials: Testimonial[],
): Promise<void> {
  try {
    const testimonialsRef = collection(db, "testimonials");
    const querySnapshot = await getDocs(testimonialsRef);
    const deletePromises = querySnapshot.docs.map((docItem) =>
      deleteDoc(docItem.ref),
    );
    await Promise.all(deletePromises);

    const addPromises = testimonials.map((testimonial, index) => {
      const { id, ...data } = testimonial;
      const newRef = doc(testimonialsRef);
      return setDoc(newRef, {
        ...data,
        order: data.order ?? index + 1,
      });
    });
    await Promise.all(addPromises);
  } catch (error) {
    console.error("Error al guardar testimonios:", error);
    throw new Error("Error al guardar los testimonios");
  }
}

// ==================== SOBRE NOSOTROS ====================

export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const aboutRef = doc(db, "content", "about");
    const aboutSnap = await getDoc(aboutRef);
    if (aboutSnap.exists()) {
      return aboutSnap.data() as AboutContent;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener sobre nosotros:", error);
    throw new Error("Error al obtener la información");
  }
}

export async function saveAboutContent(content: AboutContent): Promise<void> {
  try {
    const aboutRef = doc(db, "content", "about");
    await setDoc(aboutRef, content);
  } catch (error) {
    console.error("Error al guardar sobre nosotros:", error);
    throw new Error("Error al guardar la información");
  }
}

// ==================== POR QUÉ ELEGIRNOS ====================

export async function getWhyChooseContent(): Promise<WhyChooseContent | null> {
  try {
    const whyRef = doc(db, "content", "whyChoose");
    const whySnap = await getDoc(whyRef);
    if (whySnap.exists()) {
      return whySnap.data() as WhyChooseContent;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener contenido de por qué elegirnos:", error);
    throw new Error("Error al obtener la información");
  }
}

export async function saveWhyChooseContent(
  content: WhyChooseContent,
): Promise<void> {
  try {
    const whyRef = doc(db, "content", "whyChoose");
    await setDoc(whyRef, content);
  } catch (error) {
    console.error("Error al guardar por qué elegirnos:", error);
    throw new Error("Error al guardar la información");
  }
}

// ==================== TESTIMONIOS (TEXTO) ====================

export async function getTestimonialsContent(): Promise<TestimonialsContent | null> {
  try {
    const contentRef = doc(db, "content", "testimonials");
    const contentSnap = await getDoc(contentRef);
    if (contentSnap.exists()) {
      return contentSnap.data() as TestimonialsContent;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener contenido de testimonios:", error);
    throw new Error("Error al obtener la información");
  }
}

export async function saveTestimonialsContent(
  content: TestimonialsContent,
): Promise<void> {
  try {
    const contentRef = doc(db, "content", "testimonials");
    await setDoc(contentRef, content);
  } catch (error) {
    console.error("Error al guardar contenido de testimonios:", error);
    throw new Error("Error al guardar la información");
  }
}

// ==================== MIGRACIÓN LEGACY ====================

export async function migrateLegacyGalleryData(): Promise<{
  categoriesCreated: number;
  albumsCreated: number;
  photosUpdated: number;
  photosSkipped: number;
  servicesDeleted: number;
}> {
  const servicesRef = collection(db, "services");
  const categoriesRef = collection(db, "categories");
  const albumsRef = collection(db, "albums");
  const galleryRef = collection(db, "gallery");

  const [servicesSnap, categoriesSnap, albumsSnap, photosSnap] =
    await Promise.all([
      getDocs(servicesRef),
      getDocs(categoriesRef),
      getDocs(albumsRef),
      getDocs(galleryRef),
    ]);

  const categoryByLegacyServiceId = new Map<string, string>();
  categoriesSnap.docs.forEach((docItem) => {
    const data = docItem.data() as { legacyServiceId?: string };
    if (data.legacyServiceId) {
      categoryByLegacyServiceId.set(data.legacyServiceId, docItem.id);
    }
  });

  const albumByCategoryId = new Map<string, string>();
  albumsSnap.docs.forEach((docItem) => {
    const data = docItem.data() as { categoryId?: string; name?: string };
    if (data.categoryId && data.name === "General") {
      albumByCategoryId.set(data.categoryId, docItem.id);
    }
  });

  let categoriesCreated = 0;
  let albumsCreated = 0;
  let photosUpdated = 0;
  let photosSkipped = 0;
  let servicesDeleted = 0;

  for (const [index, serviceDoc] of servicesSnap.docs.entries()) {
    const serviceData = serviceDoc.data() as {
      title?: string;
      order?: number;
    };
    let categoryId = categoryByLegacyServiceId.get(serviceDoc.id);
    if (!categoryId) {
      const newCategoryRef = doc(categoriesRef);
      await setDoc(newCategoryRef, {
        name: serviceData.title ?? "Sin nombre",
        order: serviceData.order ?? index + 1,
        legacyServiceId: serviceDoc.id,
      });
      categoryId = newCategoryRef.id;
      categoryByLegacyServiceId.set(serviceDoc.id, categoryId);
      categoriesCreated += 1;
    }

    if (!albumByCategoryId.has(categoryId)) {
      const newAlbumRef = doc(albumsRef);
      await setDoc(newAlbumRef, {
        name: "General",
        categoryId,
        order: 1,
        legacyServiceId: serviceDoc.id,
      });
      albumByCategoryId.set(categoryId, newAlbumRef.id);
      albumsCreated += 1;
    }
  }

  for (const photoDoc of photosSnap.docs) {
    const photoData = photoDoc.data() as {
      categoryId?: string;
      albumId?: string;
      serviceId?: string;
      title?: string;
      size?: string;
      description?: string;
    };

    if (photoData.categoryId && photoData.albumId) {
      photosSkipped += 1;
      continue;
    }

    if (!photoData.serviceId) {
      photosSkipped += 1;
      continue;
    }

    const categoryId = categoryByLegacyServiceId.get(photoData.serviceId);
    if (!categoryId) {
      photosSkipped += 1;
      continue;
    }

    const albumId = albumByCategoryId.get(categoryId);
    if (!albumId) {
      photosSkipped += 1;
      continue;
    }

    const updates: Record<string, unknown> = {
      categoryId,
      albumId,
      updatedAt: Timestamp.now(),
      serviceId: deleteField(),
      size: deleteField(),
      description: deleteField(),
    };
    if (photoData.title) {
      updates.title = photoData.title;
    }

    await updateDoc(photoDoc.ref, updates);
    photosUpdated += 1;
  }

  const deleteLegacyPromises = servicesSnap.docs.map((docItem) =>
    deleteDoc(docItem.ref),
  );
  await Promise.all(deleteLegacyPromises);
  servicesDeleted = servicesSnap.docs.length;

  return {
    categoriesCreated,
    albumsCreated,
    photosUpdated,
    photosSkipped,
    servicesDeleted,
  };
}
