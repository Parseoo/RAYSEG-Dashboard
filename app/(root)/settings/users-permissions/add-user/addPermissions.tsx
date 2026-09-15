import React, { useEffect, useState } from 'react';
import { ChevronDown, X, Loader2, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/Switch';
import { UserForm } from '@/lib/@type';
import { GetListPermissionsByModule } from '@/lib/api/permission-api';
import { Permission } from '@/lib/@type-permission';

interface PermissionSection {
    id: string;
    title: string;
    description: string;
    group?: string;
    actions: { id: string; label: string }[];
    subActions?: { id: string; label: string }[];
    order?: number;
}

const SECTION_METADATA: Record<string, { title: string, description: string, group?: string, order?: number }> = {
    'property': { title: 'Propiedades', description: 'Listado, creación y gestión de inmuebles.', group: 'GESTIÓN INMOBILIARIA', order: 3 },
    'client': { title: 'Clientes', description: 'Gestión de clientes, contactos y preferencias.', group: 'GESTIÓN INMOBILIARIA', order: 5 },
    'agent': { title: 'Agentes', description: 'Gestión de agentes inmobiliarios y sus datos.', group: 'GESTIÓN INMOBILIARIA', order: 6 },
    'contract': { title: 'Contratos', description: 'Gestión de contratos de arrendamiento y venta.', group: 'GESTIÓN INMOBILIARIA', order: 7 },
    'lead': { title: 'Leads / Contacto', description: 'Mensajes recibidos desde la web.', group: 'GESTIÓN INMOBILIARIA', order: 8 },
    'propertyimage': { title: 'Imágenes de propiedades', description: 'Carga, cambio y eliminación de fotos.', group: 'GESTIÓN INMOBILIARIA', order: 4 },
    'user': { title: 'Usuarios', description: 'Configuración del sistema y gestión de otros usuarios.', group: 'CONFIGURACIÓN', order: 20 },
    'reports': { title: 'Reportes / Dashboard', description: 'Visualización de estadísticas, métricas y reportes del sistema.', group: 'ANÁLISIS Y CONTROL', order: 2 },
    'settings': { title: 'Configuración', description: 'Gestión de Settings y configuración general del sistema.', group: 'CONFIGURACIÓN', order: 1 },
    'webcontent': { title: 'Contenido Web', description: 'Gestión de contenido de la página web.', group: 'PERMISOS EN CONTENIDO WEB', order: 10 },
    'webcontent_home': { title: 'Contenido Web - Home', description: 'Edición del contenido de la página principal.', group: 'PERMISOS EN CONTENIDO WEB', order: 10 },
    'webcontent_servicios': { title: 'Contenido Web - Servicios', description: 'Gestión de servicios mostrados en la web.', group: 'PERMISOS EN CONTENIDO WEB', order: 11 },
    'webcontent_localizacion': { title: 'Contenido Web - Localización', description: 'Gestión de ubicaciones y zonas de cobertura.', group: 'PERMISOS EN CONTENIDO WEB', order: 12 },
    'webcontent_sobre_nosotros': { title: 'Contenido Web - Sobre Nosotros', description: 'Edición de la sección "Sobre Nosotros".', group: 'PERMISOS EN CONTENIDO WEB', order: 13 },
    'webcontent_footer': { title: 'Contenido Web - Footer', description: 'Edición del pie de página y enlaces.', group: 'PERMISOS EN CONTENIDO WEB', order: 14 },
    'webcontent_legal': { title: 'Contenido Web - Páginas Legales', description: 'Gestión de términos, condiciones y avisos legales.', group: 'PERMISOS EN CONTENIDO WEB', order: 15 },
    'webcontent_privacidad': { title: 'Contenido Web - Aviso de Privacidad', description: 'Gestión del aviso de privacidad.', group: 'PERMISOS EN CONTENIDO WEB', order: 16 },
    'webcontent_terminos': { title: 'Contenido Web - Términos y Condiciones', description: 'Gestión de términos y condiciones.', group: 'PERMISOS EN CONTENIDO WEB', order: 17 },
};

const getTagColor = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('ver') || l.includes('visualizar') || l.includes('detalle') || l.includes('perfil') || l.includes('dashboard') || l.includes('lista') || l.includes('reportes') || l.includes('contenido')) 
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    if (l.includes('crear') || l.includes('subir') || l.includes('agregar') || l.includes('exportar') || l.includes('nuevo')) 
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
    if (l.includes('editar') || l.includes('cambiar') || l.includes('configurar') || l.includes('responder') || l.includes('asignar') || l.includes('gestionar') || l.includes('actualizar')) 
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
    if (l.includes('eliminar') || l.includes('borrar') || l.includes('quitar')) 
        return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
    if (l.includes('marcar') || l.includes('generar')) 
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
    if (l.includes('agente') || l.includes('cliente') || l.includes('contrato') || l.includes('lead'))
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100';
    
    return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
};

const MultiSelectPermissions = ({
    options,
    selectedValues,
    onChange,
    disabled = false
}: {
    options: { id: string; label: string }[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    disabled?: boolean;
}) => {
    const toggleOption = (id: string) => {
        if (disabled) return;
        if (selectedValues.includes(id)) {
            onChange(selectedValues.filter(v => v !== id));
        } else {
            onChange([...selectedValues, id]);
        }
    };

    return (
        <div className='flex flex-wrap gap-2.5 w-full'>
            {[...options]
                .sort((a, b) => {
                    const aSelected = selectedValues.includes(a.id);
                    const bSelected = selectedValues.includes(b.id);
                    if (aSelected && !bSelected) return -1;
                    if (!aSelected && bSelected) return 1;
                    return a.label.localeCompare(b.label);
                })
                .map((option) => {
                const isSelected = selectedValues.includes(option.id);
                const colorClasses = getTagColor(option.label);
                
                if (isSelected) {
                    return (
                        <button
                            key={option.id}
                            type='button'
                            onClick={() => toggleOption(option.id)}
                            disabled={disabled}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border border-solid transition-all duration-200 shadow-sm ${colorClasses} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:brightness-95 hover:-translate-y-0.5'}`}
                        >
                            {option.label}
                            <div className="flex items-center justify-center rounded-full bg-black/5 p-0.5 ml-1">
                                <X size={12} strokeWidth={3} />
                            </div>
                        </button>
                    );
                } else {
                    return (
                        <button
                            key={option.id}
                            type='button'
                            onClick={() => toggleOption(option.id)}
                            disabled={disabled}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-dashed bg-transparent transition-all duration-200 text-slate-500 border-slate-300 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-400 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-solid hover:-translate-y-0.5'}`}
                        >
                            {option.label}
                            <div className="flex items-center justify-center rounded-full p-0.5 ml-1">
                                <Plus size={14} strokeWidth={2.5} />
                            </div>
                        </button>
                    );
                }
            })}
            {options.length === 0 && (
                <span className='text-sm text-slate-400 italic'>No hay acciones disponibles</span>
            )}
        </div>
    );
};

function PermissionCard({ 
    section, 
    isEnabled, 
    selectedActions, 
    onActionsChange 
}: { 
    section: PermissionSection, 
    isEnabled: boolean, 
    selectedActions: string[],
    onActionsChange: (sectionId: string, actions: string[]) => void
}) {
    return (
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm transition-all">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{section.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-xl">{section.description}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <p className="text-[10px] font-bold text-primary_color uppercase tracking-widest mb-3">Acciones de gestión</p>
                    <MultiSelectPermissions
                        options={section.actions}
                        selectedValues={selectedActions.filter(a => section.actions.some(sa => sa.id === a))}
                        onChange={(vals) => onActionsChange(section.id, vals)}
                    />
                </div>

                {section.subActions && (
                    <div className="pt-5 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-primary_color uppercase tracking-widest mb-3">Acciones de publicación / web</p>
                        <MultiSelectPermissions
                            options={section.subActions}
                            selectedValues={selectedActions.filter(a => section.subActions?.some(sa => sa.id === a))}
                            onChange={(vals) => {
                                const mainActions = selectedActions.filter(a => section.actions.some(sa => sa.id === a));
                                onActionsChange(section.id, [...mainActions, ...vals]);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

interface AddPermissionsProps {
    user: UserForm;
    setUser: React.Dispatch<React.SetStateAction<UserForm>>;
    isLoading: boolean;
    withoutCard?: boolean;
    groupedPermissions?: Record<string, any>;
    isFetchingPermissions?: boolean;
}

function buildPermissionSections(groupedData: Record<string, any>): PermissionSection[] {
    console.log("buildPermissionSections keys:", Object.keys(groupedData));
    const dynamicSections: PermissionSection[] = Object.keys(groupedData).map(modelName => {
        const group = groupedData[modelName];
        // Support both { permissions: [...] } format and direct array [...]
        const permissionsList = Array.isArray(group)
            ? group
            : (group.permissions || []);

        // Prioritize SECTION_METADATA translations over API's title/description
        const sectionEntry = SECTION_METADATA[modelName];
        const metadata = sectionEntry ? {
            title: sectionEntry.title,
            description: sectionEntry.description,
            group: sectionEntry.group || 'OTROS PERMISOS',
            order: sectionEntry.order || 99
        } : {
            title: modelName.charAt(0).toUpperCase() + modelName.slice(1).replace(/-/g, ' ').replace(/_/g, ' '),
            description: group.description || `Gestión de ${modelName}.`,
            group: 'OTROS PERMISOS',
            order: 99
        };

        const actions: { id: string; label: string; codename: string }[] = [];
        permissionsList.forEach((p: any) => {
            actions.push({ id: String(p.id), label: p.name || p.codename, codename: p.codename });
        });

        return {
            id: modelName,
            title: metadata.title,
            description: metadata.description,
            group: metadata.group,
            actions: actions,
            order: metadata.order || 99
        };
    });

    dynamicSections.sort((a, b) => (a.order || 99) - (b.order || 99));
    return dynamicSections;
}

function AddPermissions({ user, setUser, isLoading, withoutCard = false, groupedPermissions, isFetchingPermissions: externalFetching }: AddPermissionsProps) {
    const [allSystemPermissions, setAllSystemPermissions] = useState<Permission[]>([]);
    const [isFetchingPermissions, setIsFetchingPermissions] = useState(true);
    const [sections, setSections] = useState<PermissionSection[]>([]);

    useEffect(() => {
        if (groupedPermissions && Object.keys(groupedPermissions).length > 0) {
            const allPerms: Permission[] = [];
            Object.keys(groupedPermissions).forEach(modelName => {
                const group = groupedPermissions[modelName];
                const permissionsList = Array.isArray(group) ? group : (group.permissions || []);
                permissionsList.forEach((p: any) => {
                    allPerms.push({
                        id: p.id,
                        name: p.name,
                        codename: p.codename,
                        model: modelName,
                        is_system_role: p.is_system_role || false
                    });
                });
            });
            setAllSystemPermissions(allPerms);
            const builtSections = buildPermissionSections(groupedPermissions);
            setSections(builtSections);
            setIsFetchingPermissions(false);
            return;
        }

        const fetchAllPermissions = async () => {
            try {
                setIsFetchingPermissions(true);
                const res = await GetListPermissionsByModule();
                const groupedData = res.data || {};

                const allPerms: Permission[] = [];
                Object.keys(groupedData).forEach(modelName => {
                    const group = groupedData[modelName];
                    const permissionsList = Array.isArray(group) ? group : (group.permissions || []);
                    permissionsList.forEach((p: any) => {
                        allPerms.push({
                            id: p.id,
                            name: p.name,
                            codename: p.codename,
                            model: modelName,
                            is_system_role: p.is_system_role || false
                        });
                    });
                });
                setAllSystemPermissions(allPerms);
                const builtSections = buildPermissionSections(groupedData);
                setSections(builtSections);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            } finally {
                setIsFetchingPermissions(false);
            }
        };

        fetchAllPermissions();
    }, [groupedPermissions]);

    const hasInitializedPermissions = React.useRef(false);

    useEffect(() => {
        // Initialize permissions only once when sections are loaded and permissions are empty
        if (!hasInitializedPermissions.current && sections.length > 0 && (!user.permissions || Object.keys(user.permissions).length === 0)) {
            hasInitializedPermissions.current = true;
            const initialPermissions: Record<string, boolean | string[]> = {};

            sections.forEach(section => {
                initialPermissions[section.id] = false;
                initialPermissions[`${section.id}_actions`] = [];
            });

            setUser((prev: UserForm) => ({ ...prev, permissions: initialPermissions }));
        }
    }, [user.permissions, setUser, sections]);

    const toggleSection = (id: string, enabled: boolean) => {
        setUser((prev: UserForm) => {
            const currentActions = (prev.permissions?.[`${id}_actions`] as string[]) || [];
            return {
                ...prev,
                permissions: {
                    ...(prev.permissions || {}),
                    [id]: enabled,
                    [`${id}_actions`]: enabled ? currentActions : []
                }
            };
        });
    };

    const handleActionsChange = (sectionId: string, actions: string[]) => {
        setUser((prev: UserForm) => ({
            ...prev,
            permissions: {
                ...(prev.permissions || {}),
                [`${sectionId}_actions`]: actions
            }
        }));
    };

    return (
        <div className={withoutCard ? 'w-full' : 'bg-white w-full rounded-lg p-5 sm:p-7 shadow-xl border border-slate-200'}>
            <div className='w-full'>
                {!withoutCard && (
                    <div className="mb-8">
                        <h1 className='font-extrabold text-2xl text-gray-900 mb-2'>Permisos por pantalla</h1>
                        <p className='text-sm text-gray-500 max-w-2xl text-pretty'>Define qué secciones estarán visibles y qué acciones específicas puede realizar el usuario en cada pantalla.</p>
                    </div>
                )}

                {isFetchingPermissions ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="animate-spin text-primary_color" size={40} />
                        <p className="text-slate-500 font-medium">Cargando permisos del sistema...</p>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {!isFetchingPermissions && sections.map((section) => {
                            const isEnabled = user.permissions?.[section.id] ?? false;
                            const selectedActions = (user.permissions?.[`${section.id}_actions`] as string[]) ?? [];

                            return (
                                <div
                                    key={section.id}
                                    className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all'
                                >
                                    {/* Module Header */}
                                    <div
                                        className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-all ${
                                            isEnabled
                                            ? 'bg-primary_color/5 border-b border-primary_color/20'
                                            : 'bg-slate-50 hover:bg-slate-100'
                                        }`}
                                        onClick={() => toggleSection(section.id, !isEnabled)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span onClick={(e) => e.stopPropagation()}>
                                                <Switch
                                                    checked={isEnabled as boolean}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleSection(section.id, !isEnabled);
                                                    }}
                                                />
                                            </span>
                                            <div>
                                                <h3 className={`text-sm font-bold ${isEnabled ? 'text-primary_color' : 'text-slate-600'}`}>
                                                    {section.title}
                                                </h3>
                                                <p className='text-xs text-slate-400'>{section.description}</p>
                                            </div>
                                        </div>
                                        <ChevronDown
                                            size={18}
                                            className={`text-slate-400 transition-transform ${isEnabled ? 'rotate-180' : ''}`}
                                        />
                                    </div>

                                    {/* Permissions Panel - Only show when enabled */}
                                    {isEnabled && (
                                        <div className='p-5 bg-slate-50 border-t border-slate-100'>
                                            <p className="text-[10px] font-bold text-primary_color uppercase tracking-widest mb-3">Acciones de gestión</p>
                                            <MultiSelectPermissions
                                                options={section.actions}
                                                selectedValues={selectedActions.filter(a => section.actions.some(sa => sa.id === a))}
                                                onChange={(vals) => handleActionsChange(section.id, vals)}
                                            />

                                            {section.subActions && (
                                                <div className='mt-4 pt-4 border-t border-slate-200'>
                                                    <p className="text-[10px] font-bold text-primary_color uppercase tracking-widest mb-3">Acciones de publicación / web</p>
                                                    <MultiSelectPermissions
                                                        options={section.subActions}
                                                        selectedValues={selectedActions.filter(a => section.subActions?.some(sa => sa.id === a))}
                                                        onChange={(vals) => {
                                                            const mainActions = selectedActions.filter(a => section.actions.some(sa => sa.id === a));
                                                            handleActionsChange(section.id, [...mainActions, ...vals]);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddPermissions;