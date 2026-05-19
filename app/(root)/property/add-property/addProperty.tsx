"use client"

import React, { useEffect, useState } from 'react';
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
import { showToast } from 'nextjs-toast-notify';

const AddPropertyContent = ({ propertyId }: { propertyId?: string }) => {
  const router = useRouter();
  const { fetchProperty, loading, resetState, state } = useProperty();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = !!propertyId;

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
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
    } catch (err) {
      console.error("Nominatim geocoding failed, using fallback:", err);
    }
    return { latitude: 21.1222, longitude: -101.68 }; // Fallback Leon Gto
  };

  const handleCreateProperty = async () => {
    setIsSaving(true);
    try {
      const geo = await geocodeAddress(
        state.street || state.full_address.split(',')[0]?.trim() || "",
        state.street_number || state.full_address.split(',')[1]?.trim() || "",
        state.neighborhood || state.full_address.split(',')[2]?.trim() || "",
        state.city,
        state.postal_code
      );

      // Mapear el estado del context al formato esperado por el API para creación
      const payload = {
        number_mls: `MLS-${new Date().getTime()}`, 
        title: state.title,
        description: state.description,
        price: parseFloat(state.price.replace(/[^0-9.]/g, '')) || 0,
        property_type: state.property_type, 
        operation_type: state.operation_type,
        terrain_type: state.terrain_type || "Regular", 
        terrain_size: parseFloat(state.terrain_size) || 0,
        construction_size: parseFloat(state.construction_size) || 0,
        rooms: parseInt(state.rooms) || 0,
        bathrooms: parseInt(state.bathrooms) || 0,
        parking_spaces: parseInt(state.parking_spaces) || 0,
        floors: parseInt(state.floors) || 1,
        construction_year: parseInt(state.construction_year) || new Date().getFullYear(),
        conservation_status: state.conservation_status || "excellent",
        address: [
          {
            street: state.street || state.full_address.split(',')[0]?.trim() || "Calle",
            street_number: state.street_number || state.full_address.split(',')[1]?.trim() || "S/N",
            neighborhood: state.neighborhood || state.full_address.split(',')[2]?.trim() || "Colonia",
            city: state.city,
            state: "Guanajuato", // Default
            country: "México",
            postal_code: state.postal_code,
            latitude: geo.latitude,
            longitude: geo.longitude
          }
        ],
        amenities: state.amenities,
        images: state.images,
        plans: state.plans
      };
      
      console.log("Payload enviado al backend (CreateProperty):", payload);
      
      const { CreateProperty } = await import('@/lib/api/property/property-api');
      await CreateProperty(payload);
      showToast.success("Propiedad creada correctamente");
      router.push('/property');
    } catch (error: any) {
      console.error("Error al crear propiedad:", error.response?.data);
      const detail = error?.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : (detail ? JSON.stringify(detail) : "Error al crear la propiedad");
      showToast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProperty = async () => {
    setIsSaving(true);
    try {
      const geo = await geocodeAddress(
        state.street,
        state.street_number,
        state.neighborhood,
        state.city,
        state.postal_code
      );

      // Mapear el estado del context al formato esperado por el API
      const payload = {
        id: propertyId,
        number_mls: state.number_mls,
        title: state.title,
        description: state.description,
        price: parseFloat(state.price.toString().replace(/[^0-9.]/g, '')) || 0,
        property_type: state.property_type,
        operation_type: state.operation_type,
        property_status: state.property_status,
        property_post_status: state.status_publication === 'Publicado' ? '1' : state.status_publication === 'Borrador' ? '2' : '3',
        terrain_type: state.terrain_type || "Regular", 
        terrain_size: parseFloat(state.terrain_size) || 0,
        construction_size: parseFloat(state.construction_size) || 0,
        rooms: parseInt(state.rooms) || 0,
        bathrooms: parseInt(state.bathrooms) || 0,
        parking_spaces: parseInt(state.parking_spaces) || 0,
        floors: parseInt(state.floors) || 1,
        construction_year: parseInt(state.construction_year) || new Date().getFullYear(),
        conservation_status: state.conservation_status || "excellent",
        address: [
          {
            property_address_id: state.addressId,
            street: state.street,
            street_number: state.street_number,
            neighborhood: state.neighborhood,
            city: state.city,
            state: "Guanajuato",
            country: "México",
            postal_code: state.postal_code,
            latitude: geo.latitude,
            longitude: geo.longitude
          }
        ],
        amenities: state.amenities,
        images: state.images,
        plans: state.plans,
        is_featured: state.is_featured,
      };

      console.log("Payload enviado al backend (EditProperty):", payload);

      await EditProperty(payload);
      showToast.success("Propiedad actualizada correctamente");
      router.push('/property');
    } catch (error: any) {
      console.error("Error al actualizar propiedad:", error.response?.data);
      const detail = error?.response?.data?.detail;
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
        <button onClick={() => router.push('/property')} className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'>
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
          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='flex flex-col w-full gap-3'>
              <AddDataProperty /><AddLocationProperty /><AddPublicationProperty />
            </div>
            <div className='flex flex-col w-full gap-3'>
              <AddDetailProperty /><AddMultimediaProperty />
            </div>
          </div>
          <div className='flex items-center gap-4 justify-end'>
            <button type='button' onClick={() => router.push('/property')} className='bg-slate-100 w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium'><X size={20} /> Cancelar</button>
            <button 
              type='button' 
              onClick={() => isEdit ? setShowConfirmModal(true) : handleCreateProperty()}
              disabled={isSaving}
              className='bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-all font-medium disabled:opacity-60'
            >
              <ArrowUpToLine size={20} /> {isEdit ? 'Actualizar' : 'Publicar'}
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
              <button onClick={handleUpdateProperty} disabled={isSaving} className="flex-1 px-4 py-2 bg-primary_color text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                <Save size={16} /> {isSaving ? 'Guardando...' : 'Sí, guardar cambios'}
              </button>
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm">Cancelar</button>
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