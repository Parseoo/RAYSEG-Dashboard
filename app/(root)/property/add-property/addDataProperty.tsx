"use client"

import React from 'react';
import { DynamicInputs } from '@/components/ui/Input';
import { inputsDataProperty } from '../inputConfig';


import { useProperty } from '../propertyContext';

export const AddDataProperty = () => {
    const { state, updateField, propertyTypes, operationCatalog, propertyStateCatalog } = useProperty();

    const inputs = inputsDataProperty.map(input => {
        // Inyectar opciones dinámicas para Tipo de Propiedad
        const dynamicPropertyTypes = propertyTypes || [];
        if (input.id === 'property_type' && dynamicPropertyTypes.length > 0) {
            return {
                ...input,
                options: dynamicPropertyTypes.map(type => ({
                    label: type.name,
                    value: type.name
                })),
                value: state[input.id as keyof typeof state] as any,
                onChange: (e: any) => updateField(input.id as any, typeof e === 'string' ? e : e.target.value)
            };
        }

        // Inyectar opciones dinámicas para Operación
        const dynamicOperationCatalog = operationCatalog || [];
        if (input.id === 'operation_type' && dynamicOperationCatalog.length > 0) {
            return {
                ...input,
                options: dynamicOperationCatalog.map(op => ({
                    label: op.name,
                    value: op.name
                })),
                value: state[input.id as keyof typeof state] as any,
                onChange: (e: any) => updateField(input.id as any, typeof e === 'string' ? e : e.target.value)
            };
        }

        // Inyectar opciones dinámicas para Estado de la Propiedad (Disponible/Vendido)
        const dynamicPropertyState = propertyStateCatalog || [];
        if (input.id === 'property_status' && dynamicPropertyState.length > 0) {
            return {
                ...input,
                options: dynamicPropertyState.map(item => ({
                    label: item.name,
                    value: item.name
                })),
                value: state[input.id as keyof typeof state] as any,
                onChange: (e: any) => updateField(input.id as any, typeof e === 'string' ? e : e.target.value)
            };
        }

        return {
            ...input,
            value: state[input.id as keyof typeof state] as any,
            onChange: (e: any) => updateField(input.id as any, typeof e === 'string' ? e : e.target.value)
        };
    });

    return (
        <div className='bg-white w-full max-h-max rounded-lg'>
            <div className='w-full h-full'>
                <div className='flex gap-3'>
                    <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                        <h1 className='font-[500] text-lg'>Datos Propiedad</h1>
                        <p className='text-md text-gray-500'>Define la información principal que verán los clientes.</p>
                        <div className='mt-4'><DynamicInputs inputs={inputs} withBgWhite={true} /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDataProperty