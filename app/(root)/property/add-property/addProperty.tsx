"use client"

import { useEffect, useState } from 'react';
import { ArrowUpToLine, Save, X, AlertTriangle, ArrowLeft } from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import { useRouter } from 'next/navigation';
import { AddDataProperty } from './addDataProperty';
import { AddDetailProperty } from './addDetailProperty';
import { AddLocationProperty } from './addLocationProperty';
import { AddMultimediaProperty } from './addMultimediaProperty';
import { AddPublicationProperty } from './addPublication';
import { PropertyProvider, useProperty } from '../propertyContext';
import { EditProperty } from '@/lib/api/property/property-api';
import { resolveCatalogItemId, resolveCatalogApiValue, resolveCatalogDisplayValue } from '@/lib/utils/catalog';
import { showToast } from 'nextjs-toast-notify';

const AddPropertyContent = ({ propertyId }: { propertyId?: string }) => {
  const router = useRouter();
  const {
    fetchProperty,
    loading,
    resetState,
    state,
    setErrors,
    propertyTypes,
    operationCatalog,
    propertyStateCatalog,
    conservationStatusCatalog,
    terrainTypeCatalog,
    publicationStatusCatalog,
    amenitiesCatalog
  } = useProperty();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = !!propertyId;

  const resolveId = (value: any, catalog: any[], fallback: number = 1): number => {
    if (value === undefined || value === null || value === '') return fallback;
    const apiVal = resolveCatalogApiValue(value, catalog);
    const parsedApi = parseInt(apiVal);
    if (!isNaN(parsedApi) && parsedApi > 0) return parsedApi;

    const directNum = parseInt(String(value).trim());
    if (!isNaN(directNum) && directNum > 0) return directNum;

    const resolved = resolveCatalogItemId(value, catalog);
    if (resolved !== null && !isNaN(resolved) && resolved > 0) return resolved;

    if (catalog && catalog.length > 0) {
      const firstVal = parseInt(String(catalog[0].value || catalog[0].catalogItemID || '1'));
      if (!isNaN(firstVal) && firstVal > 0) return firstVal;
    }
    return fallback;
  };

  useEffect(() => {
    if (propertyId) fetchProperty(propertyId);
    else resetState();
  }, [propertyId, fetchProperty, resetState]);

  const geocodeAddress = async (
    street: string,
    streetNumber: string,
    neighborhood: string,
    city: string,
    postalCode: string
  ) => {
    try {
      const query = `${street || ''} ${streetNumber || ''}, ${neighborhood || ''}, ${city || ''}, México, ${postalCode || ''}`.trim();
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          latitude: Number.parseFloat(data[0].lat),
          longitude: Number.parseFloat(data[0].lon)
        };
      }
    } catch (err) {
      console.error("Nominatim geocoding failed, using fallback:", err);
    }
    return { latitude: 21.1222, longitude: -101.68 }; // Fallback Leon Gto
  };

  const validatePropertyFields = () => {
    const tempErrors: Record<string, string> = {};

    // Datos principales
    if (!state.title?.trim()) {
      tempErrors.title = "El campo es requerido";
    }
    if (!state.property_type) {
      tempErrors.property_type = "El campo es requerido";
    }
    if (!state.operation_type) {
      tempErrors.operation_type = "El campo es requerido";
    }
    const priceValue = state.price ? parseFloat(state.price.toString().replace(/[^0-9.]/g, '')) : null;
    if (!priceValue || priceValue <= 0) {
      tempErrors.price = "Por favor, ingrese un precio válido.";
    }
    if (!state.description?.trim()) {
      tempErrors.description = "El campo es requerido";
    }

    // Ubicación
    if (!state.street?.trim()) {
      tempErrors.street = "El campo es requerido";
    }
    if (!state.estado?.trim()) {
      tempErrors.estado = "El campo es requerido";
    }
    if (!state.city?.trim()) {
      tempErrors.city = "El campo es requerido";
    }
    if (!state.postal_code?.trim()) {
      tempErrors.postal_code = "El campo es requerido";
    }

    // Detalles según visibilidad por tipo de propiedad
    const type = state.property_type?.toLowerCase() || '';
    const isTerrain = type === 'terreno';
    const isHouse = type === 'casa';
    const isApartment = type === 'departamento' || type === 'apartamento';

    if ((isHouse || isTerrain || !type) && (state.terrain_size === null || state.terrain_size === undefined || String(state.terrain_size).trim() === '' || Number(state.terrain_size) < 0)) {
      tempErrors.terrain_size = "El campo es requerido";
    }

    if (!isTerrain && (state.construction_size === null || state.construction_size === undefined || String(state.construction_size).trim() === '' || Number(state.construction_size) < 0)) {
      tempErrors.construction_size = "El campo es requerido";
    }

    if ((isHouse || isApartment) && (state.rooms === null || state.rooms === undefined || String(state.rooms).trim() === '')) {
      tempErrors.rooms = "El campo es requerido";
    }

    if (!isTerrain && (state.bathrooms === null || state.bathrooms === undefined || String(state.bathrooms).trim() === '')) {
      tempErrors.bathrooms = "El campo es requerido";
    }

    if (!isTerrain && (state.parking_spaces === null || state.parking_spaces === undefined || String(state.parking_spaces).trim() === '')) {
      tempErrors.parking_spaces = "El campo es requerido";
    }

    if (isHouse && (state.floors === null || state.floors === undefined || String(state.floors).trim() === '')) {
      tempErrors.floors = "El campo es requerido";
    }

    if (!isTerrain && (!state.construction_year || Number(state.construction_year) <= 0)) {
      tempErrors.construction_year = "El campo es requerido";
    }

    if ((isTerrain || isHouse) && !state.terrain_type) {
      tempErrors.terrain_type = "El campo es requerido";
    }

    if (!isTerrain && !state.conservation_status) {
      tempErrors.conservation_status = "El campo es requerido";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      showToast.warning("Por favor, complete los campos requeridos marcados en rojo.");
      return false;
    }

    setErrors({});
    return true;
  };

  const handleCreateProperty = async () => {
    if (!validatePropertyFields()) return;
    setIsSaving(true);
    try {
      const amenityIds = (state.amenities || []).map(a => {
        if (typeof a === 'number' && !isNaN(a)) return a;
        const num = parseInt(String(a));
        if (!isNaN(num) && num > 0) return num;
        return resolveCatalogItemId(a, amenitiesCatalog);
      }).filter((id): id is number => id !== null && !isNaN(id));

      // Mapear el estado del context al formato esperado por el API para creación
      const payload = {
        number_mls: state.number_mls || '',
        title: state.title,
        description: state.description,
        price: parseFloat(state.price?.toString().replace(/[^0-9.]/g, '') || '0') || 0,
        property_type: resolveId(state.property_type, propertyTypes, 1),
        operation_type: resolveId(state.operation_type, operationCatalog, 1),
        terrain_type: resolveId(state.terrain_type, terrainTypeCatalog, 1),
        terrain_size: state.terrain_size !== null && state.terrain_size !== undefined && String(state.terrain_size).trim() !== '' ? String(state.terrain_size) : "0",
        construction_size: state.construction_size !== null && state.construction_size !== undefined && String(state.construction_size).trim() !== '' ? String(state.construction_size) : "0",
        rooms: state.rooms ? parseInt(String(state.rooms)) : 0,
        bathrooms: state.bathrooms ? parseInt(String(state.bathrooms)) : 0,
        parking_spaces: state.parking_spaces ? parseInt(String(state.parking_spaces)) : 0,
        floors: state.floors ? parseInt(String(state.floors)) : 1,
        construction_year: state.construction_year ? parseInt(String(state.construction_year)) : new Date().getFullYear(),
        conservation_status: resolveCatalogDisplayValue(state.conservation_status, conservationStatusCatalog)?.toString() || state.conservation_status || "Bueno",
        property_status: resolveId(state.property_status, propertyStateCatalog, 1),
        outdoor_spaces: state.outdoor_spaces ? parseInt(String(state.outdoor_spaces)) : 0,
        note: state.note || "",
        is_featured: Boolean(state.is_featured),
        address: {
          street: state.street || state.full_address?.split(',')[0]?.trim() || "Calle",
          interior_number: state.interior_number || "",
          exterior_number: state.street_number || state.full_address?.split(',')[1]?.trim() || "S/N",
          neighborhood: state.neighborhood || "",
          city: state.city || "",
          state: state.estado || "Guanajuato",
          zip_code: state.postal_code || ""
        },
        amenities: amenityIds,
        images: (state.images || [])
          .filter((img: any) => typeof img.file === 'string' && img.file.startsWith('data:'))
          .map((img: any) => ({
            fileID: img.fileID ? Number(img.fileID) : null,
            file: img.file,
            is_main: Boolean(img.is_main)
          })),
        plans: (state.plans || [])
          .filter((plan: any) => typeof plan.file === 'string' && plan.file.startsWith('data:'))
          .map((plan: any) => ({
            fileID: plan.fileID ? Number(plan.fileID) : null,
            file: plan.file
          }))
      };

      console.log("FINAL PAYLOAD:", payload);

      const { CreateProperty } = await import('@/lib/api/property/property-api');
      const response: any = await CreateProperty(payload);
      const message = response?.data?.message || "Propiedad creada correctamente";
      showToast.success(message);
      router.push('/property');
    } catch (error: any) {
      console.error("Error al crear propiedad:", error?.data || error?.response?.data || error);
      const detail = error?.data?.detail || error?.response?.data?.detail;
      if (Array.isArray(detail)) {
        const backendErrors: Record<string, string> = {};
        detail.forEach((err: any) => {
          if (err.loc && Array.isArray(err.loc) && err.loc.length > 0) {
            const field = String(err.loc[err.loc.length - 1]);
            backendErrors[field] = "El campo es requerido";
          }
        });
        if (Object.keys(backendErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...backendErrors }));
        }
      }
      const message = typeof detail === 'string' ? detail : (detail ? JSON.stringify(detail) : "Error al crear la propiedad");
      showToast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

    const handleUpdateProperty = async () => {
    if (!validatePropertyFields()) return;
    setIsSaving(true);
    try {
      const amenityIds = (state.amenities || []).map(a => {
        if (typeof a === 'number' && !isNaN(a)) return a;
        const num = parseInt(String(a));
        if (!isNaN(num) && num > 0) return num;
        return resolveCatalogItemId(a, amenitiesCatalog);
      }).filter((id): id is number => id !== null && !isNaN(id));

      // Mapear el estado del context al formato esperado por el API
      const payload = {
        id: propertyId,
        number_mls: state.number_mls || '',
        title: state.title,
        description: state.description,
        price: Number.parseFloat(state.price?.toString().replace(/[^0-9.]/g, '') || '0') || 0,
        property_type: resolveId(state.property_type, propertyTypes, 1),
        operation_type: resolveId(state.operation_type, operationCatalog, 1),
        terrain_type: resolveId(state.terrain_type, terrainTypeCatalog, 1),
        property_status: resolveId(state.property_status, propertyStateCatalog, 1),
        property_post_status: resolveId(state.status_publication, publicationStatusCatalog, 1),
        terrain_size: state.terrain_size !== null && state.terrain_size !== undefined && String(state.terrain_size).trim() !== '' ? String(state.terrain_size) : "0",
        construction_size: state.construction_size !== null && state.construction_size !== undefined && String(state.construction_size).trim() !== '' ? String(state.construction_size) : "0",
        rooms: state.rooms ? Number.parseInt(String(state.rooms)) : 0,
        bathrooms: state.bathrooms ? Number.parseInt(String(state.bathrooms)) : 0,
        parking_spaces: state.parking_spaces ? Number.parseInt(String(state.parking_spaces)) : 0,
        floors: state.floors ? Number.parseInt(String(state.floors)) : 1,
        construction_year: state.construction_year ? Number.parseInt(String(state.construction_year)) : new Date().getFullYear(),
        conservation_status: resolveCatalogDisplayValue(state.conservation_status, conservationStatusCatalog)?.toString() || state.conservation_status || "Bueno",
        outdoor_spaces: state.outdoor_spaces ? Number.parseInt(String(state.outdoor_spaces)) : 0,
        note: state.note || "",
        is_featured: Boolean(state.is_featured),
        address: {
          street: state.street || state.full_address?.split(',')[0]?.trim() || "Calle",
          interior_number: state.interior_number || "",
          exterior_number: state.street_number || state.full_address?.split(',')[1]?.trim() || "S/N",
          neighborhood: state.neighborhood || "",
          city: state.city || "",
          state: state.estado || "Guanajuato",
          zip_code: state.postal_code || ""
        },
        amenities: amenityIds,
        images: (state.images || [])
          .filter((img: any) => typeof img.file === 'string' && img.file.startsWith('data:'))
          .map((img: any) => ({
            fileID: img.fileID ? Number(img.fileID) : null,
            file: img.file,
            is_main: Boolean(img.is_main)
          })),
        plans: (state.plans || [])
          .filter((plan: any) => typeof plan.file === 'string' && plan.file.startsWith('data:'))
          .map((plan: any) => ({
            fileID: plan.fileID ? Number(plan.fileID) : null,
            file: plan.file
          }))
      };

      console.log("FINAL PAYLOAD (Edit):", payload);

      const response: any = await EditProperty(payload);
      const message = response?.data?.message || "Propiedad actualizada correctamente";
      showToast.success(message);
      router.push('/property');
    } catch (error: any) {
      console.error("Error al actualizar propiedad:", error.response?.data);
      const detail = error?.response?.data?.detail || error?.data?.detail;
      if (Array.isArray(detail)) {
        const backendErrors: Record<string, string> = {};
        detail.forEach((err: any) => {
          if (err.loc && Array.isArray(err.loc) && err.loc.length > 0) {
            const field = String(err.loc[err.loc.length - 1]);
            backendErrors[field] = "El campo es requerido";
          }
        });
        if (Object.keys(backendErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...backendErrors }));
        }
      }
      const message = typeof detail === 'string' ? detail : (detail ? JSON.stringify(detail) : "Error al actualizar la propiedad");
      showToast.error(message);
    } finally {
      setIsSaving(false);
      setShowConfirmModal(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary_color'></div></div>;

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Propiedades', href: '/property' },
        { label: isEdit ? 'Editar Propiedad' : 'Agregar Propiedad', href: isEdit ? `/property/edit-property/${propertyId}` : '/property/add-property', active: true }
      ]} />
      <div className='mb-3'>
        <button type='button' onClick={() => router.push('/property')} className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'>
          <ArrowLeft size={18} /><span className='text-sm'>Volver</span>
        </button>
      </div>
      <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
            <div>
              <h1 className='font-[700] text-2xl'>{isEdit ? 'Editar Propiedad' : 'Agregar Propiedad'}</h1>
              <p className='text-md text-gray-500'>{isEdit ? 'Actualiza la información de tu propiedad' : 'Carga rápida en secciones: datos básicos, ubicación, detalles y medios'}</p>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col lg:flex-row gap-4'>
              <div className='w-full lg:w-1/2'><AddDataProperty /></div>
              <div className='w-full lg:w-1/2'><AddLocationProperty /></div>
            </div>
            <div className='w-full flex flex-col gap-4'>
              <AddDetailProperty />
              <AddMultimediaProperty />
              <AddPublicationProperty isEdit={isEdit} />
            </div>
          </div>
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-end mt-6 pt-4 border-t border-gray-100'>
            <button
              type='button'
              onClick={() => router.push('/property')}
              className='bg-slate-100 w-full sm:w-auto sm:min-w-[150px] h-[42px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium text-sm text-gray-700 shadow-sm'
            >
              <X size={18} /> Cancelar
            </button>
            <button
              type='button'
              onClick={() => {
                if (!validatePropertyFields()) return;
                if (isEdit) {
                  setShowConfirmModal(true);
                } else {
                  handleCreateProperty();
                }
              }}
              disabled={isSaving}
              className='bg-primary_color text-white w-full sm:w-auto sm:min-w-[180px] h-[42px] rounded-lg flex items-center justify-center gap-2 px-5 hover:opacity-90 transition-all font-medium text-sm shadow-md disabled:opacity-60'
            >
              <ArrowUpToLine size={18} /> {isEdit ? 'Actualizar Propiedad' : 'Publicar Propiedad'}
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all" onClick={() => setShowConfirmModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-blue-600" /></div>
                <h2 className="text-lg font-bold text-gray-900">¿Guardar cambios?</h2>
              </div>
              <button onClick={() => setShowConfirmModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-600" /></button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">¿Estás seguro/a de que deseas guardar los cambios realizados en esta propiedad? Esta acción actualizará la información públicamente.</p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button type='button' onClick={handleUpdateProperty} disabled={isSaving} className="flex-1 px-4 py-2 bg-primary_color text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                <Save size={16} /> {isSaving ? 'Guardando...' : 'Sí, guardar cambios'}
              </button>
              <button type='button' onClick={() => setShowConfirmModal(false)} className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const AddProperty = ({ propertyId }: { propertyId?: string }) => (
  <PropertyProvider>
    <AddPropertyContent propertyId={propertyId} />
  </PropertyProvider>
);

export default AddProperty