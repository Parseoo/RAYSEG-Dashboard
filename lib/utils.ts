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
      raw = raw.profile_picture || raw.image || raw.avatar || raw.url || raw.file || raw.src || '';
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