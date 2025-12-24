"use client"

import React from 'react';
import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';

// Configuración de los inputs
const inputs: InputFieldConfig[] = [
    { type: 'select', id: 'origen_prospecto', label: 'Origen del prospecto', placeholder: 'Seleccione una opción', group: 1, options: [
        { label: 'Referencia', value: 'referencia' },
        { label: 'Publicidad', value: 'publicidad' },
    ]},
    { type: 'select', id: 'responsable_asignado', label: 'Responsable', placeholder: 'Seleccionar agente', group: 1, options: [
        { label: 'Agente 1', value: 'agente_1' },
        { label: 'Agente 2', value: 'agente_2' },
    ]},
    { type: 'textarea', id: 'notas_internas', label: 'Notas internas', placeholder: 'Escribe aquí las notas internas del cliente...', group: 2 },
];

export const AddNotesClient = () => {
    return (
        <>
            <div className='bg-slate-100 w-full max-h-max rounded-lg p-5 mb-9'>
                <h1 className='font-[500] text-lg'>Relación y notas internas</h1>
                <p className='text-md text-gray-500'>Información para tu equipo comercial y de seguimiento.</p>
                <div className='mt-4'>
                    <DynamicInputs inputs={inputs} withBgWhite={true} />
                </div>
            </div>
        </>
    )
}

export default AddNotesClient;