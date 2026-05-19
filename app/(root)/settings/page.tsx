"use client"

import Breadcrumb from '@/components/ui/breadcrumb';
import { Save, Loader2, Image as ImageIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { GetSettings, UpdateSettings, GetBranding } from '@/lib/api/config-api';
import { showToast } from 'nextjs-toast-notify';
import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import Image from 'next/image';

const SettingsPage = () => {
    const [settings, setSettings] = useState<any>({
        company_name: '',
        logo_url: '',
        primary_color: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await GetSettings();
                const data = res.data?.data || res.data || {};

                // Debug: log GetBranding response
                try {
                    const brandingRes = await GetBranding();
                    console.log('🔵 GetBranding response:', brandingRes.data);
                } catch (err) {
                    console.error('🔴 GetBranding error:', err);
                }

                setSettings({
                    ...data,
                    company_name: data.name || data.company_name || '',
                    logo_url: data.logo || data.logo_url || '',
                    primary_color: data.color || data.primary_color || ''
                });
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
            const payload = {
                company_name: settings.company_name,
                primary_color: settings.primary_color,
                logo_url: settings.logo_url
            };
            console.log('🟡 Payload enviado a PATCH /api/settings:', payload);
            await UpdateSettings(payload);
            showToast.success("Configuración actualizada correctamente");
        } catch (error) {
            console.error("Error saving settings:", error);
            showToast.error("Error al actualizar la configuración");
        } finally {
            setIsSaving(false);
        }
    };

    const generalInputs: InputFieldConfig[] = [
        { type: 'text', id: 'company_name', label: 'Nombre de la empresa', placeholder: 'Ingresa el nombre de la empresa' },
        { type: 'color', id: 'primary_color', label: 'Color primario (Hex)', placeholder: '#000000', className: 'h-[42px] p-1 cursor-pointer' }
    ];

    const logoInputs: InputFieldConfig[] = [
        { type: 'url', id: 'logo_url', label: 'Logo (URL)', placeholder: 'Pega la URL de la imagen del logo' }
    ];

    const mapInputs = (inputs: InputFieldConfig[]) => inputs.map(input => ({
        ...input,
        value: settings[input.id] || '',
        onChange: (e: any) => {
            const val = e?.target ? e.target.value : e;
            handleChange(input.id, val);
        }
    }));

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
                { label: 'Configuración', href: '/settings', active: true }
            ]} />

            <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
                <div className='w-full h-full'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
                        <div>
                            <h1 className='font-[700] text-2xl'>Configuración General</h1>
                            <p className='text-md text-gray-500'>Configura los aspectos visuales y de marca de tu sistema.</p>
                        </div>
                    </div>

                    <div className='flex flex-col gap-6'>
                        <div className='w-full max-h-max rounded-lg p-5 border'>
                            <h1 className='font-[500] text-lg mb-4'>Información de Marca</h1>
                            
                            <DynamicInputs inputs={mapInputs(generalInputs)} withBgWhite={true} />

                            <div className="mt-6 mb-2">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Logo</h3>
                                {settings.logo_url ? (
                                    <div className="group w-full relative max-w-sm h-[150px] rounded-md overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50 mb-4">
                                        <img 
                                            src={settings.logo_url} 
                                            alt="Logo preview" 
                                            className="w-full h-full object-contain p-2"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/user.svg'; // Fallback
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full max-w-sm h-[150px] rounded-md overflow-hidden border border-gray-200 flex flex-col items-center justify-center bg-gray-50 mb-4 text-gray-400">
                                        <ImageIcon size={32} className="mb-2 text-gray-300" />
                                        <p className="text-sm">Sin imagen</p>
                                    </div>
                                )}
                                <DynamicInputs inputs={mapInputs(logoInputs)} withBgWhite={true} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center mt-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-end w-full">
                            <button
                                type="button"
                                className="bg-slate-100 w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium">
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium disabled:opacity-50">
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

export default SettingsPage;
