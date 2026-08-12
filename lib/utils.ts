import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: any): string {
  if (!path) return '';

  let raw = path;

  // Si se pasa un objeto o array, extraer de forma segura hasta llegar al string
  while (typeof raw === 'object' && raw !== null) {
    if (Array.isArray(raw)) {
      raw = raw.length > 0 ? raw[0] : '';
    } else {
      raw = raw.image || raw.file || raw.url || raw.image_url || raw.plan || raw.plan_url || raw.src || raw.path || '';
    }
  }

  if (typeof raw !== 'string') return '';

  const clean = raw.trim();
  if (!clean || clean === 'undefined' || clean === 'null' || clean === '[object Object]') {
    return '';
  }

  // Base64 data URLs (de subidas nuevas)
  if (clean.startsWith('data:')) return clean;

  // Blob URLs
  if (clean.startsWith('blob:')) return clean;

  // URLs absolutas completas
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;

  // Assets locales de la carpeta public
  if (
    clean === '/casa.jpeg' ||
    clean === '/logo.png' ||
    clean === '/Banner.png' ||
    clean === '/favicon.ico'
  ) {
    return clean;
  }

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
  if (!path) return '';

  let raw = path;

  // Si se pasa un objeto o array, extraer de forma segura
  while (typeof raw === 'object' && raw !== null) {
    if (Array.isArray(raw)) {
      raw = raw.length > 0 ? raw[0] : '';
    } else {
      raw = raw.profile_photo || raw.profile_picture || raw.photo || raw.image || raw.avatar || raw.url || raw.file || raw.src || '';
    }
  }

  if (typeof raw !== 'string') return '';

  const clean = raw.trim();
  if (!clean || clean === 'undefined' || clean === 'null' || clean === '[object Object]') {
    return '';
  }

  // Base64 data URLs
  if (clean.startsWith('data:')) return clean;

  // Blob URLs
  if (clean.startsWith('blob:')) return clean;

  // URLs absolutas completas
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;

  // Assets locales
  if (
    clean === '/logo.png' ||
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
