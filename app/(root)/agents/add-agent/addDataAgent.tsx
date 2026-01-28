"use client"

import React from 'react';
import { DynamicInputs } from '@/components/ui/Input';
import { inputsAddData } from '@/app/(root)/agents/add-agent/inputs.data';

export const AddDataAgent = () => {
    return (
        <>
            <div className='bg-white w-full max-h-max rounded-lg'>
                <div className='w-full h-full'>
                    <div className='flex gap-3'>
                        <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                            <h1 className='font-[500] text-lg'>Datos básicos</h1>
                            <p className='text-md text-gray-500'>Identificación principal del agente y información fiscal.</p>
                            <div className='mt-4'>
                                <DynamicInputs inputs={inputsAddData} withBgWhite={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddDataAgent