"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Save, X, CirclePlus, Lock, Key, Hash, Calendar, ShieldAlert } from 'lucide-react';
import * as LucideIcons from "lucide-react";
import Breadcrumb from '@/components/ui/breadcrumb';
import { showToast } from 'nextjs-toast-notify';
import IconSelector from "@/components/ui/IconSelector";
import { GetCatalogItemByID, EditCatalogItem } from '@/lib/api/catalog-api';
import { ItemResponse } from '@/lib/types/catalogs';

export default function EditCatalogItemPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = params?.id as string;
  const catalogNameFromQuery = searchParams.get('catalog') || '';

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [item, setItem] = useState<ItemResponse | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof LucideIcons>("CirclePlus");
  const [showIconSelector, setShowIconSelector] = useState(false);

  useEffect(() => {
    if (!itemId) return;

    const fetchItemData = async () => {
      setLoading(true);
      try {
        const res = await GetCatalogItemByID(itemId);
        const data: ItemResponse = res.data;
        if (data) {
          setItem(data);
          setName(data.name || '');
          setDescription(data.description || '');

          if (data.icon && (LucideIcons as any)[data.icon]) {
            setSelectedIcon(data.icon as keyof typeof LucideIcons);
          } else {
            setSelectedIcon("CirclePlus");
          }
        }
      } catch (err: any) {
        console.error("Error al cargar el ítem:", err);
        const message = err?.response?.data?.message || "No se pudo cargar la información del ítem.";
        showToast.error(message);
        router.push('/catalogs');
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [itemId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast.warning("El nombre del ítem es obligatorio");
      return;
    }

    setIsSaving(true);
    try {
      await EditCatalogItem(itemId, {
        name: name.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon !== "CirclePlus" ? String(selectedIcon) : undefined,
      });

      showToast.success("Ítem actualizado exitosamente");
      router.push('/catalogs');
    } catch (error: any) {
      console.error("Error updating catalog item:", error);
      const message = error?.response?.data?.message || "Ocurrió un error al guardar los cambios";
      showToast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const SelectedIconComponent = LucideIcons[selectedIcon] as LucideIcons.LucideIcon;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary_color animate-spin" />
        <p className="text-gray-500 font-medium">Cargando información del ítem...</p>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Configuración', href: '/settings' },
        { label: 'Catálogos', href: '/catalogs' },
        { label: `Editar ítem #${itemId}`, href: `/catalogs/edit-item/${itemId}`, active: true }
      ]} />

      <div className='mb-4 flex items-center justify-between mt-2'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors w-fit'
        >
          <ArrowLeft size={18} />
          <span className='text-sm font-medium'>Volver a catálogos</span>
        </button>
      </div>

      <div className='bg-white rounded-lg p-6 mb-6 shadow-md border border-slate-200'>
        <div className="border-b border-gray-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className='text-xl font-bold text-gray-900'>
                Editar Ítem: {item.name}
              </h1>
              {item.is_system && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-0.5 rounded border border-slate-200">
                  <Lock size={12} /> Sistema
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {catalogNameFromQuery ? `Catálogo: ${catalogNameFromQuery}` : `ID del Catálogo: ${item.catalogID}`}
            </p>
          </div>
        </div>

        {item.is_system && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <p className="font-semibold">Elemento protegido por el sistema</p>
              <p className="mt-0.5">
                Este elemento es fundamental para el funcionamiento del sistema. Puedes actualizar su nombre, descripción e icono, pero no puede ser eliminado.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nombre del Ítem */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Nombre del ítem <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[40px] px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_color text-sm"
                placeholder="Nombre del ítem"
                required
              />
            </div>

            {/* Selector de Icono */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Icono asociado
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowIconSelector(!showIconSelector)}
                    className="h-[40px] px-3 bg-slate-50 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-slate-100 transition-colors text-sm"
                  >
                    {SelectedIconComponent ? (
                      <SelectedIconComponent size={18} className="text-slate-700" />
                    ) : (
                      <CirclePlus size={18} className="text-slate-700" />
                    )}
                    <span className="text-slate-700">{selectedIcon !== "CirclePlus" ? String(selectedIcon) : "Seleccionar"}</span>
                  </button>

                  {showIconSelector && (
                    <IconSelector
                      selectedIcon={selectedIcon}
                      onSelect={(iconName) => {
                        setSelectedIcon(iconName as keyof typeof LucideIcons);
                        setShowIconSelector(false);
                      }}
                      onClose={() => setShowIconSelector(false)}
                    />
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {selectedIcon !== "CirclePlus" ? `Icono actual: ${String(selectedIcon)}` : "Sin icono"}
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_color text-sm resize-none"
                placeholder="Añade una descripción o detalles adicionales para este ítem..."
              />
            </div>
          </div>

          {/* Información técnica del backend */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Información del Registro
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded border border-slate-200 flex items-center gap-2">
                <Key size={14} className="text-slate-400" />
                <span className="text-gray-500">Clave:</span>
                <span className="font-mono font-semibold text-slate-800 truncate">{item.key || '-'}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200 flex items-center gap-2">
                <Hash size={14} className="text-slate-400" />
                <span className="text-gray-500">Valor / Código:</span>
                <span className="font-mono font-semibold text-slate-800 truncate">{item.value || '-'}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200 flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-gray-500">Creado:</span>
                <span className="text-slate-800">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString('es-ES') : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={() => router.push("/catalogs")}
              disabled={isSaving}
              className="bg-slate-100 w-full sm:w-[160px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium text-gray-700 text-sm"
            >
              <X size={18} /> Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving || !name.trim()}
              className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md disabled:opacity-50 text-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

