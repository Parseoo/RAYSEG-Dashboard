import React from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';

interface PermissionSection {
    id: string;
    title: string;
    description: string;
    group?: string;
    actions: { id: string; label: string }[];
    subActions?: { id: string; label: string }[];
    onLabel?: string;
    offLabel?: string;
}

const permissionSections: PermissionSection[] = [
    {
        id: 'reportes',
        title: 'Reportes / Dashboard',
        description: 'Visualización de estadísticas, métricas y reportes del sistema.',
        actions: [
            { id: 'ver-dashboard', label: 'Ver dashboard' },
            { id: 'ver-reportes', label: 'Ver reportes' },
            { id: 'exportar-reportes', label: 'Exportar reportes' },
        ]
    },
    {
        id: 'propiedades',
        title: 'Propiedades',
        description: 'Listado, creación y gestión de inmuebles.',
        actions: [
            { id: 'ver-lista', label: 'Ver lista' },
            { id: 'crear', label: 'Crear' },
            { id: 'editar', label: 'Editar' },
            { id: 'eliminar', label: 'Eliminar' },
            { id: 'ver-detalle', label: 'Ver detalle' },
        ],
        subActions: [
            { id: 'marcar-publicada', label: 'Marcar como publicada' },
            { id: 'quitar-web', label: 'Quitar de la web' },
        ]
    },
    {
        id: 'imagenes-propiedades',
        title: 'Imágenes de propiedades',
        description: 'Carga, cambio y eliminación de fotos.',
        actions: [
            { id: 'subir-varias', label: 'Subir varias fotos' },
            { id: 'elegir-principal', label: 'Elegir foto principal' },
            { id: 'eliminar-fotos', label: 'Eliminar fotos' },
        ]
    },
    {
        id: 'clientes',
        title: 'Clientes',
        description: 'Gestión de clientes, contactos y preferencias.',
        actions: [
            { id: 'ver-lista', label: 'Ver lista' },
            { id: 'crear', label: 'Crear' },
            { id: 'editar', label: 'Editar' },
            { id: 'eliminar', label: 'Eliminar' },
            { id: 'ver-detalle', label: 'Ver detalle' },
        ],
        subActions: [
            { id: 'ver-notas', label: 'Ver notas internas' },
            { id: 'editar-notas', label: 'Editar notas internas' },
        ]
    },
    {
        id: 'agentes',
        title: 'Agentes',
        description: 'Gestión de agentes inmobiliarios y sus datos.',
        actions: [
            { id: 'ver-lista', label: 'Ver lista' },
            { id: 'crear', label: 'Crear' },
            { id: 'editar', label: 'Editar' },
            { id: 'eliminar', label: 'Eliminar' },
            { id: 'ver-detalle', label: 'Ver detalle' },
        ],
        subActions: [
            { id: 'asignar-propiedades', label: 'Asignar propiedades' },
            { id: 'ver-estadisticas', label: 'Ver estadísticas' },
        ]
    },
    {
        id: 'contratos',
        title: 'Contratos',
        description: 'Gestión de contratos de arrendamiento y venta.',
        actions: [
            { id: 'ver-lista', label: 'Ver lista' },
            { id: 'crear', label: 'Crear' },
            { id: 'editar', label: 'Editar' },
            { id: 'eliminar', label: 'Eliminar' },
            { id: 'ver-detalle', label: 'Ver detalle' },
        ],
        subActions: [
            { id: 'generar-documentos', label: 'Generar documentos' },
            { id: 'configurar-recordatorios', label: 'Configurar recordatorios' },
        ]
    },
    {
        id: 'leads-contacto',
        title: 'Leads / Contacto',
        description: 'Mensajes recibidos desde la web.',
        actions: [
            { id: 'ver-leads', label: 'Ver leads' },
            { id: 'marcar-leido', label: 'Marcar como leído' },
            { id: 'eliminar-lead', label: 'Eliminar lead' },
            { id: 'responder-lead', label: 'Responder lead' },
        ]
    },
    {
        id: 'contenido-web-home',
        group: 'PERMISOS EN CONTENIDO WEB',
        title: 'Contenido Web - Home',
        description: 'Edición del contenido de la página principal.',
        actions: [
            { id: 'ver-contenido', label: 'Ver contenido' },
            { id: 'editar-textos', label: 'Editar textos' },
            { id: 'editar-imagenes', label: 'Editar imágenes' },
        ]
    },
    {
        id: 'contenido-web-servicios',
        group: 'PERMISOS EN CONTENIDO WEB',
        title: 'Contenido Web - Servicios',
        description: 'Gestión de servicios mostrados en la web.',
        actions: [
            { id: 'ver-servicios', label: 'Ver servicios' },
            { id: 'crear-servicio', label: 'Crear servicio' },
            { id: 'editar-servicio', label: 'Editar servicio' },
            { id: 'eliminar-servicio', label: 'Eliminar servicio' },
        ]
    },
    {
        id: 'contenido-web-localizacion',
        group: 'PERMISOS EN CONTENIDO WEB',
        title: 'Contenido Web - Localización',
        description: 'Gestión de ubicaciones y zonas de cobertura.',
        actions: [
            { id: 'ver-localizaciones', label: 'Ver localizaciones' },
            { id: 'crear-localizacion', label: 'Crear localización' },
            { id: 'editar-localizacion', label: 'Editar localización' },
            { id: 'eliminar-localizacion', label: 'Eliminar localización' },
        ]
    },
    {
        id: 'contenido-web-sobre-nosotros',
        group: 'PERMISOS EN CONTENIDO WEB',
        title: 'Contenido Web - Sobre Nosotros',
        description: 'Edición de la sección "Sobre Nosotros".',
        actions: [
            { id: 'ver-contenido', label: 'Ver contenido' },
            { id: 'editar-textos', label: 'Editar textos' },
            { id: 'editar-imagenes', label: 'Editar imágenes' },
        ]
    },
    {
        id: 'contenido-web-footer',
        group: 'PERMISOS EN CONTENIDO WEB',
        title: 'Contenido Web - Footer',
        description: 'Edición del pie de página y enlaces.',
        actions: [
            { id: 'ver-footer', label: 'Ver footer' },
            { id: 'editar-enlaces', label: 'Editar enlaces' },
            { id: 'editar-textos', label: 'Editar textos' },
        ]
    },
    {
        id: 'contenido-web-legal',
        group: 'PERMISOS EN CONTENIDO WEB',
        title: 'Contenido Web - Páginas Legales',
        description: 'Gestión de términos, condiciones y avisos legales.',
        actions: [
            { id: 'ver-paginas', label: 'Ver páginas legales' },
            { id: 'editar-terminos', label: 'Editar términos y condiciones' },
            { id: 'editar-aviso', label: 'Editar aviso de privacidad' },
        ]
    },
    {
        id: 'mi-perfil',
        group: 'CONFIGURACIÓN',
        title: 'Mi Perfil',
        description: 'Gestión de datos personales y configuración de cuenta.',
        actions: [
            { id: 'ver-perfil', label: 'Ver perfil' },
            { id: 'editar-datos', label: 'Editar datos personales' },
            { id: 'cambiar-password', label: 'Cambiar contraseña' },
            { id: 'editar-preferencias', label: 'Editar preferencias' },
        ]
    },
    {
        id: 'ajustes-usuarios',
        group: 'CONFIGURACIÓN',
        title: 'Usuarios y Permisos',
        description: 'Configuración del sistema y gestión de otros usuarios.',
        actions: [
            { id: 'ver-usuarios', label: 'Ver lista de usuarios' },
            { id: 'crear-usuarios', label: 'Crear usuarios' },
            { id: 'editar-usuarios', label: 'Editar usuarios' },
            { id: 'eliminar-usuarios', label: 'Eliminar usuarios' },
            { id: 'editar-permisos', label: 'Editar permisos' },
        ],
        onLabel: "Solo administradores",
        offLabel: "Acceso limitado"
    }
];

function PermissionCard({ section, enabledSections, isReadOnly }: {
    section: PermissionSection,
    enabledSections: Record<string, boolean>,
    isReadOnly: boolean
}) {
    const isEnabled = enabledSections[section.id] || false;

    return (
        <div className={`p-5 border rounded-xl transition-all ${isEnabled ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-base mb-1">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                </div>
                <div className={`flex-shrink-0 ${isReadOnly ? 'opacity-60' : ''}`}>
                    <Switch
                        checked={isEnabled}
                        onChange={() => { }}
                        onLabel={section.onLabel || "Habilitado"}
                        offLabel={section.offLabel || "Deshabilitado"}
                        disabled={isReadOnly}
                    />
                </div>
            </div>

            <div className="mt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Acciones permitidas</p>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {section.actions.map((action: any) => (
                        <Checkbox
                            key={action.id}
                            label={action.label}
                            disabled={true}
                            checked={isEnabled}
                        />
                    ))}
                </div>

                {section.subActions && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            {section.id === 'propiedades' ? 'Publicación web' :
                                section.id === 'contratos' ? 'Acciones adicionales' :
                                    'Acciones adicionales'}
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                            {section.subActions.map((action: any) => (
                                <Checkbox
                                    key={action.id}
                                    label={action.label}
                                    disabled={true}
                                    checked={isEnabled}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {section.id === 'propiedades' && (
                <p className="mt-4 text-xs text-gray-400 italic">Los agentes solo pueden editar propiedades asignadas a su cartera.</p>
            )}
            {section.id === 'clientes' && (
                <p className="mt-4 text-xs text-gray-400 italic">Los agentes solo pueden ver y editar clientes asignados a ellos.</p>
            )}
            {section.id === 'agentes' && (
                <p className="mt-4 text-xs text-gray-400 italic">Solo administradores y gerentes pueden gestionar agentes.</p>
            )}
            {section.id === 'contratos' && (
                <p className="mt-4 text-xs text-gray-400 italic">Los agentes solo pueden ver contratos relacionados con sus propiedades.</p>
            )}
        </div>
    );
}

interface ViewPermissionsProps {
    userPermissions?: Record<string, boolean>;
    isReadOnly?: boolean;
}

export function ViewPermissions({ userPermissions = {}, isReadOnly = true }: ViewPermissionsProps) {
    // Valores por defecto basados en permisos del usuario o valores predeterminados
    const defaultEnabledSections: Record<string, boolean> = {
        'reportes': true,
        'propiedades': true,
        'imagenes-propiedades': true,
        'clientes': true,
        'agentes': false,
        'contratos': true,
        'leads-contacto': true,
        'contenido-web-home': false,
        'contenido-web-servicios': false,
        'contenido-web-localizacion': false,
        'contenido-web-sobre-nosotros': false,
        'contenido-web-footer': false,
        'contenido-web-legal': false,
        'mi-perfil': true,
        'ajustes-usuarios': false
    };

    const enabledSections = { ...defaultEnabledSections, ...userPermissions };

    return (
        <div className='bg-white w-full max-h-max rounded-lg p-5 sm:p-6 shadow-md border border-slate-200'>
            <div className='w-full h-full'>
                <div className="mb-6">
                    <h1 className='font-bold text-xl text-gray-800 mb-2'>Permisos por pantalla</h1>
                    <p className='text-sm text-gray-500'>Vista de los permisos asignados a este usuario. Los permisos no se pueden modificar desde esta vista.</p>
                </div>

                <div className='space-y-4'>
                    {permissionSections.map((section, index) => {
                        const showGroupHeader = section.group && (index === 0 || permissionSections[index - 1].group !== section.group);
                        return (
                            <React.Fragment key={section.id}>
                                {showGroupHeader && (
                                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-6 mb-4 first:mt-0">{section.group}</h2>
                                )}
                                <PermissionCard
                                    section={section}
                                    enabledSections={enabledSections}
                                    isReadOnly={isReadOnly}
                                />
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ViewPermissions;
