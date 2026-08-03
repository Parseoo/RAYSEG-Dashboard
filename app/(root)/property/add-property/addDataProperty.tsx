"use client"

import React, { useMemo } from 'react';
import { DynamicInputs } from '@/components/ui/Input';
import { inputsDataProperty } from '../inputConfig';
import { useProperty } from '../propertyContext';

export const AddDataProperty = () => {
    const { state, updateField, propertyTypes, operationCatalog, propertyStateCatalog, errors } = useProperty();

    const inputs = useMemo(() => inputsDataProperty.map(input => {
        if (input.id === 'property_type' && propertyTypes.length > 0) {
            return {
                ...input,
                options: propertyTypes.map((type) => ({
                    label: type.name,
                    value: type.name,
                })),
                value: state[input.id as keyof typeof state] as any,
                onChange: (e: any) => {
                    const val = typeof e === 'string' ? e : e.target.value;
                    updateField(input.id as any, input.type === 'number' || input.type === 'currency' ? Number(val) : val);
                },
                error: errors[input.id]
            };
        }

        if (input.id === 'operation_type' && operationCatalog.length > 0) {
            return {
                ...input,
                options: operationCatalog.map((op) => ({
                    label: op.name,
                    value: op.name,
                })),
                value: state[input.id as keyof typeof state] as any,
                onChange: (e: any) => {
                    const val = typeof e === 'string' ? e : e.target.value;
                    updateField(input.id as any, input.type === 'number' || input.type === 'currency' ? Number(val) : val);
                },
                error: errors[input.id]
            };
        }

        if (input.id === 'property_status' && propertyStateCatalog.length > 0) {
            return {
                ...input,
                options: propertyStateCatalog.map((item) => ({
                    label: item.name,
                    value: item.name,
                })),
                value: state[input.id as keyof typeof state] as any,
                onChange: (e: any) => {
                    const val = typeof e === 'string' ? e : e.target.value;
                    updateField(input.id as any, input.type === 'number' || input.type === 'currency' ? Number(val) : val);
                },
                error: errors[input.id]
            };
        }

        return {
            ...input,
            value: state[input.id as keyof typeof state] as any,
            onChange: (e: any) => {
                const val = typeof e === 'string' ? e : e.target.value;
                updateField(input.id as any, input.type === 'number' || input.type === 'currency' ? Number(val) : val);
            },
            error: errors[input.id]
        };
    }), [propertyTypes, operationCatalog, propertyStateCatalog, state, updateField, errors]);

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