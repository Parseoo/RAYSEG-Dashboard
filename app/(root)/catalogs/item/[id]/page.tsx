"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Lock, Key, Calendar } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import DeleteModal from '@/components/ui/DeleteModal';
import { GetCatalogItemByID, DeleteCatalogItem } from '@/lib/api/catalog-api';
import { ItemResponse } from '@/lib/types/catalogs';
import { showToast } from 'nextjs-toast-notify';

const getIconByName = (iconStr: string): any => {
  const raw = iconStr.trim();
  if ((LucideIcons as any)[raw]) return (LucideIcons as any)[raw];

  const pascal = raw
    .split(/[-_\s]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
  if ((LucideIcons as any)[pascal]) return (LucideIcons as any)[pascal];

  const lower = raw.toLowerCase().replace(/[-_\s]+/g, '');
  const foundKey = Object.keys(LucideIcons).find(k => k.toLowerCase() === lower);
  return foundKey ? (LucideIcons as any)[foundKey] : null;
};

const KEYWORD_MAP = [
  { keys: ['alberca', 'piscina', 'pool'], icon: LucideIcons.Waves },
  { keys: ['wifi', 'internet'], icon: LucideIcons.Wifi },
  { keys: ['estacion', 'cochera', 'garage', 'park'], icon: LucideIcons.Car },
  { keys: ['gimnasio', 'gym'], icon: LucideIcons.Dumbbell },
  { keys: ['jardin', 'jardín', 'patio'], icon: LucideIcons.Trees },
  { keys: ['elevador', 'ascensor'], icon: LucideIcons.ArrowUpSquare },
  { keys: ['seguridad', 'vigilanc', 'guardia'], icon: LucideIcons.ShieldCheck },
  { keys: ['aire', 'clima', 'ac'], icon: LucideIcons.Fan },
  { keys: ['terraza', 'balcon', 'balcón'], icon: LucideIcons.Sun },
  { keys: ['mascota', 'pet'], icon: LucideIcons.Dog },
  { keys: ['cocina', 'comedor'], icon: LucideIcons.Utensils },
  { keys: ['asador', 'grill', 'barbacoa'], icon: LucideIcons.Flame },
  { keys: ['jacuzzi', 'tina', 'baño'], icon: LucideIcons.Bath },
  { keys: ['tv', 'cable', 'television'], icon: LucideIcons.Tv },
  { keys: ['camara', 'cctv'], icon: LucideIcons.Camera }
];

const findIconByKeyword = (searchStr: string) => {
  const match = KEYWORD_MAP.find(item => item.keys.some(k => searchStr.includes(k)));
  return match ? match.icon : LucideIcons.Sparkles;
};

const getLucideIcon = (iconStr?: string, nameStr?: string, keyStr?: string): any => {
  if (iconStr && typeof iconStr === 'string' && iconStr.trim() !== '') {
    const icon = getIconByName(iconStr);
    if (icon) return icon;
  }

  const searchStr = `${nameStr || ''} ${keyStr || ''}`.toLowerCase();
  return findIconByKeyword(searchStr);
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
      await DeleteCatalogItem(itemId);
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
          <button type='button'
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
        { label: 'Detalle del Ítem', href: `/catalogs/item/${itemId}?catalog=${encodeURIComponent(catalogName)}`, active: true }
      ]} />

      <div className='mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2'>
        <button type='button'
          onClick={() => router.back()}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors w-fit'
        >
          <ArrowLeft size={18} />
          <span className='text-sm font-medium'>Volver a catálogos</span>
        </button>

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
                  Detalle del Ítem: {itemData.name}
                </h1>
                {itemData.is_system && (
                  <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-0.5 rounded border border-slate-200">
                    <Lock size={12} /> Sistema
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Catálogo: <span className="font-medium text-gray-700">{catalogName}</span>
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Clave / Slug */}
          <div className='flex flex-col gap-1'>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <Key size={13} className="text-slate-400" />
              <span>Clave (Slug)</span>
            </div>
            <p className='text-sm font-mono font-semibold text-gray-900 mt-1'>{itemData.key}</p>
          </div>



          {/* Descripción */}
          <div className='flex flex-col gap-1 md:col-span-1 lg:col-span-2'>
            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Descripción</p>
            <p className='text-sm text-gray-700 leading-relaxed mt-1'>
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
            { label: "Clave / Código", value: itemData.key || itemData.value },
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



