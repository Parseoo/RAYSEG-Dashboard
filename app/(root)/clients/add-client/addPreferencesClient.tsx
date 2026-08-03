import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { useClient } from '../clientContext';
import { normalizeInterest } from '@/lib/utils/catalog';

export const AddPreferencesClient = () => {
    const { state, updateField, mainInterestTypes, targetPropertyTypes, paymentMethodTypes } = useClient();

    const defaultInterestOptions = [
        { label: 'Compra', value: 'compra' },
        { label: 'Renta', value: 'renta' },
        { label: 'Venta', value: 'venta' }
    ];

    const interestOptions = mainInterestTypes && mainInterestTypes.length > 0
        ? mainInterestTypes.map(item => ({
            label: item.name,
            value: normalizeInterest(item.value || item.name) || item.name
        }))
        : defaultInterestOptions;

    const propertyTypeOptions = targetPropertyTypes.map(item => ({
        label: item.name,
        value: item.value || item.name
    }));

    const paymentOptions = paymentMethodTypes.map(item => ({
        label: item.name,
        value: item.name
    }));

    const currentInterest = normalizeInterest(state.main_interest);
    const isRenta = currentInterest === 'renta' || currentInterest === 'quiero_rentar' || currentInterest === 'rent';
    const isVenta = currentInterest === 'venta' || currentInterest === 'quiero_vender' || currentInterest === 'sale';
    const isCompra = currentInterest === 'compra' || currentInterest === 'quiero_comprar' || currentInterest === 'buy';

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

    let specificInputs: InputFieldConfig[] = [];

    if (currentInterest) {
        // Grupo 2: Presupuesto
        specificInputs.push(
            {
                type: 'number',
                id: 'budget_min',
                label: isVenta || isRenta ? 'Precio mínimo' : 'Presupuesto mínimo',
                placeholder: 'Ej: 1,000,000',
                group: 2
            },
            {
                type: 'number',
                id: 'budget_max',
                label: isVenta || isRenta ? 'Precio máximo' : 'Presupuesto máximo',
                placeholder: 'Ej: 3,500,000',
                group: 2
            }
        );

        // Grupo 3: Características
        specificInputs.push(
            {
                type: 'number',
                id: 'bedrooms',
                label: 'Recámaras',
                placeholder: 'Ej: 2',
                group: 3
            },
            {
                type: 'number',
                id: 'bathrooms',
                label: 'Baños',
                placeholder: 'Ej: 2',
                group: 3
            },
            {
                type: 'number',
                id: 'parking_spaces',
                label: 'Estacionamientos',
                placeholder: 'Ej: 1',
                group: 3
            }
        );

        // Grupo 4: Tiempo estimado
        specificInputs.push({
            type: 'text',
            id: 'estimated_time',
            label: isVenta ? 'Tiempo estimado para vender' : (isRenta ? 'Tiempo estimado para rentar' : 'Tiempo estimado'),
            placeholder: 'Ej: 1 mes, 3 meses',
            group: 4
        });

        // Grupo 5: Forma de pago (solo para compra)
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
    }

    const allInputs = [...baseInputs, ...specificInputs];

    const numericFields = ['budget_min', 'budget_max', 'bedrooms', 'bathrooms', 'parking_spaces'];

    const mappedInputs = allInputs.map(input => ({
        ...input,
        value: input.id === 'main_interest' ? currentInterest : ((state as any)[input.id] || ''),
        onChange: (e: any) => {
            const val = typeof e === 'string' ? e : e.target.value;
            const finalVal = input.id === 'main_interest' ? normalizeInterest(val) : val;
            updateField(input.id, numericFields.includes(input.id) ? (parseFloat(finalVal) || 0) : finalVal);
        }
    }));

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
