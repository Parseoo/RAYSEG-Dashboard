"use client"

import React, { useState, useEffect } from 'react';
import { Save, X, ArrowLeft } from 'lucide-react';
import AddDataClient from './addDataClient';
import AddNotesClient from './addNotesClient';
import AddContactClient from './addContactClient';
import AddPreferencesClient from './addPreferencesClient';
import Breadcrumb from '@/components/ui/breadcrumb';
import { useRouter } from 'next/navigation';
import { ClientProvider, useClient } from '../clientContext';
import { CreateClient } from '@/lib/api/client-api';
import { showToast } from 'nextjs-toast-notify';
import { ItemResponse } from '@/lib/@type';
import { resolveCatalogApiValue, normalizeInterest } from '@/lib/utils/catalog';

const AddClientContent = ({ clientId }: { clientId?: string }) => {
  const router = useRouter();
  const { state, fetchClient, resetState, loading, setErrors, statusTypes, taxpayerTypes, segmentTypes, contactPreferenceTypes, mainInterestTypes, targetPropertyTypes, paymentMethodTypes, leadSourceTypes, clientOriginTypes } = useClient();
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = !!clientId;

  useEffect(() => {
    if (clientId) {
      fetchClient(clientId);
    } else {
      resetState();
    }
  }, [clientId, fetchClient, resetState]);

  // Helper para convertir string de catálogo a objeto CatalogItem
  const toCatalogItem = (value: string, catalog: ItemResponse[]): any => {
    if (!value) return null;
    const item = catalog.find(c => c.name?.toLowerCase() === value.toLowerCase() || String(c.value) === value);
    return item || null;
  };

  const handleSaveClient = async () => {
    // Validar campos obligatorios
    const tempErrors: Record<string, string> = {};
    if (!state.name?.trim()) {
      tempErrors.name = "El campo es requerido";
    }
    if (!state.client_type) {
      tempErrors.client_type = "El campo es requerido";
    }
    if (!state.email?.trim()) {
      tempErrors.email = "El campo es requerido";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(state.email)) {
        tempErrors.email = "Por favor, ingrese un correo electrónico válido.";
      }
    }
    if (!state.phone?.trim()) {
      tempErrors.phone = "El campo es requerido";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      showToast.warning("Por favor, complete los campos requeridos marcados en rojo.");
      return;
    }

    // Limpiar errores si pasa la validación
    setErrors({});

    setIsSaving(true);
    try {
      // Construir el objeto address según el AddressSchema esperado
      const address = {
        state: state.address?.state || "",
        city: state.address?.city || "",
        neighborhood: state.address?.neighborhood || "",
        postal_code: state.address?.postal_code || "",
        full_address: state.address?.full_address || "",
      };

      // Construir el payload final con los tipos exactos requeridos por el backend
      const payload: any = {
        name: state.name || "",
        client_status: resolveCatalogApiValue(state.client_status, statusTypes) || "activo",
        client_type: resolveCatalogApiValue(state.client_type, segmentTypes) || null,
        taxpayer_type: resolveCatalogApiValue(state.taxpayer_type, taxpayerTypes) || null,
        tax_id: state.tax_id || null,
        email: state.email || null,
        phone: state.phone || null,
        whatsapp: state.whatsapp || null,
        preferred_contact: resolveCatalogApiValue(state.preferred_contact, contactPreferenceTypes) || null,
        address: address,
        main_interest: (mainInterestTypes.length > 0 ? resolveCatalogApiValue(normalizeInterest(state.main_interest), mainInterestTypes) : normalizeInterest(state.main_interest)) || normalizeInterest(state.main_interest) || null,
        target_property_type: resolveCatalogApiValue(state.target_property_type, targetPropertyTypes) || null,
        budget_min: state.budget_min && state.budget_min > 0 ? Number(state.budget_min) : null,
        budget_max: state.budget_max && state.budget_max > 0 ? Number(state.budget_max) : null,
        bedrooms: state.bedrooms && state.bedrooms > 0 ? Number(state.bedrooms) : null,
        bathrooms: state.bathrooms && state.bathrooms > 0 ? Number(state.bathrooms) : null,
        parking_spaces: state.parking_spaces && state.parking_spaces > 0 ? Number(state.parking_spaces) : null,
        payment_method: resolveCatalogApiValue(state.payment_method, paymentMethodTypes) || null,
        estimated_time: state.estimated_time || null,
        client_origin: resolveCatalogApiValue(state.lead_source, clientOriginTypes) || null,
        other_source: state.other_source || null,
        agent_id: state.agent_id && state.agent_id > 0 ? Number(state.agent_id) : null,
        internal_notes: state.internal_notes || null,
        profile_photo: state.profile_photo || null,
        profile_picture: state.profile_photo || null,
      };

      if (state.property && state.property > 0) {
        payload.property = { id: state.property };
      }

      console.log(`Payload enviado al backend (${isEdit ? 'EditClient' : 'CreateClient'}):`, payload);

      if (isEdit) {
        const { EditClient } = await import('@/lib/api/client-api');
        await EditClient(clientId, payload);
        showToast.success("Cliente actualizado correctamente");
      } else {
        await CreateClient(payload);
        showToast.success("Cliente creado correctamente");
      }
      setTimeout(() => {
        window.location.href = '/clients';
      }, 1500);
    } catch (error: any) {
      console.error("Error al guardar cliente:", error);
      const detail = error?.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail ? JSON.stringify(detail) : `Error al ${isEdit ? 'actualizar' : 'crear'} el cliente`);
      showToast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary_color'></div></div>;

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Clientes', href: '/clients' },
        { label: isEdit ? 'Editar Cliente' : 'Agregar Cliente', href: isEdit ? `/clients/edit-client/${clientId}` : '/clients/add-client', active: true }
      ]} />
      <div className='mb-3'>
        <button onClick={() => router.push('/clients')} className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'>
          <ArrowLeft size={18} /><span className='text-sm'>Volver</span>
        </button>
      </div>
      <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
            <div>
              <h1 className='font-[700] text-2xl'>{isEdit ? 'Editar Cliente' : 'Agregar Cliente'}</h1>
              <p className='text-md text-gray-500'>{isEdit ? 'Actualiza la información del cliente.' : 'Formulario completo de alta de cliente.'}</p>
            </div>
          </div>
          <AddDataClient />
          <AddContactClient />
          <AddPreferencesClient />
          <AddNotesClient />
          <div className='flex gap-4 justify-end'>
            <button
              type='button'
              onClick={() => router.push('/clients')}
              className='bg-slate-100 w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium shadow-md disabled:opacity-60'
              disabled={isSaving}
            >
              <X size={20} /> Cancelar
            </button>
            <button
              type='button'
              onClick={handleSaveClient}
              disabled={isSaving}
              className='bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-all font-medium shadow-md disabled:opacity-60'
            >
              <Save size={20} /> {isSaving ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const AddClient = ({ clientId }: { clientId?: string }) => (
  <ClientProvider>
    <AddClientContent clientId={clientId} />
  </ClientProvider>
);

export default AddClient;
