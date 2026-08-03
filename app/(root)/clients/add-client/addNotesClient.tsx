import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { useClient } from '../clientContext';
import { useMemo } from 'react';

export const AddNotesClient = () => {
    const { state, updateField, clientOriginTypes, leadSourceTypes } = useClient();

    const leadSourceOptions = useMemo(() => {
        const catalog = (clientOriginTypes && clientOriginTypes.length > 0)
            ? clientOriginTypes
            : (leadSourceTypes && leadSourceTypes.length > 0)
                ? leadSourceTypes
                : [
                    { name: 'Facebook' },
                    { name: 'Instagram' },
                    { name: 'Sitio Web' },
                    { name: 'Recomendación' },
                    { name: 'Llamada' },
                    { name: 'WhatsApp' },
                    { name: 'Portal Inmobiliario' },
                    { name: 'Otro' }
                ];
        return catalog
            .map((item: any) => {
                const label = item.name || item.label || item.value || (typeof item === 'string' ? item : '');
                return label ? { label: String(label), value: String(label) } : null;
            })
            .filter(Boolean) as { label: string; value: string }[];
    }, [clientOriginTypes, leadSourceTypes]);

    // Configuración de los inputs
    const baseInputs: InputFieldConfig[] = useMemo(() => [
        {
            type: 'select',
            id: 'lead_source',
            label: 'Origen del prospecto',
            placeholder: 'Seleccione una opción',
            group: 1,
            options: leadSourceOptions
        },
        { type: 'textarea', id: 'internal_notes', label: 'Notas internas', placeholder: 'Escribe aquí las notas internas del cliente...', group: 2 },
    ], [leadSourceOptions]);

    // Recalcular inputs cuando lead_source cambie
    const inputs = useMemo(() => {
        const isOtro = state.lead_source?.toLowerCase() === 'otro';
        const otherSourceInput: InputFieldConfig | null = isOtro ? {
            type: 'text',
            id: 'other_source',
            label: 'Otra fuente',
            placeholder: 'Especifique otra fuente del prospecto',
            group: 1
        } : null;

        return otherSourceInput ? [...baseInputs.slice(0, 1), otherSourceInput, ...baseInputs.slice(1)] : baseInputs;
    }, [state.lead_source]);

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
