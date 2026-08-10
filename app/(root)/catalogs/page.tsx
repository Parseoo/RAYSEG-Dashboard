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
      const fetchedCatalogs: CatalogResponse[] = response?.data?.catalogs || (Array.isArray(response?.data) ? response.data : []);
      setCatalogs(fetchedCatalogs);
      
      if (fetchedCatalogs.length > 0) {
        let target = fetchedCatalogs[0];
        if (selectCatalogKeyOrId) {
          const found = fetchedCatalogs.find(
            c => c.catalogoID === Number(selectCatalogKeyOrId) || c.key === selectCatalogKeyOrId || c.name === selectCatalogKeyOrId
          );
          if (found) target = found;
        }
        handleSelectCatalog(target);
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
    setSelectedCatalog(catalog);
    try {
      setItemsLoading(true);
      const response = await GetCatalogByID(String(catalog.catalogoID));
      
      let items: ItemResponse[] = [];
      if (response?.data?.catalogItems) {
        items = response.data.catalogItems;
      } else if (response?.data && Array.isArray((response.data as any).items)) {
        items = (response.data as any).items;
      } else if (Array.isArray(response?.data)) {
        items = response.data;
      }
      setCatalogItems(items);
    } catch (error) {
      console.error("Error fetching catalog items:", error);
      showToast.error(`Error al cargar ítems del catálogo ${catalog.name}`);
      setCatalogItems([]);
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
                        router.push(`/catalogs/add-item?catalog=${encodeURIComponent(selectedCatalog.name)}&catalogId=${selectedCatalog.catalogoID}`);
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

