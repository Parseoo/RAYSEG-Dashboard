import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const extractPathString = (raw: any, keys: string[]): string => {
  let current = raw;
  while (typeof current === 'object' && current !== null) {
    if (Array.isArray(current)) {
      current = current.length > 0 ? current[0] : '';
    } else {
      current = keys.reduce((val, key) => val || current[key], '') || '';
    }
  }
  return typeof current === 'string' ? current.trim() : '';
};

const normalizeUrl = (clean: string, localAssets: string[]): string => {
  if (!clean || ['undefined', 'null', '[object Object]'].includes(clean)) return '';
  if (/^(data:|blob:|https?:\/\/)/.test(clean)) return clean;
  if (localAssets.includes(clean)) return clean;
  if (clean.startsWith('assets/') || clean.startsWith('/assets/')) {
    return clean.startsWith('/') ? clean : '/' + clean;
  }

  const mediaBase = (process.env.NEXT_PUBLIC_MEDIA_BASE || process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001').replace(/\/$/, '');
  const formattedClean = clean.startsWith('/') ? clean : '/' + clean;
  return mediaBase + formattedClean;
};

export function getImageUrl(path: any): string {
  if (!path) return '';
  const keys = ['image', 'file', 'url', 'image_url', 'plan', 'plan_url', 'src', 'path'];
  return normalizeUrl(extractPathString(path, keys), ['/casa.jpeg', '/logo.png', '/Banner.png', '/favicon.ico']);
}

export function getUserImageUrl(path: any): string {
  if (!path) return '';
  const keys = ['profile_photo', 'profile_picture', 'photo', 'image', 'avatar', 'url', 'file', 'src'];
  return normalizeUrl(extractPathString(path, keys), ['/logo.png', '/casa.jpeg']);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
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
    reader.onerror = () => reject(new Error("Error reading file"));
  });

