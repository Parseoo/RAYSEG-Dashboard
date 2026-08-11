"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb';
import { GetAllCatalogs, GetCatalogByID } from '@/lib/api/catalog-api';
import { CatalogResponse, ItemResponse } from '@/lib/types/catalogs';
import { Loader2, Plus } from 'lucide-react';
import { showToast } from 'nextjs-toast-notify';
import CatalogDetail from './CatalogDetail';
import CatalogSearchSelect from './CatalogSearchSelect';

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<CatalogResponse[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogResponse | null>(null);
  const [catalogItems, setCatalogItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async (selectCatalogKeyOrId?: string | number) => {
    try {
      setLoading(true);
      const response = await GetAllCatalogs();
      const rawData: any = response?.data;
      let fetchedCatalogs: CatalogResponse[] = [];

      if (Array.isArray(rawData)) {
        fetchedCatalogs = rawData;
      } else if (Array.isArray(rawData?.catalogs)) {
        fetchedCatalogs = rawData.catalogs;
      } else if (Array.isArray(rawData?.items)) {
        fetchedCatalogs = rawData.items;
      } else if (Array.isArray(rawData?.data)) {
        fetchedCatalogs = rawData.data;
      } else if (Array.isArray(response as any)) {
        fetchedCatalogs = response as any;
      }

      setCatalogs(fetchedCatalogs);
      
      if (fetchedCatalogs.length > 0) {
        let target = fetchedCatalogs[0];
        if (selectCatalogKeyOrId) {
          const found = fetchedCatalogs.find(
            c => {
              const catId = c.catalogoID ?? (c as any).catalogID ?? (c as any).id ?? (c as any).catalog_id;
              return String(catId) === String(selectCatalogKeyOrId) || c.key === selectCatalogKeyOrId || c.name === selectCatalogKeyOrId;
            }
          );
          if (found) target = found;
        }
        await handleSelectCatalog(target);
      } else {
        setSelectedCatalog(null);
        setCatalogItems([]);
      }
    } catch (error) {
      console.error("Error fetching catalogs:", error);
      showToast.error("Error al cargar los catálogos");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCatalog = async (catalog: CatalogResponse) => {
    if (!catalog) return;
    setSelectedCatalog(catalog);

    const embeddedItems = catalog.catalogItems || (catalog as any).items || (catalog as any).catalog_items || [];
    setCatalogItems(embeddedItems);

    if (embeddedItems.length > 0) {
      return;
    }

    const catId = catalog.catalogoID ?? (catalog as any).catalogID ?? (catalog as any).id ?? (catalog as any).catalog_id;

    if (!catId) {
      return;
    }

    try {
      setItemsLoading(true);
      const response = await GetCatalogByID(String(catId));
      
      const rawResData: any = response?.data;
      let items: ItemResponse[] = [];
      if (rawResData?.catalogItems && Array.isArray(rawResData.catalogItems)) {
        items = rawResData.catalogItems;
      } else if (rawResData?.items && Array.isArray(rawResData.items)) {
        items = rawResData.items;
      } else if (rawResData?.data && Array.isArray(rawResData.data)) {
        items = rawResData.data;
      } else if (Array.isArray(rawResData)) {
        items = rawResData;
      }

      if (items.length > 0) {
        setCatalogItems(items);
      }
    } catch (error) {
      console.warn("Error fetching catalog items:", error);
    } finally {
      setItemsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary_color animate-spin" />
        <p className="text-gray-500 font-medium">Cargando catálogos...</p>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Configuración', href: '/settings/users-permissions' },
        { label: 'Catálogos', href: '/catalogs', active: true }
      ]} />
      
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mt-4">
        <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6'>
            <div className='flex flex-col gap-2'>
                <div>
                    <h1 className='text-xl font-bold'>Catálogos disponibles</h1>
                    <p className='text-gray-500 text-sm'>Administra listas de opciones y elementos configurables del sistema.</p>
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-[280px]">
                    <label className="text-xs font-semibold text-gray-700">Seleccionar catálogo</label>
                    <CatalogSearchSelect 
                        catalogs={catalogs}
                        selectedCatalog={selectedCatalog}
                        onSelectCatalog={handleSelectCatalog}
                    />
                </div>
            </div>

            <button 
                onClick={() => {
                    if (selectedCatalog) {
                        const catId = selectedCatalog.catalogoID ?? (selectedCatalog as any).catalogID ?? (selectedCatalog as any).id ?? (selectedCatalog as any).catalog_id;
                        router.push(`/catalogs/add-item?catalog=${encodeURIComponent(selectedCatalog.name || '')}&catalogId=${catId || ''}`);
                    } else {
                        showToast.warning("Selecciona un catálogo primero");
                    }
                }}
                className='bg-primary_color text-white w-full sm:w-auto px-4 h-[40px] rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium shadow-md text-sm shrink-0'
            >
                <Plus size={18} />
                <span>Agregar Ítem</span>
            </button>
        </div>

        <div className="w-full">
            {selectedCatalog ? (
              <CatalogDetail 
                  catalog={selectedCatalog} 
                  items={catalogItems} 
                  loading={itemsLoading}
                  onRefreshItems={() => handleSelectCatalog(selectedCatalog)}
              />
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 p-10 flex items-center justify-center text-gray-500">
                  Selecciona un catálogo para ver sus detalles.
              </div>
            )}
        </div>
      </div>
    </>
  );
}

