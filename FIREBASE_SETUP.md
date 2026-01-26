# Guía de Configuración de Firebase (Solo Firestore)

## ⚠️ Importante: Solo usamos Firestore, NO Storage

Este proyecto usa **Firebase Firestore** (base de datos) para guardar metadatos, pero **NO** usa Firebase Storage para imágenes. Las imágenes se suben a **Cloudinary** o se usan desde la carpeta pública del proyecto.

## Paso 1: Crear un Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o selecciona un proyecto existente
3. Sigue los pasos para crear el proyecto

## Paso 2: Habilitar Firestore Database

1. En la consola de Firebase, ve a **Firestore Database** en el menú lateral
2. Haz clic en "Crear base de datos"
3. Selecciona el modo:
   - **Modo de prueba**: Permite lectura/escritura sin autenticación (solo para desarrollo)
   - **Modo de producción**: Requiere reglas de seguridad (recomendado)
4. Elige la ubicación de la base de datos (ej: `us-central1`)

## Paso 3: Configurar Reglas de Seguridad (Recomendado)

En Firebase Console > Firestore Database > Reglas, usa estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados pueden escribir
    }
  }
}
```

**Nota**: Para el panel admin, necesitarás implementar autenticación de Firebase o usar un backend para validar las escrituras.

## Paso 4: Obtener las Credenciales

1. En Firebase Console, ve a **Configuración del proyecto** (ícono de engranaje)
2. Baja hasta "Tus aplicaciones"
3. Si no tienes una app web, haz clic en el ícono `</>` para agregar una
4. Copia los valores de configuración (NO necesitas `storageBucket`):
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `messagingSenderId`
   - `appId`

## Paso 5: Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto (junto a `package.json`)
2. Copia el contenido de `.env.local.example`
3. Reemplaza los valores con tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Paso 6: Estructura de Datos en Firestore

Firestore organizará los datos así:

```
firestore/
  ├── gallery/ (colección)
  │   ├── {photoId} (documento)
  │   │   ├── title: string
  │   │   ├── serviceId: string
  │   │   ├── imageUrl: string (URL de Cloudinary o carpeta pública)
  │   │   ├── size: "small" | "medium" | "large"
  │   │   ├── description: string (opcional)
  │   │   ├── createdAt: timestamp
  │   │   └── updatedAt: timestamp
  │   └── ...
  ├── services/ (colección)
  │   ├── {serviceId} (documento)
  │   │   ├── title: string
  │   │   ├── description: string
  │   │   ├── features: string[]
  │   │   └── order: number
  │   └── ...
  ├── config/ (colección)
  │   └── site/ (documento)
  │       ├── name: string
  │       ├── slogan: string
  │       ├── description: string
  │       └── contact: { email, phone, address }
  └── socialLinks/ (colección)
      ├── {linkId} (documento)
      │   ├── name: string
      │   └── url: string
      └── ...
```

## Paso 7: Uso en el Código

```typescript
import { 
  getPhotosByService, 
  addPhoto, 
  updatePhoto, 
  deletePhoto 
} from "@/lib/firebaseFirestore";

// Obtener fotos de un servicio
const photos = await getPhotosByService("producto");

// Agregar nueva foto (la URL viene de Cloudinary o carpeta pública)
await addPhoto({
  title: "Mi Foto",
  serviceId: "producto",
  imageUrl: "https://res.cloudinary.com/...", // URL de Cloudinary
  size: "large",
  description: "Descripción opcional"
});

// Actualizar foto
await updatePhoto(photoId, { title: "Nuevo título" });

// Eliminar foto
await deletePhoto(photoId);
```

## Notas Importantes

- 📸 **Imágenes**: Las imágenes se suben a Cloudinary (o carpeta pública), solo guardamos las URLs en Firestore
- 💰 **Costo**: Firestore tiene un plan gratuito generoso (50K lecturas/día, 20K escrituras/día)
- 🔒 **Autenticación**: Para producción, considera implementar autenticación de Firebase o un backend API
- 📦 **Límites**: El plan gratuito de Firestore es suficiente para la mayoría de portfolios
