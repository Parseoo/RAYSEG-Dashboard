import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { useClient } from '../clientContext';

export const AddNotesClient = () => {
    const { state, updateField, clientOriginTypes, leadSourceTypes } = useClient();

    let catalog: any[] = [];
    if (clientOriginTypes && clientOriginTypes.length > 0) {
        catalog = clientOriginTypes;
    } else if (leadSourceTypes && leadSourceTypes.length > 0) {
        catalog = leadSourceTypes;
    }

    const leadSourceOptions = catalog
        .map((item: any) => {
            const label = item.name || item.label || item.value || (typeof item === 'string' ? item : '');
            return label ? { label: String(label), value: String(label) } : null;
        })
        .filter(Boolean) as { label: string; value: string }[];

    const isOtro = state.lead_source?.toLowerCase() === 'otro';

    // Configuración de los inputs
    const inputs: InputFieldConfig[] = [
        {
            type: 'select',
            id: 'lead_source',
            label: 'Origen del prospecto',
            placeholder: 'Seleccione una opción',
            group: 1,
            options: leadSourceOptions
        }
    ];

    if (isOtro) {
        inputs.push({
            type: 'text',
            id: 'other_source',
            label: 'Otra fuente',
            placeholder: 'Especifique otra fuente del prospecto',
            group: 1
        });
    }

    inputs.push({
        type: 'textarea',
        id: 'internal_notes',
        label: 'Notas internas',
        placeholder: 'Escribe aquí las notas internas del cliente...',
        group: 2
    });

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
