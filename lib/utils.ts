import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: any): string {
  if (!path) return '/property.jpg';

  let raw = path;

  // Si se pasa un objeto o array, extraer de forma segura hasta llegar al string
  while (typeof raw === 'object' && raw !== null) {
    if (Array.isArray(raw)) {
      raw = raw.length > 0 ? raw[0] : '';
    } else {
      raw = raw.image || raw.file || raw.url || raw.image_url || raw.plan || raw.plan_url || raw.src || raw.path || '';
    }
  }

  if (typeof raw !== 'string') return '/property.jpg';

  const clean = raw.trim();
  if (!clean || clean === 'undefined' || clean === 'null' || clean === '[object Object]') {
    return '/property.jpg';
  }

  // Base64 data URLs (de subidas nuevas)
  if (clean.startsWith('data:')) return clean;

  // Blob URLs
  if (clean.startsWith('blob:')) return clean;

  // URLs absolutas completas
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;

  // Assets locales de la carpeta public
  if (
    clean === '/property.jpg' ||
    clean === '/casa.jpeg' ||
    clean === '/logo.png' ||
    clean === '/user.svg' ||
    clean === '/Banner.png' ||
    clean === '/favicon.ico'
  ) {
    return clean;
  }
  if (clean === '/property.svg') return '/property.jpg';

  // Assets estáticos como "/assets/properties/..."
  if (clean.startsWith('/assets/') || clean.startsWith('assets/')) {
    return clean.startsWith('/') ? clean : `/${clean}`;
  }

  // Rutas relativas del backend (/media/..., /uploads/..., etc.)
  const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE || process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
  const cleanBase = mediaBase.replace(/\/+$/, '');
  const normalizedPath = clean.startsWith('/') ? clean : `/${clean}`;
  return `${cleanBase}${normalizedPath}`;
}

export function getUserImageUrl(path: any): string {
  if (!path) return '/user.svg';

  let raw = path;

  // Si se pasa un objeto o array, extraer de forma segura
  while (typeof raw === 'object' && raw !== null) {
    if (Array.isArray(raw)) {
      raw = raw.length > 0 ? raw[0] : '';
    } else {
      raw = raw.profile_photo || raw.profile_picture || raw.photo || raw.image || raw.avatar || raw.url || raw.file || raw.src || '';
    }
  }

  if (typeof raw !== 'string') return '/user.svg';

  const clean = raw.trim();
  if (!clean || clean === 'undefined' || clean === 'null' || clean === '[object Object]') {
    return '/user.svg';
  }

  // Base64 data URLs
  if (clean.startsWith('data:')) return clean;

  // Blob URLs
  if (clean.startsWith('blob:')) return clean;

  // URLs absolutas completas
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;

  // Assets locales
  if (
    clean === '/user.svg' ||
    clean === '/logo.png' ||
    clean === '/property.jpg' ||
    clean === '/casa.jpeg'
  ) {
    return clean;
  }

  // Rutas relativas del backend
  const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE || process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
  const cleanBase = mediaBase.replace(/\/+$/, '');
  const normalizedPath = clean.startsWith('/') ? clean : `/${clean}`;
  return `${cleanBase}${normalizedPath}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const formatted = date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).replace(".", "");
    return formatted.replace(/\b[a-z]/g, (char) => char.toUpperCase());
  } catch {
    return dateString;
  }
}

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function shortenPlaceholder(placeholder?: string): string {
  if (!placeholder) return "";
  const trimmed = placeholder.trim();
  if (trimmed.length <= 18) return trimmed.replace(/\.+$|\.\.\.+$/, '');

  const lower = trimmed.toLowerCase();

  if (lower.includes('título') && (lower.includes('dirección') || lower.includes('colonia') || lower.includes('calle'))) {
    return "Buscar propiedad";
  }
  if (lower.includes('nombre') && (lower.includes('rfc') || lower.includes('curp'))) {
    return "Buscar agente";
  }
  if (lower.includes('propiedad') && lower.includes('contrato')) {
    return "Buscar contrato";
  }
  if (lower.includes('cliente') && (lower.includes('email') || lower.includes('teléfono'))) {
    return "Buscar cliente";
  }
  if (lower.includes('nombre') && lower.includes('email') && lower.includes('teléfono')) {
    return "Buscar usuario";
  }
  if (lower.includes('buscar propiedad o ubicación')) {
    return "Buscar ubicación";
  }
  if (lower.includes('buscar por nombre o clave')) {
    return "Buscar catálogo";
  }
  if (lower.includes('ingrese un ítem para')) {
    return "Ej: Nombre";
  }
  if (lower.includes('alberca climatizada')) {
    return "Ej: Alberca";
  }
  if (lower.includes('casa, departamento')) {
    return "Ej: Casa";
  }
  if (lower.includes('venta, renta')) {
    return "Ej: Venta";
  }
  if (lower.includes('nuevo, excelente')) {
    return "Ej: Nuevo";
  }
  if (lower.includes('disponible, reservado')) {
    return "Ej: Disponible";
  }
  if (lower.includes('añade una descripción')) {
    return "Descripción";
  }
  if (lower.includes('calle 123, colonia')) {
    return "Ej: Calle, Ciudad";
  }
  if (lower.includes('términos y condiciones')) {
    return "Escribe términos";
  }
  if (lower.includes('aviso de privacidad')) {
    return "Escribe privacidad";
  }

  if (lower.startsWith('buscar por ')) {
    const mainPart = trimmed.slice(11).split(/,|\s+o\s+|\s+y\s+/)[0].trim();
    return mainPart.length > 18 ? `Buscar ${mainPart.slice(0, 15)}` : `Buscar ${mainPart}`;
  }

  if (lower.startsWith('buscar ')) {
    const mainPart = trimmed.slice(7).split(/,|\s+o\s+|\s+y\s+/)[0].trim();
    return mainPart.length > 18 ? `Buscar ${mainPart.slice(0, 15)}` : `Buscar ${mainPart}`;
  }

  const firstSegment = trimmed.split(/,|\(|\./)[0].trim();
  if (firstSegment.length > 20) {
    return firstSegment.slice(0, 17);
  }
  return firstSegment;
}