"use client"

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onClear?: () => void;
  onApply?: () => void;
}

export default function FilterSidebar({ isOpen, onClose, title = "Filtros", children, onClear, onApply }: FilterSidebarProps) {
  // Bloquear scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onClose();
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply();
    } else {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-5">
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-slate-50 transition-all font-medium"
            >
              Limpiar filtros
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2.5 bg-primary_color text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Filtrar
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
