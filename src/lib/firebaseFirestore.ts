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
} from "firebase/firestore";
import { db } from "./firebase";

// Tipos de datos
export interface GalleryPhoto {
  id: string;
  title: string;
  serviceId: string;
  imageUrl: string;
  size: "small" | "medium" | "large";
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
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

// ==================== GALERÍA ====================

/**
 * Obtiene todas las fotos de un servicio específico
 */
export async function getPhotosByService(serviceId: string): Promise<GalleryPhoto[]> {
  try {
    const photosRef = collection(db, "gallery");
    const q = query(
      photosRef,
      where("serviceId", "==", serviceId),
      orderBy("createdAt", "desc")
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
export async function addPhoto(photo: Omit<GalleryPhoto, "id" | "createdAt" | "updatedAt">): Promise<string> {
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
    throw new Error("Error al agregar la foto");
  }
}

/**
 * Actualiza una foto existente
 */
export async function updatePhoto(photoId: string, updates: Partial<GalleryPhoto>): Promise<void> {
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

// ==================== SERVICIOS ====================

/**
 * Obtiene todos los servicios
 */
export async function getServices(): Promise<Service[]> {
  try {
    const servicesRef = collection(db, "services");
    const q = query(servicesRef, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Service[];
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    throw new Error("Error al obtener los servicios");
  }
}

/**
 * Agrega un nuevo servicio
 */
export async function addService(service: Omit<Service, "id">): Promise<string> {
  try {
    const servicesRef = collection(db, "services");
    const newServiceRef = doc(servicesRef);
    
    await setDoc(newServiceRef, service);
    return newServiceRef.id;
  } catch (error) {
    console.error("Error al agregar servicio:", error);
    throw new Error("Error al agregar el servicio");
  }
}

/**
 * Actualiza un servicio existente
 */
export async function updateService(serviceId: string, updates: Partial<Service>): Promise<void> {
  try {
    const serviceRef = doc(db, "services", serviceId);
    await updateDoc(serviceRef, updates);
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    throw new Error("Error al actualizar el servicio");
  }
}

/**
 * Elimina un servicio
 */
export async function deleteService(serviceId: string): Promise<void> {
  try {
    const serviceRef = doc(db, "services", serviceId);
    await deleteDoc(serviceRef);
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    throw new Error("Error al eliminar el servicio");
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
      const newLinkRef = doc(linksRef);
      return setDoc(newLinkRef, link);
    });
    await Promise.all(addPromises);
  } catch (error) {
    console.error("Error al guardar enlaces sociales:", error);
    throw new Error("Error al guardar los enlaces sociales");
  }
}
