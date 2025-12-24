"use client"

import React from 'react';
import { Save } from 'lucide-react';
import AddDataClient from './addDataClient';
import AddNotesClient from './addNotesClient';
import AddContactClient from './addContactClient';
import AddPreferencesClient from './addPreferencesClient';
import Breadcrumb from '@/components/ui/breadcrumb';

const AddClient = () => {
  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Clientes', href: '/clients' },
        { label: 'Agregar Cliente', href: '/clients/add-client', active: true }
      ]} />
      <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex items-center justify-between mb-3'>
            <div>
              <h1 className='font-[700] text-2xl'>Agregar Cliente</h1>
              <p className='text-md text-gray-500'>Formulario completo de alta de cliente.</p>
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
              <Save size={20} /> Guardar Cliente
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddClient;