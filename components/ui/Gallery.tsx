"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

export const Gallery = ({ isOpen, onClose, images }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Escape') onClose();
      if (e.code === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % images.length);
      if (e.code === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    },
    [onClose, images.length]
  );

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      return;
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !images || images.length === 0) return null;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 shadow z-10 transition-colors"
          title="Cerrar"
        >
          <X size={24} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-3 shadow z-10 transition-colors"
              title="Anterior"
            >
              <ChevronLeft size={30} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-3 shadow z-10 transition-colors"
              title="Siguiente"
            >
              <ChevronRight size={30} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImageUrl(images[currentIndex])}
          alt={`Imagen ${currentIndex + 1}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.endsWith('/img/fallback-image.png')) {
              target.src = '/img/fallback-image.png';
            }
          }}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Gallery;