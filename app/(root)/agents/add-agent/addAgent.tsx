"use client"

import React from 'react';
import { Save } from 'lucide-react';
import AddDataClient from './addDataAgent';
import AddNotesClient from './addNotesAgent';
import AddContactClient from './addContactAgent';
import AddPreferencesClient from './addEmploymentData';
import Breadcrumb from '@/components/ui/breadcrumb';

const AddAgent = () => {
  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Agentes', href: '/agents' },
        { label: 'Agregar Agente', href: '/agents/add-agent', active: true }
      ]} />
      <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex items-center justify-between mb-3'>
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
            <button type='button'
              className='bg-slate-100 w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium'>
              Guardar borrador
            </button>
            <button type='button'
              className='bg-primary_color text-white w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium'>
              <Save size={20} /> Guardar Agente
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddAgent;