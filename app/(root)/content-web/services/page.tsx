"use client"

import Breadcrumb from '@/components/ui/breadcrumb';
import { ArrowUpToLine, Save, X } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { AddServices } from './addServices';
import { useRouter } from 'next/navigation';

const ContentWebServiciosPage = () => {
    const router = useRouter();
    const [isPublishing, setIsPublishing] = useState(false);
    const saveHeaderRef = useRef<(() => Promise<void>) | null>(null);
    const onClearRef = useRef<(() => void) | null>(null);

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            if (saveHeaderRef.current) {
                await saveHeaderRef.current();
            }
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <>
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Contenido Web', href: '/content-web/home' },
                { label: 'Servicios', href: '/content-web/services', active: true }
            ]} />

            <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
                <div className='w-full h-full'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
                        <div>
                            <h1 className='font-[700] text-2xl'>Configuración de Servicios</h1>
                            <p className='text-md text-gray-500'>Administra los servicios que se muestran en el sitio web público.</p>
                        </div>

                    </div>
                    <div className='flex flex-col gap-6 mt-6'>
                        <AddServices onSaveHeaderRef={saveHeaderRef} onClearRef={onClearRef} />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end mt-6 gap-3">
                        <button
                            type="button"
                            onClick={() => onClearRef.current?.()}
                            className="bg-slate-100 w-full sm:w-[180px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-3 hover:bg-slate-200 transition-all font-medium shadow-md whitespace-nowrap text-sm">
                            <X size={18} /> Limpiar campos
                        </button>

                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="bg-primary_color text-white w-full sm:w-[180px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-3 hover:opacity-90 transition-all font-medium shadow-md disabled:opacity-60 whitespace-nowrap text-sm">
                            {isPublishing ? <Save size={18} className="animate-spin" /> : <ArrowUpToLine size={18} />} Publicar
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ContentWebServiciosPage

