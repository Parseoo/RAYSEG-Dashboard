"use client"

import React from 'react';
import { DynamicInputs } from '@/components/ui/Input';
import { inputsAddNotes } from '@/app/(root)/agents/add-agent/inputs.data';

export const AddNotesAgent = () => {
    return (
        <>
            <div className='w-full max-h-max rounded-lg p-5 mb-9 border'>
                <h1 className='font-[500] text-lg'>Relación y notas internas</h1>
                <p className='text-md text-gray-500'>Información visible solo para el equipo interno.</p>
                <div className='mt-4'>
                    <DynamicInputs inputs={inputsAddNotes} withBgWhite={true} />
                </div>
            </div>
        </>
    )
}

export default AddNotesAgent;