import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { useClient } from '../clientContext';

export const AddPreferencesClient = () => {
    const { state, updateField, mainInterestTypes, targetPropertyTypes, paymentMethodTypes } = useClient();

    const interestOptions = mainInterestTypes.map(item => ({
        label: item.name,
        value: (item.value || item.name).toLowerCase()
    }));

    const propertyTypeOptions = targetPropertyTypes.map(item => ({
        label: item.name,
        value: (item.value || item.name).toLowerCase()
    }));

    const paymentOptions = paymentMethodTypes.map(item => ({
        label: item.name,
        value: (item.value || item.name).toLowerCase()
    }));

    const isRenta = state.interes_principal === 'renta' || state.interes_principal === 'quiero_rentar';
    const isVenta = state.interes_principal === 'venta' || state.interes_principal === 'quiero_vender';
    const isCompra = state.interes_principal === 'compra' || state.interes_principal === 'quiero_comprar';

    // Construcción dinámica de inputs según el interés
    const baseInputs: InputFieldConfig[] = [
        {
            type: 'select',
            id: 'interes_principal',
            label: 'Interés principal',
            placeholder: 'Seleccione una opción',
            group: 1,
            options: interestOptions
        }
    ];

    let specificInputs: InputFieldConfig[] = [];

    if (state.interes_principal) {
        specificInputs.push({
            type: 'select',
            id: 'tipo_propiedad_objetivo',
            label: 'Tipo de propiedad objetivo',
            placeholder: 'Seleccione un tipo',
            group: 1,
            options: propertyTypeOptions
        });

        // Presupuesto / Precio esperado
        specificInputs.push(
            { 
                type: 'number', 
                id: 'presupuesto_min', 
                label: isVenta || isRenta ? 'Precio mínimo esperado' : 'Presupuesto mínimo', 
                placeholder: 'Ej: 1,000,000', 
                group: 2 
            },
            { 
                type: 'number', 
                id: 'presupuesto_max', 
                label: isVenta || isRenta ? 'Precio máximo esperado' : 'Presupuesto máximo', 
                placeholder: 'Ej: 3,500,000', 
                group: 2 
            }
        );

        // Características de la propiedad
        specificInputs.push(
            {
                type: 'number',
                id: 'recamaras',
                label: 'Recámaras',
                placeholder: 'Ej: 2',
                group: 3
            },
            { 
                type: 'number', 
                id: 'banos', 
                label: 'Baños', 
                placeholder: 'Ej: 2', 
                group: 3 
            },
            { 
                type: 'number', 
                id: 'estacionamientos', 
                label: 'Estacionamientos', 
                placeholder: 'Ej: 1', 
                group: 3 
            }
        );

        // Condiciones de operación (solo para compra)
        if (isCompra) {
            specificInputs.push({
                type: 'select',
                id: 'forma_pago',
                label: 'Forma de pago',
                placeholder: 'Seleccione una opción',
                group: 6,
                options: paymentOptions
            });
        }

        // Tiempo estimado
        specificInputs.push({
            type: 'text',
            id: 'tiempo_estimado',
            label: isVenta ? 'Tiempo estimado para vender' : (isRenta ? 'Tiempo estimado para rentar' : 'Tiempo estimado para compra/renta'),
            placeholder: 'Ej: 1 mes, 3 meses, 6 meses',
            group: 6
        });
    }

    const inputs = [...baseInputs, ...specificInputs];

    const numericFields = ['presupuesto_min', 'presupuesto_max', 'recamaras', 'banos', 'estacionamientos'];

    const mappedInputs = inputs.map(input => ({
        ...input,
        value: (state as any)[input.id] || '',
        onChange: (e: any) => {
            const val = typeof e === 'string' ? e : e.target.value;
            updateField(input.id, numericFields.includes(input.id) ? (parseFloat(val) || 0) : val);
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