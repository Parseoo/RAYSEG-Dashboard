import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '/property.svg';
  // Base64 data URLs (from new uploads)
  if (path.startsWith('data:')) return path;
  // Already full URLs
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // Backend relative paths - construct full URL for image serving
  const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE || process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${mediaBase}${normalizedPath}`;
}

export function getUserImageUrl(path: string | undefined | null): string {
  if (!path) return '/user.svg';
  // Base64 data URLs (from new uploads / previews)
  if (path.startsWith('data:')) return path;
  // Already full URLs
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // Backend relative paths - construct full URL for image serving
  const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE || process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${mediaBase}${normalizedPath}`;
}