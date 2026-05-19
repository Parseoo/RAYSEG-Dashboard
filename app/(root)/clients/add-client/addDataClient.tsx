"use client"

import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { useClient } from '../clientContext';

export const AddDataClient = () => {
    const { state, updateField, taxpayerTypes, statusTypes, segmentTypes } = useClient();

    // Map taxpayer types to select options
    const taxpayerOptions = taxpayerTypes.map(item => ({
        label: item.name,
        value: item.name
    }));

    // Map status types to select options
    const statusOptions = statusTypes.map(item => ({
        label: item.name,
        value: (item.value || item.name).toLowerCase() // Common pattern to use lowercase for value if possible
    }));

    // Map segment types to select options
    const segmentOptions = segmentTypes.map(item => ({
        label: item.name,
        value: (item.value || item.name).toLowerCase()
    }));
    
    // Configuración de los inputs
    const inputs: InputFieldConfig[] = [
        { type: 'text', id: 'nombre', label: 'Nombre completo / Razón social', placeholder: 'Ej: Juan Pérez o Grupo Inmobiliario SA de CV', group: 1 },
        {
            type: 'select', 
            id: 'persona_tipo', 
            label: 'Tipo de contribuyente', 
            placeholder: 'Seleccione tipo de contribuyente', 
            group: 2, 
            options: taxpayerOptions
        },
        { type: 'text', id: 'identificacion_fiscal', label: 'Identificación Fiscal', placeholder: 'RFC / CURP', group: 2 },
        {
            type: 'select', 
            id: 'estatus', 
            label: 'Estatus del cliente', 
            placeholder: 'Seleccione un estatus', 
            group: 3, 
            options: statusOptions
        },
        {
            type: 'select', 
            id: 'tipo_cliente', 
            label: 'Tipo de cliente', 
            placeholder: 'Seleccione un tipo de cliente', 
            group: 3, 
            options: segmentOptions
        },
    ];
    
    const mappedInputs = inputs.map(input => ({
        ...input,
        value: (state as any)[input.id] || '',
        onChange: (e: any) => updateField(input.id, typeof e === 'string' ? e : e.target.value)
    }));

    return (
        <div className='bg-white w-full max-h-max rounded-lg'>
            <div className='w-full h-full'>
                <div className='flex gap-3'>
                    <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                        <h1 className='font-[500] text-lg'>Datos básicos</h1>
                        <p className='text-md text-gray-500'>Identificación principal del cliente y tipo de relación.</p>
                        <div className='mt-4'>
                            <DynamicInputs inputs={mappedInputs} withBgWhite={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDataClient