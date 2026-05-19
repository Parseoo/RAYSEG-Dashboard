"use client"

import React from 'react';
import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';

// Configuración de los inputs
const inputs: InputFieldConfig[] = [
    { type: 'text', id: 'street', label: 'Calle', placeholder: 'Ej: Av. Principal' },
    { type: 'text', id: 'street_number', label: 'Número', placeholder: 'Ej: 123', group: 1 },
    { type: 'text', id: 'neighborhood', label: 'Colonia', placeholder: 'Ej: Centro', group: 1 },
    {
        type: 'select', id: 'city', label: 'Selecciona una ciudad', placeholder: 'Seleccionar ciudad', group: 2, options: [
            { value: 'Ciudad de México', label: 'Ciudad de México' },
            { value: 'Guadalajara', label: 'Guadalajara' },
            { value: 'Monterrey', label: 'Monterrey' },
        ]
    },
    { type: 'number', id: 'postal_code', label: 'Código Postal', placeholder: 'Ej: 35697', group: 2 },
];

import { useProperty } from '../propertyContext';

export const AddLocationProperty = () => {
    const { state, updateField } = useProperty();
    const mappedInputs = inputs.map(input => ({
        ...input,
        value: state[input.id as keyof typeof state] as any,
        onChange: (e: any) => updateField(input.id as any, typeof e === 'string' ? e : e.target.value)
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