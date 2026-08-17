"use client"

import { DynamicInputs } from '@/components/ui/Input';
import { Star } from 'lucide-react';
import { inputsPublicationProperty } from '../inputConfig';

import { useProperty } from '../propertyContext';

export const AddPublicationProperty = ({ isEdit = false }: { isEdit?: boolean }) => {
    const { state, updateField, publicationStatusCatalog } = useProperty();

    const filteredInputs = isEdit 
        ? inputsPublicationProperty 
        : inputsPublicationProperty.filter(input => input.id !== 'status_publication');

    const statusPubliProperty = filteredInputs.map(input => {
        const dynamicStatusCatalog = publicationStatusCatalog || [];
        if (input.id === 'status_publication' && dynamicStatusCatalog.length > 0) {
            return {
                ...input,
                options: dynamicStatusCatalog.map(item => ({
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
        <div className='w-full max-h-max rounded-lg p-5 mb-9 border'>
            <h1 className='font-[500] text-lg'>Configuración de la publicación</h1>
            <p className='text-md text-gray-500'>Estatus de la publicación y descripción</p>
            <div className='mt-4'><DynamicInputs inputs={statusPubliProperty} withBgWhite={true} /></div>
            <button type='button' onClick={() => updateField('is_featured', !state.is_featured)} className='p-1.5 bg-white rounded-md transition-colors mt-3'>
                <Star size={16} className='text-amber-400' fill={state.is_featured ? '#fbbf24' : 'none'} />
            </button> <span className='text-sm'>Propiedad destacada</span>
            <p className='text-xs text-gray-500 ml-8'>Destaca esta propiedad para mostrarla en la página principal del sitio web.</p>
        </div>
    )
}