"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Save, X, CirclePlus, Sparkles, Key, Hash, HelpCircle } from 'lucide-react';
import * as LucideIcons from "lucide-react";
import Breadcrumb from '@/components/ui/breadcrumb';
import { showToast } from 'nextjs-toast-notify';
import IconSelector from "@/components/ui/IconSelector";
import { GetAllCatalogs, CreateCatalogItems, PreviewCatalogItem } from '@/lib/api/catalog-api';
import { CatalogResponse, PreviewCatalogItemResponse } from '@/lib/types/catalogs';

export default function AddCatalogItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCatalogName = searchParams.get('catalog') || '';
  const initialCatalogId = searchParams.get('catalogId') || '';

  const [catalogs, setCatalogs] = useState<CatalogResponse[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>(initialCatalogId);
  const [selectedCatalogName, setSelectedCatalogName] = useState<string>(initialCatalogName);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Campos del formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof LucideIcons>("CirclePlus");
  const [showIconSelector, setShowIconSelector] = useState(false);

  // Previsualización en vivo (PreviewCatalogItem)
  const [preview, setPreview] = useState<PreviewCatalogItemResponse | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Cargar lista de catálogos si no hay catalogId
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setLoading(true);
        const res = await GetAllCatalogs();
        const cats = res?.data?.catalogs || (Array.isArray(res?.data) ? res.data : []);
        setCatalogs(cats);

        if (initialCatalogId) {
          const found = cats.find(c => String(c.catalogoID) === initialCatalogId);
          if (found) {
            setSelectedCatalogId(String(found.catalogoID));
            setSelectedCatalogName(found.name);
          }
        } else if (cats.length > 0) {
          setSelectedCatalogId(String(cats[0].catalogoID));
          setSelectedCatalogName(cats[0].name);
        }
      } catch (error) {
        console.error("Error fetching catalogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, [initialCatalogId]);

  // Manejar cambio de catálogo en el selector
  const handleCatalogChange = (catId: string) => {
    setSelectedCatalogId(catId);
    const cat = catalogs.find(c => String(c.catalogoID) === catId);
    if (cat) {
      setSelectedCatalogName(cat.name);
    }
  };

  // Debounce de llamada a PreviewCatalogItem
  useEffect(() => {
    if (!name.trim() || !selectedCatalogId) {
      setPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsPreviewLoading(true);
        const res = await PreviewCatalogItem({
          catalogID: Number(selectedCatalogId),
          name: name.trim()
        });
        if (res?.data) {
          setPreview(res.data);
        }
      } catch (error) {
        console.error("Error previewing catalog item:", error);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [name, selectedCatalogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCatalogId) {
      showToast.warning("Debes seleccionar un catálogo de destino");
      return;
    }

    if (!name.trim()) {
      showToast.warning("El nombre del ítem es obligatorio");
      return;
    }

    setIsSaving(true);
    try {
      await CreateCatalogItems({
        catalogID: Number(selectedCatalogId),
        name: name.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon !== "CirclePlus" ? String(selectedIcon) : undefined,
      });

      showToast.success(`Ítem "${name.trim()}" agregado exitosamente`);
      router.push('/catalogs');
    } catch (error: any) {
      console.error("Error creating catalog item:", error);
      const message = error?.response?.data?.message || "Error al crear el ítem del catálogo";
      showToast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const SelectedIconComponent = LucideIcons[selectedIcon] as LucideIcons.LucideIcon;
  const isAmenities = selectedCatalogName.toLowerCase().includes('amenidad') || selectedCatalogName.toLowerCase().includes('amenities');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary_color animate-spin" />
        <p className="text-gray-500 font-medium">Cargando información...</p>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Configuración', href: '/settings/users-permissions' },
        { label: 'Catálogos', href: '/catalogs' },
        { label: 'Agregar ítem', href: `/catalogs/add-item?catalog=${encodeURIComponent(selectedCatalogName)}&catalogId=${selectedCatalogId}`, active: true }
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
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h1 className='text-xl font-bold text-gray-900'>
            Agregar Nuevo Ítem {selectedCatalogName ? `a "${selectedCatalogName}"` : ''}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Los valores de clave y código incremental se generarán automáticamente en el servidor.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Catálogo Destino */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Catálogo de destino <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCatalogId}
                onChange={(e) => handleCatalogChange(e.target.value)}
                className="w-full h-[40px] px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_color text-sm bg-white"
                required
              >
                <option value="" disabled>Selecciona un catálogo</option>
                {catalogs.map(cat => (
                  <option key={cat.catalogoID} value={cat.catalogoID}>
                    {cat.name} ({cat.key})
                  </option>
                ))}
              </select>
            </div>

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
                placeholder="Ej: Alberca climatizada, Terreno comercial..."
                required
                autoFocus
              />
            </div>

            {/* Icono (visible especialmente para amenidades u opcional) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                <span>Icono (Opcional)</span>
                {isAmenities && <span className="text-xs text-primary_color font-normal">Recomendado para amenidades</span>}
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
                  {selectedIcon !== "CirclePlus" ? `Icono seleccionado: ${String(selectedIcon)}` : "Sin icono asignado"}
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Descripción (Opcional)
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

          {/* Previsualización en Tiempo Real (PreviewCatalogItem) */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <Sparkles size={14} className="text-amber-500" />
                <span>Previsualización generada por el backend</span>
              </div>
              {isPreviewLoading && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Calculando...</span>
                </div>
              )}
            </div>

            {name.trim() ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-2">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-slate-200">
                  <Key size={16} className="text-slate-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs text-gray-500 block">Clave (Slug autogenerado):</span>
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      {preview?.preview_key || (name ? name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-') : '-')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-slate-200">
                  <Hash size={16} className="text-slate-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs text-gray-500 block">Valor asignado:</span>
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      {preview?.preview_value || '(Se asignará al guardar)'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic mt-1">
                Escribe un nombre arriba para ver cómo se generará su clave y código único en el sistema.
              </p>
            )}
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
                  <span>Guardar Ítem</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

