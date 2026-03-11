"use client"

import React from 'react';
import { DynamicInputs } from '@/components/ui/Input';
import { inputsDataProperty } from '../inputConfig';


import { useProperty } from '../propertyContext';

export const AddDataProperty = () => {
    const { state, updateField } = useProperty();
    const inputs = inputsDataProperty.map(input => ({
        ...input,
        value: state[input.id as keyof typeof state] as any,
        onChange: (e: any) => updateField(input.id as any, typeof e === 'string' ? e : e.target.value)
    }));

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