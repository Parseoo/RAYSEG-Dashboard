"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CatalogResponse } from '@/lib/types/catalogs';
import { GetAllCatalogs } from '@/lib/api/catalog-api';
import { Search, ChevronDown, Check, X, Loader2, BookOpen } from 'lucide-react';

interface CatalogSearchSelectProps {
  catalogs: CatalogResponse[];
  selectedCatalog: CatalogResponse | null;
  onSelectCatalog: (catalog: CatalogResponse) => void;
  onSearchResults?: (catalogs: CatalogResponse[]) => void;
  className?: string;
}

export default function CatalogSearchSelect({
  catalogs,
  selectedCatalog,
  onSelectCatalog,
  className = '',
}: CatalogSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCatalogs, setFilteredCatalogs] = useState<CatalogResponse[]>(catalogs);
  const [isSearching, setIsSearching] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincronizar catálogo inicial o actualizaciones desde el padre
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCatalogs(catalogs);
    }
  }, [catalogs, searchQuery]);

  // Manejo de clic fuera para cerrar el menú desplegable
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Enfocar el input de búsqueda automáticamente al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Búsqueda con debounce hacia el endpoint GET /api/catalogs?search=...
  useEffect(() => {
    if (!isOpen) return;

    if (!searchQuery.trim()) {
      setFilteredCatalogs(catalogs);
      setIsSearching(false);
      return;
    }

    // Filtrado inmediato en memoria para respuesta instantánea
    const queryLower = searchQuery.toLowerCase().trim();
    const localFiltered = catalogs.filter(
      cat => cat.name.toLowerCase().includes(queryLower) || (cat.key && cat.key.toLowerCase().includes(queryLower))
    );
    setFilteredCatalogs(localFiltered);

    // Búsqueda en backend con debounce
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const response = await GetAllCatalogs({ search: searchQuery.trim() });
        const fetchedCatalogs: CatalogResponse[] = response?.data?.catalogs || (Array.isArray(response?.data) ? response.data : []);
        setFilteredCatalogs(fetchedCatalogs);
      } catch (error) {
        console.error("Error searching catalogs:", error);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, catalogs]);

  const handleSelect = (catalog: CatalogResponse) => {
    onSelectCatalog(catalog);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery('');
    setFilteredCatalogs(catalogs);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Botón / Selector Principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[40px] bg-slate-50 border border-slate-200 rounded-md px-3 flex items-center justify-between text-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary_color transition-all"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="truncate font-medium text-gray-800">
            {selectedCatalog ? selectedCatalog.name : "Selecciona un catálogo"}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-primary_color' : ''
          }`} 
        />
      </button>

      {/* Popover / Menú desplegable con buscador */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden min-w-[260px] animate-in fade-in zoom-in-95 duration-100">
          {/* Campo de búsqueda */}
          <div className="p-2 border-b border-gray-100 bg-slate-50">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o clave..."
                className="w-full bg-white border border-gray-200 rounded-md pl-8 pr-7 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary_color focus:border-primary_color"
                onClick={(e) => e.stopPropagation()}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Lista de Catálogos */}
          <div className="max-h-56 overflow-y-auto p-1 divide-y divide-gray-50">
            {isSearching ? (
              <div className="flex items-center justify-center gap-2 py-6 text-gray-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-primary_color" />
                <span>Buscando catálogos...</span>
              </div>
            ) : filteredCatalogs.length > 0 ? (
              filteredCatalogs.map((catalog) => {
                const isSelected = selectedCatalog?.catalogoID === catalog.catalogoID || selectedCatalog?.key === catalog.key;
                return (
                  <button
                    key={catalog.catalogoID || catalog.key || catalog.name}
                    type="button"
                    onClick={() => handleSelect(catalog)}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between transition-colors ${
                      isSelected 
                        ? 'bg-primary_color/10 text-primary_color font-semibold' 
                        : 'text-gray-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="truncate">{catalog.name}</span>
                      {catalog.key && (
                        <span className="text-[10px] text-gray-400 font-mono truncate">
                          {catalog.key}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary_color shrink-0 ml-1" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-gray-400 px-3">
                No se encontraron catálogos{searchQuery ? ` para "${searchQuery}"` : ''}.
              </div>
            )}
          </div>

          {/* Pie del desplegable con cantidad */}
          <div className="bg-slate-50 border-t border-gray-100 px-3 py-1.5 flex items-center justify-between text-[11px] text-gray-400">
            <span>{filteredCatalogs.length} catálogo{filteredCatalogs.length === 1 ? '' : 's'} disponible{filteredCatalogs.length === 1 ? '' : 's'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
