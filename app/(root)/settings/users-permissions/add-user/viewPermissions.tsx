"use client";

import React, { useState, useMemo } from 'react';
import {
    Search,
    ChevronDown,
    ChevronRight,
    Building2,
    Users,
    FileText,
    BarChart3,
    Shield,
    Settings,
    UserCheck,
    Key,
    Globe,
    User,
    FolderTree,
    MessageSquare,
    Image as ImageIcon,
    Lock
} from 'lucide-react';

export interface PermissionActionItem {
    id: string;
    label: string;
    enabled: boolean;
}

export interface PermissionModuleItem {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    status: 'Habilitado' | 'Parcial' | 'Sin acceso';
    actions: PermissionActionItem[];
}

export interface PermissionGroupItem {
    id: string;
    title: string;
    icon: React.ElementType;
    modules: PermissionModuleItem[];
}

interface ViewPermissionsProps {
    userPermissions?: Record<string, any>;
    isReadOnly?: boolean;
    roleName?: string;
}

export function ViewPermissions({ userPermissions = {}, isReadOnly = true, roleName }: ViewPermissionsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        'gestion-inmobiliaria': true,
        'seguridad': false,
        'sistema': false,
    });

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    // Construcción de los grupos y módulos según la referencia
    const groups: PermissionGroupItem[] = useMemo(() => {
        const hasPerm = (key: string, action?: string) => {
            if (!userPermissions || Object.keys(userPermissions).length === 0) {
                if (key === 'clientes') return true;
                if (key === 'propiedades') return true;
                if (key === 'contratos') return action === 'ver' || action === 'editar';
                if (key === 'reportes') return false;
                if (key === 'leads') return true;
                if (key === 'imagenes') return true;
                if (key === 'perfil') return true;
                if (key === 'contenido-web') return action === 'ver' || action === 'editar';
                return false;
            }

            const val = userPermissions[key];
            if (val === true || val === 'true') return true;
            if (Array.isArray(val)) {
                if (!action) return val.length > 0;
                return val.includes(action);
            }
            if (typeof userPermissions[`${key}_actions`] === 'object' && Array.isArray(userPermissions[`${key}_actions`])) {
                if (!action) return userPermissions[`${key}_actions`].length > 0;
                return userPermissions[`${key}_actions`].includes(action);
            }
            return false;
        };

        const createModule = (
            id: string,
            title: string,
            description: string,
            icon: React.ElementType,
            actionDefs: { id: string; label: string; defaultEnabled?: boolean }[]
        ): PermissionModuleItem => {
            const actions: PermissionActionItem[] = actionDefs.map(act => {
                let enabled = act.defaultEnabled ?? true;
                if (userPermissions && Object.keys(userPermissions).length > 0) {
                    enabled = hasPerm(id, act.id) || hasPerm(id);
                }
                return {
                    id: act.id,
                    label: act.label,
                    enabled
                };
            });

            const enabledCount = actions.filter(a => a.enabled).length;
            let status: 'Habilitado' | 'Parcial' | 'Sin acceso' = 'Sin acceso';
            if (enabledCount === actions.length && actions.length > 0) {
                status = 'Habilitado';
            } else if (enabledCount > 0) {
                status = 'Parcial';
            }

            return {
                id,
                title,
                description,
                icon,
                status,
                actions
            };
        };

        return [
            {
                id: 'gestion-inmobiliaria',
                title: 'Gestión inmobiliaria',
                icon: Building2,
                modules: [
                    createModule('clientes', 'Clientes', 'Gestión de clientes, contactos y preferencias.', Users, [
                        { id: 'crear', label: 'Crear', defaultEnabled: true },
                        { id: 'editar', label: 'Editar', defaultEnabled: true },
                        { id: 'eliminar', label: 'Eliminar', defaultEnabled: true },
                        { id: 'ver', label: 'Ver lista / detalle', defaultEnabled: true },
                    ]),
                    createModule('propiedades', 'Propiedades', 'Gestión de propiedades y características.', Building2, [
                        { id: 'crear', label: 'Crear', defaultEnabled: true },
                        { id: 'editar', label: 'Editar', defaultEnabled: true },
                        { id: 'eliminar', label: 'Eliminar', defaultEnabled: true },
                        { id: 'ver', label: 'Ver lista / detalle', defaultEnabled: true },
                    ]),
                    createModule('contratos', 'Contratos', 'Gestión de contratos y documentos.', FileText, [
                        { id: 'ver', label: 'Ver lista / detalle', defaultEnabled: true },
                        { id: 'editar', label: 'Editar', defaultEnabled: true },
                        { id: 'crear', label: 'Crear', defaultEnabled: false },
                        { id: 'eliminar', label: 'Eliminar', defaultEnabled: false },
                    ]),
                    createModule('reportes', 'Reportes', 'Generación de reportes y estadísticas.', BarChart3, [
                        { id: 'crear', label: 'Crear', defaultEnabled: false },
                        { id: 'editar', label: 'Editar', defaultEnabled: false },
                        { id: 'eliminar', label: 'Eliminar', defaultEnabled: false },
                        { id: 'ver', label: 'Ver lista / detalle', defaultEnabled: false },
                    ]),
                    createModule('leads', 'Leads / Contacto', 'Mensajes recibidos desde la web.', MessageSquare, [
                        { id: 'ver', label: 'Ver lista / detalle', defaultEnabled: true },
                        { id: 'editar', label: 'Editar', defaultEnabled: true },
                        { id: 'eliminar', label: 'Eliminar', defaultEnabled: true },
                    ]),
                    createModule('imagenes', 'Imágenes de propiedades', 'Carga, cambio y eliminación de fotos.', ImageIcon, [
                        { id: 'crear', label: 'Crear', defaultEnabled: true },
                        { id: 'editar', label: 'Editar', defaultEnabled: true },
                        { id: 'eliminar', label: 'Eliminar', defaultEnabled: true },
                        { id: 'ver', label: 'Ver lista / detalle', defaultEnabled: true },
                    ]),
                ]
            },
            {
                id: 'seguridad',
                title: 'Seguridad',
                icon: Shield,
                modules: [
                    createModule('usuarios', 'Usuarios y Permisos', 'Configuración del sistema y gestión de otros usuarios.', UserCheck, [
                        { id: 'crear', label: 'Crear', defaultEnabled: false },
                        { id: 'editar', label: 'Editar', defaultEnabled: false },
                        { id: 'eliminar', label: 'Eliminar', defaultEnabled: false },
                        { id: 'ver', label: 'Ver lista / detalle', defaultEnabled: false },
                    ]),
                    createModule('roles', 'Roles y Accesos', 'Gestión de roles y asignación de permisos globales.', Key, [
                        { id: 'crear', label: 'Crear', defaultEnabled: false },
                        { id: 'editar', label: 'Editar', defaultEnabled: false },
                        { id: 'eliminar', label: 'Eliminar', defaultEnabled: false },
                        { id: 'ver', label: 'Ver lista / detalle', defaultEnabled: false },
                    ]),
                ]
            },
            {
                id: 'sistema',
                title: 'Sistema',
                icon: Settings,
                modules: [
                    createModule('contenido-web', 'Contenido Web', 'Edición y publicación de contenidos para la página web.', Globe, [
                        { id: 'editar', label: 'Editar', defaultEnabled: true },
                        { id: 'ver', label: 'Ver lista / detalle', defaultEnabled: true },
                    ]),
                    createModule('perfil', 'Mi Perfil', 'Gestión de datos personales y configuración de cuenta.', User, [
                        { id: 'editar', label: 'Editar', defaultEnabled: true },
                        { id: 'ver', label: 'Ver lista / detalle', defaultEnabled: true },
                    ]),
                    createModule('catalogos', 'Catálogos', 'Gestión de catálogos y opciones del sistema.', FolderTree, [
                        { id: 'crear', label: 'Crear', defaultEnabled: false },
                        { id: 'editar', label: 'Editar', defaultEnabled: false },
                        { id: 'eliminar', label: 'Eliminar', defaultEnabled: false },
                        { id: 'ver', label: 'Ver lista / detalle', defaultEnabled: false },
                    ]),
                ]
            }
        ];
    }, [userPermissions]);

    // Filtrar módulos según la búsqueda
    const filteredGroups = useMemo(() => {
        if (!searchTerm.trim()) return groups;
        const term = searchTerm.toLowerCase();

        return groups.map(group => {
            const matchingModules = group.modules.filter(mod =>
                mod.title.toLowerCase().includes(term) ||
                mod.description.toLowerCase().includes(term) ||
                mod.actions.some(a => a.label.toLowerCase().includes(term))
            );
            return {
                ...group,
                modules: matchingModules
            };
        }).filter(group => group.modules.length > 0);
    }, [groups, searchTerm]);

    const totalModules = 18;
    const totalHabilitados = 15;
    const totalSinAcceso = 3;

    return (
        <div className="bg-white rounded-lg p-5 mb-9 shadow-md border border-slate-200">
            {/* Header con título y estadísticas a la derecha */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <Lock size={20} className="text-primary_color" />
                    <h2 className="font-bold text-gray-900 text-lg sm:text-xl">Permisos por pantalla</h2>
                </div>

                {/* Stats counters */}
                <div className="flex items-center justify-around sm:justify-start gap-4 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200/80">
                    <div className="text-center">
                        <span className="block text-base sm:text-lg font-bold text-gray-900 leading-tight">{totalModules}</span>
                        <span className="text-[11px] text-gray-500">Módulos totales</span>
                    </div>
                    <div className="w-[1px] h-6 bg-slate-200" />
                    <div className="text-center">
                        <span className="block text-base sm:text-lg font-bold text-emerald-600 leading-tight">{totalHabilitados}</span>
                        <span className="text-[11px] text-emerald-600 font-medium">Habilitados</span>
                    </div>
                    <div className="w-[1px] h-6 bg-slate-200" />
                    <div className="text-center">
                        <span className="block text-base sm:text-lg font-bold text-gray-400 leading-tight">{totalSinAcceso}</span>
                        <span className="text-[11px] text-gray-500">Sin acceso</span>
                    </div>
                </div>
            </div>

            {/* Subtítulo descriptivo y Buscador colocado inmediatamente debajo */}
            <div className="mt-4">
                <p className="text-sm text-gray-500">
                    Vista de los permisos asignados a este usuario. Los permisos no se pueden modificar desde esta vista.
                </p>

                {/* Buscador debajo del texto */}
                <div className="relative mt-3 max-w-md w-full">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar módulo o pantalla..."
                        className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary_color/20 focus:border-primary_color focus:bg-white transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Lista de Grupos de Permisos */}
            <div className="mt-5 space-y-4">
                {filteredGroups.map(group => {
                    const isExpanded = searchTerm.trim() ? true : (expandedGroups[group.id] ?? false);
                    const GroupIcon = group.icon;

                    return (
                        <div
                            key={group.id}
                            className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all"
                        >
                            {/* Cabecera del Grupo */}
                            <button
                                type="button"
                                onClick={() => toggleGroup(group.id)}
                                className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                                    isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/70'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary_color border border-blue-100 flex items-center justify-center shrink-0">
                                        <GroupIcon size={18} />
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm sm:text-base">{group.title}</span>
                                </div>
                                <div>
                                    {isExpanded ? (
                                        <ChevronDown size={18} className="text-gray-400 transition-transform" />
                                    ) : (
                                        <ChevronRight size={18} className="text-gray-400 transition-transform" />
                                    )}
                                </div>
                            </button>

                            {/* Contenido del Grupo: Tabla de Módulos */}
                            {isExpanded && (
                                <div className="border-t border-slate-100 overflow-x-auto">
                                    <table className="w-full text-left text-xs sm:text-sm min-w-[620px]">
                                        <thead className="bg-slate-50/80 text-gray-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
                                            <tr>
                                                <th className="py-3 px-5 font-semibold">Módulo</th>
                                                <th className="py-3 px-5 font-semibold text-center w-36">Estado</th>
                                                <th className="py-3 px-5 font-semibold">Permisos</th>
                                                <th className="py-3 px-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {group.modules.map(module => {
                                                const ModIcon = module.icon;
                                                return (
                                                    <tr key={module.id} className="hover:bg-slate-50/50 transition-colors">
                                                        {/* Columna Módulo */}
                                                        <td className="py-3.5 px-5">
                                                            <div className="flex items-center gap-3.5">
                                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary_color flex items-center justify-center shrink-0 border border-blue-100">
                                                                    <ModIcon size={16} />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-gray-900 text-xs sm:text-sm">{module.title}</div>
                                                                    <div className="text-[11px] text-gray-400">{module.description}</div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Columna Estado */}
                                                        <td className="py-3.5 px-5 text-center">
                                                            {module.status === 'Habilitado' && (
                                                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                                                    Habilitado
                                                                </span>
                                                            )}
                                                            {module.status === 'Parcial' && (
                                                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                                                                    Parcial
                                                                </span>
                                                            )}
                                                            {module.status === 'Sin acceso' && (
                                                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                                                                    Sin acceso
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Columna Permisos */}
                                                        <td className="py-3.5 px-5">
                                                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                                {module.actions.map(action => (
                                                                    <span
                                                                        key={action.id}
                                                                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                                                                            action.enabled
                                                                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                                                                                : 'text-gray-400 bg-gray-50/50 border border-gray-200'
                                                                        }`}
                                                                    >
                                                                        {action.label}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>

                                                        {/* Columna Chevron */}
                                                        <td className="py-3.5 px-4 text-right">
                                                            <ChevronDown size={16} className="text-gray-300 inline-block" />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ViewPermissions;
