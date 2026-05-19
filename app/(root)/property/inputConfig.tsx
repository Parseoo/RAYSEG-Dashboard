import { InputFieldConfig } from "@/components/ui/Input";

// Configuración de los inputs
export const inputsDataProperty: InputFieldConfig[] = [
    { type: 'text', id: 'title', label: 'Título de la propiedad', placeholder: 'Ej: Depto 2 ambientes' },
    {
        type: 'select', id: 'property_type', label: 'Tipo de propiedad', placeholder: 'Seleccionar', group: 1, options: []
    },
    {
        type: 'select', id: 'operation_type', label: 'Operación', placeholder: 'Venta / Renta', group: 1, options: []
    },
    { type: 'text', id: 'price', label: 'Precio', placeholder: '$3,500,000', group: 2 },
    {
        type: 'select', id: 'property_status', label: 'Estado', placeholder: 'Seleccionar', group: 2, options: []
    },
    {
        type: 'textarea', id: 'description', label: 'Descripción', placeholder: 'Escribe una descripción detallada de la propiedad aquí...'
    }
];

export const inputsPublicationProperty: InputFieldConfig[] = [
    {
        type: 'select', id: 'status_publication', label: 'Estado de publicación', placeholder: 'Seleccionar', group: 2, options: []
    },
    {
        type: 'textarea', id: 'web_description', label: 'Nota interna (opcional)', placeholder: 'Agrega una nota interna sobre la publicación que no será visible para los clientes...'
    }
];