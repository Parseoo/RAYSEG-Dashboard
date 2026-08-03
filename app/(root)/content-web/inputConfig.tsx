import { InputFieldConfig } from "@/components/ui/Input";
import { Facebook, Instagram, Linkedin, MessageSquare } from "lucide-react";
import { inputsAddContact } from '../agents/add-agent/inputs.data';

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
        icon: MessageSquare
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