"use client"

import Breadcrumb from '@/components/ui/breadcrumb';
import { ArrowUpToLine, Save, Info, X } from 'lucide-react';
import React, { useRef } from 'react';
import { AddHome } from './addHome';
import { useRouter } from 'next/navigation';

const ContentWebHomePage = () => {
  const router = useRouter();
  const onSaveRef = useRef<(() => Promise<void>) | null>(null);
  const onClearRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Breadcrumb items={[
        { label: 'Contenido Web', href: '/content-web' },
        { label: 'Home', href: '/content-web/home', active: true }
      ]} />

      <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
            <div>
              <h1 className='font-[700] text-2xl'>Configuración Home</h1>
              <p className='text-md text-gray-500'>Configuración de banners y contenido principal</p>
            </div>

          </div>
          <div className='flex flex-col gap-6'>
            <AddHome onSaveRef={onSaveRef} onClearRef={onClearRef} />
          </div>

          <div className="flex items-center justify-between mt-6">
            {/* IZQUIERDA */}
            <div className="flex items-center gap-2 text-sm">
              <Info size={16} />
              <p className="text-gray-500">
                Los cambios  se aplicarán directamente al sitio público.
              </p>
            </div>

            {/* DERECHA */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onClearRef.current?.()}
                className="bg-slate-100 w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium shadow-md">
                <X size={20} /> Limpiar campos
              </button>

              <button
                type="button"
                onClick={() => onSaveRef.current?.()}
                className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-all font-medium shadow-md">
                <ArrowUpToLine size={20} /> Publicar
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default ContentWebHomePage

