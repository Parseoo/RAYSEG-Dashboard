import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { useClient } from '../../clients/clientContext';
import { normalizeInterest } from '@/lib/utils/catalog';

export const AddPreferencesClient = () => {

    const { state, updateField, mainInterestTypes, targetPropertyTypes, paymentMethodTypes } = useClient();

    const propertyTypeOptions = targetPropertyTypes.map(item => ({
        label: item.name,
        value: (item.value || item.name).toLowerCase()
    }));

    const currentInterest = normalizeInterest((state as any).interes || state.main_interest);
    const isRenta = currentInterest === 'renta' || currentInterest === 'quiero_rentar' || currentInterest === 'rent';
    const isVenta = currentInterest === 'venta' || currentInterest === 'quiero_vender' || currentInterest === 'sale';
    const isCompra = currentInterest === 'compra' || currentInterest === 'quiero_comprar' || currentInterest === 'buy';

    // Construcción dinámica de inputs según el interés
    const baseInputs: InputFieldConfig[] = [
        {
            type: 'select',
            id: 'interes',
            label: 'Interés principal',
            placeholder: 'Seleccione una opción',
            group: 1,
            options: []
        }
    ];

    let specificInputs: InputFieldConfig[] = [];

    if (currentInterest) {
        specificInputs.push({
            type: 'select',
            id: 'target_property_type',
            label: 'Tipo de propiedad objetivo',
            placeholder: 'Seleccione un tipo',
            group: 1,
            options: propertyTypeOptions
        });

        // Presupuesto
        specificInputs.push(
            { 
                type: 'number', 
                id: 'budget_min', 
                label: 'Presupuesto mínimo', 
                placeholder: 'Ej: 1,000,000', 
                group: 2 
            },
            { 
                type: 'number', 
                id: 'budget_max', 
                label: 'Presupuesto máximo', 
                placeholder: 'Ej: 3,500,000', 
                group: 2 
            }
        );

        // Características de la propiedad
        specificInputs.push(
            {
                type: 'text',
                id: 'bedrooms',
                label: 'Recámaras',
                placeholder: 'Ej: 2 a 4 recamaras',
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

        // Superficie construida
        specificInputs.push(
            { 
                type: 'number', 
                id: 'superficie_construida_min', 
                label: 'Superficie construida mínima (m²)', 
                placeholder: 'Ej: 50', 
                group: 4 
            },
            { 
                type: 'number', 
                id: 'superficie_construida_max', 
                label: 'Superficie construida máxima (m²)', 
                placeholder: 'Ej: 150', 
                group: 4 
            }
        );

        // Superficie de terreno
        specificInputs.push(
            { 
                type: 'number', 
                id: 'superficie_terreno_min', 
                label: 'Superficie de terreno mínima (m²)', 
                placeholder: 'Ej: 80', 
                group: 5 
            },
            { 
                type: 'number', 
                id: 'superficie_terreno_max', 
                label: 'Superficie de terreno máxima (m²)', 
                placeholder: 'Ej: 250', 
                group: 5 
            }
        );

        // Condiciones de operación
        if (currentInterest === 'compra' || currentInterest === 'quiero_comprar') {
            specificInputs.push({
                type: 'select',
                id: 'payment_method',
                label: 'Forma de pago',
                placeholder: 'Seleccione una opción',
                group: 6,
                options: []
            });
        }

    }

    const allInputs = [...baseInputs, ...specificInputs];

    const numericFields = ['presupuesto_min', 'presupuesto_max', 'banos', 'estacionamientos', 'superficie_construida_min', 'superficie_construida_max', 'superficie_terreno_min', 'superficie_terreno_max'];

    const mappedInputs = allInputs.map(input => ({
        ...input,
        value: (state as any)[input.id] || '',
        onChange: (e: any) => {
            const val = typeof e === 'string' ? e : e.target.value;
            updateField(input.id, numericFields.includes(input.id) ? (parseFloat(val) || 0) : val);
        }
    }));
    
    return (
        <>
            <div className='bg-white w-full max-h-max rounded-lg'>
                <div className='w-full h-full'>
                    <div className='flex gap-3'>
                        <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                            <h1 className='font-[500] text-lg'>Preferencias de operación</h1>
                            <p className='text-md text-gray-500 mt-2'>Configura que busca o que ofrece este cliente en el mercado inmobiliario.</p>
                            <div className='mt-4'>
                                <DynamicInputs inputs={mappedInputs} withBgWhite={true} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddPreferencesClient