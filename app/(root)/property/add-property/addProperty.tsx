"use client"

import React from 'react';
import { ArrowUpToLine, Save, X } from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import { useRouter } from 'next/navigation';
import { AddDataProperty } from './addDataProperty';
import { AddDetailProperty } from './addDetailProperty';
import { AddLocationProperty } from './addLocationProperty';
import { AddMultimediaProperty } from './addMultimediaProperty';
import { AddPublicationProperty } from './addPublication';

const AddProperty = () => {
  const router = useRouter();

  return (
    <>
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Propiedades', href: '/property' },
        { label: 'Agregar Propiedad', href: '/property/add-property', active: true }
      ]} />
      <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex items-center justify-between mb-3'>
            <div>
              <h1 className='font-[700] text-2xl'>Agregar Propiedad</h1>
              <p className='text-md text-gray-500'>Carga rápida en secciones: datos básicos, ubicación, detalles y medios</p>
            </div>
          </div>
          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='flex flex-col w-full gap-3'>
              <AddDataProperty />
              <AddLocationProperty />
              <AddPublicationProperty />
            </div>
            <div className='flex flex-col w-full gap-3'>
              <AddDetailProperty />
              <AddMultimediaProperty />
            </div>
          </div>
          <div className='flex items-center gap-4 justify-end'>
            <button
              type='button'
              onClick={() => router.push('/property')}
              className='bg-slate-100 w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium'
            >
              <X size={20} /> Cancelar
            </button>
            <button type='button'
              className='bg-slate-200 w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-300 transition-all font-medium'>
              <Save size={20} /> Guardar borrador
            </button>
            <button type='button'
              className='bg-primary_color text-white w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-all font-medium'>
              <ArrowUpToLine size={20} /> Publicar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddProperty