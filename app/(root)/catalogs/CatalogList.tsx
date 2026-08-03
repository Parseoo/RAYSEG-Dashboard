"use client";

import React from 'react';
import { CatalogResponse } from '@/lib/types/catalogs';
import { cn } from '@/lib/utils';

interface CatalogListProps {
  catalogs: CatalogResponse[];
  selectedCatalog: CatalogResponse | null;
  onSelectCatalog: (catalog: CatalogResponse) => void;
}

export default function CatalogList({ catalogs, selectedCatalog, onSelectCatalog }: CatalogListProps) {
  
  if (!catalogs || catalogs.length === 0) {
      return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center text-sm text-gray-500">
              No hay catálogos disponibles.
          </div>
      );
  }

  return (
    <div className="flex flex-col gap-2">
      {catalogs.map((catalog) => {
        const isSelected = selectedCatalog?.catalogoID === catalog.catalogoID;
        // Simulando datos faltantes del API según el diseño visual
        const itemsCount = catalog.catalogItems?.length || 0;
        const moduleName = "Propiedades"; // Ejemplo, se puede ajustar
        const status = isSelected ? "Activo" : "Listo";

        return (
          <div
            key={catalog.catalogoID}
            onClick={() => onSelectCatalog(catalog)}
            className={cn(
              "cursor-pointer rounded-[20px] p-4 transition-all border",
              isSelected 
                ? "bg-property_purple text-white border-property_purple shadow-md" 
                : "bg-white text-gray-800 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
            )}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className={cn(
                  "font-semibold text-[15px]",
                  isSelected ? "text-white" : "text-gray-900"
              )}>
                  {catalog.name}
              </h3>
              <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-medium",
                  isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              )}>
                  {status}
              </span>
            </div>
            <div className={cn(
                "text-xs flex items-center gap-1",
                isSelected ? "text-gray-200" : "text-gray-500"
            )}>
              <span>{itemsCount} items</span>
              <span>•</span>
              <span>{moduleName}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
