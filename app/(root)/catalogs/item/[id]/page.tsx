"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Pencil, Trash2, Lock, ShieldCheck, Key, Hash, Calendar, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import Tooltip from '@/components/ui/Tooltip';
import DeleteModal from '@/components/ui/DeleteModal';
import { GetCatalogItemByID, DeleteCatalogItem } from '@/lib/api/catalog-api';
import { ItemResponse } from '@/lib/types/catalogs';
import { showToast } from 'nextjs-toast-notify';
import Link from 'next/link';

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

export default function CatalogItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const itemId = params?.id as string;
  const catalogName = searchParams.get('catalog') || 'Catálogo';

  const [itemData, setItemData] = useState<ItemResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!itemId) return;

    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await GetCatalogItemByID(itemId);
        if (res.data) {
          setItemData(res.data);
        }
      } catch (err: any) {
        console.error("Error al cargar el ítem:", err);
        const message = err?.response?.data?.message || "No se pudo cargar la información del ítem.";
        showToast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleDelete = async () => {
    if (!itemData) return;

    if (itemData.is_system) {
      showToast.warning("Los elementos protegidos del sistema no pueden ser eliminados.");
      setShowDeleteModal(false);
      return;
    }

    setIsDeleting(true);
    try {
      await DeleteCatalogItem(itemData.catalogItemID);
      showToast.success(`Ítem "${itemData.name}" eliminado correctamente`);
      setShowDeleteModal(false);
      router.push('/catalogs');
    } catch (error: any) {
      console.error("Error deleting item:", error);
      const message = error?.response?.data?.message || "Error al eliminar el ítem del catálogo";
      showToast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary_color animate-spin" />
        <p className="text-gray-500 font-medium">Cargando información del ítem...</p>
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center max-w-md">
          <p className="text-red-700 font-semibold mb-2 text-lg">Ítem no encontrado</p>
          <p className="text-sm text-red-600 mb-6">No se encontró el ítem #{itemId} en la base de datos.</p>
          <button 
            onClick={() => router.push('/catalogs')}
            className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
          >
            Volver a Catálogos
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = getLucideIcon(itemData.icon, itemData.name, itemData.key);

  const formattedCreatedAt = itemData.created_at
    ? new Date(itemData.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '-';

  const formattedUpdatedAt = itemData.updated_at
    ? new Date(itemData.updated_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '-';

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Configuración', href: '/settings/users-permissions' },
        { label: 'Catálogos', href: '/catalogs' },
        { label: itemData.name || `Ítem #${itemId}`, href: `/catalogs/item/${itemId}?catalog=${encodeURIComponent(catalogName)}`, active: true }
      ]} />

      <div className='mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors w-fit'
        >
          <ArrowLeft size={18} />
          <span className='text-sm font-medium'>Volver a catálogos</span>
        </button>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2">
          <Link href={`/catalogs/edit-item/${itemData.catalogItemID}?catalog=${encodeURIComponent(catalogName)}`}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
              <Pencil size={15} />
              <span>Editar</span>
            </button>
          </Link>

          {!itemData.is_system ? (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
            >
              <Trash2 size={15} />
              <span>Eliminar</span>
            </button>
          ) : (
            <Tooltip content="Ítem protegido por el sistema">
              <button
                disabled
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
              >
                <Lock size={15} />
                <span>Protegido</span>
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* DETALLE DEL ITEM */}
      <div className='bg-white rounded-lg p-6 mb-6 shadow-md border border-slate-200'>
        <div className="border-b border-gray-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {itemData.icon && (
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <IconComponent size={22} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className='text-xl font-bold text-gray-900'>
                  {itemData.name}
                </h1>
                {itemData.is_system ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-0.5 rounded border border-slate-200">
                    <Lock size={12} /> Sistema
                  </span>
                ) : (
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2.5 py-0.5 rounded border border-emerald-200">
                    Personalizado
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Catálogo: <span className="font-medium text-gray-700">{catalogName}</span> (ID: {itemData.catalogID})
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Clave / Slug */}
          <div className='flex flex-col gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100'>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <Key size={13} className="text-slate-400" />
              <span>Clave (Slug)</span>
            </div>
            <p className='text-sm font-mono font-semibold text-gray-900 mt-1'>{itemData.key || '-'}</p>
          </div>

          {/* Valor / Código */}
          <div className='flex flex-col gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100'>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <Hash size={13} className="text-slate-400" />
              <span>Valor / Código</span>
            </div>
            <p className='text-sm font-mono font-semibold text-gray-900 mt-1'>{itemData.value || '-'}</p>
          </div>

          {/* Tipo de Elemento */}
          <div className='flex flex-col gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100'>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <ShieldCheck size={13} className="text-slate-400" />
              <span>Tipo de Elemento</span>
            </div>
            <p className='text-sm font-medium text-gray-900 mt-1'>
              {itemData.is_system ? 'Elemento Protegido del Sistema' : 'Elemento Personalizado por Usuario'}
            </p>
          </div>

          {/* Descripción */}
          <div className='flex flex-col gap-1 md:col-span-2 lg:col-span-3'>
            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Descripción</p>
            <p className='text-sm text-gray-700 bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[60px] leading-relaxed'>
              {itemData.description || 'Sin descripción asignada para este ítem.'}
            </p>
          </div>

          {/* Fecha de creación */}
          <div className='flex flex-col gap-1'>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <Calendar size={13} className="text-slate-400" />
              <span>Fecha de creación</span>
            </div>
            <p className='text-sm font-medium text-gray-800'>{formattedCreatedAt}</p>
          </div>

          {/* Fecha de modificación */}
          <div className='flex flex-col gap-1'>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <Calendar size={13} className="text-slate-400" />
              <span>Última modificación</span>
            </div>
            <p className='text-sm font-medium text-gray-800'>{formattedUpdatedAt}</p>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Eliminar Ítem del Catálogo"
          itemName={itemData.name}
          itemDetails={[
            { label: "Catálogo", value: catalogName },
            { label: "Clave / Código", value: itemData.key || itemData.value || '-' },
            { label: "Descripción", value: itemData.description || 'Sin descripción' },
          ]}
          isDeleting={isDeleting}
          customDeletePhrase="eliminar el elemento"
          warningText="Esta acción marcará el elemento como inactivo en el sistema."
        />
      )}
    </>
  );
}



