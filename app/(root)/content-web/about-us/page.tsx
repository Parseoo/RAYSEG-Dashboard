"use client"
import Breadcrumb from '@/components/ui/breadcrumb';
import { ArrowUpToLine, Save, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { AddAboutUs } from './addAboutUs';

const ContentWebAboutUsPage = () => {
    const onSaveRef = useRef<(() => Promise<void>) | null>(null);
    const onClearRef = useRef<(() => void) | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (onSaveRef.current) {
            setIsSaving(true);
            try {
                await onSaveRef.current();
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <>
            <Breadcrumb items={[
                { label: 'Contenido Web', href: '/content-web' },
                { label: 'Sobre Nosotros', href: '/content-web/about-us', active: true }
            ]} />

            <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
                <div className='w-full h-full'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
                        <div>
                            <h1 className='font-[700] text-2xl'>Sobre Nosotros</h1>
                            <p className='text-md text-gray-500'> Información sobre quiénes somos, nuestra misión y visión.</p>
                        </div>

                    </div>
                    <div className='flex flex-col gap-6'>
                        <AddAboutUs onSaveRef={onSaveRef} onClearRef={onClearRef} />
                    </div>

                    <div className="flex items-center mt-6">

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-end w-full">
                            <button
                                type="button"
                                onClick={() => onClearRef.current?.()}
                                className="bg-slate-100 w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md">
                                <X size={20} /> Limpiar campos
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md disabled:opacity-60">
                                {isSaving ? <Save size={20} className="animate-spin" /> : <Save size={20} />} Guardar
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ContentWebAboutUsPage

