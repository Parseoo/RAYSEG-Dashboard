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

const AddClientContent = ({ clientId }: { clientId?: string }) => {
  const router = useRouter();
  const { state, fetchClient, resetState, loading } = useClient();
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = !!clientId;

  useEffect(() => {
    if (clientId) {
      fetchClient(clientId);
    } else {
      resetState();
    }
  }, [clientId, fetchClient, resetState]);

  const handleSaveClient = async () => {
    setIsSaving(true);
    try {
      // El estado ya está alineado con lo que necesita el API
      const payload: any = {
        ...state,
      };

      if (state.propiedad_id && state.propiedad_id > 0) {
        payload.propiedad = { id: state.propiedad_id };
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
      router.push('/clients');
    } catch (error: any) {
      showToast.error(error?.response?.data?.detail || `Error al ${isEdit ? 'actualizar' : 'crear'} el cliente`);
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
              className='bg-slate-100 w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium disabled:opacity-60'
              disabled={isSaving}
            >
              <X size={20} /> Cancelar
            </button>
            <button 
              type='button'
              onClick={handleSaveClient}
              disabled={isSaving}
              className='bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-all font-medium disabled:opacity-60'
            >
              <Save size={20} /> {isSaving ? 'Guardando...' : isEdit ? 'Actualizar Cliente' : 'Guardar Cliente'}
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