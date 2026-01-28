import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';

// Configuración de los inputs
const inputs: InputFieldConfig[] = [
    {
        type: 'select',
        id: 'interes',
        label: 'Interés principal',
        placeholder: 'Seleccione una opción',
        group: 1,
        options: [
            { label: 'Compra', value: 'compra' },
            { label: 'Venta', value: 'venta' },
            { label: 'Renta', value: 'renta' },
        ]
    },
    {
        type: 'select',
        id: 'tipo_propiedad',
        label: 'Tipo de propiedad objetivo',
        placeholder: 'Seleccione un tipo',
        group: 1,
        options: [
            { label: 'Departamento', value: 'departamento' },
            { label: 'Casa', value: 'casa' },
        ]
    },

    // Presupuesto
    { 
        type: 'number', 
        id: 'presupuesto_min', 
        label: 'Presupuesto mínimo', 
        placeholder: 'Ej: 1,000,000', 
        group: 2 
    },
    { 
        type: 'number', 
        id: 'presupuesto_max', 
        label: 'Presupuesto máximo', 
        placeholder: 'Ej: 3,500,000', 
        group: 2 
    },
    {
        type: 'text',
        id: 'recamaras',
        label: 'Recámaras',
        placeholder: 'Ej: 2 a 4 recamaras',
        group: 3
    },

    // Baños
    { 
        type: 'number', 
        id: 'banos', 
        label: 'Baños', 
        placeholder: 'Ej: 2', 
        group: 3 
    },

    // Estacionamientos
    { 
        type: 'number', 
        id: 'estacionamientos', 
        label: 'Estacionamientos', 
        placeholder: 'Ej: 1', 
        group: 3 
    },

    // Superficie construida
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
    },

    // Superficie de terreno
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
    },

    // Forma de pago
    {
        type: 'select',
        id: 'forma_pago',
        label: 'Forma de pago',
        placeholder: 'Seleccione una opción',
        group: 6,
        options: [
            { label: 'Contado', value: 'contado' },
            { label: 'Crédito bancario', value: 'credito_bancario' },
            { label: 'Infonavit', value: 'infonavit' },
            { label: 'Fovissste', value: 'fovissste' },
            { label: 'Cofinavit', value: 'cofinavit' },
            { label: 'Empresarial', value: 'empresarial' },
        ]
    },
    {
        type: 'text',
        id: 'fecha_tiempo_compra_renta',
        label: 'Tiempo estimado para compra/renta',
        placeholder: 'Ej: 1 mes, 3 meses, 6 meses',
        group: 6
    }
];


export const AddPreferencesClient = () => {
    return (
        <>
            <div className='bg-white w-full max-h-max rounded-lg'>
                <div className='w-full h-full'>
                    <div className='flex gap-3'>
                        <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                            <h1 className='font-[500] text-lg'>Preferencias de operación</h1>
                            <p className='text-md text-gray-500 mt-2'>Configura que busca o que ofrece este cliente en el mercado inmobiliario.</p>
                            <div className='mt-4'>
                                <DynamicInputs inputs={inputs} withBgWhite={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddPreferencesClient