"use client"

import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { ProfileImageUpload } from '@/components/ui/ProfileImageUpload';
import { useClient } from '../clientContext';

export const AddDataClient = () => {
    const { state, updateField, taxpayerTypes, segmentTypes, statusTypes, agents, errors } = useClient();

    // Map taxpayer types to select options
    const taxpayerOptions = taxpayerTypes.map(item => ({
        label: item.name,
        value: item.name
    }));

    // Map segment types to select options
    const segmentOptions = segmentTypes.map(item => ({
        label: item.name,
        value: item.name
    }));

    // Map status types to select options
    const statusOptions = statusTypes.map(item => ({
        label: item.name,
        value: item.name
    }));

    // Configuración de los inputs
    const inputs: InputFieldConfig[] = [
        { type: 'text', id: 'name', label: 'Nombre o Razón Social', placeholder: 'Juan Pérez López o Inmobiliaria Horizonte S.A. de C.V.', group: 1, required: true },
        {
            type: 'select',
            id: 'agent_id',
            label: 'Agente asignado',
            placeholder: 'Selecciona el agente',
            group: 1,
            options: agents
        },
        {
            type: 'select',
            id: 'taxpayer_type',
            label: 'Tipo de contribuyente',
            placeholder: 'Selecciona el tipo de contribuyente',
            group: 2,
            options: taxpayerOptions
        },
        { type: 'text', id: 'tax_id', label: 'RFC', placeholder: 'PELJ900101ABC', group: 2 },
        {
            type: 'select',
            id: 'client_type',
            label: 'Tipo de cliente',
            placeholder: 'Selecciona el tipo de cliente',
            group: 3,
            options: segmentOptions,
            required: true
        },
        {
            type: 'select',
            id: 'client_status',
            label: 'Estatus del cliente',
            placeholder: 'Selecciona el estatus del cliente',
            group: 3,
            options: statusOptions,
            required: true
        },
    ];

    const mappedInputs = inputs.map(input => ({
        ...input,
        value: (state as any)[input.id] || '',
        onChange: (e: any) => {
            const val = typeof e === 'string' ? e : e.target.value;
            updateField(input.id, val);
        },
        error: errors[input.id]
    }));

    const handleImageChange = (file: File) => {
        const objectUrl = URL.createObjectURL(file);
        updateField('profile_photo', objectUrl);
    };

    return (
        <div className='bg-white w-full max-h-max rounded-lg'>
            <div className='w-full h-full'>
                <div className='flex gap-3'>
                    <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                        <h1 className='font-[500] text-lg'>Datos básicos</h1>
                        <p className='text-md text-gray-500'>Identificación principal del cliente y tipo de relación.</p>

                        <div className='mt-6 mb-4'>
                            <ProfileImageUpload
                                currentImage={state.profile_photo}
                                onImageChange={handleImageChange}
                            />
                        </div>

                        <div className='mt-4'>
                            <DynamicInputs inputs={mappedInputs} withBgWhite={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDataClient;
