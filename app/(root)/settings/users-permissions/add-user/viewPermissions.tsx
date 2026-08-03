import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';
import { GetListPermissions } from '@/lib/api/permission-api';
import { Permission } from '@/lib/@type-permission';
import { Loader2 } from 'lucide-react';

interface PermissionSection {
    id: string;
    title: string;
    description: string;
    group?: string;
    actions: { id: string; label: string }[];
    subActions?: { id: string; label: string }[];
    onLabel?: string;
    offLabel?: string;
    order?: number;
}

const SECTION_METADATA: Record<string, { title: string, description: string, group?: string, order?: number }> = {
    'reportes': { 
        title: 'Reportes / Dashboard', 
        description: 'Visualización de estadísticas, métricas y reportes del sistema.',
        group: 'ANÁLISIS Y CONTROL',
        order: 1
    },
    'property': { 
        title: 'Propiedades', 
        description: 'Listado, creación y gestión de inmuebles.',
        group: 'GESTIÓN INMOBILIARIA',
        order: 2
    },
    'propertyimage': { 
        title: 'Imágenes de propiedades', 
        description: 'Carga, cambio y eliminación de fotos.',
        group: 'GESTIÓN INMOBILIARIA',
        order: 3
    },
    'client': { 
        title: 'Clientes', 
        description: 'Gestión de clientes, contactos y preferencias.',
        group: 'GESTIÓN INMOBILIARIA',
        order: 4
    },
    'agent': { 
        title: 'Agentes', 
        description: 'Gestión de agentes inmobiliarios y sus datos.',
        group: 'GESTIÓN INMOBILIARIA',
        order: 5
    },
    'contract': { 
        title: 'Contratos', 
        description: 'Gestión de contratos de arrendamiento y venta.',
        group: 'GESTIÓN INMOBILIARIA',
        order: 6
    },
    'lead': { 
        title: 'Leads / Contacto', 
        description: 'Mensajes recibidos desde la web.',
        group: 'GESTIÓN INMOBILIARIA',
        order: 7
    },
    // Contenido Web
    'webcontenthome': { title: 'Contenido Web - Home', description: 'Edición del contenido de la página principal.', group: 'PERMISOS EN CONTENIDO WEB', order: 10 },
    'webcontentservices': { title: 'Contenido Web - Servicios', description: 'Gestión de servicios mostrados en la web.', group: 'PERMISOS EN CONTENIDO WEB', order: 11 },
    'webcontentlocation': { title: 'Contenido Web - Localización', description: 'Gestión de ubicaciones y zonas de cobertura.', group: 'PERMISOS EN CONTENIDO WEB', order: 12 },
    'webcontentabout': { title: 'Contenido Web - Sobre Nosotros', description: 'Edición de la sección "Sobre Nosotros".', group: 'PERMISOS EN CONTENIDO WEB', order: 13 },
    'webcontentfooter': { title: 'Contenido Web - Footer', description: 'Edición del pie de página y enlaces.', group: 'PERMISOS EN CONTENIDO WEB', order: 14 },
    'webcontentlegal': { title: 'Contenido Web - Páginas Legales', description: 'Gestión de términos, condiciones y avisos legales.', group: 'PERMISOS EN CONTENIDO WEB', order: 15 },
    // Configuración
    'user': { title: 'Usuarios y Permisos', description: 'Configuración del sistema y gestión de otros usuarios.', group: 'CONFIGURACIÓN', order: 20 },
    'profile': { title: 'Mi Perfil', description: 'Gestión de datos personales y configuración de cuenta.', group: 'CONFIGURACIÓN', order: 21 },
};

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
    const [sections, setSections] = useState<PermissionSection[]>([]);
    const [isFetchingPermissions, setIsFetchingPermissions] = useState(true);

    useEffect(() => {
        const fetchAllPermissions = async () => {
            try {
                setIsFetchingPermissions(true);
                const res = await GetListPermissions();
                
                const extractData = (res: any) => {
                    if (!res?.data) return [];
                    return res.data.items || res.data.catalogItems || (Array.isArray(res.data) ? res.data : (res.data.data && Array.isArray(res.data.data) ? res.data.data : []));
                };

                const perms = extractData(res);

                // Group permissions by model
                const permsByModel: Record<string, Permission[]> = {};
                perms.forEach((p: Permission) => {
                    if (!permsByModel[p.model]) permsByModel[p.model] = [];
                    permsByModel[p.model].push(p);
                });

                // Build sections dynamically from models found in API
                const dynamicSections: PermissionSection[] = Object.keys(permsByModel).map(modelName => {
                    const metadata = SECTION_METADATA[modelName] || {
                        title: modelName.charAt(0).toUpperCase() + modelName.slice(1),
                        description: `Gestión de ${modelName}.`,
                        group: 'OTROS PERMISOS',
                        order: 99
                    };

                    const modelPermissions = permsByModel[modelName];
                    const actions = modelPermissions.map((p: Permission) => {
                        const parts = p.codename.split('_');
                        const action = parts[0];
                        
                        // Map labels to friendly names
                        let label = p.name;
                        if (action === 'view') label = 'Ver lista / detalle';
                        else if (action === 'add') label = 'Crear';
                        else if (action === 'change') label = 'Editar';
                        else if (action === 'delete') label = 'Eliminar';
                        
                        const actionId = action === 'view' ? 'ver-lista' :
                                        action === 'add' ? 'crear' :
                                        action === 'change' ? 'editar' :
                                        action === 'delete' ? 'eliminar' : action;

                        return { id: actionId, label: label };
                    });

                    // Deduplicate actions
                    const uniqueActions = Array.from(new Map(actions.map(item => [item.id, item])).values());

                    return {
                        id: modelName,
                        title: metadata.title,
                        description: metadata.description,
                        group: metadata.group,
                        actions: uniqueActions,
                        order: metadata.order || 99
                    };
                });

                // Sort sections by order
                dynamicSections.sort((a, b) => (a.order || 99) - (b.order || 99));

                setSections(dynamicSections);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            } finally {
                setIsFetchingPermissions(false);
            }
        };

        fetchAllPermissions();
    }, []);

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

                {isFetchingPermissions ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-slate-500 font-medium">Cargando configuración de permisos...</p>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {sections.map((section, index) => {
                            const showGroupHeader = section.group && (index === 0 || sections[index - 1].group !== section.group);
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
                )}
            </div>
        </div>
    );
}

export default ViewPermissions;
