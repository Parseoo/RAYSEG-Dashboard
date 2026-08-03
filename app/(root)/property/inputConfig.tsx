import { InputFieldConfig } from "@/components/ui/Input";

// Configuración de los inputs
export const inputsDataProperty: InputFieldConfig[] = [
    { type: 'text', id: 'title', label: 'Título de la propiedad', placeholder: 'Casa moderna de 3 recámaras en El Campestre', required: true },
    {
        type: 'select', id: 'property_type', label: 'Tipo de propiedad', placeholder: 'Selecciona Tipo de propiedad', group: 1, options: [], required: true
    },
    {
        type: 'select', id: 'operation_type', label: 'Operación', placeholder: 'Selecciona una operación', group: 1, options: [], required: true
    },
    { type: 'currency', id: 'price', label: 'Precio', placeholder: '$3,500,000', group: 2, required: true, currency: 'MXN' },
    {
        type: 'select', id: 'property_status', label: 'Disponibilidad', placeholder: 'Selecciona la disponibilidad', group: 2, options: []
    },
    {
        type: 'textarea', id: 'description', label: 'Descripción', placeholder: 'Describe las características, distribución, acabados y ventajas de la propiedad.', required: true
    }
];

export const inputsPublicationProperty: InputFieldConfig[] = [
    {
        type: 'select', id: 'status_publication', label: 'Estado de publicación', placeholder: 'Selecciona un estado de publicación', group: 2, options: []
    },
    {
        type: 'textarea', id: 'note', label: 'Nota interna (opcional)', placeholder: 'Agrega una nota para uso interno. No será visible para los clientes.'
    }
];

export const inputsDetailProperty: InputFieldConfig[] = [
    {
        type: 'number', id: 'terrain_size', label: 'Superficie Terreno (m²)', placeholder: '120', group: 1
    },
    {
        type: 'number', id: 'construction_size', label: 'Superficie Construcción (m²)', placeholder: '95', group: 1
    },
    {
        type: 'number', id: 'bathrooms', label: 'Baños', placeholder: '2.5', group: 2
    },
    {
        type: 'number', id: 'parking_spaces', label: 'Cocheras', placeholder: '2', group: 2
    },
    {
        type: 'number', id: 'floors', label: 'Niveles', placeholder: '2', group: 3
    },
    {
        type: 'number', id: 'rooms', label: 'Recámaras', placeholder: '3', group: 3
    },
    {
        type: 'number', id: 'ambientes', label: 'Ambientes', placeholder: '6', group: 3
    },
    {
        type: 'number', id: 'construction_year', label: 'Año de construcción', placeholder: '2021', group: 3.5
    },
    {
        type: 'select', id: 'terrain_type', label: 'Tipo de terreno', placeholder: 'Selecciona un tipo de terreno', group: 4,
        options: []
    },
    {
        type: 'select', id: 'conservation_status', label: 'Estado de conservación', placeholder: 'Selecciona un estado', group: 4,
        options: []
    },
];

export const getFieldLabel = (id: string): string => {
    const allInputs = [...inputsDataProperty, ...inputsPublicationProperty, ...inputsDetailProperty];
    const field = allInputs.find(input => input.id === id);
    return field?.label ? String(field.label) : id;
};