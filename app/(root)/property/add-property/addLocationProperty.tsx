"use client"

import React from 'react';
import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';

// Configuración de los inputs
const inputs: InputFieldConfig[] = [
    { type: 'text', id: 'direccion', label: 'Dirección', placeholder: 'Colonia, Calle, número, Piso, Departamento' },
    {
        type: 'select', id: 'ciudad', label: 'Selecciona una ciudad', placeholder: 'Seleccionar ciudad', group: 2, options: [
            { value: '1', label: 'Ciudad de México' },
            { value: '2', label: 'Guadalajara' },
            { value: '3', label: 'Monterrey' },
        ]
    },
    { type: 'number', id: 'cp', label: 'Código Postal', placeholder: 'Ej: 35697', group: 2 },
];

export const AddLocationProperty = () => {
    return (
        <>
            <div className='bg-slate-100 w-full max-h-max rounded-lg p-5 mb-5'>
                <h1 className='font-[500] text-lg'>Ubicación</h1>
                <p className='text-md text-gray-500'>Dirección exacta para mapas y reportes.</p>
                <div className='mt-4'>
                    <DynamicInputs inputs={inputs} withBgWhite={true} />
                </div>
            </div>
        </>
    )
}

export default AddLocationProperty;