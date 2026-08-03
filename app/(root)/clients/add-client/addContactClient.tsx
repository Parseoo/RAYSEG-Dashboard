"use client"

import { useEffect, useState, useMemo } from 'react';
import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { useClient } from '../clientContext';
import { GetEstados, GetCiudades } from '@/lib/api/property/property-api';

export const AddContactClient = () => {
    const { state, updateField, updateAddressField, contactPreferenceTypes, errors } = useClient();
    const [estados, setEstados] = useState<{ label: string; value: string; code: string }[]>([]);
    const [ciudades, setCiudades] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const response = await GetEstados();
                const rawData: any = response?.data || response;
                let estadosData: any[] = [];

                if (rawData?.datos && Array.isArray(rawData.datos)) {
                    estadosData = rawData.datos;
                } else if (Array.isArray(rawData)) {
                    estadosData = rawData;
                } else if (rawData?.data && Array.isArray(rawData.data)) {
                    estadosData = rawData.data;
                }

                if (estadosData.length > 0) {
                    setEstados(estadosData.map((item: any) => ({
                        label: item.nombre || item.estado || item.name || String(item),
                        value: item.nombre || item.estado || item.name || String(item),
                        code: item.clave || item.codigo_estado || item.id || String(item)
                    })));
                }
            } catch (error) {
                console.error('Error fetching estados:', error);
            }
        };
        fetchEstados();
    }, []);

    useEffect(() => {
        const fetchCiudades = async () => {
            const selectedState = state.address?.state;
            if (!selectedState) {
                setCiudades([]);
                return;
            }
            try {
                let stateCode = selectedState;
                const matched = estados.find(e => e.value.toLowerCase() === selectedState.toLowerCase());
                if (matched) {
                    stateCode = matched.code;
                }
                const response = await GetCiudades(stateCode);
                const raw: any = response?.data || response;
                let ciudadesData: any[] = [];
                if (Array.isArray(raw)) ciudadesData = raw;
                else if (raw?.data && Array.isArray(raw.data)) ciudadesData = raw.data;

                if (ciudadesData.length > 0) {
                    setCiudades(ciudadesData.map((item: any) => ({
                        label: item.ciudad || item.nombre || String(item),
                        value: item.ciudad || item.nombre || String(item)
                    })));
                } else {
                    setCiudades([]);
                }
            } catch (err) {
                console.error('Error fetching ciudades for client:', err);
                setCiudades([]);
            }
        };
        if (estados.length > 0) {
            fetchCiudades();
        }
    }, [state.address?.state, estados]);

    const contactOptions = contactPreferenceTypes.map(item => ({
        label: item.name,
        value: item.name
    }));

    // Configuración de los inputs
    const inputs = useMemo<InputFieldConfig[]>(() => [
        {
            type: 'email',
            id: 'email',
            label: 'Correo electrónico',
            placeholder: 'contacto@empresa.com',
            group: 1,
            required: true
        },
        {
            type: 'tel',
            id: 'phone',
            label: 'Teléfono',
            placeholder: '4771234567',
            group: 1,
            required: true
        },
        {
            type: 'tel',
            id: 'whatsapp',
            label: 'WhatsApp',
            placeholder: '4771234567 (opcional)',
            group: 2
        },
        {
            type: 'select',
            id: 'preferred_contact',
            label: 'Medio de contacto preferido',
            placeholder: 'Selecciona el medio de contacto preferido',
            group: 2,
            options: contactOptions
        },
        {
            type: 'select',
            id: 'state',
            label: 'Estado',
            placeholder: 'Selecciona un estado',
            group: 3,
            options: estados
        },
        {
            type: 'select',
            id: 'city',
            label: 'Ciudad',
            placeholder: 'Selecciona una ciudad',
            group: 3,
            options: ciudades
        },
        {
            type: 'text',
            id: 'neighborhood',
            label: 'Colonia',
            placeholder: 'Col. Centro, Jardines del Moral o Zona Norte',
            group: 4
        },
        {
            type: 'number',
            id: 'postal_code',
            label: 'Código Postal (opcional)',
            placeholder: '37000 (opcional)',
            group: 4
        },
    ], [estados, contactOptions]);

    const addressFields = ['state', 'city', 'neighborhood', 'postal_code', 'full_address'];

    const mappedInputs = inputs.map(input => ({
        ...input,
        value: addressFields.includes(input.id)
            ? (state.address as any)[input.id] || ''
            : (state as any)[input.id] || '',
        onChange: (e: any) => {
            const val = typeof e === 'string' ? e : e.target.value;
            if (addressFields.includes(input.id)) {
                updateAddressField(input.id as any, val);
                if (input.id === 'state') {
                    updateAddressField('city', ''); // Limpiar ciudad al cambiar estado
                }
            } else {
                updateField(input.id, val);
            }
        },
        error: errors[input.id]
    }));

    return (
        <div className='bg-white w-full max-h-max rounded-lg'>
            <div className='w-full h-full'>
                <div className='flex gap-3'>
                    <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                        <h1 className='font-[500] text-lg'>Contacto y Ubicación</h1>
                        <p className='text-md text-gray-500'>Datos de contacto principales y zona de interés dentro de la ciudad.</p>
                        <div className='mt-4 flex flex-col gap-4'>
                            <DynamicInputs inputs={mappedInputs} withBgWhite={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddContactClient;
