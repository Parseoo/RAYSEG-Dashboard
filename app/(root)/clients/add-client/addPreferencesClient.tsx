import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { useClient } from '../clientContext';
import { normalizeInterest, resolveCatalogDisplayValue } from '@/lib/utils/catalog';

const NUMERIC_FIELDS = new Set(['budget_min', 'budget_max', 'bedrooms', 'bathrooms', 'parking_spaces']);

const getInterestFlags = (currentInterest: string) => {
    const isRenta = ['renta', 'quiero_rentar', 'rent'].includes(currentInterest);
    const isVenta = ['venta', 'quiero_vender', 'sale'].includes(currentInterest);
    const isCompra = ['compra', 'quiero_comprar', 'buy'].includes(currentInterest);
    return { isRenta, isVenta, isCompra };
};

const getSpecificInputs = (currentInterest: string, paymentOptions: any[]) => {
    if (!currentInterest) return [];

    const { isRenta, isVenta, isCompra } = getInterestFlags(currentInterest);
    const specificInputs: InputFieldConfig[] = [];

    if (isCompra || isRenta) {
        specificInputs.push(
            { type: 'number', id: 'budget_min', label: isRenta ? 'Presupuesto mínimo mensual' : 'Presupuesto mínimo', placeholder: 'Ej: 1,000,000', group: 2 },
            { type: 'number', id: 'budget_max', label: isRenta ? 'Presupuesto máximo mensual' : 'Presupuesto máximo', placeholder: 'Ej: 3,500,000', group: 2 },
            { type: 'number', id: 'bedrooms', label: 'Recámaras', placeholder: 'Ej: 2', group: 3 },
            { type: 'number', id: 'bathrooms', label: 'Baños', placeholder: 'Ej: 2', group: 3 },
            { type: 'number', id: 'parking_spaces', label: 'Estacionamientos', placeholder: 'Ej: 1', group: 3 }
        );
    }

    let timeLabel = 'Plazo estimado para comprar';
    if (isVenta) timeLabel = 'Plazo estimado para vender';
    else if (isRenta) timeLabel = 'Plazo estimado para rentar';

    specificInputs.push({
        type: 'text',
        id: 'estimated_time',
        label: timeLabel,
        placeholder: 'Ej: Urgente, 1 mes, 3 a 6 meses',
        group: 4
    });

    if (isCompra) {
        specificInputs.push({
            type: 'select',
            id: 'payment_method',
            label: 'Forma de pago',
            placeholder: 'Seleccione una opción',
            group: 5,
            options: paymentOptions
        });
    }

    return specificInputs;
};

export const AddPreferencesClient = () => {
    const { state, updateField, mainInterestTypes, targetPropertyTypes, paymentMethodTypes } = useClient();

    const interestOptions = (mainInterestTypes || []).map(item => ({
        label: item.name,
        value: normalizeInterest(item.name)
    }));

    const propertyTypeOptions = targetPropertyTypes.map(item => ({
        label: item.name,
        value: item.value || item.name
    }));

    const paymentOptions = paymentMethodTypes.map(item => ({
        label: item.name,
        value: item.name
    }));

    const resolvedInterestName = resolveCatalogDisplayValue(state.main_interest, mainInterestTypes);
    const currentInterest = normalizeInterest(resolvedInterestName || state.main_interest);

    // Grupo 1: Interés principal + Tipo de propiedad
    const baseInputs: InputFieldConfig[] = [
        {
            type: 'select',
            id: 'main_interest',
            label: 'Interés principal',
            placeholder: 'Seleccione una opción',
            group: 1,
            options: interestOptions
        },
        {
            type: 'select',
            id: 'target_property_type',
            label: 'Tipo de propiedad objetivo',
            placeholder: 'Seleccione un tipo',
            group: 1,
            options: propertyTypeOptions
        }
    ];

    const specificInputs = getSpecificInputs(currentInterest, paymentOptions);
    const allInputs = [...baseInputs, ...specificInputs];

    const mappedInputs = allInputs.map(input => {
        let value = (state as any)[input.id] || '';
        if (input.id === 'main_interest') value = currentInterest;

        return {
            ...input,
            value,
            onChange: (e: any) => {
                const val = typeof e === 'string' ? e : e.target.value;
                const finalVal = input.id === 'main_interest' ? normalizeInterest(val) : val;
                const outVal = NUMERIC_FIELDS.has(input.id) ? (Number.parseFloat(finalVal) || 0) : finalVal;
                updateField(input.id, outVal);
            }
        };
    });

    return (
        <div className='bg-white w-full max-h-max rounded-lg'>
            <div className='w-full h-full'>
                <div className='flex gap-3'>
                    <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                        <h1 className='font-[500] text-lg'>Preferencias de operación</h1>
                        <p className='text-md text-gray-500'>Configura que busca o que ofrece este cliente en el mercado inmobiliario.</p>
                        <div className='mt-4'>
                            <DynamicInputs inputs={mappedInputs} withBgWhite={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPreferencesClient
