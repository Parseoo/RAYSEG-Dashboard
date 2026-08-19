"use client"

import { useEffect, useState } from 'react';
import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { useProperty } from '../propertyContext';
import { GetEstados, GetCiudades } from '@/lib/api/property/property-api';

// Configuración base de los inputs (las opciones de `estado` se poblarán dinámicamente)
const baseInputs: Omit<InputFieldConfig, 'options'>[] = [
    { type: 'text', id: 'street', label: 'Calle', placeholder: 'Ej. Blvd. Campestre o Av. Principal', required: true, group: 0 },
    { type: 'text', id: 'neighborhood', label: 'Colonia / Fraccionamiento', placeholder: 'Ej. Jardines del Moral, Residencial Campestre', group: 0 },
    { type: 'text', id: 'street_number', label: 'Núm. Exterior', placeholder: '245', group: 1 },
    { type: 'text', id: 'interior_number', label: 'Núm. Interior (opc.)', placeholder: 'Int. 4B', group: 1 },
    { type: 'number', id: 'postal_code', label: 'Código Postal', placeholder: '37160', group: 1, required: true },
    { type: 'select', id: 'estado', label: 'Estado', placeholder: 'Selecciona un estado', group: 2, required: true },
    { type: 'select', id: 'city', label: 'Ciudad', placeholder: 'Selecciona una ciudad', group: 2, required: true },
];

export const AddLocationProperty = () => {
    const { state, updateField, errors } = useProperty();
    const [estados, setEstados] = useState<{ label: string; value: string; code: string }[]>([]);
    const [ciudades, setCiudades] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const response = await GetEstados();
                const raw: any = response?.data || response;
                let estadosData: any[] = [];

                if (Array.isArray(raw)) estadosData = raw;
                else if (raw?.data && Array.isArray(raw.data)) estadosData = raw.data;

                if (estadosData.length > 0) {
                    setEstados(estadosData.map((item: any) => ({
                        label: item.nombre || item.estado || item.name || String(item),
                        value: item.nombre || item.estado || item.name || String(item),
                        code: item.clave || item.codigo_estado || item.id || String(item)
                    })));
                }
            } catch (err) {
                console.error('Error fetching estados for property location:', err);
            }
        };
        fetchEstados();
    }, []);

    useEffect(() => {
        const fetchCiudades = async () => {
            if (!state.estado) {
                setCiudades([]);
                return;
            }
            try {
                let stateCode = state.estado;
                const matched = estados.find(e => e.value.toLowerCase() === state.estado.toLowerCase());
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
                console.error('Error fetching ciudades for property location:', err);
                setCiudades([]);
            }
        };
        if (estados.length > 0) {
            fetchCiudades();
        }
    }, [state.estado, estados]);

    const inputs: InputFieldConfig[] = baseInputs.map(inp => {
        let options: any[] = [];
        if (inp.id === 'estado') {
            options = estados;
        } else if (inp.id === 'city') {
            options = ciudades;
        }
        
        return {
            ...inp as InputFieldConfig,
            options
        };
    });

    const mappedInputs = inputs.map(input => ({
        ...input,
        value: (state as any)[input.id as keyof typeof state] as any,
        onChange: (e: any) => {
            const val = typeof e === 'string' ? e : e.target.value;
            updateField(input.id as any, val);
            if (input.id === 'estado') {
                updateField('city', ''); // Limpiar ciudad al cambiar estado
            }
        },
        error: (errors as any)[input.id]
    }));

    return (
        <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
            <h1 className='font-[500] text-lg'>Ubicación</h1>
            <p className='text-md text-gray-500'>Dirección exacta para mapas y reportes.</p>
            <div className='mt-4'><DynamicInputs inputs={mappedInputs} withBgWhite={true} /></div>
        </div>
    )
}

export default AddLocationProperty;