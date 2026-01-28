"use client"

import React from 'react';
import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';

// Configuración de los inputs
const inputs: InputFieldConfig[] = [
    { type: 'text', id: 'nombre_razon_social', label: 'Nombre completo / Razón social', placeholder: 'Ej: Juan Pérez o Grupo Inmobiliario SA de CV', group: 1 },
    {
        type: 'select', id: 'tipo', label: 'Tipo de cliente', placeholder: 'Persona Física / Persona Moral', group: 2, options: [
            { label: 'Persona Física', value: 'persona_fisica' },
            { label: 'Persona Moral', value: 'persona_moral' },
        ]
    },
    { type: 'text', id: 'identificacion_fiscal', label: 'Identificación Fiscal', placeholder: 'RFC / CURP', group: 2 },
    {
        type: 'select', id: 'operacion', label: 'Estatus del cliente', placeholder: 'Activo, Potencial, Inactivo', group: 3, options: [
            { label: 'Activo', value: 'activo' },
            { label: 'Potencial', value: 'potencial' },
            { label: 'Inactivo', value: 'inactivo' },
        ]
    },
    {
        type: 'select', id: 'segmento', label: 'Segmento', placeholder: 'Seleccione un segmento', group: 3, options: [
            { label: 'Nuevo lead', value: 'nuevo_lead' },
            { label: 'Propietario vendedor', value: 'propietario_vendedor' },
            { label: 'Inversionista', value: 'inversionista' },
            { label: 'Arrendatario', value: 'arrendatario' },
        ]
    },
];

export const AddDataClient = () => {
    return (
        <>
            <div className='bg-white w-full max-h-max rounded-lg'>
                <div className='w-full h-full'>
                    <div className='flex gap-3'>
                        <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                            <h1 className='font-[500] text-lg'>Datos básicos</h1>
                            <p className='text-md text-gray-500 mt-2'>Identificación principal del cliente y tipo de relación.</p>
                            <div className='mt-4'>
                                <DynamicInputs inputs={inputs} withBgWhite={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddDataClient