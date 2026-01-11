import { InputFieldConfig } from "@/components/ui/Input";

// Configuración de los inputs
export const inputsAddData: InputFieldConfig[] = [
    {
        type: 'text',
        id: 'nombre',
        label: 'Nombre completo',
        placeholder: 'Ej: Juan Pérez',
        group: 1
    },
    {
        type: 'text',
        id: 'curp',
        label: 'CURP',
        placeholder: 'CURP',
        group: 2
    },
    {
        type: 'text',
        id: 'rfc',
        label: 'RFC',
        placeholder: 'RFC',
        group: 2
    },
    {
        type: 'date',
        id: 'fecha_nacimiento',
        label: 'Fecha de nacimiento',
        placeholder: 'DD/MM/AAAA',
        group: 3
    },
    {
        type: 'text',
        id: 'estado_civil',
        label: 'Estado Civil',
        placeholder: 'Ej: Soltera',
        group: 3
    }
];

export const inputsAddContact: InputFieldConfig[] = [
    {
        type: 'email',
        id: 'correo',
        label: 'Correo electrónico',
        placeholder: 'agente@inmobiliaria.com',
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
        id: 'medioPreferido',
        label: 'Medio de contacto preferido',
        placeholder: 'Seleccione un medio',
        group: 2,
        options: [
            { value: 'correo', label: 'Correo electrónico' },
            { value: 'telefono', label: 'Teléfono' },
            { value: 'whatsapp', label: 'WhatsApp' },
        ]
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
        label: 'Código Postal',
        placeholder: 'Ej: 01000',
        group: 4
    },
    {
        type: 'text',
        id: 'direccion',
        label: 'Dirección',
        placeholder: 'Ej: Calle 123, Interior 4B',
        group: 5
    },
];

export const inputsAddEmployment: InputFieldConfig[] = [
    {
        type: 'select',
        id: 'rol',
        label: 'Rol',
        placeholder: 'Seleccione una opción',
        group: 1,
        options: [
            { label: 'Agente Inmobiliario', value: 'compra' },
            { label: 'Asesor de Ventas', value: 'venta' },
            { label: 'Asesor de Renta', value: 'renta' },
            { label: 'Administrador/a', value: 'administrador' },
            { label: 'Gerente / Dueño', value: 'gerente' }
        ]
    },
    {
        type: 'select', id: 'estatus', label: 'Estatus', placeholder: 'Seleccionar estatus', group: 1, options: [
            { label: 'Activo', value: 'activo' },
            { label: 'Inactivo', value: 'inactivo' },
            { label: 'En capacitación', value: 'encapacitacion' }
        ]
    },
    {
        type: 'date',
        id: 'fecha_ingreso',
        label: 'Fecha de Ingreso',
        placeholder: 'DD/MM/AAAA',
        group: 2
    },
    {
        type: 'select',
        id: 'tipo_contratacion',
        label: 'Tipo de contratación',
        placeholder: 'Seleccione una opción',
        group: 2,
        options:
            [
                { label: 'Honorarios', value: 'honorarios' },
                { label: 'Nomina', value: 'nomina' },
                { label: 'Comisiones', value: 'comisiones' }
            ]
    },
    {
        type: 'number',
        id: 'porcentaje',
        label: 'Porcentaje de comisión',
        placeholder: 'Ej: 10%',
        group: 2
    },
];


export const inputsAddNotes: InputFieldConfig[] = [
    {
        type: 'textarea',
        id: 'notas_internas',
        label: 'Notas internas',
        placeholder: 'Notas sobre acuerdos, esquemas de comisión, restricciones de zona, desempeño historico, etc.',
        group: 2
    },
];