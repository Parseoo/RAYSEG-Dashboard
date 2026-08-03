"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { CatalogResponse, ItemResponse } from '@/lib/types/catalogs';
import { DeleteCatalogItem } from '@/lib/api/catalog-api';
import { Loader2, ArrowUpDown, ArrowUp, ArrowDown, Eye, Pencil, Trash2, Lock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';
import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';
import DeleteModal from '@/components/ui/DeleteModal';
import { showToast } from 'nextjs-toast-notify';

interface CatalogDetailProps {
  catalog: CatalogResponse;
  items: ItemResponse[];
  loading: boolean;
  onRefreshItems?: () => void;
}

const getLucideIcon = (iconStr?: string, nameStr?: string, keyStr?: string): any => {
  if (iconStr && typeof iconStr === 'string' && iconStr.trim() !== '') {
    const raw = iconStr.trim();
    if ((LucideIcons as any)[raw]) {
      return (LucideIcons as any)[raw];
    }
    const pascal = raw
      .split(/[-_\s]+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
    if ((LucideIcons as any)[pascal]) {
      return (LucideIcons as any)[pascal];
    }
    const lower = raw.toLowerCase().replace(/[-_\s]+/g, '');
    const foundKey = Object.keys(LucideIcons).find(k => k.toLowerCase() === lower);
    if (foundKey && (LucideIcons as any)[foundKey]) {
      return (LucideIcons as any)[foundKey];
    }
  }

  const searchStr = `${nameStr || ''} ${keyStr || ''}`.toLowerCase();
  if (searchStr.includes('alberca') || searchStr.includes('piscina') || searchStr.includes('pool')) return LucideIcons.Waves;
  if (searchStr.includes('wifi') || searchStr.includes('internet')) return LucideIcons.Wifi;
  if (searchStr.includes('estacion') || searchStr.includes('cochera') || searchStr.includes('garage') || searchStr.includes('park')) return LucideIcons.Car;
  if (searchStr.includes('gimnasio') || searchStr.includes('gym')) return LucideIcons.Dumbbell;
  if (searchStr.includes('jardin') || searchStr.includes('jardín') || searchStr.includes('patio')) return LucideIcons.Trees;
  if (searchStr.includes('elevador') || searchStr.includes('ascensor')) return LucideIcons.ArrowUpSquare;
  if (searchStr.includes('seguridad') || searchStr.includes('vigilanc') || searchStr.includes('guardia')) return LucideIcons.ShieldCheck;
  if (searchStr.includes('aire') || searchStr.includes('clima') || searchStr.includes('ac')) return LucideIcons.Fan;
  if (searchStr.includes('terraza') || searchStr.includes('balcon') || searchStr.includes('balcón')) return LucideIcons.Sun;
  if (searchStr.includes('mascota') || searchStr.includes('pet')) return LucideIcons.Dog;
  if (searchStr.includes('cocina') || searchStr.includes('comedor')) return LucideIcons.Utensils;
  if (searchStr.includes('asador') || searchStr.includes('grill') || searchStr.includes('barbacoa')) return LucideIcons.Flame;
  if (searchStr.includes('jacuzzi') || searchStr.includes('tina') || searchStr.includes('baño')) return LucideIcons.Bath;
  if (searchStr.includes('tv') || searchStr.includes('cable') || searchStr.includes('television')) return LucideIcons.Tv;
  if (searchStr.includes('camara') || searchStr.includes('cctv')) return LucideIcons.Camera;

  return LucideIcons.Sparkles;
};

export default function CatalogDetail({ catalog, items, loading, onRefreshItems }: CatalogDetailProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'description' | 'icon' | 'created_at' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Modal de eliminación
  const [itemToDelete, setItemToDelete] = useState<ItemResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
    setSortField(null);
    setSortDirection('asc');
  }, [catalog]);

  const isAmenities = catalog?.name?.toLowerCase() === 'amenidades';

  const handleSort = (field: 'name' | 'description' | 'icon' | 'created_at') => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = useMemo(() => {
    if (!sortField) return items;
    return [...items].sort((a, b) => {
      let valA: any = a[sortField] || '';
      let valB: any = b[sortField] || '';

      if (sortField === 'created_at') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      } else {
        valA = String(valA).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        valB = String(valB).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage) || 1;
  const paginatedItems = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.is_system) {
      showToast.warning("Los elementos protegidos del sistema no pueden ser eliminados.");
      setItemToDelete(null);
      return;
    }

    setIsDeleting(true);
    try {
      await DeleteCatalogItem(itemToDelete.catalogItemID);
      showToast.success(`Ítem "${itemToDelete.name}" eliminado correctamente`);
      setItemToDelete(null);
      if (onRefreshItems) {
        onRefreshItems();
      }
    } catch (error: any) {
      console.error("Error deleting catalog item:", error);
      const message = error?.response?.data?.message || "Error al eliminar el ítem del catálogo";
      showToast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Ítems del catálogo (Tabla) */}
      <div>
        <div className="flex items-start sm:items-center justify-between mb-4 flex-col sm:flex-row gap-4">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Ítems del catálogo: {catalog.name}</h3>
                <p className="text-sm text-gray-500">{catalog.description || "Lista editable de ítems dentro del sistema."}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                    Total: {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
                </span>
            </div>
        </div>

        {loading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-primary_color animate-spin" />
            </div>
        ) : items.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500 font-medium">No hay ítems en este catálogo</p>
            </div>
        ) : (
            <div className="w-full border border-gray-200 rounded-lg shadow-sm mt-4 overflow-hidden bg-white">
                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse text-left table-fixed">
                        <thead>
                            <tr className="bg-slate-100 border-b border-gray-200 text-xs text-gray-700">
                                <th 
                                    onClick={() => handleSort('name')}
                                    className="py-3 px-4 font-semibold w-1/3 cursor-pointer hover:bg-slate-200 transition-colors select-none"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span>Nombre</span>
                                        <span className="text-gray-400">
                                            {sortField === 'name' && sortDirection === 'asc' && <ArrowUp size={14} className="text-primary_color font-bold" />}
                                            {sortField === 'name' && sortDirection === 'desc' && <ArrowDown size={14} className="text-primary_color font-bold" />}
                                            {sortField !== 'name' && <ArrowUpDown size={14} className="opacity-40 hover:opacity-100 transition-opacity" />}
                                        </span>
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort('description')}
                                    className="py-3 px-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors select-none"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span>Descripción</span>
                                        <span className="text-gray-400">
                                            {sortField === 'description' && sortDirection === 'asc' && <ArrowUp size={14} className="text-primary_color font-bold" />}
                                            {sortField === 'description' && sortDirection === 'desc' && <ArrowDown size={14} className="text-primary_color font-bold" />}
                                            {sortField !== 'description' && <ArrowUpDown size={14} className="opacity-40 hover:opacity-100 transition-opacity" />}
                                        </span>
                                    </div>
                                </th>
                                {isAmenities && (
                                    <th 
                                        onClick={() => handleSort('icon')}
                                        className="py-3 px-4 font-semibold text-center w-20 cursor-pointer hover:bg-slate-200 transition-colors select-none"
                                    >
                                        <div className="flex items-center justify-center gap-1.5">
                                            <span>Icono</span>
                                            <span className="text-gray-400">
                                                {sortField === 'icon' && sortDirection === 'asc' && <ArrowUp size={14} className="text-primary_color font-bold" />}
                                                {sortField === 'icon' && sortDirection === 'desc' && <ArrowDown size={14} className="text-primary_color font-bold" />}
                                                {sortField !== 'icon' && <ArrowUpDown size={14} className="opacity-40 hover:opacity-100 transition-opacity" />}
                                            </span>
                                        </div>
                                    </th>
                                )}
                                <th 
                                    onClick={() => handleSort('created_at')}
                                    className="py-3 px-4 font-semibold w-32 cursor-pointer hover:bg-slate-200 transition-colors select-none"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span>Creado en</span>
                                        <span className="text-gray-400">
                                            {sortField === 'created_at' && sortDirection === 'asc' && <ArrowUp size={14} className="text-primary_color font-bold" />}
                                            {sortField === 'created_at' && sortDirection === 'desc' && <ArrowDown size={14} className="text-primary_color font-bold" />}
                                            {sortField !== 'created_at' && <ArrowUpDown size={14} className="opacity-40 hover:opacity-100 transition-opacity" />}
                                        </span>
                                    </div>
                                </th>
                                <th className="py-3 px-4 font-semibold text-right w-28">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.map((item, index) => {
                                const IconComponent = getLucideIcon(item.icon, item.name, item.key);
                                const formattedDate = item.created_at
                                    ? new Date(item.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                    : '-';
                                
                                return (
                                    <tr key={item.catalogItemID || index} className="border-b border-gray-200 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-sm text-gray-900 truncate">
                                            {item.name}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 truncate">
                                            {item.description || "Sin descripción"}
                                        </td>
                                        {isAmenities && (
                                            <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                                <div className="flex justify-center">
                                                    <IconComponent size={20} className="text-slate-700" />
                                                </div>
                                            </td>
                                        )}
                                        <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                                            {formattedDate}
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Tooltip content="Ver detalle">
                                                    <Link href={`/catalogs/item/${item.catalogItemID}?catalog=${encodeURIComponent(catalog.name || '')}`}>
                                                        <button className="p-1.5 bg-slate-200 rounded-md hover:bg-slate-300 flex items-center justify-center transition-colors">
                                                            <Eye size={16} className="text-gray-700" />
                                                        </button>
                                                    </Link>
                                                </Tooltip>
                                                <Tooltip content="Editar">
                                                    <Link href={`/catalogs/edit-item/${item.catalogItemID}?catalog=${encodeURIComponent(catalog.name || '')}`}>
                                                        <button className="p-1.5 bg-slate-200 rounded-md hover:bg-slate-300 flex items-center justify-center transition-colors">
                                                            <Pencil size={16} className="text-gray-700" />
                                                        </button>
                                                    </Link>
                                                </Tooltip>
                                                {item.is_system ? (
                                                    <Tooltip content="Ítem de sistema protegido">
                                                        <button 
                                                            disabled
                                                            className="p-1.5 bg-slate-200 text-gray-400 rounded-md cursor-not-allowed opacity-50 flex items-center justify-center"
                                                        >
                                                            <Lock size={16} />
                                                        </button>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip content="Eliminar">
                                                        <button 
                                                            onClick={() => setItemToDelete(item)}
                                                            className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center transition-colors"
                                                        >
                                                            <Trash2 size={16} className="text-white" />
                                                        </button>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="px-4 py-3 bg-white border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {itemToDelete && (
        <DeleteModal
          isOpen={Boolean(itemToDelete)}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDeleteItem}
          title="Eliminar Ítem del Catálogo"
          itemName={itemToDelete.name}
          itemDetails={[
            { label: "Catálogo", value: catalog.name },
            { label: "Clave / Código", value: itemToDelete.key || itemToDelete.value || '-' },
            { label: "Descripción", value: itemToDelete.description || 'Sin descripción' },
          ]}
          isDeleting={isDeleting}
          customDeletePhrase="eliminar el elemento"
          warningText="Esta acción marcará el elemento como inactivo en el sistema."
        />
      )}
    </div>
  );
}






