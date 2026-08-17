import { InputFieldConfig } from "@/components/ui/Input";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export const WhatsappIcon = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width={props.size || 24}
        height={props.size || 24}
        viewBox="0 0 448 512"
        fill="currentColor"
    >
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
);

// Configuración de los inputs para la sección de home/banner
export const inputsBannerConfiguration: InputFieldConfig[] = [
    {
        type: 'text',
        id: 'titlePrinciple',
        label: 'Título principal',
        placeholder: 'Encuentra tu hogar ideal en México'
    },
    {
        type: 'textarea',
        id: 'subtitlePrinciple',
        label: 'Subtítulo',
        placeholder: 'Compra, vende o renta propiedades en todo México con asesoría personalizada.'
    },
];

export const inputsIntroductoryContent: InputFieldConfig[] = [
    {
        type: 'text',
        id: 'titleIntroductory',
        label: 'Título de introducción',
        placeholder: 'Inmobiliaria especializada en el mercado mexicano.'
    },
    {
        type: 'textarea',
        id: 'introduction',
        label: 'Texto introductorio',
        placeholder: 'Trabajamos con casas, departamentos y terrenos en las principales ciudades de México. Te acompañamos en todo el proceso para que compres, vendas o rentes con seguridad juridica y al mejor precio.'
    }
];

// Configuración de los inputs para cada ítem de servicios
export const inputsServicesSection: InputFieldConfig[] = [
    {
        type: 'text',
        id: 'titleServices',
        label: 'Título de la sección de servicios',
        placeholder: 'Promociona tu propiedad con los mejores resultados'
    },
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

// Configuración de los inputs para la sección de localización
export const inputsLocation: InputFieldConfig[] = [
    {
        type: 'select', id: 'typeProperty', label: 'Tipo de propiedad', placeholder: 'Seleccionar', group: 1, options: []
    },
    {
        type: 'text',
        id: 'direccion',
        label: 'Dirección a fijar en el mapa',
        placeholder: 'Ej: Calle 123, Interior 4B',
        group: 1
    },
];

// Configuración de los inputs para la sección "Quiénes Somos"
export const inputsAboutUsSection: InputFieldConfig[] = [
    {
        type: 'text',
        id: 'titleAboutUs',
        label: 'Título de la sección',
        placeholder: 'Quiénes somos'
    },
    {
        type: 'textarea',
        id: 'aboutUsDescription',
        label: 'Descripción breve (Intro)',
        placeholder: 'Somos una inmobiliaria comprometida con ayudarte a encontrar el hogar perfecto en México.'
    },
    {
        type: 'textarea',
        id: 'history',
        label: 'Historia / Descripción completa',
        placeholder: 'Nuestra historia y valores...',
        rows: 6
    },
    {
        type: 'textarea',
        id: 'mission',
        label: 'Misión',
        placeholder: 'Nuestra misión es...',
        rows: 4
    },
    {
        type: 'textarea',
        id: 'vision',
        label: 'Visión',
        placeholder: 'Nuestra visión es...',
        rows: 4
    }
];

// Configuración de los inputs para el footer
export const inputsFooterSection: InputFieldConfig[] = [
    {
        type: 'text',
        id: 'address',
        label: 'Dirección física (opcional)',
        placeholder: 'Calle 123, Ciudad, País',
    },
    {
        type: 'tel',
        id: 'phone',
        label: 'Teléfono principal',
        placeholder: '+52 123 456 7890',
        group: 2,
    },
    {
        type: 'tel',
        id: 'phoneSecondary',
        label: 'Teléfono secundario (opcional)',
        placeholder: '+52 123 456 7890',
        group: 2,
    },
    {
        type: 'email',
        id: 'email',
        label: 'Correo electrónico',
        placeholder: 'contacto@rayseg.com',
        group: 3,
    },
    {
        type: 'text',
        id: 'businessHours',
        label: 'Horario de atención',
        placeholder: 'Lunes a Viernes: 9:00 AM – 18:00 PM | Sábado: 9:00 AM – 14:00 PM',
        group: 3,
    }
];

export const inputsSocialMedia: InputFieldConfig[] = [
    {
        type: 'url',
        id: 'facebook',
        placeholder: 'https://facebook.com/rayseg',
        icon: Facebook
    },
    {
        type: 'url',
        id: 'instagram',
        placeholder: 'https://instagram.com/rayseg',
        icon: Instagram
    },
    {
        type: 'url',
        id: 'linkedin',
        placeholder: 'https://linkedin.com/rayseg',
        icon: Linkedin
    },
    {
        type: 'url',
        id: 'whatsapp',
        placeholder: 'https://wa.me/5211234567890',
        icon: WhatsappIcon
    }
];

export const inputsTextFooter: InputFieldConfig[] = [
    {
        type: 'textarea',
        id: 'textFooter',
        label: 'Descripción breve de la inmobiliaria para el footer de la web',
        placeholder: 'Texto informativo o descriptivo que se mostrará en la parte inferior del sitio web.',
        rows: 4
    }
];

export const inputsPrivacyNotice: InputFieldConfig[] = [
    {
        type: 'text',
        id: 'privacy_title',
        label: 'Titulo de la página',
        placeholder: 'Aviso de Privacidad',
    },
    {
        type: 'textarea',
        id: 'privacy_content',
        label: 'Contenido del aviso',
        placeholder: 'AVISO DE PRIVACIDAD. De acuerdo con lo establecido',
        rows: 4
    }
];

export const inputsAddTermsConditions: InputFieldConfig[] = [
    {
        type: 'text',
        id: 'terms_title',
        label: 'Titulo del documento',
        placeholder: 'Términos y condiciones de uso',
    },
    {
        type: 'textarea',
        id: 'terms_content',
        label: 'Contenido del documento',
        placeholder: 'TERMINOS Y CONDICIONES',
        rows: 4
    }
];