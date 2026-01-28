"use client"

import React from 'react';
import { DynamicInputs } from '@/components/ui/Input';
import { inputsAddContact } from '@/app/(root)/agents/add-agent/inputs.data';

export const AddContactAgent = () => {
    return (
        <>
            <div className='bg-white w-full max-h-max rounded-lg'>
                <div className='w-full h-full'>
                    <div className='flex gap-3'>
                        <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                            <h1 className='font-[500] text-lg'>Datos de Contacto</h1>
                            <p className='text-md text-gray-500 mt-2'>Datos para comunicación y envió de notificaciones.</p>
                            <div className='mt-4 flex flex-col gap-4'>
                                <DynamicInputs inputs={inputsAddContact} withBgWhite={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddContactAgent;