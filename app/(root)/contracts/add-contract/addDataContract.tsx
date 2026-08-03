"use client"

import React from 'react';
import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';

import { useClient } from '../../clients/clientContext';

export const AddDataClient = () => {
    const { taxpayerTypes, segmentTypes } = useClient();

    const clientTypeOptions = segmentTypes.map(item => ({
        label: item.name,
        value: (item.value || item.name).toLowerCase()
    }));

    const taxpayerOptions = taxpayerTypes.map(item => ({
        label: item.name,
        value: item.name
    }));

    // Configuración de los inputs
    const inputs: InputFieldConfig[] = [
        { type: 'text', id: 'nombre_razon_social', label: 'Nombre completo / Razón social', placeholder: 'Ej: Juan Pérez o Grupo Inmobiliario SA de CV', group: 1 },
        {
            type: 'select', id: 'tipo', label: 'Tipo de contribuyente', placeholder: 'Seleccione tipo de contribuyente', group: 2, options: taxpayerOptions
        },
        { type: 'text', id: 'identificacion_fiscal', label: 'Identificación Fiscal', placeholder: 'RFC', group: 2 },
        {
            type: 'select', id: 'operacion', label: 'Estatus del cliente', placeholder: 'Activo, Potencial, Inactivo', group: 3, options: [
                { label: 'Activo', value: 'activo' },
                { label: 'Potencial', value: 'potencial' },
                { label: 'Inactivo', value: 'inactivo' },
            ]
        },
        {
            type: 'select', id: 'tipo_cliente', label: 'Tipo de cliente', placeholder: 'Seleccione un tipo de cliente', group: 3, options: clientTypeOptions
        },
    ];

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