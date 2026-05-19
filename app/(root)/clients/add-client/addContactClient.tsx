"use client"

import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { useClient } from '../clientContext';

export const AddContactClient = () => {
    const { state, updateField, updateAddressField, contactPreferenceTypes } = useClient();

    const contactOptions = contactPreferenceTypes.map(item => ({
        label: item.name,
        value: (item.value || item.name).toLowerCase()
    }));

    // Configuración de los inputs
    const inputs: InputFieldConfig[] = [
        { 
            type: 'email',
            id: 'email',
            label: 'Correo electrónico',
            placeholder: 'correo@ejemplo.com',
            group: 1 
        },
        { 
            type: 'tel',
            id: 'telefono',
            label: 'Teléfono',
            placeholder: '5512345678',
            group: 1 
        },
        { 
            type: 'tel',
            id: 'whatsapp',
            label: 'WhatsApp',
            placeholder: '5512345678',
            group: 2 
        },
        {
            type: 'select',
            id: 'medio_contacto_preferido',
            label: 'Medio de contacto preferido',
            placeholder: 'Seleccione un medio',
            group: 2,
            options: contactOptions
        },
        {
            type: 'select',
            id: 'estado',
            label: 'Estado',
            placeholder: 'Seleccione un estado',
            group: 3,
            options: [
                { value: 'cdmx', label: 'Ciudad de México' },
                { value: 'edomex', label: 'Estado de México' },
            ]
        },
        {
            type: 'select',
            id: 'ciudad',
            label: 'Ciudad',
            placeholder: 'Seleccione una ciudad',
            group: 3,
            options: [
                { value: 'cdmx', label: 'Ciudad de México' },
                { value: 'guadalajara', label: 'Guadalajara' },
            ]
        },
        { 
            type: 'text',
            id: 'colonia',
            label: 'Colonia / Zona',
            placeholder: 'Ej: Centro, Del Valle, Roma Norte',
            group: 4 
        },
        { 
            type: 'number',
            id: 'codigo_postal',
            label: 'Código Postal (opcional)',
            placeholder: 'Ej: 01000',
            group: 4 
        },
        { 
            type: 'text',
            id: 'completa',
            label: 'Dirección (opcional)',
            placeholder: 'Ej: Calle 123, Interior 4B',
            group: 5 
        },
    ];

    const addressFields = ['estado', 'ciudad', 'colonia', 'codigo_postal', 'completa'];

    const mappedInputs = inputs.map(input => ({
        ...input,
        value: addressFields.includes(input.id) 
            ? (state.direccion as any)[input.id] || ''
            : (state as any)[input.id] || '',
        onChange: (e: any) => {
            const val = typeof e === 'string' ? e : e.target.value;
            if (addressFields.includes(input.id)) {
                updateAddressField(input.id as any, val);
            } else {
                updateField(input.id, val);
            }
        }
    }));

    return (
        <div className='bg-white w-full max-h-max rounded-lg'>
            <div className='w-full h-full'>
                <div className='flex gap-3'>
                    <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                        <h1 className='font-[500] text-lg'>Contacto y Ubicación</h1>
                        <p className='text-md text-gray-500'>Datos de contacto principales y zona de interés dentro de la ciudad.</p>
                        <div className='mt-4 flex flex-col gap-4'>
                            <DynamicInputs inputs={mappedInputs} withBgWhite={true} />
                            <p className='text-md text-gray-500'>Útil para propietarios actuales, empresas o contratos ya firmados.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddContactClient;