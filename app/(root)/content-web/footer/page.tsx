"use client"

import Breadcrumb from '@/components/ui/breadcrumb';
import { Save, Loader2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AddFooter } from './addFooter';
import { GetFooter, UpdateFooter } from '@/lib/api/web-content-api';
import { showToast } from 'nextjs-toast-notify';
import { FooterResponse } from '@/lib/@type-web';

const ContentWebFooterPage = () => {
    const [settings, setSettings] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Mapeo de campos del API a campos del input
    const apiToInputMap: Record<string, string> = {
        physical_address: 'address',
        primary_phone: 'phone',
        secondary_phone: 'phoneSecondary',
        email: 'email',
        business_hours: 'businessHours',
        facebook_url: 'facebook',
        instagram_url: 'instagram',
        linkedin_url: 'linkedin',
        whatsapp_number: 'whatsapp',
        footer_description: 'textFooter'
    };

    // Mapeo de campos del input al API
    const inputToApiMap: Record<string, string> = {
        address: 'physical_address',
        phone: 'primary_phone',
        phoneSecondary: 'secondary_phone',
        email: 'email',
        businessHours: 'business_hours',
        facebook: 'facebook_url',
        instagram: 'instagram_url',
        linkedin: 'linkedin_url',
        whatsapp: 'whatsapp_number',
        textFooter: 'footer_description'
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await GetFooter();
                const data = res.data || {};
                // Convertir campos del API a campos del input
                const mappedData: any = {};
                Object.entries(data).forEach(([key, value]) => {
                    const inputKey = apiToInputMap[key];
                    if (inputKey) {
                        mappedData[inputKey] = value;
                    } else {
                        mappedData[key] = value;
                    }
                });
                setSettings(mappedData);
            } catch (error) {
                console.error("Error fetching settings:", error);
                showToast.error("Error al cargar la configuración");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (id: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Convertir campos del input a campos del API
            const apiData: any = {};
            Object.entries(settings).forEach(([key, value]) => {
                const apiKey = inputToApiMap[key];
                if (apiKey) {
                    apiData[apiKey] = value;
                } else {
                    apiData[key] = value;
                }
            });
            await UpdateFooter(apiData);
            showToast.success("Configuración actualizada correctamente");
        } catch (error) {
            console.error("Error saving settings:", error);
            showToast.error("Error al actualizar la configuración");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary_color" size={40} />
            </div>
        );
    }

    return (
        <>
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Contenido Web', href: '/content-web/home' },
                { label: 'Footer', href: '/content-web/footer', active: true }
            ]} />

            <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
                <div className='w-full h-full'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4'>
                        <div>
                            <h1 className='font-[700] text-2xl'>Footer - Contacto y Redes</h1>
                            <p className='text-md text-gray-500'>Configura la información de contacto y los enlaces a redes sociales que se mostrarán en el footer del sitio.</p>
                        </div>

                    </div>
                    <div className='flex flex-col gap-6'>
                        <AddFooter settings={settings} onChange={handleChange} />
                    </div>

                    <div className="flex items-center mt-6">

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-end w-full">
                            <button
                                type="button"
                                onClick={() => setSettings({})}
                                className="bg-slate-100 w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium shadow-md">
                                <X size={20} /> Limpiar campos
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md disabled:opacity-50">
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
                                Guardar
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ContentWebFooterPage;