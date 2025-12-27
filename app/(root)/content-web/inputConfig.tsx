import { InputFieldConfig } from "@/components/ui/Input";

// Configuración de los inputs
export const inputsBannerConfiguration: InputFieldConfig[] = [
    { type: 'text', id: 'titlePrinciple', label: 'Título principal', placeholder: 'Encuentra tu hogar ideal en México' },
    { type: 'textarea', id: 'subtitlePrinciple', label: 'Subtítulo', placeholder: 'Compra, vende o renta propiedades en todo México con asesoría personalizada.' },
];

export const inputsIntroductoryContent: InputFieldConfig[] = [
    { type: 'text', id: 'titleIntroductory', label: 'Título de introducción', placeholder: 'Inmobiliaria especializada en el mercado mexicano.' },
    {
        type: 'textarea', id: 'introduction', label: 'Texto introductorio', placeholder: 'Trabajamos con casas, departamentos y terrenos en las principales ciudades de México. Te acompañamos en todo el proceso para que compres, vendas o rentes con seguridad juridica y al mejor precio.'
    }
];

export const inputsServicesSection: InputFieldConfig[] = [
    { type: 'text', id: 'titleServices', label: 'Título de la sección de servicios', placeholder: 'Promociona tu propiedad con los mejores resultados' },
    {
        type: 'textarea', id: 'serviceDescription', label: 'Descripción de la sección de servicios', placeholder: 'Maximiza el valor de tu propiedad con nuestra experiencia en el mercado inmobiliario. Ofrecemos soluciones personalizadas para destacar las mejores características de tu hogar.'
    }
];

export const inputsServiceItem: InputFieldConfig[] = [
    { type: 'text', id: 'serviceTitle', label: 'Nombre del servicio', placeholder: 'Nombre del servicio (ej. Asesoría Legal)' },
    {
        type: 'text', id: 'serviceDescription', label: 'Breve descripción', placeholder: 'Breve descripción...'
    }
];

export const inputsLocation: InputFieldConfig[] = [
     {
        type: 'select', id: 'typeProperty', label: 'Tipo de propiedad', placeholder: 'Seleccionar', group: 1, options: [
            { label: 'Departamento', value: 'departamento' },
            { label: 'Casa', value: 'casa' },
        ]
    },
     {
        type: 'text',
        id: 'direccion',
        label: 'Dirección a fijar en el mapa',
        placeholder: 'Ej: Calle 123, Interior 4B',
        group: 1
    },
]