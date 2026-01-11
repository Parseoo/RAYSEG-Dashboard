import { InputFieldConfig } from "@/components/ui/Input";

export const inputsProfile: InputFieldConfig[] = [
    {
        type: 'text',
        id: 'name',
        label: 'Nombre completo',
        placeholder: 'Nombre del agente',
        group: 1
    },
    {
        type: 'text',
        id: 'title',
        label: 'Puesto',
        placeholder: 'Asesor Inmobiliario',
        group: 1
    },
    {
        type: 'tel',
        id: 'phone',
        label: 'Teléfono',
        placeholder: 'Asesor Inmobiliario',
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
        type: 'textarea',
        id: 'description',
        label: 'Descripción corta (firma para la web)',
        placeholder: 'Asesor dedicado a acompañar a familias e inversionistas en la compra, venta y renta de inmuebles.',
        group: 3
    }
];

export const inputsAccount: InputFieldConfig[] = [
    {
        type: 'email',
        id: 'correo',
        label: 'Correo de acceso',
        placeholder: 'agente@rayseg.com',
        group: 1
    },
    {
        type: 'text',
        id: 'username',
        label: 'Usuario',
        placeholder: 'rayseg.agente',
        group: 1
    },
];

