import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { useClient } from '../clientContext';

export const AddNotesClient = () => {
    const { state, updateField, leadSourceTypes } = useClient();

    const leadSourceOptions = leadSourceTypes.map(item => ({
        label: item.name,
        value: (item.value || item.name).toLowerCase()
    }));

    // Configuración de los inputs
    const inputs: InputFieldConfig[] = [
        { 
            type: 'select', 
            id: 'origen_prospecto', 
            label: 'Origen del prospecto', 
            placeholder: 'Seleccione una opción', 
            group: 1, 
            options: leadSourceOptions
        },
        /* { 
            type: 'select', 
            id: 'agente_id', 
            label: 'Responsable', 
            placeholder: 'Seleccionar agente', 
            group: 1, 
            options: [
                { label: 'Agente 1', value: '1' },
                { label: 'Agente 2', value: '2' },
            ]
        }, */
        { type: 'textarea', id: 'notas_internas', label: 'Notas internas', placeholder: 'Escribe aquí las notas internas del cliente...', group: 2 },
    ];

    const mappedInputs = inputs.map(input => ({
        ...input,
        value: (state as any)[input.id] || '',
        onChange: (e: any) => {
            const val = typeof e === 'string' ? e : e.target.value;
            updateField(input.id, val);
        }
    }));

    return (
        <div className='w-full max-h-max rounded-lg p-5 mb-9 border'>
            <h1 className='font-[500] text-lg'>Relación y notas internas</h1>
            <p className='text-md text-gray-500'>Información para tu equipo comercial y de seguimiento.</p>
            <div className='mt-4'>
                <DynamicInputs inputs={mappedInputs} withBgWhite={true} />
            </div>
        </div>
    )
}

export default AddNotesClient;