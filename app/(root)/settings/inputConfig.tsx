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
        placeholder: '+52 1 234 567 8900',
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

export const inputsSecurity: InputFieldConfig[] = [
    {
        type: 'password',
        id: 'currentPassword',
        label: 'Contraseña actual',
        placeholder: '********',
        group: 1
    },
    {
        type: 'password',
        id: 'newPassword',
        label: 'Nueva contraseña',
        placeholder: '********',
        group: 1
    },
    {
        type: 'password',
        id: 'confirmNewPassword',
        label: 'Confirmar nueva contraseña',
        placeholder: '********',
        group: 1
    },
];

// Inputs para user permissions
export const inputsUserPermissions: InputFieldConfig[] = [
    {
        type: 'text',
        id: 'name',
        label: 'Nombre(s)',
        placeholder: 'Nombre del agente',
        group: 1
    },
    {
        type: 'text',
        id: 'paternal_last_name',
        label: 'Apellido paterno',
        placeholder: 'Apellido paterno',
        group: 1
    },
    {
        type: 'text',
        id: 'maternal_last_name',
        label: 'Apellido materno',
        placeholder: 'Apellido materno',
        group: 1
    },
    {
        type: 'email',
        id: 'email',
        label: 'Correo electrónico',
        placeholder: 'agente@rayseg.com',
        group: 2
    },
    {
        type: 'tel',
        id: 'phone',
        label: 'Teléfono',
        placeholder: '+52 1 234 567 8900',
        group: 2
    },
    {
        type: 'select',
        id: 'role',
        label: 'Rol',
        placeholder: 'Seleccione una opción',
        group: 3,
        options: [
            { label: 'Agente Inmobiliario', value: 'compra' },
            { label: 'Asesor de Ventas', value: 'venta' },
            { label: 'Asesor de Renta', value: 'renta' },
            { label: 'Administrador/a', value: 'admin' },
            { label: 'Gerente / Dueño', value: 'editor' } 
        ]
    },
    {
        type: 'select',
        id: 'is_active',
        label: 'Estatus',
        placeholder: 'Seleccione el estatus',
        group: 3,
        options: [
            { label: 'Activo', value: true },
            { label: 'Inactivo', value: false }
        ]
    },
    {
        type: 'textarea',
        id: 'notas_internas',
        label: 'Notas internas',
        placeholder: 'Información adicional sobre este usuario (zona de atención, tipo de propiedades, etc).',
        group: 4
    },
];

// Inputs para establecer la contraseña de la cuenta de usuario
export const inputsPassword: InputFieldConfig[] = [
    {
        type: 'password',
        id: 'password',
        label: 'Contraseña',
        placeholder: '********',
        group: 1
    },
    {
        type: 'password',
        id: 'password_confirm',
        label: 'Confirmar contraseña',
        placeholder: '********',
        group: 1
    },
];
