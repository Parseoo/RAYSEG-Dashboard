"use client"

import React from 'react';
import { Save, X, ArrowLeft } from 'lucide-react';
import AddDataClient from './addDataAgent';
import AddNotesClient from './addNotesAgent';
import AddContactClient from './addContactAgent';
import AddPreferencesClient from './addEmploymentData';
import Breadcrumb from '@/components/ui/breadcrumb';
import { useRouter } from 'next/navigation';

const AddAgent = () => {
  const router = useRouter();

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Agentes', href: '/agents' },
        { label: 'Agregar Agente', href: '/agents/add-agent', active: true }
      ]} />
      <div className='mb-3'>
        <button onClick={() => router.push('/agents')} className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'>
          <ArrowLeft size={18} /><span className='text-sm'>Volver</span>
        </button>
      </div>
      <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
            <div>
              <h1 className='font-[700] text-2xl'>Agregar Agente</h1>
              <p className='text-md text-gray-500 mt-2'>Llena los datos solicitados para dar de alta a un nuevo agente. Verifica que la información sea precisa para evitar errores en el proceso.</p>
            </div>
          </div>
          <AddDataClient />
          <AddContactClient />
          <AddPreferencesClient />
          <AddNotesClient />
          <div className='flex gap-4 justify-end'>
            <button type='button' onClick={() => router.push('/agents')} 
            className='bg-slate-100 w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium shadow-md'>
              <X size={20} /> Cancelar
            </button>
            <button type='button' 
            className='bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-all font-medium shadow-md'>
              <Save size={20} /> Guardar Agente
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddAgent;