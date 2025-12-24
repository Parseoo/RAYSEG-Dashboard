"use client"

import React from 'react';
import { DynamicInputs } from '@/components/ui/Input';
import { inputsDataProperty } from '../inputConfig';


export const AddDataProperty = () => {
    return (
        <>
            <div className='bg-white w-full max-h-max rounded-lg'>
                <div className='w-full h-full'>
                    <div className='flex gap-3'>
                        <div className='bg-slate-100 w-full max-h-max rounded-lg p-5 mb-5'>
                            <h1 className='font-[500] text-lg'>Datos Propiedad</h1>
                            <p className='text-md text-gray-500'>Define la información principal que verán los clientes.</p>
                            <div className='mt-4'>
                                <DynamicInputs inputs={inputsDataProperty} withBgWhite={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddDataProperty