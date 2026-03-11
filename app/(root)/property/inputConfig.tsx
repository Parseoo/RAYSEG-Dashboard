import { InputFieldConfig } from "@/components/ui/Input";

// Configuración de los inputs
export const inputsDataProperty: InputFieldConfig[] = [
    { type: 'text', id: 'titleProperty', label: 'Título de la propiedad', placeholder: 'Ej: Depto 2 ambientes' },
    {
        type: 'select', id: 'typeProperty', label: 'Tipo de propiedad', placeholder: 'Seleccionar', group: 1, options: [
            { label: 'Departamento', value: 'departamento' },
            { label: 'Casa', value: 'casa' },
        ]
    },
    {
        type: 'select', id: 'operation', label: 'Operación', placeholder: 'Venta / Renta', group: 1, options: [
            { label: 'Venta', value: 'venta' },
            { label: 'Renta', value: 'renta' },
        ]
    },
    { type: 'text', id: 'price', label: 'Precio', placeholder: '$3,500,000', group: 2 },
    {
        type: 'select', id: 'statusProperty', label: 'Estado', placeholder: 'Seleccionar', group: 2, options: [
            { label: 'Disponible', value: 'disponible' },
            { label: 'Vendido', value: 'vendido' },
        ]
    },
    {
        type: 'textarea', id: 'description', label: 'Descripción', placeholder: 'Escribe una descripción detallada de la propiedad aquí...'
    }
];

export const inputsPublicationProperty: InputFieldConfig[] = [
{
        type: 'select', id: 'statusPublication', label: 'Estado de publicación', placeholder: 'Seleccionar', group: 2, options: [
            { label: 'Publicado', value: 'publicado' },
            { label: 'Borrador', value: 'borrador' },
            { label: 'Oculto', value: 'oculto' },
        ]
    },
    {
        type: 'textarea', id: 'webDescription', label: 'Nota interna (opcional)', placeholder: 'Agrega una nota interna sobre la publicación que no será visible para los clientes...'
    }
];