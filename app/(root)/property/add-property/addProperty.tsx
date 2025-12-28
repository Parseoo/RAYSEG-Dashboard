"use client"

import React from 'react';
import { ArrowUpToLine, Save } from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import { AddDataProperty } from './addDataProperty';
import { AddDetailProperty } from './addDetailProperty';
import { AddLocationProperty } from './addLocationProperty';
import { AddMultimediaProperty } from './addMultimediaProperty';
import { AddPublicationProperty } from './addPublication';

const AddProperty = () => {
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
          <div className='flex gap-3'>
            <AddDataProperty />
            <AddDetailProperty />
          </div>
          <div className='flex gap-3'>
            <div className='flex flex-col w-full'>
              <AddLocationProperty />
              <AddPublicationProperty />
            </div>
            <div className='w-full'>
              <AddMultimediaProperty />
            </div>
          </div>
          <div className='flex items-center gap-4 justify-end'>
            <button type='button'
              className='bg-slate-100 w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium'>
              <Save size={20} /> Guardar borrador
            </button>
            <button type='button'
              className='bg-primary_color text-white w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium'>
              <ArrowUpToLine size={20} /> Publicar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddProperty