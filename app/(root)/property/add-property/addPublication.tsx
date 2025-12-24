"use client"

import React, { useState } from 'react';
import { DynamicInputs } from '@/components/ui/Input';
import { Star } from 'lucide-react';
import { inputsPublicationProperty } from '../inputConfig';

export const AddPublicationProperty = () => {
    const [checked, setChecked] = useState(false);

    return (
        <div className='bg-slate-100 w-full max-h-max rounded-lg p-5 mb-9'>
            <h1 className='font-[500] text-lg'>Publicación</h1>
            <p className='text-md text-gray-500'>Estatus de la publicación y descripción</p>
            <div className='mt-4'>
                <DynamicInputs inputs={inputsPublicationProperty} withBgWhite={true} />
            </div>
            <button onClick={() => setChecked(!checked)} className='p-1.5 bg-white rounded-md transition-colors mt-3'>
                <Star
                    size={16}
                    className={checked ? 'text-amber-400' : 'text-amber-400'}
                    fill={checked ? '#fbbf24' : 'none'}
                />
            </button> <span className='text-sm'>Propiedad destacada</span>
            <p className='text-xs text-gray-500 ml-8'>Aparecera en la seccion principal de la web.</p>
        </div>
    )
}