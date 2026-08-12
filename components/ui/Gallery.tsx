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
      className="fixed inset-0 z-[999] flex flex-col items-center justify-between bg-black/95 backdrop-blur-md p-4"
      onClick={onClose}
    >
      {/* Botón Cerrar */}
      <div className="w-full flex justify-end">
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 shadow transition-colors"
          title="Cerrar"
        >
          <X size={24} />
        </button>
      </div>

      {/* Visor Principal con Flechas */}
      <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-400 p-2 z-10 transition-colors"
              title="Anterior"
            >
              <ChevronLeft size={48} strokeWidth={2.5} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-400 p-2 z-10 transition-colors"
              title="Siguiente"
            >
              <ChevronRight size={48} strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImageUrl(images[currentIndex])}
          alt={`Imagen ${currentIndex + 1}`}
          
          className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Carrusel de Miniaturas en la parte inferior */}
      <div className="w-full max-w-5xl py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2 overflow-x-auto justify-center py-2 px-4 bg-black/40 rounded-xl scrollbar-thin">
          {images.map((img: string, idx: number) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                  isActive ? 'border-orange-500 scale-95 shadow-md shadow-orange-500/20' : 'border-white/20 hover:border-white/50'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(img)}
                  alt={`Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover"
                  
                />
              </button>
            );
          })}
        </div>
        <p className="text-center text-xs text-white/50 mt-2 font-medium">
          {currentIndex + 1} de {images.length}
        </p>
      </div>
    </div>
  );
};

export default Gallery;